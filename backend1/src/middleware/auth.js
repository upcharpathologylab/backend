import jwt from "jsonwebtoken";
import AdminRole from "../models/AdminRole.js";
import User from "../models/User.js";

const superAdminUsernames = String(process.env.SUPER_ADMIN_USERNAMES || "")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

const superAdminEmails = String(process.env.SUPER_ADMIN_EMAILS || "")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

const normalize = (value) => String(value || "").trim().toLowerCase();

export const isSuperAdmin = (admin) => {
  const label = normalize(admin?.adminRole);
  return ["super admin", "super-admin", "superadmin"].includes(label) || (
    admin?.role === "admin" &&
    (superAdminUsernames.includes(normalize(admin?.username)) || superAdminEmails.includes(normalize(admin?.email)))
  );
};

const routePageMap = [
  [/^\/dashboard/, "Dashboard"],
  [/^\/bookings|^\/booking-status|^\/assign-sample-collector|^\/sample-collection-points/, "Bookings"],
  [/^\/packages|^\/package-tests/, "Packages"],
  [/^\/tests|^\/test-categories/, "Tests"],
  [/^\/customers/, "Customers"],
  [/^\/users-roles|^\/users|^\/roles/, "User Management"],
  [/^\/prescriptions|^\/payments|^\/invoices/, "Reports"],
  [/^\/reviews|^\/testimonials|^\/blogs|^\/homepage-banners|^\/content|^\/home-hero/, "Content"],
  [/^\/site-settings|^\/service-locations|^\/coupons|^\/pricing-discounts|^\/activity-logs|^\/security-access|^\/backup-management|^\/system-settings/, "Settings"],
  [/^\/notifications/, "Dashboard"]
];

const methodPermission = (method) => {
  if (method === "GET") return "view";
  if (method === "POST") return "create";
  if (["PUT", "PATCH"].includes(method)) return "edit";
  if (method === "DELETE") return "delete";
  return "view";
};

export async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ success: false, message: "Admin authorization token is required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id).select("_id fullName username email role adminRole accountStatus permissions isActive");

    if (!admin || admin.role !== "admin" || !admin.isActive || admin.accountStatus === "Suspended") {
      return res.status(403).json({ success: false, message: "Admin access is required." });
    }

    const roleName = admin.adminRole || (isSuperAdmin(admin) ? "Super Admin" : "Admin");
    const role = await AdminRole.findOne({ roleName }).lean();
    req.admin = admin;
    req.adminRole = role;
    req.adminPermissions = role?.pageAccess || admin.permissions || {};
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired admin token." });
  }
}

export function enforceAdminPermission(req, res, next) {
  if (isSuperAdmin(req.admin)) return next();

  const match = routePageMap.find(([pattern]) => pattern.test(req.path));
  if (!match) return next();

  const page = match[1];
  const action = methodPermission(req.method);
  const pagePermissions = req.adminPermissions?.get?.(page) || req.adminPermissions?.[page] || {};

  if (pagePermissions[action]) return next();

  return res.status(403).json({ success: false, message: "Access Denied" });
}

export async function protectUser(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ success: false, message: "Authorization token is required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id fullName phone email profileImage dateOfBirth gender bloodGroup alternateNumber preferredLanguage role isActive createdAt");

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Invalid or inactive user." });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired user token." });
  }
}
