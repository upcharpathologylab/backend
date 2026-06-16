import bcrypt from "bcryptjs";
import AdminRole from "../models/AdminRole.js";
import User from "../models/User.js";

const permissionPages = ["Dashboard", "Bookings", "Reports", "Packages", "Tests", "Customers", "Content", "Settings", "User Management"];
const permissionTypes = ["view", "create", "edit", "delete"];
const defaultFeatures = ["Booking Actions", "Report Upload", "Payment Management", "WhatsApp Updates", "Content Publishing", "System Settings"];
const defaultSuperAdmin = {
  fullName: "Vicky Kumar",
  username: "vickykumar",
  email: "vickykumar021296@gmail.com",
  password: "Upchar@19655605d8"
};

const fullPermissions = () =>
  permissionPages.reduce((pages, page) => {
    pages[page] = permissionTypes.reduce((actions, action) => ({ ...actions, [action]: true }), {});
    return pages;
  }, {});

const viewOnlyPermissions = () =>
  permissionPages.reduce((pages, page) => {
    pages[page] = permissionTypes.reduce((actions, action) => ({ ...actions, [action]: action === "view" }), {});
    return pages;
  }, {});

const defaultFeatureAccess = (enabled = false) =>
  defaultFeatures.reduce((features, feature) => ({ ...features, [feature]: enabled }), {});

export async function ensureDefaultAdmin() {
  await AdminRole.updateOne(
    { roleName: "Super Admin" },
    { $setOnInsert: { roleName: "Super Admin", description: "Full system access", pageAccess: fullPermissions(), featureAccess: defaultFeatureAccess(true), status: "Active" } },
    { upsert: true }
  );

  await AdminRole.updateOne(
    { roleName: "Admin" },
    { $setOnInsert: { roleName: "Admin", description: "Admin access with managed permissions", pageAccess: viewOnlyPermissions(), featureAccess: defaultFeatureAccess(false), status: "Active" } },
    { upsert: true }
  );

  const existingSuperAdmin = await User.findOne({ role: "admin", adminRole: /^super admin$/i });
  if (existingSuperAdmin) return existingSuperAdmin;

  const existingUser = await User.findOne({
    $or: [{ username: defaultSuperAdmin.username }, { email: defaultSuperAdmin.email }]
  });
  const passwordHash = await bcrypt.hash(defaultSuperAdmin.password, 12);

  if (existingUser) {
    existingUser.fullName = existingUser.fullName || defaultSuperAdmin.fullName;
    existingUser.username = defaultSuperAdmin.username;
    existingUser.email = defaultSuperAdmin.email;
    existingUser.passwordHash = passwordHash;
    existingUser.role = "admin";
    existingUser.adminRole = "Super Admin";
    existingUser.accountStatus = "Active";
    existingUser.isActive = true;
    existingUser.permissions = fullPermissions();
    await existingUser.save();
    return existingUser;
  }

  return User.create({
    fullName: defaultSuperAdmin.fullName,
    username: defaultSuperAdmin.username,
    email: defaultSuperAdmin.email,
    passwordHash,
    role: "admin",
    adminRole: "Super Admin",
    accountStatus: "Active",
    isActive: true,
    permissions: fullPermissions()
  });
}
