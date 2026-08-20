"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { setCredentials, type AuthUser } from "@/store/authSlice";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate", companyName: "" });
  const dispatch = useDispatch();
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const data = await api<{ token: string; user: AuthUser }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      dispatch(setCredentials(data));
      router.push(data.user.role === "candidate" ? "/candidate" : "/recruiter");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not create account");
    }
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <form onSubmit={onSubmit} className="w-full max-w-[440px] rounded-[14px] border border-slate-200 p-8 shadow-sm dark:border-slate-800">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">Candidates join free. Companies can post after verification.</p>
        <div className="mt-6 space-y-4">
          <div><Label>Full name</Label><Input className="mt-1" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Email</Label><Input className="mt-1" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div>
            <Label>I am a</Label>
            <select className="mt-1 h-10 w-full rounded-[12px] border border-slate-200 bg-transparent px-3 text-sm dark:border-slate-800" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
              <option value="hr_manager">HR Manager</option>
              <option value="company">Company admin</option>
            </select>
          </div>
          {form.role !== "candidate" && (
            <div><Label>Company name</Label><Input className="mt-1" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
          )}
          <div><Label>Password</Label><Input className="mt-1" type="password" minLength={8} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <Button className="w-full" type="submit">Create account</Button>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="text-blue-600">Log in</Link></p>
      </form>
    </section>
  );
}
