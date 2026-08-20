import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    type: { type: String, enum: ["category", "subcategory"], default: "category" },
    jobCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
