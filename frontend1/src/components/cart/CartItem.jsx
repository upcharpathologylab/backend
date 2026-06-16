import { Minus, Plus, X } from "lucide-react";
import Icon from "../Icon.jsx";
import { price } from "../../utils.js";

const colorStyles = {
  green: "bg-green-50 text-upchar-green",
  blue: "bg-blue-50 text-upchar-blue",
  purple: "bg-violet-50 text-upchar-purple",
  red: "bg-red-50 text-upchar-red",
  orange: "bg-orange-50 text-upchar-orange",
  teal: "bg-teal-50 text-upchar-teal"
};

function QuantityStepper({ quantity, onChange }) {
  return (
    <div className="inline-flex h-9 overflow-hidden rounded-md border border-blue-100 bg-white">
      <button
        type="button"
        className="flex w-9 items-center justify-center text-navy-700 transition hover:bg-blue-50 disabled:opacity-40"
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="flex w-11 items-center justify-center border-x border-blue-100 text-sm font-black text-navy-900">
        {quantity}
      </span>
      <button
        type="button"
        className="flex w-9 items-center justify-center text-upchar-blue transition hover:bg-blue-50"
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function CartItem({ item, onQuantityChange, onRemove }) {
  const quantity = Number(item.quantity || 1);
  const itemTotal = Number(item.price || 0) * quantity;

  return (
    <article className="grid gap-5 border-t border-blue-100 py-6 first:border-t-0 lg:grid-cols-[1fr_180px_150px_110px_36px] lg:items-center">
      <div className="grid gap-4 sm:grid-cols-[86px_1fr] sm:items-center">
        <span className={`flex h-20 w-20 items-center justify-center rounded-full ${colorStyles[item.color] || colorStyles.green}`}>
          <Icon name={item.icon} className="h-10 w-10" />
        </span>
        <div>
          <h3 className="text-base font-black text-navy-900">{item.name}</h3>
          <p className="mt-1 text-sm font-black text-upchar-blue">{item.subtitle}</p>
          <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-navy-600">{item.description}</p>
          {item.badge ? (
            <span className="mt-2 inline-flex rounded-md border border-upchar-green px-2.5 py-1 text-[11px] font-black text-upchar-green">
              {item.badge}
            </span>
          ) : null}
        </div>
      </div>

      <div>
        <p className="text-lg font-black text-upchar-green">{price(item.price)}</p>
        <p className="mt-1 text-sm font-bold text-navy-400 line-through">{price(item.oldPrice)}</p>
        <p className="mt-3 text-sm font-black text-upchar-green">{item.discount}</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase text-navy-500 lg:hidden">Quantity</p>
        <QuantityStepper quantity={quantity} onChange={(nextQuantity) => onQuantityChange(item, nextQuantity)} />
      </div>

      <div>
        <p className="mb-1 text-xs font-black uppercase text-navy-500 lg:hidden">Total</p>
        <p className="text-lg font-black text-upchar-green">{price(itemTotal)}</p>
      </div>

      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 text-navy-400 transition hover:border-upchar-red hover:text-upchar-red"
        onClick={() => onRemove(item)}
        aria-label={`Remove ${item.name}`}
      >
        <X className="h-5 w-5" />
      </button>
    </article>
  );
}

export default CartItem;
