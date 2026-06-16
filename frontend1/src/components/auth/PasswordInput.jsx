import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";

function PasswordInput({ id, name, placeholder, value, onChange, error }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div
        className={`flex h-14 items-center rounded-lg border bg-white px-4 transition focus-within:border-upchar-blue focus-within:ring-4 focus-within:ring-upchar-blue/10 sm:h-16 ${
          error ? "border-red-300" : "border-blue-100"
        }`}
      >
        <LockKeyhole className="h-6 w-6 shrink-0 text-navy-700" />
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-4 text-base font-semibold text-navy-900 outline-none placeholder:text-navy-500 sm:text-lg"
        />
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-navy-700 transition hover:bg-blue-50"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm font-semibold text-red-600">{error}</p>}
    </div>
  );
}

export default PasswordInput;
