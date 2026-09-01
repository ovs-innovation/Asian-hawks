"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { TEMPLATES_META, type TemplateId } from "@/types/resume";
import { cn } from "@/lib/utils";

export function TemplateSelectorModal({
  open,
  onOpenChange,
  activeTemplate,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTemplate: TemplateId;
  onSelect: (id: TemplateId) => void;
}) {
  const templates = Object.values(TEMPLATES_META);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl">
        <DialogHeader className="mb-6">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-[#0f5daa]">
              <Sparkles size={18} />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">Choose Resume Template</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-slate-500">
            Switch styles anytime. Your underlying resume data is preserved 100% across all templates.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  "relative flex flex-col justify-between rounded-2xl border-2 p-5 text-left transition-all cursor-pointer group hover:shadow-md",
                  isSelected
                    ? "border-[#0f5daa] bg-blue-50/40 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                {tpl.isRecommended && (
                  <div className="absolute -top-2.5 right-4">
                    <Badge tone="blue" className="bg-[#0f5daa] text-white font-bold text-[10px] px-2.5 py-0.5 shadow-2xs">
                      ⭐ Recommended for ATS
                    </Badge>
                  </div>
                )}

                <div>
                  {/* Miniature Wireframe Graphic */}
                  <div
                    className={cn(
                      "h-32 w-full rounded-xl p-3 flex flex-col gap-1.5 border overflow-hidden transition-all",
                      tpl.id === "ats" && "bg-white border-neutral-300",
                      tpl.id === "modern" && "bg-slate-50 border-blue-200",
                      tpl.id === "minimal" && "bg-zinc-50 border-zinc-200",
                      tpl.id === "creative" && "bg-indigo-50/40 border-indigo-200",
                      tpl.id === "executive" && "bg-amber-50/30 border-amber-200"
                    )}
                  >
                    <div
                      className="h-3 rounded-sm w-1/2"
                      style={{ backgroundColor: tpl.accentColor }}
                    />
                    <div className="h-1.5 bg-slate-200 rounded-sm w-3/4" />
                    <div className="h-0.5 bg-slate-200 w-full mt-1" />
                    <div className="flex gap-2 mt-1">
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 bg-slate-300 rounded-sm w-full" />
                        <div className="h-1.5 bg-slate-200 rounded-sm w-5/6" />
                        <div className="h-1.5 bg-slate-200 rounded-sm w-4/6" />
                      </div>
                      <div className="w-1/3 space-y-1">
                        <div className="h-1.5 bg-slate-300 rounded-sm w-full" />
                        <div className="h-1 bg-slate-200 rounded-sm w-full" />
                      </div>
                    </div>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-[#0f5daa] transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{tpl.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 capitalize">
                    {tpl.id} Format
                  </span>
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0f5daa]">
                      <Check size={14} /> Active
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-[#0f5daa]">
                      Select →
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
