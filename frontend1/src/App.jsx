import { useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import AboutPage from "./pages/AboutPage.jsx";
import AccountAddressesPage from "./pages/AccountAddressesPage.jsx";
import AccountAppointmentsPage from "./pages/AccountAppointmentsPage.jsx";
import AccountBookingsPage from "./pages/AccountBookingsPage.jsx";
import AccountFamilyMembersPage from "./pages/AccountFamilyMembersPage.jsx";
import AccountHelpSupportPage from "./pages/AccountHelpSupportPage.jsx";
import AccountOffersCouponsPage from "./pages/AccountOffersCouponsPage.jsx";
import AccountReportsPage from "./pages/AccountReportsPage.jsx";
import AccountSavedPackagesPage from "./pages/AccountSavedPackagesPage.jsx";
import AccountSettingsPage from "./pages/AccountSettingsPage.jsx";
import AdminActivityLogsPage from "./pages/AdminActivityLogsPage.jsx";
import AdminBackupManagementPage from "./pages/AdminBackupManagementPage.jsx";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute.jsx";
import AdminContentPagesPage from "./pages/AdminContentPagesPage.jsx";
import AdminAssignSampleCollectorPage from "./pages/AdminAssignSampleCollectorPage.jsx";
import AdminBookingsPage from "./pages/AdminBookingsPage.jsx";
import AdminBookingStatusPage from "./pages/AdminBookingStatusPage.jsx";
import AdminBlogsPage from "./pages/AdminBlogsPage.jsx";
import AdminCouponsOffersPage from "./pages/AdminCouponsOffersPage.jsx";
import AdminCustomersPage from "./pages/AdminCustomersPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminHomeContentPage from "./pages/AdminHomeContentPage.jsx";
import AdminHomepageBannersPage from "./pages/AdminHomepageBannersPage.jsx";
import AdminInvoicesPage from "./pages/AdminInvoicesPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminManageTestsPage from "./pages/AdminManageTestsPage.jsx";
import AdminPackageTestsPage from "./pages/AdminPackageTestsPage.jsx";
import AdminPackagesPage from "./pages/AdminPackagesPage.jsx";
import AdminPaymentsPage from "./pages/AdminPaymentsPage.jsx";
import AdminPricingDiscountsPage from "./pages/AdminPricingDiscountsPage.jsx";
import AdminPrescriptionsPage from "./pages/AdminPrescriptionsPage.jsx";
import AdminSampleCollectionPointsPage from "./pages/AdminSampleCollectionPointsPage.jsx";
import AdminSecurityAccessPage from "./pages/AdminSecurityAccessPage.jsx";
import AdminServiceLocationsPage from "./pages/AdminServiceLocationsPage.jsx";
import AdminSystemSettingsPage from "./pages/AdminSystemSettingsPage.jsx";
import AdminTestCategoriesPage from "./pages/AdminTestCategoriesPage.jsx";
import AdminTestimonialsPage from "./pages/AdminTestimonialsPage.jsx";
import AdminUsersRolesPage from "./pages/AdminUsersRolesPage.jsx";
import BlogDetailPage from "./pages/BlogDetailPage.jsx";
import BlogListPage from "./pages/BlogListPage.jsx";
import BookingConfirmationPage from "./pages/BookingConfirmationPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MyAccountPage from "./pages/MyAccountPage.jsx";
import PackagesPage from "./pages/PackagesPage.jsx";
import PaymentFailedPage from "./pages/PaymentFailedPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import PolicyPage from "./pages/PolicyPage.jsx";
import TestsPage from "./pages/TestsPage.jsx";

const adminRoute = (element) => <AdminProtectedRoute>{element}</AdminProtectedRoute>;

function ScrollToTop() {
  const { pathname } = useLocation();
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    document.title = "Upchar Pathology | Book Lab Tests Online";
    const meta = document.querySelector("meta[name='description']");
    if (meta) {
      meta.setAttribute(
        "content",
        "Book lab tests online with Upchar Pathology through NABL accredited partner labs, home sample collection, affordable packages, and fast reports."
      );
    }
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={adminRoute(<AdminDashboardPage />)} />
        <Route path="/admin/activity-logs" element={adminRoute(<AdminActivityLogsPage />)} />
        <Route path="/admin/assign-sample-collector" element={adminRoute(<AdminAssignSampleCollectorPage />)} />
        <Route path="/admin/backup-management" element={adminRoute(<AdminBackupManagementPage />)} />
        <Route path="/admin/bookings" element={adminRoute(<AdminBookingsPage />)} />
        <Route path="/admin/booking-status" element={adminRoute(<AdminBookingStatusPage />)} />
        <Route path="/admin/blogs" element={adminRoute(<AdminBlogsPage />)} />
        <Route path="/admin/content-pages" element={adminRoute(<AdminContentPagesPage />)} />
        <Route path="/admin/content-pages/:pageSlug" element={adminRoute(<AdminHomeContentPage />)} />
        <Route path="/admin/coupons-offers" element={adminRoute(<AdminCouponsOffersPage />)} />
        <Route path="/admin/customers" element={adminRoute(<AdminCustomersPage />)} />
        <Route path="/admin/homepage-banners" element={adminRoute(<AdminHomepageBannersPage />)} />
        <Route path="/admin/invoices" element={adminRoute(<AdminInvoicesPage />)} />
        <Route path="/admin/package-tests" element={adminRoute(<AdminPackageTestsPage />)} />
        <Route path="/admin/packages" element={adminRoute(<AdminPackagesPage />)} />
        <Route path="/admin/payments" element={adminRoute(<AdminPaymentsPage />)} />
        <Route path="/admin/pricing-discounts" element={adminRoute(<AdminPricingDiscountsPage />)} />
        <Route path="/admin/prescriptions" element={adminRoute(<AdminPrescriptionsPage />)} />
        <Route path="/admin/sample-collection-points" element={adminRoute(<AdminSampleCollectionPointsPage />)} />
        <Route path="/admin/security-access" element={adminRoute(<AdminSecurityAccessPage />)} />
        <Route path="/admin/service-locations" element={adminRoute(<AdminServiceLocationsPage />)} />
        <Route path="/admin/system-settings" element={adminRoute(<AdminSystemSettingsPage />)} />
        <Route path="/admin/test-categories" element={adminRoute(<AdminTestCategoriesPage />)} />
        <Route path="/admin/testimonials" element={adminRoute(<AdminTestimonialsPage />)} />
        <Route path="/admin/tests" element={adminRoute(<AdminManageTestsPage />)} />
        <Route path="/admin/users-roles" element={adminRoute(<AdminUsersRolesPage />)} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/my-account/addresses" element={<AccountAddressesPage />} />
        <Route path="/my-account/appointments" element={<Navigate to="/my-account?section=appointments" replace />} />
        <Route path="/my-account/bookings" element={<AccountBookingsPage />} />
        <Route path="/my-account/family-members" element={<AccountFamilyMembersPage />} />
        <Route path="/my-account/help-support" element={<AccountHelpSupportPage />} />
        <Route path="/my-account/offers-coupons" element={<AccountOffersCouponsPage />} />
        <Route path="/my-account/reports" element={<AccountReportsPage />} />
        <Route path="/my-account/saved-packages" element={<Navigate to="/my-account?section=saved-packages" replace />} />
        <Route path="/my-account/account-settings" element={<AccountSettingsPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-failed" element={<PaymentFailedPage />} />
        <Route path="/terms-conditions" element={<PolicyPage />} />
        <Route path="/privacy-policy" element={<PolicyPage />} />
        <Route path="/refund-policy" element={<PolicyPage />} />
        <Route path="/tests" element={<TestsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
