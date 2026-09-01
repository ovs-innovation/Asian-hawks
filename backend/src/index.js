import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import dns from "dns";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import routes from "./routes/index.js";
import { protect } from "./middleware/auth.js";
import Enquiry from "./models/Enquiry.js";
import Job from "./models/Job.js";
import Application from "./models/Application.js";
import User from "./models/User.js";
import { Notification } from "./models/Supporting.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

try {
  dns.setServers?.(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  dns.setDefaultResultOrder?.("ipv4first");
} catch {
  // Ignore DNS config fallback errors
}

const resumeDir = path.join(__dirname, "..", "uploads", "resumes");
fs.mkdirSync(resumeDir, { recursive: true });

const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
const allowedOrigins = [
  ...(process.env.CLIENT_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean),
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : true, credentials: true }));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use("/api", limiter);

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, resumeDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, "_");
    cb(null, `${Date.now()}_${safeBase}${ext}`);
  },
});
const resumeUpload = multer({ storage: resumeStorage, limits: { fileSize: 10 * 1024 * 1024 } });

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "northline-api" }));
app.use("/api", routes);

app.post("/api/apply", resumeUpload.single("resume"), async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const phone = String(req.body.phone || "").trim();
  const message = String(req.body.message || "").trim();
  const jobTitle = String(req.body.jobTitle || "").trim();
  const jobSlug = String(req.body.jobSlug || "").trim();
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email and mobile number are required" });
  }
  if (!req.file) return res.status(400).json({ message: "Please attach your resume (PDF or Word)" });

  const resumeUrl = `/uploads/resumes/${req.file.filename}`;

  // 1. Find target job
  let job = null;
  if (jobSlug) {
    job = await Job.findOne({ slug: jobSlug });
  }

  // 2. Find candidate user account if exists
  const candidateUser = await User.findOne({ email });

  // 3. Create Enquiry record
  await Enquiry.create({
    name,
    email,
    phone,
    message: message || `Application for ${jobTitle || "open role"}`,
    jobTitle: jobTitle || job?.title,
    jobSlug: jobSlug || job?.slug,
    resumeUrl,
    resumeName: req.file.originalname,
  });

  // 4. Create Application record if job exists
  if (job) {
    const existingApp = candidateUser ? await Application.findOne({ job: job._id, candidate: candidateUser._id }) : null;
    if (!existingApp) {
      await Application.create({
        job: job._id,
        candidate: candidateUser?._id,
        company: job.company,
        resumeUrl,
        coverLetter: message,
        status: "applied",
      });
      job.applicationsCount += 1;
      await job.save();
    }
  }

  // 5. Create Notification for candidate if user account exists
  if (candidateUser) {
    await Notification.create({
      user: candidateUser._id,
      title: "Application Submitted",
      body: `Your application for ${jobTitle || job?.title || "job opening"} has been received.`,
      link: "/candidate/applied",
    });
  }

  res.status(201).json({ ok: true, resumeUrl, message: "Application received. Our HR team will contact you." });
});

app.post("/api/upload", protect, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file provided" });
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    return res.json({ url: dataUrl, storage: "inline" });
  }
  const uploaded = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "northline" }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(req.file.buffer);
  });
  res.json({ url: uploaded.secure_url, storage: "cloudinary" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Unexpected server error" });
});

const port = Number(process.env.PORT || 5000);
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is missing from backend/.env");
  process.exit(1);
}

mongoose.set("strictQuery", true);

app.listen(port, "0.0.0.0", () => {
  console.log(`Northline API running on http://127.0.0.1:${port}`);
});

async function connectMongo(attempt = 1) {
  try {
    await mongoose.connect(uri, {
      dbName: "jobportal",
      serverSelectionTimeoutMS: 20000,
    });
    console.log("Connected to MongoDB Atlas (jobportal)");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`MongoDB connection failed (attempt ${attempt}):`, message);
    setTimeout(() => connectMongo(attempt + 1), Math.min(5000 * attempt, 30000));
  }
}

connectMongo();
