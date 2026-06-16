import { adminRecordsConfigs } from "../data/adminRecordsData.js";
import AdminRecordsPage from "./AdminRecordsPage.jsx";

function AdminCustomersPage() {
  return <AdminRecordsPage config={adminRecordsConfigs.customers} />;
}

export default AdminCustomersPage;
