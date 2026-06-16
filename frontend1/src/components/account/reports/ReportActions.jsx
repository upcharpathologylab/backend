import Icon from "../../Icon.jsx";

const actions = [
  { title: "Download All Available", subtitle: "Get all available reports", icon: "CloudDownload" },
  { title: "Share Reports", subtitle: "Share with doctor or family", icon: "Share2" },
  { title: "Email Reports", subtitle: "Send reports to your email", icon: "Mail" },
  { title: "Print Reports", subtitle: "Take a print of your reports", icon: "Printer" }
];

function ReportActions({ onAction }) {
  return (
    <aside className="grid gap-5 self-start">
      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-navy-900">Quick Actions</h2>
        <div className="mt-5 grid gap-3">
          {actions.map((action) => (
            <button
              type="button"
              className="flex items-center gap-4 rounded-md border border-blue-100 p-4 text-left transition hover:bg-blue-50"
              key={action.title}
              onClick={() => onAction(action.title)}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-upchar-blue">
                <Icon name={action.icon} className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-sm font-black text-navy-900">{action.title}</span>
                <span className="mt-1 block text-xs font-semibold text-navy-600">{action.subtitle}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-green-100 bg-green-50/50 p-5 shadow-sm">
        <div className="flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-upchar-green">
            <Icon name="ShieldCheck" className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-lg font-black text-upchar-green">Reports are Verified</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-navy-700">
              All our reports are digitally verified by certified pathologists and are 100% accurate.
            </p>
            <span className="mt-4 inline-flex rounded-md bg-white px-4 py-2 text-xs font-black text-upchar-green">
              NABL Accredited Lab
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-navy-900">Need Help?</h2>
        <p className="mt-2 text-sm font-semibold text-navy-700">Facing any issue with your reports?</p>
        <button
          type="button"
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-md border border-blue-100 px-4 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
          onClick={() => onAction("Chat with Support")}
        >
          Chat with Support
        </button>
      </section>
    </aside>
  );
}

export default ReportActions;
