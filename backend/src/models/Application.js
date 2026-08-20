import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    resumeUrl: String,
    coverLetter: String,
    answers: [{ question: String, answer: String }],
    status: {
      type: String,
      enum: ["applied", "reviewing", "shortlisted", "interview", "offer", "hired", "rejected", "joined"],
      default: "applied",
    },
    notes: String,
    offerLetterUrl: String,
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
