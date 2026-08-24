"use client";

import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export function ExclusiveOffer() {
  const benefits = [
    "Priority Job Alerts",
    "Career Support",
    "Exclusive Opportunities",
  ];

  return (
    <section className="bg-white py-5 sm:py-7">
      <div className="mx-auto w-full max-w-[var(--max-w)] px-4 sm:px-5">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#03224c] bg-gradient-to-r from-[#03224c] via-[#072a5a] to-[#03224c] px-5 py-7 sm:px-8 sm:py-8 lg:px-9 lg:py-8 shadow-md border border-[#0f5daa]/30">
          {/* Background subtle glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[#0f5daa]/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-[var(--cta)]/10 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-6 lg:flex-row lg:gap-8">
            {/* LEFT SIDE — OFFER MESSAGE & BENEFITS */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cta)] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-white shadow-sm">
                <Sparkles size={11} className="animate-pulse" />
                EXCLUSIVE OFFER
              </span>

              {/* Force pure white color via inline style to override global h3 color rules */}
              <h3
                className="mt-2.5 text-[24px] font-black leading-tight sm:text-[28px] lg:text-[30px] tracking-tight !text-white"
                style={{ color: "#ffffff" }}
              >
                Get 7 Job Interviews
              </h3>

              <p className="mt-1 text-[13px] font-normal leading-snug text-slate-300 sm:text-[14px]">
                Unlock more career opportunities with Asian Hawks membership.
              </p>

              <ul className="mt-3.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] font-semibold text-white lg:justify-start">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-1.5">
                    <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#0f5daa] text-white">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span style={{ color: "#ffffff" }}>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CENTER — INTEGRATED PRICE BLOCK */}
            <div className="flex shrink-0 items-center justify-center">
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 backdrop-blur-sm text-center">
                <div className="flex items-baseline justify-center gap-2">
                  <span
                    className="text-[40px] font-black leading-none tracking-tight sm:text-[46px] lg:text-[48px] !text-white"
                    style={{ color: "#ffffff" }}
                  >
                    ₹99
                  </span>
                  <span
                    className="text-[14px] font-extrabold uppercase tracking-wide"
                    style={{ color: "#cbd5e1" }}
                  >
                    / MONTH
                  </span>
                </div>
                <p
                  className="mt-2 text-[11px] font-medium tracking-normal"
                  style={{ color: "#94a3b8" }}
                >
                  Simple monthly plan
                </p>
              </div>
            </div>

            {/* RIGHT SIDE — GUARANTEE & CTA */}
            <div className="flex flex-col items-center justify-center gap-3.5 lg:items-end">
              <div className="inline-flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-amber-300 backdrop-blur-sm">
                <ShieldCheck size={16} className="shrink-0 text-amber-400" />
                <span className="text-[11px] font-extrabold tracking-wider uppercase">
                  7 JOB INTERVIEWS GUARANTEED
                </span>
              </div>

              <Link
                href="/signup?offer=99"
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--cta)] px-7 text-[14px] font-bold text-white shadow-md transition-all duration-200 hover:bg-[var(--cta-hover)] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--cta)] focus:ring-offset-2 focus:ring-offset-[#03224c] sm:w-auto"
              >
                <span>REGISTER NOW</span>
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
