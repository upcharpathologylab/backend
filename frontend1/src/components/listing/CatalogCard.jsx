import { Clock3, Heart, Home, Star } from "lucide-react";
import { assetUrl } from "../../api/api.js";
import Icon from "../Icon.jsx";
import { price } from "../../utils.js";

const colorStyles = {
  blue: {
    icon: "bg-blue-50 text-upchar-blue",
    badge: "bg-upchar-blue"
  },
  green: {
    icon: "bg-green-50 text-upchar-green",
    badge: "bg-upchar-green"
  },
  red: {
    icon: "bg-red-50 text-upchar-red",
    badge: "bg-upchar-red"
  },
  orange: {
    icon: "bg-orange-50 text-upchar-orange",
    badge: "bg-upchar-orange"
  },
  purple: {
    icon: "bg-violet-50 text-upchar-purple",
    badge: "bg-upchar-purple"
  },
  teal: {
    icon: "bg-teal-50 text-upchar-teal",
    badge: "bg-upchar-teal"
  }
};

const getColor = (color = "blue") => colorStyles[color] || colorStyles.blue;

function MetaItem({ icon, label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-navy-500">{label}</p>
      <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-black text-navy-900">
        {icon}
        {value}
      </p>
    </div>
  );
}

function PackageCard({ item, viewMode = "grid", onAddToCart, onDetails }) {
  const color = getColor(item.color);
  const isList = viewMode === "list";
  const buttonLabel = item.buttonText || "Book Now";
  const buttonLink = item.buttonLink;
  const buttonClass = "rounded-md bg-upchar-green px-4 py-2 text-center text-sm font-black text-white transition hover:bg-upchar-greenDark";

  return (
    <article
      className={`relative rounded-lg border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-card ${
        isList ? "grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center" : "min-h-[315px]"
      }`}
    >
      {item.badge ? (
        <span className={`absolute left-4 top-4 rounded-md px-2.5 py-1 text-[10px] font-black uppercase text-white ${color.badge}`}>
          {item.badge}
        </span>
      ) : null}

      <div className={`${isList ? "" : "pt-6 text-center"}`}>
        <span className={`mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full ${color.icon}`}>
          {item.image ? (
            <img src={assetUrl(item.image)} alt={item.name} className="h-full w-full rounded-full object-cover" />
          ) : (
            <Icon name={item.icon} className="h-10 w-10" />
          )}
        </span>
      </div>

      <div className={`${isList ? "" : "text-center"}`}>
        <h3 className="mt-4 text-lg font-black leading-6 text-navy-900">{item.name}</h3>
        <p className="mt-1 text-sm font-black text-upchar-blue">{item.testCount}</p>
        <p className="mx-auto mt-3 max-w-xs text-sm font-semibold leading-6 text-navy-600">{item.description}</p>

        <div className="mt-5 flex items-end justify-center gap-3">
          <span className="text-xl font-black text-upchar-green">{price(item.discountedPrice)}</span>
          <span className="text-sm font-bold text-navy-400 line-through">{price(item.originalPrice)}</span>
          <span className="text-xs font-black text-upchar-green">{item.discount}</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-left">
          <MetaItem icon={<Home className="h-3.5 w-3.5 text-upchar-green" />} label="Home Collection" value="Available" />
          <MetaItem icon={<Clock3 className="h-3.5 w-3.5 text-upchar-blue" />} label="Reports in" value={item.reportTime} />
        </div>
      </div>

      <div className={`${isList ? "grid gap-2" : "mt-5 grid grid-cols-2 gap-3"}`}>
        <button
          type="button"
          onClick={() => onDetails(item)}
          className="rounded-md border border-upchar-blue px-4 py-2 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
        >
          View Details
        </button>
        {buttonLink && buttonLink !== "#booking" ? (
          <a href={buttonLink} className={buttonClass}>
            {buttonLabel}
          </a>
        ) : (
          <button type="button" onClick={() => onAddToCart(item)} className={buttonClass}>
            {buttonLabel}
          </button>
        )}
      </div>
    </article>
  );
}

function TestCard({ item, viewMode = "grid", onAddToCart, onDetails }) {
  const color = getColor(item.color);
  const isList = viewMode === "list";

  return (
    <article
      className={`relative rounded-lg border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-card ${
        isList ? "grid gap-5 sm:grid-cols-[auto_1fr_auto] sm:items-center" : "flex h-full min-h-[390px] flex-col"
      }`}
    >
      {item.badge ? (
        <span className={`absolute left-4 top-4 rounded-md px-2.5 py-1 text-[10px] font-black text-white ${color.badge}`}>
          {item.badge}
        </span>
      ) : null}
      <button type="button" aria-label="Save test" className="absolute right-4 top-4 text-navy-400 hover:text-upchar-red">
        <Heart className="h-5 w-5" />
      </button>

      <div className={`${isList ? "" : "pt-6 text-center"}`}>
        <span className={`mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full ${color.icon}`}>
          {item.image ? (
            <img src={assetUrl(item.image)} alt={item.name} className="h-full w-full rounded-full object-cover" />
          ) : (
            <Icon name={item.icon} className="h-10 w-10" />
          )}
        </span>
      </div>

      <div className={`${isList ? "" : "flex flex-1 flex-col text-center"}`}>
        <h3 className="mt-4 text-lg font-black leading-6 text-navy-900">{item.name}</h3>
        <p className="mt-1 text-sm font-semibold text-navy-600">{item.subtitle}</p>

        <div className="mt-5 flex items-end justify-center gap-3">
          <span className="text-xl font-black text-upchar-green">{price(item.discountedPrice)}</span>
          <span className="text-sm font-bold text-navy-400 line-through">{price(item.originalPrice)}</span>
          <span className="text-xs font-black text-upchar-green">{item.discount}</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          <MetaItem icon={<Clock3 className="h-3.5 w-3.5 text-upchar-blue" />} label="Reports in" value={item.reportTime} />
          <MetaItem icon={<Home className="h-3.5 w-3.5 text-upchar-green" />} label="Home Collection" value={item.homeCollection ? "Available" : "Lab Visit"} />
        </div>

        <p className="mt-5 inline-flex items-center justify-center gap-1 text-sm font-black text-navy-900">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {item.rating}
        </p>
      </div>

      <div className={`${isList ? "grid gap-2" : "mt-auto grid grid-cols-1 gap-2 pt-5 sm:grid-cols-2"}`}>
        <button
          type="button"
          onClick={() => onDetails?.(item)}
          className="w-full rounded-md border border-upchar-blue px-4 py-2.5 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={() => onAddToCart(item)}
          className="w-full rounded-md bg-upchar-green px-5 py-2.5 text-sm font-black text-white transition hover:bg-upchar-greenDark"
        >
          Book Now
        </button>
      </div>
    </article>
  );
}

export { PackageCard, TestCard };
