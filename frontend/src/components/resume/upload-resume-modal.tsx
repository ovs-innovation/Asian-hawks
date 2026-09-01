"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { FileUp, Upload, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/lib/utils";
import { getToken } from "@/lib/api";
import type { ResumeData } from "@/types/resume";

export function UploadResumeModal({
  open,
  onOpenChange,
  currentResume,
  onMergeExtracted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentResume: ResumeData;
  onMergeExtracted: (updatedResume: ResumeData) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [conflicts, setConflicts] = useState<
    Array<{ field: string; profileValue: string; extractedValue: string }>
  >([]);
  const [extractedData, setExtractedData] = useState<any | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a resume file (PDF or Word)");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = getToken();
      const res = await fetch(`${API_URL}/resume/upload`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      if (data.conflicts && data.conflicts.length > 0) {
        setConflicts(data.conflicts);
        setExtractedData(data);
      } else {
        applyMerge(data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to parse resume");
    } finally {
      setUploading(false);
    }
  }

  function applyMerge(data: any, resolvedName?: string) {
    const updated: ResumeData = {
      ...currentResume,
      fileUrl: data.fileUrl || currentResume.fileUrl,
      source: "upload",
      personalInfo: {
        ...currentResume.personalInfo,
        fullName: resolvedName || data.extracted?.suggestedName || currentResume.personalInfo.fullName,
      },
    };

    onMergeExtracted(updated);
    toast.success("Resume imported successfully");
    onOpenChange(false);
    setFile(null);
    setConflicts([]);
    setExtractedData(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 sm:p-7 rounded-2xl">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-[#0f5daa]">
              <Upload size={18} />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">Upload Existing Resume</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Upload your PDF or Word resume. We will extract relevant details and combine them with your profile.
          </DialogDescription>
        </DialogHeader>

        {conflicts.length > 0 ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
              <div className="flex items-center gap-2 font-bold mb-2 text-amber-800">
                <AlertTriangle size={15} /> Confirm Information
              </div>
              <p className="text-slate-700 mb-3">
                We noticed a difference between your profile and the uploaded document. Which name would you like on this resume?
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => applyMerge(extractedData, conflicts[0].profileValue)}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:border-[#0f5daa] font-semibold text-slate-900"
                >
                  <p className="text-[11px] text-slate-400 uppercase font-bold">Use Profile Name</p>
                  <p className="text-xs text-[#0f5daa]">{conflicts[0].profileValue}</p>
                </button>
                <button
                  type="button"
                  onClick={() => applyMerge(extractedData, conflicts[0].extractedValue)}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 bg-white hover:border-[#0f5daa] font-semibold text-slate-900"
                >
                  <p className="text-[11px] text-slate-400 uppercase font-bold">Use Uploaded Document Name</p>
                  <p className="text-xs text-[#0f5daa]">{conflicts[0].extractedValue}</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="space-y-4">
            <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-6 text-center hover:border-[#0f5daa] transition-colors cursor-pointer">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-[#0f5daa]">
                <FileUp size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {file ? file.name : "Click to select or drag & drop"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">PDF or Word DOCX (max 10 MB)</p>
              </div>
              <input
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!file || uploading}
                className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white"
              >
                {uploading ? "Extracting..." : "Upload & Parse"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
