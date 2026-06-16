import AdminManagementPage from "./AdminManagementPage.jsx";
import { adminManagementConfigs } from "../data/adminManagementData.js";

function AdminPackageTestsPage() {
  return <AdminManagementPage config={adminManagementConfigs.packageTests} />;
}

export default AdminPackageTestsPage;
