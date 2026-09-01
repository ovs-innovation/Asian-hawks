import mongoose from "mongoose";

const CLASS_FORMATS = ["recorded", "live_online", "classroom", "hybrid"];

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    institute: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    instituteName: { type: String, default: "Asian Hawks Training" },
    category: String,
    duration: String,
    mode: String,
    classFormat: { type: String, enum: CLASS_FORMATS, default: "live_online" },
    meetingLink: String,
    recordingUrl: String,
    schedule: String,
    classroomLocation: String,
    batchStart: String,
    price: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    placement: String,
    image: String,
    curriculum: [String],
    modules: [String],
    description: String,
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", category: "text", description: "text" });

export const COURSE_CLASS_FORMATS = CLASS_FORMATS;
export default mongoose.model("Course", courseSchema);
