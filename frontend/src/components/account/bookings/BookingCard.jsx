import { CalendarDays, MapPin, MoreVertical } from "lucide-react";
import Icon from "../../Icon.jsx";
import StatusBadge from "../StatusBadge.jsx";
import { price } from "../../../utils.js";

const colorClasses = {
  blue: "border-upchar-blue bg-blue-50 text-upchar-blue",
  green: "border-upchar-green bg-green-50 text-upchar-green",
  red: "border-upchar-red bg-red-50 text-upchar-red"
};

function BookingCard({ booking, onAction, onDelete }) {
  const color = booking.status === "Cancelled" ? "red" : booking.status === "Upcoming" ? "blue" : "green";

  return (
    <article className="overflow-hidden rounded-lg border border-blue-100 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[120px_1fr_150px_36px]">
        <div className={`flex items-center justify-center border-l-4 p-5 text-center ${colorClasses[color] || colorClasses.green}`}>
          <div>
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <Icon name={booking.status === "Cancelled" ? "CircleX" : booking.status === "Upcoming" ? "Clock3" : "BadgeCheck"} className="h-7 w-7" />
            </span>
            <span className="mt-3 block text-sm font-black">{booking.status}</span>
          </div>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-[1.1fr_1fr_1fr] lg:items-center">
          <div>
            <h3 className="text-lg font-black text-navy-900">{booking.title}</h3>
            <p className="mt-3 text-xs font-black text-upchar-blue">Booking ID</p>
            <p className="mt-1 text-sm font-semibold text-navy-800">{booking.bookingId}</p>
          </div>
          <div className="grid gap-2 text-sm font-semibold text-navy-700">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-navy-700" />
              {booking.date}
            </span>
            <span className="pl-6 text-navy-600">{booking.time}</span>
          </div>
          <div className="grid gap-2 text-sm font-semibold text-navy-700">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-navy-700" />
              {booking.collection}
            </span>
            <span className="pl-6 text-navy-600">{booking.address}</span>
          </div>
        </div>

        <div className="border-t border-blue-100 p-5 text-left lg:border-l lg:border-t-0 lg:text-center">
          <p className="text-2xl font-black text-upchar-green">{price(booking.amount)}</p>
          <div className="mt-2 lg:flex lg:justify-center">
            <StatusBadge label={booking.paymentStatus} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <button
              type="button"
              className="inline-flex h-10 w-full items-center justify-center rounded-md border border-upchar-blue px-4 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
              onClick={() => onAction(booking)}
            >
              {booking.action}
            </button>
            {booking.canDelete ? (
              <button
                type="button"
                className="inline-flex h-10 w-full items-center justify-center rounded-md border border-red-100 px-4 text-sm font-black text-upchar-red transition hover:bg-red-50"
                onClick={() => onDelete(booking)}
              >
                Delete
              </button>
            ) : null}
          </div>
        </div>

        <button type="button" className="hidden items-start justify-center p-5 text-navy-700 lg:flex" aria-label="More options">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}

export default BookingCard;
