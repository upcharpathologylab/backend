import { useState } from "react";
import FormModal from "../profile/FormModal.jsx";

const inputClass =
  "h-11 w-full rounded-md border border-blue-100 bg-white px-3 text-sm font-semibold text-navy-800 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue focus:ring-4 focus:ring-blue-100";

const emptyAddress = {
  type: "Home",
  label: "Home",
  name: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  phone: "",
  isPrimary: false
};

function Field({ label, name, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-navy-800">{label}</span>
      <input className={`${inputClass} mt-2`} name={name} value={value || ""} onChange={onChange} />
    </label>
  );
}

function AddressFormModal({ address, onClose, onSave }) {
  const [values, setValues] = useState(address || emptyAddress);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "type" ? { label: value } : {})
    }));
  };

  return (
    <FormModal
      title={address ? "Edit Address" : "Add New Address"}
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
            Save Address
          </button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-black text-navy-800">Type</span>
          <select className={`${inputClass} mt-2`} name="type" value={values.type || values.label || "Home"} onChange={handleChange}>
            <option value="Home">Home</option>
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <Field label="Phone" name="phone" value={values.phone} onChange={handleChange} />
        <Field label="Name / Building" name="name" value={values.name} onChange={handleChange} />
        <Field label="Address Line 1" name="addressLine1" value={values.addressLine1 || values.addressLine} onChange={handleChange} />
        <Field label="Address Line 2" name="addressLine2" value={values.addressLine2} onChange={handleChange} />
        <Field label="Landmark" name="landmark" value={values.landmark} onChange={handleChange} />
        <Field label="City" name="city" value={values.city} onChange={handleChange} />
        <Field label="State" name="state" value={values.state} onChange={handleChange} />
        <Field label="Pincode" name="pincode" value={values.pincode} onChange={handleChange} />
        <Field label="Country" name="country" value={values.country} onChange={handleChange} />
      </div>
      <label className="mt-5 flex items-center gap-3 text-sm font-bold text-navy-800">
        <input
          type="checkbox"
          name="isPrimary"
          checked={Boolean(values.isPrimary || values.primary)}
          onChange={handleChange}
          className="h-5 w-5 accent-upchar-green"
        />
        Set as primary address
      </label>
    </FormModal>
  );
}

export default AddressFormModal;
