import { Mail, MessageCircle, Phone } from "lucide-react";
import { cartOfferAssets } from "../../data/cartData.js";

function BookingHelpRefer() {
  return (
    <section className="mt-8 grid overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-green-50 shadow-sm lg:grid-cols-[1.2fr_0.9fr_1fr]">
      <div className="grid gap-5 p-6 sm:grid-cols-[130px_1fr] sm:items-center">
        <img src={cartOfferAssets.doctor} alt="Doctor support specialist" className="h-32 w-32 rounded-lg object-cover object-top" />
        <div>
          <h2 className="text-2xl font-black text-navy-900">Need Help?</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">Our health experts are here to help you.</p>
          <a
            href="https://wa.me/917838532205"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-upchar-green px-5 py-2.5 text-sm font-black text-white transition hover:bg-upchar-greenDark"
          >
            <MessageCircle className="h-4 w-4" />
            Chat with Expert
          </a>
        </div>
      </div>

      <div className="grid gap-5 border-y border-blue-100 p-6 lg:border-x lg:border-y-0">
        <div className="grid grid-cols-[44px_1fr] gap-4">
          <Phone className="h-8 w-8 text-upchar-blue" />
          <div>
            <p className="font-black text-navy-900">Call Us</p>
            <p className="mt-1 text-sm font-semibold text-navy-700">7838532205</p>
            <p className="text-sm font-semibold text-navy-700">Mon - Sun: 7:00 AM - 9:00 PM</p>
          </div>
        </div>
        <div className="grid grid-cols-[44px_1fr] gap-4">
          <Mail className="h-8 w-8 text-upchar-blue" />
          <div>
            <p className="font-black text-navy-900">Email Us</p>
            <p className="mt-1 text-sm font-semibold text-navy-700">support@upcharlab.com</p>
            <p className="text-sm font-semibold text-navy-700">We reply within a few minutes</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-6 sm:grid-cols-[1fr_130px] sm:items-center">
        <div>
          <h2 className="text-2xl font-black text-navy-900">Refer & Earn</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">
            Refer your friends & family and earn exciting rewards.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex rounded-md border border-blue-100 bg-white px-6 py-2.5 text-sm font-black text-upchar-blue transition hover:bg-blue-50"
          >
            Refer Now
          </button>
        </div>
        <img src={cartOfferAssets.gift} alt="Referral reward gift" className="mx-auto h-32 w-32 object-contain" />
      </div>
    </section>
  );
}

export default BookingHelpRefer;
