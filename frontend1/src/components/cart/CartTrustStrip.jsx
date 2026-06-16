import Icon from "../Icon.jsx";

function CartTrustStrip({ items }) {
  return (
    <div className="mt-4 grid gap-3 rounded-lg bg-green-50/40 p-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div className="flex items-center gap-3" key={item.title}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-upchar-green shadow-sm">
            <Icon name={item.icon} className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-sm font-black text-navy-900">{item.title}</span>
            <span className="block text-xs font-semibold text-navy-600">{item.subtitle}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default CartTrustStrip;
