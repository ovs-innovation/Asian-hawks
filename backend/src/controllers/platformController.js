import slugify from "slugify";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import Category from "../models/Category.js";
import Blog from "../models/Blog.js";
import Enquiry from "../models/Enquiry.js";
import {
  Coupon,
  Invoice,
  Setting,
  Subscription,
  Taxonomy,
  Ticket,
  AuditLog,
} from "../models/Supporting.js";

const USER_PATCH_FIELDS = ["status", "role", "emailVerified", "company", "headline", "location"];
const COMPANY_PATCH_FIELDS = ["status", "verified", "featured", "industry", "location", "openPositions"];
const JOB_PATCH_FIELDS = [
  "title",
  "department",
  "category",
  "subCategory",
  "industry",
  "employmentType",
  "workplace",
  "experience",
  "minSalary",
  "maxSalary",
  "currency",
  "vacancies",
  "skills",
  "responsibilities",
  "requirements",
  "benefits",
  "qualifications",
  "languages",
  "location",
  "city",
  "country",
  "mapUrl",
  "deadline",
  "featured",
  "urgent",
  "status",
  "seoTitle",
  "metaDescription",
  "keywords",
  "attachments",
];

function escapeRegex(input = "") {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pickFields(source, allowed) {
  return Object.fromEntries(Object.entries(source || {}).filter(([key]) => allowed.includes(key)));
}

async function syncCategoryCounts() {
  const counts = await Job.aggregate([
    { $match: { category: { $exists: true, $ne: null, $ne: "" } } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((item) => [item._id, item.count]));
  const categories = await Category.find().select("_id name");
  if (!categories.length) return;
  await Category.bulkWrite(
    categories.map((category) => ({
      updateOne: {
        filter: { _id: category._id },
        update: { jobCount: countMap.get(category.name) || 0 },
      },
    }))
  );
}

export async function listCompanies(req, res) {
  const filter = { status: "approved" };
  if (req.query.industry) filter.industry = req.query.industry;
  if (req.query.q) filter.name = new RegExp(req.query.q, "i");
  const items = await Company.find(filter).sort({ featured: -1, openPositions: -1 });
  res.json({ items });
}

export async function getCompany(req, res) {
  const company = await Company.findOne({ slug: req.params.slug });
  if (!company) return res.status(404).json({ message: "Company not found" });
  const jobs = await Job.find({ company: company._id, status: "published" }).sort({ createdAt: -1 });
  res.json({ company, jobs });
}

export async function updateCompany(req, res) {
  const companyId = req.user.company?._id || req.user.company;
  const company = await Company.findById(companyId);
  if (!company) return res.status(404).json({ message: "Company not found" });
  Object.assign(company, req.body);
  await company.save();
  res.json({ company });
}

export async function stats(_req, res) {
  const [jobs, companies, candidates, hires] = await Promise.all([
    Job.countDocuments({ status: "published" }),
    Company.countDocuments({ status: "approved" }),
    User.countDocuments({ role: "candidate" }),
    Application.countDocuments({ status: { $in: ["hired", "joined"] } }),
  ]);
  res.json({ jobs, companies, candidates, hires, successRate: 97 });
}

export async function adminOverview(_req, res) {
  const [users, companies, jobs, applications, tickets] = await Promise.all([
    User.countDocuments(),
    Company.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    Ticket.countDocuments({ status: "open" }),
  ]);
  const byRole = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);
  res.json({ users, companies, jobs, applications, tickets, byRole });
}

export async function adminAnalytics(_req, res) {
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const [dailyJobsRaw, dailySignupsRaw] = await Promise.all([
    Job.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]),
    User.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]),
  ]);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(since);
    date.setDate(since.getDate() + index);
    return {
      key: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    };
  });

  const toMap = (items) =>
    new Map(items.map((item) => [`${item._id.year}-${item._id.month}-${item._id.day}`, item.count]));

  const jobsMap = toMap(dailyJobsRaw);
  const signupsMap = toMap(dailySignupsRaw);

  res.json({
    dailyJobs: days.map((day) => ({ date: day.date, count: jobsMap.get(day.key) || 0 })),
    dailySignups: days.map((day) => ({ date: day.date, count: signupsMap.get(day.key) || 0 })),
  });
}

