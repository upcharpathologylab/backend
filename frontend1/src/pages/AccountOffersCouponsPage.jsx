import { useEffect, useMemo, useState } from "react";
import { ChevronRight, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AccountLayout from "../components/account/AccountLayout.jsx";
import AccountToast from "../components/account/AccountToast.jsx";
import { AccountLoadingState, AccountSyncNotice } from "../components/account/AccountState.jsx";
import CouponCard from "../components/account/offers/CouponCard.jsx";
import OfferCard from "../components/account/offers/OfferCard.jsx";
import SummaryCard from "../components/account/SummaryCard.jsx";
import TabFilterBar from "../components/account/TabFilterBar.jsx";
import TrustStrip from "../components/account/TrustStrip.jsx";
import { applyUserCoupon, getCoupons, getUserOffers } from "../api/api.js";
import { clearAuthSession } from "../components/auth/authStorage.js";
import useAccountResource from "../hooks/useAccountResource.js";

const offerTabs = ["All Offers", "Coupons", "Exclusive Offers"];

const normalizeCoupon = (item) => ({
  ...item,
  title: item.title || item.couponName || item.couponCode,
  discount: item.discount || (item.discountType === "Flat" ? `Rs. ${item.discountValue} OFF` : `${item.discountValue}% OFF`),
  validTill: item.validTill || item.validTo,
  minOrder: item.minOrderLabel || `Rs. ${item.minOrder || 0}`,
  code: item.code || item.couponCode,
  text: item.text || item.description || item.couponName || "",
  badge: item.badge || item.applicableOn || "Applicable offer",
  value: item.value || (item.discountType === "Flat" ? `Rs. ${item.discountValue}` : `${item.discountValue}%`),
  suffix: item.suffix || "OFF",
  label: item.label || item.applicableOn || "HEALTH OFFER",
  color: item.color || (item.isBestOffer ? "red" : item.discountType === "Flat" ? "orange" : "green")
});

const discountAmount = (item, subtotal = Number(item.minOrder || 0) || 1000) => {
  const amount = item.discountType === "Flat" ? Number(item.discountValue || 0) : Math.round((subtotal * Number(item.discountValue || 0)) / 100);
  return item.maxDiscount ? Math.min(amount, Number(item.maxDiscount || 0)) : amount;
};

function HowToUseCoupons() {
  const steps = ["Choose your tests or packages", "Add to cart & go to checkout", "Apply coupon code at payment step", "Get instant discount & place your order"];

  return (
    <div className="mt-5 grid gap-3 rounded-lg border border-green-100 bg-green-50/50 p-4 md:grid-cols-4">
      {steps.map((step, index) => (
        <div className="flex items-center gap-3 text-sm font-black text-navy-900" key={step}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-upchar-green">{index + 1}</span>
          <span className="flex-1">{step}</span>
          {index < steps.length - 1 ? <ChevronRight className="hidden h-5 w-5 text-navy-500 md:block" /> : null}
        </div>
      ))}
    </div>
  );
}

function AccountOffersCouponsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(offerTabs[0]);
  const [toast, setToast] = useState("");
  const { data: offers, loading: offersLoading, error: offersError } = useAccountResource(getUserOffers, [], []);
  const { data: couponData, loading: couponsLoading, error: couponsError } = useAccountResource(getCoupons, [], []);

  useEffect(() => {
    document.title = "Offers & Coupons | Upchar Pathology";
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const logout = () => {
    clearAuthSession();
    showToast("Logged out successfully");
    window.setTimeout(() => navigate("/"), 700);
  };

  const applyCoupon = async (item) => {
    try {
      await applyUserCoupon({ couponId: item.id, code: item.code });
      showToast(`${item.title} applied successfully.`);
    } catch {
      showToast(`${item.title} is ready to use at checkout.`);
    }
  };

  const normalizedOffers = useMemo(() => offers.map(normalizeCoupon), [offers]);
  const normalizedCoupons = useMemo(() => couponData.map(normalizeCoupon), [couponData]);
  const bestOffer = useMemo(
    () => normalizedOffers.find((item) => item.isBestOffer || item.badge === "Best Offer") || normalizedOffers[0] || normalizedCoupons[0],
    [normalizedCoupons, normalizedOffers]
  );
  const estimatedSavings = useMemo(
    () => Math.max(0, ...[...normalizedOffers, ...normalizedCoupons].map((item) => discountAmount(item))),
    [normalizedCoupons, normalizedOffers]
  );
  const summaryCards = useMemo(
    () => [
      { title: "Available Offers", value: String(normalizedOffers.length), icon: "BadgePercent", color: "purple" },
      { title: "Available Coupons", value: String(normalizedCoupons.length), icon: "TicketPercent", color: "green" },
      { title: "You Save (Est.)", value: `Rs. ${estimatedSavings.toLocaleString("en-IN")}`, icon: "WalletCards", color: "blue" },
      { title: "Best Offer", value: bestOffer?.discount || bestOffer?.value || "-", icon: "Gift", color: "red" }
    ],
    [bestOffer, estimatedSavings, normalizedCoupons.length, normalizedOffers.length]
  );

  const showOffers = activeTab !== "Coupons";
  const showCoupons = activeTab !== "Exclusive Offers";

  return (
    <AccountLayout
      active="offers"
      breadcrumbCurrent="Offers & Coupons"
      title="Offers & Coupons"
      subtitle="View exclusive offers and apply coupons to save on your bookings."
      actions={
        <button type="button" onClick={logout} className="inline-flex h-12 items-center gap-3 rounded-lg border border-blue-100 bg-white px-6 text-sm font-black text-upchar-red shadow-sm transition hover:bg-red-50">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </section>

      <AccountSyncNotice message={offersError || couponsError} />

      <section className="grid gap-5 rounded-lg border border-green-100 bg-green-50/50 p-5 shadow-sm lg:grid-cols-[1fr_220px] lg:items-center">
        <div className="flex gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-upchar-green shadow-sm">
            <ShieldCheck className="h-8 w-8" />
          </span>
          <div>
            <h2 className="text-xl font-black text-upchar-green">{bestOffer?.title || "Great Savings Await!"}</h2>
            <p className="mt-2 text-sm font-semibold text-navy-700">{bestOffer?.text || "Apply coupons while booking tests & packages to get instant discounts."}</p>
          </div>
        </div>
        <div className="rounded-md border border-dashed border-upchar-green bg-white p-4 text-center text-upchar-green">
          <span className="block text-2xl font-black">{bestOffer?.code || "SAVE MORE"}</span>
          <span className="text-xs font-black uppercase">{bestOffer?.discount || "on your health"}</span>
        </div>
      </section>

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
        <TabFilterBar tabs={offerTabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {showOffers ? (
          <div className="mt-6">
            <h2 className="text-xl font-black text-navy-900">Active Offers</h2>
            <div className="mt-4 grid gap-4">
              {offersLoading ? <AccountLoadingState /> : normalizedOffers.map((offer) => <OfferCard item={offer} key={offer.id} onAction={() => showToast(`${offer.title}: ${offer.code}`)} />)}
              {!offersLoading && !normalizedOffers.length ? <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-6 text-sm font-black text-navy-600">No active offers available.</div> : null}
            </div>
          </div>
        ) : null}

        {showCoupons ? (
          <div className="mt-6">
            <h2 className="text-xl font-black text-navy-900">Available Coupons</h2>
            <div className="mt-4 grid gap-4">
              {couponsLoading ? <AccountLoadingState /> : normalizedCoupons.map((coupon) => <CouponCard item={coupon} key={coupon.id} onApply={applyCoupon} />)}
              {!couponsLoading && !normalizedCoupons.length ? <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-6 text-sm font-black text-navy-600">No active coupons available.</div> : null}
            </div>
          </div>
        ) : null}

        <HowToUseCoupons />
      </section>

      <TrustStrip />
      <AccountToast message={toast} />
    </AccountLayout>
  );
}

export default AccountOffersCouponsPage;
