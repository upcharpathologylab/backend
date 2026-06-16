import AdminManagementPage from "./AdminManagementPage.jsx";
import { adminManagementConfigs } from "../data/adminManagementData.js";

function AdminPackagesPage() {
  return <AdminManagementPage config={adminManagementConfigs.packages} />;
}

export default AdminPackagesPage;
