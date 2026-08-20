export default function InstituteRevenuePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-semibold">Revenue</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {[["This month", "₹4.2L"], ["Last month", "₹3.8L"], ["Total", "₹28.5L"]].map(([l, v]) => (
          <div key={l} className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="text-[13px] text-[var(--text-secondary)]">{l}</p>
            <p className="mt-1 text-[22px] font-bold text-[var(--primary)]">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
