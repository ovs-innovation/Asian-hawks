"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export default function CandidateProfile() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [form, setForm] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    location: user?.location || "",
    bio: "",
  });
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await api("/auth/me", { method: "PATCH", body: JSON.stringify(form) });
      toast.success("Profile saved");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    }
  }
  return (
    <>
      <PageHeader title="Profile" body="This is what recruiters see first." />
      <form onSubmit={onSubmit} className="max-w-xl space-y-4">
        <div><Label>Name</Label><Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div><Label>Headline</Label><Input className="mt-1" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} /></div>
        <div><Label>Location</Label><Input className="mt-1" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        <div><Label>About</Label><Textarea className="mt-1" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
        <Button type="submit">Save</Button>
      </form>
    </>
  );
}
