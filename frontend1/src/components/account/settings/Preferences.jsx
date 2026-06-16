import { ChevronRight } from "lucide-react";
import Icon from "../../Icon.jsx";
import { preferenceRows } from "../../../data/accountPagesData.js";
import { Toggle } from "./SecuritySettings.jsx";

const iconByTitle = {
  Language: "Search",
  Theme: "Palette",
  "Email Preferences": "Mail",
  "SMS Preferences": "Smartphone",
  "Marketing Preferences": "Bell"
};

function Preferences({ onAction }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white shadow-sm">
      <div className="flex gap-4 border-b border-blue-100 p-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-upchar-purple">
          <Icon name="Bell" className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-xl font-black text-navy-900">Preferences</h2>
          <p className="mt-1 text-sm font-semibold text-navy-600">Customize your experience</p>
        </div>
      </div>
      <div className="divide-y divide-blue-100">
        {preferenceRows.map((row) => (
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-blue-50/50"
            key={row.title}
            onClick={() => onAction(row.title)}
          >
            <span className="flex items-center gap-3">
              <Icon name={iconByTitle[row.title] || "Settings"} className="h-5 w-5 text-upchar-blue" />
              <span>
                <span className="block text-sm font-black text-navy-900">{row.title}</span>
                {row.subtitle ? <span className="mt-1 block text-xs font-semibold text-navy-600">{row.subtitle}</span> : null}
              </span>
            </span>
            {row.toggle ? <Toggle enabled /> : <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700">{row.value}<ChevronRight className="h-5 w-5" /></span>}
          </button>
        ))}
      </div>
    </section>
  );
}

export default Preferences;
