"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

type Settings = {
  siteName?: string;
  siteEmail?: string;
  maintenanceMode?: boolean;
  maxJobsPerRecruiter?: number;
};

export default function SettingsPage() {
  const { data, isLoading } = useQuery<{ values?: Settings }>({
    queryKey: ["admin-settings"],
    queryFn: () => api("/admin/settings"),
  });

  const [form, setForm] = useState<Settings>({});

  useEffect(() => {
    if (data?.values) setForm(data.values);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (body: Settings) => api("/admin/settings", { method: "PUT", body: JSON.stringify(body) }),
    onSuccess: () => toast.success("Settings saved"),
    onError: (e: Error) => toast.error(e.message),
  });

  function field(label: string, key: keyof Settings, type = "text") {
    return (
      <div key={key}>
        <label className="block text-sm font-medium text-[#374151] mb-1">{label}</label>
        {type === "checkbox" ? (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!form[key]}
              onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
              className="h-4 w-4 rounded border-[#d1d5db] text-[#0f5daa] outline-none"
            />
            <span className="text-sm text-[#6b7280]">Enable maintenance mode</span>
          </label>
        ) : (
          <input
            type={type}
            value={(form[key] as string | number | undefined) ?? ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, [key]: type === "number" ? Number(e.target.value) : e.target.value }))
            }
            className="w-full max-w-sm rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#0f5daa]"
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">Settings</h2>
        <p className="text-sm text-[#6b7280] mt-0.5">Platform-wide configuration</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-[#f3f4f6] animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-5 bg-white rounded-xl border border-[#e5e7eb] p-6">
          {field("Site Name", "siteName")}
          {field("Contact Email", "siteEmail", "email")}
          {field("Max Jobs Per Recruiter", "maxJobsPerRecruiter", "number")}
          {field("Maintenance Mode", "maintenanceMode", "checkbox")}

          <button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending}
            className="rounded-lg bg-[#0f5daa] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0c4d8c] disabled:opacity-50 transition"
          >
            {mutation.isPending ? "Saving..." : "Save Settings"}
          </button>
        </div>
      )}
    </div>
  );
}
