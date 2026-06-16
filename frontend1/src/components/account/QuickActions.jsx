import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Icon from "../Icon.jsx";
import { quickAccountActions } from "../../data/accountPagesData.js";

function QuickActions({ title = "Quick Actions", actions = quickAccountActions }) {
  return (
    <section className="rounded-lg border border-green-100 bg-green-50/40 p-5 shadow-sm lg:p-6">
      <h2 className="text-lg font-black text-navy-900">{title}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const content = (
            <>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-upchar-green shadow-sm">
                <Icon name={action.icon} className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black text-navy-900">{action.title}</span>
                {action.subtitle ? <span className="mt-1 block text-xs font-semibold text-navy-600">{action.subtitle}</span> : null}
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-navy-700" />
            </>
          );

          return action.href ? (
            <Link
              to={action.href}
              className="flex items-center gap-3 rounded-md border border-transparent p-3 transition hover:border-green-100 hover:bg-white"
              key={action.title}
            >
              {content}
            </Link>
          ) : (
            <button
              type="button"
              className="flex items-center gap-3 rounded-md border border-transparent p-3 text-left transition hover:border-green-100 hover:bg-white"
              key={action.title}
              onClick={action.onClick}
            >
              {content}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default QuickActions;
