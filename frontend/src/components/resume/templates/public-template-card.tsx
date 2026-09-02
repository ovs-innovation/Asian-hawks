"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Eye, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { TEMPLATES_META, type TemplateId } from "@/types/resume";
import { TemplateRenderer } from "./template-renderer";
import { getDemoResume } from "@/lib/demo-resumes";
import { cn } from "@/lib/utils";

interface PublicTemplateCardProps {
  templateId: TemplateId;
  onUseTemplate: (id: TemplateId) => void;
}

export function PublicTemplateCard({ templateId, onUseTemplate }: PublicTemplateCardProps) {
  const meta = TEMPLATES_META[templateId] || TEMPLATES_META.ats;
  const demoData = getDemoResume(templateId);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.45);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Standard template authored at 800px wide
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
    <div className="group relative flex flex-col justify-between rounded-3xl bg-white p-4 sm:p-5 transition-all duration-200 border-2 border-slate-200/90 hover:border-[#0f5daa]/80 hover:shadow-xl hover:-translate-y-1">
      {/* Top ATS Badge */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 pointer-events-none">
        {meta.isRecommended && (
          <Badge tone="blue" className="bg-[#0f5daa] text-white font-bold text-[11px] px-3 py-1 shadow-xs">
            <Sparkles size={11} className="mr-1 inline" /> {meta.badge || "Recommended for ATS"}
          </Badge>
        )}
      </div>

      {/* A4 Proportion Resume Preview Frame */}
      <div className="relative">
        <div
          ref={containerRef}
          className="relative w-full aspect-[210/297] overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-inner select-none"
        >
          {/* Scaled Template Canvas */}
          <div
            className="absolute top-0 left-0 origin-top-left bg-white pointer-events-none"
            style={{
              width: "800px",
              minHeight: "1130px",
              transform: `scale(${scale})`,
            }}
          >
            <TemplateRenderer data={demoData} />
          </div>

          {/* Hover Overlay with Action Buttons */}
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2.5 p-4 backdrop-blur-[1.5px]">
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="h-9 px-4 rounded-xl font-bold text-xs gap-1.5 bg-white text-slate-800 hover:bg-slate-100 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
            >
              <Link href={`/resume-builder/templates/${templateId}`}>
                <Eye size={14} className="text-[#0f5daa]" />
                <span>Full Page Preview</span>
              </Link>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => onUseTemplate(templateId)}
              className="h-9 px-4 rounded-xl font-bold text-xs gap-1.5 bg-[#0f5daa] hover:bg-[#0c4d8c] text-white shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
            >
              <span>Use This Template</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* Card Body & Details */}
      <div className="mt-3.5 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0f5daa] transition-colors">
            {meta.name}
          </h3>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-9 px-3 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl gap-1.5"
          >
            <Link href={`/resume-builder/templates/${templateId}`}>
              <Eye size={13} className="text-slate-500" />
              <span>Preview</span>
            </Link>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => onUseTemplate(templateId)}
            className="h-9 px-4 rounded-xl bg-[#0f5daa] hover:bg-[#0c4d8c] text-white text-xs font-bold gap-1.5 shadow-xs transition-all"
          >
            <span>Use Template</span>
            <ArrowRight size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}
