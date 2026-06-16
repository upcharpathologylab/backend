import express from "express";
import {
  applyCoupon,
  cancelAppointment,
  cancelBooking,
  changePassword,
  createAddress,
  createFamilyMember,
  createSupportTicket,
  deleteAddress,
  deleteFamilyMember,
  deleteSavedPackage,
  downloadReport,
  emailReports,
  getAddresses,
  getAppointment,
  getAppointments,
  getBooking,
  getBookings,
  getCoupons,
  getFaqs,
  getFamilyMembers,
  getOffers,
  getProfile,
  getProfileSummary,
  getReport,
  getReports,
  getSavedPackages,
  getSupportTickets,
  makePrimaryAddress,
  rescheduleAppointment,
  rescheduleBooking,
  savePackage,
  updateAddress,
  updateFamilyMember,
  updatePreferences,
  updateProfile,
  updateProfileImage,
  updateSecuritySettings,
  uploadPrescription
} from "../controllers/userController.js";
import { protectUser } from "../middleware/auth.js";
import { prescriptionUpload, profileImageUpload } from "../middleware/upload.js";

const router = express.Router();

router.use(protectUser);

router.route("/addresses").get(getAddresses).post(createAddress);
router.route("/addresses/:id").put(updateAddress).delete(deleteAddress);
router.patch("/addresses/:id/primary", makePrimaryAddress);

router.route("/family-members").get(getFamilyMembers).post(createFamilyMember);
router.route("/family-members/:id").put(updateFamilyMember).delete(deleteFamilyMember);

router.route("/bookings").get(getBookings);
router.route("/bookings/:id").get(getBooking);
router.patch("/bookings/:id/cancel", cancelBooking);
router.patch("/bookings/:id/reschedule", rescheduleBooking);

router.route("/reports").get(getReports);
router.post("/reports/email", emailReports);
router.get("/reports/:id/download", downloadReport);
router.route("/reports/:id").get(getReport);

router.route("/appointments").get(getAppointments);
router.route("/appointments/:id").get(getAppointment);
router.patch("/appointments/:id/reschedule", rescheduleAppointment);
router.patch("/appointments/:id/cancel", cancelAppointment);

router.route("/saved-packages").get(getSavedPackages).post(savePackage);
router.delete("/saved-packages/:id", deleteSavedPackage);

router.get("/offers", getOffers);
router.get("/coupons", getCoupons);
router.post("/coupons/apply", applyCoupon);

router.get("/profile-summary", getProfileSummary);
router.route("/profile").get(getProfile).put(updateProfile);
router.post("/profile/image", profileImageUpload.single("profileImage"), updateProfileImage);
router.post("/prescriptions", prescriptionUpload.single("prescriptionFile"), uploadPrescription);
router.patch("/change-password", changePassword);
router.patch("/preferences", updatePreferences);
router.patch("/security-settings", updateSecuritySettings);

router.route("/support/tickets").get(getSupportTickets).post(createSupportTicket);
router.get("/faqs", getFaqs);

export default router;