export async function adminUsers(req, res) {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    const regex = new RegExp(escapeRegex(req.query.q), "i");
    filter.$or = [{ name: regex }, { email: regex }, { location: regex }];
  }
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const [items, total] = await Promise.all([
    User.find(filter).select("-password").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function patchUser(req, res) {
  const updates = pickFields(req.body, USER_PATCH_FIELDS);
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  await AuditLog.create({
    actor: req.user._id,
    action: "user.update",
    resource: String(user._id),
    meta: updates,
  });
  res.json({ user });
}

export async function adminCompanies(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.verified) filter.verified = req.query.verified === "true";
  if (req.query.q) {
    const regex = new RegExp(escapeRegex(req.query.q), "i");
    filter.$or = [{ name: regex }, { industry: regex }, { location: regex }];
  }
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const [items, total] = await Promise.all([
    Company.find(filter).populate("owner", "name email").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Company.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function patchCompanyAdmin(req, res) {
  const updates = pickFields(req.body, COMPANY_PATCH_FIELDS);
  const company = await Company.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!company) return res.status(404).json({ message: "Company not found" });
  await AuditLog.create({
    actor: req.user._id,
    action: "company.update",
    resource: String(company._id),
    meta: updates,
  });
  res.json({ company });
}

export async function adminJobs(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.company) filter.company = req.query.company;
  if (req.query.featured) filter.featured = req.query.featured === "true";
  if (req.query.urgent) filter.urgent = req.query.urgent === "true";
  if (req.query.location) filter.location = new RegExp(escapeRegex(req.query.location), "i");
  if (req.query.q) {
    const regex = new RegExp(escapeRegex(req.query.q), "i");
    filter.$or = [{ title: regex }, { category: regex }, { location: regex }, { skills: regex }];
  }
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const [items, total] = await Promise.all([
    Job.find(filter)
      .populate("company", "name slug logo status verified")
      .populate("postedBy", "name email role")
      .sort({ featured: -1, urgent: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Job.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function adminJobDetail(req, res) {
  const job = await Job.findById(req.params.id).populate("company", "name slug logo status verified").populate("postedBy", "name email role");
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json({ job });
}

function normalizeEmploymentType(value) {
  const raw = String(value || "Full Time").trim();
  const map = {
    "Full-time": "Full Time",
    "Full time": "Full Time",
    "Part-time": "Part Time",
    "Part time": "Part Time",
  };
  return map[raw] || raw;
}

async function resolveCompany(req) {
  let companyId = req.body.company;
  const companyName = String(req.body.companyName || "").trim();
  if (!companyId && companyName) {
    const slug = slugify(companyName, { lower: true, strict: true }) || `company-${Date.now().toString(36)}`;
    let found = await Company.findOne({ $or: [{ slug }, { name: new RegExp(`^${escapeRegex(companyName)}$`, "i") }] });
    if (!found) {
      found = await Company.create({
        name: companyName,
        slug,
        location: req.body.location || "",
        city: req.body.city || "",
        country: req.body.country || "",
        industry: req.body.industry || "",
        status: "approved",
        verified: true,
        owner: req.user._id,
      });
    }
    companyId = found._id;
  }
  if (!companyId) {
    const fallback =
      (await Company.findOne({ slug: "asian-hawks-manpower-services" }).select("_id")) ||
      (await Company.findOne().select("_id"));
    companyId = fallback?._id;
  }
  return companyId;
}

export async function createAdminJob(req, res) {
  const title = String(req.body.title || "").trim();
  const category = String(req.body.category || "").trim();
  if (!title) return res.status(400).json({ message: "Job title is required" });
  if (!category) return res.status(400).json({ message: "Category is required" });

  const companyId = await resolveCompany(req);
  if (!companyId) return res.status(400).json({ message: "Company is required" });

  const company = await Company.findById(companyId);
  if (!company) return res.status(404).json({ message: "Company not found" });

  const status = ["draft", "published", "paused", "expired"].includes(req.body.status)
    ? req.body.status
    : "published";
  const skills = Array.isArray(req.body.skills)
    ? req.body.skills
    : String(req.body.skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  const languages = Array.isArray(req.body.languages)
    ? req.body.languages
    : String(req.body.languages || "English, Hindi")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  const keywords = Array.isArray(req.body.keywords)
    ? req.body.keywords
    : String(req.body.keywords || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const base = slugify(title, { lower: true, strict: true }) || "role";
  const job = await Job.create({
    title,
    category,
    company: company._id,
    postedBy: req.user._id,
    slug: `${base}-${Date.now().toString(36)}`,
    department: req.body.department || category,
    subCategory: req.body.subCategory || "",
    industry: req.body.industry || company.industry || "Banking",
    employmentType: normalizeEmploymentType(req.body.employmentType),
    workplace: req.body.workplace || (String(req.body.location || "").toLowerCase().includes("remote") ? "Remote" : "Onsite"),
    experience: req.body.experience || "Freshers Welcome",
    minSalary: Number(req.body.minSalary) || 0,
    maxSalary: Number(req.body.maxSalary) || 0,
    currency: req.body.currency || "INR",
    vacancies: Number(req.body.vacancies) || 1,
    skills,
    languages,
    keywords,
    responsibilities: req.body.responsibilities || "",
    requirements: req.body.requirements || "",
    benefits: req.body.benefits || "",
    qualifications: req.body.qualifications || req.body.requirements || "",
    location: req.body.location || company.location || "Pan India",
    city: req.body.city || company.city || "",
    country: req.body.country || company.country || "India",
    mapUrl: req.body.mapUrl || "",
    featured: Boolean(req.body.featured),
    urgent: Boolean(req.body.urgent),
    seoTitle: req.body.seoTitle || `${title} at ${company.name}`,
    metaDescription: req.body.metaDescription || `${title} · ${req.body.location || company.location || "Pan India"}`,
    status,
    publishedAt: status === "published" ? new Date() : undefined,
  });

  if (status === "published") {
    await Company.findByIdAndUpdate(company._id, { $inc: { openPositions: 1 } });
  }
  await syncCategoryCounts();
  await AuditLog.create({
    actor: req.user._id,
    action: "job.create",
    resource: String(job._id),
    meta: { title, category, company: String(company._id), status },
  });
  res.status(201).json({ job });
}

export async function patchAdminJob(req, res) {
  const updates = pickFields(req.body, JOB_PATCH_FIELDS);
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  const prevStatus = job.status;
  if (updates.status === "published" && !job.publishedAt) {
    updates.publishedAt = new Date();
  }
  Object.assign(job, updates);
  await job.save();
  if (job.category !== undefined || prevStatus !== job.status) await syncCategoryCounts();
  await AuditLog.create({
    actor: req.user._id,
    action: "job.update",
    resource: String(job._id),
    meta: updates,
  });
  res.json({ job });
}

export async function deleteAdminJob(req, res) {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  await syncCategoryCounts();
  await AuditLog.create({
    actor: req.user._id,
    action: "job.delete",
    resource: String(req.params.id),
    meta: { title: job.title, company: job.company },
  });
  res.json({ ok: true });
}

export async function crudList(Model) {
  return async (_req, res) => {
    const items = await Model.find().sort({ createdAt: -1 });
    res.json({ items });
  };
}

export async function crudCreate(Model) {
  return async (req, res) => {
    const item = await Model.create(req.body);
    res.status(201).json({ item });
  };
}

export async function crudUpdate(Model) {
  return async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ item });
  };
}

export async function crudDelete(Model) {
  return async (req, res) => {
    await Model.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  };
}

export const categories = {
  list: async (_req, res) => {
    await syncCategoryCounts();
    res.json({ items: await Category.find().sort({ name: 1 }) });
  },
  create: async (req, res) => {
    const payload = {
      ...req.body,
      slug: req.body.slug || String(req.body.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    const item = await Category.create(payload);
    res.status(201).json({ item });
  },
  update: async (req, res) => {
    const payload = {
      ...req.body,
      ...(req.body.name ? { slug: req.body.slug || String(req.body.name).toLowerCase().replace(/[^a-z0-9]+/g, "-") } : {}),
    };
    res.json({ item: await Category.findByIdAndUpdate(req.params.id, payload, { new: true }) });
  },
  remove: async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  },
};

export const blogs = {
  list: async (req, res) => {
    const filter = req.user ? {} : { published: true };
    res.json({ items: await Blog.find(req.query.admin ? {} : filter).sort({ createdAt: -1 }) });
  },
  get: async (req, res) => {
    const item = await Blog.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ message: "Article not found" });
    res.json({ item });
  },
  create: async (req, res) => res.status(201).json({ item: await Blog.create(req.body) }),
  update: async (req, res) =>
    res.json({ item: await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true }) }),
};

export async function taxonomies(req, res) {
  const filter = req.query.type ? { type: req.query.type } : {};
  res.json({ items: await Taxonomy.find(filter).sort({ name: 1 }) });
}

export async function createTaxonomy(req, res) {
  res.status(201).json({ item: await Taxonomy.create(req.body) });
}

export async function updateTaxonomy(req, res) {
  const item = await Taxonomy.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ item });
}

export async function deleteTaxonomy(req, res) {
  await Taxonomy.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}

export async function adminAudit(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 25);
  const filter = {};
  if (req.query.action) filter.action = req.query.action;
  const [items, total] = await Promise.all([
    AuditLog.find(filter).populate("actor", "name email role").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    AuditLog.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function settings(req, res) {
  if (req.method === "GET") {
    const items = await Setting.find();
    return res.json({
      items,
      values: Object.fromEntries(items.map((item) => [item.key, item.value])),
    });
  }

  if (req.body?.key) {
    const item = await Setting.findOneAndUpdate(
      { key: req.body.key },
      { value: req.body.value },
      { upsert: true, new: true }
    );
    return res.json({ item });
  }

  const entries = Object.entries(req.body || {});
  if (!entries.length) return res.status(400).json({ message: "No settings provided" });

  await Setting.bulkWrite(
    entries.map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { value },
        upsert: true,
      },
    }))
  );

  const items = await Setting.find();
  res.json({
    items,
    values: Object.fromEntries(items.map((item) => [item.key, item.value])),
  });
}

