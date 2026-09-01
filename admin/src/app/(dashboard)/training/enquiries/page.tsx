"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { timeAgo } from "@/lib/utils";
import { Search, Trash2, Mail, Phone, ShoppingCart, MessageSquare, Filter } from "lucide-react";

type EnquiryItem = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  jobTitle?: string;
  jobSlug?: string;
  resumeUrl?: string;
  createdAt: string;
};

export default function CourseEnquiriesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "purchases" | "enquiries">("all");

  const { data, isLoading, isError, error, refetch } = useQuery<{ items: EnquiryItem[]; total: number }>({
    queryKey: ["admin-enquiries"],
    queryFn: () => api("/admin/enquiries"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/admin/enquiries/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Enquiry record deleted");
      qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const allRawItems = data?.items ?? [];

  // Filter strictly for course purchases and course/training enquiries
  const items = allRawItems.filter((i) => {
    const msgUpper = (i.message || "").toUpperCase();
    const msgLower = (i.message || "").toLowerCase();

    // 1. Course Purchases -> INCLUDE
    if (msgUpper.includes("PURCHASE REQUEST")) return true;

    // 2. Resume attachments -> EXCLUDE (Job Applications belong on /applications)
    if (i.resumeUrl) return false;

    // 3. Job application pitch messages -> EXCLUDE
    if (
      msgLower.includes("i fit for this position") ||
      msgLower.includes("hire me") ||
      (msgLower.includes("application for") && !msgLower.includes("course"))
    ) {
      return false;
    }

    return true;
  });

  const filtered = items.filter((item) => {
    const textMatch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.includes(search) ||
      item.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
      item.message?.toLowerCase().includes(search.toLowerCase());

    const isPurchase = item.message?.toUpperCase().includes("PURCHASE REQUEST");

    if (filterType === "purchases") return textMatch && isPurchase;
    if (filterType === "enquiries") return textMatch && !isPurchase;
    return textMatch;
  });

  const totalPurchases = items.filter((i) => i.message?.toUpperCase().includes("PURCHASE REQUEST")).length;

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f5daa]">Training & Admissions</p>
          <h2 className="mt-1 text-xl font-bold text-[#111827]">Course Purchases & Enquiries</h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Track course purchases, student registrations, and training enquiries submitted by candidates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="rounded-xl border border-[#c7d7ea] bg-[#f0f7ff] px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-[#0f5daa]">
            Total Received: <span className="text-sm font-bold">{items.length}</span>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-emerald-700">
            Purchases: <span className="text-sm font-bold">{totalPurchases}</span>
          </div>
        </div>
      </div>

      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white p-1">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterType === "all" ? "bg-[#0f5daa] text-white" : "text-[#4b5563] hover:text-[#111827]"
            }`}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("purchases")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterType === "purchases" ? "bg-emerald-600 text-white" : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            <ShoppingCart size={13} /> Course Purchases ({totalPurchases})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("enquiries")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filterType === "enquiries" ? "bg-blue-600 text-white" : "text-blue-700 hover:bg-blue-50"
            }`}
          >
            <MessageSquare size={13} /> Course Enquiries ({items.length - totalPurchases})
          </button>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search student, email, course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl border border-[#e5e7eb] bg-white pl-9 pr-3 text-xs text-[#111827] placeholder:text-[#9ca3af] focus:border-[#0f5daa] focus:outline-none"
          />
        </div>
      </div>

      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error instanceof Error ? error.message : "Could not load enquiries."}
          <button type="button" onClick={() => refetch()} className="ml-2 font-semibold underline">
            Retry
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-[#f3f4f6]" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="border-b border-[#e5e7eb] bg-[#f9fafb]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Student / Applicant</th>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Course / Subject</th>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Type / Message Details</th>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Date</th>
                <th className="px-4 py-3 text-right font-semibold text-[#4b5563]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {filtered.map((item) => {
                const isPurchase = item.message?.toUpperCase().includes("PURCHASE REQUEST");
                return (
                  <tr key={item._id} className="hover:bg-[#f9fafb]">
                    <td className="px-4 py-3.5">
                      <p className="font-bold text-[#111827]">{item.name}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#64748b]">
                        <span className="flex items-center gap-1">
                          <Mail size={12} /> {item.email}
                        </span>
                        {item.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone size={12} /> {item.phone}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-[#0f5daa]">
                        {item.jobTitle || "General Enquiry"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 max-w-sm">
                      {isPurchase ? (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 mb-1">
                          <ShoppingCart size={12} /> Course Purchase Request
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#0f5daa] mb-1">
                          <MessageSquare size={12} /> General Inquiry
                        </div>
                      )}
                      <p className="text-xs text-[#374151] line-clamp-2">{item.message}</p>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-[#6b7280] whitespace-nowrap">
                      {timeAgo(item.createdAt)}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete enquiry from ${item.name}?`)) {
                            deleteMutation.mutate(item._id);
                          }
                        }}
                        className="inline-flex rounded-lg p-1.5 text-[#9ca3af] hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!filtered.length ? (
            <div className="px-5 py-12 text-center text-sm text-[#9ca3af]">
              No course purchases or enquiries found.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
