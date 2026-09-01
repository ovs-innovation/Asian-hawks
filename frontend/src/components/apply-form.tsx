"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { CheckCircle2, FileUp, Shield, Sparkles, FileText, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, Badge } from "@/components/ui/primitives";
import { API_URL } from "@/lib/utils";
import { api } from "@/lib/api";
import type { RootState } from "@/store";
import type { ResumeData } from "@/types/resume";

export function ApplyForm({ jobTitle, jobSlug }: { jobTitle?: string; jobSlug?: string }) {
  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [resume, setResume] = useState<File | null>(null);
  const [savedResume, setSavedResume] = useState<ResumeData | null>(null);
  const [useSavedResume, setUseSavedResume] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  // Prepopulate from user and check saved resume
  useEffect(() => {
    if (hydrated && user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));

      api<{ item: ResumeData }>("/resume")
        .then((res) => {
          if (res?.item) {
            setSavedResume(res.item);
            setUseSavedResume(true);
            if (res.item.personalInfo?.phone && !form.phone) {
              setForm((prev) => ({ ...prev, phone: res.item.personalInfo.phone }));
            }
          }
        })
        .catch(() => {});
    }
  }, [hydrated, user]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!useSavedResume && !resume) {
      toast.error("Please attach your resume (PDF or Word) or use your saved resume");
      return;
    }
    setSending(true);
    try {
      const body = new FormData();
      body.append("name", form.name);
      body.append("email", form.email);
      body.append("phone", form.phone);
      body.append("message", form.message);
      if (jobTitle) body.append("jobTitle", jobTitle);
      if (jobSlug) body.append("jobSlug", jobSlug);

      if (useSavedResume && savedResume) {
        body.append(
          "savedResumeSummary",
          `Asian Hawks Resume (${savedResume.template.toUpperCase()} template, Completeness: ${savedResume.completeness}%)`
        );
        if (savedResume.fileUrl) {
          body.append("resumeUrl", savedResume.fileUrl);
        }
      }

      if (resume) {
        body.append("resume", resume);
      }

      const res = await fetch(`${API_URL}/apply`, { method: "POST", body, credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not submit application");
      setDone(true);
      toast.success("Application submitted. HR will contact you.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setResume(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not submit application");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-[#dbeafe] bg-[#eff6ff] p-5 text-center">
        <CheckCircle2 className="mx-auto text-[#0f5daa]" size={28} />
        <p className="mt-3 text-[15px] font-semibold text-[#111827]">Application received</p>
        <p className="mt-1 text-[13px] leading-6 text-[#4b5563]">
          Our HR team will review your resume and contact you on phone or email.
        </p>
        <button type="button" className="mt-4 text-[13px] font-semibold text-[#0f5daa]" onClick={() => setDone(false)}>
          Apply for another role
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {jobTitle && (
        <p className="text-[13px] text-[#64748b]">
          Applying for <span className="font-semibold text-[#111827]">{jobTitle}</span>
        </p>
      )}

      <div>
        <Label htmlFor="name">Full name *</Label>
        <Input
          id="name"
          required
          className="mt-1"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="As on your resume"
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          required
          className="mt-1"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@email.com"
        />
      </div>

      <div>
        <Label htmlFor="phone">Mobile number *</Label>
        <Input
          id="phone"
          required
          className="mt-1"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="10-digit mobile"
        />
      </div>

      {/* Resume Selection */}
      <div className="space-y-2">
        <Label>Resume Attachment *</Label>

        {savedResume && (
          <div
            onClick={() => {
              setUseSavedResume(true);
              setResume(null);
            }}
            className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
              useSavedResume
                ? "border-[#0f5daa] bg-blue-50/60 shadow-2xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#0f5daa] text-white">
                <FileText size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {savedResume.personalInfo?.fullName || "My Resume"}
                </p>
                <p className="text-[11px] text-slate-500 capitalize">
                  {savedResume.template} Template · {savedResume.completeness}% Complete
                </p>
              </div>
            </div>
            {useSavedResume && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0f5daa] text-white">
                <Check size={12} />
              </span>
            )}
          </div>
        )}

        <div className="pt-1">
          <label
            onClick={() => setUseSavedResume(false)}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-3.5 py-3 text-[13px] transition-colors ${
              !useSavedResume && resume
                ? "border-[#0f5daa] bg-blue-50/40 text-slate-900 font-semibold"
                : "border-slate-300 bg-slate-50/70 text-slate-500 hover:border-[#0f5daa]"
            }`}
          >
            <FileUp size={18} className="text-[#0f5daa]" />
            <span className="min-w-0 truncate">
              {resume ? resume.name : savedResume ? "Or upload a different resume file" : "Upload PDF or Word (max 10 MB)"}
            </span>
            <input
              id="resume"
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                setResume(e.target.files?.[0] || null);
                setUseSavedResume(false);
              }}
            />
          </label>
        </div>

        {!savedResume && (
          <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>Don't have a resume ready?</span>
            <Link
              href="/candidate/resume/builder"
              className="text-[#0f5daa] font-bold hover:underline inline-flex items-center gap-1"
            >
              <Sparkles size={12} /> Build one in 2 mins
            </Link>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="message">Cover note</Label>
        <Textarea
          id="message"
          className="mt-1"
          placeholder="Optional — why you are a good fit"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <p className="flex items-start gap-2 text-[12px] leading-5 text-[#64748b]">
        <Shield size={14} className="mt-0.5 shrink-0 text-[#0f5daa]" />
        Your resume is shared only with Asian Hawks hiring team. We contact you on {form.phone || "your number"} or email.
      </p>

      <Button type="submit" className="w-full" disabled={sending}>
        {sending ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
