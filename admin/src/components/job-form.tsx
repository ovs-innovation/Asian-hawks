"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { inputClass, labelClass, textareaClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

type Category = { _id: string; name: string };
type Company = { _id: string; name: string; location?: string; industry?: string };
export type JobRecord = {
  _id: string;
  title?: string;
  department?: string;
  category?: string;
  subCategory?: string;
  industry?: string;
  employmentType?: string;
  workplace?: string;
  experience?: string;
  minSalary?: number;
  maxSalary?: number;
  currency?: string;
  vacancies?: number;
  skills?: string[];
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  qualifications?: string;
  languages?: string[];
  location?: string;
  city?: string;
  country?: string;
  mapUrl?: string;
  featured?: boolean;
  urgent?: boolean;
  seoTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  status?: string;
  company?: { _id: string } | string;
};

type FormState = {
  title: string;
  department: string;
  category: string;
  subCategory: string;
  industry: string;
  employmentType: string;
  workplace: string;
  experience: string;
  minSalary: number;
  maxSalary: number;
  currency: string;
  vacancies: number;
  skills: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  qualifications: string;
  languages: string;
  location: string;
  city: string;
  country: string;
  mapUrl: string;
  featured: boolean;
  urgent: boolean;
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  company: string;
};

const emptyForm: FormState = {
  title: "",
  department: "",
  category: "",
  subCategory: "",
  industry: "Banking",
  employmentType: "Full Time",
  workplace: "Onsite",
  experience: "Freshers Welcome",
  minSalary: 20000,
  maxSalary: 25000,
  currency: "INR",
  vacancies: 1,
  skills: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  qualifications: "",
  languages: "English, Hindi",
  location: "Pan India",
  city: "",
  country: "India",
  mapUrl: "",
  featured: false,
  urgent: false,
  seoTitle: "",
  metaDescription: "",
  keywords: "",
  company: "",
};

function companyId(value?: JobRecord["company"]) {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
}

