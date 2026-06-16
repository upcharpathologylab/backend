import { useEffect, useMemo, useState } from "react";
import { Eye, Image, PencilLine, Plus, Power, Trash2, Upload } from "lucide-react";
import AccountToast from "../components/account/AccountToast.jsx";
import ConfirmDeleteModal from "../components/account/ConfirmDeleteModal.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import { assetUrl, createAdminResource, deleteAdminResource, getAdminResource, updateAdminResource, uploadContentImage } from "../api/api.js";

const emptyBanner = {
  bannerTitle: "",
  bannerImage: "",
  status: "Active",
  sortOrder: 1,
  headingLine1: "",
  headingHighlightText: "",
  description: "",
  feature1: "Accurate Reports",
  feature2: "Affordable Prices",
  feature3: "Home Sample Collection",
  feature4: "Fast Report Delivery",
  primaryButtonText: "Book Test Now",
  primaryButtonUrl: "#booking",
  secondaryButtonText: "View Packages",
  secondaryButtonUrl: "#packages",
  offerText: "UP TO 60% OFF",
  offerHighlightText: "selected health packages"
};

const fieldGroups = [
  {
    title: "Basic Information",
    fields: [
      ["bannerTitle", "Banner Title", "text", true],
      ["bannerImage", "Banner Image", "image", true],
      ["status", "Status", "select", true],
      ["sortOrder", "Sort Order", "number", true]
    ]
  },
  {
    title: "Hero Content",
    fields: [
      ["headingLine1", "Heading Line 1", "text", true],
      ["headingHighlightText", "Heading Highlight Text", "text"],
      ["description", "Description", "textarea", true]
    ]
  },
  {
    title: "Feature Items",
    fields: [
      ["feature1", "Feature 1", "text"],
      ["feature2", "Feature 2", "text"],
      ["feature3", "Feature 3", "text"],
      ["feature4", "Feature 4", "text"]
    ]
  },
  {
    title: "Buttons",
    fields: [
      ["primaryButtonText", "Primary Button Text", "text"],
      ["primaryButtonUrl", "Primary Button URL", "text"],
      ["secondaryButtonText", "Secondary Button Text", "text"],
      ["secondaryButtonUrl", "Secondary Button URL", "text"]
    ]
  },
  {
    title: "Offer Section",
    fields: [
      ["offerText", "Offer Text", "text"],
      ["offerHighlightText", "Offer Highlight Text", "text"]
    ]
  }
];

const inputClass = "h-11 w-full rounded-md border border-blue-100 bg-white px-3 text-sm font-semibold text-navy-900 outline-none transition focus:border-upchar-blue";
const textAreaClass = "min-h-24 w-full rounded-md border border-blue-100 bg-white px-3 py-3 text-sm font-semibold text-navy-900 outline-none transition focus:border-upchar-blue";

