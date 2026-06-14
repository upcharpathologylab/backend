import { useEffect, useMemo, useState } from "react";
import { KeyRound, Plus, ShieldCheck, ToggleLeft, ToggleRight } from "lucide-react";
import AccountToast from "../components/account/AccountToast.jsx";
import AdminDetailsModal from "../components/admin/common/AdminDetailsModal.jsx";
import AdminFilterCard from "../components/admin/common/AdminFilterCard.jsx";
import { AdminActionsCard, AdminInfoNotice } from "../components/admin/common/AdminInsightCards.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import { matchesAdminDateRange, useAdminDateRange } from "../components/admin/AdminDateFilter.jsx";
import AdminManagementFormModal from "../components/admin/common/AdminManagementFormModal.jsx";
import AdminManagementTable from "../components/admin/common/AdminManagementTable.jsx";
import AdminStatsGrid from "../components/admin/common/AdminStatsGrid.jsx";
import {
  accessLogConfig,
  accessLogRows,
  blockedIpConfig,
  blockedIpRows,
  securityPolicies,
  securityStats
} from "../data/adminSystemData.js";

const securityFilters = [
  { key: "query", label: "Search Access", type: "search", placeholder: "Search by user, role, IP or action..." },
  { key: "role", label: "Role", type: "select", defaultValue: "All Roles", options: ["All Roles", "Super Admin", "Editor", "Receptionist", "Unknown"] },
  { key: "status", label: "Status", type: "select", defaultValue: "All Status", options: ["All Status", "Success", "Failed", "Blocked"] },
  { key: "dateTime", label: "Date Range", type: "date", placeholder: "Select Date Range" }
];

const ruleFormConfig = {
  breadcrumb: "Access Rule",
  addLabel: "Add Access Rule",
  saveLabel: "Save Rule",
  formFields: [
    { key: "ruleName", label: "Rule Name", required: true },
    { key: "ruleType", label: "Rule Type", type: "select", options: ["IP Whitelist", "Blocked IP", "Role Permission", "Session Rule"], required: true },
    { key: "ruleValue", label: "IP / Role / Value", required: true },
    { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true },
    { key: "description", label: "Description", type: "textarea" }
  ]
};

function defaultFilters() {
  return securityFilters.reduce((values, filter) => ({ ...values, [filter.key]: filter.defaultValue || "" }), {});
}

function isAllValue(value) {
  return !value || value.startsWith("All ") || value.startsWith("Select ");
}

function filterAccessLogs(rows, filters, dateRangeValue) {
  const query = String(filters.query || "").trim().toLowerCase();
  return rows.filter((row) => {
    const matchesQuery =
      !query ||
      ["user", "role", "action", "ipAddress", "device", "location"].some((key) => String(row[key] || "").toLowerCase().includes(query));
    const matchesRole = isAllValue(filters.role) || row.role === filters.role;
    const matchesStatus = isAllValue(filters.status) || row.status === filters.status;
    const matchesDate = matchesAdminDateRange(row.dateTime, filters.dateTime || dateRangeValue);
    return matchesQuery && matchesRole && matchesStatus && matchesDate;
  });
}

function filterBlockedIps(rows, filters) {
  const query = String(filters.query || "").trim().toLowerCase();
  return rows.filter((row) => {
    const matchesQuery = !query || ["ipAddress", "reason", "blockedBy", "blockedOn"].some((key) => String(row[key] || "").toLowerCase().includes(query));
    const matchesStatus = isAllValue(filters.status) || row.status === filters.status;
    return matchesQuery && matchesStatus;
  });
}

