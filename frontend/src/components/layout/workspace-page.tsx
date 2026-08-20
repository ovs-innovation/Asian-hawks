"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Badge, Card, EmptyState, Input, Label, Textarea } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { JobCard } from "@/components/jobs/job-card";

const taxonomyTypeBySection: Record<string, string> = {
  skills: "skill",
  locations: "location",
  countries: "country",
  cities: "city",
  industries: "industry",
  "employment-types": "employment_type",
  "experience-levels": "experience_level",
  "salary-ranges": "salary_range",
};

const settingsKeyMap: Record<string, string[]> = {
  cms: ["cms.home.title", "cms.home.subtitle", "cms.home.footerCta"],
  seo: ["seo.defaultTitle", "seo.defaultDescription", "seo.noIndexDrafts"],
  ads: ["ads.homepageEnabled", "ads.sidebarEnabled", "ads.maxPlacements"],
  "api-keys": ["api.publicKey", "api.webhookSecret", "api.integrationName"],
  storage: ["storage.provider", "storage.maxUploadMb", "storage.publicBaseUrl"],
  smtp: ["smtp.host", "smtp.port", "smtp.fromEmail"],
  "email-templates": ["email.applicationReceived", "email.interviewInvite", "email.offerLetter"],
  security: ["security.sessionTimeoutMinutes", "security.passwordResetHours", "security.maxLoginAttempts"],
  backup: ["backup.lastRun", "backup.retentionDays", "backup.destination"],
};

type JobItem = {
  _id: string;
  title: string;
  category?: string;
  location?: string;
  status: string;
  featured?: boolean;
  urgent?: boolean;
  company?: { name?: string };
  createdAt?: string;
};

type BillingRecord = { _id?: string; [key: string]: unknown };
type TaxonomyItem = { _id: string; name: string; meta?: unknown; jobCount?: number; type?: string };

export function WorkspacePage({
  title,
  body,
  cta,
  href,
}: {
  title: string;
  body: string;
  cta?: string;
  href?: string;
}) {
  const pathname = usePathname();
  const section = pathname.split("/").filter(Boolean).pop() || "";

  if (section === "jobs") return <JobsWorkspace title={title} body={body} />;
  if (section === "recruiters") return <UsersWorkspace title={title} body={body} mode="recruiters" />;
  if (section === "candidates") return <UsersWorkspace title={title} body={body} mode="candidates" />;
  if (section === "analytics" || section === "reports") return <OverviewWorkspace title={title} body={body} mode={section} />;
  if (section === "tickets") return <TicketsWorkspace title={title} body={body} />;
  if (section === "audit" || section === "activity") return <AuditWorkspace title={title} body={body} />;
  if (section === "blogs") return <BlogsWorkspace title={title} body={body} />;
  if (section === "roles" || section === "permissions") return <RolesWorkspace title={title} body={body} mode={section} />;
  if (section === "subscriptions" || section === "payments" || section === "coupons") {
    return <BillingWorkspace title={title} body={body} mode={section} />;
  }
  if (section === "subcategories" || taxonomyTypeBySection[section]) {
    return <TaxonomyWorkspace title={title} body={body} section={section} />;
  }
  if (section === "settings" || settingsKeyMap[section]) {
    return <SettingsWorkspace title={title} body={body} section={section} />;
  }

  return (
    <>
      <PageHeader title={title} body={body} />
      <EmptyState
        title="Nothing here yet"
        body="This workspace is live. Records appear as soon as the related API has data."
        action={cta && href ? <Button asChild><Link href={href}>{cta}</Link></Button> : undefined}
      />
    </>
  );
}

const SITE_CATEGORIES = ["Engineering", "Design", "People", "Marketing", "Customer", "Finance"];

