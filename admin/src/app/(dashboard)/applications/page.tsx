"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { timeAgo, API_URL } from "@/lib/utils";
import { Search, FileText, Mail, Phone, ExternalLink, UserCheck, Briefcase, Filter, Download } from "lucide-react";

type Candidate = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  headline?: string;
};

type Job = {
  _id: string;
  title: string;
  slug: string;
  company?: { name: string };
};

type Application = {
  _id: string;
  candidate?: Candidate;
  job?: Job;
  status: string;
  coverLetter?: string;
  createdAt: string;
};

type QuickApplyEnquiry = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  jobTitle?: string;
  jobSlug?: string;
  resumeUrl?: string;
  resumeName?: string;
  createdAt: string;
};

export default function AdminApplicationsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "portal" | "resumes">("all");

  const { data: appsData, isLoading: appsLoading } = useQuery<{ items: Application[] }>({
    queryKey: ["admin-applications"],
    queryFn: () => api("/admin/applications"),
  });

  const { data: enquiriesData, isLoading: enquiriesLoading } = useQuery<{ items: QuickApplyEnquiry[] }>({
    queryKey: ["admin-enquiries-app"],
    queryFn: () => api("/admin/enquiries"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, type, status }: { id: string; type: "portal" | "quick"; status: string }) =>
      type === "portal"
        ? api(`/applications/${id}`, { method: "PATCH", body: JSON.stringify({ status }) })
        : api(`/admin/enquiries/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
    onSuccess: () => {
      toast.success("Application status updated");
      qc.invalidateQueries({ queryKey: ["admin-applications"] });
      qc.invalidateQueries({ queryKey: ["admin-enquiries-app"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const portalApps = appsData?.items ?? [];
  const quickApplies = (enquiriesData?.items ?? []).filter((i) => {
    const msg = (i.message || "").toLowerCase();
    const msgUpper = (i.message || "").toUpperCase();
    
    // Exclude course purchase requests
    if (msgUpper.includes("PURCHASE REQUEST")) return false;

    // Must have a resumeUrl attached OR be an explicit job application
    if (i.resumeUrl) return true;
    if (msg.includes("application for") && !msg.includes("course")) return true;

    return false;
  });

  const combined = [
    ...portalApps.map((a) => ({
      id: a._id,
      type: "portal" as const,
      name: a.candidate?.name || "Candidate",
      email: a.candidate?.email || "—",
      phone: a.candidate?.phone || "—",
      headline: a.candidate?.headline,
      jobTitle: a.job?.title || "Job Application",
      companyName: a.job?.company?.name || "Asian Hawks",
      status: a.status || "reviewing",
      details: a.coverLetter,
      resumeUrl: null,
      createdAt: a.createdAt,
    })),
    ...quickApplies.map((q) => ({
      id: q._id,
      type: "quick" as const,
      name: q.name,
      email: q.email,
      phone: q.phone || "—",
      headline: "Quick Applicant",
      jobTitle: q.jobTitle || "Job Quick Apply",
      companyName: "Asian Hawks",
      status: (q as any).status || "applied",
      details: q.message,
      resumeUrl: q.resumeUrl,
      createdAt: q.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filtered = combined.filter((item) => {
    const text = (
      item.name +
      item.email +
      item.phone +
      item.jobTitle +
      item.companyName +
      (item.details || "")
    ).toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    if (activeTab === "portal") return matchesSearch && item.type === "portal";
    if (activeTab === "resumes") return matchesSearch && (item.type === "quick" || !!item.resumeUrl);
    return matchesSearch;
  });

  const isLoading = appsLoading || enquiriesLoading;

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f5daa]">Recruitment</p>
          <h2 className="mt-1 text-xl font-bold text-[#111827]">Job Applications</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Review candidates and students who applied for jobs or submitted resumes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#c7d7ea] bg-[#f0f7ff] px-4 py-2 text-xs font-semibold text-[#0f5daa]">
            Total Applications: <span className="text-sm font-bold">{combined.length}</span>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white p-1">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "all" ? "bg-[#0f5daa] text-white" : "text-[#4b5563] hover:text-[#111827]"
            }`}
          >
            All Applications ({combined.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("portal")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "portal" ? "bg-[#0f5daa] text-white" : "text-[#4b5563] hover:text-[#111827]"
            }`}
          >
            Registered Candidates ({portalApps.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("resumes")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "resumes" ? "bg-[#0f5daa] text-white" : "text-[#4b5563] hover:text-[#111827]"
            }`}
          >
            Direct Resume Submissions ({quickApplies.length})
          </button>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search applicant, job, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl border border-[#e5e7eb] bg-white pl-9 pr-3 text-xs text-[#111827] placeholder:text-[#9ca3af] focus:border-[#0f5daa] focus:outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-[#f3f4f6]" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-[#e5e7eb] bg-[#f9fafb]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Candidate / Student</th>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Applied Role</th>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Resume / Cover Note</th>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Applied Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {filtered.map((item) => {
                const isQuick = item.type === "quick";
                const fullResumeUrl = item.resumeUrl
                  ? item.resumeUrl.startsWith("http")
                    ? item.resumeUrl
                    : `${API_URL.replace("/api", "")}${item.resumeUrl}`
                  : null;

                return (
                  <tr key={item.id} className="hover:bg-[#f9fafb]">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-[#111827]">{item.name}</p>
                      <p className="text-xs text-[#64748b]">{item.headline || "Candidate"}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#64748b]">
                        <span className="flex items-center gap-1">
                          <Mail size={12} /> {item.email}
                        </span>
                        {item.phone && item.phone !== "—" ? (
                          <span className="flex items-center gap-1">
                            <Phone size={12} /> {item.phone}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-[#0f5daa]">{item.jobTitle}</p>
                      <p className="text-xs text-[#9ca3af]">{item.companyName}</p>
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      {fullResumeUrl ? (
                        <a
                          href={fullResumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#c7d7ea] bg-[#eaf3fb] px-2.5 py-1 text-xs font-semibold text-[#0f5daa] hover:bg-[#d8e8f8]"
                        >
                          <Download size={13} /> View Resume PDF
                        </a>
                      ) : null}
                      {item.details ? (
                        <p className="mt-1 text-xs text-[#4b5563] line-clamp-2">{item.details}</p>
                      ) : !fullResumeUrl ? (
                        <span className="text-xs text-[#9ca3af]">No attachment</span>
                      ) : null}
                    </td>

                    <td className="px-4 py-3.5">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({ id: item.id, type: item.type, status: e.target.value })
                        }
                        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 focus:border-[#0f5daa] focus:outline-none"
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="offered">Offered</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-[#6b7280] whitespace-nowrap">
                      {timeAgo(item.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!filtered.length ? (
            <div className="px-5 py-12 text-center text-sm text-[#9ca3af]">
              No job applications found.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
