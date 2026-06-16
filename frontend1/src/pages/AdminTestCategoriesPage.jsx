import AdminManagementPage from "./AdminManagementPage.jsx";
import { adminManagementConfigs } from "../data/adminManagementData.js";

function AdminTestCategoriesPage() {
  return <AdminManagementPage config={adminManagementConfigs.testCategories} />;
}

export default AdminTestCategoriesPage;
