import { Resume } from "../models/Supporting.js";
import User from "../models/User.js";

export function calculateCompleteness(data) {
  let score = 0;
  const p = data.personalInfo || {};

  if (p.fullName || data.fullName) score += 10;
  if (p.email || data.email) score += 10;
  if (p.phone || data.phone) score += 10;
  if (p.location || p.city || data.location) score += 10;
  if (p.headline || data.headline) score += 10;
  if ((data.summary && data.summary.trim().length > 10) || (data.bio && data.bio.trim().length > 10)) score += 10;
  if (data.education && data.education.length > 0) score += 15;
  if ((data.experience && data.experience.length > 0) || data.isFresher) score += 15;
  if (data.skills && data.skills.length >= 3) score += 10;
  else if (data.skills && data.skills.length > 0) score += 5;

  return Math.min(100, score);
}

/**
 * Normalizes user languages from various formats (string[] or { language, proficiency }[])
 * into structured [{ language: string, proficiency: string }]
 */
export function normalizeLanguages(languages, existingLanguages = []) {
  if (!languages || !Array.isArray(languages)) {
    if (existingLanguages && Array.isArray(existingLanguages) && existingLanguages.length > 0) {
      return existingLanguages;
    }
    return [];
  }

  // Build map of existing proficiencies to preserve custom selections
  const existingProfMap = new Map();
  if (existingLanguages && Array.isArray(existingLanguages)) {
    for (const l of existingLanguages) {
      if (l && typeof l === "object" && l.language) {
        existingProfMap.set(l.language.toLowerCase().trim(), l.proficiency || "Proficient");
      }
    }
  }

  const seen = new Set();
  const normalized = [];

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
 * Centralized transformation function to convert Profile data into Resume data,
 * safely merging with any existing resume-specific customizations.
 */
export function profileToResume(u, existingResume = {}) {
  const p = existingResume?.personalInfo || {};

  // 1. Languages
  const mappedLanguages = normalizeLanguages(u.languages, existingResume?.languages);

  // 2. Skills
  const skillsSeen = new Set();
  const mappedSkills = [];
  const sourceSkills = (u.skills && u.skills.length > 0) ? u.skills : (existingResume?.skills || ["Communication", "Problem Solving"]);
  for (const s of sourceSkills) {
    if (typeof s === "string" && s.trim()) {
      const key = s.trim().toLowerCase();
      if (!skillsSeen.has(key)) {
        skillsSeen.add(key);
        mappedSkills.push(s.trim());
      }
    }
  }

  // 3. Work Experience
  const existingWorkMap = new Map();
  if (existingResume?.experience && Array.isArray(existingResume.experience)) {
    for (const w of existingResume.experience) {
      const key = `${(w.company || "").toLowerCase().trim()}:::${(w.title || "").toLowerCase().trim()}`;
      existingWorkMap.set(key, w);
    }
  }

  const mappedWork = (u.workExperience || []).map((w) => {
    const key = `${(w.company || "").toLowerCase().trim()}:::${(w.title || "").toLowerCase().trim()}`;
    const existing = existingWorkMap.get(key);
    return {
      company: w.company || "",
      title: w.title || "",
      location: existing?.location || "",
      start: w.start || "",
      end: w.end || "",
      current: !!w.current,
      description: w.description || "",
      highlights: existing?.highlights || [],
    };
  });

  // 4. Education
  const existingEduMap = new Map();
  if (existingResume?.education && Array.isArray(existingResume.education)) {
    for (const e of existingResume.education) {
      const key = `${(e.school || "").toLowerCase().trim()}:::${(e.degree || "").toLowerCase().trim()}`;
      existingEduMap.set(key, e);
    }
  }

  const mappedEdu = (u.education || []).map((e) => {
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
  const existingCertMap = new Map();
  if (existingResume?.certificates && Array.isArray(existingResume.certificates)) {
    for (const c of existingResume.certificates) {
      const key = (c.name || "").toLowerCase().trim();
      existingCertMap.set(key, c);
    }
  }

  const mappedCerts = (u.certifications || []).map((c) => {
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

  const merged = {
    user: u._id,
    title: existingResume?.title || `${u.name ? u.name.split(" ")[0] : "My"} Resume`,
    headline: u.headline || existingResume?.headline || "",
    summary: u.bio || existingResume?.summary || "",
    personalInfo: {
      fullName: u.name || p.fullName || "",
      email: u.email || p.email || "",
      phone: u.phone || p.phone || "",
      location: u.location || u.city || p.location || "",
      city: u.city || p.city || "",
      country: u.country || p.country || "India",
      headline: u.headline || p.headline || "",
      linkedin: u.linkedin || p.linkedin || "",
      github: u.github || p.github || "",
      portfolio: u.website || p.portfolio || "",
    },
    experience: mappedWork.length > 0 ? mappedWork : (existingResume?.experience || []),
    education: mappedEdu.length > 0 ? mappedEdu : (existingResume?.education || []),
    skills: mappedSkills,
    certificates: mappedCerts.length > 0 ? mappedCerts : (existingResume?.certificates || []),
    languages: mappedLanguages.length > 0 ? mappedLanguages : (existingResume?.languages || []),
    projects: existingResume?.projects || [],
    achievements: existingResume?.achievements || [],
    isFresher: !u.workExperience || u.workExperience.length === 0,
    template: existingResume?.template || "ats",
    source: existingResume?.source || "profile",
    status: existingResume?.status || "draft",
    fileUrl: existingResume?.fileUrl || "",
  };

  merged.completeness = calculateCompleteness(merged);
  return merged;
}

export async function getResume(req, res) {
  try {
    let item = await Resume.findOne({ user: req.user._id });

    if (!item) {
      // Build auto-imported draft from Candidate Profile
      const u = req.user;
      const initialDraft = profileToResume(u, null);
      return res.json({ item: initialDraft, isNewDraft: true });
    }

    // Ensure completeness is up to date
    item.completeness = calculateCompleteness(item);
    res.json({ item, isNewDraft: false });
  } catch (err) {
    console.error("getResume error:", err);
    res.status(500).json({ message: "Failed to load resume" });
  }
}

export async function saveResume(req, res) {
  try {
    const payload = { ...req.body, user: req.user._id };
    payload.completeness = calculateCompleteness(payload);

    const item = await Resume.findOneAndUpdate(
      { user: req.user._id },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Synchronize overall user profile completion score if higher
    if (item.completeness > (req.user.profileCompletion || 0)) {
      await User.findByIdAndUpdate(req.user._id, {
        profileCompletion: Math.max(req.user.profileCompletion || 20, item.completeness),
      });
    }

    res.json({ ok: true, item, message: "Resume saved successfully" });
  } catch (err) {
    console.error("saveResume error:", err);
    res.status(500).json({ message: "Failed to save resume" });
  }
}

export async function syncWithProfile(req, res) {
  try {
    const u = await User.findById(req.user._id);
    if (!u) return res.status(404).json({ message: "User not found" });

    let resume = await Resume.findOne({ user: req.user._id });

    // If resume document does not exist yet in MongoDB, create it from Profile
    if (!resume) {
      const initialDraft = profileToResume(u, null);
      resume = new Resume(initialDraft);
      await resume.save();
    }

    if (!resume.personalInfo) {
      resume.personalInfo = {};
    }

    const p = resume.personalInfo;
    const diffs = [];

    // 1. Personal Information
    if (u.name && u.name.trim() !== (p.fullName || "").trim()) {
      diffs.push({ field: "Full Name", path: "personalInfo.fullName", profileValue: u.name, resumeValue: p.fullName || "" });
    }
    if (u.email && u.email.trim() !== (p.email || "").trim()) {
      diffs.push({ field: "Email", path: "personalInfo.email", profileValue: u.email, resumeValue: p.email || "" });
    }
    if (u.phone && u.phone.trim() !== (p.phone || "").trim()) {
      diffs.push({ field: "Phone", path: "personalInfo.phone", profileValue: u.phone, resumeValue: p.phone || "" });
    }
    if (u.headline && (u.headline.trim() !== (p.headline || "").trim() || u.headline.trim() !== (resume.headline || "").trim())) {
      diffs.push({ field: "Headline / Title", path: "personalInfo.headline", profileValue: u.headline, resumeValue: p.headline || "" });
    }
    if (u.location && u.location.trim() !== (p.location || "").trim()) {
      diffs.push({ field: "Location", path: "personalInfo.location", profileValue: u.location, resumeValue: p.location || "" });
    }
    if (u.city && u.city.trim() !== (p.city || "").trim()) {
      diffs.push({ field: "City", path: "personalInfo.city", profileValue: u.city, resumeValue: p.city || "" });
    }
    if (u.country && u.country.trim() !== (p.country || "").trim()) {
      diffs.push({ field: "Country", path: "personalInfo.country", profileValue: u.country, resumeValue: p.country || "" });
    }
    if (u.linkedin && u.linkedin.trim() !== (p.linkedin || "").trim()) {
      diffs.push({ field: "LinkedIn URL", path: "personalInfo.linkedin", profileValue: u.linkedin, resumeValue: p.linkedin || "" });
    }
    if (u.github && u.github.trim() !== (p.github || "").trim()) {
      diffs.push({ field: "GitHub URL", path: "personalInfo.github", profileValue: u.github, resumeValue: p.github || "" });
    }
    if (u.website && u.website.trim() !== (p.portfolio || "").trim()) {
      diffs.push({ field: "Portfolio / Website", path: "personalInfo.portfolio", profileValue: u.website, resumeValue: p.portfolio || "" });
    }

    // 2. Summary
    if (u.bio && u.bio.trim() !== (resume.summary || "").trim()) {
      diffs.push({ field: "Professional Summary", path: "summary", profileValue: u.bio, resumeValue: resume.summary || "" });
    }

    // 3. Skills
    const cleanUserSkills = (u.skills || []).map((s) => s.trim()).filter(Boolean);
    const cleanResumeSkills = (resume.skills || []).map((s) => s.trim()).filter(Boolean);
    if (JSON.stringify(cleanUserSkills) !== JSON.stringify(cleanResumeSkills)) {
      diffs.push({ field: "Skills", path: "skills", profileValue: cleanUserSkills, resumeValue: cleanResumeSkills });
    }

    // 4. Languages (Normalized comparison)
    const targetLangs = normalizeLanguages(u.languages, resume.languages);
    const currentLangs = normalizeLanguages(resume.languages, []);
    const targetLangsNames = targetLangs.map((l) => l.language.toLowerCase()).sort();
    const currentLangsNames = currentLangs.map((l) => l.language.toLowerCase()).sort();

    if (JSON.stringify(targetLangsNames) !== JSON.stringify(currentLangsNames)) {
      diffs.push({
        field: "Languages",
        path: "languages",
        profileValue: targetLangs,
        resumeValue: resume.languages || [],
      });
    }

    // 5. Work Experience
    const targetWork = (u.workExperience || []).map((w) => ({
      company: w.company || "",
      title: w.title || "",
      location: "",
      start: w.start || "",
      end: w.end || "",
      current: !!w.current,
      description: w.description || "",
      highlights: [],
    }));
    const currentWork = (resume.experience || []).map((e) => ({
      company: e.company || "",
      title: e.title || "",
      location: e.location || "",
      start: e.start || "",
      end: e.end || "",
      current: !!e.current,
      description: e.description || "",
      highlights: e.highlights || [],
    }));

    if (
      u.workExperience &&
      JSON.stringify(targetWork.map(({ location, highlights, ...rest }) => rest)) !==
      JSON.stringify(currentWork.map(({ location, highlights, ...rest }) => rest))
    ) {
      diffs.push({ field: "Work Experience", path: "experience", profileValue: targetWork, resumeValue: resume.experience || [] });
    }

    // 6. Education
    const targetEdu = (u.education || []).map((e) => ({
      school: e.school || "",
      degree: e.degree || "",
      field: e.field || "",
      year: e.year || "",
      grade: "",
      description: "",
    }));
    const currentEdu = (resume.education || []).map((e) => ({
      school: e.school || "",
      degree: e.degree || "",
      field: e.field || "",
      year: e.year || "",
      grade: e.grade || "",
      description: e.description || "",
    }));

    if (
      u.education &&
      JSON.stringify(targetEdu.map(({ grade, description, ...rest }) => rest)) !==
      JSON.stringify(currentEdu.map(({ grade, description, ...rest }) => rest))
    ) {
      diffs.push({ field: "Education", path: "education", profileValue: targetEdu, resumeValue: resume.education || [] });
    }

    // 7. Certifications
    const targetCerts = (u.certifications || []).map((c) => ({
      name: c.name || "",
      issuer: c.issuer || "",
      year: c.year || "",
    }));
    const currentCerts = (resume.certificates || []).map((c) => ({
      name: c.name || "",
      issuer: c.issuer || "",
      year: c.year || "",
    }));

    if (
      u.certifications &&
      JSON.stringify(targetCerts) !== JSON.stringify(currentCerts)
    ) {
      diffs.push({ field: "Certifications", path: "certificates", profileValue: targetCerts, resumeValue: resume.certificates || [] });
    }

    // Handle POST application of diffs
    if (req.method === "POST") {
      const fullTarget = profileToResume(u, resume);
      const appliedFields = req.body.applyDiffs || diffs.map((d) => d.path);

      appliedFields.forEach((path) => {
        if (path === "personalInfo.fullName") resume.personalInfo.fullName = fullTarget.personalInfo.fullName;
        if (path === "personalInfo.email") resume.personalInfo.email = fullTarget.personalInfo.email;
        if (path === "personalInfo.phone") resume.personalInfo.phone = fullTarget.personalInfo.phone;
        if (path === "personalInfo.headline") {
          resume.personalInfo.headline = fullTarget.personalInfo.headline;
          resume.headline = fullTarget.headline;
        }
        if (path === "personalInfo.location") resume.personalInfo.location = fullTarget.personalInfo.location;
        if (path === "personalInfo.city") resume.personalInfo.city = fullTarget.personalInfo.city;
        if (path === "personalInfo.country") resume.personalInfo.country = fullTarget.personalInfo.country;
        if (path === "personalInfo.linkedin") resume.personalInfo.linkedin = fullTarget.personalInfo.linkedin;
        if (path === "personalInfo.github") resume.personalInfo.github = fullTarget.personalInfo.github;
        if (path === "personalInfo.portfolio") resume.personalInfo.portfolio = fullTarget.personalInfo.portfolio;
        if (path === "summary") resume.summary = fullTarget.summary;
        if (path === "skills") resume.skills = fullTarget.skills;
        if (path === "languages") resume.languages = fullTarget.languages;
        if (path === "experience") resume.experience = fullTarget.experience;
        if (path === "education") resume.education = fullTarget.education;
        if (path === "certificates") resume.certificates = fullTarget.certificates;
      });

      resume.markModified("personalInfo");
      resume.markModified("experience");
      resume.markModified("education");
      resume.markModified("certificates");
      resume.markModified("skills");
      resume.markModified("languages");

      resume.completeness = calculateCompleteness(resume);
      await resume.save();
      return res.json({ ok: true, item: resume, message: "Profile synchronized with resume" });
    }

    res.json({ diffs, hasChanges: diffs.length > 0 });
  } catch (err) {
    console.error("syncWithProfile error:", err);
    res.status(500).json({ message: "Failed to check profile sync" });
  }
}

export async function uploadAndParseResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a resume file (PDF or Word DOCX)" });
    }

    const fileUrl = `/uploads/resumes/${req.file.filename}`;
    const filename = req.file.originalname || "resume";

    // Heuristic extraction from filename and basic text inspection
    const baseName = filename.replace(/\.[^/.]+$/, "").replace(/[_\-+]/g, " ").trim();
    const extracted = {
      fileUrl,
      fileName: filename,
      suggestedName: baseName.length > 2 && !/resume|cv|biodata/i.test(baseName) ? baseName : req.user.name,
      suggestedEmail: req.user.email,
      suggestedPhone: req.user.phone || "",
      suggestedSkills: req.user.skills || [],
    };

    // Check conflicts with current candidate profile
    const conflicts = [];
    if (req.user.name && extracted.suggestedName && req.user.name.toLowerCase() !== extracted.suggestedName.toLowerCase()) {
      conflicts.push({
        field: "Name",
        profileValue: req.user.name,
        extractedValue: extracted.suggestedName,
      });
    }

    res.json({
      ok: true,
      message: "Resume uploaded successfully",
      extracted,
      conflicts,
      fileUrl,
    });
  } catch (err) {
    console.error("uploadAndParseResume error:", err);
    res.status(500).json({ message: "Failed to process uploaded resume" });
  }
}
