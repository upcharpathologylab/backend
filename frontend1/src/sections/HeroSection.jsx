import { useEffect, useState } from "react";
import { ArrowRight, BadgePercent, X } from "lucide-react";
import { motion } from "framer-motion";
import Icon from "../components/Icon.jsx";
import AuthModal from "../components/auth/AuthModal.jsx";
import { getStoredUser } from "../components/auth/authStorage.js";
import { assetUrl } from "../api/api.js";
import heroBackground from "../assets/hero-bg.png";
import BookingMapSection from "./BookingMapSection.jsx";

function HeroSection({ data, loading, tests, packages }) {
  const { hero } = data;
  const [bookingOpen, setBookingOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");

  useEffect(() => {
    if (!bookingOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setBookingOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [bookingOpen]);

  const openBooking = () => {
    if (getStoredUser()) {
      setBookingOpen(true);
      return;
    }

    setAuthMode("signin");
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    setBookingOpen(true);
  };

  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0">
        <img src={assetUrl(hero.image) || heroBackground} alt="" className="h-full w-full object-cover object-[62%_center]" aria-hidden="true" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-[50%] bg-navy-950/30" />

      <div className="container-page relative flex min-h-[430px] items-center py-7 lg:h-[350px] lg:min-h-0 lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-[700px]"
        >
          <h1 className="max-w-[680px] whitespace-pre-line text-4xl font-black leading-tight text-white sm:text-5xl lg:text-[36px] lg:leading-[1.12] 2xl:text-[39px]">
            {hero.title.split("\n")[0]}
            {hero.title.split("\n")[1] ? <span className="block text-[#159447]">{hero.title.split("\n").slice(1).join("\n")}</span> : null}
            {hero.highlightText ? <span className="text-[#159447]"> {hero.highlightText}</span> : null}
          </h1>
          <p className="mt-3 max-w-[650px] text-base font-semibold leading-7 text-white lg:text-[17px]">{hero.subtitle}</p>

          <div className="mt-4 grid max-w-[660px] grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4">
            {hero.trustPoints.map((point, index) => (
              <div className={`flex items-center gap-2 text-[13px] font-bold text-white ${index ? "md:border-l md:border-white/25 md:pl-3" : ""}`} key={point.label}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center text-white">
                  <Icon name={point.icon} className="h-7 w-7 text-white" />
                </span>
                {point.label}
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            {hero.buttons.map((button) => {
              const opensBooking = button.href === "#booking";
              const ButtonTag = opensBooking ? "button" : "a";
              return (
              <ButtonTag
                {...(opensBooking ? { type: "button", onClick: openBooking } : { href: button.href })}
                className={
                  button.variant === "primary"
                    ? "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-upchar-green px-6 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition hover:-translate-y-0.5 hover:bg-upchar-greenDark"
                    : "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/70 bg-white/5 px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                }
                key={button.label}
              >
                {button.label}
                <ArrowRight className="h-5 w-5" />
              </ButtonTag>
            )})}
            <div className="inline-flex min-h-11 max-w-full flex-wrap items-center gap-3 rounded-lg bg-white px-4 py-1.5 text-sm font-extrabold text-upchar-green shadow-soft sm:h-11 sm:flex-nowrap sm:py-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50">
                <BadgePercent className="h-5 w-5" />
              </span>
              <span className="sm:whitespace-nowrap">{hero.offerText.split(" on ")[0]}</span>
              <span className="hidden h-6 w-px shrink-0 bg-blue-100 sm:block" />
              <span className="text-upchar-blue sm:whitespace-nowrap">on {hero.offerText.split(" on ")[1] || "selected health packages"}</span>
            </div>
          </div>
        </motion.div>
      </div>
      {loading && <div className="absolute inset-x-0 bottom-0 h-1 animate-pulse bg-upchar-green" />}
      {bookingOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-navy-950/70 p-4" onClick={() => setBookingOpen(false)}>
          <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy-900 shadow-card"
              onClick={() => setBookingOpen(false)}
              aria-label="Close booking form"
            >
              <X className="h-5 w-5" />
            </button>
            <BookingMapSection data={data} modal tests={tests} packages={packages} />
          </div>
        </div>
      )}
      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </section>
  );
}

export default HeroSection;
