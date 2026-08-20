"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { API_URL } from "@/lib/utils";

type ApplicationItem = {
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

function fileHref(url?: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_URL.replace(/\/api$/, "")}${url}`;
}

export default function AdminApplicationsPage() {
  const { data } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: () => api<{ items: ApplicationItem[] }>("/admin/applications"),
  });

  return (
    <>
      <PageHeader title="Applications" body="Candidates who applied with their resume from the website." />
      <div className="space-y-3">
        {data?.items?.map((item) => (
          <Card key={item._id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-[#111827]">{item.name}</p>
                <p className="mt-1 text-sm text-[#64748b]">
                  {item.email} · {item.phone || "No phone"}
                </p>
                <p className="mt-2 text-sm text-[#334155]">
                  {item.jobTitle || "General enquiry"} {item.jobSlug ? `· ${item.jobSlug}` : ""}
                </p>
                {item.message && <p className="mt-2 text-sm text-[#64748b]">{item.message}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge tone="blue">{new Date(item.createdAt).toLocaleString()}</Badge>
                {item.resumeUrl ? (
                  <a
                    href={fileHref(item.resumeUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-[#0f5daa] hover:underline"
                  >
                    Download resume{item.resumeName ? ` (${item.resumeName})` : ""}
                  </a>
                ) : (
                  <span className="text-xs text-[#94a3b8]">No resume</span>
                )}
              </div>
            </div>
          </Card>
        ))}
        {!data?.items?.length && <EmptyState title="No applications yet" body="When someone applies from a job page, their resume appears here." />}
      </div>
    </>
  );
}
