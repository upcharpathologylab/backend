import AdminManagementPage from "./AdminManagementPage.jsx";
import { adminManagementConfigs } from "../data/adminManagementData.js";

function AdminCouponsOffersPage() {
  return <AdminManagementPage config={adminManagementConfigs.couponsOffers} />;
}

export default AdminCouponsOffersPage;
