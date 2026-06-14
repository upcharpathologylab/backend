import { ClipboardList, FlaskConical, IndianRupee, Tag } from "lucide-react";

const iconMap = {
  clipboard: ClipboardList,
  flask: FlaskConical,
  rupee: IndianRupee,
  tag: Tag
};

const colorMap = {
  blue: "bg-blue-50 text-upchar-blue",
  green: "bg-green-50 text-upchar-green",
  orange: "bg-orange-50 text-upchar-orange",
  purple: "bg-violet-50 text-upchar-purple"
};

function TestStatsCards({ stats }) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] || FlaskConical;
        return (
          <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm" key={stat.title}>
            <div className="flex items-center gap-5">
              <span className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl ${colorMap[stat.color] || colorMap.green}`}>
                <Icon className="h-10 w-10" />
              </span>
              <span>
                <span className="block text-sm font-black text-navy-600">{stat.title}</span>
                <span className="mt-2 block text-4xl font-black leading-none text-navy-950">{stat.value}</span>
                <span className="mt-3 block text-sm font-semibold text-navy-800">{stat.text}</span>
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default TestStatsCards;
