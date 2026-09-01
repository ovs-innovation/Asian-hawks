import React from "react";
import type { ResumeData } from "@/types/resume";

export function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const p = data.personalInfo || {};
  const hasExp = !data.isFresher && data.experience && data.experience.length > 0;
  const hasEdu = data.education && data.education.length > 0;
  const hasSkills = data.skills && data.skills.length > 0;
  const hasProjects = data.projects && data.projects.length > 0;
  const hasCerts = data.certificates && data.certificates.length > 0;
  const hasLangs = data.languages && data.languages.length > 0;

  const contactList = [
    p.email,
    p.phone,
    p.location || p.city,
    p.linkedin && "LinkedIn Profile",
    p.portfolio && "Portfolio",
  ].filter(Boolean);

  return (
    <div
      className="resume-document bg-white text-[#1a1f2c] font-serif leading-relaxed text-[13px] p-8 sm:p-12 shadow-sm min-h-[1050px] w-full max-w-[800px] mx-auto box-border"
      style={{ fontFamily: "'Georgia', 'Cambria', serif" }}
    >
      {/* Formal Header */}
      <header className="text-center pb-6 border-b-2 border-[#0f294a]">
        <h1 className="text-3xl font-normal uppercase tracking-[0.12em] text-[#0f294a]">
          {p.fullName || "Your Full Name"}
        </h1>
        {p.headline && (
          <p className="text-xs uppercase tracking-[0.25em] text-[#475569] mt-2 font-sans font-semibold">
            {p.headline}
          </p>
        )}
        <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-[#64748b] font-sans">
          {contactList.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>|</span>}
              <span>{item}</span>
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Executive Summary */}
      {data.summary && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f294a] font-sans border-b border-[#cbd5e1] pb-1">
            Executive Summary
          </h2>
          <p className="mt-2 text-xs text-[#334155] leading-relaxed text-justify">
            {data.summary}
          </p>
        </section>
      )}

      {/* Areas of Expertise / Skills */}
      {hasSkills && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f294a] font-sans border-b border-[#cbd5e1] pb-1">
            Areas of Expertise
          </h2>
          <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-[#334155] font-sans">
            {data.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 bg-[#0f294a] rounded-full" />
                <span className="font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {hasExp && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f294a] font-sans border-b border-[#cbd5e1] pb-1">
            Professional Experience
          </h2>
          <div className="mt-3 space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-sans">
                  <h3 className="font-bold text-[#0f294a] text-xs uppercase tracking-wide">
                    {exp.title}
                  </h3>
                  <span className="font-semibold text-[#475569] text-[11px]">
                    {exp.start} {exp.start && (exp.end || exp.current) ? "–" : ""}{" "}
                    {exp.current ? "Present" : exp.end}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[11px] text-[#64748b] italic font-serif mt-0.5">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="mt-1 text-[#334155] leading-normal">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {hasProjects && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f294a] font-sans border-b border-[#cbd5e1] pb-1">
            Key Initiatives & Projects
          </h2>
          <div className="mt-3 space-y-3 text-xs">
            {data.projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline font-sans font-bold text-[#0f294a]">
                  <span>{proj.name}</span>
                </div>
                {proj.technologies && (
                  <p className="text-[11px] text-[#64748b] font-sans">{proj.technologies}</p>
                )}
                {proj.description && (
                  <p className="mt-0.5 text-[#334155] leading-normal">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {hasEdu && (
        <section className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f294a] font-sans border-b border-[#cbd5e1] pb-1">
            Education & Credentials
          </h2>
          <div className="mt-3 space-y-2 text-xs">
            {data.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-[#0f294a]">
                    {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                  </p>
                  <p className="text-[#64748b] italic text-[11px]">{edu.school}</p>
                </div>
                <span className="font-sans font-semibold text-[#475569] text-[11px]">{edu.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {(hasCerts || hasLangs) && (
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#cbd5e1] pt-4 font-sans">
          {hasCerts && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f294a]">
                Certifications
              </h3>
              <ul className="mt-1.5 space-y-1 text-xs text-[#334155]">
                {data.certificates.map((c, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{c.name}</span>
                    {c.issuer ? ` · ${c.issuer}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasLangs && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0f294a]">
                Languages
              </h3>
              <p className="mt-1.5 text-xs text-[#334155]">
                {data.languages.map((l) => `${l.language} (${l.proficiency})`).join(", ")}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
