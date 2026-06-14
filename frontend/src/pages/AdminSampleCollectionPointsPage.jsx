import { adminBookingConfigs } from "../data/adminBookingData.js";
import AdminManagementPage from "./AdminManagementPage.jsx";

function AdminSampleCollectionPointsPage() {
  return <AdminManagementPage config={adminBookingConfigs.sampleCollectionPoints} />;
}

export default AdminSampleCollectionPointsPage;
