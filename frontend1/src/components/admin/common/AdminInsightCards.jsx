import { ChevronRight, ShieldCheck } from "lucide-react";

export function AdminTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex flex-wrap border-b border-blue-100">
      {tabs.map((tab) => (
        <button
          type="button"
          className={`min-h-12 border-b-2 px-6 text-sm font-black transition ${
            activeTab === tab.key ? "border-upchar-green text-upchar-green" : "border-transparent text-navy-700 hover:text-upchar-blue"
          }`}
          key={tab.key}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function AdminDonutCard({ chart, footer, segments, title }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-navy-950">{title}</h2>
      <div className="mt-5 flex items-center gap-5">
        <div className={`relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full ${chart}`}>
          <div className="h-16 w-16 rounded-full bg-white shadow-sm" />
        </div>
        <div className="grid flex-1 gap-3">
          {segments.map((item) => (
            <div className="flex items-center justify-between gap-3 text-sm font-semibold text-navy-800" key={item.label}>
              <span className="flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${item.color}`} />
                {item.label}
              </span>
              <span className="font-black">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      {footer ? <p className="mt-5 text-center text-sm font-black text-navy-800">{footer}</p> : null}
    </section>
  );
}

export function AdminRecentCard({ items, link, title }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-navy-950">{title}</h2>
        {link ? <span className="text-xs font-black text-upchar-blue">{link}</span> : null}
      </div>
      <div className="mt-4 grid gap-4">
        {items.map((item) => (
          <article className="flex items-start gap-3" key={`${item.title}-${item.text}`}>
            <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${item.iconClass || "bg-blue-50 text-upchar-blue"}`}>
              {item.initials || item.title.split(" ").map((part) => part[0]).join("").slice(0, 2)}
            </span>
            <span>
              <span className="block text-sm font-black text-navy-950">{item.title}</span>
              <span className="block text-xs font-semibold leading-5 text-navy-600">{item.text}</span>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AdminActionsCard({ items, onAction, title }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-black text-navy-950">{title}</h2>
      <div className="mt-4 grid gap-2">
        {items.map((item) => (
          <button
            type="button"
            className="flex min-h-11 items-center justify-between gap-3 rounded-md px-3 text-left text-sm font-black text-navy-900 transition hover:bg-blue-50"
            key={item}
            onClick={() => onAction(item)}
          >
            {item}
            <ChevronRight className="h-4 w-4 text-navy-500" />
          </button>
        ))}
      </div>
    </section>
  );
}

export function AdminInfoNotice({ actionLabel, onAction, text, title }) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-green-100 bg-green-50/50 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-upchar-green">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <span>
          <span className="block text-lg font-black text-upchar-green">{title}</span>
          <span className="block text-sm font-semibold leading-6 text-navy-700">{text}</span>
        </span>
      </div>
      {actionLabel ? (
        <button type="button" onClick={onAction} className="h-11 rounded-md border border-blue-200 bg-white px-6 text-sm font-black text-upchar-blue">
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
