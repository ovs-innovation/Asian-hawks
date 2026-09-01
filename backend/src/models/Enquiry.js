import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    jobTitle: String,
    jobSlug: String,
    resumeUrl: String,
    resumeName: String,
    status: { type: String, default: "applied" },
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);
