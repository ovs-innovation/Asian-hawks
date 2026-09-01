import React from "react";
import type { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, Link2, Code2, Award, Briefcase, GraduationCap } from "lucide-react";

export function ModernTemplate({ data }: { data: ResumeData }) {
  const p = data.personalInfo || {};
  const hasExp = !data.isFresher && data.experience && data.experience.length > 0;
  const hasEdu = data.education && data.education.length > 0;
  const hasSkills = data.skills && data.skills.length > 0;
  const hasProjects = data.projects && data.projects.length > 0;
  const hasCerts = data.certificates && data.certificates.length > 0;
  const hasLangs = data.languages && data.languages.length > 0;

  return (
    <div
      className="resume-document bg-white text-slate-800 font-sans leading-relaxed text-[13px] p-8 sm:p-10 shadow-sm min-h-[1050px] w-full max-w-[800px] mx-auto box-border"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top Header Card */}
      <header className="rounded-2xl bg-gradient-to-r from-[#03224c] to-[#0f5daa] text-white p-6 sm:p-7 shadow-sm">
        <h1 className="text-2xl font-black tracking-tight">{p.fullName || "Your Full Name"}</h1>
        {p.headline && <p className="text-sm font-semibold text-blue-100 mt-1">{p.headline}</p>}

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-blue-100 border-t border-white/15 pt-3">
          {p.email && (
            <span className="flex items-center gap-1.5">
              <Mail size={13} className="text-blue-300" />
              {p.email}
            </span>
          )}
          {p.phone && (
            <span className="flex items-center gap-1.5">
              <Phone size={13} className="text-blue-300" />
              {p.phone}
            </span>
          )}
          {(p.location || p.city) && (
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-blue-300" />
              {p.location || p.city}
            </span>
          )}
          {p.linkedin && (
            <span className="flex items-center gap-1.5">
              <Link2 size={13} className="text-blue-300" />
              LinkedIn
            </span>
          )}
          {p.github && (
            <span className="flex items-center gap-1.5">
              <Code2 size={13} className="text-blue-300" />
              GitHub
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f5daa] flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <span className="h-2 w-2 rounded-full bg-[#0f5daa]" />
            About Me
          </h2>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Skills Grid */}
      {hasSkills && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f5daa] flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <Code2 size={14} /> Skills & Expertise
          </h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {data.skills.map((s, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-blue-50 border border-blue-100/80 px-2.5 py-1 text-xs font-semibold text-[#0f5daa]"
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {hasExp && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f5daa] flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <Briefcase size={14} /> Work Experience
          </h2>
          <div className="mt-3 space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="relative pl-4 border-l-2 border-blue-200">
                <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[#0f5daa]" />
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">{exp.title}</h3>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {exp.start} {exp.start && (exp.end || exp.current) ? "–" : ""}{" "}
                    {exp.current ? "Present" : exp.end}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#0f5daa] mt-0.5">{exp.company}</p>
                {exp.description && <p className="mt-1 text-xs text-slate-600 leading-normal">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {hasProjects && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f5daa] flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <Globe size={14} /> Key Projects
          </h2>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-900">{proj.name}</h3>
                {proj.technologies && (
                  <p className="text-[11px] font-medium text-[#0f5daa] mt-0.5">{proj.technologies}</p>
                )}
                {proj.description && (
                  <p className="mt-1 text-xs text-slate-600 leading-normal line-clamp-3">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {hasEdu && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f5daa] flex items-center gap-2 border-b border-slate-200 pb-1.5">
            <GraduationCap size={14} /> Education
          </h2>
          <div className="mt-3 space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                  </h3>
                  <p className="text-slate-600">{edu.school}</p>
                </div>
                <span className="font-semibold text-slate-500">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {(hasCerts || hasLangs) && (
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
          {hasCerts && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Award size={13} className="text-[#0f5daa]" /> Certifications
              </h3>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                {data.certificates.map((c, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span className="font-medium text-slate-800">{c.name}</span>
                    <span className="text-slate-400">{c.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasLangs && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Globe size={13} className="text-[#0f5daa]" /> Languages
              </h3>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {data.languages.map((l, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {l.language} ({l.proficiency})
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
