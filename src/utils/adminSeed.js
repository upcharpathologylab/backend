import AdminRole from "../models/AdminRole.js";

const permissionPages = ["Dashboard", "Bookings", "Reports", "Packages", "Tests", "Customers", "Content", "Settings", "User Management"];
const permissionTypes = ["view", "create", "edit", "delete"];

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

export async function ensureDefaultAdmin() {
  await AdminRole.updateOne(
    { roleName: "Super Admin" },
    { $setOnInsert: { roleName: "Super Admin", description: "Full system access", pageAccess: fullPermissions(), status: "Active" } },
    { upsert: true }
  );

  await AdminRole.updateOne(
    { roleName: "Admin" },
    { $setOnInsert: { roleName: "Admin", description: "Admin access with managed permissions", pageAccess: viewOnlyPermissions(), status: "Active" } },
    { upsert: true }
  );
}
