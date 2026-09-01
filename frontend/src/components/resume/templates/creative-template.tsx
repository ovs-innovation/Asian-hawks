import React from "react";
import type { ResumeData } from "@/types/resume";
import { Sparkles, Mail, Phone, MapPin, Globe, Award, Briefcase, GraduationCap } from "lucide-react";

function formatUrl(url?: string) {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function CreativeTemplate({ data }: { data: ResumeData }) {
  const p = data.personalInfo || {};
  const hasExp = !data.isFresher && data.experience && data.experience.length > 0;
  const hasEdu = data.education && data.education.length > 0;
  const hasSkills = data.skills && data.skills.length > 0;
  const hasProjects = data.projects && data.projects.length > 0;
  const hasCerts = data.certificates && data.certificates.length > 0;
  const hasLangs = data.languages && data.languages.length > 0;
  const hasAch = data.achievements && data.achievements.length > 0;

  return (
    <div
      className="resume-document bg-[#fafafa] text-slate-800 font-sans leading-relaxed text-[13px] shadow-sm min-h-[1050px] w-full max-w-[800px] mx-auto box-border overflow-hidden rounded-xl border border-slate-200"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top Banner */}
      <div className="h-3 w-full bg-gradient-to-r from-indigo-500 via-[#0f5daa] to-cyan-400" />

      <div className="p-8 sm:p-10 space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-wider uppercase mb-1">
              <Sparkles size={11} /> Portfolio & CV
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {p.fullName || "Your Full Name"}
            </h1>
            {p.headline && (
              <p className="text-sm font-semibold text-indigo-600 mt-0.5">{p.headline}</p>
            )}
          </div>
          <div className="text-xs text-slate-600 space-y-1 sm:text-right">
            {p.email && <a href={`mailto:${p.email}`} className="flex sm:justify-end items-center gap-1.5 hover:text-indigo-600 underline"><Mail size={12} className="text-indigo-500" /> {p.email}</a>}
            {p.phone && <p className="flex sm:justify-end items-center gap-1.5"><Phone size={12} className="text-indigo-500" /> {p.phone}</p>}
            {(p.location || p.city) && <p className="flex sm:justify-end items-center gap-1.5"><MapPin size={12} className="text-indigo-500" /> {p.location || p.city}</p>}
            {p.linkedin && <a href={formatUrl(p.linkedin)} target="_blank" rel="noreferrer" className="flex sm:justify-end items-center gap-1.5 text-indigo-600 font-bold hover:underline">LinkedIn</a>}
            {p.github && <a href={formatUrl(p.github)} target="_blank" rel="noreferrer" className="flex sm:justify-end items-center gap-1.5 text-indigo-600 font-bold hover:underline">GitHub</a>}
            {p.portfolio && <a href={formatUrl(p.portfolio)} target="_blank" rel="noreferrer" className="flex sm:justify-end items-center gap-1.5 text-indigo-600 font-bold hover:underline">Portfolio</a>}
          </div>
        </header>

        {/* Summary */}
        {data.summary && (
          <section className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <p className="text-xs text-slate-600 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {/* Skills Tag Cloud */}
        {hasSkills && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
              Skills & Superpowers
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-white border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience Timeline */}
        {hasExp && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <Briefcase size={14} className="text-indigo-600" /> Professional Journey
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-slate-900">{exp.title}</h3>
                    <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {exp.start} {exp.start && (exp.end || exp.current) ? "–" : ""}{" "}
                      {exp.current ? "Present" : exp.end}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">{exp.company}</p>
                  {exp.description && (
                    <p className="mt-2 text-xs text-slate-600 leading-normal">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {hasProjects && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
              <Globe size={14} className="text-indigo-600" /> Featured Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.projects.map((proj, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{proj.name}</h3>
                    {proj.technologies && (
                      <p className="text-[10px] font-semibold text-indigo-600 mt-0.5 uppercase tracking-wider">
                        {proj.technologies}
                      </p>
                    )}
                    {proj.description && (
                      <p className="mt-1.5 text-xs text-slate-600 leading-normal">{proj.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Extra details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hasEdu && (
            <section className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                <GraduationCap size={13} className="text-indigo-600" /> Education
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-slate-900">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      {edu.school} · {edu.year}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(hasCerts || hasLangs || hasAch) && (
            <section className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              {hasAch && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
                    <Award size={13} className="text-indigo-600" /> Honors & Achievements
                  </h2>
                  <div className="space-y-2 text-xs">
                    {data.achievements.map((ach, idx) => (
                      <div key={idx}>
                        <p className="font-bold text-slate-900">{ach.title}</p>
                        {ach.description && <p className="text-slate-600 text-[11px]">{ach.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasCerts && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-1.5">
                    <Award size={13} className="text-indigo-600" /> Certifications
                  </h2>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    {data.certificates.map((c, idx) => (
                      <li key={idx}>
                        <span className="font-medium text-slate-800">{c.name}</span>
                        {c.issuer ? ` (${c.issuer})` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {hasLangs && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
                    Languages
                  </h2>
                  <p className="text-xs text-slate-600">
                    {data.languages.map((l) => `${l.language} (${l.proficiency})`).join(", ")}
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