function CreateJobPanel({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({
    title: "",
    companyName: "",
    location: "",
    category: "Engineering",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "Mid-level",
    minSalary: 110000,
    maxSalary: 150000,
    currency: "USD",
    responsibilities: "",
  });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function publish() {
    if (!form.title.trim()) return toast.error("Job title is required");
    if (!form.companyName.trim()) return toast.error("Company name is required");
    setSaving(true);
    try {
      await api("/admin/jobs", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          status: "published",
          workplace: form.location.toLowerCase().includes("remote") ? "Remote" : form.workplace,
        }),
      });
      toast.success("Job published on the website");
      setForm((f) => ({ ...f, title: "", companyName: "", location: "", responsibilities: "" }));
      onCreated();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not create job");
    } finally {
      setSaving(false);
    }
  }

  const previewJob = {
    title: form.title || "Senior Product Designer",
    company: { name: form.companyName || "Helios Bank", slug: "", logo: "", industry: "", location: form.location || "San Francisco", verified: true, employees: 0 },
    category: form.category,
    employmentType: form.employmentType,
    workplace: form.workplace,
    experience: form.experience,
    minSalary: form.minSalary,
    maxSalary: form.maxSalary,
    currency: form.currency,
    location: form.location || "San Francisco",
    createdAt: new Date().toISOString(),
    slug: "",
    _id: "preview",
    featured: false,
    urgent: false,
    skills: [],
    applicationsCount: 0,
    responsibilities: form.responsibilities,
    requirements: "",
    benefits: "",
    department: form.category,
    vacancies: 1,
  };

  return (
    <Card className="mb-8 p-5">
      <h3 className="font-semibold">Create job post</h3>
      <p className="mt-1 text-sm text-slate-500">Fields match the public listing card: title, company, location, salary, type, category.</p>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div className="grid gap-3">
          <div><Label>Job title</Label><Input className="mt-1" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Senior Product Designer" /></div>
          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Company</Label><Input className="mt-1" value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="Helios Bank" /></div>
            <div><Label>Location</Label><Input className="mt-1" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="San Francisco or Remote" /></div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Category</Label>
              <select className="mt-1 h-10 w-full rounded-md border border-[#e7e7f1] px-3 text-sm" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {SITE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Employment type</Label>
              <select className="mt-1 h-10 w-full rounded-md border border-[#e7e7f1] px-3 text-sm" value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)}>
                {["Full Time", "Part Time", "Contract", "Internship", "Freelance"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div><Label>Min salary</Label><Input className="mt-1" type="number" value={form.minSalary} onChange={(e) => set("minSalary", Number(e.target.value))} /></div>
            <div><Label>Max salary</Label><Input className="mt-1" type="number" value={form.maxSalary} onChange={(e) => set("maxSalary", Number(e.target.value))} /></div>
            <div><Label>Currency</Label><Input className="mt-1" value={form.currency} onChange={(e) => set("currency", e.target.value)} /></div>
          </div>
          <div><Label>Description</Label><Textarea className="mt-1" value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} placeholder="Shown on the job detail page" /></div>
          <Button disabled={saving} onClick={publish}>{saving ? "Publishing…" : "Publish to website"}</Button>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Live website preview</p>
          <JobCard job={previewJob} preview />
        </div>
      </div>
    </Card>
  );
}

