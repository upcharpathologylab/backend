import Icon from "../Icon.jsx";

const colorClasses = {
  blue: "bg-blue-50 text-upchar-blue",
  green: "bg-green-50 text-upchar-green",
  purple: "bg-violet-50 text-upchar-purple",
  red: "bg-red-50 text-upchar-red",
  orange: "bg-orange-50 text-upchar-orange"
};

function SummaryCard({ title, value, icon, color = "blue" }) {
  return (
    <article className="grid min-h-[118px] grid-cols-[70px_1fr] items-center gap-4 rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <span className={`flex h-16 w-16 items-center justify-center rounded-full ${colorClasses[color] || colorClasses.blue}`}>
        <Icon name={icon} className="h-8 w-8" />
      </span>
      <span>
        <span className="block text-sm font-black text-navy-700">{title}</span>
        <span className="mt-2 block break-words text-2xl font-black text-navy-900 sm:text-3xl">{value}</span>
      </span>
    </article>
  );
}

export default SummaryCard;
