export type TemplateId = "ats" | "modern" | "minimal" | "creative" | "executive";

export type PersonalInfo = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  city?: string;
  country?: string;
  headline: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
};

export type ExperienceItem = {
  company: string;
  title: string;
  employmentType?: string;
  location?: string;
  start: string;
  end: string;
  current?: boolean;
  description?: string;
  highlights?: string[];
};

export type EducationItem = {
  school: string;
  degree: string;
  field?: string;
  startYear?: string;
  year: string;
  grade?: string;
  description?: string;
};

export type ProjectItem = {
  name: string;
  description: string;
  technologies?: string;
  githubUrl?: string;
  liveUrl?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
};

export type CertItem = {
  name: string;
  issuer?: string;
  year?: string;
  issueDate?: string;
  credentialId?: string;
  credentialUrl?: string;
};

export type LanguageItem = {
  language: string;
  proficiency: string;
};

export type AchievementItem = {
  title: string;
  description?: string;
  date?: string;
};

export type ResumeData = {
  _id?: string;
  title?: string;
  headline?: string;
  summary?: string;
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certificates: CertItem[];
  languages: LanguageItem[];
  achievements: AchievementItem[];
  isFresher: boolean;
  template: TemplateId;
  completeness: number;
  status: "draft" | "published";
  source?: "profile" | "upload" | "manual";
  fileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type MissingField = {
  id: string;
  label: string;
  section: string;
  stepIndex: number;
  importance: "required" | "recommended";
};

export const TEMPLATES_META: Record<
  TemplateId,
  {
    id: TemplateId;
    name: string;
    description: string;
    badge?: string;
    isRecommended?: boolean;
    accentColor: string;
  }
> = {
  ats: {
    id: "ats",
    name: "ATS Professional",
    description: "Standard single-column format optimized for ATS parsers and corporate applications.",
    badge: "Recommended",
    isRecommended: true,
    accentColor: "#0f5daa",
  },
  modern: {
    id: "modern",
    name: "Modern Professional",
    description: "Clean corporate layout with subtle accent headers and modern skill chips.",
    accentColor: "#0284c7",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Typography-focused layout with generous whitespace for maximum elegance.",
    accentColor: "#334155",
  },
  creative: {
    id: "creative",
    name: "Creative",
    description: "Visual design accents and header bar tailored for tech, design & marketing roles.",
    accentColor: "#6366f1",
  },
  executive: {
    id: "executive",
    name: "Executive",
    description: "Formal structured hierarchy with strong typographic framing for senior roles.",
    accentColor: "#0f294a",
  },
};

export function calculateResumeCompleteness(data: Partial<ResumeData>): number {
  let score = 0;
  const p = data.personalInfo || ({} as Partial<PersonalInfo>);

  if (p.fullName && p.fullName.trim()) score += 10;
  if (p.email && p.email.trim()) score += 10;
  if (p.phone && p.phone.trim()) score += 10;
  if ((p.location && p.location.trim()) || (p.city && p.city.trim())) score += 10;
  if (p.headline && p.headline.trim()) score += 10;
  if (data.summary && data.summary.trim().length > 10) score += 10;
  if (data.education && data.education.length > 0) score += 15;
  if ((data.experience && data.experience.length > 0) || data.isFresher) score += 15;
  if (data.skills && data.skills.length >= 3) score += 10;
  else if (data.skills && data.skills.length > 0) score += 5;

  return Math.min(100, score);
}

export function detectMissingFields(data: ResumeData): MissingField[] {
  const missing: MissingField[] = [];
  const p = data.personalInfo || ({} as PersonalInfo);

  if (!p.fullName || !p.fullName.trim()) {
    missing.push({ id: "fullName", label: "Full Name", section: "Personal", stepIndex: 0, importance: "required" });
  }
  if (!p.email || !p.email.trim()) {
    missing.push({ id: "email", label: "Email Address", section: "Personal", stepIndex: 0, importance: "required" });
  }
  if (!p.phone || !p.phone.trim()) {
    missing.push({ id: "phone", label: "Phone Number", section: "Personal", stepIndex: 0, importance: "required" });
  }
  if (!p.location || !p.location.trim()) {
    missing.push({ id: "location", label: "Location / City", section: "Personal", stepIndex: 0, importance: "required" });
  }
  if (!p.headline || !p.headline.trim()) {
    missing.push({ id: "headline", label: "Professional Title", section: "Personal", stepIndex: 0, importance: "recommended" });
  }
  if (!data.summary || data.summary.trim().length < 15) {
    missing.push({ id: "summary", label: "Professional Summary", section: "Summary", stepIndex: 1, importance: "recommended" });
  }
  if (!data.education || data.education.length === 0) {
    missing.push({ id: "education", label: "Education Details", section: "Education", stepIndex: 2, importance: "required" });
  }
  if (!data.isFresher && (!data.experience || data.experience.length === 0)) {
    missing.push({ id: "experience", label: "Work Experience (or toggle Fresher)", section: "Experience", stepIndex: 3, importance: "required" });
  }
  if (!data.skills || data.skills.length < 3) {
    missing.push({ id: "skills", label: "At least 3 Key Skills", section: "Skills", stepIndex: 4, importance: "required" });
  }

  return missing;
}
