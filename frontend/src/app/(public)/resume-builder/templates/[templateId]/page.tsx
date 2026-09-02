"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { TEMPLATES_META, type TemplateId } from "@/types/resume";
import { TemplateRenderer } from "@/components/resume/templates/template-renderer";
import { getDemoResume, normalizeTemplateId } from "@/lib/demo-resumes";

export default function PublicTemplatePreviewPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawId = resolvedParams.templateId;
  const templateId = normalizeTemplateId(rawId);
  const meta = TEMPLATES_META[templateId] || TEMPLATES_META.ats;
  const demoData = getDemoResume(templateId);

  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);

  const handleUseTemplate = () => {
    const targetUrl = `/candidate/resume/builder?template=${templateId}`;
    if (hydrated && user) {
      router.push(targetUrl);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(targetUrl)}`);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      {/* Top Header Sticky Bar */}
      <header className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-xl h-9 text-slate-600 hover:text-slate-900 font-semibold gap-1.5"
            >
              <Link href="/resume-builder">
                <ArrowLeft size={16} />
                <span>Back to Templates</span>
              </Link>
            </Button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900">{meta.name}</h1>
                {meta.isRecommended && (
                  <Badge tone="blue" className="text-[10px] font-bold bg-blue-50 text-[#0f5daa] border border-blue-200">
                    <Sparkles size={11} className="mr-1 inline" /> ATS Friendly
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden md:block max-w-xl truncate">
                {meta.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              onClick={handleUseTemplate}
              className="rounded-xl bg-[#0f5daa] hover:bg-[#0c4d8c] text-white text-xs sm:text-sm font-bold h-10 px-5 gap-2 shadow-xs"
            >
              <span>Use This Template</span>
              <ArrowRight size={15} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Template Information & Highlights */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0f5daa] uppercase tracking-wider">Template Specifications</span>
                <h2 className="text-xl font-extrabold text-slate-900">{meta.name}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{meta.description}</p>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>100% ATS Parser Compatible</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#0f5daa] shrink-0" />
                  <span>Auto-imports your candidate profile data</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck size={16} className="text-blue-600 shrink-0" />
                  <span>Clean vector PDF export (A4 standard)</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  onClick={handleUseTemplate}
                  className="w-full rounded-2xl bg-[#0f5daa] hover:bg-[#0c4d8c] text-white font-bold text-sm h-11 gap-2 shadow-xs"
                >
                  <span>Edit This Resume</span>
                  <ArrowRight size={16} />
                </Button>
                <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                  Free to edit and download. No credit card required.
                </p>
              </div>
            </div>

            {/* Other Templates Quick Switcher */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Other Available Layouts</h3>
              <div className="space-y-2">
                {(["ats", "modern", "minimal", "creative", "executive"] as TemplateId[])
                  .filter((id) => id !== templateId)
                  .map((id) => {
                    const item = TEMPLATES_META[id];
                    return (
                      <Link
                        key={id}
                        href={`/resume-builder/templates/${id}`}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all text-xs font-semibold text-slate-700"
                      >
                        <span>{item.name}</span>
                        <ArrowRight size={13} className="text-slate-400" />
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Right Column: Full-Size Live Resume Preview */}
          <div className="lg:col-span-8 flex justify-center">
            <div className="w-full max-w-[800px] shadow-xl rounded-2xl overflow-hidden bg-white border border-slate-200/90">
              <TemplateRenderer data={demoData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
