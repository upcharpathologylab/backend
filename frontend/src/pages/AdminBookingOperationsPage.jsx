import { useEffect, useMemo, useState } from "react";
import { Activity, CalendarCheck, CheckCircle2, Clock3, FileCheck2, FlaskConical, Headphones, XCircle } from "lucide-react";
import AccountToast from "../components/account/AccountToast.jsx";
import ConfirmDeleteModal from "../components/account/ConfirmDeleteModal.jsx";
import AdminDetailsModal from "../components/admin/common/AdminDetailsModal.jsx";
import AdminFilterCard from "../components/admin/common/AdminFilterCard.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import { matchesAdminDateRange, useAdminDateRange } from "../components/admin/AdminDateFilter.jsx";
import AdminManagementFormModal from "../components/admin/common/AdminManagementFormModal.jsx";
import AdminManagementTable from "../components/admin/common/AdminManagementTable.jsx";
import AdminStatsGrid from "../components/admin/common/AdminStatsGrid.jsx";
import { assetUrl, deleteAdminBookingPermanent, deleteAdminBookingReport, getAdminResource, updateAdminBookingStatus, uploadAdminBookingReport } from "../api/api.js";
import { getStoredAdminUser } from "../components/auth/authStorage.js";
import { isSuperAdminUser } from "../utils/adminPermissions.js";

function getDefaultFilters(filters) {
  return filters.reduce((values, filter) => {
    values[filter.key] = filter.defaultValue || "";
    return values;
  }, {});
}

function isAllValue(value) {
  return !value || value === "All" || value.startsWith("All ");
}

function matchesSelectFilter(row, filter, value) {
  if (isAllValue(value)) return true;
  return String(row[filter.key] || "") === value;
}

function matchesDateFilter(row, filter, value) {
  if (!value) return true;
  const target = filter.matchKey || filter.key;
  return matchesAdminDateRange(row[target], value);
}

const toneClasses = {
  blue: "bg-blue-50 text-upchar-blue",
  green: "bg-green-50 text-upchar-green",
  orange: "bg-orange-50 text-upchar-orange",
  purple: "bg-violet-50 text-upchar-purple",
  red: "bg-red-50 text-upchar-red"
};

const stageIcons = [Clock3, CalendarCheck, CheckCircle2, FlaskConical, FileCheck2, CheckCircle2, XCircle];

const inProgressStatuses = new Set(["Confirmed", "Sample Collection Scheduled", "Sample Collected", "Testing In Progress", "Report Ready"]);

const percentText = (value, total) => (total ? `${Math.round((value / total) * 100)}%` : "0%");

function buildBookingStats(rows, config) {
  if (config.apiResource !== "bookings") return config.stats;
  const total = rows.length;
  const completed = rows.filter((row) => row.bookingStatus === "Completed" || row.currentStatus === "Completed").length;
  const pending = rows.filter((row) => row.bookingStatus === "Pending Confirmation" || row.currentStatus === "Pending Confirmation").length;
  const cancelled = rows.filter((row) => row.bookingStatus === "Cancelled" || row.currentStatus === "Cancelled").length;
  const inProgress = rows.filter((row) => inProgressStatuses.has(row.bookingStatus || row.currentStatus)).length;
  const completionRate = percentText(completed, total);

  if (config.breadcrumb === "Booking Status Management") {
    return [
      { title: "Total Bookings", value: String(total), text: "All time", icon: "calendar", color: "blue" },
      { title: "Completed", value: String(completed), text: `(${completionRate})`, icon: "check", color: "green", progress: completionRate, progressClass: "bg-upchar-green" },
      { title: "In Progress", value: String(inProgress), text: `(${percentText(inProgress, total)})`, icon: "clock", color: "orange", progress: percentText(inProgress, total), progressClass: "bg-upchar-orange" },
      { title: "Pending", value: String(pending), text: `(${percentText(pending, total)})`, icon: "pause", color: "purple", progress: percentText(pending, total), progressClass: "bg-upchar-purple" },
      { title: "Cancelled", value: String(cancelled), text: `(${percentText(cancelled, total)})`, icon: "x", color: "orange", progress: percentText(cancelled, total), progressClass: "bg-upchar-red" }
    ];
  }

  return [
    { title: "Total Bookings", value: String(total), text: "Real bookings", icon: "calendar", color: "green", tone: "green" },
    { title: "Completed Bookings", value: String(completed), text: "Completed", icon: "check", color: "blue", tone: "green" },
    { title: "Pending Bookings", value: String(pending), text: "Pending confirmation", icon: "clock", color: "orange" },
    { title: "Cancelled Bookings", value: String(cancelled), text: "Cancelled", icon: "x", color: "purple" },
    { title: "Completion Rate", value: completionRate, text: "Completed / total", icon: "badge", color: "cyan" }
  ];
}

