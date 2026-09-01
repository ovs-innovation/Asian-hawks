import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resumeDir = path.join(__dirname, "..", "..", "uploads", "resumes");
fs.mkdirSync(resumeDir, { recursive: true });

const resumeStorage = multer.diskStorage({
  destination: resumeDir,
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname || "") || ".pdf";
    const base = path.basename(file.originalname || "resume", ext);
    const safeBase = base.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50);
    cb(null, `${Date.now()}_${safeBase}${ext}`);
  },
});

export const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const ok =
      /pdf|msword|officedocument.wordprocessingml.document/i.test(file.mimetype) ||
      /\.(pdf|doc|docx)$/i.test(file.originalname);
    if (!ok) return cb(new Error("Upload a PDF or Word (DOC/DOCX) resume file"));
    cb(null, true);
  },
});
