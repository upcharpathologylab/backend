import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Plus, Save, Trash2, UploadCloud } from "lucide-react";
import AccountToast from "../components/account/AccountToast.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import { assetUrl, getPageContent, savePageContent, uploadContentImage } from "../api/api.js";
import { getPageDefinition, getSectionDefinitions } from "../data/adminContentPagesData.js";

const fieldLabels = {
  title: "Title / Main Heading",
  subtitle: "Sub Heading",
  description: "Description / Paragraph",
  imageUrl: "Image",
  titleCard: "Package Name",
  cardDescription: "Package Description",
  blogDescription: "Short Description",
  blogContent: "Full Content",
  category: "Category",
  date: "Date",
  testCount: "Test Count",
  oldPrice: "Original Price",
  newPrice: "Discount Price",
  badge: "Badge Text",
  buttonText: "Button Text",
  buttonLink: "Button URL",
  status: "Status"
};

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function createCard(card = {}) {
  return {
    id: card.id || `card-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    image: card.image || "",
    title: card.title || "",
    description: card.description || "",
    content: card.content || "",
    category: card.category || "",
    date: card.date || "",
    testCount: card.testCount || "",
    oldPrice: card.oldPrice || "",
    newPrice: card.newPrice || "",
    badge: card.badge || "",
    buttonText: card.buttonText || "Book Now",
    buttonLink: card.buttonLink || "#booking",
    status: card.status === "Inactive" ? "Inactive" : "Active"
  };
}

function cloneCards(cards = []) {
  return Array.isArray(cards) ? cards.map((card) => createCard(card)) : [];
}

const isBlogRepeater = (section) => section.repeater?.type === "blog";

function buildSections(definitions, savedSections = []) {
  const savedMap = new Map(savedSections.map((section) => [section.sectionKey, section]));

  return definitions.map((definition) => {
    const saved = savedMap.get(definition.sectionKey);
    return {
      sectionKey: definition.sectionKey,
      label: definition.label,
      fields: definition.fields,
      repeater: definition.repeater,
      settingsFields: definition.settingsFields,
      ...definition.defaults,
      ...(saved
        ? {
            title: saved.title ?? definition.defaults.title ?? "",
            subtitle: saved.subtitle ?? definition.defaults.subtitle ?? "",
            description: saved.description ?? definition.defaults.description ?? "",
            imageUrl: saved.imageUrl ?? definition.defaults.imageUrl ?? "",
            settings: { ...(definition.defaults.settings || {}), ...(saved.settings || {}) },
            cards:
              saved.hasCards === false
                ? cloneCards(definition.defaults.cards)
                : Array.isArray(saved.cards)
                  ? cloneCards(saved.cards)
                  : cloneCards(definition.defaults.cards),
            status: saved.status ?? definition.defaults.status ?? "Published"
          }
        : { settings: { ...(definition.defaults.settings || {}) }, cards: cloneCards(definition.defaults.cards), status: definition.defaults.status || "Published" })
    };
  });
}

function AdminHomeContentPage() {
  const { pageSlug = "home" } = useParams();
  const page = getPageDefinition(pageSlug);
  const definitions = useMemo(() => getSectionDefinitions(pageSlug), [pageSlug]);
  const [sections, setSections] = useState(() => buildSections(definitions));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.title = `${page.title} Content | Upchar Admin`;
    setLoading(true);
    let mounted = true;

    getPageContent(pageSlug)
      .then((data) => {
        if (mounted) {
          setSections(buildSections(definitions, data?.sections || []));
        }
      })
      .catch(() => {
        if (mounted) {
          setSections(buildSections(definitions));
          setToast("Content API is offline, showing default editable fields.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [definitions, page.title, pageSlug]);

  const updateField = (sectionKey, field, value) => {
    setSections((current) =>
      current.map((section) => (section.sectionKey === sectionKey ? { ...section, [field]: value } : section))
    );
  };

  const updateSetting = (sectionKey, field, value) => {
    setSections((current) =>
      current.map((section) =>
        section.sectionKey === sectionKey
          ? { ...section, settings: { ...(section.settings || {}), [field]: value } }
          : section
      )
    );
  };

  const updateCardField = (sectionKey, cardId, field, value) => {
    setSections((current) =>
      current.map((section) =>
        section.sectionKey === sectionKey
          ? {
              ...section,
              cards: cloneCards(section.cards).map((card) => (card.id === cardId ? { ...card, [field]: value } : card))
            }
          : section
      )
    );
  };

  const addCard = (sectionKey) => {
    setSections((current) =>
      current.map((section) =>
        section.sectionKey === sectionKey
          ? {
              ...section,
              cards: [
                ...cloneCards(section.cards),
                createCard(
                  isBlogRepeater(section)
                    ? {
                        title: "New Blog",
                        description: "Short blog description",
                        content: "Full blog content",
                        category: "Health Tips",
                        date: new Date().toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" }),
                        buttonText: "Read More",
                        buttonLink: "/blog"
                      }
                    : {
                        title: "New Package",
                        testCount: "0 Tests",
                        buttonText: "Book Now",
                        buttonLink: "#booking"
                      }
                )
              ]
            }
          : section
      )
    );
  };

  const deleteCard = (sectionKey, cardId) => {
    setSections((current) =>
      current.map((section) =>
        section.sectionKey === sectionKey
          ? { ...section, cards: cloneCards(section.cards).filter((card) => card.id !== cardId) }
          : section
      )
    );
  };

  const moveCard = (sectionKey, cardId, direction) => {
    setSections((current) =>
      current.map((section) => {
        if (section.sectionKey !== sectionKey) return section;

        const cards = cloneCards(section.cards);
        const index = cards.findIndex((card) => card.id === cardId);
        const nextIndex = direction === "up" ? index - 1 : index + 1;

        if (index < 0 || nextIndex < 0 || nextIndex >= cards.length) return section;

        const [card] = cards.splice(index, 1);
        cards.splice(nextIndex, 0, card);

        return { ...section, cards };
      })
    );
  };

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const handleImageUpload = async (sectionKey, file, cardId = "") => {
    if (!file) return;

    if (!allowedTypes.has(file.type)) {
      showToast("Only JPG, JPEG, PNG and WEBP images are allowed.");
      return;
    }

    const uploadKey = cardId ? `${sectionKey}:${cardId}` : sectionKey;
    setUploadingKey(uploadKey);
    try {
      const uploaded = await uploadContentImage(file);
      if (cardId) {
        updateCardField(sectionKey, cardId, "image", uploaded.imageUrl || "");
      } else {
        updateField(sectionKey, "imageUrl", uploaded.imageUrl || "");
      }
      showToast("Image uploaded successfully.");
    } catch (error) {
      showToast(error?.response?.data?.message || "Image upload failed.");
    } finally {
      setUploadingKey("");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = sections.map(({ sectionKey, title, subtitle, description, imageUrl, cards, settings, status }) => ({
        status: status || "Published",
        sectionKey,
        title,
        subtitle,
        description,
        imageUrl,
        cards: cloneCards(cards),
        settings: settings || {}
      }));
      await savePageContent(pageSlug, payload);
      showToast("Content saved successfully.");
    } catch (error) {
      showToast(error?.response?.data?.message || "Could not save content.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout topbarTitle={null} topbarBadge={null}>
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-navy-950">{page.title} Content</h1>
          <p className="mt-3 text-sm font-semibold text-navy-700">
            <span className="font-black text-navy-950">Dashboard</span>
            <span className="px-2 text-navy-400">&gt;</span>
            Content / Pages
            <span className="px-2 text-navy-400">&gt;</span>
            {page.title}
          </p>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-navy-700">
            Edit only website text and images. Layout, colors, fonts and spacing stay unchanged.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/content-pages" className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-blue-100 bg-white px-5 text-sm font-black text-upchar-blue shadow-sm">
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-upchar-green px-5 text-sm font-black text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {loading ? (
        <section className="rounded-lg border border-blue-100 bg-white p-10 text-center text-sm font-black text-navy-600 shadow-sm">Loading page content...</section>
      ) : (
        <div className="grid gap-5">
          {sections.map((section) => (
            <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6" key={section.sectionKey}>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-upchar-green">
                  <ImagePlus className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-black text-navy-950">{section.label}</h2>
                  <p className="mt-1 text-xs font-semibold text-navy-500">Text and image fields only</p>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="grid gap-4">
                  {section.fields.includes("title") ? (
                    <label className="grid gap-2 text-sm font-black text-navy-900">
                      {section.fields.includes("status") ? "Page Title" : fieldLabels.title}
                      <input
                        value={section.title || ""}
                        onChange={(event) => updateField(section.sectionKey, "title", event.target.value)}
                        className="h-11 rounded-md border border-blue-100 bg-white px-4 text-sm font-semibold text-navy-900 outline-none transition focus:border-upchar-blue"
                      />
                    </label>
                  ) : null}

                  {section.fields.includes("subtitle") ? (
                    <label className="grid gap-2 text-sm font-black text-navy-900">
                      {fieldLabels.subtitle}
                      <input
                        value={section.subtitle || ""}
                        onChange={(event) => updateField(section.sectionKey, "subtitle", event.target.value)}
                        className="h-11 rounded-md border border-blue-100 bg-white px-4 text-sm font-semibold text-navy-900 outline-none transition focus:border-upchar-blue"
                      />
                    </label>
                  ) : null}

                  {section.fields.includes("description") ? (
                    <label className="grid gap-2 text-sm font-black text-navy-900">
                      {section.fields.includes("status") ? "Page Content" : fieldLabels.description}
                      <textarea
                        value={section.description || ""}
                        rows={4}
                        onChange={(event) => updateField(section.sectionKey, "description", event.target.value)}
                        className="rounded-md border border-blue-100 bg-white px-4 py-3 text-sm font-semibold leading-6 text-navy-900 outline-none transition focus:border-upchar-blue"
                      />
                    </label>
                  ) : null}

                  {section.fields.includes("status") ? (
                    <label className="grid gap-2 text-sm font-black text-navy-900">
                      {fieldLabels.status}
                      <select
                        value={section.status || "Published"}
                        onChange={(event) => updateField(section.sectionKey, "status", event.target.value)}
                        className="h-11 rounded-md border border-blue-100 bg-white px-4 text-sm font-semibold text-navy-900 outline-none transition focus:border-upchar-blue"
                      >
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </label>
                  ) : null}

                  {section.settingsFields?.map((field) => (
                    <label className="grid gap-2 text-sm font-black text-navy-900" key={field.key}>
                      {field.label}
                      {field.type === "textarea" ? (
                        <textarea
                          value={section.settings?.[field.key] || ""}
                          rows={4}
                          onChange={(event) => updateSetting(section.sectionKey, field.key, event.target.value)}
                          className="rounded-md border border-blue-100 bg-white px-4 py-3 text-sm font-semibold leading-6 text-navy-900 outline-none transition focus:border-upchar-blue"
                        />
                      ) : (
                        <input
                          value={section.settings?.[field.key] || ""}
                          onChange={(event) => updateSetting(section.sectionKey, field.key, event.target.value)}
                          className="h-11 rounded-md border border-blue-100 bg-white px-4 text-sm font-semibold text-navy-900 outline-none transition focus:border-upchar-blue"
                        />
                      )}
                    </label>
                  ))}
                </div>

                {section.fields.includes("imageUrl") ? (
                  <div className="rounded-lg border border-blue-100 bg-slate-50 p-4">
                    <p className="text-sm font-black text-navy-900">{fieldLabels.imageUrl}</p>
                    <div className="mt-3 flex h-40 items-center justify-center overflow-hidden rounded-md border border-blue-100 bg-white">
                      {section.imageUrl ? (
                        <img src={assetUrl(section.imageUrl)} alt={`${section.label} preview`} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-center text-xs font-bold text-navy-500">No image selected</span>
                      )}
                    </div>
                    <label className="mt-4 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-blue-100 bg-white px-4 text-sm font-black text-upchar-blue">
                      <UploadCloud className="h-4 w-4" />
                      {uploadingKey === section.sectionKey ? "Uploading..." : "Upload / Replace Image"}
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={uploadingKey === section.sectionKey}
                        onChange={(event) => handleImageUpload(section.sectionKey, event.target.files?.[0])}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => updateField(section.sectionKey, "imageUrl", "")}
                      disabled={!section.imageUrl}
                      className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-red-100 bg-white px-4 text-sm font-black text-upchar-red disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Image
                    </button>
                  </div>
                ) : null}
              </div>

              {section.repeater ? (
                <div className="mt-6 rounded-lg border border-blue-100 bg-slate-50 p-4">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-black text-navy-950">{section.repeater.label}</h3>
                      <p className="mt-1 text-xs font-semibold text-navy-500">Add, edit, delete and reorder {isBlogRepeater(section) ? "blog" : "package"} cards.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addCard(section.sectionKey)}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-upchar-green px-4 text-sm font-black text-white"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Card
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {cloneCards(section.cards).map((card, index) => {
                      const uploadKey = `${section.sectionKey}:${card.id}`;
                      const blogRepeater = isBlogRepeater(section);

                      return (
                        <article className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm" key={card.id}>
                          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h4 className="text-base font-black text-navy-950">Card {index + 1}</h4>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => moveCard(section.sectionKey, card.id, "up")}
                                disabled={index === 0}
                                className="inline-flex h-9 items-center justify-center gap-1 rounded-md border border-blue-100 px-3 text-xs font-black text-upchar-blue disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <ArrowUp className="h-4 w-4" />
                                Up
                              </button>
                              <button
                                type="button"
                                onClick={() => moveCard(section.sectionKey, card.id, "down")}
                                disabled={index === cloneCards(section.cards).length - 1}
                                className="inline-flex h-9 items-center justify-center gap-1 rounded-md border border-blue-100 px-3 text-xs font-black text-upchar-blue disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <ArrowDown className="h-4 w-4" />
                                Down
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteCard(section.sectionKey, card.id)}
                                className="inline-flex h-9 items-center justify-center gap-1 rounded-md border border-red-100 px-3 text-xs font-black text-upchar-red"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="grid gap-4 xl:grid-cols-[220px_1fr]">
                            <div className="rounded-lg border border-blue-100 bg-slate-50 p-3">
                              <p className="text-sm font-black text-navy-900">{blogRepeater ? "Blog Image" : "Package Image"}</p>
                              <div className="mt-3 flex h-36 items-center justify-center overflow-hidden rounded-md border border-blue-100 bg-white">
                                {card.image ? (
                                  <img src={assetUrl(card.image)} alt={`${card.title || (blogRepeater ? "Blog" : "Package")} preview`} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-center text-xs font-bold text-navy-500">No image selected</span>
                                )}
                              </div>
                              <label className="mt-3 inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-blue-100 bg-white px-3 text-xs font-black text-upchar-blue">
                                <UploadCloud className="h-4 w-4" />
                                {uploadingKey === uploadKey ? "Uploading..." : "Upload / Replace"}
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                  className="hidden"
                                  disabled={uploadingKey === uploadKey}
                                  onChange={(event) => handleImageUpload(section.sectionKey, event.target.files?.[0], card.id)}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => updateCardField(section.sectionKey, card.id, "image", "")}
                                disabled={!card.image}
                                className="mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-red-100 bg-white px-3 text-xs font-black text-upchar-red disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Image
                              </button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <label className="grid gap-2 text-sm font-black text-navy-900">
                                {blogRepeater ? "Blog Title" : fieldLabels.titleCard}
                                <input value={card.title} onChange={(event) => updateCardField(section.sectionKey, card.id, "title", event.target.value)} className="h-10 rounded-md border border-blue-100 px-3 text-sm font-semibold outline-none focus:border-upchar-blue" />
                              </label>
                              {blogRepeater ? (
                                <label className="grid gap-2 text-sm font-black text-navy-900">
                                  {fieldLabels.category}
                                  <input value={card.category} onChange={(event) => updateCardField(section.sectionKey, card.id, "category", event.target.value)} className="h-10 rounded-md border border-blue-100 px-3 text-sm font-semibold outline-none focus:border-upchar-blue" />
                                </label>
                              ) : (
                                <label className="grid gap-2 text-sm font-black text-navy-900">
                                  {fieldLabels.testCount}
                                  <input value={card.testCount} onChange={(event) => updateCardField(section.sectionKey, card.id, "testCount", event.target.value)} className="h-10 rounded-md border border-blue-100 px-3 text-sm font-semibold outline-none focus:border-upchar-blue" />
                                </label>
                              )}
                              <label className="grid gap-2 text-sm font-black text-navy-900 md:col-span-2">
                                {blogRepeater ? fieldLabels.blogDescription : fieldLabels.cardDescription}
                                <textarea value={card.description} rows={2} onChange={(event) => updateCardField(section.sectionKey, card.id, "description", event.target.value)} className="rounded-md border border-blue-100 px-3 py-2 text-sm font-semibold outline-none focus:border-upchar-blue" />
                              </label>
                              {blogRepeater ? (
                                <>
                                  <label className="grid gap-2 text-sm font-black text-navy-900 md:col-span-2">
                                    {fieldLabels.blogContent}
                                    <textarea value={card.content} rows={4} onChange={(event) => updateCardField(section.sectionKey, card.id, "content", event.target.value)} className="rounded-md border border-blue-100 px-3 py-2 text-sm font-semibold outline-none focus:border-upchar-blue" />
                                  </label>
                                  <label className="grid gap-2 text-sm font-black text-navy-900">
                                    {fieldLabels.date}
                                    <input value={card.date} onChange={(event) => updateCardField(section.sectionKey, card.id, "date", event.target.value)} className="h-10 rounded-md border border-blue-100 px-3 text-sm font-semibold outline-none focus:border-upchar-blue" />
                                  </label>
                                </>
                              ) : (
                                <>
                                  <label className="grid gap-2 text-sm font-black text-navy-900">
                                    {fieldLabels.oldPrice}
                                    <input value={card.oldPrice} onChange={(event) => updateCardField(section.sectionKey, card.id, "oldPrice", event.target.value)} className="h-10 rounded-md border border-blue-100 px-3 text-sm font-semibold outline-none focus:border-upchar-blue" />
                                  </label>
                                  <label className="grid gap-2 text-sm font-black text-navy-900">
                                    {fieldLabels.newPrice}
                                    <input value={card.newPrice} onChange={(event) => updateCardField(section.sectionKey, card.id, "newPrice", event.target.value)} className="h-10 rounded-md border border-blue-100 px-3 text-sm font-semibold outline-none focus:border-upchar-blue" />
                                  </label>
                                  <label className="grid gap-2 text-sm font-black text-navy-900">
                                    {fieldLabels.badge}
                                    <input value={card.badge} onChange={(event) => updateCardField(section.sectionKey, card.id, "badge", event.target.value)} className="h-10 rounded-md border border-blue-100 px-3 text-sm font-semibold outline-none focus:border-upchar-blue" />
                                  </label>
                                </>
                              )}
                              <label className="grid gap-2 text-sm font-black text-navy-900">
                                {fieldLabels.status}
                                <select value={card.status} onChange={(event) => updateCardField(section.sectionKey, card.id, "status", event.target.value)} className="h-10 rounded-md border border-blue-100 px-3 text-sm font-semibold outline-none focus:border-upchar-blue">
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                </select>
                              </label>
                              {!blogRepeater ? (
                                <>
                                  <label className="grid gap-2 text-sm font-black text-navy-900">
                                    {fieldLabels.buttonText}
                                    <input value={card.buttonText} onChange={(event) => updateCardField(section.sectionKey, card.id, "buttonText", event.target.value)} className="h-10 rounded-md border border-blue-100 px-3 text-sm font-semibold outline-none focus:border-upchar-blue" />
                                  </label>
                                  <label className="grid gap-2 text-sm font-black text-navy-900">
                                    {fieldLabels.buttonLink}
                                    <input value={card.buttonLink} onChange={(event) => updateCardField(section.sectionKey, card.id, "buttonLink", event.target.value)} className="h-10 rounded-md border border-blue-100 px-3 text-sm font-semibold outline-none focus:border-upchar-blue" />
                                  </label>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}

      <AccountToast message={toast} />
    </AdminLayout>
  );
}

export default AdminHomeContentPage;
