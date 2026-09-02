"use client";

import React, { useRef, useState, useEffect } from "react";
import { Check, Sparkles, Eye, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { TEMPLATES_META, type ResumeData, type TemplateId } from "@/types/resume";
import { TemplateRenderer } from "./template-renderer";
import { cn } from "@/lib/utils";

interface TemplatePreviewCardProps {
  templateId: TemplateId;
  resume: ResumeData;
  isSelected: boolean;
  isSelecting?: boolean;
  onSelect: (id: TemplateId) => void;
  onQuickPreview?: (id: TemplateId) => void;
}

export function TemplatePreviewCard({
  templateId,
  resume,
  isSelected,
  isSelecting = false,
  onSelect,
  onQuickPreview,
}: TemplatePreviewCardProps) {
  const meta = TEMPLATES_META[templateId] || TEMPLATES_META.ats;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.5);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Standard template design is authored at 800px wide
        const newScale = containerWidth / 800;
        setScale(Math.max(0.2, newScale));
      }
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl bg-white p-4 sm:p-5 transition-all duration-200 border-2",
        isSelected
          ? "border-[#0f5daa] ring-4 ring-[#0f5daa]/10 shadow-md bg-blue-50/10"
          : "border-slate-200/90 hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5"
      )}
    >
      {/* Top Badges */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 pointer-events-none">
        {meta.isRecommended && (
          <Badge tone="blue" className="bg-[#0f5daa] text-white font-bold text-[10px] px-2.5 py-0.5 shadow-xs">
            <Sparkles size={11} className="mr-1 inline" /> {meta.badge || "Recommended for ATS"}
          </Badge>
        )}
        {isSelected && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
            <CheckCircle2 size={12} /> Current Template
          </span>
        )}
      </div>

      {/* Large A4 Resume Preview Viewport */}
      <div className="relative">
        <div
          ref={containerRef}
          className="relative w-full aspect-[210/297] overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-inner select-none"
        >
          {/* Scaled Template Container */}
          <div
            className="absolute top-0 left-0 origin-top-left bg-white pointer-events-none"
            style={{
              width: "800px",
              minHeight: "1130px",
              transform: `scale(${scale})`,
            }}
          >
            <TemplateRenderer data={{ ...resume, template: templateId }} />
          </div>

          {/* Hover Overlay with Action Buttons */}
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2.5 p-4 backdrop-blur-[1.5px]">
            {onQuickPreview && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onQuickPreview(templateId)}
                className="h-9 px-4 rounded-xl font-bold text-xs gap-1.5 bg-white text-slate-800 hover:bg-slate-100 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
              >
                <Eye size={14} className="text-[#0f5daa]" />
                <span>Zoom Preview</span>
              </Button>
            )}

            {!isSelected && (
              <Button
                type="button"
                size="sm"
                disabled={isSelecting}
                onClick={() => onSelect(templateId)}
                className="h-9 px-4 rounded-xl font-bold text-xs gap-1.5 bg-[#0f5daa] hover:bg-[#0c4d8c] text-white shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
              >
                {isSelecting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Applying…</span>
                  </>
                ) : (
                  <>
                    <span>Use This Template</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Card Body / Metadata */}
      <div className="mt-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0f5daa] transition-colors flex items-center gap-1.5">
              <span>{meta.name}</span>
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed min-h-[36px]">
            {meta.description}
          </p>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          {onQuickPreview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onQuickPreview(templateId)}
              className="h-9 px-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl gap-1"
            >
              <Eye size={13} className="text-slate-500" />
              <span>Preview</span>
            </Button>
          )}

          <div className="ml-auto">
            {isSelected ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled
                className="h-9 px-3.5 rounded-xl border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold gap-1.5 cursor-default opacity-100"
              >
                <Check size={14} className="text-emerald-600 stroke-[2.5]" />
                <span>Currently Selected</span>
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={isSelecting}
                onClick={() => onSelect(templateId)}
                className="h-9 px-3.5 rounded-xl bg-[#0f5daa] hover:bg-[#0c4d8c] text-white text-xs font-bold gap-1.5 shadow-xs transition-all"
              >
                {isSelecting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Selecting…</span>
                  </>
                ) : (
                  <>
                    <span>Use This Template</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
