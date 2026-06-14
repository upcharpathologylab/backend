import { ChevronDown } from "lucide-react";

const width = 660;
const height = 270;
const padding = { top: 18, right: 18, bottom: 34, left: 48 };

const makePoints = (values, max) => {
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const divisor = Math.max(values.length - 1, 1);

  return values.map((value, index) => {
    const x = padding.left + (innerWidth / divisor) * index;
    const y = padding.top + innerHeight - (value / max) * innerHeight;
    return [x, y];
  });
};

const pathFromPoints = (points) => points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

const axisLabel = (value) => {
  if (value === 0) return "0";
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return String(value);
};

function BookingOverviewChart({ data }) {
  const labels = Array.isArray(data?.labels) ? data.labels : [];
  const thisWeekValues = Array.isArray(data?.thisWeek) ? data.thisWeek.map((value) => Number(value || 0)) : [];
  const lastWeekValues = Array.isArray(data?.lastWeek) ? data.lastWeek.map((value) => Number(value || 0)) : [];
  const pointCount = Math.max(labels.length, thisWeekValues.length, lastWeekValues.length, 1);
  const safeLabels = labels.length ? labels : Array.from({ length: pointCount }, () => "");
  const safeThisWeekValues = Array.from({ length: pointCount }, (_, index) => thisWeekValues[index] || 0);
  const safeLastWeekValues = Array.from({ length: pointCount }, (_, index) => lastWeekValues[index] || 0);
  const maxValue = Math.max(10, ...safeThisWeekValues, ...safeLastWeekValues);
  const axisMax = Math.ceil(maxValue / 5) * 5;
  const gridLines = Array.from({ length: 6 }, (_, index) => Math.round((axisMax / 5) * index));
  const thisWeek = makePoints(safeThisWeekValues, axisMax);
  const lastWeek = makePoints(safeLastWeekValues, axisMax);

  return (
    <section className="min-w-0 rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-navy-950">Bookings Overview</h2>
        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-md border border-blue-100 px-4 text-sm font-black text-navy-800">
          This Week
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-6 text-sm font-semibold text-navy-700">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-upchar-blue" />This Week</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-blue-200" />Last Week</span>
      </div>

      <div className="mt-4 max-w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[620px]">
          {gridLines.map((line) => {
            const y = padding.top + (height - padding.top - padding.bottom) - (line / axisMax) * (height - padding.top - padding.bottom);
            return (
              <g key={line}>
                <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#e5edf8" />
                <text x="8" y={y + 4} fill="#05235f" fontSize="12" fontWeight="700">{axisLabel(line)}</text>
              </g>
            );
          })}
          <path d={pathFromPoints(lastWeek)} fill="none" stroke="#9aaed0" strokeDasharray="6 6" strokeWidth="2.5" />
          <path d={pathFromPoints(thisWeek)} fill="none" stroke="#1677ff" strokeWidth="3" />
          {lastWeek.map(([x, y], index) => <circle key={`last-${index}`} cx={x} cy={y} r="4" fill="#9aaed0" />)}
          {thisWeek.map(([x, y], index) => <circle key={`this-${index}`} cx={x} cy={y} r="4.5" fill="#1677ff" />)}
          {safeLabels.map((label, index) => {
            const divisor = Math.max(safeLabels.length - 1, 1);
            const x = padding.left + ((width - padding.left - padding.right) / divisor) * index;
            return <text key={`${label}-${index}`} x={x} y={height - 8} textAnchor="middle" fill="#05235f" fontSize="12" fontWeight="700">{label}</text>;
          })}
        </svg>
      </div>
    </section>
  );
}

export default BookingOverviewChart;