function AdminSecurityAccessPage() {
  const adminDateRange = useAdminDateRange();
  const [filters, setFilters] = useState(defaultFilters);
  const [policies, setPolicies] = useState(securityPolicies);
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.title = "Security & Access | Upchar Admin";
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const filteredLogs = useMemo(() => filterAccessLogs(accessLogRows, filters, adminDateRange.value), [adminDateRange.value, filters]);
  const filteredBlockedIps = useMemo(() => filterBlockedIps(blockedIpRows, filters), [filters]);

  const togglePolicy = (policy) => {
    setPolicies((current) =>
      current.map((item) =>
        item.id === policy.id
          ? {
              ...item,
              enabled: !item.enabled,
              value: !item.enabled ? "ON" : "OFF"
            }
          : item
      )
    );
    showToast(`${policy.title} updated.`);
  };

  const quickActions = ["Force Logout All Users", "Review Failed Logins", "Manage IP Rules", "Audit User Roles", "Export Security Logs"];

  return (
    <AdminLayout topbarTitle="Security & Access" topbarBadge={null}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <p className="text-sm font-semibold text-navy-700">
          <span className="font-black text-navy-950">Dashboard</span>
          <span className="px-2 text-navy-400">&gt;</span>
          Security & Access
        </p>
        <button type="button" onClick={() => setShowRuleForm(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-upchar-green px-6 text-sm font-black text-white shadow-sm hover:bg-upchar-greenDark">
          <Plus className="h-5 w-5" />
          Add Access Rule
        </button>
      </div>

      <div className="mt-7">
        <AdminStatsGrid stats={securityStats} />
      </div>

      <div className="mt-6">
        <AdminFilterCard
          filters={securityFilters}
          values={filters}
          onApply={() => showToast("Security filters applied.")}
          onChange={setFilters}
          onReset={() => {
            setFilters(defaultFilters());
            showToast("Security filters reset.");
          }}
        />
      </div>

      <section className="mt-6 rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-upchar-green">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-xl font-black text-navy-950">Security Policies</h2>
            <p className="mt-1 text-sm font-semibold text-navy-600">Control login safety, sessions, device checks and admin access rules.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {policies.map((policy) => (
            <article className="rounded-lg border border-blue-100 bg-slate-50/60 p-5" key={policy.id}>
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-upchar-blue ring-1 ring-blue-100">
                  <KeyRound className="h-6 w-6" />
                </span>
                {typeof policy.enabled === "boolean" ? (
                  <button type="button" onClick={() => togglePolicy(policy)} className={policy.enabled ? "text-upchar-green" : "text-slate-400"} aria-label={`Toggle ${policy.title}`}>
                    {policy.enabled ? <ToggleRight className="h-9 w-9" /> : <ToggleLeft className="h-9 w-9" />}
                  </button>
                ) : (
                  <button type="button" onClick={() => showToast(`${policy.title} editor opened.`)} className="rounded-md border border-blue-100 bg-white px-4 py-2 text-xs font-black text-upchar-blue">
                    Edit
                  </button>
                )}
              </div>
              <h3 className="mt-4 text-base font-black text-navy-950">{policy.title}</h3>
              <p className="mt-2 min-h-10 text-sm font-semibold leading-5 text-navy-600">{policy.description}</p>
              <span className={`mt-4 inline-flex rounded-md px-3 py-1 text-xs font-black ring-1 ${policy.value === "OFF" ? "bg-slate-100 text-navy-600 ring-slate-200" : "bg-green-50 text-upchar-green ring-green-100"}`}>
                {policy.value}
              </span>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-6">
        <AdminManagementTable config={accessLogConfig} rows={filteredLogs} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminManagementTable
          config={blockedIpConfig}
          rows={filteredBlockedIps}
          onMore={(item) => showToast(`Unblock action opened for ${item.ipAddress}.`)}
          onView={setViewItem}
        />
        <div className="grid gap-5">
          <AdminActionsCard title="Quick Actions" items={quickActions} onAction={(item) => showToast(`${item} opened.`)} />
          <AdminInfoNotice
            title="Keep admin access protected"
            text="Review failed login attempts, rotate passwords regularly and keep role permissions lean."
            actionLabel="Review Guide"
            onAction={() => showToast("Security guide opened.")}
          />
        </div>
      </div>

      {showRuleForm ? (
        <AdminManagementFormModal
          config={ruleFormConfig}
          item={null}
          onClose={() => setShowRuleForm(false)}
          onSave={() => {
            setShowRuleForm(false);
            showToast("Access rule saved.");
          }}
        />
      ) : null}

      {viewItem ? <AdminDetailsModal config={{ ...blockedIpConfig, breadcrumb: "Blocked IP" }} item={viewItem} onClose={() => setViewItem(null)} /> : null}

      <AccountToast message={toast} />
    </AdminLayout>
  );
}

export default AdminSecurityAccessPage;
