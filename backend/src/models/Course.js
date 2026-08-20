import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    institute: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    instituteName: String,
    category: String,
    duration: String,
    mode: String,
    price: Number,
    rating: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    placement: String,
    image: String,
    curriculum: [String],
    description: String,
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", category: "text" });

export default mongoose.model("Course", courseSchema);
