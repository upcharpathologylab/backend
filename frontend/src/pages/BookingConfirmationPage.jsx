import { useEffect, useState } from "react";
import BookedItemsTable from "../components/booking/BookedItemsTable.jsx";
import BookingBenefitStrip from "../components/booking/BookingBenefitStrip.jsx";
import BookingDetails from "../components/booking/BookingDetails.jsx";
import BookingHelpRefer from "../components/booking/BookingHelpRefer.jsx";
import BookingSuccessHeader from "../components/booking/BookingSuccessHeader.jsx";
import BookingSummary from "../components/booking/BookingSummary.jsx";
import CartTrustStrip from "../components/cart/CartTrustStrip.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import WhatsNextTimeline from "../components/booking/WhatsNextTimeline.jsx";
import { confirmationBenefits } from "../data/paymentData.js";
import { fallbackHomeData } from "../data/homeData.js";
import { trustStripItems } from "../data/cartData.js";
import { getBookingLead } from "../api/api.js";
import { getStoredBookingData } from "../utils/checkout.js";

function BookingConfirmationPage() {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    document.title = "Booking Confirmed | Upchar Pathology";

    async function loadBooking() {
      const storedBooking = getStoredBookingData();
      if (!storedBooking?.bookingId) {
        setError("Booking not found.");
        setLoading(false);
        return;
      }

      try {
        const data = await getBookingLead(storedBooking.bookingId);
        if (active) setBooking(data);
      } catch {
        if (active) setError("Booking not found.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBooking();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-blue-50/70 via-white to-white">
      <Header data={fallbackHomeData} />
      <main className="pt-[68px] md:pt-[104px] lg:pt-[108px]">
        {loading ? (
          <section className="container-page py-16 text-center">
            <p className="text-lg font-black text-navy-800">Loading booking details...</p>
          </section>
        ) : error ? (
          <section className="container-page py-16 text-center">
            <div className="rounded-lg border border-red-100 bg-white p-8 shadow-sm">
              <h1 className="text-3xl font-black text-navy-900">Booking not found</h1>
              <p className="mt-3 text-sm font-semibold text-navy-700">{error}</p>
            </div>
          </section>
        ) : booking ? (
          <section className="container-page py-8 lg:py-10">
            <BookingSuccessHeader booking={booking} />

            <div className="mt-8">
              <BookingBenefitStrip items={confirmationBenefits} />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_420px]">
              <div className="grid gap-6">
                <BookedItemsTable
                  items={booking.items}
                  summary={booking.summary}
                  title={`Booked Items (${booking.summary.itemCount})`}
                />
                <BookingDetails booking={booking} />
              </div>
              <aside className="grid gap-6 self-start xl:sticky xl:top-32">
                <BookingSummary booking={booking} />
                <WhatsNextTimeline />
              </aside>
            </div>

            <BookingHelpRefer />
            <div className="mt-8 rounded-lg border border-blue-100 bg-white p-3 shadow-sm">
              <CartTrustStrip items={trustStripItems} />
            </div>
          </section>
        ) : null}
      </main>
      <Footer data={fallbackHomeData} />
    </div>
  );
}

export default BookingConfirmationPage;
