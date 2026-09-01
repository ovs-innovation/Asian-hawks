export type TrainingCourse = {
  _id: string;
  title: string;
  slug: string;
  instituteName?: string;
  institute?: string;
  category?: string;
  duration?: string;
  mode?: string;
  classFormat?: "recorded" | "live_online" | "classroom" | "hybrid";
  meetingLink?: string;
  recordingUrl?: string;
  schedule?: string;
  classroomLocation?: string;
  batchStart?: string;
  price?: number;
  placement?: string;
  image?: string;
  description?: string;
  modules?: string[];
  curriculum?: string[];
  featured?: boolean;
  status?: string;
};

export const CLASS_FORMAT_LABEL: Record<string, string> = {
  recorded: "Recorded",
  live_online: "Live online",
  classroom: "Classroom",
  hybrid: "Hybrid (live + recorded)",
};

export function courseModeLabel(course: Pick<TrainingCourse, "classFormat" | "mode">) {
  if (course.classFormat && CLASS_FORMAT_LABEL[course.classFormat]) return CLASS_FORMAT_LABEL[course.classFormat];
  return course.mode || "Training";
}

export function youtubeEmbedUrl(url?: string) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
