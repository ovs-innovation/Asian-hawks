const { writeFileSync, mkdirSync } = require("fs");
const { dirname, join } = require("path");

const root = join(__dirname, "..", "src", "app");

const pages = [
  ["candidate/resume", "Resume builder", "Write once. Attach it to every application.", "Open builder", "/resume-builder"],
  ["candidate/portfolio", "Portfolio", "Links and work samples recruiters can open immediately."],
  ["candidate/skills", "Skills", "Keep the list short. Match it to the roles you want."],
  ["candidate/experience", "Experience", "Roles, dates, and what you actually shipped."],
  ["candidate/education", "Education", "Degrees and programmes, without the extra biography."],
  ["candidate/certificates", "Certificates", "Only credentials a hiring manager would verify."],
  ["candidate/projects", "Projects", "Selected work, with a URL when you have one."],
  ["candidate/achievements", "Achievements", "Outcomes with numbers when they are real."],
  ["candidate/saved", "Saved jobs", "Roles you want to revisit.", "Browse jobs", "/jobs"],
  ["candidate/interviews", "Interview schedule", "Confirmed times with hiring teams."],
  ["candidate/notifications", "Notifications", "Application updates and interview reminders."],
  ["candidate/messages", "Messages", "Direct threads with recruiters."],
  ["candidate/chat", "Recruiter chat", "Conversations tied to an open application."],
  ["candidate/settings", "Settings", "Email, password, and notification preferences."],
  ["candidate/privacy", "Privacy", "Control who can see your profile."],
  ["candidate/delete", "Delete account", "This removes your profile and applications. It cannot be undone."],
  ["candidate/activity", "Activity timeline", "A log of applications, messages, and profile edits."],
  ["recruiter/jobs", "Manage jobs", "Draft, publish, pause, or duplicate a requisition.", "Post job", "/recruiter/jobs/new"],
  ["recruiter/jobs/drafts", "Draft jobs", "Unpublished requisitions."],
  ["recruiter/jobs/published", "Published jobs", "Live listings candidates can apply to."],
  ["recruiter/jobs/expired", "Expired jobs", "Roles past their application deadline."],
  ["recruiter/jobs/paused", "Paused jobs", "Temporarily hidden from search."],
  ["recruiter/applications", "Applications", "Every candidate who applied to your roles.", "Open pipeline", "/recruiter/pipeline"],
  ["recruiter/shortlisted", "Shortlisted", "Candidates you want the panel to meet."],
  ["recruiter/rejected", "Rejected", "Closed applications with a recorded reason."],
  ["recruiter/hired", "Hired", "Offers accepted."],
  ["recruiter/interviews", "Interview schedule", "Upcoming and completed interviews."],
  ["recruiter/messages", "Messages", "Threads with candidates."],
  ["recruiter/company", "Company profile", "What candidates see on your public page."],
  ["recruiter/billing", "Subscription", "Plan, renewal, and seat usage."],
  ["recruiter/invoices", "Invoices", "Paid and open invoices."],
  ["recruiter/notifications", "Notifications", "Application and interview alerts."],
  ["recruiter/settings", "Settings", "Team members, notifications, and branding."],
  ["admin/analytics", "Analytics", "Volume, conversion, and listing quality."],
  ["admin/users", "Users", "Every account on the platform."],
  ["admin/recruiters", "Recruiters", "Approve or suspend recruiter accounts."],
  ["admin/companies", "Companies", "Verify employers before they publish."],
  ["admin/candidates", "Candidates", "Candidate accounts and profile status."],
  ["admin/jobs", "Jobs", "Moderate featured, urgent, and reported listings."],
  ["admin/categories", "Job categories", "Create and order hiring categories."],
  ["admin/subcategories", "Sub categories", "Nested categories under each function."],
  ["admin/skills", "Skills", "Canonical skill taxonomy."],
  ["admin/locations", "Locations", "Markets you support."],
  ["admin/countries", "Countries", "Country list for jobs and companies."],
  ["admin/cities", "Cities", "City list used in search."],
  ["admin/industries", "Industries", "Industry taxonomy for companies."],
  ["admin/employment-types", "Employment types", "Full time, part time, contract, internship, freelance."],
  ["admin/experience-levels", "Experience levels", "Bands used in search filters."],
  ["admin/salary-ranges", "Salary ranges", "Filter buckets for public search."],
  ["admin/cms", "CMS", "Homepage sections and static pages."],
  ["admin/blogs", "Blogs", "Career advice and hiring notes."],
  ["admin/ads", "Advertisements", "Promoted listings and homepage placements."],
  ["admin/seo", "SEO", "Default titles, descriptions, and index rules."],
  ["admin/reports", "Reports", "User reports on jobs, companies, and messages."],
  ["admin/payments", "Payments", "Processed charges and failed invoices."],
  ["admin/subscriptions", "Subscriptions", "Company plans and renewals."],
  ["admin/coupons", "Coupons", "Discount codes for paid plans."],
  ["admin/audit", "Audit logs", "Administrative actions with actor and timestamp."],
  ["admin/roles", "Roles", "super admin, moderator, recruiter, HR, company, candidate."],
  ["admin/permissions", "Permissions", "What each role can change."],
  ["admin/tickets", "Support tickets", "Inbound requests from candidates and companies."],
  ["admin/email-templates", "Email templates", "Application, interview, and offer copy."],
  ["admin/smtp", "SMTP settings", "Transactional mail delivery."],
  ["admin/storage", "Storage", "Cloudinary credentials and upload limits."],
  ["admin/api-keys", "API keys", "Server keys for integrations."],
  ["admin/backup", "Backup", "Database export and restore."],
  ["admin/security", "Security", "Session policy, rate limits, and lockouts."],
  ["admin/activity", "Activity logs", "Platform-wide activity stream."],
];

for (const [path, title, body, cta, href] of pages) {
  const file = join(root, path, "page.tsx");
  mkdirSync(dirname(file), { recursive: true });
  const extra = cta ? `, cta="${cta}", href="${href}"` : "";
  writeFileSync(
    file,
    `"use client";\n\nimport { WorkspacePage } from "@/components/layout/workspace-page";\n\nexport default function Page() {\n  return <WorkspacePage title="${title}" body="${body}"${extra} />;\n}\n`
  );
}

console.log(`Wrote ${pages.length} workspace pages`);
