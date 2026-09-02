import React from "react";
import type { ResumeData } from "@/types/resume";

function formatUrl(url?: string) {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function MinimalTemplate({ data }: { data: ResumeData }) {
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
      className="resume-document bg-white text-zinc-800 font-sans leading-relaxed text-[13px] p-8 sm:p-12 shadow-sm min-h-[1050px] w-full max-w-[800px] mx-auto box-border"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Minimal Header */}
      <header className="pb-6 border-b border-zinc-200">
        <h1 className="text-3xl font-light tracking-tight text-zinc-900">
          <span className="font-bold">{p.fullName?.split(" ")[0] || "Your"}</span>{" "}
          {p.fullName?.split(" ").slice(1).join(" ") || "Name"}
        </h1>
        {p.headline && (
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mt-1 font-medium">
            {p.headline}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400 font-light">
          {contacts.map((c, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              {c.href ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-800 underline hover:text-[#0f5daa]"
                >
                  {c.label}
                </a>
              ) : (
                <span className="text-zinc-600">{c.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mt-6">
          <p className="text-xs text-zinc-600 leading-relaxed italic">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {hasExp && (
        <section className="mt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">
            Experience
          </h2>
          <div className="space-y-5">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-zinc-900">{exp.title}</span>
                  <span className="text-[11px] text-zinc-400 font-light">
                    {exp.start} {exp.start && (exp.end || exp.current) ? "–" : ""}{" "}
                    {exp.current ? "Present" : exp.end}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">{exp.company}</p>
                {exp.description && (
                  <p className="mt-1.5 text-zinc-600 leading-normal text-[12px]">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {hasProjects && (
        <section className="mt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-4">
            Selected Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-zinc-900">{proj.name}</span>
                  {proj.technologies && (
                    <span className="text-[11px] text-zinc-400 font-light">{proj.technologies}</span>
                  )}
                </div>
                {proj.description && (
                  <p className="mt-1 text-zinc-600 leading-normal text-[12px]">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Skills Grid */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-zinc-100 pt-6">
        {hasEdu && (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-3">
              Education
            </h2>
            <div className="space-y-3 text-xs">
              {data.education.map((edu, idx) => (
                <div key={idx}>
                  <p className="font-semibold text-zinc-900">
                    {edu.degree} {edu.field ? `— ${edu.field}` : ""}
                  </p>
                  <p className="text-zinc-500 text-[11px]">
                    {edu.school} · {edu.year}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasSkills && (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-3">
              Skills
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed font-light">
              {data.skills.join("  ·  ")}
            </p>
          </section>
        )}
      </div>

      {/* Achievements */}
      {hasAch && (
        <section className="mt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-3">
            Honors & Achievements
          </h2>
          <div className="space-y-3">
            {data.achievements.map((ach, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-zinc-900">{ach.title}</span>
                  {ach.date && <span className="text-[11px] text-zinc-400 font-light">{ach.date}</span>}
                </div>
                {ach.description && <p className="mt-1 text-zinc-600 text-[12px]">{ach.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {(hasCerts || hasLangs) && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-zinc-100 pt-6">
          {hasCerts && (
            <section>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-2">
                Certifications
              </h2>
              <ul className="space-y-1 text-xs text-zinc-600">
                {data.certificates.map((c, idx) => (
                  <li key={idx}>
                    <span className="font-medium text-zinc-800">{c.name}</span>
                    {c.issuer ? ` (${c.issuer})` : ""}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {hasLangs && (
            <section>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400 mb-2">
                Languages
              </h2>
              <p className="text-xs text-zinc-600">
                {data.languages
                  .map((l) => {
                    const name = typeof l === "string" ? l : l.language || "";
                    const prof =
                      typeof l === "object" && l.proficiency && l.proficiency !== "Proficient"
                        ? ` (${l.proficiency})`
                        : "";
                    return `${name}${prof}`;
                  })
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
