import { Info, UserRoundCheck } from "lucide-react";

function DetailRow({ label, value }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[150px_1fr]">
      <span className="text-sm font-black text-navy-700">{label}</span>
      <span className="text-sm font-semibold leading-6 text-navy-900">{value || "-"}</span>
    </div>
  );
}

function BookingDetails({ booking, status, failure = false }) {
  const customer = booking.customer;
  const paymentStatus = status || booking.paymentStatus || "Pending";

  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
      <h2 className="text-2xl font-black text-navy-900">Booking Details</h2>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_330px]">
        <div className="grid gap-3">
          <DetailRow label="Customer Name" value={customer.name} />
          <DetailRow label="Mobile Number" value={customer.phone} />
          <DetailRow label="Email Address" value={customer.email} />
          <DetailRow label="Address" value={customer.address} />
          <DetailRow label="Pincode" value={customer.pincode} />
          <DetailRow label="Collection Type" value={customer.collectionType} />
          <DetailRow label="Date" value={customer.date} />
          <DetailRow label="Time Slot" value={customer.timeSlot} />
          <DetailRow label="Payment Mode" value={booking.paymentMode} />
          <DetailRow label="Booking Status" value={booking.bookingStatus} />
          <div className="grid gap-1 sm:grid-cols-[150px_1fr]">
            <span className="text-sm font-black text-navy-700">Payment Status</span>
            <span
              className={`w-fit rounded-md px-2.5 py-1 text-xs font-black ${
                failure ? "bg-red-50 text-upchar-red ring-1 ring-red-200" : "bg-green-50 text-upchar-green"
              }`}
            >
              {paymentStatus}
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-green-100 bg-green-50/40 p-5">
          <p className="flex items-center gap-2 text-base font-black text-upchar-green">
            <UserRoundCheck className="h-5 w-5" />
            Sample Collection Details
          </p>
          <div className="mt-4 grid gap-3">
            <DetailRow label="Date" value={customer.date} />
            <DetailRow label="Time Slot" value={customer.timeSlot} />
            <DetailRow label="Collection Type" value={customer.collectionType} />
          </div>
          <p className="mt-5 text-sm font-black text-navy-900">Instructions</p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm font-semibold leading-6 text-navy-700">
            <li>Please keep the required documents ready for verification.</li>
            <li>For fasting tests, please follow the instructions shared via SMS/WhatsApp.</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-blue-100 bg-blue-50/40 p-4">
        <p className="flex items-center gap-3 text-sm font-bold text-navy-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-upchar-blue text-white">
            <Info className="h-5 w-5" />
          </span>
          {failure
            ? "Facing issues? Don't worry! You can retry the payment or choose another payment method."
            : "You will receive updates about your booking on SMS, WhatsApp and Email."}
        </p>
        <a
          href={failure ? "/payment" : "/booking-confirmation"}
          className="inline-flex h-11 items-center justify-center rounded-md border border-blue-100 bg-white px-6 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
        >
          {failure ? "Try Again" : "Track Booking"}
        </a>
      </div>
    </section>
  );
}

export default BookingDetails;
