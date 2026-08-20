import mongoose from "mongoose";

const tenderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    refNo: String,
    department: String,
    state: String,
    city: String,
    category: String,
    value: String,
    valueAmount: Number,
    closingDate: Date,
    eligibility: String,
    documents: [String],
    description: String,
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["open", "closed", "cancelled"], default: "open" },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

tenderSchema.index({ title: "text", department: "text", category: "text" });

export default mongoose.model("Tender", tenderSchema);
