import { BadgeCheck, LockKeyhole, RotateCcw, ShoppingCart, Sparkles, TicketCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { price } from "../../utils.js";

function SummaryRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm font-semibold text-navy-800">
      <span>{label}</span>
      <span className={highlight ? "font-black text-upchar-green" : "font-black text-navy-900"}>{value}</span>
    </div>
  );
}

function CartSummary({ summary, onCheckout }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm lg:sticky lg:top-32">
      <h2 className="text-2xl font-black text-navy-900">Order Summary</h2>

      <div className="mt-6 grid gap-4">
        <SummaryRow label={`Subtotal (${summary.itemCount} items)`} value={price(summary.subtotal)} />
        <SummaryRow label="Discount" value={`- ${price(summary.discount)}`} highlight />
        <SummaryRow label="Coupon Discount" value={`- ${price(summary.couponDiscount)}`} highlight />
      </div>

      <div className="my-6 border-t border-blue-100" />

      <div className="flex items-end justify-between gap-4">
        <span className="text-xl font-black text-navy-900">Total Payable</span>
        <span className="text-4xl font-black text-upchar-green">{price(summary.totalPayable)}</span>
      </div>

      <p className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-upchar-green">
        <TicketCheck className="h-5 w-5" />
        You save {price(summary.totalSavings)} on this order
      </p>

      <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="flex items-center gap-2 text-base font-black text-upchar-green">
          <Sparkles className="h-5 w-5" />
          Yay! You saved more!
        </p>
        <p className="mt-2 text-sm font-bold text-navy-800">Extra savings of {price(summary.totalSavings)} on this order.</p>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-md bg-upchar-green text-sm font-black text-white shadow-lg shadow-green-900/15 transition hover:bg-upchar-greenDark"
      >
        <ShoppingCart className="h-5 w-5" />
        Proceed to Checkout
      </button>
      <p className="my-3 text-center text-sm font-bold text-navy-500">or</p>
      <Link
        to="/packages"
        className="flex h-11 w-full items-center justify-center gap-3 rounded-md border border-blue-100 bg-white text-sm font-black text-upchar-blue transition hover:bg-blue-50"
      >
        <ShoppingCart className="h-5 w-5" />
        Continue Shopping
      </Link>

      <div className="mt-7 grid grid-cols-3 gap-2 text-center text-[11px] font-black text-navy-700">
        <span className="flex items-center justify-center gap-1">
          <BadgeCheck className="h-4 w-4 text-upchar-blue" />
          Secure Payment
        </span>
        <span className="flex items-center justify-center gap-1">
          <LockKeyhole className="h-4 w-4 text-upchar-blue" />
          100% Confidential
        </span>
        <span className="flex items-center justify-center gap-1">
          <RotateCcw className="h-4 w-4 text-upchar-blue" />
          Easy Returns
        </span>
      </div>
    </section>
  );
}

export default CartSummary;
