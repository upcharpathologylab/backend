import { useMemo, useState } from "react";
import FormModal from "../../profile/FormModal.jsx";
import { assetUrl, uploadContentImage } from "../../../api/api.js";

const blankTest = {
  testName: "",
  testCode: "",
  testImage: "",
  category: "",
  price: "",
  discountPercent: "0",
  description: "",
  badge: "",
  badgeType: "green",
  icon: "TestTube2",
  sampleType: "",
  reportTime: "24 hrs",
  homeCollection: "Yes",
  fastingRequired: "No",
  rating: "4.6",
  popularity: "0",
  sortOrder: "0",
  status: "Active"
};

const badgeTypes = ["green", "blue", "red", "orange", "purple", "teal"];
const iconOptions = ["TestTube2", "Activity", "Droplet", "Leaf", "ShieldPlus", "Sun", "BadgeCheck", "HeartPulse", "FileCheck2", "Bone"];

function Field({ children, label }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-navy-950">{label}</span>
      {children}
    </label>
  );
}

const inputClass = "h-12 w-full rounded-md border border-blue-100 px-4 text-sm font-semibold text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue";

function TestFormModal({ categories, test, onClose, onSave }) {
  const [values, setValues] = useState(() => ({
    ...blankTest,
    ...(test || {}),
    image: test?.image || test?.testImage || "",
    testImage: test?.testImage || test?.image || "",
    price: (test?.price ?? test?.originalPrice ?? "").toString(),
    discountPercent: (test?.discountPercent ?? "0").toString(),
    rating: (test?.rating ?? "4.6").toString(),
    popularity: (test?.popularity ?? "0").toString(),
    sortOrder: (test?.sortOrder ?? "0").toString(),
    homeCollection: test?.homeCollection || "Yes",
    fastingRequired: test?.fastingRequired || "No"
  }));
  const [errors, setErrors] = useState({});
  const [uploadingImage, setUploadingImage] = useState(false);

  const finalPrice = useMemo(() => {
    const price = Number(values.price || 0);
    const discount = Number(values.discountPercent || 0);
    return Math.max(0, Math.round(price - (price * discount) / 100));
  }, [values.price, values.discountPercent]);
  const previewImage = assetUrl(values.testImage);

  const update = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    ["testName", "testCode", "category", "price", "status"].forEach((key) => {
      if (!values[key]?.toString().trim()) nextErrors[key] = "Required";
    });
    if (Number(values.price) <= 0) nextErrors.price = "Required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const uploadImage = async (file) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((current) => ({ ...current, testImage: "Use jpg, jpeg, png or webp" }));
      return;
    }

    try {
      setUploadingImage(true);
      const result = await uploadContentImage(file);
      update("testImage", result.imageUrl || result.url || "");
    } catch (error) {
      setErrors((current) => ({ ...current, testImage: error?.response?.data?.message || error?.message || "Image upload failed." }));
    } finally {
      setUploadingImage(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    if (uploadingImage) return;
    if (!validate()) return;

    const image = values.testImage || values.image || "";

    onSave({
      ...values,
      id: test?.id || Date.now(),
      image,
      testImage: image,
      price: Number(values.price),
      discountPercent: Number(values.discountPercent || 0),
      finalPrice,
      rating: Number(values.rating || 0),
      popularity: Number(values.popularity || 0),
      sortOrder: Number(values.sortOrder || 0),
      color: values.badgeType
    });
  };

  return (
    <FormModal
      title={test ? "Edit Test" : "Add New Test"}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} className="h-11 rounded-md border border-blue-100 px-6 text-sm font-black text-navy-800">
            Cancel
          </button>
          <button type="submit" form="admin-test-form" className="h-11 rounded-md bg-upchar-green px-6 text-sm font-black text-white transition hover:bg-upchar-greenDark">
            Save Test
          </button>
        </div>
      }
    >
      <form id="admin-test-form" className="grid gap-5" onSubmit={submit}>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Test Name">
            <input className={inputClass} value={values.testName} onChange={(event) => update("testName", event.target.value)} placeholder="Enter test name" />
            {errors.testName ? <span className="mt-1 block text-xs font-black text-upchar-red">{errors.testName}</span> : null}
          </Field>
          <Field label="Test Code">
            <input className={inputClass} value={values.testCode} onChange={(event) => update("testCode", event.target.value)} placeholder="Enter test code" />
            {errors.testCode ? <span className="mt-1 block text-xs font-black text-upchar-red">{errors.testCode}</span> : null}
          </Field>
        </div>

        <Field label="Test Image">
          <div className="grid gap-3 rounded-md border border-blue-100 p-3">
            {previewImage ? (
              <img src={previewImage} alt="Test" className="h-28 w-full rounded-md object-cover ring-1 ring-blue-100" />
            ) : (
              <div className="flex h-28 items-center justify-center rounded-md bg-blue-50 text-xs font-black text-navy-500 ring-1 ring-blue-100">
                No image selected
              </div>
            )}
            <input
              className={inputClass}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={(event) => uploadImage(event.target.files?.[0])}
            />
            <input className={inputClass} value={values.testImage} onChange={(event) => update("testImage", event.target.value)} placeholder="Image URL" />
            {values.testImage ? (
              <button type="button" className="h-9 justify-self-start rounded-md border border-red-100 px-4 text-xs font-black text-upchar-red" onClick={() => update("testImage", "")}>
                Delete Image
              </button>
            ) : null}
            {uploadingImage ? <span className="text-xs font-black text-upchar-blue">Uploading...</span> : null}
            {errors.testImage ? <span className="mt-1 block text-xs font-black text-upchar-red">{errors.testImage}</span> : null}
          </div>
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Category">
            <select className={inputClass} value={values.category} onChange={(event) => update("category", event.target.value)}>
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            {errors.category ? <span className="mt-1 block text-xs font-black text-upchar-red">{errors.category}</span> : null}
          </Field>
          <Field label="Status">
            <select className={inputClass} value={values.status} onChange={(event) => update("status", event.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Price">
            <input className={inputClass} type="number" min="0" value={values.price} onChange={(event) => update("price", event.target.value)} placeholder="Price" />
            {errors.price ? <span className="mt-1 block text-xs font-black text-upchar-red">{errors.price}</span> : null}
          </Field>
          <Field label="Discount %">
            <input className={inputClass} type="number" min="0" max="100" value={values.discountPercent} onChange={(event) => update("discountPercent", event.target.value)} placeholder="0" />
          </Field>
          <Field label="Final Price">
            <input className={`${inputClass} bg-slate-50`} value={finalPrice} readOnly />
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Badge Text">
            <input className={inputClass} value={values.badge} onChange={(event) => update("badge", event.target.value)} placeholder="Popular, Fast Report..." />
          </Field>
          <Field label="Badge Type">
            <select className={inputClass} value={values.badgeType} onChange={(event) => update("badgeType", event.target.value)}>
              {badgeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Icon">
            <select className={inputClass} value={values.icon} onChange={(event) => update("icon", event.target.value)}>
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Description">
          <textarea
            className="min-h-24 w-full rounded-md border border-blue-100 px-4 py-3 text-sm font-semibold text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue"
            value={values.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Enter test description"
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-4">
          <Field label="Sample Type">
            <input className={inputClass} value={values.sampleType} onChange={(event) => update("sampleType", event.target.value)} placeholder="Blood, Urine..." />
          </Field>
          <Field label="Report Time">
            <input className={inputClass} value={values.reportTime} onChange={(event) => update("reportTime", event.target.value)} placeholder="24 hrs" />
          </Field>
          <Field label="Home Collection">
            <select className={inputClass} value={values.homeCollection} onChange={(event) => update("homeCollection", event.target.value)}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </Field>
          <Field label="Fasting Required">
            <select className={inputClass} value={values.fastingRequired} onChange={(event) => update("fastingRequired", event.target.value)}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </Field>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Rating">
            <input className={inputClass} type="number" min="0" max="5" step="0.1" value={values.rating} onChange={(event) => update("rating", event.target.value)} placeholder="4.6" />
          </Field>
          <Field label="Popularity">
            <input className={inputClass} type="number" min="0" value={values.popularity} onChange={(event) => update("popularity", event.target.value)} placeholder="100" />
          </Field>
          <Field label="Sort Order">
            <input className={inputClass} type="number" min="0" value={values.sortOrder} onChange={(event) => update("sortOrder", event.target.value)} placeholder="1" />
          </Field>
        </div>
      </form>
    </FormModal>
  );
}

export default TestFormModal;
