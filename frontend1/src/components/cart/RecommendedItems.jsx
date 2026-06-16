import { ShoppingCart } from "lucide-react";
import Icon from "../Icon.jsx";
import { price } from "../../utils.js";

const colorStyles = {
  red: "bg-red-50 text-upchar-red",
  orange: "bg-orange-50 text-upchar-orange",
  green: "bg-green-50 text-upchar-green",
  purple: "bg-violet-50 text-upchar-purple",
  blue: "bg-blue-50 text-upchar-blue"
};

function RecommendedItems({ items, onAdd }) {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-black text-navy-900">You may also like</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {items.map((item) => (
          <article className="relative rounded-lg border border-blue-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-card" key={`${item.type}-${item.id}`}>
            {item.badge ? (
              <span className={`absolute left-4 top-4 rounded-md px-2.5 py-1 text-[10px] font-black text-white ${item.badge === "Popular" ? "bg-upchar-green" : "bg-upchar-blue"}`}>
                {item.badge}
              </span>
            ) : null}
            <span className={`mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full ${colorStyles[item.color] || colorStyles.green}`}>
              <Icon name={item.icon} className="h-10 w-10" />
            </span>
            <h3 className="mt-5 text-base font-black text-navy-900">{item.name}</h3>
            <p className="mt-2 text-sm font-black text-upchar-blue">{item.subtitle}</p>
            <p className="mx-auto mt-4 min-h-[48px] max-w-[190px] text-sm font-semibold leading-6 text-navy-600">{item.description}</p>
            <div className="mt-5 flex items-end justify-center gap-2">
              <span className="text-lg font-black text-upchar-green">{price(item.price)}</span>
              <span className="text-sm font-bold text-navy-400 line-through">{price(item.oldPrice)}</span>
              <span className="text-xs font-black text-upchar-green">{item.discount}</span>
            </div>
            <button
              type="button"
              onClick={() => onAdd(item)}
              className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-md border border-upchar-blue bg-white text-sm font-black text-upchar-blue transition hover:bg-blue-50"
            >
              Add to Cart
              <ShoppingCart className="h-4 w-4" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecommendedItems;
