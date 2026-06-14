import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Download, Eye, FileText, Plus } from "lucide-react";
import AccountToast from "../components/account/AccountToast.jsx";
import ConfirmDeleteModal from "../components/account/ConfirmDeleteModal.jsx";
import AdminDetailsModal from "../components/admin/common/AdminDetailsModal.jsx";
import AdminFilterCard from "../components/admin/common/AdminFilterCard.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import { matchesAdminDateRange, useAdminDateRange } from "../components/admin/AdminDateFilter.jsx";
import AdminManagementFormModal from "../components/admin/common/AdminManagementFormModal.jsx";
import AdminManagementTable from "../components/admin/common/AdminManagementTable.jsx";
import AdminStatsGrid from "../components/admin/common/AdminStatsGrid.jsx";
import { assetUrl, createAdminResource, deleteAdminResource, getAdminResource, getPageContent, importGoogleReviews, savePageContent, updateAdminResource } from "../api/api.js";

function getDefaultFilters(filters) {
  return filters.reduce((values, filter) => {
    values[filter.key] = filter.defaultValue || "";
    return values;
  }, {});
}

function isAllValue(value) {
  return !value || value === "All" || value.startsWith("All ") || value.startsWith("Select ");
}

function matchesDateFilter(row, filter, value) {
  if (!value) return true;
  const target = filter.matchKey || filter.key;
  return matchesAdminDateRange(row[target], value);
}

function recordLabel(config, item) {
  return item[config.idField] || item.paymentId || item.invoiceId || item.prescriptionId || item.bannerTitle || item.customerName || item.user || "record";
}

function recordKey(item) {
  return item?._id || item?.id;
}

