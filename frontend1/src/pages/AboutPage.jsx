import { useEffect, useState } from "react";
import { getPageContent } from "../api/api.js";
import AboutHero from "../components/about/AboutHero.jsx";
import MissionVision from "../components/about/MissionVision.jsx";
import NeedHelpCTA from "../components/about/NeedHelpCTA.jsx";
import OurPromise from "../components/about/OurPromise.jsx";
import WhyChooseAbout from "../components/about/WhyChooseAbout.jsx";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import { fallbackHomeData } from "../data/homeData.js";
import { getContentSection } from "../utils/contentOverrides.js";

function AboutPage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    document.title = "About Us | Upchar Pathology";
    let mounted = true;

    getPageContent("about-us")
      .then((data) => {
        if (mounted) setContent(data);
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
        <AboutHero content={getContentSection(content, "hero")} />
        <MissionVision />
        <WhyChooseAbout />
        <OurPromise />
        <NeedHelpCTA />
      </main>
      <Footer data={fallbackHomeData} />
    </div>
  );
}

export default AboutPage;
