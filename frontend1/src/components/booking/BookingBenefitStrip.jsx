import Icon from "../Icon.jsx";

const colorStyles = {
  green: "bg-green-50 text-upchar-green",
  blue: "bg-blue-50 text-upchar-blue",
  purple: "bg-violet-50 text-upchar-purple",
  orange: "bg-orange-50 text-upchar-orange"
};

function BookingBenefitStrip({ items }) {
  const columnsClass = items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5";

  return (
    <section className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm">
      <div className={`grid gap-4 sm:grid-cols-2 ${columnsClass}`}>
        {items.map((item) => (
          <div className="grid gap-3 border-blue-100 p-3 lg:grid-cols-[46px_1fr] lg:border-r lg:last:border-r-0" key={item.title}>
            <span className={`flex h-11 w-11 items-center justify-center rounded-full ${colorStyles[item.color] || colorStyles.green}`}>
              <Icon name={item.icon} className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-sm font-black text-navy-900">{item.title}</h3>
              <p className="mt-1 text-xs font-semibold leading-5 text-navy-600">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BookingBenefitStrip;
