import { Headphones, MessageCircle, Phone } from "lucide-react";

function NeedHelpCTA() {
  return (
    <section className="bg-white pb-12 pt-7 lg:pb-16">
      <div className="container-page">
        <div className="grid items-center gap-6 rounded-lg border border-blue-100 bg-gradient-to-r from-green-50 via-white to-blue-50 p-6 shadow-sm lg:grid-cols-[auto_1fr_auto_auto] lg:px-10">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-navy-700 shadow-sm">
            <Headphones className="h-14 w-14" strokeWidth={2.1} />
          </span>
          <div>
            <h2 className="text-3xl font-black text-upchar-blue">Need Help?</h2>
            <p className="mt-2 max-w-md text-lg font-semibold leading-8 text-navy-800">
              Our support team is here to help you at every step.
            </p>
          </div>
          <a
            href="tel:7838582205"
            className="flex h-16 items-center justify-center gap-4 rounded-lg border border-upchar-blue bg-white px-8 text-lg font-black text-upchar-blue transition hover:bg-blue-50"
          >
            <Phone className="h-8 w-8 fill-blue-50" />
            <span>
              Call Us
              <span className="block text-base">7838582205</span>
            </span>
          </a>
          <a
            href="https://wa.me/917838582205"
            className="flex h-16 items-center justify-center gap-4 rounded-lg bg-upchar-green px-8 text-lg font-black text-white shadow-lg shadow-green-900/15 transition hover:bg-upchar-greenDark"
          >
            <MessageCircle className="h-8 w-8" />
            <span>
              WhatsApp
              <span className="block text-base text-green-50">Instant Reports</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default NeedHelpCTA;