function JobsWorkspace({ title, body }: { title: string; body: string }) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(true);
  const { data } = useQuery({
    queryKey: ["admin-jobs", q, status, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      if (category) params.set("category", category);
      return api<{ items: JobItem[]; total: number }>(`/admin/jobs?${params.toString()}`);
    },
  });
  const { data: detail } = useQuery({
    queryKey: ["admin-job-detail", selectedId],
    enabled: !!selectedId,
    queryFn: () => api<{ job: Record<string, unknown> }>(`/admin/jobs/${selectedId}`),
  });
  const patch = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      api(`/admin/jobs/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => {
      toast.success("Job updated");
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
      qc.invalidateQueries({ queryKey: ["admin-job-detail", selectedId] });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => api(`/admin/jobs/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Job deleted");
      setSelectedId(null);
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
    },
  });

  return (
    <>
      <PageHeader title={title} body={body} />
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Create a post with the same card that appears on the public Jobs page.</p>
        <Button type="button" variant="secondary" onClick={() => setShowCreate((v) => !v)}>
          {showCreate ? "Hide create form" : "Create job post"}
        </Button>
      </div>
      {showCreate && <CreateJobPanel onCreated={() => qc.invalidateQueries({ queryKey: ["admin-jobs"] })} />}
      <Card className="mb-6 p-4">
        <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
          <Input placeholder="Search title, category, skill" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="h-10 rounded-md border border-[#e7e7f1] px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {["draft", "published", "paused", "expired"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          {data?.items?.map((job) => (
            <Card key={job._id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-slate-500">{job.company?.name || "No company"} · {job.location || "No location"}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge tone={job.status === "published" ? "green" : job.status === "paused" ? "amber" : "slate"}>{job.status}</Badge>
                    {job.category && <Badge tone="blue">{job.category}</Badge>}
                    {job.featured && <Badge tone="blue">featured</Badge>}
                    {job.urgent && <Badge tone="red">urgent</Badge>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setSelectedId(job._id)}>Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => patch.mutate({ id: job._id, payload: { status: job.status === "published" ? "paused" : "published" } })}>
                    {job.status === "published" ? "Pause" : "Publish"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => patch.mutate({ id: job._id, payload: { featured: !job.featured } })}>
                    {job.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => patch.mutate({ id: job._id, payload: { urgent: !job.urgent } })}>
                    {job.urgent ? "Remove urgent" : "Mark urgent"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove.mutate(job._id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))}
          {!data?.items?.length && <EmptyState title="No jobs found" body="Adjust filters or create recruiter jobs to moderate here." />}
        </div>
        <Card className="p-5">
          <h3 className="font-semibold">Job editor</h3>
          {!selectedId || !detail?.job ? (
            <p className="mt-3 text-sm text-slate-500">Select a job from the list to review and edit it.</p>
          ) : (
            <JobEditor
              job={detail.job}
              onSave={(payload) => patch.mutate({ id: selectedId, payload })}
            />
          )}
        </Card>
      </div>
    </>
  );
}

function JobEditor({ job, onSave }: { job: Record<string, unknown>; onSave: (payload: Record<string, unknown>) => void }) {
  const [form, setForm] = useState({
    title: String(job.title || ""),
    category: String(job.category || ""),
    location: String(job.location || ""),
    status: String(job.status || "draft"),
    featured: Boolean(job.featured),
    urgent: Boolean(job.urgent),
    experience: String(job.experience || ""),
    responsibilities: String(job.responsibilities || ""),
    requirements: String(job.requirements || ""),
  });

  return (
    <div className="mt-4 grid gap-3">
      <div><Label>Title</Label><Input className="mt-1" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></div>
      <div className="grid gap-3 md:grid-cols-2">
        <div><Label>Category</Label><Input className="mt-1" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} /></div>
        <div><Label>Location</Label><Input className="mt-1" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} /></div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Status</Label>
          <select className="mt-1 h-10 w-full rounded-md border border-[#e7e7f1] px-3 text-sm" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
            {["draft", "published", "paused", "expired"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div><Label>Experience</Label><Input className="mt-1" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} /></div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} /> Featured</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.urgent} onChange={(e) => setForm((f) => ({ ...f, urgent: e.target.checked }))} /> Urgent</label>
      </div>
      <div><Label>Responsibilities</Label><Textarea className="mt-1" value={form.responsibilities} onChange={(e) => setForm((f) => ({ ...f, responsibilities: e.target.value }))} /></div>
      <div><Label>Requirements</Label><Textarea className="mt-1" value={form.requirements} onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))} /></div>
      <Button onClick={() => onSave(form)}>Save job changes</Button>
    </div>
  );
}

function UsersWorkspace({ title, body, mode }: { title: string; body: string; mode: "recruiters" | "candidates" }) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const { data } = useQuery({
    queryKey: ["admin-people", mode, q, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (mode === "candidates") params.set("role", "candidate");
      if (status) params.set("status", status);
      if (q) params.set("q", q);
      const response = await api<{ items: { _id: string; name: string; email: string; role: string; status: string; location?: string }[] }>(`/admin/users?${params.toString()}`);
      if (mode === "recruiters") {
        response.items = response.items.filter((item) => ["recruiter", "hr_manager", "company"].includes(item.role));
      }
      return response;
    },
  });
  const patch = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      api(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => {
      toast.success("Account updated");
      qc.invalidateQueries({ queryKey: ["admin-people", mode] });
    },
  });

  return (
    <>
      <PageHeader title={title} body={body} />
      <Card className="mb-6 p-4">
        <div className="grid gap-3 md:grid-cols-[1.5fr_1fr]">
          <Input placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="h-10 rounded-md border border-[#e7e7f1] px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {["active", "pending", "suspended"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </Card>
      <div className="space-y-3">
        {data?.items?.map((user) => (
          <Card key={user._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email} · {user.role}{user.location ? ` · ${user.location}` : ""}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={user.status === "active" ? "green" : user.status === "pending" ? "amber" : "red"}>{user.status}</Badge>
              {user.status !== "active" && <Button size="sm" onClick={() => patch.mutate({ id: user._id, payload: { status: "active" } })}>Activate</Button>}
              {user.status !== "suspended" && <Button size="sm" variant="secondary" onClick={() => patch.mutate({ id: user._id, payload: { status: "suspended" } })}>Suspend</Button>}
            </div>
          </Card>
        ))}
        {!data?.items?.length && <EmptyState title="No accounts found" body="No matching users are available for this role yet." />}
      </div>
    </>
  );
}

