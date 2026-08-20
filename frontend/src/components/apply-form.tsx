"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, FileUp, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/primitives";
import { API_URL } from "@/lib/utils";

export function ApplyForm({ jobTitle, jobSlug }: { jobTitle?: string; jobSlug?: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [resume, setResume] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!resume) {
      toast.error("Please attach your resume (PDF or Word)");
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
      body.append("resume", resume);

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
        <Input id="name" required className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="As on your resume" />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" required className="mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
      </div>
      <div>
        <Label htmlFor="phone">Mobile number *</Label>
        <Input id="phone" required className="mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile" />
      </div>
      <div>
        <Label htmlFor="resume">Resume / CV *</Label>
        <label className="mt-1 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-3 py-3 text-[13px] text-[#64748b] hover:border-[#0f5daa]">
          <FileUp size={18} className="text-[#0f5daa]" />
          <span className="min-w-0 truncate">{resume ? resume.name : "Upload PDF or Word (max 5 MB)"}</span>
          <input
            id="resume"
            type="file"
            className="sr-only"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
          />
        </label>
      </div>
      <div>
        <Label htmlFor="message">Cover note</Label>
        <Textarea id="message" className="mt-1" placeholder="Optional — why you are a good fit" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
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
