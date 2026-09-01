"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  FileUp,
  Download,
  Edit3,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Card, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { TEMPLATES_META, type ResumeData } from "@/types/resume";
import { printResume } from "@/lib/pdf-export";
import { TemplateRenderer } from "@/components/resume/templates/template-renderer";
import { UploadResumeModal } from "@/components/resume/upload-resume-modal";
import { timeAgo } from "@/lib/utils";

export default function CandidateResumeDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api<{ item: ResumeData; isNewDraft?: boolean }>("/resume");
        if (data?.item) {
          setResume(data.item);
        }
      } catch {
        toast.error("Could not fetch resume details");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDownload = () => {
    if (!resume) return;
    const name = resume.personalInfo?.fullName
      ? `${resume.personalInfo.fullName.replace(/\s+/g, "_")}_Resume`
      : "Asian_Hawks_Resume";
    printResume(name);
  };

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-xs border border-slate-200 text-slate-500 font-medium text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f5daa] border-t-transparent" />
          <span>Loading your resume…</span>
        </div>
      </div>
    );
  }

  const templateMeta = resume ? TEMPLATES_META[resume.template] || TEMPLATES_META.ats : TEMPLATES_META.ats;
  const completeness = resume?.completeness || 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume & Applications"
        body="Build your ATS-friendly resume once and automatically attach it to every Asian Hawks job application."
        action={
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setUploadModalOpen(true)}
              className="rounded-xl font-bold text-xs h-11 border-slate-200"
            >
              <FileUp size={15} className="mr-1.5 text-[#0f5daa]" /> Upload Resume
            </Button>
            <Button asChild className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white shadow-xs rounded-xl px-5 h-11 font-bold">
              <Link href="/candidate/resume/builder" className="flex items-center gap-2">
                <Plus size={16} />
                <span>Open Resume Builder</span>
              </Link>
            </Button>
          </div>
        }
      />

      {/* Main Resume Card or Empty State */}
      {!resume ? (
        <Card className="p-10 sm:p-14 text-center border-2 border-dashed border-slate-200/90 rounded-3xl space-y-5">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-[#0f5daa] mx-auto">
            <FileText size={32} />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Create your professional resume</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              We will automatically import your existing Candidate Profile details. You can complete the remaining details in under 2 minutes.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white rounded-xl px-6 h-11 font-bold shadow-xs">
              <Link href="/candidate/resume/builder">Create Resume Now →</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setUploadModalOpen(true)}
              className="rounded-xl h-11 font-bold text-slate-700"
            >
              <FileUp size={15} className="mr-1.5 text-[#0f5daa]" /> Upload Existing File
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Active Resume Details Card */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 sm:p-8 rounded-3xl border-slate-200/90 shadow-2xs space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {resume.personalInfo?.fullName || "Primary Resume"}
                    </h2>
                    <Badge tone="blue" className="text-[11px] font-bold">
                      {templateMeta.name}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    {resume.personalInfo?.headline || "Ready for job applications"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Calendar size={13} />
                  <span>Updated {resume.updatedAt ? timeAgo(resume.updatedAt) : "Today"}</span>
                </div>
              </div>

              {/* Completeness Gauge */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#0f5daa]" /> Resume Completeness
                  </span>
                  <span>{completeness}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0f5daa] to-blue-400 transition-all duration-500"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>

              {/* Highlights Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Skills</p>
                  <p className="text-base font-black text-slate-900 mt-0.5">{resume.skills?.length || 0}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Experience</p>
                  <p className="text-base font-black text-slate-900 mt-0.5">
                    {resume.isFresher ? "Fresher" : `${resume.experience?.length || 0} roles`}
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center col-span-2 sm:col-span-1">
                  <p className="text-[11px] font-bold uppercase text-slate-400">Education</p>
                  <p className="text-base font-black text-slate-900 mt-0.5">{resume.education?.length || 0} degrees</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <Button asChild className="flex-1 bg-[#0f5daa] hover:bg-[#0c4d8c] text-white rounded-xl h-11 font-bold shadow-xs">
                  <Link href="/candidate/resume/builder" className="flex items-center justify-center gap-2">
                    <Edit3 size={15} />
                    <span>Edit in Resume Builder</span>
                  </Link>
                </Button>
                <Button
                  type="button"
                  onClick={handleDownload}
                  variant="outline"
                  className="rounded-xl h-11 font-bold text-slate-800 border-slate-200"
                >
                  <Download size={15} className="mr-1.5 text-[#0f5daa]" /> Download PDF
                </Button>
              </div>
            </Card>

            {/* ATS Advantage Information Card */}
            <Card className="p-6 rounded-3xl border-slate-200/90 bg-gradient-to-br from-slate-50 to-blue-50/30 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <ShieldCheck size={18} className="text-[#0f5daa]" />
                <span>ATS & Recruiter Compliance</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your resume uses standard headings, clear semantic layout, and clean vector typography. Whenever you apply to any role on Asian Hawks, hiring managers can review your profile in one click.
              </p>
            </Card>
          </div>

          {/* Right Column: Miniature Live Document Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Document Preview</h3>
              <Link
                href="/candidate/resume/builder"
                className="text-xs font-bold text-[#0f5daa] hover:underline flex items-center gap-1"
              >
                Open Fullscreen <ExternalLink size={12} />
              </Link>
            </div>

            <div className="relative rounded-3xl border border-slate-200 bg-slate-100/80 p-3 overflow-hidden shadow-xs">
              <div className="transform scale-[0.65] origin-top-left -mr-[50%] -mb-[50%] pointer-events-none select-none">
                <TemplateRenderer data={resume} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Existing Resume Modal */}
      {resume && (
        <UploadResumeModal
          open={uploadModalOpen}
          onOpenChange={setUploadModalOpen}
          currentResume={resume}
          onMergeExtracted={(merged) => setResume(merged)}
        />
      )}
    </div>
  );
}
