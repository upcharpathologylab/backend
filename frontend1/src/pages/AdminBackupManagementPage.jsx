import { useEffect, useMemo, useState } from "react";
import FormModal from "../components/profile/FormModal.jsx";
import AccountToast from "../components/account/AccountToast.jsx";
import AdminFilterCard from "../components/admin/common/AdminFilterCard.jsx";
import { AdminActionsCard, AdminDonutCard, AdminInfoNotice, AdminTabs } from "../components/admin/common/AdminInsightCards.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import { matchesAdminDateRange, useAdminDateRange } from "../components/admin/AdminDateFilter.jsx";
import AdminManagementTable from "../components/admin/common/AdminManagementTable.jsx";
import AdminStatsGrid from "../components/admin/common/AdminStatsGrid.jsx";
import {
  backupFilters,
  backupRows,
  backupSettingsRows,
  backupSideCards,
  backupStats,
  backupTableConfig,
  restoreHistoryRows,
  scheduledBackupRows
} from "../data/adminSystemData.js";

const tabs = [
  { key: "history", label: "Backup History" },
  { key: "scheduled", label: "Scheduled Backups" },
  { key: "settings", label: "Backup Settings" },
  { key: "restore", label: "Restore History" }
];

const rowsByTab = {
  history: backupRows,
  scheduled: scheduledBackupRows,
  settings: backupSettingsRows,
  restore: restoreHistoryRows
};

const tableConfigByTab = {
  history: backupTableConfig,
  scheduled: { ...backupTableConfig, tableTitle: "Scheduled Backups", totalCount: 6, totalLabel: "6", lastPageLabel: "1", actions: ["more"] },
  settings: { ...backupTableConfig, tableTitle: "Backup Settings", totalCount: 3, totalLabel: "3", lastPageLabel: "1", actions: ["more"] },
  restore: { ...backupTableConfig, tableTitle: "Restore History", totalCount: 2, totalLabel: "2", lastPageLabel: "1", actions: ["download", "more"] }
};

function defaultFilters() {
  return backupFilters.reduce((values, filter) => ({ ...values, [filter.key]: filter.defaultValue || "" }), {});
}

function isAllValue(value) {
  return !value || value.startsWith("All ") || value.startsWith("Select ");
}

function filterRows(rows, filters, dateRangeValue) {
  const query = String(filters.query || "").trim().toLowerCase();
  return rows.filter((row) => {
    const matchesQuery =
      !query ||
      ["backupName", "backupNote", "type", "status", "fileSize", "createdBy"].some((key) => String(row[key] || "").toLowerCase().includes(query));
    const matchesType = isAllValue(filters.type) || row.type === filters.type;
    const matchesStatus = isAllValue(filters.status) || row.status === filters.status;
    const matchesDate = matchesAdminDateRange(row.backupDateTime, filters.backupDateTime || dateRangeValue);
    return matchesQuery && matchesType && matchesStatus && matchesDate;
  });
}

function ConfirmActionModal({ action, onClose, onConfirm }) {
  return (
    <FormModal
      title={action}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} className="h-11 rounded-md border border-blue-100 px-6 text-sm font-black text-navy-800">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="h-11 rounded-md bg-upchar-green px-6 text-sm font-black text-white">
            Confirm
          </button>
        </div>
      }
    >
      <p className="text-sm font-semibold leading-6 text-navy-700">
        Please confirm you want to continue with <span className="font-black text-navy-950">{action}</span>. This is a mock admin action for the local frontend.
      </p>
    </FormModal>
  );
}

function SideInfoCard({ title, children }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-navy-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function AdminBackupManagementPage() {
  const adminDateRange = useAdminDateRange();
  const [activeTab, setActiveTab] = useState("history");
  const [filters, setFilters] = useState(defaultFilters);
  const [confirmAction, setConfirmAction] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.title = "Data Backup Management | Upchar Admin";
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const filteredRows = useMemo(() => filterRows(rowsByTab[activeTab], filters, adminDateRange.value), [activeTab, adminDateRange.value, filters]);
  const tableConfig = tableConfigByTab[activeTab];

  const handleQuickAction = (item) => {
    if (["Create Manual Backup", "Restore Backup", "Backup Settings"].includes(item)) {
      setConfirmAction(item);
      return;
    }
    showToast(`${item} opened.`);
  };

  return (
    <AdminLayout topbarTitle="Data Backup Management" topbarBadge={null}>
      <p className="text-sm font-semibold text-navy-700">
        <span className="font-black text-navy-950">Dashboard</span>
        <span className="px-2 text-navy-400">&gt;</span>
        Data Backup Management
      </p>

      <div className="mt-7">
        <AdminStatsGrid stats={backupStats} />
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <div className="rounded-lg border border-blue-100 bg-white px-5 pt-2 shadow-sm">
            <AdminTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <div className="mt-5">
            <AdminFilterCard
              filters={backupFilters}
              values={filters}
              onApply={() => showToast("Backup filters applied.")}
              onChange={setFilters}
              onReset={() => {
                setFilters(defaultFilters());
                showToast("Backup filters reset.");
              }}
            />
          </div>

          <div className="mt-5">
            <AdminManagementTable
              config={tableConfig}
              rows={filteredRows}
              onDownload={(item) => showToast(`${item.backupName} download started.`)}
              onMore={(item) => showToast(`More actions opened for ${item.backupName}.`)}
            />
          </div>

          <div className="mt-5">
            <AdminInfoNotice
              title="Your data is safe and secure"
              text="All backups are encrypted and stored securely. You can restore your data anytime using the backup files."
              actionLabel="Learn More"
              onAction={() => showToast("Backup safety guide opened.")}
            />
          </div>
        </div>

        <aside className="grid content-start gap-5">
          <AdminDonutCard {...backupSideCards.summary} />

          <SideInfoCard title="Next Scheduled Backup">
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-base font-black text-navy-950">Daily Backup</p>
              <p className="mt-2 text-sm font-semibold text-navy-700">May 23, 2025 02:30 AM</p>
              <span className="mt-3 inline-flex rounded-md bg-green-100 px-3 py-1 text-xs font-black text-upchar-green">In 13h 45m</span>
            </div>
          </SideInfoCard>

          <SideInfoCard title="Backup Storage">
            <p className="text-3xl font-black text-navy-950">24.6 GB <span className="text-lg text-navy-500">/ 100 GB</span></p>
            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div className="h-full w-[24.6%] rounded-full bg-upchar-blue" />
            </div>
            <p className="mt-3 text-sm font-semibold text-navy-600">Available: 75.4 GB</p>
          </SideInfoCard>

          <AdminActionsCard title="Quick Actions" items={backupSideCards.quickActions} onAction={handleQuickAction} />
        </aside>
      </div>

      {confirmAction ? (
        <ConfirmActionModal
          action={confirmAction}
          onClose={() => setConfirmAction("")}
          onConfirm={() => {
            showToast(`${confirmAction} started.`);
            setConfirmAction("");
          }}
        />
      ) : null}

      <AccountToast message={toast} />
    </AdminLayout>
  );
}

export default AdminBackupManagementPage;
