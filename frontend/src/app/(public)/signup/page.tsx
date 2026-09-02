"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Building2,
  User,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { setCredentials, type AuthUser } from "@/store/authSlice";
import type { RootState } from "@/store";
import { cn } from "@/lib/utils";

function dest(role: AuthUser["role"], redirect?: string | null) {
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }
  return role === "candidate" ? "/candidate" : "/recruiter";
}

function SignupForm() {
  const searchParams = useSearchParams();
  const offer = searchParams.get("offer");
  const redirect = searchParams.get("redirect");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "candidate" as "candidate" | "recruiter" | "hr_manager" | "company",
    workStatus: "experienced" as "experienced" | "fresher",
    companyName: "",
    whatsappUpdates: true,
  });

  const [submitting, setSubmitting] = useState(false);
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
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        role: form.role,
        companyName: form.companyName.trim(),
        experienceLevel: form.workStatus === "fresher" ? "Fresher" : "Experienced",
      };

      const data = await api<{ token: string; user: AuthUser }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      dispatch(setCredentials(data));
      toast.success("Account created successfully!");
      router.push(dest(data.user.role, redirect));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setSubmitting(false);
    }
  }

  const loginHref = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login";

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-6 lg:gap-8">
      {/* Left Card: Benefit / Trust Banner */}
      <div className="w-full lg:w-[320px] shrink-0 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col items-center text-center">
        {/* Illustration Avatar */}
        <div className="relative mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/80 shadow-inner">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[#0f5daa] text-white shadow-md">
            <User size={40} />
          </div>
          <div className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white shadow-xs border-2 border-white">
            <Sparkles size={16} />
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 tracking-tight">On registering, you can</h3>

        <ul className="mt-5 space-y-4 text-left text-xs font-medium text-slate-600 w-full">
          <li className="flex items-start gap-3">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
              <CheckCircle2 size={13} />
            </span>
            <span className="leading-snug">Build your profile and let top recruiters find you</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
              <CheckCircle2 size={13} />
            </span>
            <span className="leading-snug">Get job postings delivered right to your email</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
              <CheckCircle2 size={13} />
            </span>
            <span className="leading-snug">Find a job and grow your career with Asian Hawks</span>
          </li>
        </ul>
      </div>

      {/* Main Registration Form Card (Naukri Style) */}
      <form
        onSubmit={onSubmit}
        className="w-full flex-1 max-w-[640px] bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm space-y-6"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create your Asian Hawks profile
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
            Search & apply to jobs from India&apos;s trusted manpower network
          </p>
        </div>

        {offer === "99" && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs text-blue-900 shadow-2xs">
            <p className="font-bold text-[#0f5daa] text-sm flex items-center gap-1.5">
              <span>🎉 ₹99 Exclusive Membership Offer Selected</span>
            </p>
            <p className="mt-1 text-slate-600 leading-relaxed">
              Register your account below to activate 7 Guaranteed Job Interviews.
            </p>
          </div>
        )}

        {/* Role Switcher Pills */}
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Registering as</Label>
          <div className="mt-2 grid grid-cols-2 gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, role: "candidate" }))}
              className={cn(
                "py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                form.role === "candidate"
                  ? "bg-white text-[#0f5daa] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <User size={15} />
              <span>Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, role: "recruiter" }))}
              className={cn(
                "py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                form.role !== "candidate"
                  ? "bg-white text-[#0f5daa] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Building2 size={15} />
              <span>Employer / Recruiter</span>
            </button>
          </div>
        </div>

        {form.role !== "candidate" && (
          <div>
            <Label className="text-xs font-bold text-slate-700">Company Name *</Label>
            <Input
              className="mt-1.5 rounded-xl h-11"
              placeholder="Enter your registered company name"
              required
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </div>
        )}

        {/* Form Inputs Grid */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <Label className="text-xs font-bold text-slate-700">Full name *</Label>
            <Input
              className="mt-1.5 rounded-xl h-11 text-slate-900 placeholder:text-slate-400"
              placeholder="What is your name?"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email ID */}
          <div>
            <Label className="text-xs font-bold text-slate-700">Email ID *</Label>
            <Input
              className="mt-1.5 rounded-xl h-11 text-slate-900 placeholder:text-slate-400"
              type="email"
              placeholder="Tell us your Email ID"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <p className="mt-1 text-[11px] font-medium text-slate-400">
              We&apos;ll send relevant jobs and updates to this email
            </p>
          </div>

          {/* Password */}
          <div>
            <Label className="text-xs font-bold text-slate-700">Password *</Label>
            <Input
              className="mt-1.5 rounded-xl h-11 text-slate-900 placeholder:text-slate-400"
              type="password"
              placeholder="(Minimum 6 characters)"
              minLength={6}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className="mt-1 text-[11px] font-medium text-slate-400">
              This helps your account stay protected
            </p>
          </div>

          {/* Mobile Number */}
          <div>
            <Label className="text-xs font-bold text-slate-700">Mobile number *</Label>
            <div className="relative mt-1.5 flex items-center">
              <span className="absolute left-3 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                +91
              </span>
              <Input
                className="pl-16 rounded-xl h-11 text-slate-900 placeholder:text-slate-400"
                type="tel"
                placeholder="Enter your mobile number"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <p className="mt-1 text-[11px] font-medium text-slate-400">
              Recruiters will contact you on this number
            </p>
          </div>

          {/* Work Status Interactive Cards (Candidates Only) */}
          {form.role === "candidate" && (
            <div className="pt-2">
              <Label className="text-xs font-bold text-slate-700">Work status *</Label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Experienced Card */}
                <div
                  onClick={() => setForm((prev) => ({ ...prev, workStatus: "experienced" }))}
                  className={cn(
                    "relative flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none",
                    form.workStatus === "experienced"
                      ? "border-[#0f5daa] bg-blue-50/30 ring-2 ring-[#0f5daa]/10"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors",
                      form.workStatus === "experienced"
                        ? "bg-[#0f5daa] text-white"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">I&apos;m experienced</h4>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-snug">
                      I have work experience (excluding internships)
                    </p>
                  </div>
                </div>

                {/* Fresher Card */}
                <div
                  onClick={() => setForm((prev) => ({ ...prev, workStatus: "fresher" }))}
                  className={cn(
                    "relative flex items-start gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer select-none",
                    form.workStatus === "fresher"
                      ? "border-[#0f5daa] bg-blue-50/30 ring-2 ring-[#0f5daa]/10"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-colors",
                      form.workStatus === "fresher"
                        ? "bg-[#0f5daa] text-white"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">I&apos;m a fresher</h4>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-snug">
                      I am a student / Haven&apos;t worked after graduation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button & Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <Button
            disabled={submitting}
            type="submit"
            className="h-11 px-8 rounded-full bg-[#0f5daa] hover:bg-[#0c4d8c] text-white font-bold text-xs shadow-md transition-all w-full sm:w-auto cursor-pointer"
          >
            <span>{submitting ? "Registering…" : "Register now"}</span>
          </Button>

          <p className="text-xs font-semibold text-slate-500 text-center sm:text-right">
            Already have an account?{" "}
            <Link href={loginHref} className="text-[#0f5daa] font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function SignupPage() {
  return (
    <section className="min-h-[85vh] bg-[#f8fafc] py-8 sm:py-12 px-4 sm:px-6 flex items-center justify-center">
      <Suspense fallback={<div className="text-sm font-medium text-slate-500">Loading registration form…</div>}>
        <SignupForm />
      </Suspense>
    </section>
  );
}
