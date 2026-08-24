import mongoose from "mongoose";
import slugify from "slugify";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";

function jobFilter(query) {
  const filter = { status: query.status || "published" };
  if (query.q) filter.$text = { $search: query.q };
  if (query.keyword) filter.title = new RegExp(query.keyword, "i");
  if (query.category) filter.category = query.category;
  if (query.location) filter.location = new RegExp(query.location, "i");
  if (query.workplace) filter.workplace = query.workplace;
  if (query.employmentType) filter.employmentType = query.employmentType;
  if (query.industry) filter.industry = query.industry;
  if (query.experience) filter.experience = query.experience;
  if (query.company) filter.company = query.company;
  if (query.featured === "true") filter.featured = true;
  if (query.urgent === "true") filter.urgent = true;
  if (query.skill) filter.skills = query.skill;
  if (query.minSalary) filter.maxSalary = { $gte: Number(query.minSalary) };
  if (query.posted) {
    const days = Number(query.posted);
    filter.createdAt = { $gte: new Date(Date.now() - days * 86400000) };
  }
  return filter;
}

export async function listJobs(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 12);
  const filter = jobFilter(req.query);
  const sort =
    req.query.sort === "salary"
      ? { maxSalary: -1 }
      : req.query.sort === "oldest"
        ? { publishedAt: 1, createdAt: 1 }
        : { publishedAt: -1, createdAt: -1 };

  const [items, total] = await Promise.all([
    Job.find(filter)
      .populate("company", "name slug logo industry location verified employees")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Job.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function getJob(req, res) {
  const { slug } = req.params;
  const filter = mongoose.isValidObjectId(slug) ? { $or: [{ slug }, { _id: slug }] } : { slug };
  const job = await Job.findOne(filter).populate(
    "company"
  );
  if (!job) return res.status(404).json({ message: "Job not found" });
  job.views += 1;
  await job.save();
  res.json({ job });
}

export async function createJob(req, res) {
  const companyId = req.user.company?._id || req.user.company || req.body.company;
  if (!companyId) return res.status(400).json({ message: "Recruiter must belong to a company" });
  const base = slugify(req.body.title || "role", { lower: true, strict: true });
  const status = req.body.status || "draft";
  const job = await Job.create({
    ...req.body,
    company: companyId,
    postedBy: req.user._id,
    slug: `${base}-${Date.now().toString(36)}`,
    status,
    publishedAt: status === "published" ? new Date() : undefined,
  });
  await Company.findByIdAndUpdate(companyId, { $inc: { openPositions: job.status === "published" ? 1 : 0 } });
  res.status(201).json({ job });
}

export async function updateJob(req, res) {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  const isOwner = String(job.postedBy) === String(req.user._id) || req.user.role === "super_admin";
  if (!isOwner && req.user.role !== "hr_manager") {
    return res.status(403).json({ message: "Not allowed to edit this job" });
  }
  const nextStatus = req.body.status || job.status;
  if (nextStatus === "published" && !job.publishedAt) {
    req.body.publishedAt = new Date();
  }
  Object.assign(job, req.body);
  await job.save();
  res.json({ job });
}

export async function duplicateJob(req, res) {
  const job = await Job.findById(req.params.id).lean();
  if (!job) return res.status(404).json({ message: "Job not found" });
  delete job._id;
  const copy = await Job.create({
    ...job,
    title: `${job.title} (Copy)`,
    slug: `${job.slug}-copy-${Date.now().toString(36)}`,
    status: "draft",
    applicationsCount: 0,
    views: 0,
    postedBy: req.user._id,
  });
  res.status(201).json({ job: copy });
}

export async function myJobs(req, res) {
  const companyId = req.user.company?._id || req.user.company;
  const filter = { company: companyId };
  if (req.query.status) filter.status = req.query.status;
  const items = await Job.find(filter).sort({ updatedAt: -1 });
  res.json({ items });
}

export async function applyToJob(req, res) {
  const job = await Job.findById(req.params.id);
  if (!job || job.status !== "published") return res.status(404).json({ message: "Job is not open" });
  const existing = await Application.findOne({ job: job._id, candidate: req.user._id });
  if (existing) return res.status(409).json({ message: "You have already applied" });
  const application = await Application.create({
    job: job._id,
    candidate: req.user._id,
    company: job.company,
    resumeUrl: req.body.resumeUrl,
    coverLetter: req.body.coverLetter,
    answers: req.body.answers || [],
  });
  job.applicationsCount += 1;
  await job.save();
  res.status(201).json({ application });
}

export async function saveJob(req, res) {
  const id = req.params.id;
  const has = req.user.savedJobs.some((j) => String(j) === id);
  if (has) req.user.savedJobs.pull(id);
  else req.user.savedJobs.addToSet(id);
  await req.user.save();
  res.json({ saved: !has, savedJobs: req.user.savedJobs });
}
