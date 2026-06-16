import { useEffect, useState } from "react";
import { getFeaturedServiceLocation, getPageContent } from "../api/api.js";
import ContactFeatures from "../components/contact/ContactFeatures.jsx";
import ContactForm from "../components/contact/ContactForm.jsx";
import ContactHero from "../components/contact/ContactHero.jsx";
import ContactInfo from "../components/contact/ContactInfo.jsx";
import ContactMap from "../components/contact/ContactMap.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import { fallbackHomeData } from "../data/homeData.js";
import { getContentSection } from "../utils/contentOverrides.js";

function ContactPage() {
  const [content, setContent] = useState(null);
  const [serviceLocation, setServiceLocation] = useState(null);

  useEffect(() => {
    document.title = "Contact Us | Upchar Pathology";
    let mounted = true;

    getPageContent("contact-us")
      .then((data) => {
        if (mounted) setContent(data);
      })
      .catch(() => {});
    getFeaturedServiceLocation()
      .then((data) => {
        if (mounted) setServiceLocation(data?.data || data || null);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header data={fallbackHomeData} />
      <main className="pt-[68px] md:pt-[104px] lg:pt-[108px]">
        <ContactHero content={getContentSection(content, "hero")} />
        <section className="bg-gradient-to-b from-white to-blue-50/50 py-8 lg:py-10">
          <div className="container-page grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
            <ContactForm content={getContentSection(content, "contact-form")} />
            <ContactInfo
              content={getContentSection(content, "contact-info")}
              immediateHelp={getContentSection(content, "immediate-help")}
              serviceLocation={serviceLocation}
              defaults={fallbackHomeData.siteSettings}
            />
          </div>
          <div className="container-page mt-5">
            <ContactMap content={getContentSection(content, "location")} serviceLocation={serviceLocation} />
          </div>
          <div className="container-page mt-5">
            <ContactFeatures />
          </div>
        </section>
      </main>
      <Footer data={fallbackHomeData} serviceLocation={serviceLocation} />
    </div>
  );
}

export default ContactPage;
