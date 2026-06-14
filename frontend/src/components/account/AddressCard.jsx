import { Ellipsis, MapPin, Pencil, Phone, Star, Trash2 } from "lucide-react";

const typeTagClass = {
  Home: "bg-blue-50 text-upchar-blue",
  Office: "bg-blue-50 text-upchar-blue",
  Other: "bg-violet-50 text-upchar-purple"
};

function AddressCard({ address, menuOpen, onToggleMenu, onEdit, onDelete, onMakePrimary }) {
  const type = address.type || address.label || "Other";
  const isPrimary = Boolean(address.isPrimary || address.primary);

  return (
    <article className="relative rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <span className={`inline-flex rounded-md px-3 py-1.5 text-sm font-black ${isPrimary ? "bg-green-50 text-upchar-green" : "bg-blue-50 text-upchar-blue"}`}>
          {isPrimary ? `${type} (Primary)` : type}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(address)}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-blue-100 bg-white px-4 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onToggleMenu(address.id)}
            className="flex h-11 w-11 items-center justify-center rounded-md border border-blue-100 bg-white text-upchar-blue transition hover:bg-blue-50"
            aria-label={`Open menu for ${type} address`}
          >
            <Ellipsis className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[32px_1fr]">
        <MapPin className="h-6 w-6 text-upchar-blue" />
        <div>
          <h3 className="text-lg font-black text-navy-900">{address.name || address.addressLine1}</h3>
          <p className="mt-3 max-w-2xl whitespace-pre-line text-base font-semibold leading-8 text-navy-700">
            {[address.addressLine2, `${address.city}${address.pincode ? ` - ${address.pincode}` : ""}, ${address.country}`]
              .filter(Boolean)
              .join("\n")}
          </p>
        </div>
      </div>

      <p className="mt-6 flex items-center gap-4 text-base font-semibold text-navy-800">
        <Phone className="h-5 w-5 text-upchar-blue" />
        {address.phone}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {isPrimary ? (
          <span className="rounded-md bg-green-50 px-3 py-2 text-sm font-black text-upchar-green">Primary Address</span>
        ) : null}
        <span className={`rounded-md px-3 py-2 text-sm font-black ${typeTagClass[type] || typeTagClass.Other}`}>{type} Address</span>
      </div>

      {menuOpen ? (
        <div className="absolute right-6 top-20 z-20 w-48 rounded-lg border border-blue-100 bg-white p-2 shadow-soft">
          <button
            type="button"
            onClick={() => onMakePrimary(address)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-black text-navy-900 hover:bg-blue-50"
          >
            <Star className="h-4 w-4 text-upchar-blue" />
            Make Primary
          </button>
          <button
            type="button"
            onClick={() => onDelete(address)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-black text-upchar-red hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete Address
          </button>
        </div>
      ) : null}
    </article>
  );
}

export default AddressCard;
