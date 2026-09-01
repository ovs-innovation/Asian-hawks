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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

try {
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
const localhostOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || localhostOriginPattern.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60_000, max: 300 }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
const resumeUpload = multer({
  storage: multer.diskStorage({
    destination: resumeDir,
    filename(_req, file, cb) {
      const safe = String(file.originalname || "resume").replace(/[^\w.\-]+/g, "_");
      cb(null, `${Date.now()}-${safe}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok = /pdf|msword|officedocument.wordprocessingml.document/i.test(file.mimetype) || /\.(pdf|doc|docx)$/i.test(file.originalname);
    if (!ok) return cb(new Error("Upload a PDF or Word resume"));
    cb(null, true);
  },
});

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

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
  await Enquiry.create({
    name,
    email,
    phone,
    message: message || `Application for ${jobTitle || "open role"}`,
    jobTitle,
    jobSlug,
    resumeUrl,
    resumeName: req.file.originalname,
  });
  if (jobSlug) {
    await Job.findOneAndUpdate({ slug: jobSlug }, { $inc: { applicationsCount: 1 } });
  }
  res.status(201).json({ ok: true, message: "Application received. Our HR team will contact you." });
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
