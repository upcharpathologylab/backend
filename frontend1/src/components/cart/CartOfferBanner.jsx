import { MessageCircle } from "lucide-react";
import { cartOfferAssets } from "../../data/cartData.js";

function CartOfferBanner() {
  return (
    <section className="mt-8 grid overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-green-50 shadow-sm lg:grid-cols-[1.1fr_0.7fr_1fr]">
      <div className="grid gap-5 p-6 sm:grid-cols-[130px_1fr] sm:items-center">
        <img src={cartOfferAssets.doctor} alt="Doctor support specialist" className="h-32 w-32 rounded-lg object-cover object-top" />
        <div>
          <h2 className="text-xl font-black text-navy-900">Not sure which test is right for you?</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">
            Talk to our health experts and get personalized recommendations.
          </p>
          <a
            href="https://wa.me/917838582205"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-upchar-green px-5 py-2 text-sm font-black text-white transition hover:bg-upchar-greenDark"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="flex items-center justify-center border-y border-blue-100 p-6 lg:border-x lg:border-y-0">
        <div className="rounded-xl bg-white px-8 py-5 text-center shadow-sm">
          <p className="text-lg font-black text-upchar-green">UP TO</p>
          <p className="text-5xl font-black leading-none text-upchar-green">60%</p>
          <p className="text-lg font-black text-upchar-green">OFF</p>
        </div>
      </div>

      <div className="grid gap-5 p-6 sm:grid-cols-[1fr_130px] sm:items-center">
        <div>
          <h2 className="text-xl font-black text-navy-900">Limited Time Offer!</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">
            Book your tests now and save more on your health.
          </p>
        </div>
        <img src={cartOfferAssets.gift} alt="Health offer gift" className="mx-auto h-32 w-32 object-contain" />
      </div>
    </section>
  );
}

export default CartOfferBanner;
