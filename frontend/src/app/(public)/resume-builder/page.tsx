"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutTemplate,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, Badge } from "@/components/ui/primitives";
import { TEMPLATES_META, type TemplateId } from "@/types/resume";
import { PublicTemplateCard } from "@/components/resume/templates/public-template-card";

const ALL_TEMPLATES: TemplateId[] = ["ats", "modern", "minimal", "creative", "executive"];

export default function ResumeBuilderLandingPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);

  const handleUseTemplate = (templateId: TemplateId) => {
    const targetUrl = `/candidate/resume/builder?template=${templateId}`;
    if (hydrated && user) {
      router.push(targetUrl);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(targetUrl)}`);
    }
  };

  const filteredTemplates = useMemo(() => {
    if (activeFilter === "all") return ALL_TEMPLATES;
    if (activeFilter === "ats") return ALL_TEMPLATES.filter((id) => id === "ats");
    return ALL_TEMPLATES.filter((id) => id === activeFilter);
  }, [activeFilter]);

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Primary Hero & Template Gallery Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/90 to-[#f8fafc] px-4 pt-12 pb-8 sm:px-6 sm:pt-16 border-b border-slate-200/80">
        <div className="mx-auto max-w-6xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-[#0f5daa]">
            <Sparkles size={13} />
            <span>Asian Hawks Career Platform • Resume Templates</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
            Choose Your <span className="text-[#0f5daa]">Resume Template</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
            Choose a professionally designed template and create an ATS-friendly resume in minutes.
          </p>

          {/* Value Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-600" /> 100% Free for Candidates
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-[#0f5daa]" /> ATS Parser Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={15} className="text-amber-500" /> Auto-Import Profile Data
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeFilter === "all"
                  ? "bg-[#0f5daa] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              All Templates (5)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("ats")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeFilter === "ats"
                  ? "bg-[#0f5daa] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              ATS Friendly
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("modern")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeFilter === "modern"
                  ? "bg-[#0f5daa] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              Modern
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("minimal")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeFilter === "minimal"
                  ? "bg-[#0f5daa] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              Minimal
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("creative")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeFilter === "creative"
                  ? "bg-[#0f5daa] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              Creative
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("executive")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeFilter === "executive"
                  ? "bg-[#0f5daa] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              Executive
            </button>
          </div>
        </div>
      </section>

      {/* Main Template Cards Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTemplates.map((tplId) => (
            <PublicTemplateCard
              key={tplId}
              templateId={tplId}
              onUseTemplate={handleUseTemplate}
            />
          ))}
        </div>
      </section>

      {/* Intelligent Workflow Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0f5daa]">Smart Candidate Integration</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            "Use what we already know. Ask only for what is missing."
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Asian Hawks connects your candidate profile directly into your resume so you never have to retype your work history or education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-7 rounded-3xl border-slate-200/90 shadow-2xs space-y-3 bg-white">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#0f5daa] font-black text-base">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Automatic Profile Import</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your name, headline, location, education, work experience, and skills are imported automatically from your candidate account.
            </p>
          </Card>

          <Card className="p-7 rounded-3xl border-slate-200/90 shadow-2xs space-y-3 bg-white">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#0f5daa] font-black text-base">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">5 Recruiter-Approved Layouts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Switch between ATS Professional, Modern, Minimal, Creative, and Executive styles with a single click without losing entered data.
            </p>
          </Card>

          <Card className="p-7 rounded-3xl border-slate-200/90 shadow-2xs space-y-3 bg-white">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#0f5daa] font-black text-base">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Clean Vector PDF Export</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Download standard A4 vector PDFs ready for job applications, email submissions, and corporate ATS portals.
            </p>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white border-t border-slate-200/80 px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Ready to build your ATS-ready resume?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Select any template above to begin. 100% free with automatic profile synchronization.
          </p>
          <div className="pt-2">
            <Button
              type="button"
              size="lg"
              onClick={() => handleUseTemplate("ats")}
              className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white rounded-xl px-8 h-12 font-bold shadow-md text-sm gap-2"
            >
              <span>Create My Resume Now — Free</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
