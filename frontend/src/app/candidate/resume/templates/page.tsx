"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Check,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/primitives";
import { toast } from "sonner";
import { api } from "@/lib/api";
import {
  TEMPLATES_META,
  type ResumeData,
  type TemplateId,
} from "@/types/resume";
import { TemplatePreviewCard } from "@/components/resume/templates/template-preview-card";
import { TemplateRenderer } from "@/components/resume/templates/template-renderer";
import { cn } from "@/lib/utils";

const ALL_TEMPLATES: TemplateId[] = ["ats", "modern", "minimal", "creative", "executive"];

function ScaledTemplateModalContent({
  zoomTemplateId,
  resume,
  selectingId,
  onClose,
  onSelectTemplate,
}: {
  zoomTemplateId: TemplateId;
  resume: ResumeData;
  selectingId: TemplateId | null;
  onClose: () => void;
  onSelectTemplate: (id: TemplateId) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.5);
  const [fitMode, setFitMode] = useState<"fit" | "full">("fit");

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const padX = 24;
        const padY = 24;
        const availW = Math.max(200, clientWidth - padX);
        const availH = Math.max(200, clientHeight - padY);

        const scaleW = availW / 800;
        const scaleH = availH / 1130;
        const fitScale = Math.min(scaleW, scaleH);

        setScale(Math.max(0.15, fitScale));
      }
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [zoomTemplateId, fitMode]);

  return (
    <>
      {/* Dialog Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-white flex items-center justify-between gap-4 shrink-0 z-10 shadow-xs">
        <div>
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{TEMPLATES_META[zoomTemplateId]?.name}</span>
            {TEMPLATES_META[zoomTemplateId]?.isRecommended && (
              <Badge tone="blue" className="bg-[#0f5daa] text-white text-[10px] font-bold">
                ATS Friendly
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 mt-0.5">
            {TEMPLATES_META[zoomTemplateId]?.description}
          </DialogDescription>
        </div>

        <div className="flex items-center gap-2.5 pr-8 sm:pr-10">
          {/* Fit / Full Mode Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 mr-1">
            <button
              type="button"
              onClick={() => setFitMode("fit")}
              className={cn(
                "px-2.5 py-1 text-xs font-bold rounded-lg transition-all",
                fitMode === "fit" ? "bg-white text-[#0f5daa] shadow-xs" : "text-slate-500 hover:text-slate-800"
              )}
            >
              Fit View
            </button>
            <button
              type="button"
              onClick={() => setFitMode("full")}
              className={cn(
                "px-2.5 py-1 text-xs font-bold rounded-lg transition-all",
                fitMode === "full" ? "bg-white text-[#0f5daa] shadow-xs" : "text-slate-500 hover:text-slate-800"
              )}
            >
              100% Zoom
            </button>
          </div>

          {resume.template === zoomTemplateId ? (
            <Button
              disabled
              size="sm"
              className="rounded-xl bg-emerald-600 text-white font-bold text-xs h-9 gap-1.5"
            >
              <Check size={14} /> Currently Selected
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={selectingId === zoomTemplateId}
              onClick={() => {
                onClose();
                onSelectTemplate(zoomTemplateId);
              }}
              className="rounded-xl bg-[#0f5daa] hover:bg-[#0c4d8c] text-white font-bold text-xs h-9 gap-1.5 shadow-xs"
            >
              <span>Use This Template</span>
              <ArrowRight size={14} />
            </Button>
          )}
        </div>
      </div>

      {/* Preview Viewport Container */}
      <div
        ref={containerRef}
        className={cn(
          "flex-1 min-h-0 bg-slate-100/90 flex items-center justify-center p-3 sm:p-4 overflow-hidden relative select-none",
          fitMode === "full" && "overflow-y-auto block p-6"
        )}
      >
        {fitMode === "fit" ? (
          <div
            style={{
              width: `${800 * scale}px`,
              height: `${1130 * scale}px`,
              position: "relative",
            }}
          >
            <div
              style={{
                width: "800px",
                minHeight: "1130px",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              className="bg-white shadow-2xl rounded-xl overflow-hidden pointer-events-none"
            >
              <TemplateRenderer data={{ ...resume, template: zoomTemplateId }} />
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-[800px] shadow-lg rounded-xl overflow-hidden bg-white my-2 sm:my-4">
            <TemplateRenderer data={{ ...resume, template: zoomTemplateId }} />
          </div>
        )}
      </div>
    </>
  );
}

export default function ResumeTemplateGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [selectingId, setSelectingId] = useState<TemplateId | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [zoomTemplateId, setZoomTemplateId] = useState<TemplateId | null>(null);

  // Fetch candidate's current resume
  useEffect(() => {
    async function load() {
      try {
        const data = await api<{ item: ResumeData; isNewDraft?: boolean }>("/resume");
        if (data?.item) {
          setResume(data.item);
        }
      } catch {
        toast.error("Failed to load resume details. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSelectTemplate = async (tplId: TemplateId) => {
    if (!resume) return;

    if (resume.template === tplId) {
      toast.info(`"${TEMPLATES_META[tplId]?.name}" is already your selected template.`);
      router.push("/candidate/resume/builder");
      return;
    }

    setSelectingId(tplId);
    try {
      const updatedResume: ResumeData = {
        ...resume,
        template: tplId,
      };

      await api<{ ok: boolean; item: ResumeData }>("/resume", {
        method: "PUT",
        body: JSON.stringify(updatedResume),
      });

      setResume(updatedResume);
      toast.success(`Selected ${TEMPLATES_META[tplId]?.name} template!`);
      router.push("/candidate/resume/builder");
    } catch (err) {
      toast.error("Failed to update template. Please try again.");
      setSelectingId(null);
    }
  };

  const filteredTemplates = useMemo(() => {
    if (activeFilter === "all") return ALL_TEMPLATES;
    if (activeFilter === "ats") return ALL_TEMPLATES.filter((id) => id === "ats");
    return ALL_TEMPLATES.filter((id) => id === activeFilter);
  }, [activeFilter]);

  if (loading || !resume) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <div className="flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-xs border border-slate-200 text-slate-500 font-medium text-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f5daa] border-t-transparent" />
          <span>Loading templates with your resume data…</span>
        </div>
      </div>
    );
  }

  const currentMeta = TEMPLATES_META[resume.template] || TEMPLATES_META.ats;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Top Header Section */}
      <div className="flex flex-col gap-5 border-b border-slate-200/90 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-xl h-9 text-slate-600 hover:text-slate-900 font-semibold gap-1.5"
          >
            <Link href="/candidate/resume/builder">
              <ArrowLeft size={16} />
              <span>Back to Resume Builder</span>
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Active:</span>
            <Badge tone="blue" className="text-xs font-bold px-3 py-1 bg-blue-50 text-[#0f5daa] border border-blue-200">
              <CheckCircle2 size={13} className="mr-1 inline text-[#0f5daa]" />
              {currentMeta.name}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Choose Your Resume Template
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                5 templates available
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
              Preview your resume in different professional layouts. Your resume data will stay unchanged.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeFilter === "all"
                  ? "bg-white text-[#0f5daa] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All (5)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("ats")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeFilter === "ats"
                  ? "bg-white text-[#0f5daa] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ATS Friendly
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("modern")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeFilter === "modern"
                  ? "bg-white text-[#0f5daa] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Modern
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("minimal")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeFilter === "minimal"
                  ? "bg-white text-[#0f5daa] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Minimal
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("creative")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeFilter === "creative"
                  ? "bg-white text-[#0f5daa] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Creative
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("executive")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeFilter === "executive"
                  ? "bg-white text-[#0f5daa] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Executive
            </button>
          </div>
        </div>
      </div>

      {/* Main Responsive Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filteredTemplates.map((tplId) => (
          <TemplatePreviewCard
            key={tplId}
            templateId={tplId}
            resume={resume}
            isSelected={resume.template === tplId}
            isSelecting={selectingId === tplId}
            onSelect={handleSelectTemplate}
            onQuickPreview={(id) => setZoomTemplateId(id)}
          />
        ))}
      </div>

      {/* Trust & ATS Guarantee Notice Banner */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#0f5daa] text-white grid place-items-center shrink-0 shadow-xs">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">100% Data Preservation Guarantee</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Switching templates only modifies layout, typography, and visual hierarchy. All your entered experience, education, skills, projects, and personal details remain intact.
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl border-blue-200 text-[#0f5daa] font-bold text-xs h-9 shrink-0 hover:bg-blue-100/50"
        >
          <Link href="/candidate/resume/builder">Return to Editor</Link>
        </Button>
      </div>

      {/* Full-Screen Zoom Inspection Dialog */}
      <Dialog open={!!zoomTemplateId} onOpenChange={(open) => !open && setZoomTemplateId(null)}>
        <DialogContent className="max-w-4xl h-[90vh] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl">
          {zoomTemplateId && (
            <ScaledTemplateModalContent
              zoomTemplateId={zoomTemplateId}
              resume={resume}
              selectingId={selectingId}
              onClose={() => setZoomTemplateId(null)}
              onSelectTemplate={handleSelectTemplate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
