import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import Company from "../models/Company.js";
import { signToken } from "../middleware/auth.js";

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    headline: user.headline,
    location: user.location,
    company: user.company,
    profileCompletion: user.profileCompletion,
    status: user.status,
  };
}

export async function register(req, res) {
  const { name, email, password, role = "candidate", companyName } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "An account with this email already exists" });

  const allowed = ["candidate", "recruiter", "company", "hr_manager"];
  const finalRole = allowed.includes(role) ? role : "candidate";
  const hash = await bcrypt.hash(password, 10);

  let company = null;
  if (["recruiter", "company", "hr_manager"].includes(finalRole) && companyName) {
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    company = await Company.create({
      name: companyName,
      slug: `${slug}-${Date.now().toString(36)}`,
      status: "pending",
      verified: false,
    });
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hash,
    role: finalRole,
    company: company?._id,
    status: ["recruiter", "company"].includes(finalRole) ? "pending" : "active",
  });
  if (company) {
    company.owner = user._id;
    await company.save();
  }

  const token = signToken(user);
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.status(201).json({ token, user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+password").populate("company");
  if (!user) return res.status(401).json({ message: "Invalid email or password" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid email or password" });
  if (user.status === "suspended") return res.status(403).json({ message: "This account is suspended" });
  user.lastLoginAt = new Date();
  await user.save();
  const token = signToken(user);
  res.cookie("token", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ token, user: publicUser(user) });
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

export async function logout(_req, res) {
  res.clearCookie("token");
  res.json({ ok: true });
}

export async function forgotPassword(req, res) {
  const user = await User.findOne({ email: req.body.email?.toLowerCase() });
  if (!user) return res.json({ message: "If the account exists, a reset link has been sent" });
  const token = crypto.randomBytes(24).toString("hex");
  user.resetToken = token;
  user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30);
  await user.save();
  res.json({ message: "If the account exists, a reset link has been sent", resetToken: token });
}

export async function resetPassword(req, res) {
  const { token, password } = req.body;
  const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } });
  if (!user) return res.status(400).json({ message: "Reset link is invalid or expired" });
  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  res.json({ message: "Password updated. You can sign in now." });
}

export async function updateMe(req, res) {
  const fields = [
    "name",
    "phone",
    "headline",
    "location",
    "city",
    "country",
    "bio",
    "skills",
    "website",
    "linkedin",
    "privacy",
  ];
  fields.forEach((key) => {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  });
  await req.user.save();
  res.json({ user: publicUser(req.user) });
}

export async function deleteMe(req, res) {
  await User.findByIdAndDelete(req.user._id);
  res.clearCookie("token");
  res.json({ ok: true });
}
