import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";

function TestFilters({ categories, filters, onChange, onReset, onApply }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr_1fr_1.4fr_auto_auto] xl:items-end">
        <label className="block">
          <span className="mb-2 block text-sm font-black text-navy-950">Search Test</span>
          <span className="relative block">
            <input
              type="search"
              value={filters.query}
              onChange={(event) => update("query", event.target.value)}
              className="h-12 w-full rounded-md border border-blue-100 bg-white px-4 pr-11 text-sm font-semibold text-navy-900 outline-none transition placeholder:text-navy-400 focus:border-upchar-blue"
              placeholder="Search by test name, code..."
            />
            <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-700" />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-black text-navy-950">Category</span>
          <select
            value={filters.category}
            onChange={(event) => update("category", event.target.value)}
            className="h-12 w-full rounded-md border border-blue-100 bg-white px-4 text-sm font-black text-navy-900 outline-none focus:border-upchar-blue"
          >
            <option>All Categories</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-black text-navy-950">Status</span>
          <select
            value={filters.status}
            onChange={(event) => update("status", event.target.value)}
            className="h-12 w-full rounded-md border border-blue-100 bg-white px-4 text-sm font-black text-navy-900 outline-none focus:border-upchar-blue"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </label>

        <div>
          <span className="mb-2 block text-sm font-black text-navy-950">Price Range (Rs.)</span>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(event) => update("minPrice", event.target.value)}
              className="h-12 min-w-0 rounded-md border border-blue-100 px-4 text-sm font-semibold outline-none focus:border-upchar-blue"
              placeholder="Min Price"
            />
            <span className="font-black text-navy-500">-</span>
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(event) => update("maxPrice", event.target.value)}
              className="h-12 min-w-0 rounded-md border border-blue-100 px-4 text-sm font-semibold outline-none focus:border-upchar-blue"
              placeholder="Max Price"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-blue-100 bg-white px-6 text-sm font-black text-navy-900 transition hover:bg-blue-50"
        >
          <RotateCcw className="h-5 w-5" />
          Reset
        </button>
        <button
          type="button"
          onClick={onApply}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-upchar-green px-6 text-sm font-black text-white transition hover:bg-upchar-greenDark"
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filter
        </button>
      </div>
    </section>
  );
}

export default TestFilters;
