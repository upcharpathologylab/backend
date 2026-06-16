import { adminBookingConfigs } from "../data/adminBookingData.js";
import AdminBookingOperationsPage from "./AdminBookingOperationsPage.jsx";

function AdminBookingsPage() {
  return <AdminBookingOperationsPage config={adminBookingConfigs.bookings} />;
}

export default AdminBookingsPage;
