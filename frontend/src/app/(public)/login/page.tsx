"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { setCredentials, type AuthUser } from "@/store/authSlice";
import type { RootState } from "@/store";

function dest(role: AuthUser["role"], redirect?: string | null) {
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }
  if (role === "super_admin" || role === "moderator") return "/admin";
  if (role === "candidate") return "/candidate";
  return "/recruiter";
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && user) {
      router.replace(dest(user.role, redirect));
    }
  }, [hydrated, user, redirect, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const data = await api<{ token: string; user: AuthUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      dispatch(setCredentials(data));
      router.push(dest(data.user.role, redirect));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not sign in. Is the API running?");
    }
  }

  const signupHref = redirect ? `/signup?redirect=${encodeURIComponent(redirect)}` : "/signup";

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[440px] rounded-[14px] border border-slate-200 p-8 shadow-sm dark:border-slate-800 bg-white">
      <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-blue-600">Welcome back</p>
      <h1 className="mt-2 text-3xl font-bold">Log in</h1>
      <p className="mt-2 text-sm text-slate-500">Sign in to edit your resume and apply for jobs.</p>
      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" required className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button className="w-full" type="submit">Continue</Button>
      </div>
      <p className="mt-4 text-center text-sm text-slate-500">
        <Link href="/forgot-password" className="text-blue-600">Forgot password</Link>
        {" · "}
        <Link href={signupHref} className="text-blue-600">Create an account</Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
