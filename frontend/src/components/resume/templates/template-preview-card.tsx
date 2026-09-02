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
        "group relative flex flex-col justify-between rounded-xl bg-white p-3 sm:p-3.5 transition-all duration-200 border-2",
        isSelected
          ? "border-[#0f5daa] ring-2 ring-[#0f5daa]/15 shadow-sm bg-blue-50/10"
          : "border-slate-200/90 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-wrap items-center justify-end gap-1 pointer-events-none max-w-[85%]">
        {meta.isRecommended && (
          <Badge tone="blue" className="bg-[#0f5daa] text-white font-bold text-[9px] px-2 py-0.5 shadow-xs">
            <Sparkles size={10} className="mr-1 inline" /> {meta.badge || "Recommended"}
          </Badge>
        )}
        {isSelected && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
            <CheckCircle2 size={10} /> Active
          </span>
        )}
      </div>

      {/* A4 Resume Preview Viewport */}
      <div className="relative">
        <div
          ref={containerRef}
          className="relative w-full aspect-[210/297] overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-xs select-none"
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
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3 backdrop-blur-[1.5px]">
            {onQuickPreview && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onQuickPreview(templateId)}
                className="h-8 px-3 rounded-lg font-bold text-[11px] gap-1 bg-white text-slate-800 hover:bg-slate-100 shadow-sm transform translate-y-1 group-hover:translate-y-0 transition-transform duration-200"
              >
                <Eye size={13} className="text-[#0f5daa]" />
                <span>Zoom Preview</span>
              </Button>
            )}

            {!isSelected && (
              <Button
                type="button"
                size="sm"
                disabled={isSelecting}
                onClick={() => onSelect(templateId)}
                className="h-8 px-3 rounded-lg font-bold text-[11px] gap-1 bg-[#0f5daa] hover:bg-[#0c4d8c] text-white shadow-sm transform translate-y-1 group-hover:translate-y-0 transition-transform duration-200"
              >
                {isSelecting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Applying…</span>
                  </>
                ) : (
                  <>
                    <span>Use Template</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Card Body / Metadata */}
      <div className="mt-2.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0f5daa] transition-colors truncate">
            {meta.name}
          </h3>
          <p className="mt-0.5 text-[11px] text-slate-500 leading-snug line-clamp-2 min-h-[28px]">
            {meta.description}
          </p>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          {onQuickPreview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onQuickPreview(templateId)}
              className="h-7 px-2 text-slate-500 hover:text-slate-900 text-[11px] font-semibold rounded-lg gap-1"
            >
              <Eye size={12} className="text-slate-400" />
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
                className="h-7 px-2.5 rounded-lg border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px] font-bold gap-1 cursor-default opacity-100"
              >
                <Check size={13} className="text-emerald-600 stroke-[2.5]" />
                <span>Selected</span>
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={isSelecting}
                onClick={() => onSelect(templateId)}
                className="h-7 px-2.5 rounded-lg bg-[#0f5daa] hover:bg-[#0c4d8c] text-white text-[11px] font-bold gap-1 shadow-xs transition-all"
              >
                {isSelecting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Selecting…</span>
                  </>
                ) : (
                  <>
                    <span>Use Template</span>
                    <ArrowRight size={12} />
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
