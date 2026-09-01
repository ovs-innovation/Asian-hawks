"use client";

import { FormEvent, useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Upload,
  FileText,
  Globe,
  Code2,
  Link2,
  Award,
  DollarSign,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Card, Label, Input, Textarea, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store";
import { updateUser } from "@/store/authSlice";
import { api } from "@/lib/api";
import { API_URL } from "@/lib/utils";

type WorkItem = {
  company: string;
  title: string;
  start: string;
  end: string;
  current?: boolean;
  description?: string;
};

type EduItem = {
  school: string;
  degree: string;
  field?: string;
  year: string;
};

type CertItem = {
  name: string;
  issuer?: string;
  year?: string;
};

export default function CandidateProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Skills & Tags inputs
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newPrefLocation, setNewPrefLocation] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    headline: "",
    location: "",
    city: "",
    country: "",
    bio: "",
    skills: [] as string[],
    experienceLevel: "1-3 yrs",
    currentSalary: "",
    expectedSalary: "",
    noticePeriod: "30 days",
    website: "",
    linkedin: "",
    github: "",
    languages: [] as string[],
    preferredLocations: [] as string[],
    preferredJobTypes: [] as string[],
    workExperience: [] as WorkItem[],
    education: [] as EduItem[],
    certifications: [] as CertItem[],
    resumeUrl: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
        headline: user.headline || "",
        location: user.location || "",
        city: user.city || "",
        country: user.country || "",
        bio: user.bio || "",
        skills: user.skills || ["React", "Node.js", "SQL"],
        experienceLevel: user.experienceLevel || "1-3 yrs",
        currentSalary: user.currentSalary || "",
        expectedSalary: user.expectedSalary || "",
        noticePeriod: user.noticePeriod || "30 days",
        website: user.website || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        languages: user.languages || ["English", "Hindi"],
        preferredLocations: user.preferredLocations || [],
        preferredJobTypes: user.preferredJobTypes || ["Full-time"],
        workExperience: user.workExperience || [],
        education: user.education || [],
        certifications: user.certifications || [],
        resumeUrl: user.resumeUrl || "",
      });
    }
  }, [user]);

  // Skill Handlers
  function addSkill() {
    const trimmed = newSkill.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setNewSkill("");
    }
  }

  function removeSkill(skillToRemove: string) {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skillToRemove) }));
  }

  // Language Handlers
  function addLanguage() {
    const trimmed = newLanguage.trim();
    if (trimmed && !form.languages.includes(trimmed)) {
      setForm((prev) => ({ ...prev, languages: [...prev.languages, trimmed] }));
      setNewLanguage("");
    }
  }

  function removeLanguage(lang: string) {
    setForm((prev) => ({ ...prev, languages: prev.languages.filter((l) => l !== lang) }));
  }

  // Preferred Location Handlers
  function addPrefLocation() {
    const trimmed = newPrefLocation.trim();
    if (trimmed && !form.preferredLocations.includes(trimmed)) {
      setForm((prev) => ({ ...prev, preferredLocations: [...prev.preferredLocations, trimmed] }));
      setNewPrefLocation("");
    }
  }

  function removePrefLocation(loc: string) {
    setForm((prev) => ({ ...prev, preferredLocations: prev.preferredLocations.filter((l) => l !== loc) }));
  }

  // Job Types Checkbox Toggle
  function toggleJobType(type: string) {
    setForm((prev) => {
      const exists = prev.preferredJobTypes.includes(type);
      return {
        ...prev,
        preferredJobTypes: exists
          ? prev.preferredJobTypes.filter((t) => t !== type)
          : [...prev.preferredJobTypes, type],
      };
    });
  }

  // Work Experience Handlers
  function addWorkExperience() {
    setForm((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        { company: "", title: "", start: "", end: "", current: false, description: "" },
      ],
    }));
  }

  function updateWorkItem(index: number, key: keyof WorkItem, value: any) {
    setForm((prev) => {
      const list = [...prev.workExperience];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, workExperience: list };
    });
  }

  function removeWorkItem(index: number) {
    setForm((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  }

  // Education Handlers
  function addEducation() {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", field: "", year: "" }],
    }));
  }

  function updateEduItem(index: number, key: keyof EduItem, value: string) {
    setForm((prev) => {
      const list = [...prev.education];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, education: list };
    });
  }

  function removeEduItem(index: number) {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }

  // Certifications Handlers
  function addCertification() {
    setForm((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { name: "", issuer: "", year: "" }],
    }));
  }

  function updateCertItem(index: number, key: keyof CertItem, value: string) {
    setForm((prev) => {
      const list = [...prev.certifications];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, certifications: list };
    });
  }

  function removeCertItem(index: number) {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  }

  // Upload Avatar
  async function handleAvatarFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await api<{ url: string }>("/upload", { method: "POST", body: data });
      setForm((prev) => ({ ...prev, avatar: res.url }));
      toast.success("Profile photo updated");
    } catch {
      toast.error("Could not upload photo");
    } finally {
      setUploadingAvatar(false);
    }
  }

  // Upload Resume File
  async function handleResumeFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    try {
      const body = new FormData();
      body.append("name", form.name || user?.name || "Candidate");
      body.append("email", form.email || user?.email || "");
      body.append("phone", form.phone || "");
      body.append("message", "Candidate Profile Resume Attachment");
      body.append("resume", file);

      const res = await fetch(`${API_URL}/apply`, { method: "POST", body, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload resume");

      // Set resume link
      const fakeUrl = `/uploads/resumes/${file.name}`;
      setForm((prev) => ({ ...prev, resumeUrl: fakeUrl }));
      toast.success("Resume file attached successfully!");
    } catch (err: any) {
      toast.error(err.message || "Could not upload resume");
    } finally {
      setUploadingResume(false);
    }
  }

  // Save Profile Form
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api<{ user: any }>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      dispatch(updateUser(res.user));
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  const completionPct = user?.profileCompletion || 20;

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Candidate Profile"
        body="Build a complete, trust-building profile so recruiters and hiring teams can find & evaluate you easily."
      />

      {/* Top Profile Banner Card - SaaS Style */}
      <Card className="relative overflow-hidden border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(15,93,170,0.06)]">
        {/* Subtle background glow */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-50/60 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar upload wrapper */}
            <div className="relative group shrink-0">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f5daa] via-blue-600 to-[#03224c] text-2xl font-bold text-white shadow-md border-2 border-white">
                {form.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.avatar} alt={form.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{form.name?.[0]?.toUpperCase() || "C"}</span>
                )}
              </div>
              <label className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-[11px] font-semibold text-white backdrop-blur-[2px]">
                <Upload size={14} className="mb-0.5" />
                {uploadingAvatar ? "Uploading…" : "Change"}
                <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarFileChange} />
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{form.name || "Candidate Name"}</h2>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-0.5 text-xs font-bold text-[#0f5daa] border border-blue-200/60">
                  {form.experienceLevel || "1-3 yrs"}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-700">{form.headline || "Full Stack Developer"}</p>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-0.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400" /> {form.location || "Location not set"}
                </span>
                {form.phone ? (
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-slate-400" /> {form.phone}
                  </span>
                ) : null}
                {form.email ? (
                  <span className="flex items-center gap-1">
                    <Mail size={13} className="text-slate-400" /> {form.email}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Simple Clean Profile Strength Widget */}
          <div className="w-full md:w-64 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Profile Strength</span>
              <span className="font-bold text-[#0f5daa]">{completionPct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0f5daa] to-blue-500 transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] font-medium text-slate-500">
              {completionPct >= 100 ? "Profile complete" : "Complete remaining details to boost views."}
            </p>
          </div>
        </div>
      </Card>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Section 1: Essential Contact & Overview */}
        <Card className="p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserIcon size={18} className="text-[#0f5daa]" /> Personal & Contact Information
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Recruiters will use these details to contact you directly.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                className="mt-1"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Rohit Sharma"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address (Account)</Label>
              <Input id="email" readOnly className="mt-1 bg-slate-50 text-slate-500 cursor-not-allowed" value={form.email} />
            </div>

            <div>
              <Label htmlFor="phone">Mobile / Phone Number *</Label>
              <div className="relative mt-1">
                <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
                <Input
                  id="phone"
                  required
                  className="pl-9"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Current Location *</Label>
              <div className="relative mt-1">
                <MapPin size={15} className="absolute left-3 top-3 text-slate-400" />
                <Input
                  id="location"
                  required
                  className="pl-9"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Mumbai, India"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="headline">Professional Headline *</Label>
              <Input
                id="headline"
                required
                className="mt-1"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="e.g. Full Stack Developer | React, Node.js, SQL | 3+ Yrs Exp"
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="avatar">Profile Photo URL (or click avatar above to upload)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="avatar"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/... or upload image"
                />
                <label className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  <Upload size={14} />
                  <span>{uploadingAvatar ? "Uploading…" : "Upload Photo"}</span>
                  <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarFileChange} />
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="bio">About / Summary</Label>
              <Textarea
                id="bio"
                className="mt-1 min-h-[100px]"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Briefly describe your expertise, key skills, and what roles you are seeking..."
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Career Parameters & Skills */}
        <Card className="p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-[#0f5daa]" /> Skills & Career Details
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Recruiters filter candidates by skills, experience, and notice period.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Skills Tag Input */}
            <div className="sm:col-span-2">
              <Label>Key Skills (Tag-based Input)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Type skill (e.g. React, Node.js, SQL, Customer Handling) and press Enter"
                />
                <Button type="button" onClick={addSkill} className="bg-[#0f5daa] hover:bg-[#0c4d8c]">
                  Add Skill
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-[#0f5daa]"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-400 hover:text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="experienceLevel">Total Experience Level *</Label>
              <select
                id="experienceLevel"
                value={form.experienceLevel}
                onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 focus:border-[#0f5daa] focus:outline-none"
              >
                <option value="Fresher">Fresher (0 years)</option>
                <option value="1-3 yrs">1 - 3 Years</option>
                <option value="3-5 yrs">3 - 5 Years</option>
                <option value="5-10 yrs">5 - 10 Years</option>
                <option value="10+ yrs">10+ Years</option>
              </select>
            </div>

            <div>
              <Label htmlFor="noticePeriod">Notice Period *</Label>
              <select
                id="noticePeriod"
                value={form.noticePeriod}
                onChange={(e) => setForm({ ...form, noticePeriod: e.target.value })}
                className="mt-1 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 focus:border-[#0f5daa] focus:outline-none"
              >
                <option value="Immediate">Immediate / Serving Notice</option>
                <option value="15 days">15 Days</option>
                <option value="30 days">30 Days</option>
                <option value="45 days">45 Days</option>
                <option value="60+ days">60+ Days</option>
              </select>
            </div>

            <div>
              <Label htmlFor="currentSalary">Current Salary (LPA / Monthly)</Label>
              <div className="relative mt-1">
                <DollarSign size={15} className="absolute left-3 top-3 text-slate-400" />
                <Input
                  id="currentSalary"
                  className="pl-9"
                  value={form.currentSalary}
                  onChange={(e) => setForm({ ...form, currentSalary: e.target.value })}
                  placeholder="e.g. ₹5,00,000 / yr"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="expectedSalary">Expected Salary (LPA / Monthly)</Label>
              <div className="relative mt-1">
                <DollarSign size={15} className="absolute left-3 top-3 text-slate-400" />
                <Input
                  id="expectedSalary"
                  className="pl-9"
                  value={form.expectedSalary}
                  onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })}
                  placeholder="e.g. ₹7,50,000 / yr"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Section 3: Work Experience */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase size={18} className="text-[#0f5daa]" /> Work Experience
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">List your previous companies, roles, and key achievements.</p>
            </div>
            <Button
              type="button"
              onClick={addWorkExperience}
              variant="outline"
              className="border-blue-200 text-[#0f5daa] hover:bg-blue-50 text-xs font-bold"
            >
              <Plus size={14} className="mr-1" /> Add Experience
            </Button>
          </div>

          <div className="space-y-4">
            {form.workExperience.map((work, idx) => (
              <div key={idx} className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <button
                  type="button"
                  onClick={() => removeWorkItem(idx)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs">Company Name</Label>
                    <Input
                      className="mt-1 h-9 text-xs"
                      value={work.company}
                      onChange={(e) => updateWorkItem(idx, "company", e.target.value)}
                      placeholder="e.g. Helios Bank"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Role / Title</Label>
                    <Input
                      className="mt-1 h-9 text-xs"
                      value={work.title}
                      onChange={(e) => updateWorkItem(idx, "title", e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Start Date</Label>
                    <Input
                      className="mt-1 h-9 text-xs"
                      value={work.start}
                      onChange={(e) => updateWorkItem(idx, "start", e.target.value)}
                      placeholder="e.g. Jan 2022"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">End Date</Label>
                    <Input
                      disabled={work.current}
                      className="mt-1 h-9 text-xs"
                      value={work.current ? "Present" : work.end}
                      onChange={(e) => updateWorkItem(idx, "end", e.target.value)}
                      placeholder="e.g. Dec 2023 or Present"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`curr-${idx}`}
                    checked={work.current}
                    onChange={(e) => updateWorkItem(idx, "current", e.target.checked)}
                    className="rounded border-slate-300 text-[#0f5daa]"
                  />
                  <label htmlFor={`curr-${idx}`} className="text-xs font-semibold text-slate-700">
                    I currently work here
                  </label>
                </div>

                <div>
                  <Label className="text-xs">Description / Key Responsibilities</Label>
                  <Textarea
                    className="mt-1 min-h-[60px] text-xs"
                    value={work.description}
                    onChange={(e) => updateWorkItem(idx, "description", e.target.value)}
                    placeholder="Built API microservices, led team of 3 engineers..."
                  />
                </div>
              </div>
            ))}

            {!form.workExperience.length ? (
              <p className="py-4 text-center text-xs text-slate-400">
                No work experience added yet. Click <strong>+ Add Experience</strong> to include previous roles.
              </p>
            ) : null}
          </div>
        </Card>

        {/* Section 4: Education */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap size={18} className="text-[#0f5daa]" /> Education
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Degrees, qualifications, and institute details.</p>
            </div>
            <Button
              type="button"
              onClick={addEducation}
              variant="outline"
              className="border-blue-200 text-[#0f5daa] hover:bg-blue-50 text-xs font-bold"
            >
              <Plus size={14} className="mr-1" /> Add Education
            </Button>
          </div>

          <div className="space-y-4">
            {form.education.map((edu, idx) => (
              <div key={idx} className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                <button
                  type="button"
                  onClick={() => removeEduItem(idx)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs">Degree / Qualification</Label>
                    <Input
                      className="mt-1 h-9 text-xs"
                      value={edu.degree}
                      onChange={(e) => updateEduItem(idx, "degree", e.target.value)}
                      placeholder="e.g. B.Tech / B.Sc / Higher Secondary"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Institute / University</Label>
                    <Input
                      className="mt-1 h-9 text-xs"
                      value={edu.school}
                      onChange={(e) => updateEduItem(idx, "school", e.target.value)}
                      placeholder="e.g. Delhi University"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Field of Study / Branch</Label>
                    <Input
                      className="mt-1 h-9 text-xs"
                      value={edu.field}
                      onChange={(e) => updateEduItem(idx, "field", e.target.value)}
                      placeholder="e.g. Computer Science / Commerce"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Year of Passing</Label>
                    <Input
                      className="mt-1 h-9 text-xs"
                      value={edu.year}
                      onChange={(e) => updateEduItem(idx, "year", e.target.value)}
                      placeholder="e.g. 2023"
                    />
                  </div>
                </div>
              </div>
            ))}

            {!form.education.length ? (
              <p className="py-4 text-center text-xs text-slate-400">
                No education records added yet. Click <strong>+ Add Education</strong> to add your degrees.
              </p>
            ) : null}
          </div>
        </Card>

        {/* Section 5: Resume & Portfolio */}
        <Card className="p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-[#0f5daa]" /> Resume & Portfolio Links
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Attach your latest resume PDF/Word and social profiles.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="resumeUrl">Active Resume File</Label>
              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                <Input
                  id="resumeUrl"
                  value={form.resumeUrl}
                  onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                  placeholder="Upload file or enter resume URL"
                />
                <label className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-[#eaf3fb] px-4 text-xs font-bold text-[#0f5daa] hover:bg-[#d8e8f8]">
                  <Upload size={14} />
                  <span>{uploadingResume ? "Uploading…" : "Attach Resume File"}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="sr-only"
                    onChange={handleResumeFileChange}
                  />
                </label>
              </div>
              {form.resumeUrl ? (
                <p className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-600" /> Current Resume Attached:{" "}
                  <a
                    href={form.resumeUrl.startsWith("http") ? form.resumeUrl : `${API_URL.replace("/api", "")}${form.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#0f5daa] underline"
                  >
                    View File
                  </a>
                </p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
              <div className="relative mt-1">
                <Link2 size={15} className="absolute left-3 top-3 text-slate-400" />
                <Input
                  id="linkedin"
                  className="pl-9"
                  value={form.linkedin}
                  onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="github">GitHub Profile URL</Label>
              <div className="relative mt-1">
                <Code2 size={15} className="absolute left-3 top-3 text-slate-400" />
                <Input
                  id="github"
                  className="pl-9"
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="website">Portfolio / Personal Website URL</Label>
              <div className="relative mt-1">
                <Globe size={15} className="absolute left-3 top-3 text-slate-400" />
                <Input
                  id="website"
                  className="pl-9"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://myportfolio.com"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Section 6: Preferences & Certifications */}
        <Card className="p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe size={18} className="text-[#0f5daa]" /> Preferences & Certifications
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Specify job type preferences, relocation locations, and certifications.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Preferred Job Types */}
            <div>
              <Label>Preferred Job Types</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {["Full-time", "Part-time", "Remote", "Hybrid", "Onsite", "Contract"].map((type) => {
                  const active = form.preferredJobTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleJobType(type)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-[#0f5daa] bg-[#eff6ff] text-[#0f5daa]"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Job Locations */}
            <div>
              <Label>Preferred Job Locations (Relocation friendly)</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newPrefLocation}
                  onChange={(e) => setNewPrefLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPrefLocation();
                    }
                  }}
                  placeholder="Type location (e.g. Bangalore, Mumbai, Remote) and press Enter"
                />
                <Button type="button" onClick={addPrefLocation} className="bg-[#0f5daa] hover:bg-[#0c4d8c]">
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.preferredLocations.map((loc) => (
                  <span
                    key={loc}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                  >
                    {loc}
                    <button type="button" onClick={() => removePrefLocation(loc)} className="text-slate-400 hover:text-red-600">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages Known */}
            <div className="sm:col-span-2">
              <Label>Languages Known</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addLanguage();
                    }
                  }}
                  placeholder="Type language (e.g. English, Hindi, Tamil) and press Enter"
                />
                <Button type="button" onClick={addLanguage} className="bg-[#0f5daa] hover:bg-[#0c4d8c]">
                  Add Language
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {form.languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800"
                  >
                    {lang}
                    <button type="button" onClick={() => removeLanguage(lang)} className="text-emerald-500 hover:text-red-600">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div className="sm:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-bold text-slate-900">Certifications & Licenses</Label>
                <Button
                  type="button"
                  onClick={addCertification}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
                >
                  <Plus size={13} className="mr-1" /> Add Certification
                </Button>
              </div>

              {form.certifications.map((cert, idx) => (
                <div key={idx} className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => removeCertItem(idx)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 size={15} />
                  </button>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                      <Label className="text-[11px]">Certificate Name</Label>
                      <Input
                        className="mt-0.5 h-8 text-xs"
                        value={cert.name}
                        onChange={(e) => updateCertItem(idx, "name", e.target.value)}
                        placeholder="e.g. AWS Certified Developer"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px]">Issuing Organization</Label>
                      <Input
                        className="mt-0.5 h-8 text-xs"
                        value={cert.issuer}
                        onChange={(e) => updateCertItem(idx, "issuer", e.target.value)}
                        placeholder="e.g. Amazon Web Services"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px]">Year</Label>
                      <Input
                        className="mt-0.5 h-8 text-xs"
                        value={cert.year}
                        onChange={(e) => updateCertItem(idx, "year", e.target.value)}
                        placeholder="e.g. 2024"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Sticky Submit Bar */}
        <div className="sticky bottom-6 z-10 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-900">Ready to update your profile?</p>
            <p className="text-[11px] text-slate-500">Recruiters will see these updated details instantly.</p>
          </div>
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white px-8 h-11 font-bold shadow-md rounded-xl"
          >
            {saving ? "Saving Changes…" : "Save Profile Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
