import Application from "../models/Application.js";
import Enquiry from "../models/Enquiry.js";
import { Interview, Message, Notification } from "../models/Supporting.js";

export async function myApplications(req, res) {
  const userEmail = (req.user.email || "").toLowerCase();

  const [accountApps, enquiries] = await Promise.all([
    Application.find({ candidate: req.user._id })
      .populate({ path: "job", populate: { path: "company", select: "name slug logo" } })
      .sort({ createdAt: -1 }),
    userEmail ? Enquiry.find({ email: userEmail }).sort({ createdAt: -1 }) : [],
  ]);

  const jobEnquiries = enquiries.filter((e) => {
    const msgUpper = (e.message || "").toUpperCase();
    if (msgUpper.includes("PURCHASE REQUEST")) return false;
    return e.resumeUrl || e.jobTitle || e.jobSlug;
  });

  const directApps = jobEnquiries.map((e) => ({
    _id: e._id,
    status: e.status || "applied",
    createdAt: e.createdAt,
    job: {
      title: e.jobTitle || "Job Application",
      slug: e.jobSlug || "",
      company: { name: "Asian Hawks" },
    },
    isDirect: true,
  }));

  const items = [...accountApps, ...directApps].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  res.json({ items });
}

export async function pipeline(req, res) {
  const companyId = req.user.company?._id || req.user.company;
  const filter = { company: companyId };
  if (req.query.job) filter.job = req.query.job;
  if (req.query.status) filter.status = req.query.status;
  const items = await Application.find(filter)
    .populate("candidate", "name email headline location skills avatar")
    .populate("job", "title slug")
    .sort({ createdAt: -1 });
  res.json({ items });
}

export async function updateApplication(req, res) {
  const application = await Application.findById(req.params.id);
  if (!application) return res.status(404).json({ message: "Application not found" });
  if (req.body.status) application.status = req.body.status;
  if (req.body.notes !== undefined) application.notes = req.body.notes;
  if (req.body.offerLetterUrl) application.offerLetterUrl = req.body.offerLetterUrl;
  await application.save();
  await Notification.create({
    user: application.candidate,
    title: "Application update",
    body: `Your application is now ${application.status}.`,
    link: "/candidate/applied",
  });
  res.json({ application });
}

export async function scheduleInterview(req, res) {
  const application = await Application.findById(req.params.id);
  if (!application) return res.status(404).json({ message: "Application not found" });
  const interview = await Interview.create({
    application: application._id,
    job: application.job,
    candidate: application.candidate,
    recruiter: req.user._id,
    scheduledAt: req.body.scheduledAt,
    mode: req.body.mode || "Video",
    location: req.body.location,
    notes: req.body.notes,
  });
  application.status = "interview";
  await application.save();
  res.status(201).json({ interview });
}

export async function myInterviews(req, res) {
  const filter =
    req.user.role === "candidate" ? { candidate: req.user._id } : { recruiter: req.user._id };
  const items = await Interview.find(filter)
    .populate("job", "title")
    .populate("candidate", "name email")
    .populate("recruiter", "name email")
    .sort({ scheduledAt: 1 });
  res.json({ items });
}

export async function messages(req, res) {
  const items = await Message.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id }],
  })
    .populate("sender", "name role")
    .populate("recipient", "name role")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ items });
}

export async function sendMessage(req, res) {
  const message = await Message.create({
    threadId: req.body.threadId || `${req.user._id}-${req.body.recipient}`,
    sender: req.user._id,
    recipient: req.body.recipient,
    job: req.body.job,
    body: req.body.body,
  });
  res.status(201).json({ message });
}

export async function notifications(req, res) {
  const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ items });
}

export async function markNotificationsRead(req, res) {
  await Notification.updateMany({ user: req.user._id }, { $set: { read: true } });
  res.json({ ok: true });
}