export async function tickets(req, res) {
  if (req.method === "POST") {
    const item = await Ticket.create({ ...req.body, user: req.user._id });
    return res.status(201).json({ item });
  }
  const filter = req.user.role === "super_admin" || req.user.role === "moderator" ? {} : { user: req.user._id };
  res.json({ items: await Ticket.find(filter).populate("user", "name email").sort({ createdAt: -1 }) });
}

export async function billing(_req, res) {
  const [subs, invoices, coupons] = await Promise.all([
    Subscription.find().populate("company", "name"),
    Invoice.find().populate("company", "name"),
    Coupon.find(),
  ]);
  res.json({ subscriptions: subs, invoices, coupons });
}

export async function recruiterAnalytics(req, res) {
  const companyId = req.user.company?._id || req.user.company;
  const [jobs, applications, hired] = await Promise.all([
    Job.countDocuments({ company: companyId }),
    Application.countDocuments({ company: companyId }),
    Application.countDocuments({ company: companyId, status: { $in: ["hired", "joined"] } }),
  ]);
  const pipeline = await Application.aggregate([
    { $match: { company: companyId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  res.json({ jobs, applications, hired, pipeline });
}

export async function adminApplications(req, res) {
  const items = await Enquiry.find().sort({ createdAt: -1 }).limit(200);
  res.json({ items, total: items.length });
}
