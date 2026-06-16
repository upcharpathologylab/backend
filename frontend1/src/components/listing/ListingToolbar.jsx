import { Grid2X2, List } from "lucide-react";

const defaultSortOptions = [
  { value: "popular", label: "Popularity" },
  { value: "price-low", label: "Price Low to High" },
  { value: "price-high", label: "Price High to Low" },
  { value: "newest", label: "Newest" }
];

function ListingToolbar({ label, sort, onSortChange, viewMode, onViewModeChange, sortOptions = defaultSortOptions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-base font-black text-navy-900">{label}</p>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-black text-navy-900">
          Sort By:
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="h-10 rounded-lg border border-blue-100 bg-white px-4 text-sm font-bold text-navy-800 outline-none focus:ring-4 focus:ring-upchar-blue/10"
          >
            {sortOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="flex rounded-lg border border-blue-100 bg-white p-1">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`flex h-9 w-9 items-center justify-center rounded-md ${
              viewMode === "grid" ? "bg-upchar-green text-white" : "text-navy-500 hover:text-upchar-green"
            }`}
            aria-label="Grid view"
          >
            <Grid2X2 className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`flex h-9 w-9 items-center justify-center rounded-md ${
              viewMode === "list" ? "bg-upchar-green text-white" : "text-navy-500 hover:text-upchar-green"
            }`}
            aria-label="List view"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListingToolbar;
