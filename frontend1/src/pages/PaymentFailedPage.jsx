import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, Mail, MessageCircle, Phone } from "lucide-react";
import BookedItemsTable from "../components/booking/BookedItemsTable.jsx";
import BookingBenefitStrip from "../components/booking/BookingBenefitStrip.jsx";
import BookingDetails from "../components/booking/BookingDetails.jsx";
import FailureReasonCard from "../components/booking/FailureReasonCard.jsx";
import PaymentFailureHeader from "../components/booking/PaymentFailureHeader.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import Icon from "../components/Icon.jsx";
import { assuranceItems } from "../data/paymentData.js";
import { cartOfferAssets, recommendedCartItems } from "../data/cartData.js";
import { fallbackHomeData } from "../data/homeData.js";
import { getPaymentFailureData } from "../utils/checkout.js";
import { price } from "../utils.js";

const colorStyles = {
  red: "bg-red-50 text-upchar-red",
  orange: "bg-orange-50 text-upchar-orange",
  green: "bg-green-50 text-upchar-green",
  purple: "bg-violet-50 text-upchar-purple",
  blue: "bg-blue-50 text-upchar-blue"
};

function NeedHelpCard() {
  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <div className="grid gap-5 sm:grid-cols-[120px_1fr] sm:items-center xl:grid-cols-1">
        <img src={cartOfferAssets.doctor} alt="Doctor support specialist" className="h-32 w-32 rounded-lg object-cover object-top" />
        <div>
          <h2 className="text-2xl font-black text-navy-900">Need Help?</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">Our support team is here to assist you.</p>
          <a
            href="https://wa.me/917838532205"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-upchar-green px-5 py-2.5 text-sm font-black text-white transition hover:bg-upchar-greenDark"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactHelpCard() {
  const items = [
    { title: "Call Us", text: "7838532205", subtext: "Mon - Sun: 7:00 AM - 9:00 PM", icon: Phone },
    { title: "Email Us", text: "support@upcharlab.com", subtext: "We reply within a few minutes", icon: Mail },
    { title: "Visit Help Center", text: "Find answers to common questions", subtext: "", icon: HelpCircle }
  ];

  return (
    <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-black text-navy-900">We're Here to Help</h2>
      <div className="mt-5 grid gap-4">
        {items.map((item) => {
          const ItemIcon = item.icon;
          return (
            <div className="grid grid-cols-[42px_1fr] gap-3" key={item.title}>
              <ItemIcon className="h-6 w-6 text-upchar-blue" />
              <div>
                <p className="text-sm font-black text-navy-900">{item.title}</p>
                <p className="mt-1 text-sm font-semibold text-navy-700">{item.text}</p>
                {item.subtext ? <p className="text-xs font-semibold text-navy-600">{item.subtext}</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RecoveryCta() {
  return (
    <section className="mt-8 flex flex-wrap items-center justify-center gap-5 rounded-lg border border-blue-100 bg-white p-5 text-center shadow-sm lg:justify-between lg:text-left">
      <div>
        <h2 className="text-xl font-black text-navy-900">Don't want to miss your health checkup?</h2>
        <p className="mt-1 text-sm font-semibold text-navy-700">Complete your payment and get accurate reports from trusted labs.</p>
      </div>
      <Link
        to="/payment"
        className="inline-flex h-11 items-center justify-center rounded-md bg-upchar-green px-7 text-sm font-black text-white transition hover:bg-upchar-greenDark"
      >
        Complete Payment
      </Link>
    </section>
  );
}

function FailureRecommendations() {
  return (
    <section className="mt-8">
      <h2 className="text-2xl font-black text-navy-900">You may also like</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {recommendedCartItems.map((item) => (
          <article className="rounded-lg border border-blue-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-card" key={`${item.type}-${item.id}`}>
            <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${colorStyles[item.color] || colorStyles.green}`}>
              <Icon name={item.icon} className="h-8 w-8" />
            </span>
            <h3 className="mt-4 text-sm font-black text-navy-900">{item.name}</h3>
            <p className="mt-1 text-xs font-black text-upchar-blue">{item.subtitle}</p>
            <div className="mt-4 flex items-end justify-center gap-2">
              <span className="text-lg font-black text-upchar-green">{price(item.price)}</span>
              <span className="text-sm font-bold text-navy-400 line-through">{price(item.oldPrice)}</span>
              <span className="text-xs font-black text-upchar-green">{item.discount}</span>
            </div>
            <Link
              to="/payment"
              className="mt-4 flex h-10 w-full items-center justify-center rounded-md border border-upchar-blue bg-white text-sm font-black text-upchar-blue transition hover:bg-blue-50"
            >
              Book Now
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function PaymentFailedPage() {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    document.title = "Payment Failed | Upchar Pathology";
    setBooking(getPaymentFailureData());
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-blue-50/70 via-white to-white">
      <Header data={fallbackHomeData} />
      <main className="pt-[68px] md:pt-[104px] lg:pt-[108px]">
        {booking ? (
          <section className="container-page py-8 lg:py-10">
            <PaymentFailureHeader booking={booking} />

            <div className="mt-8">
              <BookingBenefitStrip items={assuranceItems} />
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_390px]">
              <div className="grid gap-6">
                <BookedItemsTable
                  items={booking.items}
                  summary={booking.summary}
                  title="Order Summary"
                  totalLabel="Total Payable"
                />
                <BookingDetails booking={booking} status="Failed" failure />
              </div>
              <aside className="grid gap-6 self-start xl:sticky xl:top-32">
                <FailureReasonCard />
                <NeedHelpCard />
                <ContactHelpCard />
              </aside>
            </div>

            <RecoveryCta />
            <FailureRecommendations />
          </section>
        ) : null}
      </main>
      <Footer data={fallbackHomeData} />
    </div>
  );
}

export default PaymentFailedPage;
