import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AccountLayout from "../components/account/AccountLayout.jsx";
import AccountToast from "../components/account/AccountToast.jsx";
import { AccountEmptyState, AccountLoadingState, AccountSyncNotice } from "../components/account/AccountState.jsx";
import BookingCard from "../components/account/bookings/BookingCard.jsx";
import ConfirmDeleteModal from "../components/account/ConfirmDeleteModal.jsx";
import HeroIllustration from "../components/account/HeroIllustration.jsx";
import QuickActions from "../components/account/QuickActions.jsx";
import SummaryCard from "../components/account/SummaryCard.jsx";
import TabFilterBar from "../components/account/TabFilterBar.jsx";
import TrustStrip from "../components/account/TrustStrip.jsx";
import UserProfileCard from "../components/account/UserProfileCard.jsx";
import { cancelUserBooking, getUserBookings } from "../api/api.js";
import { getStoredUser } from "../components/auth/authStorage.js";

const bookingSummaryCards = [
  { title: "Total Bookings", icon: "ClipboardList", color: "blue" },
  { title: "Completed", icon: "BadgeCheck", color: "green" },
  { title: "Upcoming", icon: "Clock3", color: "orange" },
  { title: "Cancelled", icon: "CircleX", color: "red" }
];

function AccountBookingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Bookings");
  const [toast, setToast] = useState("");
  const [bookings, setBookings] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [profile, setProfile] = useState(() => getStoredUser() || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    document.title = "My Bookings | Upchar Pathology";

    async function loadBookings() {
      if (!getStoredUser()) {
        navigate(`/?auth=signin&returnTo=${encodeURIComponent("/my-account/bookings")}`, { replace: true });
        return;
      }

      setProfile(getStoredUser() || {});
      setLoading(true);
      setError("");
      try {
        const data = await getUserBookings();
        if (active) setBookings(Array.isArray(data) ? data : []);
      } catch {
        if (active) {
          setBookings([]);
          setError("Could not load your bookings. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBookings();
    return () => {
      active = false;
    };
  }, []);

  const filteredBookings = useMemo(() => {
    if (activeTab.startsWith("Upcoming")) return bookings.filter((item) => item.status === "Upcoming");
    if (activeTab.startsWith("Completed")) return bookings.filter((item) => item.status === "Completed");
    if (activeTab.startsWith("Cancelled")) return bookings.filter((item) => item.status === "Cancelled");
    return bookings;
  }, [activeTab, bookings]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const summaryCards = useMemo(() => {
    const total = bookings.length;
    const upcoming = bookings.filter((item) => item.status === "Upcoming").length;
    const completed = bookings.filter((item) => item.status === "Completed").length;
    const cancelled = bookings.filter((item) => item.status === "Cancelled").length;
    const values = [total, completed, upcoming, cancelled];
    return bookingSummaryCards.map((card, index) => ({ ...card, value: String(values[index]) }));
  }, [bookings]);

  const tabs = useMemo(() => {
    const upcoming = bookings.filter((item) => item.status === "Upcoming").length;
    const completed = bookings.filter((item) => item.status === "Completed").length;
    const cancelled = bookings.filter((item) => item.status === "Cancelled").length;
    return [
      `All Bookings (${bookings.length})`,
      `Upcoming (${upcoming})`,
      `Completed (${completed})`,
      `Cancelled (${cancelled})`
    ];
  }, [bookings]);
  const selectedTab = tabs.find((tab) => tab.startsWith(activeTab.split(" (")[0])) || activeTab;

  const confirmDeleteBooking = async () => {
    if (!deleteTarget) return;
    try {
      const saved = await cancelUserBooking(deleteTarget._id || deleteTarget.id || deleteTarget.bookingId, { deleteRequest: true });
      setBookings((current) => current.map((booking) => (
        (booking._id || booking.id) === (deleteTarget._id || deleteTarget.id)
          ? { ...booking, ...saved, status: "Cancelled", bookingStatus: "Cancelled", canDelete: false }
          : booking
      )));
      setDeleteTarget(null);
      showToast("Booking moved to cancelled.");
    } catch (error) {
      showToast(error?.response?.data?.message || "Could not delete booking.");
    }
  };

  return (
    <AccountLayout
      active="bookings"
      breadcrumbCurrent="My Bookings"
      title="My Bookings"
      subtitle="View and manage all your test bookings"
      actions={<HeroIllustration type="bookings" />}
    >
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <UserProfileCard profile={profile} />
        <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
          <h2 className="text-xl font-black text-navy-900">Booking Summary</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.title} {...card} />
            ))}
          </div>
        </section>
      </div>

      <AccountSyncNotice message={error} />

      <section className="rounded-lg border border-blue-100 bg-white p-4 shadow-sm lg:p-5">
        <TabFilterBar
          tabs={tabs}
          activeTab={selectedTab}
          onTabChange={setActiveTab}
          rightControl={
            <button type="button" className="inline-flex h-11 items-center gap-3 rounded-md border border-blue-100 px-4 text-sm font-black text-navy-800 hover:bg-blue-50">
              All Time
              <ChevronDown className="h-4 w-4" />
            </button>
          }
        />
        <div className="mt-5">
          {loading ? (
            <AccountLoadingState />
          ) : filteredBookings.length ? (
            <div className="grid gap-4">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onAction={(item) => showToast(`${item.action} selected for ${item.title}.`)}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          ) : (
            <AccountEmptyState title="No bookings found" text="Try a different tab or book a new test." />
          )}
        </div>
      </section>

      <div className="flex flex-col gap-4 text-sm font-semibold text-navy-700 sm:flex-row sm:items-center sm:justify-between">
        <p>Showing {filteredBookings.length ? `1 to ${filteredBookings.length}` : "0"} of {bookings.length} bookings</p>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-md border border-blue-100 text-navy-800" type="button" aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-black ${
                page === 1 ? "border-upchar-green bg-upchar-green text-white" : "border-blue-100 text-navy-800"
              }`}
              type="button"
              key={page}
            >
              {page}
            </button>
          ))}
          <button className="flex h-10 w-10 items-center justify-center rounded-md border border-blue-100 text-navy-800" type="button" aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <section className="grid gap-5 rounded-lg border border-blue-100 bg-blue-50/50 p-5 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-xl font-black text-navy-900">Need to book a new test?</h2>
          <p className="mt-2 text-sm font-semibold text-navy-700">Choose from our wide range of health packages and tests.</p>
        </div>
        <Link to="/tests" className="inline-flex h-11 items-center justify-center rounded-md bg-upchar-green px-6 text-sm font-black text-white transition hover:bg-upchar-greenDark">
          Book a Test Now
        </Link>
      </section>

      <QuickActions />
      <TrustStrip />
      {deleteTarget ? (
        <ConfirmDeleteModal
          title="Delete Booking"
          message={`Delete ${deleteTarget.bookingId}? This will mark the booking as cancelled and reflect in Admin.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDeleteBooking}
        />
      ) : null}
      <AccountToast message={toast} />
    </AccountLayout>
  );
}

export default AccountBookingsPage;
