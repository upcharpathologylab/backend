import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Clock3, Home } from "lucide-react";
import AccountToast from "../components/account/AccountToast.jsx";
import Icon from "../components/Icon.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import SmartImage from "../components/SmartImage.jsx";
import useAutoCarousel from "../hooks/useAutoCarousel.js";
import { getColor, price } from "../utils.js";
import { addCartItem } from "../utils/cart.js";
import { textValue } from "../utils/contentOverrides.js";

function SpecialCareSection({ packages, content }) {
  const { sliderRef, scroll, handleScroll, pause, resume } = useAutoCarousel(packages.length);
  const sliderPackages = packages.length > 1 ? [...packages, ...packages] : packages;
  const [addedKey, setAddedKey] = useState("");
  const [toast, setToast] = useState("");

  const handleAddToCart = (item, key) => {
    addCartItem({
      id: item.id,
      type: "package",
      name: item.name,
      subtitle: item.testCount,
      description: item.description,
      price: item.discountedPrice,
      oldPrice: item.originalPrice,
      discount: item.discount,
      badge: item.badge,
      icon: item.icon,
      color: item.color
    });
    setAddedKey(key);
    setToast("Added to Cart");
    window.setTimeout(() => setAddedKey(""), 1500);
    window.setTimeout(() => setToast(""), 1800);
  };

  return (
    <section id="packages" className="scroll-mt-28 border-b border-blue-100 bg-gradient-to-b from-white to-blue-50/40 py-12 lg:py-16">
      <div className="container-page">
        <SectionHeading
          title={textValue(content?.title, "Special Care for")}
          highlight={textValue(content?.subtitle, "You & Your Family")}
          subtitle={textValue(content?.description, "Choose from our most popular health packages")}
          centered={false}
          action={
            <a href="/packages" className="inline-flex items-center gap-2 text-sm font-black text-navy-900 hover:text-upchar-green">
              View All Packages
              <ArrowRight className="h-5 w-5" />
            </a>
          }
        />

        <div className="relative">
          <button type="button" onClick={() => scroll(-1)} className="absolute -left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-upchar-blue shadow-card lg:flex" aria-label="Previous packages">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            onMouseEnter={pause}
            onMouseLeave={resume}
            className="hide-scrollbar flex snap-x items-stretch gap-5 overflow-x-auto pb-3"
          >
            {sliderPackages.map((item, index) => {
              const style = getColor(item.color);
              const badgeText = item.badge || (item.isPopular ? "Most Booked" : "");
              return (
                <article
                  data-carousel-card
                  className="group relative flex w-full shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-blue-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-soft sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]"
                  key={`${item.id || item.name}-${index}`}
                >
                  {badgeText ? (
                    <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-b-lg bg-navy-800 px-4 py-2 text-xs font-black uppercase text-white">
                      {badgeText}
                    </span>
                  ) : null}
                  <div className="relative h-36 overflow-hidden">
                    <SmartImage src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                  </div>
                  <div className="relative -mt-9 flex justify-center">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white ${style.soft} shadow-card`}>
                      <Icon name={item.icon} className="h-7 w-7" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col px-4 pb-5 pt-2 text-center">
                    <h3 className="min-h-12 text-lg font-black leading-snug text-navy-900">{item.name}</h3>
                    <p className="mt-1 text-sm font-bold text-navy-700">{item.testCount}</p>
                    <p className="mt-2 min-h-12 text-sm font-semibold leading-6 text-navy-600">{item.description}</p>
                    <div className="mt-3 flex items-center justify-center gap-4">
                      <span className="text-sm font-bold text-navy-400 line-through">{price(item.originalPrice)}</span>
                      <span className="text-lg font-black text-upchar-green">{price(item.discountedPrice)}</span>
                      {item.discount ? <span className="text-xs font-black text-upchar-green">{item.discount}</span> : null}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-left text-[11px] font-bold text-navy-700">
                      <span>
                        <Home className="mr-1 inline h-3.5 w-3.5 text-upchar-green" />
                        {item.homeCollection ? "Available" : "Lab Visit"}
                      </span>
                      <span>
                        <Clock3 className="mr-1 inline h-3.5 w-3.5 text-upchar-blue" />
                        {item.reportTime}
                      </span>
                    </div>
                    <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
                      <a href="/packages" className="rounded-md border border-upchar-blue px-4 py-2.5 text-sm font-bold text-upchar-blue transition hover:bg-blue-50">
                        View Details
                      </a>
                      <button type="button" onClick={() => handleAddToCart(item, `${item.id || item.name}-${index}`)} className="rounded-md bg-upchar-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-upchar-greenDark">
                        {addedKey === `${item.id || item.name}-${index}` ? "Added ✓" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
            {!packages.length ? (
              <div className="w-full rounded-lg border border-blue-100 bg-white p-8 text-center text-sm font-black text-navy-600 shadow-sm">
                No active packages available.
              </div>
            ) : null}
          </div>
          <button type="button" onClick={() => scroll(1)} className="absolute -right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-upchar-blue shadow-card lg:flex" aria-label="Next packages">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
      <AccountToast message={toast} />
    </section>
  );
}

export default SpecialCareSection;
