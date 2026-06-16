const configuredSuperAdminUsernames = (import.meta.env.VITE_SUPER_ADMIN_USERNAMES || "")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

const configuredSuperAdminEmails = (import.meta.env.VITE_SUPER_ADMIN_EMAILS || "")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

const normalize = (value) => String(value || "").trim().toLowerCase();

export function isSuperAdminUser(user) {
  const roleLabel = normalize(user?.adminRole || user?.roleName || user?.accessLevel || user?.designation);
  if (["super admin", "super-admin", "superadmin"].includes(roleLabel)) return true;

  return (
    user?.role === "admin" &&
    (configuredSuperAdminUsernames.includes(normalize(user?.username)) || configuredSuperAdminEmails.includes(normalize(user?.email)))
  );
}

const routePageMap = [
  ["/admin/bookings", "Bookings"],
  ["/admin/booking-status", "Bookings"],
  ["/admin/assign-sample-collector", "Bookings"],
  ["/admin/sample-collection-points", "Bookings"],
  ["/admin/package-tests", "Packages"],
  ["/admin/packages", "Packages"],
  ["/admin/tests", "Tests"],
  ["/admin/test-categories", "Tests"],
  ["/admin/customers", "Customers"],
  ["/admin/prescriptions", "Reports"],
  ["/admin/payments", "Reports"],
  ["/admin/invoices", "Reports"],
  ["/admin/content-pages", "Content"],
  ["/admin/blogs", "Content"],
  ["/admin/homepage-banners", "Content"],
  ["/admin/testimonials", "Content"],
  ["/admin/service-locations", "Settings"],
  ["/admin/coupons-offers", "Settings"],
  ["/admin/pricing-discounts", "Settings"],
  ["/admin/activity-logs", "Settings"],
  ["/admin/system-settings", "Settings"],
  ["/admin/security-access", "Settings"],
  ["/admin/backup-management", "Settings"],
  ["/admin/users-roles", "User Management"],
  ["/admin", "Dashboard"]
];

export function getAdminPageForPath(pathname = "") {
  const match = routePageMap.find(([path]) => pathname === path || pathname.startsWith(`${path}/`));
  return match?.[1] || "Dashboard";
}

export function hasAdminPermission(user, page, action = "view") {
  if (isSuperAdminUser(user)) return true;
  return Boolean(user?.permissions?.[page]?.[action]);
}
