import AdminManagementPage from "./AdminManagementPage.jsx";
import { adminManagementConfigs } from "../data/adminManagementData.js";

function AdminPricingDiscountsPage() {
  return <AdminManagementPage config={adminManagementConfigs.pricingDiscounts} />;
}

export default AdminPricingDiscountsPage;
