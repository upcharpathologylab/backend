import { useState } from "react";
import { Clock3, ChevronLeft, ChevronRight, Home, Star } from "lucide-react";
import AccountToast from "../components/account/AccountToast.jsx";
import Icon from "../components/Icon.jsx";
import SmartImage from "../components/SmartImage.jsx";
import useAutoCarousel from "../hooks/useAutoCarousel.js";
import { price } from "../utils.js";
import { addCartItem } from "../utils/cart.js";
import { textValue } from "../utils/contentOverrides.js";

function TrustedTestsSection({ tests, content }) {
  const { sliderRef, scroll, handleScroll, pause, resume } = useAutoCarousel(tests.length);
  const sliderTests = tests.length > 1 ? [...tests, ...tests] : tests;
  const [addedKey, setAddedKey] = useState("");
  const [toast, setToast] = useState("");

  const handleAddToCart = (item, key) => {
    addCartItem({
      id: item.id,
      type: "test",
      name: item.name,
      subtitle: item.subtitle,
      price: item.discountedPrice,
      oldPrice: item.originalPrice,
      discount: item.discount,
      icon: item.icon,
      image: item.image,
      color: item.color
    });
    setAddedKey(key);
    setToast("Added to Cart");
    window.setTimeout(() => setAddedKey(""), 1500);
    window.setTimeout(() => setToast(""), 1800);
  };

  return (
    <section id="popular-tests" className="scroll-mt-28 border-b border-blue-100 bg-gradient-to-b from-blue-50/40 to-white py-12">
      <div className="container-page">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black text-navy-900 sm:text-4xl">
              Book <span className="text-upchar-green">Popular</span> Tests
            </h2>
            <p className="mt-2 text-sm font-semibold text-navy-600">{textValue(content?.title, "Trusted lab tests at affordable prices")}</p>
          </div>
          <a href="/tests" className="inline-flex items-center gap-1 text-sm font-black text-upchar-green transition hover:text-upchar-greenDark">
            View All Tests <ChevronRight className="h-4 w-4" />
          </a>
        </div>
        <div className="relative">
          <button type="button" onClick={() => scroll(-1)} className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-upchar-blue shadow-card lg:flex" aria-label="Previous tests">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            onMouseEnter={pause}
            onMouseLeave={resume}
            className="hide-scrollbar flex snap-x items-stretch gap-4 overflow-x-auto pb-3"
          >
            {sliderTests.map((test, index) => (
              <article
                data-carousel-card
                className="group relative flex w-full shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-blue-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)]"
                key={`${test.id || test.name}-${index}`}
              >
                {test.badge ? (
                  <span className="absolute left-3 top-3 z-10 rounded-md bg-upchar-green px-2 py-1 text-[10px] font-black uppercase text-white">
                    {test.badge}
                  </span>
                ) : null}
                <div className="relative h-28 overflow-hidden">
                  <SmartImage src={test.image} alt={test.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
                </div>
                <div className="relative -mt-7 flex justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-green-50 text-upchar-green shadow-card">
                    <Icon name={test.icon} className="h-6 w-6" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-4 pb-4 pt-2 text-center">
                  <h3 className="min-h-10 text-base font-black leading-snug text-navy-900">{test.name}</h3>
                  <p className="mt-1 min-h-9 text-xs font-semibold leading-5 text-navy-600">{test.subtitle}</p>
                  <div className="mt-3 grid grid-cols-2 divide-x divide-blue-100 border-b border-dashed border-blue-100 pb-3 text-left text-[10px] font-bold text-navy-700">
                    <span className="flex items-center justify-center px-2">
                      <Clock3 className="mr-1.5 h-4 w-4 shrink-0 text-upchar-green" />
                      {test.reportTime}
                    </span>
                    <span className="flex items-center justify-center px-2">
                      <Home className="mr-1.5 h-4 w-4 shrink-0 text-upchar-green" />
                      {test.homeCollection ? "Available" : "Lab Visit"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <span className="text-xs font-bold text-navy-400 line-through">{price(test.originalPrice)}</span>
                    <span className="text-xl font-black text-upchar-green">{price(test.discountedPrice)}</span>
                    {test.discount ? <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-black text-upchar-green">{test.discount}</span> : null}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-black text-navy-900">
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {test.rating}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-upchar-green" />
                      {test.homeCollection ? "Available" : "Lab Visit"}
                    </span>
                  </div>
                  <div className="mt-auto grid grid-cols-1 gap-2 pt-4 sm:grid-cols-2">
                    <a href="/tests" className="inline-flex min-h-10 items-center justify-center rounded-md border border-upchar-blue px-3 py-2 text-xs font-bold text-upchar-blue transition hover:bg-blue-50">
                      View Details
                    </a>
                    <button type="button" onClick={() => handleAddToCart(test, `${test.id || test.name}-${index}`)} className="inline-flex min-h-10 items-center justify-center rounded-md bg-upchar-green px-3 py-2 text-xs font-bold text-white transition hover:bg-upchar-greenDark">
                      {addedKey === `${test.id || test.name}-${index}` ? "Added ✓" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!tests.length ? (
              <div className="w-full rounded-lg border border-blue-100 bg-white p-8 text-center text-sm font-black text-navy-600 shadow-sm">
                No active tests available.
              </div>
            ) : null}
          </div>
          <button type="button" onClick={() => scroll(1)} className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-upchar-blue shadow-card lg:flex" aria-label="Next tests">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <AccountToast message={toast} />
    </section>
  );
}

export default TrustedTestsSection;
