import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Copy, Download, Eye, MessageCircle, MoreHorizontal, PencilLine, Printer, Star, Trash2 } from "lucide-react";
import { assetUrl } from "../../../api/api.js";
import { price } from "../../../utils.js";

const categoryClasses = {
  Biochemistry: "bg-green-50 text-upchar-green ring-green-100",
  Accountant: "bg-violet-50 text-upchar-purple ring-violet-100",
  Admin: "bg-green-50 text-upchar-green ring-green-100",
  Automatic: "bg-blue-50 text-upchar-blue ring-blue-100",
  Cardiac: "bg-red-50 text-upchar-red ring-red-100",
  Cardiology: "bg-red-50 text-upchar-red ring-red-100",
  Diabetes: "bg-violet-50 text-upchar-purple ring-violet-100",
  Billing: "bg-orange-50 text-upchar-orange ring-orange-100",
  Doctor: "bg-blue-50 text-upchar-blue ring-blue-100",
  Editor: "bg-violet-50 text-upchar-purple ring-violet-100",
  "Health Checkup": "bg-green-50 text-upchar-green ring-green-100",
  Hematology: "bg-violet-50 text-upchar-purple ring-violet-100",
  Hormone: "bg-blue-50 text-upchar-blue ring-blue-100",
  Immunology: "bg-orange-50 text-upchar-orange ring-orange-100",
  Kidney: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  Liver: "bg-orange-50 text-upchar-orange ring-orange-100",
  Manual: "bg-green-50 text-upchar-green ring-green-100",
  Marketing: "bg-pink-50 text-pink-600 ring-pink-100",
  Pathology: "bg-pink-50 text-pink-600 ring-pink-100",
  Radiology: "bg-blue-50 text-upchar-blue ring-blue-100",
  Receptionist: "bg-orange-50 text-upchar-orange ring-orange-100",
  Support: "bg-green-50 text-upchar-green ring-green-100",
  "Super Admin": "bg-green-50 text-upchar-green ring-green-100",
  Technician: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  Thyroid: "bg-blue-50 text-upchar-blue ring-blue-100",
  Verifier: "bg-blue-50 text-upchar-blue ring-blue-100",
  "Women Health": "bg-pink-50 text-pink-600 ring-pink-100"
};

const statusClasses = {
  Active: "bg-green-50 text-upchar-green ring-green-100",
  Archived: "bg-violet-50 text-upchar-purple ring-violet-100",
  Available: "bg-green-50 text-upchar-green ring-green-100",
  Blocked: "bg-red-50 text-upchar-red ring-red-100",
  Busy: "bg-orange-50 text-upchar-orange ring-orange-100",
  Cancelled: "bg-red-50 text-upchar-red ring-red-100",
  Completed: "bg-green-50 text-upchar-green ring-green-100",
  Confirmed: "bg-blue-50 text-upchar-blue ring-blue-100",
  Created: "bg-green-50 text-upchar-green ring-green-100",
  Deleted: "bg-red-50 text-upchar-red ring-red-100",
  Expired: "bg-slate-100 text-navy-600 ring-slate-200",
  Failed: "bg-red-50 text-upchar-red ring-red-100",
  "Failed Login": "bg-red-50 text-upchar-red ring-red-100",
  Guest: "bg-orange-50 text-upchar-orange ring-orange-100",
  Hidden: "bg-red-50 text-upchar-red ring-red-100",
  "In Lab": "bg-orange-50 text-upchar-orange ring-orange-100",
  "In Progress": "bg-blue-50 text-upchar-blue ring-blue-100",
  Inactive: "bg-red-50 text-upchar-red ring-red-100",
  "Pending Confirmation": "bg-orange-50 text-upchar-orange ring-orange-100",
  "Sample Collection Scheduled": "bg-blue-50 text-upchar-blue ring-blue-100",
  "Testing In Progress": "bg-blue-50 text-upchar-blue ring-blue-100",
  "Login Success": "bg-green-50 text-upchar-green ring-green-100",
  Logout: "bg-blue-50 text-upchar-blue ring-blue-100",
  Overdue: "bg-red-50 text-upchar-red ring-red-100",
  Paid: "bg-green-50 text-upchar-green ring-green-100",
  Partial: "bg-blue-50 text-upchar-blue ring-blue-100",
  "Password Changed": "bg-blue-50 text-upchar-blue ring-blue-100",
  Pending: "bg-orange-50 text-upchar-orange ring-orange-100",
  "Pending Review": "bg-orange-50 text-upchar-orange ring-orange-100",
  Processed: "bg-green-50 text-upchar-green ring-green-100",
  Published: "bg-green-50 text-upchar-green ring-green-100",
  Refunded: "bg-violet-50 text-upchar-purple ring-violet-100",
  Rejected: "bg-red-50 text-upchar-red ring-red-100",
  "Report Ready": "bg-green-50 text-upchar-green ring-green-100",
  "Sample Collected": "bg-violet-50 text-upchar-purple ring-violet-100",
  Scheduled: "bg-orange-50 text-upchar-orange ring-orange-100",
  Skipped: "bg-slate-100 text-navy-600 ring-slate-200",
  Success: "bg-green-50 text-upchar-green ring-green-100",
  Updated: "bg-blue-50 text-upchar-blue ring-blue-100",
  Uploaded: "bg-violet-50 text-upchar-purple ring-violet-100",
  User: "bg-blue-50 text-upchar-blue ring-blue-100"
};

