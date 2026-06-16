import { FilePenLine } from "lucide-react";
import { Link } from "react-router-dom";

function formatDate(value) {
  if (!value || value === "Not updated") return "Not updated";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function ContentPagesGrid({ pages }) {
  return (
    <section className="overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-100 text-left">
          <thead className="bg-slate-50">
            <tr className="text-xs font-black uppercase tracking-wide text-navy-600">
              <th className="px-5 py-4">Page Name</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Last Updated</th>
              <th className="px-5 py-4 text-right">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {pages.map((page) => {
              const published = page.status === "Published";
              return (
                <tr className="text-sm font-semibold text-navy-800" key={page.slug || page.title}>
                  <td className="px-5 py-4">
                    <p className="font-black text-navy-950">{page.title}</p>
                    <p className="mt-1 text-xs font-semibold text-navy-500">{page.url}</p>
                  </td>
                  <td className="px-5 py-4 text-upchar-blue">{page.url}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-md px-3 py-1 text-xs font-black ${published ? "bg-green-50 text-upchar-green" : "bg-orange-50 text-upchar-orange"}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">{formatDate(page.updatedAt || page.lastUpdated)}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to={page.editUrl || `/admin/content-pages/${page.slug}`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-upchar-green px-4 text-sm font-black text-white"
                    >
                      <FilePenLine className="h-4 w-4" />
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ContentPagesGrid;
