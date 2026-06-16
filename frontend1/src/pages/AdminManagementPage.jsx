import { useEffect, useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import AccountToast from "../components/account/AccountToast.jsx";
import ConfirmDeleteModal from "../components/account/ConfirmDeleteModal.jsx";
import AdminDetailsModal from "../components/admin/common/AdminDetailsModal.jsx";
import AdminFilterCard from "../components/admin/common/AdminFilterCard.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import AdminManagementFormModal from "../components/admin/common/AdminManagementFormModal.jsx";
import AdminManagementTable from "../components/admin/common/AdminManagementTable.jsx";
import AdminStatsGrid from "../components/admin/common/AdminStatsGrid.jsx";
import { createAdminResource, deleteAdminResource, getAdminResource, updateAdminResource } from "../api/api.js";

const formatCount = (value) => new Intl.NumberFormat("en-IN").format(value);
const formatRupees = (value) => `Rs. ${new Intl.NumberFormat("en-IN").format(Math.round(Number(value || 0)))}`;

const numberFromText = (value) => {
  const match = String(value || "").match(/\d+/);
  return match ? Number(match[0]) : 0;
};

function statsForConfig(config, rows) {
  if (config.apiResource === "coupons") {
    const active = rows.filter((row) => row.status === "Active").length;
    const inactive = rows.filter((row) => row.status === "Inactive").length;
    const expired = rows.filter((row) => row.status === "Expired").length;
    const used = rows.reduce((sum, row) => sum + Number(row.used || 0), 0);
    return [
      { title: "Total Coupons", value: formatCount(rows.length), text: "All time", icon: "ticket", color: "green" },
      { title: "Active Coupons", value: formatCount(active), text: "Currently active", icon: "tag", color: "blue" },
      { title: "Inactive Coupons", value: formatCount(inactive), text: "Currently inactive", icon: "pause", color: "orange" },
      { title: "Expired Coupons", value: formatCount(expired), text: "Validity ended", icon: "percent", color: "purple" },
      { title: "Redemptions", value: formatCount(used), text: "All time", icon: "gift", color: "green" }
    ];
  }

  if (config.apiResource !== "packages") return config.stats;

  const active = rows.filter((row) => row.status === "Active").length;
  const inactive = rows.filter((row) => row.status === "Inactive").length;
  const totalTests = rows.reduce((sum, row) => sum + numberFromText(row.testsIncluded || row.testCount), 0);
  const totalValue = rows.reduce((sum, row) => sum + Number(row.finalPrice || row.discountedPrice || 0), 0);

  return [
    { title: "Total Packages", value: formatCount(rows.length), text: "All time", icon: "gift", color: "green" },
    { title: "Active Packages", value: formatCount(active), text: "Enabled", icon: "box", color: "blue" },
    { title: "Inactive Packages", value: formatCount(inactive), text: "Disabled", icon: "pause", color: "orange" },
    { title: "Total Tests in Packages", value: formatCount(totalTests), text: "All Packages", icon: "tag", color: "purple" },
    { title: "Total Package Value", value: formatRupees(totalValue), text: "Current catalog", icon: "rupee", color: "cyan" }
  ];
}

function getDefaultFilters(filters) {
  return filters.reduce((values, filter) => {
    if (filter.type === "priceRange") {
      values.minPrice = "";
      values.maxPrice = "";
    } else {
      values[filter.key] = filter.defaultValue || "";
    }
    return values;
  }, {});
}

function isAllValue(value) {
  return !value || value === "All" || value.startsWith("All ");
}

function matchesFilter(row, key, value) {
  if (isAllValue(value)) return true;
  if (key === "testCount") {
    return value === "100+ Tests" ? Number(row.totalTests || 0) >= 100 : Number(row.totalTests || 0) < 100;
  }
  return String(row[key] || "") === value;
}

function AdminManagementPage({ config }) {
  const [rows, setRows] = useState(() => (config.apiResource ? [] : config.rows));
  const [filters, setFilters] = useState(() => getDefaultFilters(config.filters));
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [formItem, setFormItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  useEffect(() => {
    let mounted = true;
    document.title = `${config.title} | Upchar Admin`;

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
    setRows([]);
    getAdminResource(config.apiResource)
      .then((data) => {
        if (mounted) setRows(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setRows([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [config]);

  const filteredRows = useMemo(() => {
    const query = String(filters.query || "").trim().toLowerCase();
    const minPrice = filters.minPrice === undefined || filters.minPrice === "" ? null : Number(filters.minPrice);
    const maxPrice = filters.maxPrice === undefined || filters.maxPrice === "" ? null : Number(filters.maxPrice);

    return rows.filter((row) => {
      const matchesQuery = !query || config.searchFields.some((key) => String(row[key] || "").toLowerCase().includes(query));
      const matchesPriceMin = minPrice === null || Number(row[config.priceField] || 0) >= minPrice;
      const matchesPriceMax = maxPrice === null || Number(row[config.priceField] || 0) <= maxPrice;
      const matchesSelects = config.filters
        .filter((filter) => filter.type === "select")
        .every((filter) => matchesFilter(row, filter.key, filters[filter.key]));

      return matchesQuery && matchesPriceMin && matchesPriceMax && matchesSelects;
    });
  }, [config, filters, rows]);

  const saveItem = async (values) => {
    const recordId = String(values._id || values.id || "");
    const exists = rows.some((row) => String(row._id || row.id) === recordId);
    if (config.apiResource) {
      try {
        const saved = exists && recordId
          ? await updateAdminResource(config.apiResource, values._id || values.id, values)
          : await createAdminResource(config.apiResource, values);

        setRows((current) => {
          if (exists) return current.map((row) => (String(row._id || row.id) === recordId ? saved : row));
          return [saved, ...current];
        });
        setFormItem(null);
        setShowAddForm(false);
        showToast(exists ? `${config.breadcrumb} updated successfully.` : `${config.breadcrumb} added successfully.`);
      } catch {
        showToast("Could not save. Please check login and backend connection.");
      }
      return;
    }

    setRows((current) => {
      if (exists) return current.map((row) => (row.id === values.id ? values : row));
      return [values, ...current];
    });
    setFormItem(null);
    setShowAddForm(false);
    showToast(exists ? `${config.breadcrumb} updated successfully.` : `${config.breadcrumb} added successfully.`);
  };

  const copyItem = async (item) => {
    const copy = { ...item, id: Date.now() };
    if (copy.couponCode) copy.couponCode = `${copy.couponCode}_COPY`;
    if (copy.couponName) copy.couponName = `${copy.couponName} Copy`;
    if (config.apiResource) {
      delete copy._id;
      try {
        const saved = await createAdminResource(config.apiResource, copy);
        setRows((current) => [saved, ...current]);
        showToast("Coupon duplicated successfully.");
      } catch {
        showToast("Could not duplicate. Please check login and backend connection.");
      }
      return;
    }
    setRows((current) => [copy, ...current]);
    showToast("Coupon duplicated successfully.");
  };

  const confirmDelete = async () => {
    if (config.apiResource) {
      const targetId = String(deleteTarget._id || deleteTarget.id || "");

      if (!targetId) {
        setRows((current) => current.filter((row) => String(row._id || row.id || "") !== targetId));
        setDeleteTarget(null);
        showToast("Item removed from the current list.");
        return;
      }

      try {
        await deleteAdminResource(config.apiResource, targetId);
        setRows((current) => current.filter((row) => String(row._id || row.id) !== targetId));
        setDeleteTarget(null);
        showToast("Item deleted successfully.");
      } catch {
        showToast("Could not delete. Please check login and backend connection.");
      }
      return;
    }

    setRows((current) => current.filter((row) => row.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast("Item deleted successfully.");
  };

  return (
    <AdminLayout topbarTitle={config.title} topbarBadge={null}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <p className="text-sm font-semibold text-navy-700">
          <span className="font-black text-navy-950">Dashboard</span>
          <span className="px-2 text-navy-400">&gt;</span>
          {config.breadcrumb}
        </p>
        <div className="flex flex-wrap gap-3">
          {config.exportLabel ? (
            <button type="button" onClick={() => showToast(`${config.breadcrumb} export started.`)} className="inline-flex h-12 items-center gap-2 rounded-md border border-upchar-green px-6 text-sm font-black text-upchar-green">
              <Download className="h-5 w-5" />
              {config.exportLabel}
            </button>
          ) : null}
          <button type="button" onClick={() => setShowAddForm(true)} className="inline-flex h-12 items-center gap-2 rounded-md bg-upchar-green px-6 text-sm font-black text-white shadow-sm hover:bg-upchar-greenDark">
            <Plus className="h-5 w-5" />
            {config.addLabel}
          </button>
        </div>
      </div>

      <div className="mt-7">
        <AdminStatsGrid stats={statsForConfig(config, rows)} />
      </div>

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

      <div className="mt-6">
        {loading ? (
          <section className="rounded-lg border border-blue-100 bg-white p-10 text-center text-sm font-black text-navy-600 shadow-sm">Loading {config.breadcrumb.toLowerCase()}...</section>
        ) : (
          <AdminManagementTable
            config={config}
            rows={filteredRows}
            totalCount={rows.length}
            onCopy={copyItem}
            onDelete={setDeleteTarget}
            onEdit={setFormItem}
            onView={setViewItem}
          />
        )}
      </div>

      {config.infoCard ? (
        <section className="mt-6 rounded-lg border border-green-100 bg-green-50/70 p-5 shadow-sm">
          <h2 className="text-base font-black text-navy-950">{config.infoCard.title}</h2>
          <p className="mt-2 text-sm font-semibold leading-7 text-navy-700">{config.infoCard.text}</p>
        </section>
      ) : null}

      {(showAddForm || formItem) ? (
        <AdminManagementFormModal
          config={config}
          item={formItem}
          onClose={() => {
            setFormItem(null);
            setShowAddForm(false);
          }}
          onSave={saveItem}
        />
      ) : null}

      {viewItem ? <AdminDetailsModal config={config} item={viewItem} onClose={() => setViewItem(null)} /> : null}

      {deleteTarget ? (
        <ConfirmDeleteModal
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}

      <AccountToast message={toast} />
    </AdminLayout>
  );
}

export default AdminManagementPage;
