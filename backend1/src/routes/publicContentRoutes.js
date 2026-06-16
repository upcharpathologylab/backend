import express from "express";
import {
  applyCoupon,
  getCoupons,
  getHomepageBanners,
  getActiveServiceLocations,
  getFeaturedServiceLocation,
  getTestCategories,
  getTestimonials
} from "../controllers/publicContentController.js";
import { getContentPages, getPageContent } from "../controllers/contentController.js";

const router = express.Router();

router.get("/test-categories", getTestCategories);
router.get("/coupons", getCoupons);
router.post("/coupons/apply", applyCoupon);
router.get("/homepage-banners", getHomepageBanners);
router.get("/testimonials", getTestimonials);
router.get("/service-locations/featured", getFeaturedServiceLocation);
router.get("/service-locations/active", getActiveServiceLocations);
router.get("/content-pages", getContentPages);
router.get("/content-pages/:pageSlug", getPageContent);

export default router;
