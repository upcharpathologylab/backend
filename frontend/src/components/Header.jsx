import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Mail, Menu, Phone, ShoppingCart, UserRound, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthModal from "./auth/AuthModal.jsx";
import { clearAuthSession, getStoredUser } from "./auth/authStorage.js";
import { getHomeData, getPageContent } from "../api/api.js";
import Icon from "./Icon.jsx";
import Logo from "./Logo.jsx";
import { cartEventName, getCartCount } from "../utils/cart.js";
import { resolveContactInfo } from "../utils/contactInfo.js";
import { socialLinks } from "../data/socialLinks.js";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Packages", href: "/packages" },
  { label: "Tests", href: "/tests" },
  { label: "Contact Us", href: "/contact-us" }
];
const headerContainer = "mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8";

function Dropdown({ label, items, align = "left" }) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 text-[15px] font-extrabold text-black transition hover:text-upchar-green 2xl:px-3 2xl:text-base">
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>
      <div
        className={`invisible absolute top-full z-30 mt-2 w-72 rounded-lg border border-blue-100 bg-white p-2 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100 ${
          align === "right" ? "right-0" : "left-0"
        }`}
      >
        {items.map((item) => (
          <a
            href="/#booking"
            className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-navy-800 hover:bg-blue-50 hover:text-upchar-blue"
            key={item}
          >
            <Icon name={label === "Govt Panel" ? "Building2" : "Handshake"} className="h-5 w-5 text-upchar-green" />
            <span>{item}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Header({ data }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [cartCount, setCartCount] = useState(() => getCartCount());
  const [toast, setToast] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [contactContent, setContactContent] = useState(null);
  const [siteSettings, setSiteSettings] = useState(() => data.siteSettings || {});
  const profileTimerRef = useRef(null);
  const authReturnToRef = useRef("");
  const contact = resolveContactInfo(contactContent, siteSettings);
  const phone = contact.phoneNumber;
  const email = contact.emailAddress;
  const openAuth = (mode = "signin") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setOpen(false);
  };

  const handleAuthSuccess = (user, message) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
    if (authReturnToRef.current) {
      const returnTo = authReturnToRef.current;
      authReturnToRef.current = "";
      navigate(returnTo, { replace: true });
    }
  };

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

  const logout = () => {
    clearAuthSession();
    setCurrentUser(null);
    setProfileOpen(false);
    setToast("Signed out successfully.");
    window.setTimeout(() => setToast(""), 3000);
  };

  const openProfile = (event) => {
    event.stopPropagation();
    setProfileOpen(true);
    window.clearTimeout(profileTimerRef.current);
    profileTimerRef.current = window.setTimeout(() => setProfileOpen(false), 10000);
  };

  useEffect(() => {
    let mounted = true;
    getHomeData()
      .then((homeData) => {
        if (mounted && homeData?.siteSettings) setSiteSettings({ ...(data.siteSettings || {}), ...homeData.siteSettings });
      })
      .catch(() => {});

    getPageContent("contact-us")
      .then((page) => {
        const section = (page?.sections || []).find((item) => item.sectionKey === "contact-info") || null;
        if (mounted) setContactContent(section);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [data.siteSettings]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("auth") !== "signin") return;

    authReturnToRef.current = params.get("returnTo") || "";
    setAuthMode("signin");
    setAuthModalOpen(true);
    setOpen(false);
  }, [location.search]);

  useEffect(() => {
    const refreshCount = (event) => {
      setCartCount(event.detail?.count ?? getCartCount());
    };

    window.addEventListener(cartEventName, refreshCount);
    window.addEventListener("storage", refreshCount);

    return () => {
      window.removeEventListener(cartEventName, refreshCount);
      window.removeEventListener("storage", refreshCount);
      window.clearTimeout(profileTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const refreshUser = () => setCurrentUser(getStoredUser());

    window.addEventListener("storage", refreshUser);
    window.addEventListener("upchar-auth-user-updated", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("upchar-auth-user-updated", refreshUser);
    };
  }, []);

  const isActiveNav = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname === href;
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-md">
        <div className="hidden bg-navy-950 text-white md:block">
          <div className={`${headerContainer} flex h-9 items-center justify-between gap-4`}>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <a href={contact.phoneHref} className="inline-flex items-center gap-2">
              <Phone className="h-5 w-5" />
              {phone}
            </a>
            <span className="hidden h-6 w-px bg-white/35 sm:block" />
            <a href={contact.emailHref} className="inline-flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {email}
            </a>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <span className="text-sm font-semibold">Follow Us:</span>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: SocialIcon, label, color, url }) => (
                <a
                  href={url || undefined}
                  aria-label={label}
                  target={url ? "_blank" : undefined}
                  rel={url ? "noreferrer" : undefined}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black uppercase text-white shadow-lg ${color}`}
                  key={label}
                >
                  <SocialIcon className="h-4 w-4" />
                </a>
              ))}
            </div>
            {currentUser ? (
              <div className="relative" onClick={(event) => event.stopPropagation()}>
                <button type="button" className="inline-flex h-8 items-center gap-2 rounded-md border border-white/60 px-4 text-sm font-bold" onClick={openProfile}>
                  <UserRound className="h-4 w-4" />
                  {currentUser.fullName?.split(" ")[0] || "Account"}
                </button>
                <div className={`${profileOpen ? "visible opacity-100" : "invisible opacity-0"} absolute right-0 top-full mt-2 w-44 rounded-lg bg-white p-2 text-navy-900 shadow-soft transition`}>
                  <Link to="/my-account" className="block rounded-md px-3 py-2 text-sm font-bold hover:bg-blue-50" onClick={() => setProfileOpen(false)}>
                    My Account
                  </Link>
                  <button className="w-full rounded-md px-3 py-2 text-left text-sm font-bold hover:bg-blue-50" onClick={logout}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-2 rounded-md border border-white/60 px-4 text-sm font-bold"
                  onClick={() => openAuth("signin")}
                >
                  <UserRound className="h-4 w-4" />
                  Sign In
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-2 rounded-md bg-[#3d30e8] px-4 text-sm font-bold"
                  onClick={() => openAuth("signup")}
                >
                  <UserRound className="h-4 w-4" />
                  Sign Up
                </button>
              </>
            )}
            <Link to="/cart" className="inline-flex h-8 items-center gap-2 rounded-md bg-upchar-green px-4 text-sm font-bold">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart ({cartCount})
            </Link>
          </div>
        </div>
        </div>

        <div className={`${headerContainer} flex h-[68px] items-center justify-between gap-5 lg:h-[72px]`}>
        <Logo size="large" />

        <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex 2xl:gap-2">
          {navItems.map((item) => (
            <Link
              to={item.href}
              className="relative whitespace-nowrap rounded-lg px-2 py-2 text-[15px] font-extrabold text-black transition hover:text-upchar-green 2xl:px-2.5 2xl:text-base"
              key={item.label}
            >
              {item.label}
              {isActiveNav(item.href) && <span className="absolute -bottom-2 left-3 right-3 h-1 rounded-full bg-upchar-green" />}
            </Link>
          ))}
          <Dropdown label="Govt Panel" items={data.govtPanels} />
          <Dropdown label="Partnerships" items={data.partnerships} align="right" />
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <a
            href={contact.phoneHref}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 text-sm font-extrabold text-upchar-blue shadow-sm transition hover:-translate-y-0.5"
          >
            <Phone className="h-6 w-6 fill-upchar-blue/10" />
            <span>
              Call Us
              <span className="block text-xs text-upchar-blue">{phone}</span>
            </span>
          </a>
          <a
            href={contact.whatsappHref}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-upchar-green px-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-upchar-greenDark"
          >
            <Icon name="MessageCircle" className="h-6 w-6" />
            <span>
              WhatsApp
              <span className="block text-xs text-green-50">Instant Reports</span>
            </span>
          </a>
          </div>

          <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blue-100 text-navy-900 xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-blue-100 bg-white xl:hidden"
            >
              <div className="container-page grid gap-2 py-4">
                {[...navItems, { label: "Govt Panel", href: "/#booking" }, { label: "Partnerships", href: "/#booking" }].map((item) => (
                  <Link
                    to={item.href}
                    className="rounded-lg px-3 py-3 text-sm font-bold text-navy-900 hover:bg-blue-50"
                    key={item.label}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="grid gap-2 sm:grid-cols-3">
                  <Link to="/cart" className="button-primary" onClick={() => setOpen(false)}>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart ({cartCount})
                  </Link>
                  <a href={contact.phoneHref} className="button-primary">
                    <Phone className="h-5 w-5" />
                    Call {phone}
                  </a>
                  {currentUser ? (
                    <Link to="/my-account" className="rounded-lg bg-navy-900 px-5 py-3 text-center text-sm font-bold text-white" onClick={() => setOpen(false)}>
                      My Account
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="rounded-lg bg-navy-900 px-5 py-3 text-center text-sm font-bold text-white"
                      onClick={() => openAuth("signin")}
                    >
                      Sign In / Sign Up
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        onSignupSuccess={showToast}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed right-5 top-28 z-[110] rounded-lg bg-navy-950 px-5 py-3 text-sm font-bold text-white shadow-soft"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
