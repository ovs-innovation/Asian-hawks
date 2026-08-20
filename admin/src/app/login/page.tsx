"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import { setCredentials } from "@/store/authSlice";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("admin@asianhawks.in");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api<{ user: { id: string; name: string; email: string; role: "super_admin" | "recruiter" | "hr_manager" | "company" | "candidate" | "moderator" }; token: string }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) }
      );
      if (!["super_admin", "moderator"].includes(data.user.role)) {
        setError("Access denied. Admin credentials required.");
        return;
      }
      dispatch(setCredentials(data));
      router.replace("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef4fb_0%,#f7faff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[980px] rounded-[32px] border border-white/80 bg-white shadow-[0_30px_80px_rgba(15,93,170,0.12)]">
          <div className="grid md:grid-cols-[1fr_420px]">
            <div className="hidden border-r border-[#eef2f7] bg-[linear-gradient(180deg,#fbfdff_0%,#f4f8fd_100%)] p-10 md:block">
              <div className="inline-flex items-center rounded-[22px] bg-white px-5 py-4 shadow-sm ring-1 ring-[#e8eef6]">
                <Image
                  src="/logo.png"
                  alt="Asian Hawks"
                  width={260}
                  height={78}
                  className="h-auto w-[220px]"
                  priority
                />
              </div>

              <div className="mt-12">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f5daa]">Control Center</p>
                <h1 className="mt-4 max-w-md text-4xl font-bold leading-tight text-[#111827]">
                  Keep jobs, users and companies under control.
                </h1>
                <p className="mt-4 max-w-md text-sm leading-7 text-[#6b7280]">
                  Dedicated admin access for approvals, moderation, audit logs, billing and platform settings.
                </p>
              </div>

              <div className="mt-10 space-y-3">
                {["Review pending jobs", "Manage recruiters and candidates", "Track admin activity"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-[#e8eef6] bg-white px-4 py-3 text-sm text-[#374151]"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0f5daa]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-10">
              <div className="mx-auto w-full max-w-sm">
                <div className="mb-8 text-center md:text-left">
                  <div className="mx-auto mb-5 flex justify-center md:mx-0 md:justify-start">
                    <Image
                      src="/logo.png"
                      alt="Asian Hawks"
                      width={220}
                      height={66}
                      className="h-auto w-[180px]"
                      priority
                    />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f5daa]">Welcome Back</p>
                  <h2 className="mt-2 text-3xl font-bold text-[#111827]">Sign in to Admin</h2>
                  <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                    Enter your admin credentials to continue.
                  </p>
                </div>

                <div className="rounded-[28px] border border-[#ebf0f6] bg-white p-5 shadow-[0_18px_50px_rgba(15,93,170,0.08)] sm:p-6">
                  {error && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-[#d8e2ee] bg-[#fbfdff] px-4 py-3 text-sm text-[#111827] outline-none transition focus:border-[#0f5daa] focus:bg-white focus:ring-4 focus:ring-[#0f5daa]/10"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#374151]">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full rounded-2xl border border-[#d8e2ee] bg-[#fbfdff] px-4 py-3 pr-12 text-sm text-[#111827] outline-none transition focus:border-[#0f5daa] focus:bg-white focus:ring-4 focus:ring-[#0f5daa]/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#6b7280] transition hover:text-[#0f5daa]"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        "w-full rounded-2xl bg-[#0f5daa] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,93,170,0.22)] transition",
                        loading ? "cursor-not-allowed opacity-60" : "hover:bg-[#0c4d8c]"
                      )}
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