function OverviewWorkspace({ title, body, mode }: { title: string; body: string; mode: string }) {
  const { data } = useQuery({
    queryKey: ["admin-overview-lite", mode],
    queryFn: () => api<{ users: number; companies: number; jobs: number; applications: number; tickets: number; byRole: { _id: string; count: number }[] }>("/admin/overview"),
  });
  const cards = [
    ["Users", data?.users],
    ["Companies", data?.companies],
    ["Jobs", data?.jobs],
    ["Applications", data?.applications],
    ["Open tickets", data?.tickets],
  ];
  return (
    <>
      <PageHeader title={title} body={body} />
      <div className="grid gap-4 md:grid-cols-5">
        {cards.map(([label, value]) => (
          <Card key={String(label)} className="p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value ?? "—"}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-6 p-5">
        <h3 className="font-semibold">Role distribution</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {data?.byRole?.map((role) => (
            <div key={role._id} className="rounded-lg border border-slate-200 p-4">
              <p className="text-sm text-slate-500">{role._id}</p>
              <p className="mt-1 text-xl font-semibold">{role.count}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function TicketsWorkspace({ title, body }: { title: string; body: string }) {
  const { data } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: () => api<{ items: { _id: string; subject: string; message: string; status: string; user?: { name?: string; email?: string } }[] }>("/tickets"),
  });
  return (
    <>
      <PageHeader title={title} body={body} />
      <div className="space-y-3">
        {data?.items?.map((ticket) => (
          <Card key={ticket._id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{ticket.subject || "Support request"}</p>
                <p className="mt-1 text-sm text-slate-500">{ticket.user?.name || "Unknown"} · {ticket.user?.email || "No email"}</p>
                <p className="mt-3 text-sm">{ticket.message}</p>
              </div>
              <Badge tone={ticket.status === "open" ? "amber" : ticket.status === "closed" ? "green" : "blue"}>{ticket.status}</Badge>
            </div>
          </Card>
        ))}
        {!data?.items?.length && <EmptyState title="No tickets" body="Support inbox is empty right now." />}
      </div>
    </>
  );
}

function AuditWorkspace({ title, body }: { title: string; body: string }) {
  const { data } = useQuery({
    queryKey: ["admin-audit"],
    queryFn: () => api<{ items: { _id: string; action: string; resource: string; createdAt: string; actor?: { name?: string; role?: string } }[] }>("/admin/audit"),
  });
  return (
    <>
      <PageHeader title={title} body={body} />
      <div className="space-y-3">
        {data?.items?.map((item) => (
          <Card key={item._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{item.action}</p>
              <p className="text-sm text-slate-500">{item.actor?.name || "System"} · {item.actor?.role || "unknown"} · {new Date(item.createdAt).toLocaleString()}</p>
            </div>
            <Badge tone="slate">{item.resource}</Badge>
          </Card>
        ))}
        {!data?.items?.length && <EmptyState title="No audit records" body="Administrative actions will appear here." />}
      </div>
    </>
  );
}

function BillingWorkspace({ title, body, mode }: { title: string; body: string; mode: string }) {
  const { data } = useQuery({
    queryKey: ["admin-billing", mode],
    queryFn: () => api<{ subscriptions: BillingRecord[]; invoices: BillingRecord[]; coupons: BillingRecord[] }>("/billing"),
  });
  const items =
    mode === "subscriptions"
      ? data?.subscriptions || []
      : mode === "payments"
        ? data?.invoices || []
        : data?.coupons || [];
  return (
    <>
      <PageHeader title={title} body={body} />
      <div className="space-y-3">
        {items.map((item: BillingRecord, index: number) => (
          <Card key={item._id || index} className="p-4">
            <pre className="overflow-auto whitespace-pre-wrap text-sm text-slate-700">{JSON.stringify(item, null, 2)}</pre>
          </Card>
        ))}
        {!items.length && <EmptyState title="No records" body="Billing records will appear here when plans or invoices exist." />}
      </div>
    </>
  );
}

function TaxonomyWorkspace({ title, body, section }: { title: string; body: string; section: string }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [meta, setMeta] = useState("");
  const isSubcategory = section === "subcategories";
  const type = taxonomyTypeBySection[section];
  const queryKey = ["admin-taxonomy", section];
  const { data } = useQuery({
    queryKey,
    queryFn: async () => {
      if (isSubcategory) {
        const result = await api<{ items: { _id: string; name: string; slug: string; type?: string; jobCount?: number }[] }>("/categories");
        return { items: result.items.filter((item) => item.type === "subcategory") };
      }
      return api<{ items: { _id: string; name: string; meta?: unknown }[] }>(`/taxonomies?type=${type}`);
    },
  });
  const create = useMutation({
    mutationFn: () =>
      isSubcategory
        ? api("/admin/categories", { method: "POST", body: JSON.stringify({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), type: "subcategory" }) })
        : api("/admin/taxonomies", { method: "POST", body: JSON.stringify({ type, name, meta: parseMaybeJson(meta) }) }),
    onSuccess: () => {
      toast.success("Saved");
      setName("");
      setMeta("");
      qc.invalidateQueries({ queryKey });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => (isSubcategory ? api(`/admin/categories/${id}`, { method: "DELETE" }) : api(`/admin/taxonomies/${id}`, { method: "DELETE" })),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey });
    },
  });

  return (
    <>
      <PageHeader title={title} body={body} />
      <Card className="mb-6 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Meta (optional JSON or text)" value={meta} onChange={(e) => setMeta(e.target.value)} />
          <Button onClick={() => name && create.mutate()}>Add</Button>
        </div>
      </Card>
      <div className="grid gap-3">
        {data?.items?.map((item: TaxonomyItem) => (
          <Card key={item._id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{item.name}</p>
              {"jobCount" in item && <p className="text-sm text-slate-500">Jobs: {item.jobCount ?? 0}</p>}
              {Boolean(item.meta) && (
                <p className="mt-1 text-xs text-slate-500">
                  {typeof item.meta === "string" ? item.meta : JSON.stringify(item.meta ?? null)}
                </p>
              )}
            </div>
            <Button size="sm" variant="destructive" onClick={() => remove.mutate(item._id)}>Delete</Button>
          </Card>
        ))}
        {!data?.items?.length && <EmptyState title="No records yet" body="Create the first record for this taxonomy." />}
      </div>
    </>
  );
}

function SettingsWorkspace({ title, body, section }: { title: string; body: string; section: string }) {
  const qc = useQueryClient();
  const allowCustomKey = section === "settings";
  const [key, setKey] = useState(settingsKeyMap[section]?.[0] || "platform.name");
  const [value, setValue] = useState("");
  const allowedKeys = useMemo(() => settingsKeyMap[section] || [], [section]);
  const { data } = useQuery({
    queryKey: ["admin-settings", section],
    queryFn: () => api<{ items: { _id?: string; key: string; value: unknown }[] }>("/admin/settings"),
  });
  const scoped = useMemo(
    () => (allowCustomKey ? data?.items || [] : (data?.items || []).filter((item) => allowedKeys.includes(item.key))),
    [allowCustomKey, allowedKeys, data?.items]
  );
  const save = useMutation({
    mutationFn: () => api("/admin/settings", { method: "POST", body: JSON.stringify({ key, value: parseMaybeJson(value) }) }),
    onSuccess: () => {
      toast.success("Setting saved");
      setValue("");
      qc.invalidateQueries({ queryKey: ["admin-settings", section] });
    },
  });

  return (
    <>
      <PageHeader title={title} body={body} />
      <Card className="mb-6 p-4">
        <div className="grid gap-3">
          <div>
            <Label>Setting key</Label>
            {allowCustomKey ? (
              <Input className="mt-1" value={key} onChange={(e) => setKey(e.target.value)} placeholder="platform.name" />
            ) : (
              <select className="mt-1 h-10 w-full rounded-md border border-[#e7e7f1] px-3 text-sm" value={key} onChange={(e) => setKey(e.target.value)}>
                {allowedKeys.map((item) => <option key={item}>{item}</option>)}
              </select>
            )}
          </div>
          <div>
            <Label>Value</Label>
            <Textarea className="mt-1" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Text or JSON value" />
          </div>
          <Button onClick={() => key && save.mutate()}>Save setting</Button>
        </div>
      </Card>
      <div className="space-y-3">
        {scoped.map((item) => (
          <Card key={item.key} className="p-4">
            <p className="font-medium">{item.key}</p>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs text-slate-600">{JSON.stringify(item.value, null, 2)}</pre>
          </Card>
        ))}
        {!scoped.length && <EmptyState title="No settings yet" body="Save one of the configured keys to populate this panel." />}
      </div>
    </>
  );
}

function BlogsWorkspace({ title, body }: { title: string; body: string }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", slug: "", author: "", category: "", excerpt: "", content: "", published: true });
  const { data } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: () => api<{ items: { _id: string; title: string; slug: string; author?: string; category?: string; published?: boolean }[] }>("/blogs?admin=1"),
  });
  const create = useMutation({
    mutationFn: () => api("/admin/blogs", { method: "POST", body: JSON.stringify(form) }),
    onSuccess: () => {
      toast.success("Blog created");
      setForm({ title: "", slug: "", author: "", category: "", excerpt: "", content: "", published: true });
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
  });
  const toggle = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      api(`/admin/blogs/${id}`, { method: "PATCH", body: JSON.stringify({ published }) }),
    onSuccess: () => {
      toast.success("Blog updated");
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
  });

  return (
    <>
      <PageHeader title={title} body={body} />
      <Card className="mb-6 p-4">
        <div className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input placeholder="Author" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
            <Input placeholder="Category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          </div>
          <Textarea placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
          <Textarea placeholder="Content" value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} /> Published</label>
          <Button onClick={() => form.title && form.slug && create.mutate()}>Create blog</Button>
        </div>
      </Card>
      <div className="space-y-3">
        {data?.items?.map((item) => (
          <Card key={item._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-slate-500">{item.author || "Unknown author"} · {item.category || "No category"} · {item.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={item.published ? "green" : "amber"}>{item.published ? "published" : "draft"}</Badge>
              <Button size="sm" variant="secondary" onClick={() => toggle.mutate({ id: item._id, published: !item.published })}>
                {item.published ? "Unpublish" : "Publish"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function RolesWorkspace({ title, body, mode }: { title: string; body: string; mode: string }) {
  const { data } = useQuery({
    queryKey: ["admin-role-overview", mode],
    queryFn: () => api<{ byRole: { _id: string; count: number }[] }>("/admin/overview"),
  });
  const definitions = [
    { role: "super_admin", permissions: ["Everything", "Delete jobs", "Delete taxonomies", "Platform settings"] },
    { role: "moderator", permissions: ["Review jobs", "Approve companies", "Manage categories", "View audit"] },
    { role: "recruiter", permissions: ["Create jobs", "Manage applications", "Update company profile"] },
    { role: "company", permissions: ["Company visibility", "Subscription and billing access"] },
    { role: "candidate", permissions: ["Apply jobs", "Resume", "Saved jobs"] },
  ];
  const counts = new Map((data?.byRole || []).map((item) => [item._id, item.count]));
  return (
    <>
      <PageHeader title={title} body={body} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {definitions.map((item) => (
          <Card key={item.role} className="p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{item.role}</p>
              <Badge tone="blue">{counts.get(item.role) || 0}</Badge>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              {item.permissions.map((permission) => <li key={permission}>• {permission}</li>)}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}

function parseMaybeJson(value: string) {
  if (!value.trim()) return "";
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
