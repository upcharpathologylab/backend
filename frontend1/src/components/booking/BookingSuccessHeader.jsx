import { Check, ShieldCheck } from "lucide-react";
import { price } from "../../utils.js";

function BookingSuccessHeader({ booking }) {
  const isPaid = String(booking.paymentStatus || "").toLowerCase() === "paid";

  return (
    <section className="grid gap-7 lg:grid-cols-[250px_1fr_390px] lg:items-start">
      <div className="relative mx-auto flex h-40 w-40 items-center justify-center lg:mx-0">
        <span className="absolute h-full w-full rounded-full bg-green-50" />
        {["left-3 top-3", "right-4 top-0", "bottom-4 left-0", "bottom-0 right-6", "left-1/2 top-8"].map((position, index) => (
          <span
            className={`absolute h-2 w-2 rounded-full ${index % 2 ? "bg-upchar-blue" : "bg-upchar-green"} ${position}`}
            key={position}
          />
        ))}
        <span className="relative flex h-28 w-28 items-center justify-center rounded-full bg-upchar-green text-white shadow-lg shadow-green-900/20">
          <Check className="h-16 w-16" strokeWidth={3.2} />
        </span>
      </div>

      <div>
        <h1 className="text-4xl font-black text-upchar-green sm:text-5xl">Booking Confirmed!</h1>
        <p className="mt-5 text-base font-semibold leading-7 text-navy-800">
          Thank you! Your booking has been saved successfully.
          <br />
          We've sent the details to your email and WhatsApp.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-navy-600">Booking ID</p>
            <p className="mt-2 text-xl font-black text-upchar-green">{booking.bookingId}</p>
          </div>
          <div className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-navy-600">Payment Status</p>
            <p className="mt-2 text-lg font-black text-upchar-blue">{booking.paymentStatus}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-green-100 bg-green-50/60 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-green-100 pb-5">
          <p className="flex items-center gap-3 text-base font-black text-navy-900">
            <ShieldCheck className="h-6 w-6 text-upchar-green" />
            {isPaid ? "Amount Paid" : "Total Payable"}
          </p>
          <p className="text-3xl font-black text-upchar-green">{price(booking.summary.totalPayable)}</p>
        </div>
        <div className="mt-5 grid gap-4">
          <div className="flex items-center justify-between gap-4 text-sm font-semibold text-navy-800">
            <span>Payment Mode</span>
            <span className="font-black">{booking.paymentMode}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm font-semibold text-navy-800">
            <span>Paid On</span>
            <span className="text-right font-black">{booking.paidOn}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-sm font-semibold text-navy-800">
            <span>Payment Status</span>
            <span className="rounded-md bg-upchar-green px-3 py-1 text-xs font-black text-white">{booking.paymentStatus}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookingSuccessHeader;
