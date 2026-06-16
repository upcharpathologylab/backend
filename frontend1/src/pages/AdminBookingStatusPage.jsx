import { adminBookingConfigs } from "../data/adminBookingData.js";
import AdminBookingOperationsPage from "./AdminBookingOperationsPage.jsx";

function AdminBookingStatusPage() {
  return <AdminBookingOperationsPage config={adminBookingConfigs.bookingStatus} />;
}

export default AdminBookingStatusPage;
