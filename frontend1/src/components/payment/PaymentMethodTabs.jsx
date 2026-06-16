import { ChevronRight } from "lucide-react";
import Icon from "../Icon.jsx";

function PaymentMethodTabs({ methods, selectedMethod, onSelect }) {
  return (
    <div>
      <h2 className="text-xl font-black text-navy-900">Select Payment Method</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-1">
        {methods.map((method) => {
          const active = selectedMethod === method.id;

          return (
            <button
              type="button"
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`group flex min-h-[86px] items-center gap-4 rounded-lg border p-4 text-left transition ${
                active
                  ? "border-upchar-green bg-green-50/70 shadow-sm"
                  : "border-blue-100 bg-white hover:border-blue-200 hover:bg-blue-50/40"
              }`}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${active ? "bg-white text-upchar-green" : "bg-blue-50 text-navy-800"}`}>
                <Icon name={method.icon} className="h-7 w-7" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-black text-navy-900">{method.label}</span>
                <span className="mt-1 block text-sm font-semibold text-navy-600">{method.subtitle}</span>
              </span>
              <ChevronRight className={`h-5 w-5 ${active ? "text-upchar-green" : "text-navy-400 group-hover:text-upchar-blue"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PaymentMethodTabs;
