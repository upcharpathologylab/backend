import axios from "axios";
import { ADMIN_AUTH_TOKEN_KEY, AUTH_TOKEN_KEY } from "../components/auth/authStorage.js";

const configuredApiUrl = import.meta.env.VITE_API_URL;
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const browserOrigin = typeof window !== "undefined" ? window.location.origin : "";
const productionApiOrigin = "https://api.upcharpathologylab.com";
const isLocalOrigin = /^(https?:\/\/)?(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(browserOrigin);
const defaultApiOrigin = import.meta.env.PROD && !isLocalOrigin ? productionApiOrigin : browserOrigin;
const normalizeOrigin = (value) => String(value || "").trim().replace(/\/api\/?$/, "").replace(/\/$/, "");
const API_ASSET_ORIGIN = normalizeOrigin(configuredBaseUrl || configuredApiUrl || defaultApiOrigin);
const API_BASE_URL = configuredApiUrl
  ? `${normalizeOrigin(configuredApiUrl)}/api`
  : `${API_ASSET_ORIGIN}/api`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000
});

export function assetUrl(value) {
  if (!value || typeof value !== "string") return value;
  const normalized = value.trim().replace(/^["']|["']$/g, "");
  if (!normalized || /^[a-z]:\\/i.test(normalized) || normalized.includes("\\")) return "";
  if (/^(https?:)?\/\//i.test(normalized) || normalized.startsWith("data:")) return normalized;
  if (normalized.startsWith("/api/uploads/")) return `${API_ASSET_ORIGIN}${normalized.replace(/^\/api/, "")}`;
  if (normalized.startsWith("api/uploads/")) return `${API_ASSET_ORIGIN}/${normalized.replace(/^api\//, "")}`;
  if (normalized.startsWith("/uploads/")) return `${API_ASSET_ORIGIN}${normalized}`;
  if (normalized.startsWith("uploads/")) return `${API_ASSET_ORIGIN}/${normalized}`;
  if (!normalized.startsWith("/") && !/\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(normalized)) return "";
  return normalized;
}

export const getImageUrl = assetUrl;

const getAuthConfig = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    : {};
};

const getAdminAuthConfig = () => {
  const token = localStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    : {};
};

export async function getHomeData() {
  const response = await api.get("/home");
  return response.data?.data || response.data;
}

export async function getPackages() {
  const response = await api.get("/packages");
  return response.data?.data || response.data;
}

export async function getTests(params = undefined) {
  const response = await api.get("/tests", params ? { params } : undefined);
  if (params) return response.data;
  return response.data?.data || response.data;
}

export async function getTestCategories() {
  const response = await api.get("/test-categories");
  return response.data?.data || response.data;
}

export async function getCoupons() {
  const response = await api.get("/coupons");
  return response.data?.data || response.data;
}

export async function applyCoupon(values) {
  const response = await api.post("/coupons/apply", values);
  return response.data?.data || response.data;
}

export async function getHomepageBanners() {
  const response = await api.get("/homepage-banners");
  return response.data?.data || response.data;
}

export async function getBlogs() {
  const response = await api.get("/blogs");
  return response.data?.data || response.data;
}

export async function getFeaturedBlogs() {
  const response = await api.get("/blogs/featured");
  return response.data?.data || response.data;
}

export async function getBlogBySlug(slug) {
  const response = await api.get(`/blogs/${slug}`);
  return response.data?.data || response.data;
}

export async function getTestimonials() {
  const response = await api.get("/testimonials");
  return response.data?.data || response.data;
}

export async function getFeaturedServiceLocation() {
  const response = await api.get("/service-locations/featured");
  return response.data?.data || response.data;
}

export async function getActiveServiceLocations() {
  const response = await api.get("/service-locations/active");
  return response.data?.data || response.data;
}

export async function getPackageById(id) {
  const response = await api.get(`/packages/${id}`);
  return response.data?.data || response.data;
}

export async function getTestById(id) {
  const response = await api.get(`/tests/${id}`);
  return response.data?.data || response.data;
}

export async function createBookingLead(values) {
  const payload = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      payload.append(key, value);
    }
  });

  const authConfig = getAuthConfig();
  const response = await api.post("/booking-leads", payload, {
    ...authConfig,
    headers: {
      ...authConfig.headers,
      "Content-Type": "multipart/form-data"
    }
  });

  return response.data;
}

export async function getBookingLead(id) {
  const response = await api.get(`/booking-leads/${id}`, getAuthConfig());
  return response.data?.data || response.data;
}

export async function createContactMessage(values) {
  const response = await api.post("/contact", {
    fullName: values.fullName,
    email: values.email,
    phone: values.phone,
    subject: values.subject,
    message: values.message
  });

  return response.data;
}

