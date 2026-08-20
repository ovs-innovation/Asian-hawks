"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store";
import { useJobs } from "@/hooks/use-jobs";

export default function CandidateHome() {
  const user = useSelector((s: RootState) => s.auth.user);
  const { data: jobs = [] } = useJobs();
  const pct = user?.profileCompletion || 20;
  return (
    <>
      <PageHeader title="Dashboard" body="Your search, applications, and next interviews." action={<Button asChild><Link href="/jobs">Browse jobs</Link></Button>} />
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm text-slate-500">Profile completion</p>
          <p className="mt-2 text-3xl font-semibold">{pct}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-blue-600" style={{ width: `${pct}%` }} />
          </div>
          <Link href="/candidate/profile" className="mt-4 inline-block text-sm text-blue-600">Complete profile</Link>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-500">Saved roles</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
          <p className="mt-2 text-sm text-slate-500">Save from any job page.</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-slate-500">Applications</p>
          <p className="mt-2 text-3xl font-semibold">1</p>
          <Link href="/candidate/applied" className="mt-4 inline-block text-sm text-blue-600">Track status</Link>
        </Card>
      </div>
      <h2 className="mt-10 text-lg font-semibold">Recommended</h2>
      <div className="mt-4 space-y-3">
        {jobs.slice(0, 3).map((j) => (
          <Card key={j.slug} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{j.title}</p>
              <p className="text-sm text-slate-500">{j.company?.name || "Asian Hawks"} · {j.location}</p>
            </div>
            <Button size="sm" asChild><Link href={`/jobs/${j.slug}`}>View</Link></Button>
          </Card>
        ))}
      </div>
      <h2 className="mt-10 text-lg font-semibold">Activity</h2>
      <ol className="mt-4 space-y-3 border-l border-slate-200 pl-5 dark:border-slate-800">
        <li className="text-sm"><span className="text-slate-400">Today · </span>Profile opened</li>
        <li className="text-sm"><span className="text-slate-400">This week · </span>Applied to Senior Product Designer</li>
      </ol>
    </>
  );
}
