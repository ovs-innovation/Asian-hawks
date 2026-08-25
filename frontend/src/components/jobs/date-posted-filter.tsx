"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Clock, X } from "lucide-react";

export type DatePostedValue = "any" | "1" | "7" | "30";

interface DatePostedFilterProps {
  value: DatePostedValue;
  onChange: (val: DatePostedValue) => void;
  resultCount?: number;
}

const OPTIONS: { id: DatePostedValue; label: string }[] = [
  { id: "any", label: "Any time" },
  { id: "30", label: "Past month" },
  { id: "7", label: "Past week" },
  { id: "1", label: "Past 24 hours" },
];

export function DatePostedFilter({ value, onChange, resultCount }: DatePostedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState<DatePostedValue>(value);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Synchronize internal state when prop changes
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const activeOption = OPTIONS.find((o) => o.id === value);
  const isActive = value !== "any";

  function handleReset() {
    setTempValue("any");
    onChange("any");
    setIsOpen(false);
  }

  function handleApply() {
    onChange(tempValue);
    setIsOpen(false);
  }

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* LinkedIn Filter Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
          isActive
            ? "border-2 border-[#0f5daa] bg-[#0f5daa]/10 text-[#0f5daa]"
            : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-400"
        }`}
      >
        <Clock size={14} className={isActive ? "text-[#0f5daa]" : "text-slate-500"} />
        <span>{isActive ? `Date posted: ${activeOption?.label}` : "Date posted"}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-72 rounded-2xl border border-slate-900/10 bg-white p-4 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Date Posted</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-100"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2 py-1">
            {OPTIONS.map((opt) => {
              const isSelected = tempValue === opt.id;
              return (
                <label
                  key={opt.id}
                  onClick={() => setTempValue(opt.id)}
                  className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span className={`font-medium ${isSelected ? "text-[#0f5daa] font-semibold" : ""}`}>
                    {opt.label}
                  </span>
                  <input
                    type="radio"
                    name="datePostedOption"
                    checked={isSelected}
                    onChange={() => setTempValue(opt.id)}
                    className="h-4 w-4 accent-[#0f5daa] cursor-pointer"
                  />
                </label>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="rounded-full bg-[#0f5daa] px-5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#03224c] transition-colors"
            >
              {resultCount !== undefined ? `Show (${resultCount})` : "Show results"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
