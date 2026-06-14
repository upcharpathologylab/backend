import Icon from "../components/Icon.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import { getColor } from "../utils.js";
import { textValue } from "../utils/contentOverrides.js";

function WhyChooseSection({ features, content }) {
  return (
    <section id="why-choose" className="border-b border-blue-100 bg-gradient-to-b from-white to-green-50/30 py-14 lg:py-20">
      <div className="container-page">
        <SectionHeading
          title={textValue(content?.title, "Why Choose")}
          highlight={textValue(content?.subtitle, "Upchar?")}
          subtitle={textValue(content?.description, "Trusted by thousands of patients across India for accurate diagnostics, affordable pricing, and fast report delivery.")}
        />
        <div className="grid gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {features.map((feature, index) => {
            const style = getColor(feature.color);
            return (
              <article
                className={`relative px-4 text-center ${index !== features.length - 1 ? "xl:border-r xl:border-blue-100" : ""}`}
                key={feature.title}
              >
                <span className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${style.soft} ring-8 ${style.ring}`}>
                  <Icon name={feature.icon} className="h-10 w-10" />
                </span>
                <h3 className="mt-6 text-base font-black leading-snug text-navy-900">{feature.title}</h3>
                <span className={`mx-auto mt-5 block h-0.5 w-7 rounded-full ${style.line}`} />
                <p className="mt-5 text-sm leading-6 text-navy-700">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseSection;
