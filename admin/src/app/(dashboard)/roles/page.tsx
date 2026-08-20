"use client";

const ROLES = [
  { name: "super_admin", desc: "Full platform access — all read/write operations", color: "bg-red-100 text-red-700" },
  { name: "moderator", desc: "Can review and approve jobs, manage users", color: "bg-purple-100 text-purple-700" },
  { name: "recruiter", desc: "Post jobs, manage applications, company profile", color: "bg-blue-100 text-blue-700" },
  { name: "hr_manager", desc: "Same as recruiter but can manage team members", color: "bg-indigo-100 text-indigo-700" },
  { name: "candidate", desc: "Apply to jobs, manage profile and resume", color: "bg-green-100 text-green-700" },
];

export default function RolesPage() {
  return (
    <div className="p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#111827]">Roles & Permissions</h2>
        <p className="text-sm text-[#6b7280] mt-0.5">Platform role definitions (read-only)</p>
      </div>
      <div className="space-y-3">
        {ROLES.map((r) => (
          <div key={r.name} className="flex items-start gap-4 rounded-xl border border-[#e5e7eb] bg-white px-5 py-4">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${r.color}`}>
              {r.name}
            </span>
            <p className="text-sm text-[#6b7280] mt-0.5">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
