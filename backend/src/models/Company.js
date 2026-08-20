import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logo: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    industry: String,
    size: String,
    website: String,
    location: String,
    city: String,
    country: String,
    about: String,
    founded: String,
    employees: Number,
    openPositions: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    featured: { type: Boolean, default: false },
    socials: {
      linkedin: String,
      twitter: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