function buildBookingWidgets(rows, widgets) {
  if (!widgets) return null;
  const total = rows.length;
  const completed = rows.filter((row) => row.bookingStatus === "Completed").length;
  const pending = rows.filter((row) => row.bookingStatus === "Pending Confirmation").length;
  const cancelled = rows.filter((row) => row.bookingStatus === "Cancelled").length;
  const inProgress = rows.filter((row) => inProgressStatuses.has(row.bookingStatus)).length;
  const today = new Date().toLocaleDateString("en-IN");
  const todayCount = rows.filter((row) => {
    const created = row.createdAt ? new Date(row.createdAt).toLocaleDateString("en-IN") : "";
    return created === today;
  }).length;

  return {
    overview: [
      { label: "Completed", value: `${completed} (${percentText(completed, total)})`, color: "bg-upchar-green" },
      { label: "In Progress", value: `${inProgress} (${percentText(inProgress, total)})`, color: "bg-upchar-blue" },
      { label: "Pending", value: `${pending} (${percentText(pending, total)})`, color: "bg-upchar-orange" },
      { label: "Cancelled", value: `${cancelled} (${percentText(cancelled, total)})`, color: "bg-upchar-red" }
    ],
    today: { value: String(todayCount), text: "Created today" },
    activities: rows.slice(0, 5).map((row) => ({
      title: row.bookingStatus || "Booking received",
      text: `${row.bookingId} for ${row.patientName}`,
      time: row.lastUpdated || row.bookingDate,
      tone: row.bookingStatus === "Cancelled" ? "red" : row.bookingStatus === "Completed" ? "green" : "blue"
    }))
  };
}