const positionClasses = {
  "Below Slider": "bg-blue-50 text-upchar-blue ring-blue-100",
  "Bottom Banner": "bg-orange-50 text-upchar-orange ring-orange-100",
  Homepage: "bg-green-50 text-upchar-green ring-green-100",
  "Middle Banner": "bg-violet-50 text-upchar-purple ring-violet-100",
  "Top Slider": "bg-green-50 text-upchar-green ring-green-100"
};

const thumbnailGradients = [
  "from-green-600 via-emerald-500 to-blue-500",
  "from-blue-600 via-cyan-500 to-emerald-400",
  "from-emerald-500 via-lime-400 to-cyan-500",
  "from-pink-500 via-rose-400 to-orange-300",
  "from-cyan-500 via-sky-500 to-blue-600",
  "from-orange-400 via-amber-300 to-green-500",
  "from-violet-600 via-purple-500 to-blue-500",
  "from-blue-700 via-sky-600 to-cyan-400"
];

function initials(value) {
  return String(value || "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

function Badge({ children, className }) {
  return <span className={`inline-flex rounded-md px-3 py-1 text-xs font-black ring-1 ${className}`}>{children}</span>;
}

function CellValue({ column, row }) {
  const value = row[column.key];
  if (column.badge === "status") {
    return <Badge className={statusClasses[value] || statusClasses.Active}>{value}</Badge>;
  }
  if (column.badge === "category" || column.badge === "categoryName") {
    return <Badge className={categoryClasses[value] || "bg-blue-50 text-navy-800 ring-blue-100"}>{value}</Badge>;
  }
  if (column.badge === "position" || column.badge === "display") {
    return <Badge className={positionClasses[value] || "bg-blue-50 text-navy-800 ring-blue-100"}>{value}</Badge>;
  }
  if (column.badge === "discount") {
    return <Badge className="bg-green-50 text-upchar-green ring-green-100">{value}%</Badge>;
  }
  if (column.badge === "discountText") {
    return <Badge className={String(value).startsWith("Rs.") ? "bg-blue-50 text-upchar-blue ring-blue-100" : "bg-green-50 text-upchar-green ring-green-100"}>{value}</Badge>;
  }
  if (column.badge === "type") {
    return <Badge className={value === "Flat" ? "bg-blue-50 text-upchar-blue ring-blue-100" : "bg-green-50 text-upchar-green ring-green-100"}>{value}</Badge>;
  }
  if (column.format === "money") return price(Number(value || 0));
  if (column.format === "percent") return `${value}%`;
  if (column.format === "rating") return `${Number(value || 0).toFixed(1)} / 5`;
  if (column.format === "stars") {
    const rating = Number(value || 0);
    return (
      <span className="inline-flex items-center gap-0.5 text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star className="h-4 w-4" fill={star <= rating ? "currentColor" : "none"} key={star} />
        ))}
      </span>
    );
  }
  if (column.format === "thumbnail") {
    const gradient = thumbnailGradients[(row.id - 1) % thumbnailGradients.length];
    const src = assetUrl(value);
    if (src) {
      return <img src={src} alt={row.bannerTitle || "Uploaded image"} className="h-10 w-28 rounded-md object-cover shadow-sm ring-1 ring-blue-100" />;
    }
    return (
      <span className={`flex h-10 w-28 items-center overflow-hidden rounded-md bg-gradient-to-r ${gradient} px-2 text-[9px] font-black uppercase leading-tight text-white shadow-sm ring-1 ring-blue-100`}>
        {value || row.bannerTitle}
      </span>
    );
  }
  if (column.format === "person") {
    return (
      <span className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-upchar-blue ring-1 ring-blue-100">
          {row[column.initialsKey] || initials(value)}
        </span>
        <span>
          <span className="block font-black text-navy-950">{value}</span>
          {column.secondaryKey ? <span className="block text-xs font-semibold text-navy-500">{row[column.secondaryKey]}</span> : null}
        </span>
      </span>
    );
  }
  if (column.link) return <span className="font-black text-upchar-blue underline underline-offset-2">{value}</span>;
  if (column.secondaryKey) {
    return (
      <span>
        <span className="block font-black text-navy-950">{value}</span>
        <span className="block text-xs font-semibold text-navy-500">{row[column.secondaryKey]}</span>
      </span>
    );
  }
  if (column.truncate) return <span className="block max-w-[360px] whitespace-normal leading-5">{value}</span>;
  return value;
}

