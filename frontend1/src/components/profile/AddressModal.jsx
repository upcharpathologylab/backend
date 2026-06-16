import { useState } from "react";
import FormModal from "./FormModal.jsx";

const inputClass =
  "h-11 w-full rounded-md border border-blue-100 bg-white px-3 text-sm font-semibold text-navy-800 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue focus:ring-4 focus:ring-blue-100";

const emptyAddress = {
  label: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  phone: "",
  primary: false
};

function Field({ label, name, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-navy-800">{label}</span>
      <input className={`${inputClass} mt-2`} name={name} value={value} onChange={onChange} />
    </label>
  );
}

function AddressModal({ address, onClose, onSave }) {
  const [values, setValues] = useState(address || emptyAddress);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
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
            className="h-11 rounded-md bg-upchar-green px-6 text-sm font-black text-white transition hover:bg-upchar-greenDark"
          >
            Save Address
          </button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Label" name="label" value={values.label} onChange={handleChange} />
        <Field label="Phone" name="phone" value={values.phone} onChange={handleChange} />
        <div className="sm:col-span-2">
          <Field label="Address Line" name="addressLine" value={values.addressLine} onChange={handleChange} />
        </div>
        <Field label="City" name="city" value={values.city} onChange={handleChange} />
        <Field label="State" name="state" value={values.state} onChange={handleChange} />
        <Field label="Pincode" name="pincode" value={values.pincode} onChange={handleChange} />
        <Field label="Country" name="country" value={values.country} onChange={handleChange} />
      </div>
      <label className="mt-5 flex items-center gap-3 text-sm font-bold text-navy-800">
        <input type="checkbox" name="primary" checked={values.primary} onChange={handleChange} className="h-5 w-5 accent-upchar-green" />
        Set as primary address
      </label>
    </FormModal>
  );
}

export default AddressModal;
