"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/primitives";
import { CATEGORIES } from "@/lib/demo-data";
import { api } from "@/lib/api";

export default function NewJobPage() {
  const [form, setForm] = useState({
    title: "",
    department: "",
    category: "Banking Jobs",
    subCategory: "",
    industry: "Banking",
    employmentType: "Full Time",
    workplace: "Onsite",
    experience: "Freshers Welcome",
    minSalary: 19500,
    maxSalary: 25000,
    currency: "INR",
    vacancies: 1,
    skills: "TypeScript, Product sense",
    responsibilities: "",
    requirements: "",
    benefits: "",
    qualifications: "",
    languages: "English",
    location: "",
    mapUrl: "",
    featured: false,
    urgent: false,
    seoTitle: "",
    metaDescription: "",
    keywords: "",
    status: "draft",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(status: "draft" | "published") {
    try {
      await api("/jobs", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          status,
          skills: form.skills.split(",").map((s) => s.trim()),
          languages: form.languages.split(",").map((s) => s.trim()),
          keywords: form.keywords.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      toast.success(status === "published" ? "Job published" : "Draft saved");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not save job");
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit("published");
  }

  return (
    <>
      <PageHeader title="Post a job" body="Salary, process, and location are required. Two minutes if you have them ready." />
      <form onSubmit={onSubmit} className="grid max-w-3xl gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div><Label>Job title</Label><Input className="mt-1" required value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div><Label>Department</Label><Input className="mt-1" value={form.department} onChange={(e) => set("department", e.target.value)} /></div>
          <div>
            <Label>Category</Label>
            <select className="mt-1 h-10 w-full rounded-[12px] border border-slate-200 px-3 text-sm dark:border-slate-800 dark:bg-transparent" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><Label>Sub category</Label><Input className="mt-1" value={form.subCategory} onChange={(e) => set("subCategory", e.target.value)} /></div>
          <div>
            <Label>Employment type</Label>
            <select className="mt-1 h-10 w-full rounded-[12px] border border-slate-200 px-3 text-sm dark:border-slate-800 dark:bg-transparent" value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)}>
              {["Full Time", "Part Time", "Contract", "Internship", "Freelance"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <Label>Workplace</Label>
            <select className="mt-1 h-10 w-full rounded-[12px] border border-slate-200 px-3 text-sm dark:border-slate-800 dark:bg-transparent" value={form.workplace} onChange={(e) => set("workplace", e.target.value)}>
              {["Remote", "Hybrid", "Onsite"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div><Label>Experience</Label><Input className="mt-1" value={form.experience} onChange={(e) => set("experience", e.target.value)} /></div>
          <div><Label>Location</Label><Input className="mt-1" value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
          <div><Label>Min salary</Label><Input className="mt-1" type="number" value={form.minSalary} onChange={(e) => set("minSalary", Number(e.target.value))} /></div>
          <div><Label>Max salary</Label><Input className="mt-1" type="number" value={form.maxSalary} onChange={(e) => set("maxSalary", Number(e.target.value))} /></div>
          <div><Label>Currency</Label><Input className="mt-1" value={form.currency} onChange={(e) => set("currency", e.target.value)} /></div>
          <div><Label>Vacancies</Label><Input className="mt-1" type="number" value={form.vacancies} onChange={(e) => set("vacancies", Number(e.target.value))} /></div>
        </div>
        <div><Label>Required skills</Label><Input className="mt-1" value={form.skills} onChange={(e) => set("skills", e.target.value)} /></div>
        <div><Label>Responsibilities</Label><Textarea className="mt-1" value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} /></div>
        <div><Label>Requirements</Label><Textarea className="mt-1" value={form.requirements} onChange={(e) => set("requirements", e.target.value)} /></div>
        <div><Label>Benefits</Label><Textarea className="mt-1" value={form.benefits} onChange={(e) => set("benefits", e.target.value)} /></div>
        <div><Label>Qualifications</Label><Textarea className="mt-1" value={form.qualifications} onChange={(e) => set("qualifications", e.target.value)} /></div>
        <div><Label>Google Maps URL</Label><Input className="mt-1" value={form.mapUrl} onChange={(e) => set("mapUrl", e.target.value)} /></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div><Label>SEO title</Label><Input className="mt-1" value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} /></div>
          <div><Label>Keywords</Label><Input className="mt-1" value={form.keywords} onChange={(e) => set("keywords", e.target.value)} /></div>
        </div>
        <div><Label>Meta description</Label><Textarea className="mt-1" value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured job</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.urgent} onChange={(e) => set("urgent", e.target.checked)} /> Urgent hiring</label>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => submit("draft")}>Save draft</Button>
          <Button type="submit">Publish</Button>
        </div>
      </form>
    </>
  );
}
