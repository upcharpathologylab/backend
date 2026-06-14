import { ChevronRight } from "lucide-react";
import Icon from "../../Icon.jsx";
import { securityRows } from "../../../data/accountPagesData.js";

function Toggle({ enabled }) {
  return (
    <span className={`flex h-6 w-11 items-center rounded-full p-1 ${enabled ? "bg-upchar-green" : "bg-navy-100"}`}>
      <span className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${enabled ? "translate-x-5" : ""}`} />
    </span>
  );
}

function SecuritySettings({ onAction }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white shadow-sm">
      <div className="flex gap-4 border-b border-blue-100 p-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-upchar-green">
          <Icon name="ShieldCheck" className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-xl font-black text-navy-900">Security Settings</h2>
          <p className="mt-1 text-sm font-semibold text-navy-600">Manage your account security</p>
        </div>
      </div>
      <div className="divide-y divide-blue-100">
        {securityRows.map((row) => (
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-blue-50/50"
            key={row.title}
            onClick={() => onAction(row.title)}
          >
            <span>
              <span className="block text-sm font-black text-navy-900">{row.title}</span>
              <span className="mt-1 block text-xs font-semibold text-navy-600">{row.subtitle}</span>
            </span>
            {row.toggle ? <Toggle enabled /> : <ChevronRight className="h-5 w-5 text-navy-700" />}
          </button>
        ))}
      </div>
    </section>
  );
}

export default SecuritySettings;
export { Toggle };
