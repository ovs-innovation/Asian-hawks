import React from "react";
import type { ResumeData } from "@/types/resume";

function formatUrl(url?: string) {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function AtsTemplate({ data }: { data: ResumeData }) {
  const p = data.personalInfo || {};
  const hasExp = !data.isFresher && data.experience && data.experience.length > 0;
  const hasEdu = data.education && data.education.length > 0;
  const hasSkills = data.skills && data.skills.length > 0;
  const hasProjects = data.projects && data.projects.length > 0;
  const hasCerts = data.certificates && data.certificates.length > 0;
  const hasLangs = data.languages && data.languages.length > 0;
  const hasAch = data.achievements && data.achievements.length > 0;

  const contacts: { label: string; href?: string }[] = [
    p.email ? { label: p.email, href: `mailto:${p.email}` } : null,
    p.phone ? { label: p.phone } : null,
    (p.location || p.city) ? { label: p.location || p.city } : null,
    p.linkedin ? { label: "LinkedIn", href: formatUrl(p.linkedin) } : null,
    p.github ? { label: "GitHub", href: formatUrl(p.github) } : null,
    p.portfolio ? { label: "Portfolio", href: formatUrl(p.portfolio) } : null,
  ].filter(Boolean) as { label: string; href?: string }[];

  return (
    <div
      className="resume-document bg-white text-black font-sans leading-relaxed text-[13px] p-8 sm:p-12 shadow-sm min-h-[1050px] w-full max-w-[800px] mx-auto box-border"
      style={{ fontFamily: "'Inter', Arial, sans-serif" }}
    >
      {/* Header */}
      <header className="border-b-2 border-black pb-4 text-center">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-black">
          {p.fullName || "Your Full Name"}
        </h1>
        {p.headline && (
          <p className="text-sm font-semibold uppercase tracking-wider text-neutral-800 mt-1">
            {p.headline}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-neutral-700 mt-2">
          {contacts.map((c, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>•</span>}
              {c.href ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-black font-medium underline hover:text-[#0f5daa]"
                >
                  {c.label}
                </a>
              ) : (
                <span>{c.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 text-black">
            Professional Summary
          </h2>
          <p className="mt-2 text-xs text-neutral-800 leading-normal text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Skills */}
      {hasSkills && (
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 text-black">
            Core Competencies & Skills
          </h2>
          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-800">
            {data.skills.map((skill, idx) => (
              <span key={idx} className="font-medium">
                {skill}
                {idx < data.skills.length - 1 ? " •" : ""}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {hasExp && (
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 text-black">
            Work Experience
          </h2>
          <div className="mt-3 space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>{exp.title}</span>
                  <span className="font-semibold text-neutral-700">
                    {exp.start} {exp.start && (exp.end || exp.current) ? "–" : ""}{" "}
                    {exp.current ? "Present" : exp.end}
                  </span>
                </div>
                <div className="flex justify-between items-baseline italic text-neutral-800 text-[11px] mt-0.5">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="mt-1 text-neutral-700 leading-normal whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="mt-1 list-disc list-inside text-neutral-700 space-y-0.5">
                    {exp.highlights.map((hl, hIdx) => (
                      <li key={hIdx}>{hl}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {hasProjects && (
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 text-black">
            Projects
          </h2>
          <div className="mt-3 space-y-3">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-black">
                  {proj.link ? (
                    <a
                      href={formatUrl(proj.link)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-[#0f5daa]"
                    >
                      {proj.name}
                    </a>
                  ) : (
                    <span>{proj.name}</span>
                  )}
                  {proj.startDate && (
                    <span className="font-medium text-neutral-600">
                      {proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ""}
                    </span>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-[11px] font-semibold text-neutral-700 mt-0.5">
                    Technologies: {proj.technologies}
                  </p>
                )}
                {proj.description && (
                  <p className="mt-1 text-neutral-700 leading-normal whitespace-pre-line">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {hasEdu && (
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 text-black">
            Education
          </h2>
          <div className="mt-3 space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>
                    {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                  </span>
                  <span className="font-semibold text-neutral-700">{edu.year}</span>
                </div>
                <div className="flex justify-between items-baseline italic text-neutral-800 text-[11px] mt-0.5">
                  <span>{edu.school}</span>
                  {edu.grade && <span>Score: {edu.grade}</span>}
                </div>
                {edu.description && (
                  <p className="mt-1 text-neutral-700 leading-normal">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Achievements & Honors */}
      {hasAch && (
        <section className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 text-black">
            Awards & Key Achievements
          </h2>
          <div className="mt-3 space-y-2">
            {data.achievements.map((ach, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>{ach.title}</span>
                  {ach.date && <span className="font-semibold text-neutral-700 text-[11px]">{ach.date}</span>}
                </div>
                {ach.description && (
                  <p className="mt-0.5 text-neutral-700 leading-normal text-[11px] whitespace-pre-line">{ach.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {(hasCerts || hasLangs) && (
        <section className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hasCerts && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 text-black">
                Certifications
              </h2>
              <ul className="mt-2 space-y-1 text-xs text-neutral-800">
                {data.certificates.map((c, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{c.name}</span>
                    {c.issuer ? ` — ${c.issuer}` : ""}
                    {c.year ? ` (${c.year})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasLangs && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 text-black">
                Languages
              </h2>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-800">
                {data.languages.map((l, idx) => {
                  const name = typeof l === "string" ? l : l.language || "";
                  const prof =
                    typeof l === "object" && l.proficiency && l.proficiency !== "Proficient"
                      ? ` (${l.proficiency})`
                      : "";
                  return (
                    <span key={idx}>
                      <strong className="font-semibold">{name}</strong>
                      {prof}
                      {idx < data.languages.length - 1 ? " •" : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
