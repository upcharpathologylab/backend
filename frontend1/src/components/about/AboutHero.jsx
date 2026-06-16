import { ShieldCheck } from "lucide-react";
import aboutHero from "../../assets/about-hero.png";
import { imageValue, textValue } from "../../utils/contentOverrides.js";

function AboutHero({ content }) {
  const customTitle = textValue(content?.title, "");

  return (
    <section className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-white">
      <div className="container-page py-8 lg:py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="text-sm font-black text-navy-900">
              <a href="/" className="text-upchar-green">Home</a>
              <span className="mx-2 text-navy-400">&gt;</span>
              About Us
            </p>

            {customTitle ? (
              <h1 className="mt-8 max-w-2xl text-4xl font-black leading-tight text-navy-900 sm:text-5xl lg:text-[46px]">{customTitle}</h1>
            ) : (
              <h1 className="mt-8 max-w-2xl text-4xl font-black leading-tight text-navy-900 sm:text-5xl lg:text-[46px]">
                We are a <span className="text-upchar-green">service provider</span> connecting you with{" "}
                <span className="text-upchar-green">NABL accredited labs</span> &{" "}
                <span className="text-upchar-green">trusted collection partners.</span>
              </h1>
            )}

            <div className="mt-6 flex max-w-sm items-center gap-5 rounded-lg border border-blue-100 bg-white p-5 shadow-card">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-green-50 text-upchar-green">
                <ShieldCheck className="h-11 w-11" strokeWidth={2.2} />
              </span>
              <p className="text-2xl font-black leading-snug text-navy-900">
                {textValue(content?.subtitle, "We are a Service Provider Not a Lab")}
              </p>
            </div>

            <p className="mt-7 max-w-xl text-lg font-semibold leading-8 text-navy-800">
              {textValue(content?.description, "Upchar Pathology is a technology-driven platform that connects you with NABL accredited laboratories and verified sample collection partners for a seamless testing experience.")}
            </p>
          </div>

          <div className="relative hidden h-[390px] overflow-hidden rounded-xl lg:block">
            <img src={imageValue(content?.imageUrl, aboutHero)} alt="Doctor using a microscope in a pathology lab" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/15 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutHero;
