"use client";

import React, { useEffect, useState, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileUp,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  calculateResumeCompleteness,
  detectMissingFields,
  TEMPLATES_META,
  type ResumeData,
  type TemplateId,
} from "@/types/resume";
import { normalizeTemplateId } from "@/lib/demo-resumes";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { ResumePreview } from "@/components/resume/resume-preview";
import { MissingInfoBanner } from "@/components/resume/missing-info-banner";
import { UploadResumeModal } from "@/components/resume/upload-resume-modal";
import { printResume } from "@/lib/pdf-export";

function ResumeBuilderContent() {
  const searchParams = useSearchParams();
  const templateQuery = searchParams.get("template");

  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Safe Debounced Autosave
  const triggerAutosave = useCallback((dataToSave: ResumeData) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveStatus("saving");

    saveTimerRef.current = setTimeout(async () => {
      try {
        await api<{ ok: boolean; item: ResumeData }>("/resume", {
          method: "PUT",
          body: JSON.stringify(dataToSave),
        });
        setSaveStatus("saved");
        const now = new Date();
        setLastSavedTime(
          now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      } catch {
        setSaveStatus("idle");
      }
    }, 1200);
  }, []);

  // Fetch initial resume
  useEffect(() => {
    async function load() {
      try {
        const data = await api<{ item: ResumeData; isNewDraft?: boolean }>("/resume");
        if (data?.item) {
          let currentResume = data.item;

          // If a specific template was requested via query param
          if (templateQuery) {
            const requestedTemplate = normalizeTemplateId(templateQuery);
            if (currentResume.template !== requestedTemplate) {
              currentResume = { ...currentResume, template: requestedTemplate };
              triggerAutosave(currentResume);
              toast.success(`Applied ${TEMPLATES_META[requestedTemplate]?.name || "selected"} template!`);
            }
          }

          setResume(currentResume);
          if (data.isNewDraft) {
            toast.info("Auto-imported your profile details into a fresh resume!");
          }
        }
      } catch {
        toast.error("Failed to load resume");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [templateQuery, triggerAutosave]);

  const handleResumeChange = (updated: ResumeData) => {
    const completeness = calculateResumeCompleteness(updated);
    const withScore = { ...updated, completeness };
    setResume(withScore);
    triggerAutosave(withScore);
  };

  const handleSyncWithProfile = async () => {
    setSyncing(true);
    try {
      const res = await api<{ diffs: any[]; hasChanges: boolean }>("/resume/sync-profile");
      if (!res.hasChanges) {
        toast.info("Your resume is already in sync with your candidate profile.");
        return;
      }
      // Apply diffs
      const applyRes = await api<{ ok: boolean; item: ResumeData }>("/resume/sync-profile", {
        method: "POST",
        body: JSON.stringify({ applyDiffs: res.diffs.map((d) => d.path) }),
      });
      if (applyRes.item) {
        setResume(applyRes.item);
        toast.success("Synchronized profile changes to resume!");
      }
    } catch {
      toast.error("Failed to synchronize with profile");
    } finally {
      setSyncing(false);
    }
  };

  if (loading || !resume) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-xs border border-slate-200 text-slate-500 font-medium text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f5daa] border-t-transparent" />
          <span>Setting up resume builder…</span>
        </div>
      </div>
    );
  }

  const missingFields = detectMissingFields(resume);
  const completeness = resume.completeness || calculateResumeCompleteness(resume);

  return (
    <div className="space-y-5">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="rounded-xl h-9 text-slate-600 hover:text-slate-900 font-semibold">
            <Link href="/candidate/resume" className="flex items-center gap-1.5">
              <ArrowLeft size={16} />
              <span>Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Resume Builder</span>
              <Badge tone="blue" className="text-[11px] font-bold">
                {completeness}% Complete
              </Badge>
            </h1>
            <p className="text-xs text-slate-500">Live editor with real-time ATS preview and vector PDF export.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Autosave Status */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-2">
            {saveStatus === "saving" ? (
              <>
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span>Saving changes…</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={13} className="text-emerald-500" />
                <span>Saved {lastSavedTime ? `at ${lastSavedTime}` : "automatically"}</span>
              </>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setUploadModalOpen(true)}
            className="rounded-xl text-xs font-bold gap-1.5 h-9"
          >
            <FileUp size={14} className="text-[#0f5daa]" />
            <span className="hidden md:inline">Upload Resume</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={syncing}
            onClick={handleSyncWithProfile}
            className="rounded-xl text-xs font-bold gap-1.5 h-9"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin text-[#0f5daa]" : "text-[#0f5daa]"} />
            <span className="hidden md:inline">Sync Profile</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => {
              const name = resume.personalInfo?.fullName
                ? `${resume.personalInfo.fullName.replace(/\s+/g, "_")}_Resume`
                : "Asian_Hawks_Resume";
              printResume(name);
            }}
            className="rounded-xl bg-[#0f5daa] hover:bg-[#0c4d8c] text-white text-xs font-bold gap-1.5 h-9 shadow-xs"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </Button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mobileTab === "editor" ? "bg-white text-[#0f5daa] shadow-xs" : "text-slate-600"
          }`}
        >
          Edit Information
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            mobileTab === "preview" ? "bg-white text-[#0f5daa] shadow-xs" : "text-slate-600"
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* Missing Info Notification */}
      <MissingInfoBanner
        missingFields={missingFields}
        completeness={completeness}
        onNavigateToStep={(stepIdx) => {
          setActiveStep(stepIdx);
          setMobileTab("editor");
        }}
      />

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor */}
        <div className={`lg:col-span-6 xl:col-span-6 space-y-4 ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}>
          <ResumeEditor
            resume={resume}
            onChange={handleResumeChange}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        </div>

        {/* Right Column: Live Preview */}
        <div className={`lg:col-span-6 xl:col-span-6 sticky top-20 ${mobileTab === "editor" ? "hidden lg:block" : "block"}`}>
          <ResumePreview
            resume={resume}
            onChangeTemplate={(tplId: TemplateId) => handleResumeChange({ ...resume, template: tplId })}
          />
        </div>
      </div>

      {/* Upload Existing Resume Modal */}
      <UploadResumeModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        currentResume={resume}
        onMergeExtracted={(merged) => handleResumeChange(merged)}
      />
    </div>
  );
}

export default function ResumeBuilderWorkspace() {
  return (
    <Suspense fallback={
      <div className="grid min-h-[70vh] place-items-center">
        <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-xs border border-slate-200 text-slate-500 font-medium text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f5daa] border-t-transparent" />
          <span>Loading workspace…</span>
        </div>
      </div>
    }>
      <ResumeBuilderContent />
    </Suspense>
  );
}
