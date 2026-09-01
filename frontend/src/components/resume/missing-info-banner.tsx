"use client";

import React from "react";
import { Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { type MissingField } from "@/types/resume";

export function MissingInfoBanner({
  missingFields,
  completeness,
  onNavigateToStep,
}: {
  missingFields: MissingField[];
  completeness: number;
  onNavigateToStep: (stepIndex: number) => void;
}) {
  if (missingFields.length === 0 || completeness >= 90) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-emerald-900">Your Resume is Complete & Ready ({completeness}%)</p>
            <p className="text-[11px] text-emerald-700">All required sections are populated. Ready to download and apply.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/90 to-indigo-50/50 p-4 sm:p-5 text-slate-800 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-100 text-[#0f5daa] shrink-0 mt-0.5">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f5daa]">
                Auto-Imported Profile Data ({completeness}%)
              </h4>
            </div>
            <p className="text-xs font-semibold text-slate-900 mt-0.5">
              We already know you! We just need a few details to complete your resume:
            </p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              {missingFields.map((field) => (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => onNavigateToStep(field.stepIndex)}
                  className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0f5daa] hover:bg-blue-50 transition-colors cursor-pointer shadow-2xs"
                >
                  <AlertCircle size={12} className="text-amber-500" />
                  <span>{field.label}</span>
                  <ArrowRight size={10} className="text-blue-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
