import { adminRecordsConfigs } from "../data/adminRecordsData.js";
import AdminRecordsPage from "./AdminRecordsPage.jsx";

function AdminActivityLogsPage() {
  return <AdminRecordsPage config={adminRecordsConfigs.activityLogs} />;
}

export default AdminActivityLogsPage;