function BannerForm({ item, onClose, onSave }) {
  const [values, setValues] = useState(() => ({ ...emptyBanner, ...(item || {}) }));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  const uploadImage = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      const result = await uploadContentImage(file);
      update("bannerImage", result.imageUrl || result.url || "");
    } catch (uploadError) {
      setError(uploadError?.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!values.bannerTitle.trim() || !values.headingLine1.trim() || !values.description.trim() || !values.bannerImage.trim()) {
      setError("Banner title, image, heading and description are required.");
      return;
    }
    setSaving(true);
    await onSave({
      ...values,
      sortOrder: Number(values.sortOrder || 0),
      bannerDescription: values.description,
      linkUrl: values.primaryButtonUrl,
      buttonText: values.primaryButtonText
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-navy-950/70 p-4">
      <form className="max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-y-auto rounded-lg bg-white p-5 shadow-card" onSubmit={submit}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-navy-950">{item ? "Edit Banner" : "Add Banner"}</h2>
          <button type="button" className="h-10 rounded-md border border-blue-100 px-4 text-sm font-black text-navy-800" onClick={onClose}>
            Close
          </button>
        </div>

        {error ? <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-black text-upchar-red">{error}</p> : null}

        <div className="mt-5 grid gap-5">
          {fieldGroups.map((group) => (
            <section className="rounded-lg border border-blue-100 p-4" key={group.title}>
              <h3 className="text-base font-black text-navy-950">{group.title}</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {group.fields.map(([key, label, type, required]) => (
                  <label className={type === "textarea" || type === "image" ? "md:col-span-2" : ""} key={key}>
                    <span className="mb-2 block text-sm font-black text-navy-900">{label}{required ? " *" : ""}</span>
                    {type === "textarea" ? (
                      <textarea className={textAreaClass} value={values[key] || ""} onChange={(event) => update(key, event.target.value)} />
                    ) : type === "select" ? (
                      <select className={inputClass} value={values[key] || "Active"} onChange={(event) => update(key, event.target.value)}>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    ) : type === "image" ? (
                      <div className="grid gap-3 rounded-md border border-blue-100 p-3">
                        {assetUrl(values.bannerImage) ? <img src={assetUrl(values.bannerImage)} alt="Banner preview" className="h-44 w-full rounded-md object-cover" /> : null}
                        <div className="flex flex-wrap gap-3">
                          <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-upchar-blue px-4 text-sm font-black text-white">
                            <Upload className="h-4 w-4" />
                            {uploading ? "Uploading..." : "Upload Image"}
                            <input className="hidden" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={(event) => uploadImage(event.target.files?.[0])} />
                          </label>
                          <input className={`${inputClass} min-w-[260px] flex-1`} value={values.bannerImage || ""} onChange={(event) => update("bannerImage", event.target.value)} placeholder="Uploaded image URL" />
                        </div>
                      </div>
                    ) : (
                      <input className={inputClass} type={type} value={values[key] || ""} onChange={(event) => update(key, event.target.value)} />
                    )}
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button type="button" className="h-11 rounded-md border border-blue-100 px-6 text-sm font-black text-navy-800" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={saving || uploading} className="h-11 rounded-md bg-upchar-green px-6 text-sm font-black text-white disabled:opacity-60">
            {saving ? "Saving..." : "Save Banner"}
          </button>
        </div>
      </form>
    </div>
  );
}

function AdminHomepageBannersPage() {
  const [banners, setBanners] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [formItem, setFormItem] = useState(null);
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [preview, setPreview] = useState(null);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const loadBanners = () => {
    setLoading(true);
    getAdminResource("homepage-banners")
      .then((data) => setBanners(Array.isArray(data) ? data : []))
      .catch(() => {
        setBanners([]);
        showToast("Could not load banners. Please check login and backend connection.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    document.title = "Homepage Banner Management | Upchar Admin";
    loadBanners();
  }, []);

  const filteredBanners = useMemo(() => {
    const search = query.trim().toLowerCase();
    return banners
      .filter((banner) => !search || [banner.bannerTitle, banner.headingLine1, banner.description].some((value) => String(value || "").toLowerCase().includes(search)))
      .filter((banner) => status === "All Status" || banner.status === status)
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  }, [banners, query, status]);

  const stats = useMemo(() => {
    const active = banners.filter((banner) => banner.status === "Active").length;
    const inactive = banners.filter((banner) => banner.status === "Inactive").length;
    return [
      ["Total Banners", banners.length],
      ["Active Banners", active],
      ["Inactive Banners", inactive],
      ["First Sort Order", filteredBanners[0]?.sortOrder ?? "-"]
    ];
  }, [banners, filteredBanners]);

  const saveBanner = async (values) => {
    try {
      const saved = values._id || values.id
        ? await updateAdminResource("homepage-banners", values._id || values.id, values)
        : await createAdminResource("homepage-banners", values);
      setBanners((current) => (values._id || values.id ? current.map((banner) => ((banner._id || banner.id) === (values._id || values.id) ? saved : banner)) : [saved, ...current]));
      setFormItem(null);
      setAdding(false);
      showToast("Banner saved successfully.");
    } catch {
      showToast("Could not save banner.");
    }
  };

  const toggleStatus = async (banner) => {
    const nextStatus = banner.status === "Active" ? "Inactive" : "Active";
    try {
      const saved = await updateAdminResource("homepage-banners", banner._id || banner.id, { ...banner, status: nextStatus });
      setBanners((current) => current.map((item) => ((item._id || item.id) === (banner._id || banner.id) ? saved : item)));
      showToast(`Banner ${nextStatus === "Active" ? "activated" : "deactivated"}.`);
    } catch {
      showToast("Could not update banner status.");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteAdminResource("homepage-banners", deleteTarget._id || deleteTarget.id);
      setBanners((current) => current.filter((banner) => (banner._id || banner.id) !== (deleteTarget._id || deleteTarget.id)));
      setDeleteTarget(null);
      showToast("Banner deleted successfully.");
    } catch {
      showToast("Could not delete banner.");
    }
  };

  return (
    <AdminLayout topbarTitle="Homepage Banner Management" topbarBadge={null}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm font-semibold text-navy-700"><span className="font-black text-navy-950">Dashboard</span><span className="px-2 text-navy-400">&gt;</span>Homepage Banners</p>
        <button type="button" onClick={() => setAdding(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-upchar-green px-6 text-sm font-black text-white shadow-sm hover:bg-upchar-greenDark">
          <Plus className="h-5 w-5" />
          Add Banner
        </button>
      </div>

      <section className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm" key={label}>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-green-50 text-upchar-green"><Image className="h-7 w-7" /></span>
              <span><span className="block text-sm font-black text-navy-600">{label}</span><span className="mt-1 block text-3xl font-black text-navy-950">{value}</span></span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <input className={inputClass} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search banners..." />
          <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-navy-950">All Banners ({filteredBanners.length})</h2>
        <div className="mt-5 max-w-full overflow-x-auto">
          <table className="w-full min-w-[1180px] border-separate border-spacing-0 text-left text-sm font-semibold text-navy-900">
            <thead>
              <tr className="text-sm font-black text-navy-900">
                {["#", "Image", "Banner Title", "Heading", "Status", "Sort Order", "Primary Button", "Offer", "Actions"].map((heading) => (
                  <th className="border-b border-t border-blue-100 bg-slate-50 px-4 py-4 first:border-l last:border-r" key={heading}>{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBanners.map((banner, index) => (
                <tr className="transition hover:bg-blue-50/45" key={banner._id || banner.id}>
                  <td className="border-b border-blue-100 px-4 py-4">{index + 1}</td>
                  <td className="border-b border-blue-100 px-4 py-4">
                    {assetUrl(banner.bannerImage) ? <img src={assetUrl(banner.bannerImage)} alt={banner.bannerTitle} className="h-12 w-28 rounded-md object-cover ring-1 ring-blue-100" /> : <span className="text-xs font-black text-navy-500">No image</span>}
                  </td>
                  <td className="border-b border-blue-100 px-4 py-4 font-black text-navy-950">{banner.bannerTitle}</td>
                  <td className="border-b border-blue-100 px-4 py-4">{banner.headingLine1}<span className="block text-xs font-black text-upchar-green">{banner.headingHighlightText}</span></td>
                  <td className="border-b border-blue-100 px-4 py-4"><span className={`rounded-md px-3 py-1 text-xs font-black ring-1 ${banner.status === "Active" ? "bg-green-50 text-upchar-green ring-green-100" : "bg-red-50 text-upchar-red ring-red-100"}`}>{banner.status}</span></td>
                  <td className="border-b border-blue-100 px-4 py-4">{banner.sortOrder}</td>
                  <td className="border-b border-blue-100 px-4 py-4">{banner.primaryButtonText}<span className="block text-xs text-navy-500">{banner.primaryButtonUrl}</span></td>
                  <td className="border-b border-blue-100 px-4 py-4">{banner.offerText}<span className="block text-xs font-black text-upchar-blue">{banner.offerHighlightText}</span></td>
                  <td className="border-b border-blue-100 px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setPreview(banner)} className="flex h-9 w-9 items-center justify-center rounded-md bg-green-50 text-upchar-green ring-1 ring-green-100" aria-label="Preview image"><Eye className="h-5 w-5" /></button>
                      <button type="button" onClick={() => setFormItem(banner)} className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-upchar-blue ring-1 ring-blue-100" aria-label="Edit banner"><PencilLine className="h-5 w-5" /></button>
                      <button type="button" onClick={() => toggleStatus(banner)} className="flex h-9 w-9 items-center justify-center rounded-md bg-orange-50 text-upchar-orange ring-1 ring-orange-100" aria-label="Toggle status"><Power className="h-5 w-5" /></button>
                      <button type="button" onClick={() => setDeleteTarget(banner)} className="flex h-9 w-9 items-center justify-center rounded-md bg-red-50 text-upchar-red ring-1 ring-red-100" aria-label="Delete banner"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !filteredBanners.length ? <div className="rounded-b-lg border-x border-b border-blue-100 px-4 py-10 text-center text-sm font-black text-navy-600">No homepage banners found.</div> : null}
          {loading ? <div className="rounded-b-lg border-x border-b border-blue-100 px-4 py-10 text-center text-sm font-black text-navy-600">Loading homepage banners...</div> : null}
        </div>
      </section>

      {(adding || formItem) ? <BannerForm item={formItem} onClose={() => { setAdding(false); setFormItem(null); }} onSave={saveBanner} /> : null}
      {deleteTarget ? <ConfirmDeleteModal title="Delete Banner" message="Are you sure you want to delete this banner? This action cannot be undone." onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} /> : null}
      {preview ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-navy-950/70 p-4" onClick={() => setPreview(null)}>
          <div className="w-full max-w-4xl rounded-lg bg-white p-4 shadow-card" onClick={(event) => event.stopPropagation()}>
            <img src={assetUrl(preview.bannerImage)} alt={preview.bannerTitle} className="max-h-[72vh] w-full rounded-md object-contain" />
          </div>
        </div>
      ) : null}
      <AccountToast message={toast} />
    </AdminLayout>
  );
}

export default AdminHomepageBannersPage;
