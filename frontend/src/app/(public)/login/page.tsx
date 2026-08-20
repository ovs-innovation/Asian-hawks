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

function dest(role: AuthUser["role"]) {
  if (role === "super_admin" || role === "moderator") return "/admin";
  if (role === "candidate") return "/candidate";
  return "/recruiter";
}

export default function LoginPage() {
  const [email, setEmail] = useState("admin@northline.com");
  const [password, setPassword] = useState("Admin@12345");
  const dispatch = useDispatch();
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const data = await api<{ token: string; user: AuthUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      dispatch(setCredentials(data));
      router.push(dest(data.user.role));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not sign in. Is the API running?");
    }
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <form onSubmit={onSubmit} className="w-full max-w-[440px] rounded-[14px] border border-slate-200 p-8 shadow-sm dark:border-slate-800">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-blue-600">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold">Log in</h1>
        <p className="mt-2 text-sm text-slate-500">Demo: maya@example.com, talent@helios-bank.com, or admin@northline.com — Password@123 / Admin@12345</p>
        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Work email</Label>
            <Input id="email" type="email" className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button className="w-full" type="submit">Continue</Button>
        </div>
        <p className="mt-4 text-center text-sm text-slate-500">
          <Link href="/forgot-password" className="text-blue-600">Forgot password</Link>
          {" · "}
          <Link href="/signup" className="text-blue-600">Create an account</Link>
        </p>
      </form>
    </section>
  );
}
