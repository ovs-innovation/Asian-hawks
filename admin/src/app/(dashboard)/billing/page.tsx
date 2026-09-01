"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

type BillingRecord = {
  _id: string;
  company?: { name: string };
  plan: string;
  amount: number;
  status: string;
  createdAt?: string;
  renewsAt?: string;
  issuedAt?: string;
};

export default function BillingPage() {
  const { data, isLoading } = useQuery<{ subscriptions?: BillingRecord[]; invoices?: BillingRecord[] }>({
    queryKey: ["admin-billing"],
    queryFn: () => api("/admin/billing"),
  });

  const records = [
    ...((data?.subscriptions ?? []).map((item) => ({
      ...item,
      createdAt: item.createdAt || item.renewsAt,
    })) as BillingRecord[]),
    ...((data?.invoices ?? []).map((item) => ({
      ...item,
      plan: item.plan || "invoice",
      createdAt: item.createdAt || item.issuedAt,
    })) as BillingRecord[]),
  ];

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#111827]">Billing</h2>
        <p className="text-sm text-[#6b7280] mt-0.5">Subscription and payment records</p>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-[#f3f4f6] animate-pulse" />)}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">User</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {records.map((r) => (
                <tr key={r._id} className="hover:bg-[#f9fafb] transition">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#111827]">{r.company?.name ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-[#6b7280]">{r.plan}</td>
                  <td className="px-4 py-3 font-medium text-[#111827]">
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(r.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.status === "paid" ? "bg-green-100 text-green-700"
                      : r.status === "pending" ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af]">{r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                </tr>
              ))}
              {!records.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#9ca3af]">No billing records</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