function AdminManagementTable({ config, rows, totalCount, onCopy, onDelete, onDownload, onEdit, onMore, onPrint, onStatusChange, onView, onWhatsApp }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const filteredCount = rows.length;
  const totalLabel = totalCount ?? config.totalLabel ?? config.totalCount ?? filteredCount;
  const totalPages = Math.max(1, Math.ceil(filteredCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const visibleRows = useMemo(() => rows.slice(startIndex, startIndex + pageSize), [pageSize, rows, startIndex]);
  const firstRow = filteredCount ? startIndex + 1 : 0;
  const lastRow = Math.min(startIndex + pageSize, filteredCount);
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, index) => index + 1);
  const lastPage = config.lastPageLabel || totalPages;
  const rowMinWidth = config.tableMinWidth || 1180;
  const hasActions = config.actions?.length > 0;

  useEffect(() => {
    setPage(1);
  }, [pageSize, rows]);

  return (
    <section className="min-w-0 rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <h2 className="text-xl font-black text-navy-950">{config.tableTitle}{config.showTableCount === false ? "" : ` (${totalLabel})`}</h2>

      {config.tabs ? (
        <div className="mt-5 flex flex-wrap border-b border-blue-100">
          {config.tabs.map((tab, index) => (
            <button
              type="button"
              className={`min-h-12 border-b-2 px-6 text-sm font-black ${index === 0 ? "border-upchar-green text-upchar-green" : "border-transparent text-navy-600"}`}
              key={tab.label}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 max-w-full overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-left" style={{ minWidth: rowMinWidth }}>
          <thead>
            <tr className="text-sm font-black text-navy-900">
              {config.selectable ? (
                <th className="border-b border-t border-blue-100 bg-slate-50 px-4 py-4 first:border-l">
                  <input type="checkbox" className="h-4 w-4 rounded border-blue-200 accent-upchar-green" aria-label="Select all rows" />
                </th>
              ) : null}
              <th className="border-b border-t border-blue-100 bg-slate-50 px-4 py-4 first:border-l">#</th>
              {config.columns.map((column) => (
                <th className="border-b border-t border-blue-100 bg-slate-50 px-4 py-4" key={column.key}>{column.label}</th>
              ))}
              {hasActions ? <th className="border-b border-r border-t border-blue-100 bg-slate-50 px-4 py-4">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="text-sm font-semibold text-navy-900">
            {visibleRows.map((row, index) => (
              <tr className="transition hover:bg-blue-50/45" key={row._id || row.id}>
                {config.selectable ? (
                  <td className="border-b border-blue-100 px-4 py-4">
                    <input type="checkbox" className="h-4 w-4 rounded border-blue-200 accent-upchar-green" aria-label={`Select row ${startIndex + index + 1}`} />
                  </td>
                ) : null}
                <td className="border-b border-blue-100 px-4 py-4">{startIndex + index + 1}</td>
                {config.columns.map((column) => (
                  <td className="border-b border-blue-100 px-4 py-4" key={column.key}>
                    <CellValue column={column} row={row} />
                  </td>
                ))}
                {hasActions ? (
                  <td className="border-b border-blue-100 px-4 py-4">
                    <div className="flex items-center gap-3">
                      {config.actions.includes("view") ? (
                        <button type="button" onClick={() => onView(row)} className="flex h-9 w-9 items-center justify-center rounded-md bg-green-50 text-upchar-green ring-1 ring-green-100" aria-label={`View row ${startIndex + index + 1}`}>
                          <Eye className="h-5 w-5" />
                        </button>
                      ) : null}
                      {config.actions.includes("edit") ? (
                        <button type="button" onClick={() => onEdit(row)} className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-upchar-blue ring-1 ring-blue-100" aria-label={`Edit row ${startIndex + index + 1}`}>
                          <PencilLine className="h-5 w-5" />
                        </button>
                      ) : null}
                    {config.actions.includes("details") ? (
                      <button type="button" onClick={() => onView(row)} className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-md bg-blue-50 px-3 text-xs font-black text-upchar-blue ring-1 ring-blue-100" aria-label={`View details row ${startIndex + index + 1}`}>
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    ) : null}
                    {config.actions.includes("print") ? (
                      <button type="button" onClick={() => onPrint(row)} className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-upchar-blue ring-1 ring-blue-100" aria-label={`Print row ${startIndex + index + 1}`}>
                        <Printer className="h-5 w-5" />
                      </button>
                    ) : null}
                    {config.actions.includes("download") ? (
                      <button type="button" onClick={() => onDownload(row)} className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-upchar-blue ring-1 ring-blue-100" aria-label={`Download row ${startIndex + index + 1}`}>
                        <Download className="h-5 w-5" />
                      </button>
                    ) : null}
                    {config.actions.includes("whatsapp") ? (
                      <button type="button" onClick={() => onWhatsApp(row)} className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-md bg-green-50 px-3 text-xs font-black text-upchar-green ring-1 ring-green-100" aria-label={`Send WhatsApp update row ${startIndex + index + 1}`}>
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </button>
                    ) : null}
                    {config.actions.includes("copy") ? (
                      <button type="button" onClick={() => onCopy(row)} className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-upchar-blue ring-1 ring-blue-100" aria-label={`Copy row ${startIndex + index + 1}`}>
                        <Copy className="h-5 w-5" />
                      </button>
                    ) : null}
                    {config.actions.includes("statusUpdate") ? (
                      <select
                        value={row.currentStatus || row.status}
                        onChange={(event) => onStatusChange(row, event.target.value)}
                        className="h-9 rounded-md border border-blue-100 bg-white px-3 text-xs font-black text-navy-900 outline-none"
                        aria-label={`Update status row ${index + 1}`}
                      >
                        {[...new Set([row.currentStatus || row.status, ...config.statusOptions])].filter(Boolean).map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    ) : null}
                    {config.actions.includes("delete") ? (
                      <button type="button" onClick={() => onDelete(row)} className="flex h-9 w-9 items-center justify-center rounded-md bg-red-50 text-upchar-red ring-1 ring-red-100" aria-label={`Delete row ${startIndex + index + 1}`}>
                        <Trash2 className="h-5 w-5" />
                      </button>
                    ) : null}
                    {config.actions.includes("permanentDelete") ? (
                      <button type="button" onClick={() => onDelete(row)} className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-md bg-red-50 px-3 text-xs font-black text-upchar-red ring-1 ring-red-100" aria-label={`Delete permanently row ${startIndex + index + 1}`}>
                        <Trash2 className="h-4 w-4" />
                        Delete Permanently
                      </button>
                    ) : null}
                    {config.actions.includes("more") ? (
                      <button type="button" onClick={() => onMore(row)} className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-50 text-navy-800 ring-1 ring-blue-100" aria-label={`More row ${startIndex + index + 1}`}>
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    ) : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCount === 0 ? (
          <div className="rounded-b-lg border-x border-b border-blue-100 px-4 py-10 text-center text-sm font-black text-navy-600">{config.emptyText}</div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm font-semibold text-navy-900">Showing {firstRow} to {lastRow} of {totalLabel} entries</p>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} className="flex h-10 w-10 items-center justify-center rounded-md border border-blue-100 text-navy-400" aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pageNumbers.map((pageNumber) => (
            <button
              type="button"
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`h-10 w-10 rounded-md border text-sm font-black ${pageNumber === safePage ? "border-upchar-green bg-upchar-green text-white" : "border-blue-100 text-navy-900"}`}
            >
              {pageNumber}
            </button>
          ))}
          {totalPages > 5 ? <span className="px-1 text-sm font-black text-navy-600">...</span> : null}
          {totalPages > 5 ? (
            <button type="button" onClick={() => setPage(totalPages)} className="h-10 w-12 rounded-md border border-blue-100 text-sm font-black text-navy-900">
              {lastPage}
            </button>
          ) : null}
          <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="flex h-10 w-10 items-center justify-center rounded-md border border-blue-100 text-navy-900" aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </button>
          <select
            className="h-10 rounded-md border border-blue-100 px-4 text-sm font-black text-navy-900 outline-none"
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default AdminManagementTable;
