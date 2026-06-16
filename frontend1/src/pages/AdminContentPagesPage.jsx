import { useEffect, useState } from "react";
import AccountToast from "../components/account/AccountToast.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import ContentPagesGrid from "../components/admin/content/ContentPagesGrid.jsx";
import { getContentPages } from "../api/api.js";
import { adminContentPages } from "../data/adminContentPagesData.js";

function AdminContentPagesPage() {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(adminContentPages);
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.title = "Content / Pages | Upchar Admin";
    let mounted = true;

    getContentPages()
      .then((data) => {
        if (!mounted || !Array.isArray(data)) return;

        setPages(
          adminContentPages.map((page) => {
            const saved = data.find((item) => item.slug === page.slug);
            return saved
              ? {
                  ...page,
                  status: saved.status || page.status,
                  updatedAt: saved.lastUpdated || saved.updatedAt || page.updatedAt
                }
              : page;
          })
        );
      })
      .catch(() => {
        if (mounted) {
          setToast("Content API is offline, showing default page list.");
          window.setTimeout(() => setToast(""), 2600);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminLayout topbarTitle={null} topbarBadge={null}>
      <div className="mb-7">
        <h1 className="text-3xl font-black text-navy-950">Content / Pages</h1>
        <p className="mt-3 text-sm font-semibold text-navy-700">
          <span className="font-black text-navy-950">Dashboard</span>
          <span className="px-2 text-navy-400">&gt;</span>
          Content / Pages
        </p>
        <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-navy-700">Manage website page content from one place.</p>
      </div>

      {loading ? (
        <section className="rounded-lg border border-blue-100 bg-white p-10 text-center text-sm font-black text-navy-600 shadow-sm">Loading website pages...</section>
      ) : pages.length ? (
        <ContentPagesGrid pages={pages} />
      ) : (
        <section className="rounded-lg border border-blue-100 bg-white p-10 text-center text-sm font-black text-navy-600 shadow-sm">No website pages found.</section>
      )}

      <AccountToast message={toast} />
    </AdminLayout>
  );
}

export default AdminContentPagesPage;