function downloadCsv(config, rows) {
  const columns = config.csvColumns || config.columns;
  const header = columns.map((column) => column.label).join(",");
  const body = rows.map((row) =>
    columns
      .map((column) => {
        const value = String(row[column.key] ?? "").replaceAll("\"", "\"\"");
        return `"${value}"`;
      })
      .join(",")
  );
  const csv = [header, ...body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = config.exportFileName || `${config.breadcrumb.toLowerCase().replaceAll(" ", "-")}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function DonutCard({ card }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-navy-950">{card.title}</h2>
      <div className="mt-5 flex items-center gap-5">
        <div className={`relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full ${card.chart}`}>
          <div className="h-16 w-16 rounded-full bg-white shadow-sm" />
        </div>
        <div className="grid flex-1 gap-3">
          {card.segments.map((item) => (
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
  );
}

function ListCard({ card }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-navy-950">{card.title}</h2>
        {card.link ? <span className="text-xs font-black text-upchar-blue">{card.link}</span> : null}
      </div>
      <div className="mt-4 grid gap-3">
        {card.items.map(([label, value], index) => (
          <div className="flex items-center justify-between gap-3 text-sm font-semibold text-navy-800" key={label}>
            <span>{index + 1}. {label}</span>
            <span className="font-black">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentCard({ card }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-navy-950">{card.title}</h2>
        {card.link ? <span className="text-xs font-black text-upchar-blue">{card.link}</span> : null}
      </div>
      <div className="mt-4 grid gap-4">
        {card.items.map(([title, text]) => (
          <article className="flex items-center gap-3" key={`${title}-${text}`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-black text-navy-900">
              {title.split(" ").map((part) => part[0]).join("").slice(0, 2)}
            </span>
            <span>
              <span className="block text-sm font-black text-navy-950">{title}</span>
              <span className="block text-xs font-semibold leading-5 text-navy-600">{text}</span>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActionsCard({ card, onAction }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-navy-950">{card.title}</h2>
      <div className="mt-4 grid gap-2">
        {card.items.map((item) => (
          <button
            type="button"
            className="flex min-h-11 items-center justify-between gap-3 rounded-md px-3 text-left text-sm font-black text-navy-900 transition hover:bg-blue-50"
            key={item}
            onClick={() => onAction(item)}
          >
            {item}
            <ChevronRight className="h-4 w-4 text-navy-500" />
          </button>
        ))}
      </div>
    </section>
  );
}

function UploadsCard({ card }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-navy-950">{card.title}</h2>
        {card.link ? <span className="text-xs font-black text-upchar-blue">{card.link}</span> : null}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {card.items.map(([file, name, date, size]) => (
          <article className="flex items-center gap-4 rounded-lg border border-blue-100 bg-white p-4 shadow-sm" key={file}>
            <span className="flex h-24 w-16 shrink-0 items-center justify-center rounded-md border border-blue-100 bg-slate-50 text-upchar-blue">
              <FileText className="h-8 w-8" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-black text-navy-950">{file}</span>
              <span className="mt-1 block text-xs font-semibold text-navy-600">{name}</span>
              <span className="block text-xs font-semibold text-navy-500">{date}</span>
              <span className="block text-xs font-semibold text-navy-500">{size}</span>
            </span>
            <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-upchar-blue ring-1 ring-blue-100" aria-label={`View ${file}`}>
              <Eye className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function BarsCard({ card }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-navy-950">{card.title}</h2>
      <div className="mt-5 grid gap-4">
        {card.items.map(([label, value, width]) => (
          <div className="grid gap-2" key={label}>
            <div className="flex items-center justify-between text-xs font-black text-navy-800">
              <span>{label}</span>
              <span>{value}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-upchar-blue" style={{ width }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RevenueCard({ card }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 text-center shadow-sm">
      <h2 className="text-lg font-black text-navy-950">{card.title}</h2>
      <p className="mt-5 text-3xl font-black text-navy-950">{card.total}</p>
      <p className="mt-1 text-sm font-semibold text-navy-600">Total Revenue</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-md bg-green-50 p-4">
          <p className="text-lg font-black text-upchar-green">{card.received}</p>
          <p className="mt-1 text-xs font-black text-upchar-green">Received</p>
        </div>
        <div className="rounded-md bg-orange-50 p-4">
          <p className="text-lg font-black text-upchar-orange">{card.outstanding}</p>
          <p className="mt-1 text-xs font-black text-upchar-orange">Outstanding</p>
        </div>
      </div>
    </section>
  );
}

function BottomCards({ cards, onAction }) {
  if (!cards?.length) return null;

  const gridClass = cards.length === 1 ? "grid-cols-1" : cards.length === 3 ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-4";
  return (
    <div className={`mt-6 grid gap-5 ${gridClass}`}>
      {cards.map((card) => {
        if (card.type === "donut") return <DonutCard card={card} key={card.title} />;
        if (card.type === "list") return <ListCard card={card} key={card.title} />;
        if (card.type === "recent") return <RecentCard card={card} key={card.title} />;
        if (card.type === "actions") return <ActionsCard card={card} key={card.title} onAction={onAction} />;
        if (card.type === "uploads") return <UploadsCard card={card} key={card.title} />;
        if (card.type === "bars") return <BarsCard card={card} key={card.title} />;
        if (card.type === "revenue") return <RevenueCard card={card} key={card.title} />;
        return null;
      })}
    </div>
  );
}

function AdminRecordsPage({ config }) {
  const adminDateRange = useAdminDateRange();
  const [rows, setRows] = useState(() => (config.apiResource ? [] : config.rows));
  const [filters, setFilters] = useState(() => getDefaultFilters(config.filters));
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [formItem, setFormItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [googlePlaceId, setGooglePlaceId] = useState("");
  const [importingReviews, setImportingReviews] = useState(false);
  const [homeContentSections, setHomeContentSections] = useState([]);
  const [testimonialSummary, setTestimonialSummary] = useState({
    title: "",
    subtitle: "",
    totalReviewsText: "",
    happyCustomersText: "",
    recommendPercentage: ""
  });
  const [savingSummary, setSavingSummary] = useState(false);

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

    if (config.apiResource === "testimonials") {
      getPageContent("home").then((data) => {
        if (!mounted) return;
        const sections = Array.isArray(data?.sections) ? data.sections : [];
        const testimonialSection = sections.find((section) => section.sectionKey === "testimonials") || {};
        const settings = testimonialSection.settings || {};
        setHomeContentSections(sections);
        setTestimonialSummary({
          title: testimonialSection.title || "Google",
          subtitle: testimonialSection.subtitle || "Reviews",
          totalReviewsText: settings.totalReviewsText || "10K+ Reviews",
          happyCustomersText: settings.happyCustomersText || "10K+",
          recommendPercentage: settings.recommendPercentage || "98%"
        });
      }).catch(() => {});
    }

    return () => {
      mounted = false;
    };
  }, [config]);

  const filteredRows = useMemo(() => {
    const query = String(filters.query || "").trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery = !query || config.searchFields.some((key) => String(row[key] || "").toLowerCase().includes(query));
      const matchesSelects = config.filters
        .filter((filter) => filter.type === "select")
        .every((filter) => isAllValue(filters[filter.key]) || String(row[filter.key] || "") === filters[filter.key]);
      const matchesDates = config.filters
        .filter((filter) => filter.type === "date")
        .every((filter) => matchesDateFilter(row, filter, filters[filter.key] || adminDateRange.value));

      return matchesQuery && matchesSelects && matchesDates;
    });
  }, [adminDateRange.value, config, filters, rows]);

  const displayStats = useMemo(() => {
    if (config.apiResource !== "prescriptions") return config.stats;

    const countByStatus = (status) => rows.filter((row) => row.status === status).length;
    return [
      { title: "Total Prescriptions", value: String(rows.length), text: "From user uploads", icon: "file", color: "green" },
      { title: "Pending", value: String(countByStatus("Pending")), text: "Needs review", icon: "clock", color: "orange" },
      { title: "Reviewed", value: String(countByStatus("Reviewed")), text: "Checked by admin", icon: "fileUpload", color: "blue", tone: "green" },
      { title: "Completed", value: String(countByStatus("Completed")), text: "Action completed", icon: "check", color: "purple" }
    ];
  }, [config, rows]);

  const buildRecord = (values) => {
    const incomingKey = values._id || values.id;
    const existing = rows.find((row) => recordKey(row) === incomingKey);
    const id = values.id || existing?.id || Date.now();
    const record = { ...(config.defaultRowValues || {}), ...(existing || {}), ...values, id };
    if (config.idField && !record[config.idField]) {
      record[config.idField] = `${config.idPrefix || "ADM"}${String(id).slice(-6)}`;
    }
    if (record.rating && !record.ratingLabel) {
      record.ratingLabel = Number(record.rating) === 1 ? "1 Star" : `${record.rating} Stars`;
    }
    if (record.displayedOn === "None") {
      record.displayedOn = "-";
    }
    return record;
  };

  const saveItem = async (values) => {
    const record = buildRecord(values);
    const targetKey = record._id || record.id;
    const exists = rows.some((row) => recordKey(row) === targetKey);

    if (config.apiResource) {
      try {
        const saved = exists && targetKey
          ? await updateAdminResource(config.apiResource, targetKey, record)
          : await createAdminResource(config.apiResource, record);

        setRows((current) => (exists ? current.map((row) => (recordKey(row) === targetKey ? saved : row)) : [saved, ...current]));
        setFormItem(null);
        setShowAddForm(false);
        showToast(exists ? `${config.breadcrumb} updated successfully.` : `${config.breadcrumb} added successfully.`);
      } catch {
        showToast("Could not save. Please check login and backend connection.");
      }
      return;
    }

    setRows((current) => (exists ? current.map((row) => (recordKey(row) === targetKey ? record : row)) : [record, ...current]));
    setFormItem(null);
    setShowAddForm(false);
    showToast(exists ? `${config.breadcrumb} updated successfully.` : `${config.breadcrumb} added successfully.`);
  };

  const confirmDelete = async () => {
    if (config.apiResource) {
      const targetKey = recordKey(deleteTarget);

      if (!targetKey) {
        setRows((current) => current.filter((row) => recordKey(row) !== targetKey));
        setDeleteTarget(null);
        showToast("Item removed from the current list.");
        return;
      }

      try {
        await deleteAdminResource(config.apiResource, targetKey);
        setRows((current) => current.filter((row) => recordKey(row) !== targetKey));
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

  const exportRecords = () => {
    downloadCsv(config, filteredRows);
    showToast(`${config.exportLabel || "Export"} downloaded.`);
  };

  const downloadRecord = (item) => {
    if (config.apiResource === "prescriptions" && item.prescriptionFile) {
      window.open(assetUrl(item.prescriptionFile), "_blank", "noopener,noreferrer");
      showToast(`${recordLabel(config, item)} opened.`);
      return;
    }
    showToast(`${recordLabel(config, item)} download started.`);
  };

  const openWhatsApp = (item) => {
    if (!item.whatsappUrl) {
      showToast("WhatsApp number is not available for this record.");
      return;
    }
    window.open(item.whatsappUrl, "_blank", "noopener,noreferrer");
    showToast(`WhatsApp opened for ${recordLabel(config, item)}.`);
  };

  const importReviews = async () => {
    if (!googlePlaceId.trim()) {
      showToast("Enter a Google Place ID first.");
      return;
    }
    try {
      setImportingReviews(true);
      const result = await importGoogleReviews(googlePlaceId.trim());
      setRows(Array.isArray(result.data) ? result.data : []);
      showToast(result.message || "Google reviews imported.");
    } catch (error) {
      showToast(error?.response?.data?.message || "Could not import Google reviews.");
    } finally {
      setImportingReviews(false);
    }
  };

  const saveTestimonialSummary = async () => {
    const sections = homeContentSections.map((section) =>
      section.sectionKey === "testimonials"
        ? {
            ...section,
            title: testimonialSummary.title,
            subtitle: testimonialSummary.subtitle,
            settings: {
              ...(section.settings || {}),
              totalReviewsText: testimonialSummary.totalReviewsText,
              happyCustomersText: testimonialSummary.happyCustomersText,
              recommendPercentage: testimonialSummary.recommendPercentage
            }
          }
        : section
    );
    try {
      setSavingSummary(true);
      const saved = await savePageContent("home", sections);
      setHomeContentSections(Array.isArray(saved?.sections) ? saved.sections : sections);
      showToast("Testimonials summary updated successfully.");
    } catch {
      showToast("Could not save testimonials summary.");
    } finally {
      setSavingSummary(false);
    }
  };

  return (
    <AdminLayout topbarTitle={config.title} topbarBadge={null}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <p className="text-sm font-semibold text-navy-700">
          <span className="font-black text-navy-950">Dashboard</span>
          <span className="px-2 text-navy-400">&gt;</span>
          {config.breadcrumb}
        </p>
        {config.exportLabel ? (
          <button type="button" onClick={exportRecords} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-upchar-green px-6 text-sm font-black text-white shadow-sm hover:bg-upchar-greenDark">
            <Download className="h-5 w-5" />
            {config.exportLabel}
          </button>
        ) : null}
        {config.apiResource === "testimonials" ? (
          <div className="flex flex-wrap gap-2">
            <input
              value={googlePlaceId}
              onChange={(event) => setGooglePlaceId(event.target.value)}
              placeholder="Google Place ID"
              className="h-12 rounded-md border border-blue-100 px-4 text-sm font-semibold text-navy-900 outline-none focus:border-upchar-blue"
            />
            <button type="button" onClick={importReviews} disabled={importingReviews} className="inline-flex h-12 items-center justify-center rounded-md bg-upchar-blue px-6 text-sm font-black text-white disabled:opacity-60">
              {importingReviews ? "Importing..." : "Import Reviews"}
            </button>
          </div>
        ) : null}
        {config.addLabel ? (
          <button type="button" onClick={() => setShowAddForm(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-upchar-green px-6 text-sm font-black text-white shadow-sm hover:bg-upchar-greenDark">
            <Plus className="h-5 w-5" />
            {config.addLabel}
          </button>
        ) : null}
      </div>

      <div className="mt-7">
        <AdminStatsGrid stats={displayStats} />
      </div>

      {config.apiResource === "testimonials" ? (
        <section className="mt-6 rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-navy-950">Homepage Reviews Summary</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              ["title", "Section Title"],
              ["subtitle", "Section Subtitle"],
              ["totalReviewsText", "Total Reviews Text"],
              ["happyCustomersText", "Happy Customers Text / Count"],
              ["recommendPercentage", "Recommend Percentage"]
            ].map(([key, label]) => (
              <label className="grid gap-2 text-sm font-black text-navy-900" key={key}>
                {label}
                <input
                  value={testimonialSummary[key]}
                  onChange={(event) => setTestimonialSummary((current) => ({ ...current, [key]: event.target.value }))}
                  className="h-11 rounded-md border border-blue-100 bg-white px-4 text-sm font-semibold text-navy-900 outline-none transition focus:border-upchar-blue"
                />
              </label>
            ))}
          </div>
          <button type="button" onClick={saveTestimonialSummary} disabled={savingSummary || !homeContentSections.length} className="mt-4 inline-flex h-11 items-center justify-center rounded-md bg-upchar-green px-6 text-sm font-black text-white disabled:opacity-60">
            {savingSummary ? "Saving..." : "Save Summary"}
          </button>
        </section>
      ) : null}

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
            onDelete={setDeleteTarget}
            onDownload={downloadRecord}
            onEdit={setFormItem}
            onMore={(item) => showToast(`More actions opened for ${recordLabel(config, item)}.`)}
            onView={setViewItem}
            onWhatsApp={openWhatsApp}
          />
        )}
      </div>

      <BottomCards cards={config.bottomCards} onAction={(item) => showToast(`${item} action opened.`)} />

      {(showAddForm || formItem) && config.formFields ? (
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

export default AdminRecordsPage;
