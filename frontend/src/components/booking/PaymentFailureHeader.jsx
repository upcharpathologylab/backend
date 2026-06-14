import { X } from "lucide-react";

function PaymentFailureHeader({ booking }) {
  return (
    <section className="grid gap-7 lg:grid-cols-[250px_1fr_390px] lg:items-start">
      <div className="relative mx-auto flex h-40 w-40 items-center justify-center lg:mx-0">
        <span className="absolute h-full w-full rounded-full bg-red-50" />
        {["left-3 top-3", "right-4 top-0", "bottom-4 left-0", "bottom-0 right-6", "left-1/2 top-8"].map((position, index) => (
          <span
            className={`absolute h-2 w-2 rounded-full ${index % 2 ? "bg-upchar-orange" : "bg-upchar-red"} ${position}`}
            key={position}
          />
        ))}
        <span className="relative flex h-28 w-28 items-center justify-center rounded-full bg-upchar-red text-white shadow-lg shadow-red-900/20">
          <X className="h-16 w-16" strokeWidth={3.2} />
        </span>
      </div>

      <div>
        <p className="text-sm font-black text-navy-800">
          <a href="/" className="text-upchar-blue">Home</a>
          <span className="mx-2 text-navy-400">&gt;</span>
          <a href="/cart" className="text-upchar-blue">Cart</a>
          <span className="mx-2 text-navy-400">&gt;</span>
          <a href="/payment" className="text-upchar-blue">Payment</a>
          <span className="mx-2 text-navy-400">&gt;</span>
          Failed
        </p>
        <h1 className="mt-6 text-4xl font-black text-upchar-red sm:text-5xl">Payment Failed!</h1>
        <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-navy-800">
          We couldn't process your payment. Please try again or choose another payment method.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-black text-upchar-red">
            Booking ID: <span className="ml-2">{booking.bookingId}</span>
          </div>
          <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm font-black text-upchar-blue">
            Payment ID: <span className="ml-2">{booking.paymentId}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-red-200 bg-red-50/60 p-6 shadow-sm">
        <h2 className="text-xl font-black text-upchar-red">Payment Failed</h2>
        <p className="mt-4 text-sm font-semibold leading-6 text-navy-800">
          The transaction was declined by your bank.
          <br />
          No amount has been deducted from your account.
        </p>
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-red-100 pt-5 text-sm font-semibold text-navy-800">
          <span>Failed On</span>
          <span className="font-black">{booking.paidOn}</span>
        </div>
      </div>
    </section>
  );
}

export default PaymentFailureHeader;
