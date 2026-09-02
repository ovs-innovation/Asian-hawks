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

export async function getResume(req, res) {
  try {
    let item = await Resume.findOne({ user: req.user._id });

    if (!item) {
      // Build auto-imported draft from Candidate Profile
      const u = req.user;
      const initialLanguages = (u.languages || ["English", "Hindi"]).map((l) =>
        typeof l === "string" ? { language: l, proficiency: "Proficient" } : l
      );

      const initialDraft = {
        user: u._id,
        title: `${u.name ? u.name.split(" ")[0] : "My"} Resume`,
        headline: u.headline || "",
        summary: u.bio || "",
        personalInfo: {
          fullName: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          location: u.location || u.city || "",
          city: u.city || "",
          country: u.country || "India",
          headline: u.headline || "",
          linkedin: u.linkedin || "",
          github: u.github || "",
          portfolio: u.website || "",
        },
        experience: (u.workExperience || []).map((w) => ({
          company: w.company || "",
          title: w.title || "",
          location: "",
          start: w.start || "",
          end: w.end || "",
          current: !!w.current,
          description: w.description || "",
          highlights: [],
        })),
        education: (u.education || []).map((e) => ({
          school: e.school || "",
          degree: e.degree || "",
          field: e.field || "",
          year: e.year || "",
          grade: "",
          description: "",
        })),
        skills: u.skills && u.skills.length > 0 ? u.skills : ["Communication", "Problem Solving"],
        certificates: (u.certifications || []).map((c) => ({
          name: c.name || "",
          issuer: c.issuer || "",
          year: c.year || "",
        })),
        projects: [],
        languages: initialLanguages,
        achievements: [],
        isFresher: !u.workExperience || u.workExperience.length === 0,
        template: "ats",
        source: "profile",
        status: "draft",
      };

      initialDraft.completeness = calculateCompleteness(initialDraft);
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

    // If resume document does not exist yet in MongoDB, create an initial draft
    if (!resume) {
      const initialLanguages = (u.languages || ["English", "Hindi"]).map((l) =>
        typeof l === "string" ? { language: l, proficiency: "Proficient" } : l
      );
      resume = new Resume({
        user: u._id,
        title: `${u.name ? u.name.split(" ")[0] : "My"} Resume`,
        headline: u.headline || "",
        summary: u.bio || "",
        personalInfo: {
          fullName: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          location: u.location || u.city || "",
          city: u.city || "",
          country: u.country || "India",
          headline: u.headline || "",
          linkedin: u.linkedin || "",
          github: u.github || "",
          portfolio: u.website || "",
        },
        experience: (u.workExperience || []).map((w) => ({
          company: w.company || "",
          title: w.title || "",
          location: "",
          start: w.start || "",
          end: w.end || "",
          current: !!w.current,
          description: w.description || "",
          highlights: [],
        })),
        education: (u.education || []).map((e) => ({
          school: e.school || "",
          degree: e.degree || "",
          field: e.field || "",
          year: e.year || "",
          grade: "",
          description: "",
        })),
        skills: u.skills && u.skills.length > 0 ? u.skills : ["Communication", "Problem Solving"],
        certificates: (u.certifications || []).map((c) => ({
          name: c.name || "",
          issuer: c.issuer || "",
          year: c.year || "",
        })),
        projects: [],
        languages: initialLanguages,
        achievements: [],
        isFresher: !u.workExperience || u.workExperience.length === 0,
        template: "ats",
        source: "profile",
        status: "draft",
      });
      resume.completeness = calculateCompleteness(resume);
      await resume.save();
    }

    if (!resume.personalInfo) {
      resume.personalInfo = {};
    }

    const p = resume.personalInfo;
    const diffs = [];

    if (u.name && u.name !== p.fullName) {
      diffs.push({ field: "Full Name", path: "personalInfo.fullName", profileValue: u.name, resumeValue: p.fullName || "" });
    }
    if (u.email && u.email !== p.email) {
      diffs.push({ field: "Email", path: "personalInfo.email", profileValue: u.email, resumeValue: p.email || "" });
    }
    if (u.phone && u.phone !== p.phone) {
      diffs.push({ field: "Phone", path: "personalInfo.phone", profileValue: u.phone, resumeValue: p.phone || "" });
    }
    if (u.headline && (u.headline !== p.headline || u.headline !== resume.headline)) {
      diffs.push({ field: "Headline / Title", path: "personalInfo.headline", profileValue: u.headline, resumeValue: p.headline || "" });
    }
    if (u.location && u.location !== p.location) {
      diffs.push({ field: "Location", path: "personalInfo.location", profileValue: u.location, resumeValue: p.location || "" });
    }
    if (u.linkedin && u.linkedin !== p.linkedin) {
      diffs.push({ field: "LinkedIn URL", path: "personalInfo.linkedin", profileValue: u.linkedin, resumeValue: p.linkedin || "" });
    }
    if (u.github && u.github !== p.github) {
      diffs.push({ field: "GitHub URL", path: "personalInfo.github", profileValue: u.github, resumeValue: p.github || "" });
    }
    if (u.website && u.website !== p.portfolio) {
      diffs.push({ field: "Portfolio / Website", path: "personalInfo.portfolio", profileValue: u.website, resumeValue: p.portfolio || "" });
    }
    if (u.bio && u.bio !== resume.summary) {
      diffs.push({ field: "Professional Summary", path: "summary", profileValue: u.bio, resumeValue: resume.summary || "" });
    }
    if (u.skills && JSON.stringify(u.skills) !== JSON.stringify(resume.skills)) {
      diffs.push({ field: "Skills", path: "skills", profileValue: u.skills, resumeValue: resume.skills || [] });
    }

    // Work Experience sync
    const mappedWork = (u.workExperience || []).map((w) => ({
      company: w.company || "",
      title: w.title || "",
      location: "",
      start: w.start || "",
      end: w.end || "",
      current: !!w.current,
      description: w.description || "",
      highlights: [],
    }));
    if (
      u.workExperience &&
      JSON.stringify(mappedWork) !==
        JSON.stringify(
          (resume.experience || []).map((e) => ({
            company: e.company || "",
            title: e.title || "",
            location: e.location || "",
            start: e.start || "",
            end: e.end || "",
            current: !!e.current,
            description: e.description || "",
            highlights: e.highlights || [],
          }))
        )
    ) {
      diffs.push({ field: "Work Experience", path: "experience", profileValue: mappedWork, resumeValue: resume.experience || [] });
    }

    // Education sync
    const mappedEdu = (u.education || []).map((e) => ({
      school: e.school || "",
      degree: e.degree || "",
      field: e.field || "",
      year: e.year || "",
      grade: "",
      description: "",
    }));
    if (
      u.education &&
      JSON.stringify(mappedEdu) !==
        JSON.stringify(
          (resume.education || []).map((e) => ({
            school: e.school || "",
            degree: e.degree || "",
            field: e.field || "",
            year: e.year || "",
            grade: e.grade || "",
            description: e.description || "",
          }))
        )
    ) {
      diffs.push({ field: "Education", path: "education", profileValue: mappedEdu, resumeValue: resume.education || [] });
    }

    // Certifications sync
    const mappedCerts = (u.certifications || []).map((c) => ({
      name: c.name || "",
      issuer: c.issuer || "",
      year: c.year || "",
    }));
    if (
      u.certifications &&
      JSON.stringify(mappedCerts) !==
        JSON.stringify(
          (resume.certificates || []).map((c) => ({
            name: c.name || "",
            issuer: c.issuer || "",
            year: c.year || "",
          }))
        )
    ) {
      diffs.push({ field: "Certifications", path: "certificates", profileValue: mappedCerts, resumeValue: resume.certificates || [] });
    }

    if (req.method === "POST") {
      const appliedFields = req.body.applyDiffs || diffs.map((d) => d.path);
      appliedFields.forEach((path) => {
        if (path === "personalInfo.fullName") resume.personalInfo.fullName = u.name;
        if (path === "personalInfo.email") resume.personalInfo.email = u.email;
        if (path === "personalInfo.phone") resume.personalInfo.phone = u.phone;
        if (path === "personalInfo.headline") {
          resume.personalInfo.headline = u.headline;
          resume.headline = u.headline;
        }
        if (path === "personalInfo.location") {
          resume.personalInfo.location = u.location;
          if (u.city) resume.personalInfo.city = u.city;
        }
        if (path === "personalInfo.linkedin") resume.personalInfo.linkedin = u.linkedin;
        if (path === "personalInfo.github") resume.personalInfo.github = u.github;
        if (path === "personalInfo.portfolio") resume.personalInfo.portfolio = u.website;
        if (path === "summary") resume.summary = u.bio;
        if (path === "skills") resume.skills = u.skills;
        if (path === "experience") resume.experience = mappedWork;
        if (path === "education") resume.education = mappedEdu;
        if (path === "certificates") resume.certificates = mappedCerts;
      });

      resume.markModified("personalInfo");
      resume.markModified("experience");
      resume.markModified("education");
      resume.markModified("certificates");
      resume.markModified("skills");

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
