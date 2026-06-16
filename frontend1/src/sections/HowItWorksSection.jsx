import { ChevronRight } from "lucide-react";
import Icon from "../components/Icon.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { getColor } from "../utils.js";

function HowItWorksSection({ steps }) {
  return (
    <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50/70 to-white py-14 lg:py-20">
      <div className="container-page">
        <SectionHeading title="How It" highlight="Works?" subtitle="Simple steps for accurate reports and better health." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => {
            const style = getColor(step.color);
            const number = String(index + 1).padStart(2, "0");
            return (
              <article className="relative rounded-xl border border-blue-100 bg-white px-6 py-8 text-center shadow-card" key={step.title}>
                {index !== steps.length - 1 && (
                  <span className="absolute -right-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-upchar-blue shadow-card lg:flex">
                    <ChevronRight className="h-5 w-5" />
                  </span>
                )}
                <span className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${style.soft}`}>
                  <Icon name={step.icon} className="h-12 w-12" />
                </span>
                <span className={`mx-auto mt-5 flex h-11 w-11 items-center justify-center rounded-full text-lg font-black ${style.soft}`}>
                  {number}
                </span>
                <h3 className="mt-6 min-h-14 text-lg font-black leading-snug text-navy-900">{step.title}</h3>
                <span className={`mx-auto mt-4 block h-0.5 w-8 rounded-full ${style.line}`} />
                <p className="mt-6 text-sm leading-7 text-navy-700">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