export async function createRazorpayOrder(values) {
  const response = await api.post("/payments/razorpay/create-order", values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function verifyRazorpayPayment(values) {
  const response = await api.post("/payments/razorpay/verify", values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function getContentPages() {
  const response = await api.get("/content/pages");
  return response.data?.data || response.data;
}

export async function getPageContent(pageSlug) {
  const response = await api.get(`/content/pages/${pageSlug}`);
  return response.data?.data || response.data;
}

export async function savePageContent(pageSlug, sections) {
  const response = await api.put(`/content/pages/${pageSlug}`, { sections }, getAuthConfig());
  return response.data?.data || response.data;
}

export async function uploadContentImage(file) {
  const payload = new FormData();
  payload.append("image", file);

  const authConfig = getAuthConfig();
  try {
    const response = await api.post("/content/images", payload, {
      ...authConfig
    });

    const data = response.data?.data || response.data;
    if (data?.imageUrl) return data;
    if (response.data?.imageUrl) return response.data;

    throw new Error(response.data?.message || "Image upload failed.");
  } catch (error) {
    throw error;
  }
}

export async function getAdminResource(resource) {
  const response = await api.get(`/admin/${resource}`, getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function createAdminResource(resource, values) {
  const response = await api.post(`/admin/${resource}`, values, getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function updateAdminResource(resource, id, values) {
  const response = await api.put(`/admin/${resource}/${id}`, values, getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function deleteAdminResource(resource, id) {
  const response = await api.delete(`/admin/${resource}/${id}`, getAdminAuthConfig());
  return response.data;
}

export async function updateAdminBookingStatus(id, bookingStatus) {
  const response = await api.put(`/admin/bookings/${id}/status`, { bookingStatus }, getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function uploadAdminBookingReport(id, file) {
  const payload = new FormData();
  payload.append("reportFile", file);
  const response = await api.post(`/admin/bookings/${id}/report`, payload, getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function deleteAdminBookingReport(id) {
  const response = await api.delete(`/admin/bookings/${id}/report`, getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function deleteAdminBookingPermanent(id) {
  const response = await api.delete(`/admin/bookings/${id}`, getAdminAuthConfig());
  return response.data;
}

export async function getAdminUserRoleManagement() {
  const response = await api.get("/admin/users-roles", getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function createAdminUser(values) {
  const response = await api.post("/admin/users", values, getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function updateAdminUser(id, values) {
  const response = await api.put(`/admin/users/${id}`, values, getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function deleteAdminUser(id) {
  const response = await api.delete(`/admin/users/${id}`, getAdminAuthConfig());
  return response.data;
}

export async function resetAdminUserPassword(id, values) {
  const response = await api.patch(`/admin/users/${id}/reset-password`, values, getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function createAdminRole(values) {
  const response = await api.post("/admin/roles", values, getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function updateAdminRole(id, values) {
  const response = await api.put(`/admin/roles/${id}`, values, getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function deleteAdminRole(id) {
  const response = await api.delete(`/admin/roles/${id}`, getAdminAuthConfig());
  return response.data;
}

export async function importGoogleReviews(googlePlaceId) {
  const response = await api.post("/admin/testimonials/import-google", { googlePlaceId }, getAdminAuthConfig());
  return response.data;
}

export async function loginUser(values) {
  const response = await api.post("/auth/login", {
    identifier: values.identifier,
    password: values.password
  });

  return response.data?.data || response.data;
}

export async function loginAdmin(values) {
  const response = await api.post("/auth/admin/login", {
    username: values.username,
    password: values.password
  });

  return response.data?.data || response.data;
}

export async function registerUser(values) {
  const response = await api.post("/auth/register", {
    fullName: values.fullName,
    phone: values.phone,
    email: values.email,
    password: values.password,
    role: "customer"
  });

  return response.data?.data || response.data;
}

export async function getUserAddresses() {
  const response = await api.get("/user/addresses", getAuthConfig());
  return response.data?.data || [];
}

export async function createUserAddress(values) {
  const response = await api.post("/user/addresses", values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function updateUserAddress(id, values) {
  const response = await api.put(`/user/addresses/${id}`, values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function deleteUserAddress(id) {
  const response = await api.delete(`/user/addresses/${id}`, getAuthConfig());
  return response.data;
}

export async function makeUserAddressPrimary(id) {
  const response = await api.patch(`/user/addresses/${id}/primary`, {}, getAuthConfig());
  return response.data?.data || response.data;
}

export async function getUserFamilyMembers() {
  const response = await api.get("/user/family-members", getAuthConfig());
  return response.data?.data || [];
}

export async function createUserFamilyMember(values) {
  const response = await api.post("/user/family-members", values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function updateUserFamilyMember(id, values) {
  const response = await api.put(`/user/family-members/${id}`, values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function deleteUserFamilyMember(id) {
  const response = await api.delete(`/user/family-members/${id}`, getAuthConfig());
  return response.data;
}

export async function getUserBookings() {
  const response = await api.get("/user/bookings", getAuthConfig());
  return response.data?.data || [];
}

export async function getUserBooking(id) {
  const response = await api.get(`/user/bookings/${id}`, getAuthConfig());
  return response.data?.data || response.data;
}

export async function cancelUserBooking(id, values = {}) {
  const response = await api.patch(`/user/bookings/${id}/cancel`, values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function rescheduleUserBooking(id, values) {
  const response = await api.patch(`/user/bookings/${id}/reschedule`, values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function getUserReports() {
  const response = await api.get("/user/reports", getAuthConfig());
  return response.data?.data || [];
}

export async function getUserReport(id) {
  const response = await api.get(`/user/reports/${id}`, getAuthConfig());
  return response.data?.data || response.data;
}

export async function downloadUserReport(id) {
  const response = await api.get(`/user/reports/${id}/download`, getAuthConfig());
  return response.data?.data || response.data;
}

export async function emailUserReports(values = {}) {
  const response = await api.post("/user/reports/email", values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function getUserAppointments() {
  const response = await api.get("/user/appointments", getAuthConfig());
  return response.data?.data || [];
}

export async function getUserAppointment(id) {
  const response = await api.get(`/user/appointments/${id}`, getAuthConfig());
  return response.data?.data || response.data;
}

export async function cancelUserAppointment(id) {
  const response = await api.patch(`/user/appointments/${id}/cancel`, {}, getAuthConfig());
  return response.data?.data || response.data;
}

export async function rescheduleUserAppointment(id, values) {
  const response = await api.patch(`/user/appointments/${id}/reschedule`, values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function getUserSavedPackages() {
  const response = await api.get("/user/saved-packages", getAuthConfig());
  return response.data?.data || [];
}

export async function saveUserPackage(values) {
  const response = await api.post("/user/saved-packages", values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function deleteUserSavedPackage(id) {
  const response = await api.delete(`/user/saved-packages/${id}`, getAuthConfig());
  return response.data;
}

export async function getUserOffers() {
  const response = await api.get("/user/offers", getAuthConfig());
  return response.data?.data || [];
}

export async function getUserCoupons() {
  const response = await api.get("/user/coupons", getAuthConfig());
  return response.data?.data || [];
}

export async function applyUserCoupon(values) {
  const response = await api.post("/user/coupons/apply", values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function getUserProfile() {
  const response = await api.get("/user/profile", getAuthConfig());
  return response.data?.data || response.data;
}

export async function getUserProfileSummary() {
  const response = await api.get("/user/profile-summary", getAuthConfig());
  return response.data?.data || response.data;
}

export async function updateUserProfile(values) {
  const response = await api.put("/user/profile", values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function updateUserProfileImage(file, onUploadProgress) {
  const payload = new FormData();
  payload.append("profileImage", file);
  const response = await api.post("/user/profile/image", payload, {
    ...getAuthConfig(),
    onUploadProgress
  });
  return response.data?.data || response.data;
}

export async function uploadUserPrescription(file) {
  const payload = new FormData();
  payload.append("prescriptionFile", file);
  payload.append("testsPackages", "Prescription Upload");
  const response = await api.post("/user/prescriptions", payload, {
    ...getAuthConfig(),
    headers: {
      ...getAuthConfig().headers,
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data?.data || response.data;
}

export async function changeUserPassword(values) {
  const response = await api.patch("/user/change-password", values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function updateUserPreferences(values) {
  const response = await api.patch("/user/preferences", values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function updateUserSecuritySettings(values) {
  const response = await api.patch("/user/security-settings", values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function getUserSupportTickets() {
  const response = await api.get("/user/support/tickets", getAuthConfig());
  return response.data?.data || [];
}

export async function createUserSupportTicket(values) {
  const response = await api.post("/user/support/tickets", values, getAuthConfig());
  return response.data?.data || response.data;
}

export async function getUserFaqs() {
  const response = await api.get("/user/faqs", getAuthConfig());
  return response.data?.data || [];
}

export async function getAdminDashboard(params = undefined) {
  const response = await api.get("/admin/dashboard/summary", {
    ...getAdminAuthConfig(),
    params
  });
  return response.data?.data || response.data;
}

export async function getAdminNotifications() {
  const response = await api.get("/admin/notifications", getAdminAuthConfig());
  return response.data?.data || response.data;
}

export async function markAdminNotificationRead(eventKey) {
  const response = await api.patch(`/admin/notifications/${encodeURIComponent(eventKey)}/read`, {}, getAdminAuthConfig());
  return response.data?.data || response.data;
}
