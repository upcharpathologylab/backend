import { useEffect, useState } from "react";
import { ChevronDown, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AccountLayout from "../components/account/AccountLayout.jsx";
import AccountToast from "../components/account/AccountToast.jsx";
import { AccountEmptyState, AccountLoadingState, AccountSyncNotice } from "../components/account/AccountState.jsx";
import QuickActions from "../components/account/QuickActions.jsx";
import SavedPackageCard from "../components/account/saved-packages/SavedPackageCard.jsx";
import SummaryCard from "../components/account/SummaryCard.jsx";
import TrustStrip from "../components/account/TrustStrip.jsx";
import { getUserSavedPackages } from "../api/api.js";
import { clearAuthSession } from "../components/auth/authStorage.js";
import { quickAccountActions, savedPackages, savedPackageSummaryCards } from "../data/accountPagesData.js";
import useAccountResource from "../hooks/useAccountResource.js";
import { addCartItem } from "../utils/cart.js";

function AccountSavedPackagesPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");
  const { data: packages, loading, error } = useAccountResource(getUserSavedPackages, savedPackages, []);

  useEffect(() => {
    document.title = "Saved Packages | Upchar Pathology";
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

  const bookPackage = (item) => {
    addCartItem({
      id: item.id,
      name: item.title,
      type: "package",
      price: item.price,
      oldPrice: item.oldPrice,
      subtitle: item.subtitle,
      description: item.description,
      icon: item.icon,
      color: item.color
    });
    showToast(`${item.title} added to cart.`);
  };

  return (
    <AccountLayout
      active="saved"
      breadcrumbCurrent="Saved Packages"
      title="Saved Packages"
      subtitle="View and manage the health packages you have saved for future booking."
      actions={
        <button type="button" onClick={logout} className="inline-flex h-12 items-center gap-3 rounded-lg border border-blue-100 bg-white px-6 text-sm font-black text-upchar-red shadow-sm transition hover:bg-red-50">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {savedPackageSummaryCards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </section>

      <AccountSyncNotice message={error} />

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-black text-navy-900">Your Saved Packages</h2>
          <button type="button" className="inline-flex h-11 items-center justify-center gap-3 rounded-md border border-blue-100 px-4 text-sm font-black text-navy-800 hover:bg-blue-50">
            Recently Saved
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          {loading ? (
            <AccountLoadingState />
          ) : packages.length ? (
            packages.map((item) => <SavedPackageCard key={item.id} item={item} onBook={bookPackage} />)
          ) : (
            <AccountEmptyState title="No saved packages" text="Save a package to book it later." />
          )}
        </div>
        <section className="mt-5 grid gap-4 rounded-lg border border-green-100 bg-green-50/50 p-5 sm:grid-cols-[58px_1fr]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-upchar-green shadow-sm">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <div>
            <h3 className="text-lg font-black text-upchar-green">Why save packages?</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-navy-700">
              Save your favorite health packages and book them anytime. You'll also get exclusive discounts on booking.
            </p>
          </div>
        </section>
      </section>

      <QuickActions actions={quickAccountActions} />
      <TrustStrip />
      <AccountToast message={toast} />
    </AccountLayout>
  );
}

export default AccountSavedPackagesPage;
