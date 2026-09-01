import Course from "../models/Course.js";
import slugify from "slugify";

const FORMAT_MODE = {
  recorded: "Recorded",
  live_online: "Live online",
  classroom: "Classroom",
  hybrid: "Hybrid (live + recorded)",
};

function uniqueSlug(title) {
  const base = slugify(String(title || "course"), { lower: true, strict: true }) || "course";
  return `${base}-${Date.now().toString(36)}`;
}

function normalizeBody(body = {}, { keepSlug = false } = {}) {
  const classFormat = ["recorded", "live_online", "classroom", "hybrid"].includes(body.classFormat)
    ? body.classFormat
    : "live_online";
  const modules = Array.isArray(body.modules)
    ? body.modules.map((m) => String(m).trim()).filter(Boolean)
    : String(body.modules || body.curriculum || "")
        .split("\n")
        .map((m) => m.trim())
        .filter(Boolean);

  const payload = {
    title: String(body.title || "").trim(),
    instituteName: String(body.instituteName || "Asian Hawks Training").trim(),
    category: String(body.category || "").trim(),
    duration: String(body.duration || "").trim(),
    classFormat,
    mode: body.mode ? String(body.mode).trim() : FORMAT_MODE[classFormat],
    meetingLink: String(body.meetingLink || "").trim(),
    recordingUrl: String(body.recordingUrl || "").trim(),
    schedule: String(body.schedule || "").trim(),
    classroomLocation: String(body.classroomLocation || "").trim(),
    batchStart: String(body.batchStart || "").trim(),
    price: Number(body.price || 0),
    placement: String(body.placement || "").trim(),
    image: String(body.image || "").trim(),
    description: String(body.description || "").trim(),
    modules,
    curriculum: modules,
    featured: Boolean(body.featured),
    status: body.status === "published" ? "published" : "draft",
  };

  if (!keepSlug && payload.title) payload.slug = uniqueSlug(payload.title);
  return payload;
}

export async function listCourses(req, res) {
  const { keyword, category, classFormat } = req.query;
  const filter = { status: "published" };
  if (category) filter.category = new RegExp(String(category), "i");
  if (classFormat) filter.classFormat = classFormat;
  if (keyword) {
    const q = new RegExp(String(keyword), "i");
    filter.$or = [{ title: q }, { category: q }, { description: q }, { placement: q }, { mode: q }];
  }
  const items = await Course.find(filter).sort({ featured: -1, createdAt: -1 }).limit(80);
  res.json({ items });
}

export async function getCourse(req, res) {
  const item = await Course.findOne({ slug: req.params.slug, status: "published" });
  if (!item) return res.status(404).json({ message: "Course not found" });
  res.json({ item });
}

export async function adminListCourses(req, res) {
  const { status, classFormat, q } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (classFormat) filter.classFormat = classFormat;
  if (q) {
    const rx = new RegExp(String(q), "i");
    filter.$or = [{ title: rx }, { category: rx }];
  }
  const items = await Course.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json({ items, total: items.length });
}

export async function adminGetCourse(req, res) {
  const item = await Course.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Course not found" });
  res.json({ item });
}

export async function adminCreateCourse(req, res) {
  if (!req.body?.title) return res.status(400).json({ message: "Title is required" });
  const item = await Course.create(normalizeBody(req.body));
  res.status(201).json({ item });
}

export async function adminUpdateCourse(req, res) {
  const existing = await Course.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: "Course not found" });
  const next = normalizeBody(req.body, { keepSlug: true });
  delete next.slug;
  Object.assign(existing, next);
  await existing.save();
  res.json({ item: existing });
}

export async function adminDeleteCourse(req, res) {
  const item = await Course.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Course not found" });
  res.json({ ok: true });
}
