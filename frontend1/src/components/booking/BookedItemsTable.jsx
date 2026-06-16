import Icon from "../Icon.jsx";
import { price } from "../../utils.js";

const colorStyles = {
  green: "bg-green-50 text-upchar-green",
  blue: "bg-blue-50 text-upchar-blue",
  purple: "bg-violet-50 text-upchar-purple",
  red: "bg-red-50 text-upchar-red",
  orange: "bg-orange-50 text-upchar-orange"
};

function SummaryRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm font-semibold text-navy-800">
      <span>{label}</span>
      <span className={highlight ? "font-black text-upchar-green" : "font-black text-navy-900"}>{value}</span>
    </div>
  );
}

function BookedItemsTable({ items, summary, title = "Booked Items", totalLabel = "Total Paid" }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <h2 className="text-2xl font-black text-navy-900">{title}</h2>

      <div className="mt-5 hidden rounded-t-md border border-blue-100 bg-blue-50/40 px-4 py-3 text-sm font-black text-navy-700 lg:grid lg:grid-cols-[1fr_120px_80px_110px]">
        <span>Test / Package</span>
        <span>Price</span>
        <span>Qty</span>
        <span>Total</span>
      </div>

      <div className="mt-1">
        {items.map((item) => (
          <article
            className="grid gap-4 border-b border-blue-100 py-5 last:border-b-0 lg:grid-cols-[1fr_120px_80px_110px] lg:items-center"
            key={`${item.type}-${item.id}`}
          >
            <div className="grid gap-4 sm:grid-cols-[74px_1fr] sm:items-center">
              <span className={`flex h-16 w-16 items-center justify-center rounded-full ${colorStyles[item.color] || colorStyles.green}`}>
                <Icon name={item.icon} className="h-8 w-8" />
              </span>
              <div>
                <h3 className="font-black text-navy-900">{item.name}</h3>
                <p className="mt-1 text-sm font-black text-upchar-blue">{item.subtitle}</p>
                <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-navy-600">{item.description}</p>
              </div>
            </div>
            <p className="font-black text-navy-900">
              <span className="mr-2 text-xs uppercase text-navy-500 lg:hidden">Price</span>
              {price(item.price)}
            </p>
            <p className="font-black text-navy-900">
              <span className="mr-2 text-xs uppercase text-navy-500 lg:hidden">Qty</span>
              {item.quantity}
            </p>
            <p className="font-black text-navy-900">
              <span className="mr-2 text-xs uppercase text-navy-500 lg:hidden">Total</span>
              {price(item.price * item.quantity)}
            </p>
          </article>
        ))}
      </div>

      <div className="ml-auto mt-5 grid max-w-sm gap-3 border-t border-blue-100 pt-5">
        <SummaryRow label={`Subtotal (${summary.itemCount} items)`} value={price(summary.subtotal)} />
        <SummaryRow label="Discount" value={`- ${price(summary.discount)}`} highlight />
        <SummaryRow label="Coupon Discount" value={`- ${price(summary.couponDiscount)}`} highlight />
        <div className="border-t border-blue-100 pt-3">
          <SummaryRow label={totalLabel} value={price(summary.totalPayable)} highlight />
        </div>
      </div>
    </section>
  );
}

export default BookedItemsTable;
