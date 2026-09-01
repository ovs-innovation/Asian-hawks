"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  Sparkles,
  FileCheck,
  CheckCircle2,
  Download,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutTemplate,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, Badge } from "@/components/ui/primitives";
import { TEMPLATES_META } from "@/types/resume";

export default function ResumeBuilderLandingPage() {
  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);

  const ctaHref = hydrated && user ? "/candidate/resume/builder" : "/signup";

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/80 to-[#f8fafc] px-4 py-16 sm:px-6 sm:py-24 border-b border-slate-200/80">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-[#0f5daa]">
            <Sparkles size={13} />
            <span>Asian Hawks Career Platform</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
            Build an <span className="text-[#0f5daa]">ATS-Friendly Resume</span> in 2 Minutes
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
            Write once, attach to every application. We automatically import your Asian Hawks profile data so you don't have to fill giant forms again.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Button asChild size="lg" className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white rounded-xl px-8 h-12 font-bold shadow-md text-sm">
              <Link href={ctaHref} className="flex items-center gap-2">
                <span>{hydrated && user ? "Open My Resume Builder" : "Create My Resume — Free"}</span>
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl h-12 font-bold text-slate-700 border-slate-200 text-sm">
              <Link href="/jobs">Browse Verified Jobs</Link>
            </Button>
          </div>

          {/* Quick value badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" /> 100% Free for Candidates
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-[#0f5daa]" /> ATS Parser Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={16} className="text-amber-500" /> Auto-Import Profile Data
            </span>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0f5daa]">Intelligent Workflow</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            "Use what we already know. Ask only for what is missing."
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-7 rounded-3xl border-slate-200/90 shadow-2xs space-y-3 bg-white">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#0f5daa] font-black text-base">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Automatic Profile Import</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your name, headline, location, education, and skills are imported automatically from your candidate profile.
            </p>
          </Card>

          <Card className="p-7 rounded-3xl border-slate-200/90 shadow-2xs space-y-3 bg-white">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#0f5daa] font-black text-base">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">5 Professional Templates</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Switch between ATS Professional, Modern, Minimal, Creative, and Executive styles with a single click.
            </p>
          </Card>

          <Card className="p-7 rounded-3xl border-slate-200/90 shadow-2xs space-y-3 bg-white">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#0f5daa] font-black text-base">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">1-Click Job Applications</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Download clean vector PDFs or attach your saved resume directly when applying for banking and private roles.
            </p>
          </Card>
        </div>
      </section>

      {/* 5 Templates Showcase */}
      <section className="bg-white border-y border-slate-200/80 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <Badge tone="blue">5 ATS Templates</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Designed for Maximum Recruiter Readability
            </h2>
            <p className="text-xs text-slate-500">
              Every template uses clean typography, clear section hierarchy, and zero pixelated images.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(TEMPLATES_META).map((tpl) => (
              <Card key={tpl.id} className="p-6 rounded-3xl border-slate-200/90 hover:border-blue-200 hover:shadow-md transition-all space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <LayoutTemplate size={18} className="text-[#0f5daa]" />
                    <h3 className="text-base font-bold text-slate-900">{tpl.name}</h3>
                  </div>
                  {tpl.isRecommended && (
                    <Badge tone="blue" className="text-[10px] font-bold">
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{tpl.description}</p>
                <div className="pt-2">
                  <Button asChild variant="outline" className="w-full rounded-xl text-xs font-bold border-slate-200 hover:border-[#0f5daa]">
                    <Link href={ctaHref}>Use This Template →</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Ready to create your resume?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Join thousands of candidates getting hired through Asian Hawks Manpower Services.
        </p>
        <Button asChild size="lg" className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white rounded-xl px-8 h-12 font-bold shadow-md text-sm">
          <Link href={ctaHref} className="flex items-center gap-2">
            <span>{hydrated && user ? "Open My Resume Workspace" : "Get Started Now"}</span>
            <ArrowRight size={16} />
          </Link>
        </Button>
      </section>
    </div>
  );
}
