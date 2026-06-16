import { ChevronDown } from "lucide-react";

function CheckboxRow({ label, checked, onChange, count }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-navy-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-blue-200 text-upchar-green focus:ring-upchar-green/30"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined ? <span className="text-xs text-navy-500">({count})</span> : null}
    </label>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="border-t border-blue-100 pt-5 first:border-t-0 first:pt-0">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-black text-navy-900">{title}</h3>
        <ChevronDown className="h-4 w-4 text-navy-700" />
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function FilterSidebar({ title = "Filters", children, onClear }) {
  return (
    <aside className="min-w-0 rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:sticky lg:top-32 lg:self-start">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-black text-navy-900">{title}</h2>
        <button type="button" className="text-xs font-black text-upchar-blue hover:text-upchar-green" onClick={onClear}>
          Clear All
        </button>
      </div>
      <div className="grid gap-6">{children}</div>
    </aside>
  );
}

export { CheckboxRow, FilterSection };
export default FilterSidebar;
