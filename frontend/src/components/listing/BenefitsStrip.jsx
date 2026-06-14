import Icon from "../Icon.jsx";

function BenefitsStrip({ items }) {
  return (
    <div className="rounded-lg border border-green-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {items.map((item) => (
          <div className="flex items-center gap-3 border-blue-100 lg:border-r lg:last:border-r-0" key={item.title}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-upchar-green">
              <Icon name={item.icon} className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-sm font-black text-navy-900">{item.title}</span>
              <span className="block text-xs font-semibold text-navy-600">{item.subtitle}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BenefitsStrip;
