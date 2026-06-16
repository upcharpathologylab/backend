import { adminRecordsConfigs } from "../data/adminRecordsData.js";
import AdminRecordsPage from "./AdminRecordsPage.jsx";

function AdminServiceLocationsPage() {
  return <AdminRecordsPage config={adminRecordsConfigs.serviceLocations} />;
}

export default AdminServiceLocationsPage;
