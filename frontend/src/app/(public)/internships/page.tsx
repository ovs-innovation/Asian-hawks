import { SectionHeader } from "@/components/platform/section-header";
import { JobCard } from "@/components/jobs/job-card";
import { DEMO_JOBS } from "@/lib/demo-data";

export default function InternshipsPage() {
  const internships = DEMO_JOBS.filter((j) => j.employmentType === "Internship" || j.category === "Internships");

  return (
    <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-10">
      <SectionHeader title="Internships" subtitle="Internship openings for students and freshers" />
      <div className="grid gap-4 md:grid-cols-2">
        {internships.map((job) => (
          <JobCard key={job.slug} job={job} variant="grid" />
        ))}
      </div>
    </div>
  );
}
