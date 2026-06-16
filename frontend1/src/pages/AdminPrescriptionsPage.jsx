import { adminRecordsConfigs } from "../data/adminRecordsData.js";
import AdminRecordsPage from "./AdminRecordsPage.jsx";

function AdminPrescriptionsPage() {
  return <AdminRecordsPage config={adminRecordsConfigs.prescriptions} />;
}

export default AdminPrescriptionsPage;
