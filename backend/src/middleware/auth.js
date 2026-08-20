import jwt from "jsonwebtoken";
import User from "../models/User.js";

export function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Authentication required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate("company");
    if (!user || user.status === "suspended") {
      return res.status(401).json({ message: "Account unavailable" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have access to this resource" });
    }
    next();
  };
}

export const recruiterRoles = ["recruiter", "hr_manager", "company", "super_admin"];
export const adminRoles = ["super_admin", "moderator"];
