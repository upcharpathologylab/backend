import { useState } from "react";
import FormModal from "../profile/FormModal.jsx";

const inputClass =
  "h-11 w-full rounded-md border border-blue-100 bg-white px-3 text-sm font-semibold text-navy-800 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue focus:ring-4 focus:ring-blue-100";

const emptyMember = {
  fullName: "",
  relation: "",
  dateOfBirth: "",
  gender: "Female",
  bloodGroup: "O+",
  color: "green"
};

function Field({ label, name, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-navy-800">{label}</span>
      <input className={`${inputClass} mt-2`} name={name} value={value || ""} onChange={onChange} />
    </label>
  );
}

function FamilyMemberFormModal({ member, onClose, onSave }) {
  const [values, setValues] = useState(member || emptyMember);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value, ...(name === "fullName" ? { name: value } : {}) }));
  };

  return (
    <FormModal
      title={member ? "Edit Family Member" : "Add Family Member"}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onClose} className="h-11 rounded-md border border-blue-100 px-6 text-sm font-black text-navy-800">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(values)}
            className="h-11 rounded-md bg-upchar-blue px-6 text-sm font-black text-white transition hover:bg-navy-800"
          >
            Save Member
          </button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" name="fullName" value={values.fullName || values.name} onChange={handleChange} />
        <Field label="Relation" name="relation" value={values.relation} onChange={handleChange} />
        <Field label="Date of Birth" name="dateOfBirth" value={values.dateOfBirth} onChange={handleChange} />
        <label className="block">
          <span className="text-sm font-black text-navy-800">Gender</span>
          <select className={`${inputClass} mt-2`} name="gender" value={values.gender || "Female"} onChange={handleChange}>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-black text-navy-800">Blood Group</span>
          <select className={`${inputClass} mt-2`} name="bloodGroup" value={values.bloodGroup || "O+"} onChange={handleChange}>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bloodGroup) => (
              <option key={bloodGroup}>{bloodGroup}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-black text-navy-800">Color</span>
          <select className={`${inputClass} mt-2`} name="color" value={values.color || "green"} onChange={handleChange}>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="orange">Orange</option>
          </select>
        </label>
      </div>
    </FormModal>
  );
}

export default FamilyMemberFormModal;
