import { useState } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminTopbar from "./AdminTopbar.jsx";

function AdminLayout({ children, topbarTitle = "Dashboard", topbarBadge = "Admin Panel" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f9fd] font-sans text-navy-950 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-navy-950/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      ) : null}
      <div className="min-w-0 overflow-x-hidden">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} title={topbarTitle} badge={topbarBadge} />
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
