import { useState } from "react";
import Icon from "../../Icon.jsx";

function PasswordInput({ label, value, onChange, visible, onToggle }) {
  return (
    <label className="block">
      <span className="text-sm font-black text-navy-800">{label}</span>
      <span className="mt-2 flex h-12 items-center rounded-md border border-blue-100 bg-white px-4">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-navy-900 outline-none placeholder:text-navy-400"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        <button type="button" className="text-navy-600" onClick={onToggle} aria-label={`Toggle ${label}`}>
          <Icon name="Eye" className="h-5 w-5" />
        </button>
      </span>
    </label>
  );
}

function ChangePassword({ onSubmit }) {
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const update = (key, value) => setValues((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const saved = await onSubmit(values);
    if (saved) {
      setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-upchar-blue">
          <Icon name="LockKeyhole" className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-xl font-black text-navy-900">Change Password</h2>
          <p className="mt-1 text-sm font-semibold text-navy-600">Keep your account secure</p>
        </div>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <PasswordInput label="Current Password" value={values.currentPassword} onChange={(value) => update("currentPassword", value)} visible={visible} onToggle={() => setVisible((value) => !value)} />
        <PasswordInput label="New Password" value={values.newPassword} onChange={(value) => update("newPassword", value)} visible={visible} onToggle={() => setVisible((value) => !value)} />
        <PasswordInput label="Confirm Password" value={values.confirmPassword} onChange={(value) => update("confirmPassword", value)} visible={visible} onToggle={() => setVisible((value) => !value)} />
        <button type="submit" className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-upchar-blue px-5 text-sm font-black text-white transition hover:bg-navy-800">
          <Icon name="LockKeyhole" className="h-5 w-5" />
          Update Password
        </button>
      </form>
    </section>
  );
}

export default ChangePassword;