export function JobForm({ job, initialCategory }: { job?: JobRecord; initialCategory?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState<"draft" | "published" | null>(null);

  const { data: categoryData } = useQuery<{ items: Category[] }>({
    queryKey: ["admin-categories"],
    queryFn: () => api("/admin/categories"),
  });
  const { data: companyData } = useQuery<{ items: Company[] }>({
    queryKey: ["admin-companies-select"],
    queryFn: () => api("/admin/companies?limit=100"),
  });

  const categories = categoryData?.items ?? [];
  const companies = companyData?.items ?? [];

  useEffect(() => {
    if (!job) return;
    setForm({
      title: job.title || "",
      department: job.department || "",
      category: job.category || "",
      subCategory: job.subCategory || "",
      industry: job.industry || "Banking",
      employmentType: job.employmentType || "Full Time",
      workplace: job.workplace || "Onsite",
      experience: job.experience || "Freshers Welcome",
      minSalary: job.minSalary || 0,
      maxSalary: job.maxSalary || 0,
      currency: job.currency || "INR",
      vacancies: job.vacancies || 1,
      skills: (job.skills || []).join(", "),
      responsibilities: job.responsibilities || "",
      requirements: job.requirements || "",
      benefits: job.benefits || "",
      qualifications: job.qualifications || "",
      languages: (job.languages || ["English", "Hindi"]).join(", "),
      location: job.location || "Pan India",
      city: job.city || "",
      country: job.country || "India",
      mapUrl: job.mapUrl || "",
      featured: Boolean(job.featured),
      urgent: Boolean(job.urgent),
      seoTitle: job.seoTitle || "",
      metaDescription: job.metaDescription || "",
      keywords: (job.keywords || []).join(", "),
      company: companyId(job.company),
    });
  }, [job]);

  useEffect(() => {
    if (job) return;
    if (!form.category && (initialCategory || categories[0])) {
      const nextCategory = initialCategory || categories[0].name;
      setForm((prev) => ({ ...prev, category: nextCategory, department: prev.department || nextCategory }));
    }
    if (!form.company && companies[0]) {
      setForm((prev) => ({
        ...prev,
        company: companies[0]._id,
        location: prev.location || companies[0].location || "Pan India",
        industry: prev.industry || companies[0].industry || "Banking",
      }));
    }
  }, [categories, companies, form.category, form.company, job, initialCategory]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function payload(status: "draft" | "published") {
    return {
      ...form,
      status,
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
      keywords: form.keywords.split(",").map((s) => s.trim()).filter(Boolean),
    };
  }

  async function submit(status: "draft" | "published") {
    if (!form.title.trim()) return toast.error("Job title is required");
    if (!form.category) return toast.error("Select a category");
    if (!form.company) return toast.error("Select a company");
    setSaving(status);
    try {
      if (job?._id) {
        await api(`/admin/jobs/${job._id}`, { method: "PATCH", body: JSON.stringify(payload(status)) });
        toast.success(status === "published" ? "Job updated and published" : "Job updated");
      } else {
        await api("/admin/jobs", { method: "POST", body: JSON.stringify(payload(status)) });
        toast.success(status === "published" ? "Job published" : "Draft saved");
      }
      router.push("/jobs");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save job");
    } finally {
      setSaving(null);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit("published");
      }}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-[#111827]">Job details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass}>Job title *</label>
            <input className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. ATM Mitra - Field Executive" required />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select className={inputClass} value={form.category} onChange={(e) => set("category", e.target.value)} required>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
            {!categories.length && (
              <p className="mt-1.5 text-xs text-[#9ca3af]">
                No categories yet. <a className="text-[#0f5daa] underline" href="/categories">Create one</a>
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>Company *</label>
            <select className={inputClass} value={form.company} onChange={(e) => set("company", e.target.value)} required>
              <option value="">Select company</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Department</label>
            <input className={inputClass} value={form.department} onChange={(e) => set("department", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Sub category</label>
            <input className={inputClass} value={form.subCategory} onChange={(e) => set("subCategory", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Employment type</label>
            <select className={inputClass} value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)}>
              {["Full Time", "Part Time", "Contract", "Internship", "Freelance"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Workplace</label>
            <select className={inputClass} value={form.workplace} onChange={(e) => set("workplace", e.target.value)}>
              {["Onsite", "Hybrid", "Remote"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Experience</label>
            <input className={inputClass} value={form.experience} onChange={(e) => set("experience", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Industry</label>
            <input className={inputClass} value={form.industry} onChange={(e) => set("industry", e.target.value)} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-[#111827]">Location & salary</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass} value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input className={inputClass} value={form.city} onChange={(e) => set("city", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <input className={inputClass} value={form.country} onChange={(e) => set("country", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Vacancies</label>
            <input className={inputClass} type="number" min={1} value={form.vacancies} onChange={(e) => set("vacancies", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>Min salary (INR)</label>
            <input className={inputClass} type="number" min={0} value={form.minSalary} onChange={(e) => set("minSalary", Number(e.target.value))} />
          </div>
          <div>
            <label className={labelClass}>Max salary (INR)</label>
            <input className={inputClass} type="number" min={0} value={form.maxSalary} onChange={(e) => set("maxSalary", Number(e.target.value))} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-[#111827]">Description</h3>
        <div className="grid gap-4">
          <div>
            <label className={labelClass}>Required skills</label>
            <input className={inputClass} value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="Comma separated" />
          </div>
          <div>
            <label className={labelClass}>Responsibilities</label>
            <textarea className={textareaClass} value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Requirements</label>
            <textarea className={textareaClass} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Benefits</label>
            <textarea className={textareaClass} value={form.benefits} onChange={(e) => set("benefits", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Qualifications</label>
            <textarea className={textareaClass} value={form.qualifications} onChange={(e) => set("qualifications", e.target.value)} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-[#111827]">Visibility</h3>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm text-[#374151]">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
            Featured job
          </label>
          <label className="flex items-center gap-2 text-sm text-[#374151]">
            <input type="checkbox" checked={form.urgent} onChange={(e) => set("urgent", e.target.checked)} />
            Urgent hiring
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5 sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-[#111827]">Website card preview</h3>
        <article className="flex max-w-xl flex-col gap-4 rounded-xl border border-[#e5e7eb] p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-[10px] border border-[#e5e7eb] bg-[#f8fafc] text-[13px] font-semibold">
                {(companies.find((c) => c._id === form.company)?.name || "CO").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="text-[1.25rem] font-semibold tracking-tight text-[#111827]">{form.title || "Job title"}</h3>
                <p className="text-[15px] text-[#6b7280]">
                  {companies.find((c) => c._id === form.company)?.name || "Company"}
                  {form.location ? ` · ${form.location}` : ""}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 text-[14px] text-[#6b7280]">
            <span>
              {form.currency} {form.minSalary.toLocaleString()}–{form.maxSalary.toLocaleString()}
            </span>
            <span>{form.employmentType === "Full Time" ? "Full-time" : form.employmentType}</span>
            <span>Today</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#e5e7eb] pt-4">
            <span className="rounded-[7px] bg-[#f8fafc] px-2 py-1 text-[12px] font-semibold text-[#6b7280]">{form.category || "Category"}</span>
            <span className="inline-flex h-9 items-center rounded-[11px] bg-[#2563eb] px-4 text-[14px] font-semibold text-white">Apply</span>
          </div>
        </article>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!!saving}
          onClick={() => submit("draft")}
          className={cn(
            "rounded-xl border border-[#d1d5db] bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] hover:bg-[#f9fafb]",
            saving === "draft" && "opacity-60"
          )}
        >
          {saving === "draft" ? "Saving..." : "Save draft"}
        </button>
        <button
          type="submit"
          disabled={!!saving}
          className={cn(
            "rounded-xl bg-[#0f5daa] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0c4d8c]",
            saving === "published" && "opacity-60"
          )}
        >
          {saving === "published" ? "Publishing..." : job ? "Update & publish" : "Publish job"}
        </button>
      </div>
    </form>
  );
}
