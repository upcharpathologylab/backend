import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Icon from "../components/Icon.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import useAutoCarousel from "../hooks/useAutoCarousel.js";
import { getColor } from "../utils.js";

function VitalOrgansSection({ organs }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { sliderRef, scroll, handleScroll, pause, resume } = useAutoCarousel(organs.length);
  const sliderOrgans = organs.length > 1 ? [...organs, ...organs] : organs;

  const updateActiveIndex = () => {
    handleScroll();
    const slider = sliderRef.current;
    const card = slider?.querySelector("[data-carousel-card]");
    if (!slider || !card || !organs.length) return;
    const gap = Number.parseFloat(window.getComputedStyle(slider).columnGap) || 0;
    setActiveIndex(Math.round(slider.scrollLeft / (card.getBoundingClientRect().width + gap)) % organs.length);
  };

  return (
    <section id="tests" className="border-b border-blue-100 bg-white pb-10 pt-10 lg:pb-12">
      <div className="container-page">
        <SectionHeading title="Vital" highlight="Organs" subtitle="Choose tests based on your health focus" />
        <div className="relative">
          <button type="button" onClick={() => scroll(-1)} className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-upchar-blue shadow-card lg:flex" aria-label="Previous organs">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div
            ref={sliderRef}
            onScroll={updateActiveIndex}
            onMouseEnter={pause}
            onMouseLeave={resume}
            className="hide-scrollbar flex snap-x items-stretch gap-4 overflow-x-auto pb-2"
          >
            {sliderOrgans.map((organ, index) => {
              const style = getColor(organ.color);
              return (
                <a
                  href="#booking"
                  data-carousel-card
                  className="group flex min-h-32 w-[calc((100%-1rem)/2)] shrink-0 snap-start flex-col items-center justify-center rounded-[1.2rem] border border-blue-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-card md:w-[calc((100%-3rem)/4)] lg:w-[calc((100%-7rem)/8)]"
                  key={`${organ.name}-${index}`}
                >
                  <span className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full ${style.soft} ring-8 ${style.ring}`}>
                    <Icon name={organ.icon} className="h-9 w-9" />
                  </span>
                  <span className="text-sm font-black text-navy-900">{organ.name}</span>
                  <span className={`mt-3 h-0.5 w-8 rounded-full ${style.line}`} />
                </a>
              );
            })}
          </div>
          <button type="button" onClick={() => scroll(1)} className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-upchar-blue shadow-card lg:flex" aria-label="Next organs">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 flex justify-center gap-2">
          {organs.map((organ, index) => (
            <span
              className={`h-2 rounded-full ${index === activeIndex ? "w-8 bg-upchar-green" : "w-2 bg-blue-100"}`}
              key={organ.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default VitalOrgansSection;
