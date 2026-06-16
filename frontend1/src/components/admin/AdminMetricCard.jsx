import { CalendarDays, ClipboardList, Clock3, FileText, FlaskConical, IndianRupee, TrendingDown, TrendingUp } from "lucide-react";

const iconMap = {
  calendar: CalendarDays,
  clipboard: ClipboardList,
  clock: Clock3,
  flask: FlaskConical,
  report: FileText,
  rupee: IndianRupee
};

const colorMap = {
  blue: "from-blue-600 to-upchar-blue",
  cyan: "from-cyan-500 to-teal-500",
  green: "from-emerald-500 to-teal-500",
  orange: "from-orange-400 to-orange-600",
  purple: "from-violet-500 to-purple-700",
  red: "from-red-500 to-rose-600"
};

function AdminMetricCard({ metric }) {
  const Icon = iconMap[metric.icon] || CalendarDays;
  const positive = metric.trend !== "down";
  const TrendIcon = positive ? TrendingUp : TrendingDown;

  return (
    <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-5">
        <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${colorMap[metric.color] || colorMap.blue}`}>
          <Icon className="h-8 w-8" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-black text-navy-600">{metric.title}</p>
          <p className="mt-3 break-words text-2xl font-black text-navy-950">{metric.value}</p>
          <p className={`mt-3 inline-flex items-center gap-1 text-sm font-black ${positive ? "text-upchar-green" : "text-upchar-red"}`}>
            <TrendIcon className="h-4 w-4" />
            {metric.growth}
          </p>
        </div>
      </div>
    </article>
  );
}

export default AdminMetricCard;
