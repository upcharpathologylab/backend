import { Tag } from "lucide-react";

function CouponBox({ couponCode, onCouponChange, onApply }) {
  return (
    <div className="mt-4 grid gap-4 rounded-lg border border-dashed border-blue-200 bg-blue-50/20 p-4 md:grid-cols-[1fr_260px_auto] md:items-center">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-upchar-green">
          <Tag className="h-7 w-7" />
        </span>
        <div>
          <h3 className="text-base font-black text-navy-900">Have a coupon code?</h3>
          <p className="mt-1 text-sm font-semibold text-navy-700">Apply code to get instant discount</p>
        </div>
      </div>
      <input
        value={couponCode}
        onChange={(event) => onCouponChange(event.target.value)}
        placeholder="Enter coupon code"
        className="h-11 rounded-md border border-blue-100 bg-white px-4 text-sm font-semibold text-navy-900 outline-none placeholder:text-navy-400 focus:border-upchar-blue focus:ring-4 focus:ring-upchar-blue/10"
      />
      <button
        type="button"
        onClick={onApply}
        className="h-11 rounded-md bg-upchar-green px-7 text-sm font-black text-white transition hover:bg-upchar-greenDark"
      >
        Apply
      </button>
    </div>
  );
}

export default CouponBox;
