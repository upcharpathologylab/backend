import { useMemo, useState } from "react";
import FormModal from "../../profile/FormModal.jsx";
import { assetUrl, uploadContentImage } from "../../../api/api.js";

const inputClass = "h-12 w-full rounded-md border border-blue-100 px-4 text-sm font-semibold text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue";

function initialValues(fields, item) {
  return fields.reduce((values, field) => {
    values[field.key] = item?.[field.key] ?? field.defaultValue ?? (field.type === "select" ? field.options?.[0] || "" : "");
    return values;
  }, item ? { _id: item._id, id: item.id } : {});
}

function getCalculatedValues(values, calculation) {
  if (!calculation) return {};
  const base = Number(values[calculation.baseKey] || 0);
  const discount = Number(values[calculation.discountKey] || 0);
  const amount = Math.round((base * discount) / 100);
  const final = Math.max(0, Math.round(base - amount));
  return {
    ...(calculation.amountKey ? { [calculation.amountKey]: amount } : {}),
    [calculation.finalKey]: final
  };
}

function Field({ children, error, label }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-navy-950">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs font-black text-upchar-red">{error}</span> : null}
    </label>
  );
}

function AdminManagementFormModal({ config, item, onClose, onSave }) {
  const [values, setValues] = useState(() => initialValues(config.formFields, item));
  const [errors, setErrors] = useState({});
  const [uploadingKey, setUploadingKey] = useState("");
  const calculated = useMemo(() => getCalculatedValues(values, config.calculation), [config.calculation, values]);

  const update = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const updateMatrix = (key, row, column, checked) => {
    setValues((current) => ({
      ...current,
      [key]: {
        ...(current[key] || {}),
        [row]: {
          ...((current[key] || {})[row] || {}),
          [column]: checked
        }
      }
    }));
  };

  const updateFeature = (key, feature, checked) => {
    setValues((current) => ({
      ...current,
      [key]: {
        ...(current[key] || {}),
        [feature]: checked
      }
    }));
  };

  const validate = () => {
    const nextErrors = {};
    config.formFields.forEach((field) => {
      if (field.required && !String(values[field.key] || "").trim()) {
        nextErrors[field.key] = "Required";
      }
      if (field.required && field.type === "number" && Number(values[field.key]) <= 0) {
        nextErrors[field.key] = "Required";
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const uploadImage = async (key, file) => {
    if (!file) return;
    setErrors((current) => ({ ...current, [key]: "" }));

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((current) => ({ ...current, [key]: "Use jpg, jpeg, png or webp" }));
      return;
    }

    try {
      setUploadingKey(key);
      const result = await uploadContentImage(file);
      update(key, result.imageUrl || result.url || "");
    } catch (error) {
      setErrors((current) => ({ ...current, [key]: error?.response?.data?.message || error?.message || "Image upload failed." }));
    } finally {
      setUploadingKey("");
    }
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    const nextValues = { ...values, ...calculated, _id: item?._id, id: item?.id || Date.now() };
    config.formFields.forEach((field) => {
      if (field.type === "number" && nextValues[field.key] !== "") {
        nextValues[field.key] = Number(nextValues[field.key]);
      }
    });
    if (nextValues.discountType && nextValues.discountValue !== undefined) {
      nextValues.discount = nextValues.discountType === "Flat" ? `Rs. ${nextValues.discountValue} OFF` : `${nextValues.discountValue}% OFF`;
      nextValues.type = nextValues.type || nextValues.discountType;
    }
    onSave(nextValues);
  };

  return (
    <FormModal
      title={item ? `Edit ${config.breadcrumb}` : config.addLabel}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} className="h-11 rounded-md border border-blue-100 px-6 text-sm font-black text-navy-800">
            Cancel
          </button>
          <button type="submit" form="admin-management-form" className="h-11 rounded-md bg-upchar-green px-6 text-sm font-black text-white transition hover:bg-upchar-greenDark">
            {config.saveLabel || "Save"}
          </button>
        </div>
      }
    >
      <form id="admin-management-form" className="grid gap-5 md:grid-cols-2" onSubmit={submit}>
        {config.formFields.map((field) => {
          if (field.type === "textarea") {
            return (
              <Field label={field.label} error={errors[field.key]} key={field.key}>
                <textarea
                  className="min-h-24 w-full rounded-md border border-blue-100 px-4 py-3 text-sm font-semibold text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue"
                  value={values[field.key] || ""}
                  onChange={(event) => update(field.key, event.target.value)}
                  placeholder={field.label}
                />
              </Field>
            );
          }

          if (field.type === "select") {
            return (
              <Field label={field.label} error={errors[field.key]} key={field.key}>
                <select className={inputClass} value={values[field.key] || ""} onChange={(event) => update(field.key, event.target.value)}>
                  {field.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </Field>
            );
          }

          if (field.type === "permissionMatrix") {
            const matrixValue = values[field.key] || {};
            return (
              <div className="md:col-span-2" key={field.key}>
                <span className="mb-2 block text-sm font-black text-navy-950">{field.label}</span>
                <div className="overflow-x-auto rounded-md border border-blue-100">
                  <table className="w-full min-w-[620px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-black uppercase text-navy-600">
                      <tr>
                        <th className="px-3 py-3">Page</th>
                        {field.columns.map((column) => (
                          <th className="px-3 py-3" key={column}>{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {field.rows.map((row) => (
                        <tr className="border-t border-blue-100" key={row}>
                          <td className="px-3 py-3 font-black text-navy-900">{row}</td>
                          {field.columns.map((column) => (
                            <td className="px-3 py-3" key={column}>
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-blue-200 accent-upchar-green"
                                checked={Boolean(matrixValue[row]?.[column])}
                                onChange={(event) => updateMatrix(field.key, row, column, event.target.checked)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          if (field.type === "featureAccess") {
            const featureValue = values[field.key] || {};
            return (
              <div className="md:col-span-2" key={field.key}>
                <span className="mb-2 block text-sm font-black text-navy-950">{field.label}</span>
                <div className="grid gap-3 rounded-md border border-blue-100 p-4 sm:grid-cols-2">
                  {field.options.map((feature) => (
                    <label className="flex items-center gap-3 text-sm font-black text-navy-900" key={feature}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-blue-200 accent-upchar-green"
                        checked={Boolean(featureValue[feature])}
                        onChange={(event) => updateFeature(field.key, feature, event.target.checked)}
                      />
                      {feature}
                    </label>
                  ))}
                </div>
              </div>
            );
          }

          if (field.type === "image") {
            const imageValue = values[field.key] || "";
            return (
              <Field label={field.label} error={errors[field.key]} key={field.key}>
                <div className="grid gap-3 rounded-md border border-blue-100 p-3">
                  {imageValue ? (
                    <img src={assetUrl(imageValue)} alt={field.label} className="h-28 w-full rounded-md object-cover ring-1 ring-blue-100" />
                  ) : (
                    <div className="flex h-28 items-center justify-center rounded-md bg-blue-50 text-xs font-black text-navy-500 ring-1 ring-blue-100">
                      No image selected
                    </div>
                  )}
                  <input
                    className={inputClass}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={(event) => uploadImage(field.key, event.target.files?.[0])}
                  />
                  <input
                    className={inputClass}
                    type="text"
                    value={imageValue}
                    onChange={(event) => update(field.key, event.target.value)}
                    placeholder="Image URL"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="h-9 rounded-md border border-blue-100 px-4 text-xs font-black text-navy-800"
                      disabled={uploadingKey === field.key}
                    >
                      {uploadingKey === field.key ? "Uploading..." : "Upload / Replace"}
                    </button>
                    {imageValue ? (
                      <button
                        type="button"
                        className="h-9 rounded-md border border-red-100 px-4 text-xs font-black text-upchar-red"
                        onClick={() => update(field.key, "")}
                      >
                        Delete Image
                      </button>
                    ) : null}
                  </div>
                </div>
              </Field>
            );
          }

          if (field.type === "calculated") {
            return (
              <Field label={field.label} key={field.key}>
                <input className={`${inputClass} bg-slate-50`} value={calculated[field.key] ?? values[field.key] ?? ""} readOnly />
              </Field>
            );
          }

          return (
            <Field label={field.label} error={errors[field.key]} key={field.key}>
              <input
                className={inputClass}
                type={field.type === "number" ? "number" : "text"}
                min={field.type === "number" ? field.min ?? "0" : undefined}
                max={field.type === "number" ? field.max : undefined}
                step={field.type === "number" ? field.step : undefined}
                value={values[field.key] || ""}
                onChange={(event) => update(field.key, event.target.value)}
                placeholder={field.label}
              />
            </Field>
          );
        })}
      </form>
    </FormModal>
  );
}

export default AdminManagementFormModal;
