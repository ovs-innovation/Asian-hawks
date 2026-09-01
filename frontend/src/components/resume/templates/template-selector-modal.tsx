"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { TEMPLATES_META, type ResumeData, type TemplateId } from "@/types/resume";
import { TemplateRenderer } from "./template-renderer";
import { cn } from "@/lib/utils";

export function TemplateSelectorModal({
  open,
  onOpenChange,
  data,
  activeTemplate,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ResumeData;
  activeTemplate: TemplateId;
  onSelect: (id: TemplateId) => void;
}) {
  const templates = Object.values(TEMPLATES_META);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 rounded-3xl">
        <DialogHeader className="mb-6">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-[#0f5daa]">
              <Sparkles size={18} />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">Choose Resume Template</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-slate-500">
            Preview all 5 ATS templates rendered with your actual candidate details in real-time. Select any layout without losing your data.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((tpl) => {
            const isSelected = activeTemplate === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => {
                  onSelect(tpl.id);
                  onOpenChange(false);
                }}
                className={cn(
                  "relative flex flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all cursor-pointer group hover:shadow-md hover:border-[#0f5daa]",
                  isSelected
                    ? "border-[#0f5daa] bg-blue-50/30 shadow-xs ring-1 ring-[#0f5daa]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                {tpl.isRecommended && (
                  <div className="absolute -top-2.5 right-4 z-10">
                    <Badge tone="blue" className="bg-[#0f5daa] text-white font-bold text-[10px] px-2.5 py-0.5 shadow-2xs">
                      ⭐ Recommended for ATS
                    </Badge>
                  </div>
                )}

                <div>
                  {/* Miniature Live Template Preview */}
                  <div className="h-48 w-full rounded-xl border border-slate-200/90 bg-white overflow-hidden relative shadow-inner select-none pointer-events-none group-hover:shadow-xs transition-shadow">
                    <div className="absolute inset-x-0 top-0 origin-top-left transform scale-[0.36] w-[278%] bg-white min-h-[500px]">
                      <TemplateRenderer data={{ ...data, template: tpl.id }} />
                    </div>
                    {/* Subtle bottom fade */}
                    <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-[#0f5daa] transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">{tpl.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 capitalize">
                    {tpl.id} Layout
                  </span>
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0f5daa] bg-blue-50 px-2.5 py-1 rounded-lg">
                      <Check size={14} /> Active
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 group-hover:text-[#0f5daa] flex items-center gap-1">
                      Select Template →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