function BookingOverviewWidgets({ widgets }) {
  if (!widgets) return null;

  return (
    <aside className="grid gap-5 xl:sticky xl:top-24">
      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-navy-950">Booking Overview</h2>
        <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row xl:flex-col 2xl:flex-row">
          <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(#009444_0_79.4%,#0969ff_79.4%_89%,#f59e0b_89%_97.8%,#ef4444_97.8%_100%)]">
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white text-center shadow-sm">
              <span className="text-lg font-black text-navy-950">{widgets.total || "0"}</span>
              <span className="text-xs font-black text-navy-500">Total</span>
            </div>
          </div>
          <div className="grid w-full gap-3">
            {widgets.overview.map((item) => (
              <div className="flex items-center justify-between gap-3 text-sm font-semibold text-navy-800" key={item.label}>
                <span className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${item.color}`} />
                  {item.label}
                </span>
                <span className="font-black">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-navy-950">Today's Bookings</h2>
        <div className="mt-4 flex items-center justify-between gap-4">
          <span>
            <span className="block text-3xl font-black text-navy-950">{widgets.today.value}</span>
            <span className="mt-1 block text-sm font-semibold text-upchar-green">{widgets.today.text}</span>
          </span>
          <svg className="h-16 w-28 text-upchar-blue" viewBox="0 0 112 64" aria-hidden="true">
            <polyline points="4,52 16,46 28,50 40,30 52,40 64,22 76,30 88,14 100,20 108,10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-navy-950">Recent Booking Activities</h2>
          <span className="text-xs font-black text-upchar-blue">View All</span>
        </div>
        <div className="mt-4 grid gap-4">
          {widgets.activities.map((item) => (
            <article className="flex gap-3" key={`${item.title}-${item.time}`}>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${toneClasses[item.tone] || toneClasses.green}`}>
                <Activity className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-black text-navy-950">{item.title}</span>
                <span className="block text-xs font-semibold leading-5 text-navy-700">{item.text}</span>
                <span className="block text-xs font-semibold text-navy-500">{item.time}</span>
              </span>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}

function BookingStatusStages({ stages }) {
  if (!stages) return null;

  return (
    <section className="mt-6 rounded-lg border border-green-100 bg-green-50/60 p-5 shadow-sm">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-black text-upchar-green">Booking Status Stages</h2>
          <p className="mt-1 text-sm font-semibold text-navy-700">Track and manage booking status at each stage.</p>
        </div>
      </div>
      <div className="mt-5 max-w-full overflow-x-auto">
        <div className="flex min-w-[980px] items-start justify-between gap-3">
          {stages.map((stage, index) => {
            const Icon = stageIcons[index] || CheckCircle2;
            return (
              <div className="flex flex-1 items-start gap-3" key={stage.title}>
                <article className="min-w-[120px] text-center">
                  <span className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full ${toneClasses[stage.tone] || toneClasses.green}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-2 text-sm font-black text-navy-950">{stage.title}</h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-navy-700">{stage.text}</p>
                </article>
                {index < stages.length - 1 ? <span className="mt-5 text-lg font-black text-navy-500">&gt;</span> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AdminBookingOperationsPage({ config }) {
  const adminDateRange = useAdminDateRange();
  const canDeletePermanently = isSuperAdminUser(getStoredAdminUser());
  const [rows, setRows] = useState(config.rows);
  const [filters, setFilters] = useState(() => getDefaultFilters(config.filters));
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const [formItem, setFormItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [reportUploading, setReportUploading] = useState(false);

  useEffect(() => {
    document.title = `${config.title} | Upchar Admin`;
    let mounted = true;

    if (!config.apiResource) {
      setRows(config.rows);
      const timer = window.setTimeout(() => {
        if (mounted) setLoading(false);
      }, 150);
      return () => {
        mounted = false;
        window.clearTimeout(timer);
      };
    }

    setLoading(true);
    getAdminResource(config.apiResource)
      .then((data) => {
        if (mounted) setRows(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) {
          setRows([]);
          showToast("Could not load bookings. Please check backend connection.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [config]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const filteredRows = useMemo(() => {
    const query = String(filters.query || "").trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery = !query || config.searchFields.some((key) => String(row[key] || "").toLowerCase().includes(query));
      const matchesSelects = config.filters
        .filter((filter) => filter.type === "select")
        .every((filter) => matchesSelectFilter(row, filter, filters[filter.key]));
      const matchesDates = config.filters
        .filter((filter) => filter.type === "date")
        .every((filter) => matchesDateFilter(row, filter, filters[filter.key] || adminDateRange.value));
      return matchesQuery && matchesSelects && matchesDates;
    });
  }, [adminDateRange.value, config, filters, rows]);

  const computedStats = useMemo(() => buildBookingStats(rows, config), [config, rows]);
  const computedWidgets = useMemo(() => {
    const widgets = buildBookingWidgets(rows, config.sideWidgets);
    return widgets ? { ...widgets, total: String(rows.length) } : null;
  }, [config.sideWidgets, rows]);
  const computedConfig = useMemo(() => {
    const actions = canDeletePermanently && config.apiResource === "bookings"
      ? [...new Set([...(config.actions || []), "permanentDelete"])]
      : config.actions;

    return { ...config, actions, stats: computedStats, totalLabel: String(rows.length), totalCount: rows.length };
  }, [canDeletePermanently, computedStats, config, rows.length]);

  const saveItem = (values) => {
    setRows((current) => current.map((row) => (row.id === values.id ? values : row)));
    setFormItem(null);
    showToast(`${config.breadcrumb} updated successfully.`);
  };

  const confirmDelete = async () => {
    if (!canDeletePermanently) {
      setDeleteTarget(null);
      showToast("Only Super Admin can permanently delete bookings.");
      return;
    }

    const targetId = deleteTarget?._id || deleteTarget?.id;
    if (!targetId) {
      setDeleteTarget(null);
      showToast("Booking ID is missing.");
      return;
    }

    try {
      await deleteAdminBookingPermanent(targetId);
      setRows((current) => current.filter((row) => (row._id || row.id) !== targetId));
      setDeleteTarget(null);
      showToast("Booking permanently deleted.");
    } catch (error) {
      showToast(error?.response?.data?.message || "Could not permanently delete booking.");
    }
  };

  const updateStatus = async (item, status) => {
    if (config.apiResource === "bookings") {
      try {
        const saved = await updateAdminBookingStatus(item._id || item.id, status);
        setRows((current) => current.map((row) => ((row._id || row.id) === (item._id || item.id) ? saved : row)));
        showToast(`${item.bookingId} status changed to ${status}.`);
      } catch {
        showToast("Could not update booking status.");
      }
      return;
    }

    setRows((current) => current.map((row) => (row.id === item.id ? { ...row, currentStatus: status, bookingStatus: status, lastUpdated: "Updated just now" } : row)));
    showToast(`${item.bookingId} status changed to ${status}.`);
  };

  const sendWhatsAppUpdate = (item) => {
    if (!item.whatsappUrl) {
      showToast("Customer mobile number is not available.");
      return;
    }
    window.open(item.whatsappUrl, "_blank", "noopener,noreferrer");
    showToast(`WhatsApp update opened for ${item.bookingId}.`);
  };

  const updateRow = (saved) => {
    setRows((current) => current.map((row) => ((row._id || row.id) === (saved._id || saved.id) ? saved : row)));
    setViewItem(saved);
  };

  const uploadReport = async (file) => {
    if (!file || !viewItem) return;
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      showToast("Only JPG, PNG and PDF reports are allowed.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast("Report file must be 8 MB or smaller.");
      return;
    }
    try {
      setReportUploading(true);
      const saved = await uploadAdminBookingReport(viewItem._id || viewItem.id, file);
      updateRow(saved);
      showToast("Report uploaded successfully.");
    } catch (error) {
      showToast(error?.response?.data?.message || "Could not upload report.");
    } finally {
      setReportUploading(false);
    }
  };

  const deleteReport = async () => {
    if (!viewItem?.reportFile) return;
    try {
      const saved = await deleteAdminBookingReport(viewItem._id || viewItem.id);
      updateRow(saved);
      showToast("Report deleted successfully.");
    } catch (error) {
      showToast(error?.response?.data?.message || "Could not delete report.");
    }
  };

  const bookingReportTools = viewItem && config.apiResource === "bookings" ? (
    <section className="rounded-md border border-blue-100 bg-white p-4">
      <h3 className="text-sm font-black text-navy-950">Upload Report</h3>
      <p className="mt-1 text-xs font-semibold text-navy-600">Report is linked to this booking and customer account.</p>
      {viewItem.reportFile ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={assetUrl(viewItem.reportFile)} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center rounded-md border border-blue-100 px-4 text-sm font-black text-upchar-blue hover:bg-blue-50">
            View / Download
          </a>
          <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-upchar-blue px-4 text-sm font-black text-white">
            Replace Report
            <input type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" className="sr-only" onChange={(event) => uploadReport(event.target.files?.[0])} />
          </label>
          <button type="button" onClick={deleteReport} className="inline-flex h-10 items-center justify-center rounded-md border border-red-100 px-4 text-sm font-black text-upchar-red hover:bg-red-50">
            Delete
          </button>
        </div>
      ) : (
        <label className="mt-4 inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-upchar-green px-4 text-sm font-black text-white">
          {reportUploading ? "Uploading..." : "Upload Report"}
          <input type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" className="sr-only" onChange={(event) => uploadReport(event.target.files?.[0])} />
        </label>
      )}
    </section>
  ) : null;

  const content = (
    <>
      <div className="mt-6">
        <AdminFilterCard
          filters={config.filters}
          values={filters}
          onApply={() => showToast("Filters applied.")}
          onChange={setFilters}
          onReset={() => {
            setFilters(getDefaultFilters(config.filters));
            showToast("Filters reset.");
          }}
        />
      </div>

      <BookingStatusStages stages={config.statusStages} />

      <div className="mt-6">
        {loading ? (
          <section className="rounded-lg border border-blue-100 bg-white p-10 text-center text-sm font-black text-navy-600 shadow-sm">Loading {config.breadcrumb.toLowerCase()}...</section>
        ) : (
          <AdminManagementTable
            config={computedConfig}
            rows={filteredRows}
            onDelete={setDeleteTarget}
            onEdit={setFormItem}
            onPrint={(item) => showToast(`${item.bookingId} invoice print started.`)}
            onStatusChange={updateStatus}
            onWhatsApp={sendWhatsAppUpdate}
            onView={setViewItem}
          />
        )}
      </div>

      {config.infoCard ? (
        <section className="mt-6 rounded-lg border border-green-100 bg-green-50/70 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-upchar-green">
              <Headphones className="h-6 w-6" />
            </span>
            <span>
              <h2 className="text-base font-black text-navy-950">{config.infoCard.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-7 text-navy-700">{config.infoCard.text}</p>
            </span>
          </div>
        </section>
      ) : null}
    </>
  );

  return (
    <AdminLayout topbarTitle={config.title} topbarBadge={null}>
      <p className="text-sm font-semibold text-navy-700">
        <span className="font-black text-navy-950">Dashboard</span>
        <span className="px-2 text-navy-400">&gt;</span>
        {computedConfig.breadcrumb}
      </p>

      <div className="mt-7">
        <AdminStatsGrid stats={computedStats} />
      </div>

      {computedWidgets ? (
        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">{content}</div>
          <BookingOverviewWidgets widgets={computedWidgets} />
        </div>
      ) : (
        content
      )}

      {viewItem ? <AdminDetailsModal config={config} extraContent={bookingReportTools} item={viewItem} onClose={() => setViewItem(null)} /> : null}

      {formItem ? <AdminManagementFormModal config={config} item={formItem} onClose={() => setFormItem(null)} onSave={saveItem} /> : null}

      {deleteTarget ? (
        <ConfirmDeleteModal
          title="Delete Booking"
          message="This action will permanently delete the booking and cannot be undone."
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}

      <AccountToast message={toast} />
    </AdminLayout>
  );
}

export default AdminBookingOperationsPage;
