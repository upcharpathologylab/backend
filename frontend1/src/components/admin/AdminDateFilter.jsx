import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const presets = [
  { key: "today", label: "Today" },
  { key: "last7", label: "Last 7 Days" },
  { key: "last30", label: "Last 30 Days" },
  { key: "month", label: "This Month" },
  { key: "custom", label: "Custom Range" }
];

const storageKey = "upchar-admin-date-range";

export const toIsoDate = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (value) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const addDays = (value, days) => {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date;
};

export const getAdminDatePresetRange = (preset = "month") => {
  const today = new Date();

  if (preset === "today") {
    return { preset, startDate: toIsoDate(today), endDate: toIsoDate(today) };
  }

  if (preset === "last7") {
    return { preset, startDate: toIsoDate(addDays(today, -6)), endDate: toIsoDate(today) };
  }

  if (preset === "last30") {
    return { preset, startDate: toIsoDate(addDays(today, -29)), endDate: toIsoDate(today) };
  }

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { preset: "month", startDate: toIsoDate(firstDay), endDate: toIsoDate(lastDay) };
};

export const getDefaultAdminDateRange = () => getAdminDatePresetRange("month");

export const dateRangeToValue = (range) => `${range.startDate} - ${range.endDate}`;

export const getDefaultAdminDateRangeValue = () => dateRangeToValue(getDefaultAdminDateRange());

export const parseAdminDateRange = (value) => {
  if (!value) return getDefaultAdminDateRange();
  if (typeof value === "object" && value.startDate && value.endDate) {
    return { preset: value.preset || "custom", startDate: value.startDate, endDate: value.endDate };
  }

  const parts = String(value).split(" - ").map((part) => part.trim());
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { preset: "custom", startDate: parts[0], endDate: parts[1] };
  }

  return getDefaultAdminDateRange();
};

export const formatAdminDateRange = (range) => {
  const start = new Date(`${range.startDate}T00:00:00`);
  const end = new Date(`${range.endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "This Month";
  const formatter = new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric", year: "numeric" });
  return `${formatter.format(start)} - ${formatter.format(end)}`;
};

export const matchesAdminDateRange = (rowValue, rangeValue) => {
  const range = parseAdminDateRange(rangeValue);
  const rowDate = new Date(rowValue);
  if (Number.isNaN(rowDate.getTime())) return false;
  return rowDate >= startOfDay(`${range.startDate}T00:00:00`) && rowDate <= endOfDay(`${range.endDate}T00:00:00`);
};

function storedRange() {
  if (typeof window === "undefined") return getDefaultAdminDateRange();
  try {
    return parseAdminDateRange(window.localStorage.getItem(storageKey));
  } catch {
    return getDefaultAdminDateRange();
  }
}

export function useAdminDateRange() {
  const [searchParams, setSearchParams] = useSearchParams();
  const range = useMemo(() => {
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate && endDate) return { preset: searchParams.get("datePreset") || "custom", startDate, endDate };
    return storedRange();
  }, [searchParams]);

  const setRange = (nextRange) => {
    const normalized = parseAdminDateRange(nextRange);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("datePreset", normalized.preset || "custom");
    nextParams.set("startDate", normalized.startDate);
    nextParams.set("endDate", normalized.endDate);
    setSearchParams(nextParams, { replace: true });
    try {
      window.localStorage.setItem(storageKey, dateRangeToValue(normalized));
    } catch {
      // Local storage can be disabled; URL params still carry the range.
    }
  };

  return { range, value: dateRangeToValue(range), label: formatAdminDateRange(range), setRange };
}

function AdminDateFilter({ value, onChange, compact = false, buttonClassName = "", label = "" }) {
  const globalRange = useAdminDateRange();
  const activeRange = parseAdminDateRange(value || globalRange.value);
  const [open, setOpen] = useState(false);
  const [customRange, setCustomRange] = useState(activeRange);

  const applyRange = (range) => {
    const nextRange = parseAdminDateRange(range);
    onChange?.(dateRangeToValue(nextRange), nextRange);
    globalRange.setRange(nextRange);
  };

  const applyPreset = (preset) => {
    if (preset === "custom") {
      setCustomRange(activeRange);
      return;
    }
    applyRange(getAdminDatePresetRange(preset));
    setOpen(false);
  };

  const applyCustom = () => {
    applyRange({ preset: "custom", startDate: customRange.startDate, endDate: customRange.endDate });
    setOpen(false);
  };

  const displayLabel = formatAdminDateRange(activeRange);
  const buttonClasses =
    buttonClassName ||
    "inline-flex h-11 w-full items-center justify-between gap-3 rounded-md border border-blue-100 bg-white px-4 text-sm font-black text-navy-900 shadow-sm";

  return (
    <div className="relative">
      {label ? <span className="mb-2 block text-sm font-black text-navy-950">{label}</span> : null}
      <button type="button" className={buttonClasses} onClick={() => setOpen((current) => !current)}>
        <span className="inline-flex min-w-0 items-center gap-3">
          <CalendarDays className="h-5 w-5 shrink-0" />
          <span className="truncate">{displayLabel}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0" />
      </button>

      {open ? (
        <div className={`absolute right-0 top-[calc(100%+0.5rem)] z-50 w-80 rounded-lg border border-blue-100 bg-white p-3 shadow-soft ${compact ? "" : "left-0 right-auto"}`}>
          <div className="grid gap-2">
            {presets.map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => applyPreset(preset.key)}
                className={`rounded-md px-3 py-2 text-left text-sm font-black transition hover:bg-blue-50 ${activeRange.preset === preset.key ? "bg-blue-50 text-upchar-blue" : "text-navy-800"}`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-blue-100 pt-3">
            <label className="grid gap-1 text-xs font-black text-navy-700">
              From
              <input
                type="date"
                value={customRange.startDate}
                onChange={(event) => setCustomRange((current) => ({ ...current, preset: "custom", startDate: event.target.value }))}
                className="h-10 rounded-md border border-blue-100 px-3 text-sm font-semibold text-navy-900 outline-none focus:border-upchar-blue"
              />
            </label>
            <label className="grid gap-1 text-xs font-black text-navy-700">
              To
              <input
                type="date"
                value={customRange.endDate}
                onChange={(event) => setCustomRange((current) => ({ ...current, preset: "custom", endDate: event.target.value }))}
                className="h-10 rounded-md border border-blue-100 px-3 text-sm font-semibold text-navy-900 outline-none focus:border-upchar-blue"
              />
            </label>
          </div>
          <button type="button" onClick={applyCustom} className="mt-3 h-10 w-full rounded-md bg-upchar-green text-sm font-black text-white">
            Apply Custom Range
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default AdminDateFilter;
