import { Router } from "express";
import * as auth from "../controllers/authController.js";
import * as jobs from "../controllers/jobController.js";
import * as apps from "../controllers/applicationController.js";
import * as platform from "../controllers/platformController.js";
import { protect, authorize, recruiterRoles, adminRoles } from "../middleware/auth.js";
import { Resume } from "../models/Supporting.js";
import * as modules from "../controllers/modulesController.js";
import * as courses from "../controllers/courseController.js";
import * as resume from "../controllers/resumeController.js";
import { resumeUpload } from "../middleware/upload.js";

const router = Router();

router.post("/auth/register", auth.register);
router.post("/auth/login", auth.login);
router.post("/auth/logout", auth.logout);
router.post("/auth/send-otp", auth.sendOtp);
router.post("/auth/verify-otp", auth.verifyOtp);
router.post("/auth/forgot-password", auth.forgotPassword);
router.post("/auth/reset-password", auth.resetPassword);
router.get("/auth/me", protect, auth.me);
router.patch("/auth/me", protect, auth.updateMe);
router.delete("/auth/me", protect, auth.deleteMe);

router.get("/tenders", modules.listTenders);
router.get("/tenders/:slug", modules.getTender);
router.get("/courses", courses.listCourses);
router.get("/courses/:slug", courses.getCourse);

router.get("/jobs", jobs.listJobs);
router.get("/jobs/saved", protect, authorize("candidate"), jobs.getSavedJobs);
router.get("/jobs/:slug", jobs.getJob);
router.post("/jobs", protect, authorize(...recruiterRoles), jobs.createJob);
router.patch("/jobs/:id", protect, authorize(...recruiterRoles), jobs.updateJob);
router.post("/jobs/:id/duplicate", protect, authorize(...recruiterRoles), jobs.duplicateJob);
router.get("/recruiter/jobs", protect, authorize(...recruiterRoles), jobs.myJobs);
router.post("/jobs/:id/apply", protect, authorize("candidate"), jobs.applyToJob);
router.post("/jobs/:id/save", protect, authorize("candidate"), jobs.saveJob);

router.get("/applications/me", protect, apps.myApplications);
router.get("/applications/pipeline", protect, authorize(...recruiterRoles), apps.pipeline);
router.patch("/applications/:id", protect, authorize(...recruiterRoles), apps.updateApplication);
router.post("/applications/:id/interview", protect, authorize(...recruiterRoles), apps.scheduleInterview);
router.get("/interviews", protect, apps.myInterviews);
router.get("/messages", protect, apps.messages);
router.post("/messages", protect, apps.sendMessage);
router.get("/notifications", protect, apps.notifications);
router.post("/notifications/read", protect, apps.markNotificationsRead);

router.get("/companies", platform.listCompanies);
router.get("/companies/:slug", platform.getCompany);
router.patch("/company", protect, authorize(...recruiterRoles), platform.updateCompany);
router.get("/stats", platform.stats);
router.get("/categories", platform.categories.list);
router.get("/blogs", platform.blogs.list);
router.get("/blogs/:slug", platform.blogs.get);
router.get("/taxonomies", platform.taxonomies);

router.get("/resume", protect, resume.getResume);
router.put("/resume", protect, resume.saveResume);
router.post("/resume/upload", protect, resumeUpload.single("file"), resume.uploadAndParseResume);
router.get("/resume/sync-profile", protect, resume.syncWithProfile);
router.post("/resume/sync-profile", protect, resume.syncWithProfile);

router.get("/recruiter/analytics", protect, authorize(...recruiterRoles), platform.recruiterAnalytics);
router.get("/billing", protect, authorize(...recruiterRoles, ...adminRoles), platform.billing);

router.get("/admin/courses", protect, authorize(...adminRoles), courses.adminListCourses);
router.post("/admin/courses", protect, authorize(...adminRoles), courses.adminCreateCourse);
router.get("/admin/courses/:id", protect, authorize(...adminRoles), courses.adminGetCourse);
router.patch("/admin/courses/:id", protect, authorize(...adminRoles), courses.adminUpdateCourse);
router.delete("/admin/courses/:id", protect, authorize(...adminRoles), courses.adminDeleteCourse);

router.get("/admin/applications", protect, authorize(...adminRoles), platform.adminApplications);
router.get("/admin/enquiries", protect, authorize(...adminRoles), platform.adminEnquiries);
router.patch("/admin/enquiries/:id", protect, authorize(...adminRoles), platform.patchAdminEnquiry);
router.delete("/admin/enquiries/:id", protect, authorize(...adminRoles), platform.deleteAdminEnquiry);
router.get("/admin/overview", protect, authorize(...adminRoles), platform.adminOverview);
router.get("/admin/users", protect, authorize(...adminRoles), platform.adminUsers);
router.patch("/admin/users/:id", protect, authorize("super_admin"), platform.patchUser);
router.get("/admin/companies", protect, authorize(...adminRoles), platform.adminCompanies);
router.patch("/admin/companies/:id", protect, authorize(...adminRoles), platform.patchCompanyAdmin);
router.get("/admin/jobs", protect, authorize(...adminRoles), platform.adminJobs);
router.post("/admin/jobs", protect, authorize(...adminRoles), platform.createAdminJob);
router.get("/admin/jobs/:id", protect, authorize(...adminRoles), platform.adminJobDetail);
router.patch("/admin/jobs/:id", protect, authorize(...adminRoles), platform.patchAdminJob);
router.delete("/admin/jobs/:id", protect, authorize("super_admin"), platform.deleteAdminJob);
router.get("/admin/categories", protect, authorize(...adminRoles), platform.categories.list);
router.post("/admin/categories", protect, authorize(...adminRoles), platform.categories.create);
router.patch("/admin/categories/:id", protect, authorize(...adminRoles), platform.categories.update);
router.delete("/admin/categories/:id", protect, authorize("super_admin"), platform.categories.remove);
router.post("/admin/blogs", protect, authorize(...adminRoles), platform.blogs.create);
router.patch("/admin/blogs/:id", protect, authorize(...adminRoles), platform.blogs.update);
router.post("/admin/taxonomies", protect, authorize(...adminRoles), platform.createTaxonomy);
router.patch("/admin/taxonomies/:id", protect, authorize(...adminRoles), platform.updateTaxonomy);
router.delete("/admin/taxonomies/:id", protect, authorize("super_admin"), platform.deleteTaxonomy);
router.get("/admin/audit", protect, authorize(...adminRoles), platform.adminAudit);
router.get("/admin/analytics", protect, authorize(...adminRoles), platform.adminAnalytics);
router.get("/admin/billing", protect, authorize(...adminRoles), platform.billing);
router.get("/admin/settings", protect, authorize("super_admin"), platform.settings);
router.post("/admin/settings", protect, authorize("super_admin"), platform.settings);
router.put("/admin/settings", protect, authorize("super_admin"), platform.settings);
router.get("/tickets", protect, platform.tickets);
router.post("/tickets", protect, platform.tickets);

router.post("/contact", async (req, res) => {
  const { name, email, phone, message, jobTitle, jobSlug } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email and message are required" });
  }
  const { default: Enquiry } = await import("../models/Enquiry.js");
  await Enquiry.create({ name, email, phone, message, jobTitle, jobSlug });
  res.json({ ok: true, message: "Thanks. We will get back to you shortly." });
});

router.post("/newsletter", async (req, res) => {
  res.json({ ok: true });
});

export default router;
