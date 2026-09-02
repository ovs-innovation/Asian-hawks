"use client";

import React from "react";
import Link from "next/link";
import { Download, LayoutTemplate, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateRenderer } from "./templates/template-renderer";
import { TEMPLATES_META, type ResumeData, type TemplateId } from "@/types/resume";
import { printResume } from "@/lib/pdf-export";

export function ResumePreview({
  resume,
  onChangeTemplate,
}: {
  resume: ResumeData;
  onChangeTemplate?: (templateId: TemplateId) => void;
}) {
  const activeMeta = TEMPLATES_META[resume.template] || TEMPLATES_META.ats;

  const handleDownload = () => {
    const name = resume.personalInfo?.fullName
      ? `${resume.personalInfo.fullName.replace(/\s+/g, "_")}_Resume`
      : "Asian_Hawks_Resume";
    printResume(name);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Preview Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="h-9 gap-2 rounded-xl text-xs font-bold text-slate-800 border-slate-200 hover:border-[#0f5daa] hover:text-[#0f5daa]"
          >
            <Link href="/candidate/resume/templates">
              <LayoutTemplate size={14} className="text-[#0f5daa]" />
              <span>Template: {activeMeta.name}</span>
              <span className="text-[10px] text-slate-400 font-medium ml-1">Change →</span>
            </Link>
          </Button>
          {activeMeta.isRecommended && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-[#0f5daa] px-2 py-0.5 rounded-md">
              <Sparkles size={11} /> ATS Friendly
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleDownload}
            className="h-9 gap-1.5 rounded-xl bg-[#0f5daa] hover:bg-[#0c4d8c] text-white text-xs font-bold shadow-xs"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Printable Preview Area */}
      <div className="flex-1 overflow-y-auto rounded-2xl bg-slate-100/90 p-3 sm:p-6 border border-slate-200/80 shadow-inner flex justify-center">
        <div id="resume-print-area" className="w-full flex justify-center">
          <TemplateRenderer data={resume} />
        </div>
      </div>
    </div>
  );
}
