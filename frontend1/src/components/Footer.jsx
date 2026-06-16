import { useEffect, useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedServiceLocation, getHomeData, getPageContent } from "../api/api.js";
import Icon from "./Icon.jsx";
import Logo from "./Logo.jsx";
import { resolveContactInfo } from "../utils/contactInfo.js";
import { socialLinks } from "../data/socialLinks.js";

const footerRoutes = {
  "About Us": "/about-us",
  Blog: "/blog",
  Careers: "/careers",
  "Contact Us": "/contact-us",
  "Corporate Services": "/corporate-services",
  "Health Packages": "/packages",
  "Sample Collection": "/sample-collection",
  "Home Collection": "/home-collection",
  "Help Center": "/help-center",
  FAQs: "/faqs",
  "Terms & Conditions": "/terms-conditions",
  "Privacy Policy": "/privacy-policy",
  "Refund Policy": "/refund-policy"
};

const allTestsLinks = [
  { label: "Packages", href: "/packages" },
  { label: "Tests", href: "/tests" }
];

function FooterList({ title, links }) {
  return (
    <div>
      <h3 className="mb-5 text-sm font-black uppercase tracking-wide text-upchar-green">{title}</h3>
      <ul className="grid gap-4 text-sm font-semibold text-blue-50">
        {links.map((link) => (
          <li key={link}>
            {link === "All Tests" ? (
              <div className="group relative inline-block">
                <button type="button" className="cursor-pointer text-left transition hover:text-upchar-green" aria-label="Open All Tests links">
                  {link}
                </button>
                <div className="invisible absolute bottom-full left-0 z-20 mb-2 min-w-36 rounded-lg border border-blue-300/20 bg-navy-900 p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  {allTestsLinks.map((item) => (
                    <Link to={item.href} className="block rounded-md px-3 py-2 text-sm font-bold text-blue-50 hover:bg-white/10 hover:text-upchar-green" key={item.label}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link to={footerRoutes[link] || "#"} className="cursor-pointer transition hover:text-upchar-green">
                {link}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer({ data, serviceLocation: providedServiceLocation }) {
  const [siteSettings, setSiteSettings] = useState(() => data.siteSettings || {});
  const [fetchedServiceLocation, setFetchedServiceLocation] = useState(null);
  const [contactContent, setContactContent] = useState(null);
  const serviceLocation = providedServiceLocation === undefined ? fetchedServiceLocation : providedServiceLocation;
  const contact = resolveContactInfo(contactContent, siteSettings, serviceLocation);
  const locationQuery = `${contact.companyName} ${contact.address}`.trim();
  const locationUrl = serviceLocation?.googlePlaceUrl?.trim()
    || serviceLocation?.googleDirectionUrl?.trim()
    || (locationQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}` : "#");

  useEffect(() => {
    let mounted = true;
    getHomeData()
      .then((homeData) => {
        if (mounted && homeData?.siteSettings) setSiteSettings({ ...(data.siteSettings || {}), ...homeData.siteSettings });
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [data.siteSettings]);

  useEffect(() => {
    if (providedServiceLocation !== undefined) return undefined;

    let mounted = true;
    getFeaturedServiceLocation()
      .then((location) => {
        if (mounted) setFetchedServiceLocation(location || null);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [providedServiceLocation]);

  useEffect(() => {
    let mounted = true;
    getPageContent("contact-us")
      .then((page) => {
        const section = (page?.sections || []).find((item) => item.sectionKey === "contact-info") || null;
        if (mounted) setContactContent(section);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer id="contact-us" className="bg-navy-950 text-white">
      <div className="container-page py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.55fr_0.55fr_0.65fr_1.15fr]">
          <div>
            <Logo light />
            <p className="mt-7 max-w-sm text-sm leading-7 text-blue-50">
              Upchar Pathology is a technology-driven service provider connecting you with NABL accredited labs and
              trusted collection partners for accurate, timely and reliable diagnostic services.
            </p>
            <h3 className="mt-8 text-sm font-black uppercase tracking-wide text-upchar-green">Follow Us</h3>
            <div className="mt-4 flex gap-3">
              {socialLinks.map(({ icon: SocialIcon, label, url }) => (
                <a
                  href={url || undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-300/40 text-sm font-black text-white transition hover:border-upchar-green hover:text-upchar-green"
                  key={label}
                  aria-label={label}
                  target={url ? "_blank" : undefined}
                  rel={url ? "noreferrer" : undefined}
                >
                  <SocialIcon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterList title="Company" links={siteSettings.footerLinks.company} />
          <FooterList title="Services" links={siteSettings.footerLinks.services} />
          <FooterList title="Support" links={siteSettings.footerLinks.support} />

          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-wide text-upchar-green">{contact.heading}</h3>
            <ul className="grid gap-5 text-sm font-semibold text-blue-50">
              <li className="flex gap-3">
                <Phone className="h-5 w-5 shrink-0 text-white" />
                <a href={contact.phoneHref}>{contact.phoneNumber}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 shrink-0 text-white" />
                <a href={contact.emailHref}>{contact.emailAddress}</a>
              </li>
              {contact.companyName ? <li className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-white" />
                <a href={locationUrl} target="_blank" rel="noreferrer" className="hover:text-upchar-green">{contact.companyName}</a>
              </li> : null}
              {contact.phoneTiming ? <li className="flex gap-3">
                <Icon name="Clock3" className="h-5 w-5 shrink-0 text-white" />
                <span>{contact.phoneTiming}</span>
              </li> : null}
              {contact.address ? <li className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-white" />
                <a href={locationUrl} target="_blank" rel="noreferrer" className="cursor-pointer hover:text-upchar-green">
                  {contact.address}
                </a>
              </li> : null}
            </ul>
            <a
              href={contact.whatsappHref || "#"}
              className="mt-8 inline-flex items-center gap-4 rounded-xl bg-white/5 p-4 text-sm font-bold text-white ring-1 ring-blue-300/20 transition hover:bg-white/10"
              aria-label="Open WhatsApp chat"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-upchar-green">
                <Icon name="MessageCircle" className="h-7 w-7" />
              </span>
              <span>
                WhatsApp
                <span className="block text-xs font-semibold text-blue-100">{contact.whatsappText}</span>
              </span>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-blue-300/20 pt-8 text-sm font-semibold text-blue-100 lg:flex-row lg:items-center lg:justify-between">
          <p>© 2024 Upchar Pathology. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            {["About Us", "Terms & Conditions", "Privacy Policy", "Refund Policy"].map((link) => (
              <Link to={footerRoutes[link]} className="cursor-pointer hover:text-upchar-green" key={link}>
                {link}
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            {["VISA", "Master", "UPI", "Paytm"].map((payment) => (
              <span className="rounded-md bg-white px-3 py-1.5 text-xs font-black text-navy-900" key={payment}>
                {payment}
              </span>
            ))}
          </div>
        </div>
      </div>
      <a
        href={contact.whatsappHref || "#"}
        className="fixed bottom-5 right-5 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-upchar-green text-white shadow-soft transition hover:bg-upchar-greenDark"
        aria-label="WhatsApp instant reports"
      >
        <Icon name="MessageCircle" className="h-8 w-8" />
      </a>
    </footer>
  );
}

export default Footer;
