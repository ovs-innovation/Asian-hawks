import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock, GraduationCap, MapPin, Mail, Phone, Wallet } from "lucide-react";
import { DEMO_COURSES } from "@/lib/platform-data";
import { EnquiryForm } from "@/components/enquiry-form";
import { SafeImage } from "@/components/ui/safe-image";

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = DEMO_COURSES.find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <section className="bg-[#f7f9fc] px-4 py-8">
      <div className="mx-auto grid max-w-[1180px] gap-5 lg:grid-cols-[1fr_360px]">
        <article className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_2px_rgba(17,24,39,0.05)] md:p-8">
          <p className="text-xs text-[#64748b]">
            <Link href="/training" className="hover:text-[#0f5daa]">
              Training
            </Link>{" "}
            / {course.institute}
          </p>
          <h1 className="mt-3 text-[26px] font-bold leading-tight text-[#111827]">{course.title}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[15px] font-medium text-[#334155]">
            {course.institute}
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#0f5daa]">
              <BadgeCheck size={12} /> Verified program
            </span>
          </p>
          <SafeImage src={course.image} alt={course.title} className="mt-5 h-48 w-full rounded-xl object-cover sm:h-56" />
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#64748b]">
            <span className="inline-flex items-center gap-1.5"><GraduationCap size={15} /> {course.mode}</span>
            <span className="inline-flex items-center gap-1.5"><Wallet size={15} /> ₹{course.price.toLocaleString()}</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {course.duration}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {course.placement}</span>
          </div>
          <hr className="my-6 border-[#e5e7eb]" />
          <h2 className="text-base font-bold text-[#111827]">Course description</h2>
          <p className="mt-3 text-sm leading-7 text-[#445578]">{course.description}</p>
          <h2 className="mt-6 text-base font-bold text-[#111827]">What you will cover</h2>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-[#445578]">
            {course.modules.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2 className="mt-6 text-base font-bold text-[#111827]">Category</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-medium text-[#0f5daa]">{course.category}</span>
          </div>
          <div className="mt-8 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4 text-sm text-[#445578]">
            <p className="font-semibold text-[#111827]">Training contact</p>
            <p className="mt-2 flex items-center gap-2"><Phone size={14} /> <a href="tel:6280698650" className="hover:text-[#0f5daa]">6280698650</a></p>
            <p className="mt-1 flex items-center gap-2"><Mail size={14} /> <a href="mailto:asianhawksmanpower@gmail.com" className="hover:text-[#0f5daa]">asianhawksmanpower@gmail.com</a></p>
            <p className="mt-1 flex items-center gap-2"><Mail size={14} /> <a href="mailto:Hr@asianhawksmanpower.com" className="hover:text-[#0f5daa]">Hr@asianhawksmanpower.com</a></p>
          </div>
        </article>
        <aside className="h-fit rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(17,24,39,0.05)] lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-[#111827]">Enquire to enrol</h2>
          <p className="mb-4 mt-1 text-xs text-[#64748b]">No login needed. HR will confirm batch and fee on call.</p>
          <EnquiryForm jobTitle={course.title} jobSlug={course.slug} />
        </aside>
      </div>
    </section>
  );
}
