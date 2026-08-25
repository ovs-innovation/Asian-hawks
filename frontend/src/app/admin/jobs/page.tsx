"use client";

import { FormEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Briefcase, Building2, Plus, X, Search, CheckCircle2, Clock, Trash2, Eye } from "lucide-react";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/primitives";
import { useJobs } from "@/hooks/use-jobs";
import { CATEGORIES } from "@/lib/demo-data";
import { api } from "@/lib/api";
import { formatSalary, timeAgo } from "@/lib/utils";

export default function AdminJobsPage() {
  const queryClient = useQueryClient();
  const { data: jobs = [], refetch } = useJobs("?limit=100");
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    department: "Engineering",
    category: "Software Development",
    subCategory: "",
    industry: "IT & Software",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "1-3 years",
    minSalary: 350000,
    maxSalary: 600000,
    currency: "INR",
    vacancies: 2,
    skills: "React, Node.js, JavaScript",
    responsibilities: "Develop robust features and collaborate with product teams.",
    requirements: "Degree in CS or equivalent experience.",
    benefits: "Health Insurance, Paid Leaves, Bonus",
    qualifications: "B.Tech / B.E. / BCA / MCA",
    languages: "English, Hindi",
    location: "Mumbai, Maharashtra",
    featured: true,
    urgent: false,
    status: "published",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api("/jobs", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
          languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      toast.success("Job posted successfully and published live!");
      setIsOpen(false);
      // Invalidate queries so homepage Latest Jobs section updates instantly
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to post job");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (j.company?.name || "").toLowerCase().includes(searchFilter.toLowerCase()) ||
      (j.location || "").toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Job Listings & Moderation"
          body="Post latest jobs directly to the platform homepage or edit existing listings."
        />
        <Button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0f5daa] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#03224c]"
        >
          <Plus size={18} />
          Post New Latest Job
        </Button>
      </div>

      {/* Quick Search & Filter */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Search jobs by title, company, or location..."
          className="w-full text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Jobs Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase font-bold text-slate-500">
              <tr>
                <th className="px-5 py-3.5">Job Title</th>
                <th className="px-5 py-3.5">Company</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Salary</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Posted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((j) => (
                  <tr key={j._id || j.slug} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4">
                      <span className="block font-bold text-slate-900">{j.title}</span>
                      <span className="text-xs text-slate-500">{j.category || j.department || "General"}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      <span className="inline-flex items-center gap-1.5 font-semibold">
                        <Building2 size={15} className="text-slate-400" />
                        {j.company?.name || "Asian Hawks"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{j.location || "India"}</td>
                    <td className="px-5 py-4 text-slate-800 font-semibold">
                      {formatSalary(j.minSalary, j.maxSalary, j.currency)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          j.status === "published" || !j.status
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                            : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                        }`}
                      >
                        {j.status === "published" || !j.status ? "Published" : j.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {j.publishedAt || j.createdAt ? timeAgo(j.publishedAt || j.createdAt) : "Recently"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                    No jobs found. Click <strong>"Post New Latest Job"</strong> to add your first job.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Job Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Post a Latest Job</h3>
                <p className="text-xs text-slate-500">This job will immediately appear on the homepage under Latest Jobs.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Job Title *</Label>
                  <Input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Senior Software Engineer" className="mt-1" />
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Employment Type</Label>
                  <select
                    value={form.employmentType}
                    onChange={(e) => set("employmentType", e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                  >
                    {["Full Time", "Part Time", "Contract", "Internship", "Freelance"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Workplace</Label>
                  <select
                    value={form.workplace}
                    onChange={(e) => set("workplace", e.target.value)}
                    className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                  >
                    {["Onsite", "Remote", "Hybrid"].map((w) => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Experience</Label>
                  <Input value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="e.g. 2-5 years / Freshers" className="mt-1" />
                </div>

                <div>
                  <Label>Location</Label>
                  <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Mumbai / Remote" className="mt-1" />
                </div>

                <div>
                  <Label>Min Salary</Label>
                  <Input type="number" value={form.minSalary} onChange={(e) => set("minSalary", Number(e.target.value))} className="mt-1" />
                </div>

                <div>
                  <Label>Max Salary</Label>
                  <Input type="number" value={form.maxSalary} onChange={(e) => set("maxSalary", Number(e.target.value))} className="mt-1" />
                </div>
              </div>

              <div>
                <Label>Required Skills (comma separated)</Label>
                <Input value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="React, Node.js, SQL" className="mt-1" />
              </div>

              <div>
                <Label>Responsibilities & Description</Label>
                <Textarea value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} rows={3} className="mt-1" />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="rounded text-[#0f5daa]" />
                  Mark as Featured Job
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input type="checkbox" checked={form.urgent} onChange={(e) => set("urgent", e.target.checked)} className="rounded text-[#0f5daa]" />
                  Urgent Hiring
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-[#0f5daa] hover:bg-[#03224c]">
                  {submitting ? "Posting..." : "Publish Job Live"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
