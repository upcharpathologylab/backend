import { adminRecordsConfigs } from "../data/adminRecordsData.js";
import AdminRecordsPage from "./AdminRecordsPage.jsx";

function AdminTestimonialsPage() {
  return <AdminRecordsPage config={adminRecordsConfigs.testimonials} />;
}

export default AdminTestimonialsPage;
