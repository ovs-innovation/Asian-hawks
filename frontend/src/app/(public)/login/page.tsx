"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Check, Eye, EyeOff, KeyRound, Mail, Sparkles, UserCheck } from "lucide-react";
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

  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [otpStep, setOtpStep] = useState<"send" | "verify">("send");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && user) {
      router.replace(dest(user.role, redirect));
    }
  }, [hydrated, user, redirect, router]);

  // Standard Password Login
  async function onSubmitPassword(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your email address and password.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await api<{ token: string; user: AuthUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      dispatch(setCredentials(data));
      toast.success("Successfully logged in!");
      router.push(dest(data.user.role, redirect));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not sign in. Is the API running?");
    } finally {
      setSubmitting(false);
    }
  }

  // Send OTP
  async function handleSendOtp(e?: FormEvent) {
    if (e) e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await api<{ ok: boolean; message: string; devOtp?: string }>("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
      });
      toast.success(res.message || "OTP sent to your registered email address!");
      setOtpStep("verify");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send OTP.");
    } finally {
      setSendingOtp(false);
    }
  }

  // Verify OTP
  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !otpCode.trim()) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await api<{ token: string; user: AuthUser }>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), otp: otpCode.trim() }),
      });
      dispatch(setCredentials(data));
      toast.success("Successfully logged in with OTP!");
      router.push(dest(data.user.role, redirect));
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid or expired OTP code.");
    } finally {
      setSubmitting(false);
    }
  }

  const signupHref = redirect ? `/signup?redirect=${encodeURIComponent(redirect)}` : "/signup";

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 lg:gap-0 relative">
      {/* Left Card: "New to Asian Hawks?" Teaser */}
      <div className="w-full lg:w-[440px] shrink-0 bg-white rounded-3xl lg:rounded-r-none border border-slate-200/90 p-8 sm:p-10 shadow-xs flex flex-col justify-between relative overflow-hidden z-0">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">New to Asian Hawks?</h3>

          <ul className="mt-6 space-y-4 text-xs font-medium text-slate-600">
            <li className="flex items-start gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0f5daa] border border-blue-200 mt-0.5">
                <Check size={12} className="stroke-[3]" />
              </span>
              <span className="leading-snug">One click apply using Asian Hawks profile.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0f5daa] border border-blue-200 mt-0.5">
                <Check size={12} className="stroke-[3]" />
              </span>
              <span className="leading-snug">Get relevant job recommendations.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0f5daa] border border-blue-200 mt-0.5">
                <Check size={12} className="stroke-[3]" />
              </span>
              <span className="leading-snug">Showcase profile to top companies and consultants.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-50 text-[#0f5daa] border border-blue-200 mt-0.5">
                <Check size={12} className="stroke-[3]" />
              </span>
              <span className="leading-snug">Know application status on applied jobs.</span>
            </li>
          </ul>

          <div className="mt-8">
            <Link
              href={signupHref}
              className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-[#0f5daa] px-6 text-xs font-bold text-[#0f5daa] hover:bg-blue-50 transition-all text-center w-full sm:w-auto"
            >
              Register for Free
            </Link>
          </div>
        </div>

        {/* Vector Illustration Graphic */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-slate-500 text-xs font-medium w-full">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0f5daa] text-white shadow-xs">
              <UserCheck size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-xs">Fast &amp; Verified Hiring</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Connect with top employers across India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Elevated Login Card (Naukri Style) */}
      <div className="w-full max-w-[460px] bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xl lg:-ml-6 z-10 my-auto shrink-0">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Login</h1>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          {loginMode === "password"
            ? "Welcome back! Please enter your details."
            : otpStep === "send"
            ? "Log in instantly via 6-digit OTP code."
            : `Enter the OTP sent to ${email}`}
        </p>

        {/* Password Login Mode */}
        {loginMode === "password" ? (
          <form onSubmit={onSubmitPassword} className="mt-6 space-y-5">
            {/* Email / Username */}
            <div>
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                Email ID / Username *
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="Enter Email ID / Username"
                className="mt-1.5 rounded-xl h-11 text-slate-900 placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                Password *
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter Password"
                  className="pr-16 rounded-xl h-11 text-slate-900 placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0f5daa] hover:underline cursor-pointer select-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="flex justify-end mt-1.5">
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#0f5daa] hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              disabled={submitting}
              type="submit"
              className="w-full h-11 sm:h-12 rounded-xl bg-[#0f5daa] hover:bg-[#0c4d8c] text-white font-bold text-xs shadow-md transition-all cursor-pointer mt-2"
            >
              <span>{submitting ? "Logging in…" : "Login"}</span>
            </Button>

            {/* Switch to OTP Login */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setLoginMode("otp");
                  setOtpStep("send");
                }}
                className="text-xs font-bold text-[#0f5daa] hover:underline transition-colors cursor-pointer"
              >
                Use OTP to Login
              </button>
            </div>
          </form>
        ) : (
          /* OTP Login Mode */
          <div className="mt-6 space-y-5">
            {otpStep === "send" ? (
              /* Step 1: Send OTP */
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <Label htmlFor="otpEmail" className="text-xs font-bold text-slate-700">
                    Email ID / Username *
                  </Label>
                  <Input
                    id="otpEmail"
                    type="email"
                    required
                    placeholder="Enter Email ID registered with account"
                    className="mt-1.5 rounded-xl h-11 text-slate-900 placeholder:text-slate-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="mt-1 text-[11px] font-medium text-slate-400">
                    We&apos;ll send a 6-digit OTP code to this email
                  </p>
                </div>

                <Button
                  disabled={sendingOtp}
                  type="submit"
                  className="w-full h-11 sm:h-12 rounded-xl bg-[#0f5daa] hover:bg-[#0c4d8c] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>{sendingOtp ? "Sending OTP…" : "Send OTP"}</span>
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setLoginMode("password")}
                    className="text-xs font-bold text-[#0f5daa] hover:underline cursor-pointer"
                  >
                    Use Password to Login
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Verify OTP */
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="rounded-2xl bg-blue-50/70 border border-blue-200/80 p-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-blue-900 truncate">
                    OTP sent to <span className="font-bold">{email}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpStep("send")}
                    className="text-[#0f5daa] font-bold hover:underline shrink-0 ml-2 cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <Label htmlFor="otpCode" className="text-xs font-bold text-slate-700">
                    Enter 6-digit OTP *
                  </Label>
                  <Input
                    id="otpCode"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 123456"
                    className="mt-1.5 rounded-xl h-11 text-slate-900 text-center tracking-[0.2em] font-extrabold text-base placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-normal"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                </div>

                <Button
                  disabled={submitting}
                  type="submit"
                  className="w-full h-11 sm:h-12 rounded-xl bg-[#0f5daa] hover:bg-[#0c4d8c] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>{submitting ? "Verifying…" : "Verify & Login"}</span>
                </Button>

                <div className="flex items-center justify-between text-xs font-bold pt-1">
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={sendingOtp}
                    className="text-[#0f5daa] hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {sendingOtp ? "Sending…" : "Resend OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode("password")}
                    className="text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                  >
                    Use Password
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Mobile Registration Link */}
        <p className="mt-6 text-center text-xs font-semibold text-slate-500 lg:hidden">
          Don&apos;t have an account?{" "}
          <Link href={signupHref} className="text-[#0f5daa] font-bold hover:underline">
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <section className="min-h-[85vh] bg-[#f8fafc] py-10 sm:py-16 px-4 sm:px-6 flex items-center justify-center">
      <Suspense fallback={<div className="text-sm font-medium text-slate-500">Loading login form…</div>}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
