import { TicketCheck } from "lucide-react";
import Icon from "../Icon.jsx";
import { whyPayItems } from "../../data/paymentData.js";
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

function PaymentOrderSummary({ items, summary }) {
  return (
    <aside className="grid gap-5 self-start xl:sticky xl:top-32">
      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-navy-900">Order Summary</h2>
          <span className="text-sm font-bold text-navy-600">{summary.itemCount} Items</span>
        </div>

        <div className="mt-5 grid gap-4">
          {items.map((item) => (
            <div className="grid grid-cols-[54px_1fr_auto] items-center gap-4" key={`${item.type}-${item.id}`}>
              <span className={`flex h-12 w-12 items-center justify-center rounded-full ${colorStyles[item.color] || colorStyles.green}`}>
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-black text-navy-900">{item.name}</p>
                <p className="mt-1 text-xs font-bold text-upchar-blue">Qty: {item.quantity}</p>
              </div>
              <span className="text-base font-black text-navy-900">{price(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="my-6 border-t border-blue-100" />
        <div className="grid gap-4">
          <SummaryRow label={`Subtotal (${summary.itemCount} items)`} value={price(summary.subtotal)} />
          <SummaryRow label="Discount" value={`- ${price(summary.discount)}`} highlight />
          <SummaryRow label="Coupon Discount" value={`- ${price(summary.couponDiscount)}`} highlight />
        </div>

        <div className="my-6 border-t border-blue-100" />
        <div className="flex items-end justify-between gap-4">
          <span className="text-lg font-black text-navy-900">Total Payable</span>
          <span className="text-4xl font-black text-upchar-green">{price(summary.totalPayable)}</span>
        </div>

        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="flex items-center justify-center gap-2 text-sm font-bold text-upchar-green">
            <TicketCheck className="h-5 w-5" />
            You save {price(summary.totalSavings)} on this order
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
        <h2 className="text-xl font-black text-navy-900">Why pay with Upchar?</h2>
        <div className="mt-5 grid gap-4">
          {whyPayItems.map((item) => (
            <div className="grid grid-cols-[46px_1fr] gap-4" key={item.title}>
              <span className={`flex h-11 w-11 items-center justify-center rounded-full ${colorStyles[item.color] || colorStyles.blue}`}>
                <Icon name={item.icon} className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-black text-navy-900">{item.title}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-navy-600">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}

export default PaymentOrderSummary;
