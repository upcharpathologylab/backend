import { adminBookingConfigs } from "../data/adminBookingData.js";
import AdminBookingOperationsPage from "./AdminBookingOperationsPage.jsx";

function AdminAssignSampleCollectorPage() {
  return <AdminBookingOperationsPage config={adminBookingConfigs.assignSampleCollector} />;
}

export default AdminAssignSampleCollectorPage;
