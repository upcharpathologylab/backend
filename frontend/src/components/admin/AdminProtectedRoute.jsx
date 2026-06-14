import { Navigate, useLocation } from "react-router-dom";
import { clearAdminAuthSession, getStoredAdminUser, hasAdminSession } from "../auth/authStorage.js";
import { getAdminPageForPath, hasAdminPermission } from "../../utils/adminPermissions.js";

function AdminProtectedRoute({ children }) {
  const location = useLocation();

  if (!hasAdminSession()) {
    clearAdminAuthSession();
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const adminUser = getStoredAdminUser();
  if (!hasAdminPermission(adminUser, getAdminPageForPath(location.pathname), "view")) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 font-sans text-navy-950">
        <section className="rounded-lg border border-red-100 bg-white px-8 py-10 text-center shadow-sm">
          <h1 className="text-2xl font-black text-upchar-red">Access Denied</h1>
        </section>
      </main>
    );
  }

  return children;
}

export default AdminProtectedRoute;
