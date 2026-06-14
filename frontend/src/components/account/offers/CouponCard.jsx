import { CalendarDays, Info, Tag } from "lucide-react";
import { OfferTicket } from "./OfferCard.jsx";

function CouponCard({ item, onApply }) {
  return (
    <article className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm lg:p-5">
      <div className="grid gap-5 lg:grid-cols-[210px_1fr_170px] lg:items-center">
        <OfferTicket item={item} />
        <div>
          <h3 className="text-lg font-black text-navy-900">{item.title}</h3>
          <div className="mt-5 flex flex-wrap gap-5 text-sm font-semibold text-navy-800">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-upchar-blue" />
              Valid Till <b>{item.validTill}</b>
            </span>
            <span className="inline-flex items-center gap-2">
              <Tag className="h-4 w-4 text-upchar-blue" />
              Min. Order <b>{item.minOrder}</b>
            </span>
          </div>
        </div>
        <div className="grid gap-3">
          <button
            type="button"
            className="h-11 rounded-md border border-upchar-green px-4 text-sm font-black text-upchar-green transition hover:bg-green-50"
            onClick={() => onApply(item)}
          >
            Apply Coupon
          </button>
          <button type="button" className="inline-flex items-center justify-center gap-2 text-xs font-black text-upchar-blue">
            View details
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default CouponCard;
