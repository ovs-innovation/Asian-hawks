"use client";

import { useState } from "react";

const faqs = [
  ["Is Northline for candidates or companies?", "Both. Candidates search and apply. Companies post roles, review applications, and hire."],
  ["Do you charge candidates?", "No. Creating a profile, applying, and talking to recruiters is free."],
  ["How are companies verified?", "We confirm domain, hiring contact, and a live role before a company can publish."],
  ["What does AI Resume Match actually do?", "It compares a resume to the job description. A recruiter still decides who moves forward."],
];

export default function FaqPage() {
  const [open, setOpen] = useState(0);
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">FAQ</h1>
        <div className="mt-10">
          {faqs.map(([q, a], i) => (
            <div key={q} className="border-b border-slate-200 dark:border-slate-800">
              <button className="flex w-full items-center justify-between py-5 text-left text-lg font-semibold" onClick={() => setOpen(open === i ? -1 : i)}>
                {q} <span className="font-normal text-slate-400">{open === i ? "–" : "+"}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${open === i ? "max-h-40 pb-5" : "max-h-0"}`}>
                <p className="text-slate-500">{a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
