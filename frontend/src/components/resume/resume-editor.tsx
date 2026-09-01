"use client";

import React, { useState } from "react";
import {
  User,
  FileText,
  GraduationCap,
  Briefcase,
  Code2,
  FolderGit2,
  Award,
  Globe,
  Trophy,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Card, Label, Input, Textarea, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import type {
  ResumeData,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  CertItem,
  LanguageItem,
  AchievementItem,
} from "@/types/resume";

const SECTIONS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "summary", label: "Summary", icon: FileText },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "languages", label: "Languages", icon: Globe },
  { id: "achievements", label: "Achievements", icon: Trophy },
];

export function ResumeEditor({
  resume,
  onChange,
  activeStep,
  setActiveStep,
}: {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
}) {
  const [newSkill, setNewSkill] = useState("");

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    });
  };

  // Education Helpers
  const addEducation = () => {
    const newEdu: EducationItem = {
      school: "",
      degree: "",
      field: "",
      year: `${new Date().getFullYear()}`,
      grade: "",
      description: "",
    };
    onChange({
      ...resume,
      education: [...(resume.education || []), newEdu],
    });
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
    const list = [...(resume.education || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...resume, education: list });
  };

  const removeEducation = (index: number) => {
    onChange({
      ...resume,
      education: (resume.education || []).filter((_, i) => i !== index),
    });
  };

  // Experience Helpers
  const addExperience = () => {
    const newExp: ExperienceItem = {
      company: "",
      title: "",
      location: "",
      start: "2023",
      end: "Present",
      current: true,
      description: "",
    };
    onChange({
      ...resume,
      isFresher: false,
      experience: [...(resume.experience || []), newExp],
    });
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
    const list = [...(resume.experience || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...resume, experience: list });
  };

  const removeExperience = (index: number) => {
    onChange({
      ...resume,
      experience: (resume.experience || []).filter((_, i) => i !== index),
    });
  };

  // Skill Helpers
  const addSkillTag = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !(resume.skills || []).includes(trimmed)) {
      onChange({
        ...resume,
        skills: [...(resume.skills || []), trimmed],
      });
      setNewSkill("");
    }
  };

  const removeSkillTag = (skill: string) => {
    onChange({
      ...resume,
      skills: (resume.skills || []).filter((s) => s !== skill),
    });
  };

  // Project Helpers
  const addProject = () => {
    const newProj: ProjectItem = {
      name: "",
      description: "",
      technologies: "",
      githubUrl: "",
      liveUrl: "",
    };
    onChange({
      ...resume,
      projects: [...(resume.projects || []), newProj],
    });
  };

  const updateProject = (index: number, field: keyof ProjectItem, value: string) => {
    const list = [...(resume.projects || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...resume, projects: list });
  };

  const removeProject = (index: number) => {
    onChange({
      ...resume,
      projects: (resume.projects || []).filter((_, i) => i !== index),
    });
  };

  // Certifications Helpers
  const addCert = () => {
    const newCert: CertItem = { name: "", issuer: "", year: `${new Date().getFullYear()}` };
    onChange({
      ...resume,
      certificates: [...(resume.certificates || []), newCert],
    });
  };

  const updateCert = (index: number, field: keyof CertItem, value: string) => {
    const list = [...(resume.certificates || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...resume, certificates: list });
  };

  const removeCert = (index: number) => {
    onChange({
      ...resume,
      certificates: (resume.certificates || []).filter((_, i) => i !== index),
    });
  };

  // Language Helpers
  const addLanguage = () => {
    const newLang: LanguageItem = { language: "", proficiency: "Proficient" };
    onChange({
      ...resume,
      languages: [...(resume.languages || []), newLang],
    });
  };

  const updateLanguage = (index: number, field: keyof LanguageItem, value: string) => {
    const list = [...(resume.languages || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...resume, languages: list });
  };

  const removeLanguage = (index: number) => {
    onChange({
      ...resume,
      languages: (resume.languages || []).filter((_, i) => i !== index),
    });
  };

  // Achievement Helpers
  const addAchievement = () => {
    const newAch: AchievementItem = { title: "", description: "" };
    onChange({
      ...resume,
      achievements: [...(resume.achievements || []), newAch],
    });
  };

  const updateAchievement = (index: number, field: keyof AchievementItem, value: string) => {
    const list = [...(resume.achievements || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...resume, achievements: list });
  };

  const removeAchievement = (index: number) => {
    onChange({
      ...resume,
      achievements: (resume.achievements || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Horizontal Step Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-slate-200">
        {SECTIONS.map((sec, idx) => {
          const Icon = sec.icon;
          const isActive = activeStep === idx;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0f5daa] text-white shadow-xs"
                  : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80"
              }`}
            >
              <Icon size={14} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 0: PERSONAL INFO */}
      {activeStep === 0 && (
        <Card className="p-6 space-y-4 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
              <p className="text-xs text-slate-500">Contact details and professional title for your header.</p>
            </div>
            <Badge tone="blue" className="text-[10px]">
              <Sparkles size={11} className="mr-1" /> Imported from Profile
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Full Name *</Label>
              <Input
                className="mt-1"
                placeholder="e.g. Saurabh Singh"
                value={resume.personalInfo?.fullName || ""}
                onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
              />
            </div>
            <div>
              <Label>Professional Title / Headline *</Label>
              <Input
                className="mt-1"
                placeholder="e.g. Full Stack Developer"
                value={resume.personalInfo?.headline || ""}
                onChange={(e) => updatePersonalInfo("headline", e.target.value)}
              />
            </div>
            <div>
              <Label>Email Address *</Label>
              <Input
                className="mt-1"
                type="email"
                placeholder="you@email.com"
                value={resume.personalInfo?.email || ""}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
              />
            </div>
            <div>
              <Label>Phone Number *</Label>
              <Input
                className="mt-1"
                placeholder="+91 98765 43210"
                value={resume.personalInfo?.phone || ""}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
              />
            </div>
            <div>
              <Label>Location / City *</Label>
              <Input
                className="mt-1"
                placeholder="e.g. New Delhi, India"
                value={resume.personalInfo?.location || ""}
                onChange={(e) => updatePersonalInfo("location", e.target.value)}
              />
            </div>
            <div>
              <Label>LinkedIn URL (Optional)</Label>
              <Input
                className="mt-1"
                placeholder="https://linkedin.com/in/..."
                value={resume.personalInfo?.linkedin || ""}
                onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
              />
            </div>
            <div>
              <Label>GitHub URL (Optional)</Label>
              <Input
                className="mt-1"
                placeholder="https://github.com/..."
                value={resume.personalInfo?.github || ""}
                onChange={(e) => updatePersonalInfo("github", e.target.value)}
              />
            </div>
            <div>
              <Label>Portfolio / Website (Optional)</Label>
              <Input
                className="mt-1"
                placeholder="https://yourportfolio.com"
                value={resume.personalInfo?.portfolio || ""}
                onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}

      {/* SECTION 1: SUMMARY */}
      {activeStep === 1 && (
        <Card className="p-6 space-y-4 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Professional Summary</h3>
              <p className="text-xs text-slate-500">2-4 sentences highlighting your background, core strengths, and goals.</p>
            </div>
          </div>

          <div>
            <Label>Summary Statement</Label>
            <Textarea
              rows={5}
              className="mt-1 leading-relaxed"
              placeholder="e.g. Dedicated software engineer with 3+ years of experience building modern web applications. Proficient in React, Node.js, and cloud systems with a proven track record of shipping scalable customer-facing products."
              value={resume.summary || ""}
              onChange={(e) => onChange({ ...resume, summary: e.target.value })}
            />
          </div>
        </Card>
      )}

      {/* SECTION 2: EDUCATION */}
      {activeStep === 2 && (
        <Card className="p-6 space-y-4 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Education</h3>
              <p className="text-xs text-slate-500">Degrees, colleges, and academic certifications.</p>
            </div>
            <Button
              type="button"
              onClick={addEducation}
              className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white text-xs h-9 font-semibold rounded-xl"
            >
              <Plus size={14} className="mr-1" /> Add Education
            </Button>
          </div>

          {(!resume.education || resume.education.length === 0) ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <GraduationCap size={28} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-600">No education entries added yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Education" to list your degree or school.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resume.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Entry #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Degree / Diploma *</Label>
                      <Input
                        className="mt-1"
                        placeholder="e.g. B.Tech Computer Science"
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Institution / University *</Label>
                      <Input
                        className="mt-1"
                        placeholder="e.g. Delhi University"
                        value={edu.school}
                        onChange={(e) => updateEducation(idx, "school", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Field of Study (Optional)</Label>
                      <Input
                        className="mt-1"
                        placeholder="e.g. Information Technology"
                        value={edu.field || ""}
                        onChange={(e) => updateEducation(idx, "field", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Graduation Year *</Label>
                      <Input
                        className="mt-1"
                        placeholder="e.g. 2024"
                        value={edu.year}
                        onChange={(e) => updateEducation(idx, "year", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* SECTION 3: EXPERIENCE */}
      {activeStep === 3 && (
        <Card className="p-6 space-y-4 border-slate-200/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Work Experience</h3>
              <p className="text-xs text-slate-500">Employment history or toggle fresher status.</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-[#0f5daa]"
                  checked={!!resume.isFresher}
                  onChange={(e) => onChange({ ...resume, isFresher: e.target.checked })}
                />
                <span>I'm a Fresher (No Experience)</span>
              </label>
              {!resume.isFresher && (
                <Button
                  type="button"
                  onClick={addExperience}
                  className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white text-xs h-9 font-semibold rounded-xl"
                >
                  <Plus size={14} className="mr-1" /> Add Experience
                </Button>
              )}
            </div>
          </div>

          {resume.isFresher ? (
            <div className="p-6 text-center border-2 border-dashed border-blue-200 bg-blue-50/40 rounded-2xl">
              <CheckCircle2 size={24} className="mx-auto text-[#0f5daa] mb-1.5" />
              <p className="text-xs font-bold text-[#0f5daa]">Fresher Mode Activated</p>
              <p className="text-[11px] text-slate-500 mt-0.5 max-w-sm mx-auto">
                The Experience section will be omitted automatically from your resume. Your Education, Skills, and Projects will be highlighted.
              </p>
            </div>
          ) : (!resume.experience || resume.experience.length === 0) ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <Briefcase size={28} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-600">No work experience listed</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Experience" or toggle "I'm a Fresher" above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Role #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExperience(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Job Title *</Label>
                      <Input
                        className="mt-1"
                        placeholder="e.g. Frontend Developer"
                        value={exp.title}
                        onChange={(e) => updateExperience(idx, "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Company Name *</Label>
                      <Input
                        className="mt-1"
                        placeholder="e.g. Acme Tech Solutions"
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, "company", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Start Date *</Label>
                      <Input
                        className="mt-1"
                        placeholder="e.g. Jan 2022"
                        value={exp.start}
                        onChange={(e) => updateExperience(idx, "start", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Date *</Label>
                      <Input
                        className="mt-1"
                        placeholder={exp.current ? "Present" : "e.g. Dec 2023"}
                        value={exp.current ? "Present" : exp.end}
                        disabled={exp.current}
                        onChange={(e) => updateExperience(idx, "end", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Key Responsibilities & Achievements</Label>
                    <Textarea
                      rows={3}
                      className="mt-1"
                      placeholder="e.g. Developed responsive user interfaces with Next.js. Reduced API load times by 35% through query caching."
                      value={exp.description || ""}
                      onChange={(e) => updateExperience(idx, "description", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* SECTION 4: SKILLS */}
      {activeStep === 4 && (
        <Card className="p-6 space-y-4 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Skills & Competencies</h3>
              <p className="text-xs text-slate-500">Technical skills, tools, frameworks, and domain expertise.</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Type skill and press Enter (e.g. React, Python, Git)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkillTag();
                }
              }}
            />
            <Button
              type="button"
              onClick={addSkillTag}
              className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white shrink-0 font-semibold"
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {(resume.skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-[#0f5daa]"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkillTag(skill)}
                  className="text-blue-400 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* SECTION 5: PROJECTS */}
      {activeStep === 5 && (
        <Card className="p-6 space-y-4 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Key Projects</h3>
              <p className="text-xs text-slate-500">Showcase significant client work, applications, or personal projects.</p>
            </div>
            <Button
              type="button"
              onClick={addProject}
              className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white text-xs h-9 font-semibold rounded-xl"
            >
              <Plus size={14} className="mr-1" /> Add Project
            </Button>
          </div>

          {(!resume.projects || resume.projects.length === 0) ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
              <FolderGit2 size={28} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-600">No projects added yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Projects are great proof of capability for recruiters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {resume.projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700">Project #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Project Name *</Label>
                      <Input
                        className="mt-1"
                        placeholder="e.g. E-Commerce Platform"
                        value={proj.name}
                        onChange={(e) => updateProject(idx, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Tech Stack / Technologies</Label>
                      <Input
                        className="mt-1"
                        placeholder="e.g. React, Node.js, MongoDB"
                        value={proj.technologies || ""}
                        onChange={(e) => updateProject(idx, "technologies", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>GitHub URL (Optional)</Label>
                      <Input
                        className="mt-1"
                        placeholder="https://github.com/..."
                        value={proj.githubUrl || ""}
                        onChange={(e) => updateProject(idx, "githubUrl", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Live Demo / Website (Optional)</Label>
                      <Input
                        className="mt-1"
                        placeholder="https://demo.example.com"
                        value={proj.liveUrl || ""}
                        onChange={(e) => updateProject(idx, "liveUrl", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Project Description</Label>
                    <Textarea
                      rows={2}
                      className="mt-1"
                      placeholder="Brief overview of features, scale, or challenges solved."
                      value={proj.description || ""}
                      onChange={(e) => updateProject(idx, "description", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* SECTION 6: CERTIFICATIONS */}
      {activeStep === 6 && (
        <Card className="p-6 space-y-4 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Certifications (Optional)</h3>
              <p className="text-xs text-slate-500">Industry credentials, courses, and licenses.</p>
            </div>
            <Button
              type="button"
              onClick={addCert}
              className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white text-xs h-9 font-semibold rounded-xl"
            >
              <Plus size={14} className="mr-1" /> Add Certification
            </Button>
          </div>

          <div className="space-y-3">
            {(resume.certificates || []).map((c, idx) => (
              <div key={idx} className="flex gap-3 items-center p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    placeholder="Certificate Name"
                    value={c.name}
                    onChange={(e) => updateCert(idx, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Issuer (e.g. AWS, Google)"
                    value={c.issuer || ""}
                    onChange={(e) => updateCert(idx, "issuer", e.target.value)}
                  />
                  <Input
                    placeholder="Year (e.g. 2024)"
                    value={c.year || ""}
                    onChange={(e) => updateCert(idx, "year", e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCert(idx)}
                  className="text-rose-500 hover:text-rose-700 p-2 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* SECTION 7: LANGUAGES */}
      {activeStep === 7 && (
        <Card className="p-6 space-y-4 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Languages (Optional)</h3>
              <p className="text-xs text-slate-500">Spoken and written language proficiencies.</p>
            </div>
            <Button
              type="button"
              onClick={addLanguage}
              className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white text-xs h-9 font-semibold rounded-xl"
            >
              <Plus size={14} className="mr-1" /> Add Language
            </Button>
          </div>

          <div className="space-y-3">
            {(resume.languages || []).map((l, idx) => (
              <div key={idx} className="flex gap-3 items-center p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <Input
                  className="flex-1"
                  placeholder="Language (e.g. English)"
                  value={l.language}
                  onChange={(e) => updateLanguage(idx, "language", e.target.value)}
                />
                <select
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
                  value={l.proficiency}
                  onChange={(e) => updateLanguage(idx, "proficiency", e.target.value)}
                >
                  <option value="Native">Native / Bilingual</option>
                  <option value="Proficient">Professional Working</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Beginner">Beginner</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeLanguage(idx)}
                  className="text-rose-500 hover:text-rose-700 p-2 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* SECTION 8: ACHIEVEMENTS */}
      {activeStep === 8 && (
        <Card className="p-6 space-y-4 border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Awards & Honors (Optional)</h3>
              <p className="text-xs text-slate-500">Key achievements, hackathons, and recognitions.</p>
            </div>
            <Button
              type="button"
              onClick={addAchievement}
              className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white text-xs h-9 font-semibold rounded-xl"
            >
              <Plus size={14} className="mr-1" /> Add Achievement
            </Button>
          </div>

          <div className="space-y-3">
            {(resume.achievements || []).map((ach, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex justify-between items-center">
                  <Input
                    className="flex-1 font-semibold"
                    placeholder="Achievement Title (e.g. 1st Place National Hackathon)"
                    value={ach.title}
                    onChange={(e) => updateAchievement(idx, "title", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeAchievement(idx)}
                    className="text-rose-500 hover:text-rose-700 ml-2 p-2 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <Textarea
                  rows={2}
                  placeholder="Optional description"
                  value={ach.description || ""}
                  onChange={(e) => updateAchievement(idx, "description", e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={activeStep === 0}
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          className="gap-1.5 rounded-xl font-semibold"
        >
          <ChevronLeft size={16} /> Previous
        </Button>
        <Button
          type="button"
          disabled={activeStep === SECTIONS.length - 1}
          onClick={() => setActiveStep(Math.min(SECTIONS.length - 1, activeStep + 1))}
          className="gap-1.5 bg-[#0f5daa] hover:bg-[#0c4d8c] text-white rounded-xl font-semibold"
        >
          Next Section <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
