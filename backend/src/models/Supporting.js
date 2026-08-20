import mongoose from "mongoose";

export const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      title: String,
      body: String,
      read: { type: Boolean, default: false },
      link: String,
    },
    { timestamps: true }
  )
);

export const Message = mongoose.model(
  "Message",
  new mongoose.Schema(
    {
      threadId: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
      body: String,
      read: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

export const Interview = mongoose.model(
  "Interview",
  new mongoose.Schema(
    {
      application: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
      job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
      candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      scheduledAt: Date,
      mode: { type: String, default: "Video" },
      location: String,
      notes: String,
      status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
    },
    { timestamps: true }
  )
);

export const Resume = mongoose.model(
  "Resume",
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
      headline: String,
      summary: String,
      experience: [
        { company: String, title: String, start: String, end: String, description: String, current: Boolean },
      ],
      education: [{ school: String, degree: String, field: String, year: String }],
      skills: [String],
      certificates: [{ name: String, issuer: String, year: String }],
      projects: [{ name: String, url: String, description: String }],
      achievements: [String],
      portfolioUrl: String,
      fileUrl: String,
    },
    { timestamps: true }
  )
);

export const Ticket = mongoose.model(
  "Ticket",
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      subject: String,
      message: String,
      status: { type: String, enum: ["open", "pending", "closed"], default: "open" },
    },
    { timestamps: true }
  )
);

export const AuditLog = mongoose.model(
  "AuditLog",
  new mongoose.Schema(
    {
      actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      action: String,
      resource: String,
      meta: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
  )
);

export const Subscription = mongoose.model(
  "Subscription",
  new mongoose.Schema(
    {
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      plan: { type: String, enum: ["starter", "growth", "enterprise"], default: "starter" },
      status: { type: String, enum: ["active", "canceled", "past_due"], default: "active" },
      amount: Number,
      renewsAt: Date,
    },
    { timestamps: true }
  )
);

export const Invoice = mongoose.model(
  "Invoice",
  new mongoose.Schema(
    {
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      number: String,
      amount: Number,
      status: { type: String, enum: ["paid", "open"], default: "paid" },
      issuedAt: Date,
    },
    { timestamps: true }
  )
);

export const Coupon = mongoose.model(
  "Coupon",
  new mongoose.Schema(
    {
      code: { type: String, unique: true },
      discount: Number,
      active: { type: Boolean, default: true },
      expiresAt: Date,
    },
    { timestamps: true }
  )
);

export const Setting = mongoose.model(
  "Setting",
  new mongoose.Schema(
    {
      key: { type: String, unique: true },
      value: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
  )
);

export const Taxonomy = mongoose.model(
  "Taxonomy",
  new mongoose.Schema(
    {
      type: {
        type: String,
        enum: [
          "skill",
          "location",
          "country",
          "city",
          "industry",
          "employment_type",
          "experience_level",
          "salary_range",
        ],
      },
      name: String,
      meta: mongoose.Schema.Types.Mixed,
    },
    { timestamps: true }
  )
);
