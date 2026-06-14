import { adminRecordsConfigs } from "../data/adminRecordsData.js";
import AdminRecordsPage from "./AdminRecordsPage.jsx";

function AdminPaymentsPage() {
  return <AdminRecordsPage config={adminRecordsConfigs.payments} />;
}

export default AdminPaymentsPage;
