import { CheckCircle2 } from "lucide-react";
import Icon from "../../Icon.jsx";
import { price } from "../../../utils.js";

const colorClasses = {
  blue: "bg-blue-50 text-upchar-blue",
  green: "bg-green-50 text-upchar-green",
  orange: "bg-orange-50 text-upchar-orange",
  purple: "bg-violet-50 text-upchar-purple",
  red: "bg-red-50 text-upchar-red"
};

function SavedPackageCard({ item, onBook }) {
  return (
    <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr_180px_150px] xl:items-center">
        <div className="flex gap-4">
          <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${colorClasses[item.color] || colorClasses.green}`}>
            <Icon name={item.icon} className="h-8 w-8" />
          </span>
          <div>
            <h3 className="text-lg font-black text-navy-900">{item.title}</h3>
            <p className="mt-1 text-sm font-black text-upchar-blue">{item.subtitle}</p>
            <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-navy-700">{item.description}</p>
          </div>
        </div>

        <ul className="grid gap-2 text-sm font-semibold text-navy-800">
          {item.benefits.map((benefit) => (
            <li className="inline-flex items-center gap-2" key={benefit}>
              <CheckCircle2 className="h-4 w-4 text-upchar-green" />
              {benefit}
            </li>
          ))}
        </ul>

        <div>
          <p className="text-3xl font-black text-upchar-green">{price(item.price)}</p>
          <p className="mt-1 text-sm font-bold text-navy-400 line-through">{price(item.oldPrice)}</p>
          <p className="mt-2 text-sm font-black text-upchar-green">{item.discount}</p>
        </div>

        <div className="text-left xl:text-center">
          <p className="text-sm font-semibold text-navy-700">Saved on</p>
          <p className="mt-1 text-base font-black text-navy-900">{item.savedOn}</p>
          <button
            type="button"
            className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-upchar-green px-4 text-sm font-black text-white transition hover:bg-upchar-greenDark"
            onClick={() => onBook(item)}
          >
            Book Now
          </button>
        </div>
      </div>
    </article>
  );
}

export default SavedPackageCard;
