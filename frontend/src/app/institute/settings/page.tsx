export default function InstituteSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-semibold">Settings</h1>
      <div className="max-w-lg space-y-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6">
        <label className="block">
          <span className="text-[13px] font-medium text-[var(--text-secondary)]">Institute name</span>
          <input className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-[14px]" defaultValue="Northline Academy" />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-[var(--text-secondary)]">Contact email</span>
          <input className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-[14px]" defaultValue="academy@northline.in" />
        </label>
      </div>
    </div>
  );
}
