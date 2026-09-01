"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { inputClass, labelClass, textareaClass } from "@/lib/styles";

export type CourseRecord = {
  _id?: string;
  title?: string;
  instituteName?: string;
  category?: string;
  duration?: string;
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
  featured?: boolean;
  status?: "draft" | "published";
};

const FORMATS = [
  { id: "live_online", label: "Live online" },
  { id: "recorded", label: "Recorded" },
  { id: "hybrid", label: "Hybrid (live + recorded)" },
  { id: "classroom", label: "Classroom" },
] as const;

type FormState = {
  title: string;
  instituteName: string;
  category: string;
  duration: string;
  classFormat: CourseRecord["classFormat"];
  meetingLink: string;
  recordingUrl: string;
  schedule: string;
  classroomLocation: string;
  batchStart: string;
  price: number;
  placement: string;
  image: string;
  description: string;
  modules: string;
  featured: boolean;
};

const empty: FormState = {
  title: "",
  instituteName: "Asian Hawks Training",
  category: "Banking Operations",
  duration: "",
  classFormat: "live_online",
  meetingLink: "",
  recordingUrl: "",
  schedule: "",
  classroomLocation: "",
  batchStart: "",
  price: 0,
  placement: "",
  image: "/courses/bank-branch.jpg",
  description: "",
  modules: "",
  featured: false,
};

export function CourseForm({ course }: { course?: CourseRecord }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState<"draft" | "published" | null>(null);

  useEffect(() => {
    if (!course) return;
    setForm({
      title: course.title || "",
      instituteName: course.instituteName || "Asian Hawks Training",
      category: course.category || "",
      duration: course.duration || "",
      classFormat: course.classFormat || "live_online",
      meetingLink: course.meetingLink || "",
      recordingUrl: course.recordingUrl || "",
      schedule: course.schedule || "",
      classroomLocation: course.classroomLocation || "",
      batchStart: course.batchStart || "",
      price: course.price || 0,
      placement: course.placement || "",
      image: course.image || "",
      description: course.description || "",
      modules: (course.modules || []).join("\n"),
      featured: Boolean(course.featured),
    });
  }, [course]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save(status: "draft" | "published") {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(status);
    const payload = { ...form, status };
    try {
      if (course?._id) {
        await api(`/admin/courses/${course._id}`, { method: "PATCH", body: JSON.stringify(payload) });
        toast.success(status === "published" ? "Course published" : "Draft saved");
      } else {
        await api("/admin/courses", { method: "POST", body: JSON.stringify(payload) });
        toast.success(status === "published" ? "Course published" : "Draft created");
      }
      router.push("/training");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save course");
    } finally {
      setSaving(null);
    }
  }

  const showLive = form.classFormat === "live_online" || form.classFormat === "hybrid";
  const showRecorded = form.classFormat === "recorded" || form.classFormat === "hybrid";
  const showClassroom = form.classFormat === "classroom" || form.classFormat === "hybrid";

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
        <h3 className="text-sm font-semibold text-[#111827]">Course details</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className={labelClass}>Title</span>
            <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} />
          </label>
          <label>
            <span className={labelClass}>Category</span>
            <input className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value)} />
          </label>
          <label>
            <span className={labelClass}>Duration</span>
            <input className={inputClass} placeholder="e.g. 3 months" value={form.duration} onChange={(e) => set("duration", e.target.value)} />
          </label>
          <label>
            <span className={labelClass}>Fee (INR)</span>
            <input type="number" className={inputClass} value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
          </label>
          <label>
            <span className={labelClass}>Placement / target roles</span>
            <input className={inputClass} value={form.placement} onChange={(e) => set("placement", e.target.value)} />
          </label>
          <label>
            <span className={labelClass}>Institute name</span>
            <input className={inputClass} value={form.instituteName} onChange={(e) => set("instituteName", e.target.value)} />
          </label>
          <label>
            <span className={labelClass}>Batch start</span>
            <input className={inputClass} placeholder="e.g. 15 Sep 2026" value={form.batchStart} onChange={(e) => set("batchStart", e.target.value)} />
          </label>
          <label>
            <span className={labelClass}>Cover image URL</span>
            <input className={inputClass} value={form.image} onChange={(e) => set("image", e.target.value)} />
          </label>
          <label className="flex items-center gap-2 pt-7 text-sm text-[#374151]">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
            Featured on training page
          </label>
        </div>
        <label className="mt-4 block">
          <span className={labelClass}>Description</span>
          <textarea className={textareaClass} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </label>
        <label className="mt-4 block">
          <span className={labelClass}>Modules (one per line)</span>
          <textarea className={textareaClass} value={form.modules} onChange={(e) => set("modules", e.target.value)} />
        </label>
      </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
        <h3 className="text-sm font-semibold text-[#111827]">Class type</h3>
        <p className="mt-1 text-sm text-[#6b7280]">Choose recorded lessons, live online sessions, classroom, or a mix.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {FORMATS.map((item) => (
            <label
              key={item.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                form.classFormat === item.id ? "border-[#0f5daa] bg-[#eaf3fb] text-[#0f5daa]" : "border-[#e5e7eb] text-[#374151]"
              }`}
            >
              <input
                type="radio"
                name="classFormat"
                checked={form.classFormat === item.id}
                onChange={() => set("classFormat", item.id)}
              />
              {item.label}
            </label>
          ))}
        </div>
        <label className="mt-4 block">
          <span className={labelClass}>Schedule</span>
          <input className={inputClass} placeholder="e.g. Mon–Fri 7:00 PM" value={form.schedule} onChange={(e) => set("schedule", e.target.value)} />
        </label>
        {showLive ? (
          <label className="mt-4 block">
            <span className={labelClass}>Live class link (Zoom / Meet)</span>
            <input className={inputClass} placeholder="https://" value={form.meetingLink} onChange={(e) => set("meetingLink", e.target.value)} />
          </label>
        ) : null}
        {showRecorded ? (
          <label className="mt-4 block">
            <span className={labelClass}>Recorded class URL (YouTube / Vimeo / video file)</span>
            <input className={inputClass} placeholder="https://" value={form.recordingUrl} onChange={(e) => set("recordingUrl", e.target.value)} />
          </label>
        ) : null}
        {showClassroom ? (
          <label className="mt-4 block">
            <span className={labelClass}>Classroom location</span>
            <input className={inputClass} value={form.classroomLocation} onChange={(e) => set("classroomLocation", e.target.value)} />
          </label>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={Boolean(saving)}
          onClick={() => save("draft")}
          className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-sm font-semibold text-[#374151] disabled:opacity-50"
        >
          {saving === "draft" ? "Saving..." : "Save draft"}
        </button>
        <button
          type="button"
          disabled={Boolean(saving)}
          onClick={() => save("published")}
          className="rounded-xl bg-[#0f5daa] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c4d8c] disabled:opacity-50"
        >
          {saving === "published" ? "Publishing..." : "Publish course"}
        </button>
      </div>
    </form>
  );
}
