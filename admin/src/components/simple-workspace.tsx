"use client";

export default function SimpleWorkspace({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-[#111827]">{title}</h2>
      <p className="mt-2 max-w-xl text-sm text-[#6b7280]">{body}</p>
    </div>
  );
}
