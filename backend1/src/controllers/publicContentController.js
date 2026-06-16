import mongoose from "mongoose";
import Coupon from "../models/Coupon.js";
import HomepageBanner from "../models/HomepageBanner.js";
import Review from "../models/Review.js";
import ServiceLocation from "../models/ServiceLocation.js";
import TestCategory from "../models/TestCategory.js";
import { defaultHomeData } from "../data/defaultHomeData.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ensureTestSeedData } from "../utils/testSeed.js";
import { ensureServiceLocationSeedData } from "../utils/serviceLocationSeed.js";
import { couponDiscountAmount, couponPublicShape, couponRuntimeStatus, isCouponUsable } from "../utils/couponUtils.js";

const dbReady = () => mongoose.connection.readyState === 1;

const publicId = (item) => ({ ...item, id: String(item._id || item.id) });

const splitOfferText = (value = "") => {
  const [text, highlight] = String(value).split(" on ");
  return {
    offerText: text || value,
    offerHighlightText: highlight || ""
  };
};

const ensureDefaultHomepageBanner = async () => {
  const count = await HomepageBanner.countDocuments({});
  if (count) return;

  const hero = defaultHomeData.hero;
  const offer = splitOfferText(hero.offerText);
  await HomepageBanner.create({
    bannerTitle: `${hero.title} ${hero.highlightText}`.trim(),
    bannerDescription: hero.subtitle,
    bannerImage: hero.image,
    headingLine1: hero.title,
    headingHighlightText: hero.highlightText,
    description: hero.subtitle,
    feature1: hero.trustPoints?.[0]?.label || "Accurate Reports",
    feature2: hero.trustPoints?.[1]?.label || "Affordable Prices",
    feature3: hero.trustPoints?.[2]?.label || "Home Sample Collection",
    feature4: hero.trustPoints?.[3]?.label || "Fast Report Delivery",
    primaryButtonText: hero.buttons?.[0]?.label || "Book Test Now",
    primaryButtonUrl: hero.buttons?.[0]?.href || "#booking",
    secondaryButtonText: hero.buttons?.[1]?.label || "View Packages",
    secondaryButtonUrl: hero.buttons?.[1]?.href || "#packages",
    offerText: offer.offerText,
    offerHighlightText: offer.offerHighlightText,
    position: "Top Slider",
    linkUrl: hero.buttons?.[0]?.href || "#booking",
    buttonText: hero.buttons?.[0]?.label || "Book Test Now",
    sortOrder: 1,
    addedOn: "Default homepage banner",
    addedBy: "System",
    status: "Active",
    isActive: true
  });
};

export const getTestCategories = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json({ success: true, data: [], source: "demo" });
  await ensureTestSeedData();
  const categories = await TestCategory.find({ isActive: true }).sort({ categoryName: 1 }).lean();
  return res.json({ success: true, data: categories.map(publicId), source: "database" });
});

export const getCoupons = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json({ success: true, data: [], source: "demo" });
  const coupons = await Coupon.find({ isActive: true }).sort({ sortOrder: 1, updatedAt: -1 }).lean();
  const activeCoupons = coupons
    .filter((coupon) => couponRuntimeStatus(coupon) === "Active")
    .map((coupon) => couponPublicShape(publicId(coupon)));
  return res.json({ success: true, data: activeCoupons, source: "database" });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const code = String(req.body.couponCode || req.body.code || "").trim().toUpperCase();
  const subtotal = Number(req.body.subtotal || req.body.amount || 0);
  const items = Array.isArray(req.body.items) ? req.body.items : [];

  if (!code || !subtotal) {
    return res.status(400).json({ success: false, message: "Coupon code and subtotal are required." });
  }

  if (!dbReady()) return res.status(503).json({ success: false, message: "Coupon validation is unavailable." });

  const coupon = await Coupon.findOne({ couponCode: code }).lean();
  if (!coupon || !isCouponUsable(coupon, subtotal)) {
    return res.status(404).json({ success: false, message: "Invalid or expired coupon code." });
  }

  if (subtotal < Number(coupon.minOrder || 0)) {
    return res.status(400).json({ success: false, message: `Minimum order amount is Rs. ${coupon.minOrder}.` });
  }

  if (Array.isArray(coupon.applicableItems) && coupon.applicableItems.length && items.length) {
    const allowed = coupon.applicableItems.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
    const hasApplicableItem = items.some((item) => allowed.includes(String(item.name || item.title || item.testName || item.packageName || "").trim().toLowerCase()));
    if (!hasApplicableItem) {
      return res.status(400).json({ success: false, message: "Coupon is not applicable to selected tests or packages." });
    }
  }

  const discountAmount = couponDiscountAmount(coupon, subtotal);
  return res.json({
    success: true,
    data: {
      id: String(coupon._id),
      couponCode: coupon.couponCode,
      couponName: coupon.couponName,
      title: coupon.title || coupon.couponName,
      discountAmount,
      discount: coupon.discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      message: "Coupon applied successfully."
    }
  });
});

export const getHomepageBanners = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json({ success: true, data: [], source: "demo" });
  await ensureDefaultHomepageBanner();
  const banners = await HomepageBanner.find({ status: "Active", isActive: true }).sort({ sortOrder: 1, updatedAt: -1 }).lean();
  return res.json({ success: true, data: banners.map(publicId), source: "database" });
});

export const getTestimonials = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json({ success: true, data: [], source: "demo" });
  const publicQuery = {
    $and: [
      { $or: [{ isActive: true }, { isActive: { $exists: false } }] },
      { $or: [{ status: "Published" }, { status: "" }, { status: { $exists: false } }] },
      { $or: [{ displayedOn: "Homepage" }, { displayedOn: "" }, { displayedOn: null }, { displayedOn: { $exists: false } }] }
    ]
  };
  let reviews = await Review.find({ ...publicQuery, $or: [{ featured: true }, { isFeatured: true }] }).sort({ reviewDate: -1, updatedAt: -1 }).limit(12).lean();
  if (!reviews.length) {
    reviews = await Review.find(publicQuery).sort({ reviewDate: -1, updatedAt: -1 }).limit(12).lean();
  }
  const data = reviews.filter((item) => item.comment || item.content || item.testimonialContent).map((item) => ({
    ...publicId(item),
    name: item.name || item.customerName,
    customerName: item.customerName || item.name,
    comment: item.comment || item.content || item.testimonialContent,
    content: item.content || item.comment || item.testimonialContent,
    image: item.image || item.customerPhoto,
    customerPhoto: item.customerPhoto || item.image
  }));
  return res.json({ success: true, data, source: "database" });
});

export const getFeaturedServiceLocation = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.status(503).json({ success: false, message: "Service locations are unavailable." });
  await ensureServiceLocationSeedData();
  const location = await ServiceLocation.findOne({ isActive: true, isFeatured: true }).sort({ sortOrder: 1, updatedAt: -1 }).lean()
    || await ServiceLocation.findOne({ isActive: true }).sort({ sortOrder: 1, updatedAt: -1 }).lean();
  return res.json({ success: true, data: location ? publicId(location) : null, source: "database" });
});

export const getActiveServiceLocations = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.status(503).json({ success: false, message: "Service locations are unavailable." });
  await ensureServiceLocationSeedData();
  const locations = await ServiceLocation.find({ isActive: true }).sort({ sortOrder: 1, updatedAt: -1 }).lean();
  return res.json({ success: true, data: locations.map(publicId), source: "database" });
});
