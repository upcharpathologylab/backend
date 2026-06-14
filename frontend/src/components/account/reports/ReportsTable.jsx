import { Download, MoreVertical } from "lucide-react";
import Icon from "../../Icon.jsx";
import StatusBadge from "../StatusBadge.jsx";

const colorClasses = {
  blue: "bg-blue-50 text-upchar-blue",
  green: "bg-green-50 text-upchar-green",
  orange: "bg-orange-50 text-upchar-orange",
  purple: "bg-violet-50 text-upchar-purple",
  red: "bg-red-50 text-upchar-red"
};

function ReportIdentity({ row }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${colorClasses[row.color] || colorClasses.blue}`}>
        <Icon name={row.icon} className="h-6 w-6" />
      </span>
      <span>
        <span className="block text-sm font-black text-navy-900">{row.title}</span>
        <span className="mt-1 block text-xs font-semibold text-navy-600">{row.subtitle}</span>
      </span>
    </div>
  );
}

function ReportsTable({ rows, onAction }) {
  return (
    <div className="overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm">
      <div className="hidden grid-cols-[1.45fr_1fr_0.9fr_0.8fr_0.85fr_32px] bg-blue-50/50 px-5 py-4 text-sm font-black text-navy-800 lg:grid">
        <span>Test / Package</span>
        <span>Booking ID</span>
        <span>Date</span>
        <span>Status</span>
        <span>Action</span>
        <span />
      </div>

      <div className="divide-y divide-blue-100">
        {rows.map((row) => (
          <div className="grid gap-4 p-5 lg:grid-cols-[1.45fr_1fr_0.9fr_0.8fr_0.85fr_32px] lg:items-center" key={row.id}>
            <ReportIdentity row={row} />
            <span className="text-sm font-semibold text-navy-800">{row.bookingId}</span>
            <span className="text-sm font-semibold text-navy-700">
              {row.date}
              <span className="block text-xs text-navy-500">{row.time}</span>
            </span>
            <StatusBadge label={row.status} />
            {!row.reportFile ? (
              <span className="text-sm font-black text-navy-500">Report Pending</span>
            ) : (
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-100 px-4 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
                onClick={() => onAction(row)}
              >
                <Download className="h-4 w-4" />
                {row.action}
              </button>
            )}
            <button type="button" className="hidden text-navy-700 lg:block" aria-label="Report options">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportsTable;
