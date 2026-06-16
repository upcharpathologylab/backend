import { adminRecordsConfigs } from "../data/adminRecordsData.js";
import AdminRecordsPage from "./AdminRecordsPage.jsx";

function AdminInvoicesPage() {
  return <AdminRecordsPage config={adminRecordsConfigs.invoices} />;
}

export default AdminInvoicesPage;
