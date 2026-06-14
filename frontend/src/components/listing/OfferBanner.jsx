import Icon from "../Icon.jsx";
import { textValue } from "../../utils/contentOverrides.js";

function OfferBanner({ type = "packages", content }) {
  const isPackages = type === "packages";
  const discountText = textValue(content?.subtitle, "UP TO 60% OFF");

  return (
    <div className="grid overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-green-50 shadow-sm lg:grid-cols-[1.2fr_0.8fr_1fr]">
      <div className="flex items-center gap-5 p-6">
        <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white shadow-sm sm:flex">
          <Icon name={isPackages ? "UserRound" : "MessageCircle"} className="h-12 w-12 text-upchar-green" />
        </div>
        <div>
          <h3 className="text-xl font-black text-navy-900">
            Not sure which {isPackages ? "package" : "test"} is right for you?
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">
            Talk to our health experts and get personalized recommendations.
          </p>
          <a
            href="https://wa.me/918882753539"
            className="mt-4 inline-flex rounded-md bg-upchar-green px-5 py-2 text-sm font-black text-white transition hover:bg-upchar-greenDark"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className="flex items-center justify-center border-y border-blue-100 p-6 lg:border-x lg:border-y-0">
        <div className="rounded-xl bg-white px-8 py-5 text-center shadow-sm">
          {content?.subtitle ? (
            <p className="text-3xl font-black leading-tight text-upchar-green">{discountText}</p>
          ) : (
            <>
              <p className="text-lg font-black text-upchar-green">UP TO</p>
              <p className="text-5xl font-black leading-none text-upchar-green">60%</p>
              <p className="text-lg font-black text-upchar-green">OFF</p>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 p-6">
        <div>
          <h3 className="text-xl font-black text-navy-900">{textValue(content?.title, "Limited Time Offer!")}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">
            {textValue(content?.description, "Book now and save more on your health.")}
          </p>
          <a
            href={isPackages ? "/packages" : "/tests"}
            className="mt-4 inline-flex rounded-md bg-upchar-green px-5 py-2 text-sm font-black text-white transition hover:bg-upchar-greenDark"
          >
            {isPackages ? "View Packages" : "View Tests"}
          </a>
        </div>
        <span className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white text-upchar-green shadow-sm sm:flex">
          <Icon name="Gift" className="h-12 w-12" />
        </span>
      </div>
    </div>
  );
}

export default OfferBanner;
