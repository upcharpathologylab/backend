import { useEffect, useMemo, useState } from "react";
import AccountToast from "../components/account/AccountToast.jsx";
import AdminFilterCard from "../components/admin/common/AdminFilterCard.jsx";
import { AdminActionsCard, AdminDonutCard, AdminRecentCard, AdminTabs } from "../components/admin/common/AdminInsightCards.jsx";
import AdminDetailsModal from "../components/admin/common/AdminDetailsModal.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import { matchesAdminDateRange, useAdminDateRange } from "../components/admin/AdminDateFilter.jsx";
import AdminManagementFormModal from "../components/admin/common/AdminManagementFormModal.jsx";
import AdminManagementTable from "../components/admin/common/AdminManagementTable.jsx";
import AdminStatsGrid from "../components/admin/common/AdminStatsGrid.jsx";
import ConfirmDeleteModal from "../components/account/ConfirmDeleteModal.jsx";
import { getStoredAdminUser } from "../components/auth/authStorage.js";
import FormModal from "../components/profile/FormModal.jsx";
import {
  createAdminRole,
  createAdminUser,
  deleteAdminRole,
  deleteAdminUser,
  getAdminUserRoleManagement,
  resetAdminUserPassword,
  updateAdminRole,
  updateAdminUser
} from "../api/api.js";
import { isSuperAdminUser } from "../utils/adminPermissions.js";
import { roleTableConfig, userRoleBottom, userRoleFilters, userTableConfig } from "../data/adminSystemData.js";
import { Plus } from "lucide-react";

function defaultFilters() {
  return userRoleFilters.reduce((values, filter) => ({ ...values, [filter.key]: filter.defaultValue || "" }), {});
}

function allValue(value) {
  return !value || value.startsWith("All ") || value.startsWith("Select ");
}

function filterRows(rows, filters, tab, dateRangeValue) {
  const query = String(filters.query || "").trim().toLowerCase();
  const fields = tab === "users" ? ["userName", "email", "mobile", "role"] : ["roleName", "description", "permissions"];
  return rows.filter((row) => {
    const matchesQuery = !query || fields.some((field) => String(row[field] || "").toLowerCase().includes(query));
    const matchesRole = allValue(filters.role) || String(tab === "users" ? row.role : row.roleName) === filters.role;
    const matchesStatus = allValue(filters.status) || row.status === filters.status;
    const matchesDate = matchesAdminDateRange(row.createdOn, filters.createdOn || dateRangeValue);
    return matchesQuery && matchesRole && matchesStatus && matchesDate;
  });
}

function emptyPermissions(pages, types) {
  return pages.reduce((values, page) => {
    values[page] = types.reduce((actions, type) => ({ ...actions, [type]: false }), {});
    return values;
  }, {});
}

