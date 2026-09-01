import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock, GraduationCap, MapPin, Mail, Wallet, Video, MonitorPlay } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { SafeImage } from "@/components/ui/safe-image";
import { API_URL } from "@/lib/utils";
import { CLASS_FORMAT_LABEL, courseModeLabel, youtubeEmbedUrl, type TrainingCourse } from "@/lib/courses";

async function fetchCourse(slug: string): Promise<TrainingCourse | null> {
  try {
    const res = await fetch(`${API_URL}/courses/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.item ?? null;
  } catch {
    return null;
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await fetchCourse(slug);
  if (!course) notFound();

  const modules = course.modules?.length ? course.modules : course.curriculum || [];
  const mode = courseModeLabel(course);
  const embed = youtubeEmbedUrl(course.recordingUrl);
  const showLive = course.classFormat === "live_online" || course.classFormat === "hybrid";
  const showRecorded = course.classFormat === "recorded" || course.classFormat === "hybrid";

  return (
    <section className="bg-[#f7f9fc] px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto grid max-w-[1180px] gap-5 lg:grid-cols-[1fr_360px]">
        <article className="rounded-xl border border-[#e5e7eb] bg-white p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)] sm:p-6 md:p-8">
          <p className="text-xs text-[#64748b]">
            <Link href="/training" className="hover:text-[#0f5daa]">
              Training
            </Link>{" "}
            / {course.instituteName || "Asian Hawks Training"}
          </p>
          <h1 className="mt-3 text-[22px] font-bold leading-tight text-[#111827] sm:text-[26px]">{course.title}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[15px] font-medium text-[#334155]">
            {course.instituteName || "Asian Hawks Training"}
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#0f5daa]">
              <BadgeCheck size={12} /> {CLASS_FORMAT_LABEL[course.classFormat || ""] || mode}
            </span>
          </p>
          <SafeImage src={course.image} alt={course.title} className="mt-5 h-48 w-full rounded-xl object-cover sm:h-56" />
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#64748b]">
            <span className="inline-flex items-center gap-1.5"><GraduationCap size={15} /> {mode}</span>
            <span className="inline-flex items-center gap-1.5"><Wallet size={15} /> ₹{(course.price || 0).toLocaleString("en-IN")}</span>
            {course.duration ? <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {course.duration}</span> : null}
            {course.placement ? <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {course.placement}</span> : null}
          </div>
          {(course.schedule || course.batchStart || course.classroomLocation) ? (
            <div className="mt-5 rounded-xl bg-[#f8fafc] px-4 py-3 text-sm text-[#445578]">
              {course.batchStart ? <p><span className="font-semibold text-[#111827]">Batch start:</span> {course.batchStart}</p> : null}
              {course.schedule ? <p className="mt-1"><span className="font-semibold text-[#111827]">Schedule:</span> {course.schedule}</p> : null}
              {course.classroomLocation ? <p className="mt-1"><span className="font-semibold text-[#111827]">Classroom:</span> {course.classroomLocation}</p> : null}
            </div>
          ) : null}

          {showLive && course.meetingLink ? (
            <div className="mt-5 rounded-xl border border-[#c7d7ea] bg-[#eaf3fb] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-[#03224c]">
                <Video size={16} /> Live online class
              </p>
              <a
                href={course.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex h-10 items-center rounded-lg bg-[#0f5daa] px-4 text-sm font-semibold text-white"
              >
                Join live class
              </a>
            </div>
          ) : null}

          {showRecorded && (embed || course.recordingUrl) ? (
            <div className="mt-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#111827]">
                <MonitorPlay size={16} /> Recorded class
              </p>
              {embed ? (
                <iframe
                  title={`${course.title} recording`}
                  src={embed}
                  className="aspect-video w-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <a href={course.recordingUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#0f5daa]">
                  Open recorded class
                </a>
              )}
            </div>
          ) : null}

          <hr className="my-6 border-[#e5e7eb]" />
          <h2 className="text-base font-bold text-[#111827]">Course description</h2>
          <p className="mt-3 text-sm leading-7 text-[#445578]">{course.description}</p>
          {modules.length ? (
            <>
              <h2 className="mt-6 text-base font-bold text-[#111827]">What you will cover</h2>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-[#445578]">
                {modules.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}
          {course.category ? (
            <>
              <h2 className="mt-6 text-base font-bold text-[#111827]">Category</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-medium text-[#0f5daa]">{course.category}</span>
              </div>
            </>
          ) : null}
          <div className="mt-8 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4 text-sm text-[#445578]">
            <p className="font-semibold text-[#111827]">Training contact</p>
            <p className="mt-2 flex items-center gap-2"><Mail size={14} /> <a href="mailto:asianhawksmanpower@gmail.com" className="hover:text-[#0f5daa]">asianhawksmanpower@gmail.com</a></p>
            <p className="mt-1 flex items-center gap-2"><Mail size={14} /> <a href="mailto:Hr@asianhawksmanpower.com" className="hover:text-[#0f5daa]">Hr@asianhawksmanpower.com</a></p>
          </div>
        </article>
        <aside className="h-fit rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(17,24,39,0.05)] lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-[#111827]">Enquire to enrol</h2>
          <p className="mb-4 mt-1 text-xs text-[#64748b]">No login needed. HR will confirm batch and fee details.</p>
          <EnquiryForm jobTitle={course.title} jobSlug={course.slug} />
        </aside>
      </div>
    </section>
  );
}
