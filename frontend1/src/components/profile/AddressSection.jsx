import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";

const formatAddress = (address) =>
  [address.addressLine, address.city, address.state ? `${address.state} - ${address.pincode}` : address.pincode, address.country]
    .filter(Boolean)
    .join(", ");

function AddressSection({ addresses, onAdd, onEdit, onDelete }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 text-2xl font-black text-navy-900">
          <MapPin className="h-6 w-6 text-upchar-blue" />
          Addresses
        </h2>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 items-center gap-2 rounded-md border border-blue-100 bg-white px-5 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </button>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {addresses.map((address) => (
          <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm" key={address.id}>
            <span className={`inline-flex rounded-md px-3 py-1 text-xs font-black ${address.primary ? "bg-green-50 text-upchar-green" : "bg-blue-50 text-upchar-blue"}`}>
              {address.primary ? `${address.label} (Primary)` : address.label}
            </span>
            <p className="mt-5 min-h-[120px] text-base font-semibold leading-8 text-navy-800">{formatAddress(address)}</p>
            <p className="mt-3 text-sm font-black text-navy-900">{address.phone}</p>
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onEdit(address)}
                className="inline-flex items-center gap-2 text-sm font-black text-upchar-blue"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(address)}
                className="inline-flex items-center gap-2 text-sm font-black text-upchar-red"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </article>
        ))}

        <button
          type="button"
          onClick={onAdd}
          className="flex min-h-[250px] flex-col items-center justify-center rounded-lg border border-dashed border-upchar-blue/40 bg-blue-50/20 p-6 text-center transition hover:bg-blue-50"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-upchar-blue text-upchar-blue">
            <Plus className="h-7 w-7" />
          </span>
          <span className="mt-6 text-xl font-black text-navy-900">Add New Address</span>
          <span className="mt-3 max-w-[210px] text-sm font-semibold leading-6 text-navy-700">
            Add your new address for easy booking
          </span>
        </button>
      </div>
    </section>
  );
}

export default AddressSection;
