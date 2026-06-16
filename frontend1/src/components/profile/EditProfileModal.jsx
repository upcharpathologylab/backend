import { useState } from "react";
import FormModal from "./FormModal.jsx";

const inputClass =
  "h-11 w-full rounded-md border border-blue-100 bg-white px-3 text-sm font-semibold text-navy-800 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue focus:ring-4 focus:ring-blue-100";

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-navy-800">{label}</span>
      <input
        className={`${inputClass} mt-2`}
        name={name}
        value={value || ""}
        onChange={onChange}
        type={type}
      />
    </label>
  );
}

function EditProfileModal({ profile, onClose, onSave }) {
  const [values, setValues] = useState(profile);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  return (
    <FormModal
      title="Edit Personal Information"
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} className="h-11 rounded-md border border-blue-100 px-6 text-sm font-black text-navy-800">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(values)}
            className="h-11 rounded-md bg-upchar-green px-6 text-sm font-black text-white transition hover:bg-upchar-greenDark"
          >
            Save Changes
          </button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" name="fullName" value={values.fullName} onChange={handleChange} />
        <Field label="Date of Birth" name="dateOfBirth" value={values.dateOfBirth} onChange={handleChange} />
        <Field label="Gender" name="gender" value={values.gender} onChange={handleChange} />
        <Field label="Blood Group" name="bloodGroup" value={values.bloodGroup} onChange={handleChange} />
        <Field label="Mobile Number" name="phone" value={values.phone} onChange={handleChange} />
        <Field label="Email Address" name="email" value={values.email} onChange={handleChange} type="email" />
        <Field label="Alternate Number" name="alternateNumber" value={values.alternateNumber} onChange={handleChange} />
        <Field label="Preferred Language" name="preferredLanguage" value={values.preferredLanguage} onChange={handleChange} />
      </div>
    </FormModal>
  );
}

export default EditProfileModal;
