import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Header from "../components/Header.jsx";
import { getPageContent } from "../api/api.js";
import { policyPageDefaults } from "../data/adminContentPagesData.js";
import { fallbackHomeData } from "../data/homeData.js";

const pageTitles = {
  "privacy-policy": "Privacy Policy",
  "refund-policy": "Refund Policy",
  "terms-conditions": "Terms & Conditions"
};

function PolicyContent({ content }) {
  const blocks = String(content || "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="grid gap-5 text-base font-semibold leading-8 text-navy-700">
      {blocks.map((block, index) => (
        <p key={`${block.slice(0, 24)}-${index}`}>{block}</p>
      ))}
    </div>
  );
}

function PolicyPage() {
  const { pathname } = useLocation();
  const policySlug = pathname.replace(/^\/+/, "") || "privacy-policy";
  const defaults = policyPageDefaults[policySlug] || policyPageDefaults["privacy-policy"];
  const [pageContent, setPageContent] = useState(null);
  const title = pageTitles[policySlug] || defaults.title;

  useEffect(() => {
    document.title = `${title} | Upchar Pathology`;
    let mounted = true;

    getPageContent(policySlug)
      .then((data) => {
        if (mounted) setPageContent(data);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [policySlug, title]);

  const publishedContent = useMemo(() => {
    const main = pageContent?.sections?.find((section) => section.sectionKey === "main");
    if (!main || main.status === "Draft") return defaults;

    return {
      title: main.title || defaults.title,
      description: main.description || defaults.description
    };
  }, [defaults, pageContent]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header data={fallbackHomeData} />
      <main className="pt-[68px] md:pt-[104px] lg:pt-[108px]">
        <section className="bg-gradient-to-b from-blue-50/70 to-white py-10 lg:py-14">
          <div className="container-page">
            <p className="text-sm font-black uppercase tracking-wide text-upchar-green">Upchar Pathology</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-navy-950 sm:text-5xl">{publishedContent.title}</h1>
          </div>
        </section>

        <section className="py-10 lg:py-14">
          <div className="container-page">
            <article className="rounded-lg border border-blue-100 bg-white p-6 shadow-sm lg:p-8">
              <PolicyContent content={publishedContent.description} />
            </article>
          </div>
        </section>
      </main>
      <Footer data={fallbackHomeData} />
    </div>
  );
}

export default PolicyPage;
