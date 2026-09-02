import type { ResumeData, LanguageItem, ExperienceItem, EducationItem, CertItem } from "@/types/resume";

export interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  headline?: string;
  location?: string;
  city?: string;
  country?: string;
  bio?: string;
  skills?: string[];
  website?: string;
  linkedin?: string;
  github?: string;
  languages?: (string | { language?: string; name?: string; proficiency?: string })[];
  workExperience?: {
    company?: string;
    title?: string;
    start?: string;
    end?: string;
    current?: boolean;
    description?: string;
    location?: string;
    highlights?: string[];
  }[];
  education?: {
    school?: string;
    degree?: string;
    field?: string;
    year?: string;
    grade?: string;
    description?: string;
  }[];
  certifications?: {
    name?: string;
    issuer?: string;
    year?: string;
  }[];
}

/**
 * Normalizes user languages from various formats (string[] or LanguageItem[])
 * into structured [{ language: string, proficiency: string }]
 */
export function normalizeLanguages(
  languages?: (string | { language?: string; name?: string; proficiency?: string })[] | null,
  existingLanguages: LanguageItem[] = []
): LanguageItem[] {
  if (!languages || !Array.isArray(languages)) {
    return existingLanguages && existingLanguages.length > 0 ? existingLanguages : [];
  }

  const existingProfMap = new Map<string, string>();
  if (existingLanguages && Array.isArray(existingLanguages)) {
    for (const l of existingLanguages) {
      if (l && typeof l === "object" && l.language) {
        existingProfMap.set(l.language.toLowerCase().trim(), l.proficiency || "Proficient");
      }
    }
  }

  const seen = new Set<string>();
  const normalized: LanguageItem[] = [];

  for (const item of languages) {
    let name = "";
    let proficiency = "Proficient";

    if (typeof item === "string") {
      name = item.trim();
    } else if (item && typeof item === "object") {
      name = (item.language || item.name || "").trim();
      proficiency = item.proficiency || "Proficient";
    }

    if (name) {
      const key = name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        const preservedProf = existingProfMap.get(key) || proficiency || "Proficient";
        normalized.push({ language: name, proficiency: preservedProf });
      }
    }
  }

  return normalized;
}

/**
 * Centralized client-side mapper converting Profile data to Resume data structure
 */
export function profileToResume(
  profile: ProfileData,
  existingResume: Partial<ResumeData> = {}
): Partial<ResumeData> {
  const p = existingResume?.personalInfo || ({} as any);

  // 1. Languages
  const mappedLanguages = normalizeLanguages(profile.languages, existingResume?.languages || []);

  // 2. Skills
  const skillsSeen = new Set<string>();
  const mappedSkills: string[] = [];
  const sourceSkills = (profile.skills && profile.skills.length > 0)
    ? profile.skills
    : (existingResume?.skills || ["Communication", "Problem Solving"]);

  for (const s of sourceSkills) {
    if (typeof s === "string" && s.trim()) {
      const key = s.trim().toLowerCase();
      if (!skillsSeen.has(key)) {
        skillsSeen.add(key);
        mappedSkills.push(s.trim());
      }
    }
  }

  // 3. Experience
  const existingWorkMap = new Map<string, ExperienceItem>();
  if (existingResume?.experience && Array.isArray(existingResume.experience)) {
    for (const w of existingResume.experience) {
      const key = `${(w.company || "").toLowerCase().trim()}:::${(w.title || "").toLowerCase().trim()}`;
      existingWorkMap.set(key, w);
    }
  }

  const mappedWork: ExperienceItem[] = (profile.workExperience || []).map((w) => {
    const key = `${(w.company || "").toLowerCase().trim()}:::${(w.title || "").toLowerCase().trim()}`;
    const existing = existingWorkMap.get(key);
    return {
      company: w.company || "",
      title: w.title || "",
      location: w.location || existing?.location || "",
      start: w.start || "",
      end: w.end || "",
      current: !!w.current,
      description: w.description || "",
      highlights: w.highlights || existing?.highlights || [],
    };
  });

  // 4. Education
  const existingEduMap = new Map<string, EducationItem>();
  if (existingResume?.education && Array.isArray(existingResume.education)) {
    for (const e of existingResume.education) {
      const key = `${(e.school || "").toLowerCase().trim()}:::${(e.degree || "").toLowerCase().trim()}`;
      existingEduMap.set(key, e);
    }
  }

  const mappedEdu: EducationItem[] = (profile.education || []).map((e) => {
    const key = `${(e.school || "").toLowerCase().trim()}:::${(e.degree || "").toLowerCase().trim()}`;
    const existing = existingEduMap.get(key);
    return {
      school: e.school || "",
      degree: e.degree || "",
      field: e.field || "",
      startYear: existing?.startYear || "",
      year: e.year || "",
      grade: existing?.grade || "",
      description: existing?.description || "",
    };
  });

  // 5. Certifications
  const existingCertMap = new Map<string, CertItem>();
  if (existingResume?.certificates && Array.isArray(existingResume.certificates)) {
    for (const c of existingResume.certificates) {
      const key = (c.name || "").toLowerCase().trim();
      existingCertMap.set(key, c);
    }
  }

  const mappedCerts: CertItem[] = (profile.certifications || []).map((c) => {
    const key = (c.name || "").toLowerCase().trim();
    const existing = existingCertMap.get(key);
    return {
      name: c.name || "",
      issuer: c.issuer || "",
      year: c.year || "",
      issueDate: existing?.issueDate || "",
      credentialId: existing?.credentialId || "",
      credentialUrl: existing?.credentialUrl || "",
    };
  });

  return {
    ...existingResume,
    title: existingResume?.title || `${profile.name ? profile.name.split(" ")[0] : "My"} Resume`,
    headline: profile.headline || existingResume?.headline || "",
    summary: profile.bio || existingResume?.summary || "",
    personalInfo: {
      fullName: profile.name || p.fullName || "",
      email: profile.email || p.email || "",
      phone: profile.phone || p.phone || "",
      location: profile.location || profile.city || p.location || "",
      city: profile.city || p.city || "",
      country: profile.country || p.country || "India",
      headline: profile.headline || p.headline || "",
      linkedin: profile.linkedin || p.linkedin || "",
      github: profile.github || p.github || "",
      portfolio: profile.website || p.portfolio || "",
    },
    experience: mappedWork.length > 0 ? mappedWork : (existingResume?.experience || []),
    education: mappedEdu.length > 0 ? mappedEdu : (existingResume?.education || []),
    skills: mappedSkills,
    certificates: mappedCerts.length > 0 ? mappedCerts : (existingResume?.certificates || []),
    languages: mappedLanguages.length > 0 ? mappedLanguages : (existingResume?.languages || []),
    projects: existingResume?.projects || [],
    achievements: existingResume?.achievements || [],
    isFresher: !profile.workExperience || profile.workExperience.length === 0,
    template: existingResume?.template || "ats",
  };
}
