import AdminRecordsPage from "./AdminRecordsPage.jsx";
import { adminRecordsConfigs } from "../data/adminRecordsData.js";

function AdminBlogsPage() {
  return <AdminRecordsPage config={adminRecordsConfigs.blogs} />;
}

export default AdminBlogsPage;
