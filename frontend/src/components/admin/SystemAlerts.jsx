import { CheckCircle2, Info, TriangleAlert, Wrench } from "lucide-react";

const alertConfig = {
  info: { icon: Info, className: "bg-blue-50 text-upchar-blue" },
  success: { icon: CheckCircle2, className: "bg-green-50 text-upchar-green" },
  system: { icon: Wrench, className: "bg-violet-50 text-upchar-purple" },
  warning: { icon: TriangleAlert, className: "bg-orange-50 text-upchar-orange" }
};

function SystemAlerts({ alerts }) {
  const safeAlerts = Array.isArray(alerts) ? alerts : [];

  return (
    <section className="min-w-0 rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-navy-950">System Alerts</h2>
        <a href="#" className="text-sm font-black text-upchar-blue">View All</a>
      </div>
      <div className="mt-5 divide-y divide-blue-100">
        {safeAlerts.map((alert) => {
          const config = alertConfig[alert.type] || alertConfig.info;
          const Icon = config.icon;
          return (
            <div className="flex gap-4 py-4" key={alert.title}>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${config.className}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-black text-navy-900">{alert.title}</span>
                <span className="mt-1 block text-xs font-semibold text-navy-500">{alert.time}</span>
              </span>
            </div>
          );
        })}
        {!safeAlerts.length ? (
          <div className="py-4 text-sm font-black text-navy-500">
            No system alerts available.
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default SystemAlerts;
