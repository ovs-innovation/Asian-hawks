import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    department: String,
    category: String,
    subCategory: String,
    industry: String,
    employmentType: {
      type: String,
      enum: ["Full Time", "Part Time", "Contract", "Internship", "Freelance"],
      default: "Full Time",
    },
    workplace: { type: String, enum: ["Remote", "Hybrid", "Onsite"], default: "Onsite" },
    experience: String,
    minSalary: Number,
    maxSalary: Number,
    currency: { type: String, default: "USD" },
    vacancies: { type: Number, default: 1 },
    skills: [String],
    responsibilities: String,
    requirements: String,
    benefits: String,
    qualifications: String,
    languages: [String],
    location: String,
    city: String,
    country: String,
    mapUrl: String,
    deadline: Date,
    featured: { type: Boolean, default: false },
    urgent: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "paused", "expired"],
      default: "draft",
    },
    publishedAt: Date,
    seoTitle: String,
    metaDescription: String,
    keywords: [String],
    attachments: [String],
    applicationsCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    screeningQuestions: [{ question: String, required: Boolean }],
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", location: "text", skills: "text" });

export default mongoose.model("Job", jobSchema);
