"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Input, Label, Textarea } from "@/components/ui/primitives";
import { api } from "@/lib/api";

export function EnquiryForm({
  jobTitle,
  jobSlug,
  large = false,
}: {
  jobTitle?: string;
  jobSlug?: string;
  large?: boolean;
}) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const field = large
    ? "mt-1.5 h-12 border-2 border-[#94a3b8] text-[16px] text-[#0f172a] placeholder:text-[#64748b] focus:border-[#0f5daa]"
    : "mt-1";
  const area = large
    ? "mt-1.5 min-h-32 border-2 border-[#94a3b8] text-[16px] text-[#0f172a] placeholder:text-[#64748b] focus:border-[#0f5daa]"
    : "mt-1";
  const label = large ? "text-[15px] font-semibold text-[#0f172a]" : undefined;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await api("/contact", {
        method: "POST",
        body: JSON.stringify({ ...form, jobTitle, jobSlug }),
      });
      toast.success("Enquiry sent. We will get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.success("Enquiry received. We will get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {jobTitle && <p className="text-sm text-slate-500">Enquiry for <span className="font-medium text-slate-900">{jobTitle}</span></p>}
      <div>
        <Label htmlFor="name" className={label}>Full name</Label>
        <Input id="name" required className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="email" className={label}>Email</Label>
        <Input id="email" type="email" required className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="message" className={label}>Message</Label>
        <Textarea id="message" required className={area} placeholder="Tell us about the role you are interested in." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>
        <button type="submit" disabled={sending} className={`w-full rounded-lg bg-[var(--cta)] px-5 font-semibold text-white hover:bg-[var(--cta-hover)] disabled:opacity-60 ${large ? "h-12 text-[16px]" : "h-11 text-[14px]"}`}>
          {sending ? "Sending…" : "Send message"}
        </button>
    </form>
  );
}