function AdminUsersRolesPage() {
  const adminDateRange = useAdminDateRange();
  const adminUser = getStoredAdminUser();
  const canManage = isSuperAdminUser(adminUser);
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [stats, setStats] = useState([]);
  const [usersByRole, setUsersByRole] = useState(userRoleBottom.donut);
  const [recentActivity, setRecentActivity] = useState([]);
  const [roleOptions, setRoleOptions] = useState(["All Roles"]);
  const [permissionPages, setPermissionPages] = useState([]);
  const [permissionTypes, setPermissionTypes] = useState(["view", "create", "edit", "delete"]);
  const [featureAccessOptions, setFeatureAccessOptions] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [formMode, setFormMode] = useState(null);
  const [formItem, setFormItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.title = "User & Role Management | Upchar Admin";
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminUserRoleManagement();
      setUsers(Array.isArray(data?.users) ? data.users : []);
      setRoles(Array.isArray(data?.roles) ? data.roles : []);
      setStats(Array.isArray(data?.stats) ? data.stats : []);
      setUsersByRole(data?.usersByRole || userRoleBottom.donut);
      setRecentActivity(Array.isArray(data?.recentActivity) ? data.recentActivity : []);
      setRoleOptions(Array.isArray(data?.roleOptions) ? data.roleOptions : ["All Roles"]);
      setPermissionPages(Array.isArray(data?.permissionPages) ? data.permissionPages : []);
      setPermissionTypes(Array.isArray(data?.permissionTypes) ? data.permissionTypes : ["view", "create", "edit", "delete"]);
      setFeatureAccessOptions(Array.isArray(data?.featureAccessOptions) ? data.featureAccessOptions : []);
    } catch (error) {
      showToast(error?.response?.data?.message || "Unable to load user management data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formRoleOptions = useMemo(() => roleOptions.filter((role) => !allValue(role)), [roleOptions]);

  const filterConfig = useMemo(
    () =>
      userRoleFilters.map((filter) => {
        if (filter.key === "role") return { ...filter, options: roleOptions };
        if (filter.key === "status") return { ...filter, options: ["All Status", "Active", "Inactive", "Suspended"] };
        return filter;
      }),
    [roleOptions]
  );

  const currentRows = activeTab === "users" ? users : roles;
  const currentConfig = useMemo(() => {
    const baseConfig = activeTab === "users" ? userTableConfig : roleTableConfig;
    return {
      ...baseConfig,
      totalCount: currentRows.length,
      totalLabel: String(currentRows.length),
      lastPageLabel: String(Math.max(1, Math.ceil(currentRows.length / 10))),
      actions: canManage ? ["view", "edit", "delete", "more"] : ["view"]
    };
  }, [activeTab, canManage, currentRows.length]);

  const currentForm = useMemo(() => {
    const permissionDefault = emptyPermissions(permissionPages, permissionTypes);
    if (formMode === "user") {
      return {
        breadcrumb: "User",
        addLabel: "Add New User",
        saveLabel: "Save User",
        formFields: [
          { key: "userName", label: "Full Name", required: true },
          { key: "email", label: "Email", required: true },
          { key: "mobile", label: "Mobile Number" },
          { key: "role", label: "Role", type: "select", options: formRoleOptions, required: true },
          ...(formItem ? [] : [{ key: "temporaryPassword", label: "Temporary Password", required: true }]),
          { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Suspended"], required: true },
          { key: "permissions", label: "Page Access", type: "permissionMatrix", rows: permissionPages, columns: permissionTypes, defaultValue: permissionDefault }
        ]
      };
    }

    return {
      breadcrumb: "Role",
      addLabel: "Add New Role",
      saveLabel: "Save Role",
      formFields: [
        { key: "roleName", label: "Role Name", required: true },
        { key: "description", label: "Description", type: "textarea", required: true },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], required: true },
        { key: "pageAccess", label: "Page Access", type: "permissionMatrix", rows: permissionPages, columns: permissionTypes, defaultValue: permissionDefault },
        { key: "featureAccess", label: "Feature Access", type: "featureAccess", options: featureAccessOptions }
      ]
    };
  }, [featureAccessOptions, formItem, formMode, formRoleOptions, permissionPages, permissionTypes]);

  const filteredRows = useMemo(() => filterRows(currentRows, filters, activeTab, adminDateRange.value), [activeTab, adminDateRange.value, currentRows, filters]);

  const saveItem = async (values) => {
    if (!canManage) {
      showToast("Access Denied");
      return;
    }

    try {
      if (formMode === "user") {
        const payload = { ...values, fullName: values.userName };
        const result = formItem?._id ? await updateAdminUser(formItem._id, payload) : await createAdminUser(payload);
        if (result?.credentials) setCredentials(result.credentials);
      } else {
        if (formItem?._id) await updateAdminRole(formItem._id, values);
        else await createAdminRole(values);
        setActiveTab("roles");
      }

      setFormMode(null);
      setFormItem(null);
      await loadData();
      showToast("Saved successfully.");
    } catch (error) {
      showToast(error?.response?.data?.message || "Unable to save changes.");
    }
  };

  const openEdit = (item) => {
    if (!canManage) {
      showToast("Access Denied");
      return;
    }
    setFormMode(activeTab === "users" ? "user" : "role");
    setFormItem(item);
  };

  const resetPassword = async (item) => {
    if (!canManage) {
      showToast("Access Denied");
      return;
    }

    const temporaryPassword = window.prompt("Temporary password");
    if (!temporaryPassword) return;

    try {
      const result = await resetAdminUserPassword(item._id, { temporaryPassword });
      if (result?.credentials) setCredentials(result.credentials);
      showToast("Password reset successfully.");
    } catch (error) {
      showToast(error?.response?.data?.message || "Unable to reset password.");
    }
  };

  const openDelete = (item) => {
    if (!canManage) {
      showToast("Access Denied");
      return;
    }
    if (activeTab === "roles" && String(item?.roleName || "").trim().toLowerCase() === "super admin") {
      showToast("Super Admin role cannot be deleted.");
      return;
    }
    setDeleteTarget(item);
  };

  const confirmDelete = async () => {
    if (!canManage) {
      setDeleteTarget(null);
      showToast("Access Denied");
      return;
    }

    if (!deleteTarget?._id) {
      setDeleteTarget(null);
      return;
    }

    try {
      const deletingRole = Boolean(deleteTarget.roleName);
      if (deletingRole) {
        if (String(deleteTarget.roleName || "").trim().toLowerCase() === "super admin") {
          setDeleteTarget(null);
          showToast("Super Admin role cannot be deleted.");
          return;
        }
        await deleteAdminRole(deleteTarget._id);
      } else {
        await deleteAdminUser(deleteTarget._id);
      }
      setDeleteTarget(null);
      await loadData();
      showToast(deletingRole ? "Role deleted successfully." : "User deleted successfully.");
    } catch (error) {
      showToast(error?.response?.data?.message || (deleteTarget.roleName ? "Unable to delete role." : "Unable to delete user."));
    }
  };

  const quickAction = (item) => {
    if (!canManage) {
      showToast("Access Denied");
      return;
    }
    if (item === "Add New User") {
      setFormMode("user");
      setFormItem(null);
      return;
    }
    if (item === "Add New Role" || item === "Role Management") {
      setFormMode("role");
      setFormItem(null);
      return;
    }
    if (item === "Manage Permissions") {
      setActiveTab("roles");
      showToast("Open a role to manage permissions.");
      return;
    }
    showToast(`${item} opened.`);
  };

  return (
    <AdminLayout topbarTitle="User & Role Management" topbarBadge={null}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <p className="text-sm font-semibold text-navy-700">
          <span className="font-black text-navy-950">Dashboard</span>
          <span className="px-2 text-navy-400">&gt;</span>
          User & Role Management
        </p>
        {canManage ? (
          <button type="button" onClick={() => { setFormMode("role"); setFormItem(null); }} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-upchar-green px-6 text-sm font-black text-white shadow-sm hover:bg-upchar-greenDark">
            <Plus className="h-5 w-5" />
            Add New Role
          </button>
        ) : null}
      </div>

      <div className="mt-7">
        <AdminStatsGrid stats={stats} />
      </div>

      <div className="mt-6">
        <AdminFilterCard
          filters={filterConfig}
          values={filters}
          onApply={() => showToast("Filters applied.")}
          onChange={setFilters}
          onReset={() => {
            setFilters(defaultFilters());
            showToast("Filters reset.");
          }}
        />
      </div>

      <section className="mt-6 rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
        <AdminTabs
          tabs={[{ key: "users", label: "Users" }, { key: "roles", label: "Roles" }]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <div className="mt-1">
          {loading ? (
            <div className="rounded-lg border border-blue-100 bg-white px-4 py-10 text-center text-sm font-black text-navy-600">Loading user management data...</div>
          ) : (
            <AdminManagementTable
              config={currentConfig}
              rows={filteredRows}
              onEdit={openEdit}
              onDelete={openDelete}
              onMore={(item) => (activeTab === "users" ? resetPassword(item) : openEdit(item))}
              onView={setViewItem}
            />
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <AdminDonutCard {...usersByRole} />
        <AdminRecentCard title="Recent Activity" link="View All" items={recentActivity} />
        <AdminActionsCard title="Quick Actions" items={userRoleBottom.actions} onAction={quickAction} />
      </div>

      {formMode ? (
        <AdminManagementFormModal
          config={currentForm}
          item={formItem}
          onClose={() => {
            setFormMode(null);
            setFormItem(null);
          }}
          onSave={saveItem}
        />
      ) : null}

      {viewItem ? <AdminDetailsModal config={{ ...currentConfig, breadcrumb: activeTab === "users" ? "User" : "Role" }} item={viewItem} onClose={() => setViewItem(null)} /> : null}

      {deleteTarget ? (
        <ConfirmDeleteModal
          title={deleteTarget.roleName ? "Delete Role" : "Delete User"}
          message={`Are you sure you want to delete ${
            deleteTarget.roleName ? deleteTarget.roleName || "this role" : deleteTarget.userName || deleteTarget.email || "this user"
          }? This action cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}

      {credentials ? (
        <FormModal title="Credentials Created" onClose={() => setCredentials(null)}>
          <div className="space-y-3 text-sm font-semibold text-navy-800">
            <p className="font-black text-navy-950">These credentials are shown once.</p>
            <p>Email: <span className="font-black">{credentials.email || "-"}</span></p>
            <p>Username: <span className="font-black">{credentials.username || "-"}</span></p>
            <p>Temporary Password: <span className="font-black">{credentials.temporaryPassword || "-"}</span></p>
          </div>
        </FormModal>
      ) : null}

      <AccountToast message={toast} />
    </AdminLayout>
  );
}

export default AdminUsersRolesPage;
