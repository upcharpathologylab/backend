import contactHero from "../../assets/contact-hero.png";
import { imageValue } from "../../utils/contentOverrides.js";

function ContactHero({ content }) {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/50">
      <div className="container-page grid min-h-[250px] items-center gap-8 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-10">
        <div>
          <p className="text-sm font-black text-navy-900">
            <a href="/" className="text-navy-800">Home</a>
            <span className="mx-2 text-navy-400">&gt;</span>
            Contact Us
          </p>
          <h1 className="mt-8 text-4xl font-black text-upchar-blue sm:text-5xl">{content?.title || ""}</h1>
          {content?.subtitle ? <p className="mt-4 max-w-md text-lg font-black leading-8 text-navy-800">{content.subtitle}</p> : null}
          {content?.description ? <p className="mt-2 max-w-md text-lg font-semibold leading-8 text-navy-800">{content.description}</p> : null}
        </div>

        <div className="hidden justify-end lg:flex">
          <img src={imageValue(content?.imageUrl, contactHero)} alt="Support headset with call, email and chat icons" className="h-56 w-[560px] rounded-xl object-cover object-right" />
        </div>
      </div>
    </section>
  );
}

export default ContactHero;
