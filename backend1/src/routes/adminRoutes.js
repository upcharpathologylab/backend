import express from "express";
import {
  createBlog,
  createAdminRole,
  createAdminUser,
  createCoupon,
  createHomepageBanner,
  createPackage,
  createReview,
  createServiceLocation,
  createTest,
  createTestCategory,
  deleteBlog,
  deleteAdminBookingPermanent,
  deleteAdminBookingReport,
  deleteAdminPrescription,
  deleteAdminRole,
  deleteAdminUser,
  deleteCoupon,
  deleteHomepageBanner,
  deletePackage,
  deleteReview,
  deleteServiceLocation,
  deleteTest,
  deleteTestCategory,
  getDashboardSummary,
  getUserRoleManagement,
  listAdminNotifications,
  listAdminBookings,
  listAdminPrescriptions,
  listBlogs,
  listCoupons,
  listHomepageBanners,
  listPackages,
  listReviews,
  listServiceLocations,
  listTestCategories,
  listTests,
  importGoogleReviews,
  markAdminNotificationRead,
  updateBlog,
  resetAdminUserPassword,
  updateAdminRole,
  updateAdminUser,
  updateAdminBookingStatus,
  uploadAdminBookingReport,
  updateAdminPrescription,
  updateCoupon,
  updateHomepageBanner,
  updateHomeHero,
  updatePackage,
  updateReview,
  updateServiceLocation,
  updateSiteSettings,
  updateTest,
  updateTestCategory
} from "../controllers/adminController.js";
import { enforceAdminPermission, protect } from "../middleware/auth.js";
import { reportUpload } from "../middleware/upload.js";

const router = express.Router();

router.use(protect);
router.use(enforceAdminPermission);

router.get("/dashboard/summary", getDashboardSummary);
router.get("/dashboard", getDashboardSummary);
router.get("/notifications", listAdminNotifications);
router.patch("/notifications/:eventKey/read", markAdminNotificationRead);

router.get("/users-roles", getUserRoleManagement);
router.post("/users", createAdminUser);
router.put("/users/:id", updateAdminUser);
router.delete("/users/:id", deleteAdminUser);
router.patch("/users/:id/reset-password", resetAdminUserPassword);
router.post("/roles", createAdminRole);
router.put("/roles/:id", updateAdminRole);
router.delete("/roles/:id", deleteAdminRole);

router.get("/bookings", listAdminBookings);
router.put("/bookings/:id/status", updateAdminBookingStatus);
router.post("/bookings/:id/report", reportUpload.single("reportFile"), uploadAdminBookingReport);
router.delete("/bookings/:id/report", deleteAdminBookingReport);
router.delete("/bookings/:id", deleteAdminBookingPermanent);

router.get("/prescriptions", listAdminPrescriptions);
router.put("/prescriptions/:id", updateAdminPrescription);
router.delete("/prescriptions/:id", deleteAdminPrescription);

router.get("/packages", listPackages);
router.post("/packages", createPackage);
router.put("/packages/:id", updatePackage);
router.delete("/packages/:id", deletePackage);

router.get("/tests", listTests);
router.post("/tests", createTest);
router.put("/tests/:id", updateTest);
router.delete("/tests/:id", deleteTest);

router.get("/test-categories", listTestCategories);
router.post("/test-categories", createTestCategory);
router.put("/test-categories/:id", updateTestCategory);
router.delete("/test-categories/:id", deleteTestCategory);

router.get("/coupons", listCoupons);
router.post("/coupons", createCoupon);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

router.get("/homepage-banners", listHomepageBanners);
router.post("/homepage-banners", createHomepageBanner);
router.put("/homepage-banners/:id", updateHomepageBanner);
router.delete("/homepage-banners/:id", deleteHomepageBanner);

router.get("/blogs", listBlogs);
router.post("/blogs", createBlog);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

router.get("/reviews", listReviews);
router.post("/reviews", createReview);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

router.get("/testimonials", listReviews);
router.post("/testimonials/import-google", importGoogleReviews);
router.post("/testimonials", createReview);
router.put("/testimonials/:id", updateReview);
router.delete("/testimonials/:id", deleteReview);

router.get("/service-locations", listServiceLocations);
router.post("/service-locations", createServiceLocation);
router.put("/service-locations/:id", updateServiceLocation);
router.delete("/service-locations/:id", deleteServiceLocation);

router.put("/home-hero", updateHomeHero);
router.put("/site-settings", updateSiteSettings);

export default router;
