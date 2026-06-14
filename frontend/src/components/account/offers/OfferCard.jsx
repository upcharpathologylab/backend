import { CalendarDays, Tag } from "lucide-react";

const ticketClasses = {
  blue: "bg-blue-50 text-upchar-blue",
  green: "bg-green-50 text-upchar-green",
  orange: "bg-orange-50 text-upchar-orange",
  purple: "bg-violet-50 text-upchar-purple",
  red: "bg-red-50 text-upchar-red"
};

function OfferTicket({ item }) {
  return (
    <div className={`flex min-h-[130px] items-center justify-center rounded-md p-4 text-center ${ticketClasses[item.color] || ticketClasses.green}`}>
      <span>
        <span className="block text-4xl font-black">{item.value}</span>
        <span className="block text-xl font-black">{item.suffix}</span>
        <span className="mt-2 block text-xs font-black uppercase">{item.label}</span>
      </span>
    </div>
  );
}

function OfferCard({ item, onAction }) {
  return (
    <article className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm lg:p-5">
      <div className="grid gap-5 lg:grid-cols-[210px_1fr_190px] lg:items-center">
        <OfferTicket item={item} />
        <div>
          <h3 className="text-lg font-black text-navy-900">{item.title}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">{item.text}</p>
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
            className="h-11 rounded-md border border-upchar-blue px-4 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
            onClick={() => onAction(item)}
          >
            View Details
          </button>
          <span className="rounded-md bg-green-50 px-3 py-2 text-center text-xs font-black text-upchar-green">
            {item.badge}
          </span>
        </div>
      </div>
    </article>
  );
}

export default OfferCard;
export { OfferTicket };
