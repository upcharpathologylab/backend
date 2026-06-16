import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";
import { quickActions } from "../../data/profileData.js";

function QuickActions() {
  return (
    <section className="rounded-lg border border-green-100 bg-green-50/40 p-5 shadow-sm lg:p-6">
      <h2 className="text-xl font-black text-navy-900">Quick Actions</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            to={action.href}
            className="flex items-center gap-4 rounded-lg bg-white/80 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
            key={action.title}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-upchar-green">
              <Icon name={action.icon} className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-black text-navy-900">{action.title}</span>
              <span className="mt-1 block text-xs font-semibold text-navy-600">{action.subtitle}</span>
            </span>
            <ChevronRight className="h-5 w-5 text-navy-400" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;
