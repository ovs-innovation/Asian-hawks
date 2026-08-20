import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["super_admin", "recruiter", "hr_manager", "company", "candidate", "moderator"],
      default: "candidate",
    },
    avatar: { type: String, default: "" },
    phone: String,
    headline: String,
    location: String,
    city: String,
    country: String,
    bio: String,
    skills: [String],
    website: String,
    linkedin: String,
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    status: { type: String, enum: ["active", "pending", "suspended"], default: "active" },
    emailVerified: { type: Boolean, default: true },
    resetToken: String,
    resetTokenExpires: Date,
    lastLoginAt: Date,
    profileCompletion: { type: Number, default: 20 },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    privacy: {
      showProfile: { type: Boolean, default: true },
      showSalary: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
