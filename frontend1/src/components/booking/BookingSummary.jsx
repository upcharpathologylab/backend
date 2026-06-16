import { Download, TicketCheck } from "lucide-react";
import { price } from "../../utils.js";

function SummaryLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm font-semibold text-navy-800">
      <span>{label}</span>
      <span className="text-right font-black text-navy-900">{value}</span>
    </div>
  );
}

function BookingSummary({ booking }) {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <h2 className="text-2xl font-black text-navy-900">Booking Summary</h2>
      <div className="mt-5 grid gap-5">
        <SummaryLine label="Booking ID" value={booking.bookingId} />
        <SummaryLine label="Booking Date" value={booking.bookingDate} />
        <SummaryLine label="Payment Mode" value={booking.paymentMode} />
        <SummaryLine
          label="Payment Status"
          value={<span className="rounded-md bg-upchar-green px-2.5 py-1 text-xs font-black text-white">{booking.paymentStatus}</span>}
        />
      </div>

      <div className="mt-7 flex items-end justify-between gap-4">
        <span className="text-lg font-black text-navy-900">Total Paid</span>
        <span className="text-4xl font-black text-upchar-green">{price(booking.summary.totalPayable)}</span>
      </div>

      <div className="mt-6 rounded-lg border border-green-100 bg-green-50 p-5">
        <p className="flex gap-3 text-sm font-semibold leading-6 text-navy-800">
          <TicketCheck className="mt-0.5 h-5 w-5 shrink-0 text-upchar-green" />
          <span>
            A confirmation has been sent to <span className="font-black">{booking.customer.email}</span> and{" "}
            <span className="font-black">{booking.customer.phone}</span>
          </span>
        </p>
      </div>

      <button
        type="button"
        className="mt-5 flex h-12 w-full items-center justify-center gap-3 rounded-md border border-blue-100 bg-white text-sm font-black text-upchar-blue transition hover:bg-blue-50"
      >
        <Download className="h-5 w-5" />
        Download Invoice
      </button>
    </section>
  );
}

export default BookingSummary;
