import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import AdminDateFilter, { useAdminDateRange } from "../AdminDateFilter.jsx";

const inputClass = "h-12 w-full rounded-md border border-blue-100 bg-white px-4 text-sm font-semibold text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue";

function AdminFilterCard({ filters, values, onChange, onReset, onApply }) {
  const globalDateRange = useAdminDateRange();
  const update = (key, value) => onChange({ ...values, [key]: value });

  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="grid gap-5 xl:grid-cols-12 xl:items-end">
        {filters.map((filter) => {
          if (filter.type === "priceRange") {
            return (
              <div className="xl:col-span-3" key={filter.key}>
                <span className="mb-2 block text-sm font-black text-navy-950">{filter.label}</span>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    value={values.minPrice || ""}
                    onChange={(event) => update("minPrice", event.target.value)}
                    className={inputClass}
                    placeholder="Min Price"
                  />
                  <span className="font-black text-navy-500">-</span>
                  <input
                    type="number"
                    min="0"
                    value={values.maxPrice || ""}
                    onChange={(event) => update("maxPrice", event.target.value)}
                    className={inputClass}
                    placeholder="Max Price"
                  />
                </div>
              </div>
            );
          }

          if (filter.type === "select") {
            return (
              <label className="block xl:col-span-2" key={filter.key}>
                <span className="mb-2 block text-sm font-black text-navy-950">{filter.label}</span>
                <select value={values[filter.key]} onChange={(event) => update(filter.key, event.target.value)} className={`${inputClass} font-black`}>
                  {filter.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            );
          }

          if (filter.type === "date") {
            return (
              <div className="block xl:col-span-2" key={filter.key}>
                <AdminDateFilter
                  label={filter.label}
                  value={values[filter.key] || globalDateRange.value}
                  onChange={(value) => update(filter.key, value)}
                  buttonClassName={`${inputClass} justify-between pr-4 text-left font-black`}
                />
              </div>
            );
          }

          return (
            <label className="block xl:col-span-3" key={filter.key}>
              <span className="mb-2 block text-sm font-black text-navy-950">{filter.label}</span>
              <span className="relative block">
                <input
                  type="search"
                  value={values[filter.key] || ""}
                  onChange={(event) => update(filter.key, event.target.value)}
                  className={`${inputClass} pr-11`}
                  placeholder={filter.placeholder}
                />
                <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-700" />
              </span>
            </label>
          );
        })}

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-blue-100 bg-white px-6 text-sm font-black text-navy-900 transition hover:bg-blue-50 xl:col-span-1"
        >
          <RotateCcw className="h-5 w-5" />
          Reset
        </button>
        <button
          type="button"
          onClick={onApply}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-upchar-green px-6 text-sm font-black text-white transition hover:bg-upchar-greenDark xl:col-span-1"
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filter
        </button>
      </div>
    </section>
  );
}

export default AdminFilterCard;
