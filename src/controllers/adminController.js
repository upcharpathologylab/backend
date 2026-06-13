import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AdminRole from "../models/AdminRole.js";
import BookingLead from "../models/BookingLead.js";
import Blog from "../models/Blog.js";
import ContactMessage from "../models/ContactMessage.js";
import Coupon from "../models/Coupon.js";
import HomepageBanner from "../models/HomepageBanner.js";
import HomeHero from "../models/HomeHero.js";
import Notification from "../models/Notification.js";
import PackageModel from "../models/Package.js";
import Review from "../models/Review.js";
import ServiceLocation from "../models/ServiceLocation.js";
import SiteSetting from "../models/SiteSetting.js";
import TestModel from "../models/Test.js";
import TestCategory from "../models/TestCategory.js";
import User from "../models/User.js";
import { ensurePackageSeedData } from "../utils/packageSeed.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { ensureTestSeedData } from "../utils/testSeed.js";
import { ensureServiceLocationSeedData } from "../utils/serviceLocationSeed.js";
import { couponRuntimeStatus } from "../utils/couponUtils.js";
import { getGoogleReviews } from "../services/googleReviews.js";
import { blogShape, normalizeBlogPayload } from "./blogController.js";
import { defaultHomeData } from "../data/defaultHomeData.js";

const dbReady = () => mongoose.connection.readyState === 1;

function ensureDatabase(res) {
  if (dbReady()) return true;
  res.status(503).json({ success: false, message: "Database is not connected." });
  return false;
}

const superAdminUsernames = String(process.env.SUPER_ADMIN_USERNAMES || "")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

const superAdminEmails = String(process.env.SUPER_ADMIN_EMAILS || "")
  .split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

const normalizePermissionValue = (value) => String(value || "").trim().toLowerCase();

const isSuperAdmin = (admin) => {
  const roleLabel = normalizePermissionValue(admin?.adminRole || admin?.roleName || admin?.accessLevel || admin?.designation);
  if (["super admin", "super-admin", "superadmin"].includes(roleLabel)) return true;

  return (
    admin?.role === "admin" &&
    (superAdminUsernames.includes(normalizePermissionValue(admin?.username)) || superAdminEmails.includes(normalizePermissionValue(admin?.email)))
  );
};

const numeric = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const bookingStatusOptions = new Set([
  "Pending Confirmation",
  "Confirmed",
  "Sample Collection Scheduled",
  "Sample Collected",
  "Testing In Progress",
  "Report Ready",
  "Completed",
  "Cancelled"
]);

const formatAdminDateTime = (value) =>
  value ? new Date(value).toLocaleString("en-IN", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

const notificationDateTime = (value) =>
  value ? new Date(value).toLocaleString("en-IN", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

const formatBookingId = (item) => item.bookingId || `UPCH${String(item._id || "").slice(-9).toUpperCase()}`;

const buildAdminBookingShape = (doc) => {
  const item = toAdminId(doc);
  const bookingId = formatBookingId(item);
  const bookingStatus = item.bookingStatus || "Pending Confirmation";
  const bookingType = item.bookingType || (item.userId ? "User" : "Guest");
  const customerName = item.customerName || item.fullName || "";
  const phoneNumber = item.mobileNumber || item.mobile || item.phoneNumber || "";
  const whatsappText = [
    "Upchar Pathology Lab Booking Update",
    `Booking ID: ${bookingId}`,
    `Customer: ${customerName}`,
    `Current Status: ${bookingStatus}`,
    "Upchar Pathology Lab"
  ].join("\n");

  return {
    ...item,
    bookingId,
    bookingType,
    patientName: customerName,
    phoneNumber,
    bookingDate: formatAdminDateTime(item.createdAt),
    testsPackages: item.selectedTestOrPackage,
    testPackage: item.selectedTestOrPackage,
    amount: numeric(item.totalPayable),
    paymentStatus: item.paymentStatus || "Pending",
    paymentMethod: item.paymentMethod || "Pay Later",
    bookingStatus,
    currentStatus: bookingStatus,
    lastUpdated: formatAdminDateTime(item.updatedAt),
    reportFile: item.reportFile || "",
    reportUploadedAt: formatAdminDateTime(item.reportUploadedAt),
    reportStatus: item.reportFile ? "Available" : "Report Pending",
    whatsappUrl: phoneNumber ? `https://wa.me/91${String(phoneNumber).replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(whatsappText)}` : ""
  };
};

const prescriptionStatusOptions = new Set(["Pending", "Reviewed", "Completed"]);

const normalizePrescriptionStatus = (value) => {
  const status = String(value || "").trim();
  if (prescriptionStatusOptions.has(status)) return status;
  if (["Processed", "Pending Review"].includes(status)) return status === "Processed" ? "Completed" : "Pending";
  if (status === "Report Ready" || status === "Completed") return "Completed";
  return "Pending";
};

const buildAdminPrescriptionShape = (doc) => {
  const item = toAdminId(doc);
  const prescriptionId = item.bookingId || `RXN${String(item._id || "").slice(-9).toUpperCase()}`;
  const patientName = item.customerName || item.fullName || "";
  const phoneNumber = item.mobileNumber || item.mobile || item.phoneNumber || "";
  const status = normalizePrescriptionStatus(item.bookingStatus);
  const whatsappText = [
    "Upchar Pathology Lab Prescription Update",
    `Prescription ID: ${prescriptionId}`,
    `Patient: ${patientName}`,
    `Mobile: ${phoneNumber}`,
    `Current Status: ${status}`,
    "Upchar Pathology Lab"
  ].join("\n");

  return {
    ...item,
    prescriptionId,
    patientName,
    customerName: patientName,
    phoneNumber,
    uploadDate: formatAdminDateTime(item.createdAt),
    testsPackages: item.selectedTestOrPackage || "Prescription Upload",
    status,
    reviewedBy: item.reviewedBy || "-",
    prescriptionFile: item.prescriptionFile || "",
    whatsappUrl: phoneNumber ? `https://wa.me/91${String(phoneNumber).replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(whatsappText)}` : ""
  };
};

const discountText = (type, value) => (type === "Flat" ? `Rs. ${numeric(value)} OFF` : `${numeric(value)}% OFF`);

const toAdminId = (item) => ({ ...item, id: String(item._id || item.id) });

const packagePayload = (body) => {
  const price = numeric(body.price ?? body.originalPrice);
  const finalPrice = numeric(body.finalPrice ?? body.discountedPrice, price);
  const discountPercent = numeric(body.discountPercent);
  const name = body.packageName || body.name || "Untitled Package";
  const testCount = body.testCount || body.testsIncluded || "0 Tests";
  const image = body.packageImage || body.image || "";
  const status = body.status || (body.isActive === false ? "Inactive" : "Active");

  return {
    ...body,
    name,
    packageName: name,
    category: body.category || "Health Checkup",
    testCount,
    testsIncluded: testCount,
    originalPrice: price,
    discountedPrice: finalPrice,
    price,
    finalPrice,
    discountPercent,
    discount: `${discountPercent}% OFF`,
    image,
    packageImage: image,
    badge: body.badge || body.badgeText || "",
    buttonText: body.buttonText || "Book Now",
    buttonUrl: body.buttonUrl || body.buttonLink || "/cart",
    homeCollection: body.homeCollection === undefined ? true : body.homeCollection === true || body.homeCollection === "Yes",
    status,
    isPopular: Boolean(body.isPopular ?? body.badge ?? body.badgeText),
    isActive: status === "Active"
  };
};

const packageAdminShape = (doc) => {
  const item = toAdminId(doc);
  return {
    ...item,
    packageName: item.packageName || item.name,
    testsIncluded: item.testsIncluded || item.testCount,
    price: item.price || item.originalPrice,
    finalPrice: item.finalPrice || item.discountedPrice,
    packageImage: item.packageImage || item.image,
    homeCollection: item.homeCollection ? "Yes" : "No",
    status: item.status || (item.isActive ? "Active" : "Inactive")
  };
};

const testPayload = (body) => {
  const price = numeric(body.price ?? body.originalPrice);
  const finalPrice = numeric(body.finalPrice ?? body.discountedPrice, price);
  const discountPercent = numeric(body.discountPercent);
  const rating = numeric(body.rating, 4.6);
  const popularity = numeric(body.popularity, 0);
  const sortOrder = numeric(body.sortOrder, 0);
  const name = body.testName || body.name || "Untitled Test";
  const description = body.description ?? body.subtitle ?? "";
  const image = body.testImage || body.image || "";
  const color = body.badgeType || body.color || "green";
  const status = body.status || (body.isActive === false ? "Inactive" : "Active");

  return {
    ...body,
    name,
    testName: name,
    category: body.category || "Pathology",
    subtitle: description || body.category || "Pathology test",
    description,
    originalPrice: price,
    discountedPrice: finalPrice,
    price,
    finalPrice,
    discountPercent,
    discount: `${discountPercent}% OFF`,
    image,
    testImage: image,
    icon: body.icon || "TestTube2",
    color,
    badge: body.badge || body.badgeText || "",
    badgeType: color,
    homeCollection: body.homeCollection === undefined ? true : body.homeCollection === true || body.homeCollection === "Yes",
    fastingRequired: body.fastingRequired === true || body.fastingRequired === "Yes",
    rating,
    popularity,
    sortOrder,
    status,
    isActive: status !== "Inactive"
  };
};

const testAdminShape = (doc) => {
  const item = toAdminId(doc);
  return {
    ...item,
    testName: item.testName || item.name,
    price: item.price || item.originalPrice,
    finalPrice: item.finalPrice || item.discountedPrice,
    testImage: item.testImage || item.image,
    homeCollection: item.homeCollection ? "Yes" : "No",
    fastingRequired: item.fastingRequired ? "Yes" : "No",
    status: item.status || (item.isActive ? "Active" : "Inactive")
  };
};

const categoryPayload = (body) => ({
  ...body,
  categoryName: body.categoryName || body.name || "Untitled Category",
  totalTests: numeric(body.totalTests),
  status: body.status || "Active",
  isActive: (body.status || "Active") === "Active"
});

const couponPayload = (body) => {
  const type = body.discountType || body.type || "Percentage";
  const discountValue = numeric(body.discountValue);
  const status = body.status || "Active";
  const applicableItems = Array.isArray(body.applicableItems)
    ? body.applicableItems
    : String(body.applicableItems || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
  return {
    ...body,
    couponCode: String(body.couponCode || "").toUpperCase(),
    couponName: body.couponName || "Untitled Coupon",
    title: body.title || body.couponName || "Untitled Coupon",
    description: body.description || "",
    type: body.type || type,
    discountType: type,
    discountValue,
    discount: body.discount || discountText(type, discountValue),
    minOrder: numeric(body.minOrder),
    maxDiscount: numeric(body.maxDiscount),
    validFrom: body.validFrom || "",
    validTo: body.validTo || "",
    usageLimit: body.usageLimit || "Unlimited",
    used: numeric(body.used),
    applicableOn: body.applicableOn || "All Tests & Packages",
    applicableItems,
    isBestOffer: body.isBestOffer === true || body.isBestOffer === "Yes",
    sortOrder: numeric(body.sortOrder),
    status,
    isActive: status === "Active"
  };
};

const couponAdminShape = (doc) => {
  const item = toAdminId(doc);
  const status = couponRuntimeStatus(item);
  return {
    ...item,
    title: item.title || item.couponName,
    description: item.description || "",
    discount: item.discount || discountText(item.discountType || item.type, item.discountValue),
    applicableItems: Array.isArray(item.applicableItems) ? item.applicableItems.join(", ") : item.applicableItems || "",
    isBestOffer: item.isBestOffer ? "Yes" : "No",
    status
  };
};

const featureLabels = ["Accurate Reports", "Affordable Prices", "Home Sample Collection", "Fast Report Delivery"];

const splitOfferText = (value = "") => {
  const [text, highlight] = String(value).split(" on ");
  return {
    offerText: text || value,
    offerHighlightText: highlight || ""
  };
};

const defaultBannerPayload = () => {
  const hero = defaultHomeData.hero;
  const offer = splitOfferText(hero.offerText);

  return {
    bannerTitle: `${hero.title} ${hero.highlightText}`.trim(),
    bannerDescription: hero.subtitle,
    bannerImage: hero.image,
    headingLine1: hero.title,
    headingHighlightText: hero.highlightText,
    description: hero.subtitle,
    feature1: hero.trustPoints?.[0]?.label || featureLabels[0],
    feature2: hero.trustPoints?.[1]?.label || featureLabels[1],
    feature3: hero.trustPoints?.[2]?.label || featureLabels[2],
    feature4: hero.trustPoints?.[3]?.label || featureLabels[3],
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
  };
};

const ensureDefaultHomepageBanner = async () => {
  const count = await HomepageBanner.countDocuments({});
  if (count) return;
  await HomepageBanner.create(defaultBannerPayload());
};

const bannerPayload = (body) => {
  const status = body.status || "Active";
  const headingLine1 = body.headingLine1 || body.bannerTitle || "Untitled Banner";
  const description = body.description || body.bannerDescription || "";

  return {
    ...body,
    bannerTitle: body.bannerTitle || headingLine1,
    bannerDescription: body.bannerDescription || description,
    bannerImage: body.bannerImage || body.image || "",
    headingLine1,
    headingHighlightText: body.headingHighlightText || "",
    description,
    feature1: body.feature1 || featureLabels[0],
    feature2: body.feature2 || featureLabels[1],
    feature3: body.feature3 || featureLabels[2],
    feature4: body.feature4 || featureLabels[3],
    primaryButtonText: body.primaryButtonText || body.buttonText || "Book Test Now",
    primaryButtonUrl: body.primaryButtonUrl || body.linkUrl || "#booking",
    secondaryButtonText: body.secondaryButtonText || "View Packages",
    secondaryButtonUrl: body.secondaryButtonUrl || "#packages",
    offerText: body.offerText || "",
    offerHighlightText: body.offerHighlightText || "",
    position: body.position || "Top Slider",
    linkUrl: body.linkUrl || body.primaryButtonUrl || "#booking",
    buttonText: body.buttonText || body.primaryButtonText || "Book Test Now",
    sortOrder: numeric(body.sortOrder),
    addedOn: body.addedOn || "Added just now",
    addedBy: body.addedBy || "Admin User",
    status,
    isActive: status === "Active"
  };
};

const bannerAdminShape = (doc) => {
  const item = toAdminId(doc);
  const status = item.status || (item.isActive ? "Active" : "Inactive");
  return {
    ...item,
    status,
    headingLine1: item.headingLine1 || item.bannerTitle || "",
    headingHighlightText: item.headingHighlightText || "",
    description: item.description || item.bannerDescription || "",
    primaryButtonText: item.primaryButtonText || item.buttonText || "Book Test Now",
    primaryButtonUrl: item.primaryButtonUrl || item.linkUrl || "#booking",
    secondaryButtonText: item.secondaryButtonText || "View Packages",
    secondaryButtonUrl: item.secondaryButtonUrl || "#packages",
    isActive: status === "Active"
  };
};

const serviceLocationPayload = (body) => ({
  ...body,
  centerName: body.centerName || "Untitled Service Location",
  fullAddress: body.fullAddress || "",
  latitude: body.latitude === "" || body.latitude == null ? null : Number(body.latitude),
  longitude: body.longitude === "" || body.longitude == null ? null : Number(body.longitude),
  sortOrder: numeric(body.sortOrder),
  isActive: body.isActive === true || body.isActive === "true" || body.active === "Active",
  isFeatured: body.isFeatured === true || body.isFeatured === "true" || body.featured === "Featured"
});

const serviceLocationAdminShape = (doc) => {
  const item = toAdminId(doc);
  return {
    ...item,
    active: item.isActive ? "Active" : "Inactive",
    featured: item.isFeatured ? "Featured" : "Standard"
  };
};

const reviewPayload = (body) => {
  const name = body.name || body.customerName || "Customer";
  const comment = body.comment || body.content || body.testimonialContent || "";
  const status = body.status || "Published";
  return {
    ...body,
    name,
    customerName: body.customerName || name,
    comment,
    content: body.content || comment,
    testimonialContent: body.testimonialContent || body.content || comment,
    image: body.image || body.customerPhoto || "",
    customerPhoto: body.customerPhoto || body.image || "",
    rating: numeric(body.rating, 5),
    status,
    displayedOn: body.displayedOn || "Homepage",
    isActive: status === "Published"
  };
};

const reviewAdminShape = (doc) => {
  const item = toAdminId(doc);
  return {
    ...item,
    customerName: item.customerName || item.name,
    content: item.content || item.comment,
    testimonialContent: item.testimonialContent || item.content || item.comment,
    customerPhoto: item.customerPhoto || item.image,
    rating: String(item.rating || 5),
    ratingLabel: Number(item.rating || 5) === 1 ? "1 Star" : `${item.rating || 5} Stars`,
    status: item.status || (item.isActive ? "Published" : "Hidden"),
    addedOn: item.addedOn || item.createdAt || item.reviewDate || "",
    displayedOn: item.displayedOn || "Homepage"
  };
};

const dashboardStatusLabels = {
  new: "Pending",
  contacted: "In Progress",
  converted: "In Progress",
  closed: "Completed"
};

const dashboardStatusOrder = ["Completed", "In Progress", "Pending", "Cancelled"];

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const endOfDay = (date) => {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
};

const addDays = (date, days) => {
  const value = new Date(date);
  value.setDate(value.getDate() + days);
  return value;
};

const validDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const dayKey = (date) => date.toISOString().slice(0, 10);

const dayLabel = (date) => date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

const dateRange = (query = {}) => {
  const requestedStart = validDate(query.startDate);
  const requestedEnd = validDate(query.endDate);
  const end = endOfDay(requestedEnd || new Date());
  const start = startOfDay(requestedStart || addDays(end, -6));

  if (start > end) {
    return {
      start: startOfDay(addDays(end, -6)),
      end,
      days: 7
    };
  }

  const days = Math.max(1, Math.round((startOfDay(end) - start) / 86400000) + 1);
  return { start, end, days };
};

const rangeLabels = (start, days) => Array.from({ length: days }, (_, index) => {
  const date = addDays(start, index);
  return { key: dayKey(date), label: dayLabel(date) };
});

const statusLabel = (status) => dashboardStatusLabels[String(status || "").toLowerCase()] || "Pending";

const statusTotal = (rows, statuses) =>
  rows
    .filter((row) => statuses.includes(String(row._id || "").toLowerCase()))
    .reduce((total, row) => total + Number(row.count || 0), 0);

const trendFor = (current, previous) => {
  const currentValue = Number(current || 0);
  const previousValue = Number(previous || 0);
  if (!previousValue) {
    return { percent: currentValue ? "100.0" : "0.0", trend: currentValue ? "up" : "up" };
  }

  const change = ((currentValue - previousValue) / previousValue) * 100;
  return {
    percent: Math.abs(change).toFixed(1),
    trend: change < 0 ? "down" : "up"
  };
};

const normalizeLookupName = (value) => String(value || "").trim().toLowerCase();

const catalogPriceMap = async () => {
  const [tests, packages] = await Promise.all([
    TestModel.find({}, "name testName discountedPrice finalPrice price").lean(),
    PackageModel.find({}, "name packageName discountedPrice finalPrice price").lean()
  ]);

  const prices = new Map();
  const setPrice = (name, value) => {
    const key = normalizeLookupName(name);
    const amount = numeric(value);
    if (key && amount >= 0) prices.set(key, amount);
  };

  tests.forEach((item) => {
    const amount = item.discountedPrice ?? item.finalPrice ?? item.price ?? 0;
    setPrice(item.name, amount);
    setPrice(item.testName, amount);
  });

  packages.forEach((item) => {
    const amount = item.discountedPrice ?? item.finalPrice ?? item.price ?? 0;
    setPrice(item.name, amount);
    setPrice(item.packageName, amount);
  });

  return prices;
};

const amountForItem = (prices, name) => prices.get(normalizeLookupName(name)) || 0;

const revenueFromGroups = (groups, prices) =>
  groups.reduce((total, item) => total + amountForItem(prices, item._id) * Number(item.count || 0), 0);

const orderIdFor = (id) => `ORD${String(id || "").slice(-6).toUpperCase()}`;

const formatDashboardDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "";

const formatDashboardTime = (date) =>
  date ? new Date(date).toLocaleString("en-IN", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

const percentText = (value, total) => (total ? `${((Number(value || 0) / total) * 100).toFixed(1)}%` : "0.0%");

const buildDefaultSampleSummary = () => ({
  totalCollected: 0,
  collectedToday: 0,
  inTransit: 0,
  receivedAtLab: 0
});

const buildDashboardAlerts = (statusCounts, inactiveLabs) => {
  const pendingOrders = statusTotal(statusCounts, ["new"]);
  const pendingReports = statusTotal(statusCounts, ["converted"]);
  const now = formatDashboardTime(new Date());
  const alerts = [];

  if (pendingOrders > 0) {
    alerts.push({
      title: `${pendingOrders} pending order${pendingOrders === 1 ? "" : "s"} need review`,
      time: now,
      type: "warning"
    });
  }

  if (pendingReports > 0) {
    alerts.push({
      title: `${pendingReports} pending report${pendingReports === 1 ? "" : "s"} need generation`,
      time: now,
      type: "info"
    });
  }

  if (inactiveLabs > 0) {
    alerts.push({
      title: `${inactiveLabs} service location${inactiveLabs === 1 ? "" : "s"} inactive`,
      time: now,
      type: "system"
    });
  }

  return alerts;
};

const listAll = (Model, mapper = toAdminId) =>
  asyncHandler(async (req, res) => {
    if (!ensureDatabase(res)) return;
    const docs = await Model.find({}).sort({ updatedAt: -1 }).lean();
    return res.json({ success: true, data: docs.map(mapper) });
  });

const createOne = (Model, normalizer = (value) => value, mapper = toAdminId) =>
  asyncHandler(async (req, res) => {
    if (!ensureDatabase(res)) return;
    const doc = await Model.create(normalizer(req.body));
    res.status(201).json({ success: true, data: mapper(doc.toObject ? doc.toObject() : doc) });
  });

const updateOne = (Model, normalizer = (value) => value, mapper = toAdminId) =>
  asyncHandler(async (req, res) => {
    if (!ensureDatabase(res)) return;
    const doc = await Model.findByIdAndUpdate(req.params.id, normalizer(req.body), {
      new: true,
      runValidators: true
    }).lean();

    if (!doc) {
      return res.status(404).json({ success: false, message: "Content item not found." });
    }

    return res.json({ success: true, data: mapper(doc) });
  });

const deleteOne = (Model) =>
  asyncHandler(async (req, res) => {
    if (!ensureDatabase(res)) return;
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({ success: false, message: "Content item not found." });
    }

    return res.json({ success: true, message: "Content item deleted successfully." });
  });

const permissionPages = ["Dashboard", "Bookings", "Reports", "Packages", "Tests", "Customers", "Content", "Settings", "User Management"];
const permissionTypes = ["view", "create", "edit", "delete"];
const defaultFeatures = ["Booking Actions", "Report Upload", "Payment Management", "WhatsApp Updates", "Content Publishing", "System Settings"];

const fullPermissions = () =>
  permissionPages.reduce((pages, page) => {
    pages[page] = permissionTypes.reduce((actions, action) => ({ ...actions, [action]: true }), {});
    return pages;
  }, {});

const viewOnlyPermissions = () =>
  permissionPages.reduce((pages, page) => {
    pages[page] = permissionTypes.reduce((actions, action) => ({ ...actions, [action]: action === "view" }), {});
    return pages;
  }, {});

const defaultFeatureAccess = (enabled = false) =>
  defaultFeatures.reduce((features, feature) => ({ ...features, [feature]: enabled }), {});

const roleDefaults = [
  { roleName: "Super Admin", description: "Full system access", pageAccess: fullPermissions(), featureAccess: defaultFeatureAccess(true), status: "Active" },
  { roleName: "Admin", description: "Admin access with managed permissions", pageAccess: viewOnlyPermissions(), featureAccess: defaultFeatureAccess(false), status: "Active" },
  { roleName: "Staff", description: "Operational staff access", pageAccess: viewOnlyPermissions(), featureAccess: defaultFeatureAccess(false), status: "Active" }
];

const toPlainPermissions = (value = {}) => {
  if (value instanceof Map) return Object.fromEntries(value);
  return Object.entries(value || {}).reduce((result, [key, permissions]) => {
    result[key] = permissions instanceof Map ? Object.fromEntries(permissions) : permissions;
    return result;
  }, {});
};

const toPlainFeatures = (value = {}) => (value instanceof Map ? Object.fromEntries(value) : value || {});

const normalizeAdminStatus = (value) => (["Active", "Inactive", "Suspended"].includes(value) ? value : "Active");

const formatUserDate = (value) =>
  value ? new Date(value).toLocaleString("en-IN", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

const userRoleName = (user) => user.adminRole || (isSuperAdmin(user) ? "Super Admin" : "Admin");

const adminUserShape = (user) => ({
  _id: String(user._id),
  id: String(user._id),
  userName: user.fullName,
  fullName: user.fullName,
  username: user.username || "",
  email: user.email,
  mobile: user.phone || user.alternateNumber || "",
  role: userRoleName(user),
  adminRole: userRoleName(user),
  status: user.accountStatus || (user.isActive ? "Active" : "Inactive"),
  lastLogin: user.lastLogin ? formatUserDate(user.lastLogin) : "-",
  createdOn: formatUserDate(user.createdAt),
  permissions: toPlainPermissions(user.permissions)
});

const roleShape = (role, usersCount = 0) => ({
  _id: String(role._id),
  id: String(role._id),
  roleName: role.roleName,
  description: role.description || "",
  usersCount: `${usersCount} user${usersCount === 1 ? "" : "s"}`,
  permissions: "Managed permissions",
  pageAccess: toPlainPermissions(role.pageAccess),
  featureAccess: toPlainFeatures(role.featureAccess),
  status: role.status || "Active",
  createdOn: formatUserDate(role.createdAt)
});

const ensureAdminRoles = async () => {
  await Promise.all(roleDefaults.map((role) =>
    AdminRole.updateOne({ roleName: role.roleName }, { $setOnInsert: role }, { upsert: true })
  ));
};

const roleCounts = async () => {
  const counts = await User.aggregate([
    { $match: { role: "admin" } },
    { $group: { _id: "$adminRole", count: { $sum: 1 } } }
  ]);

  return counts.reduce((map, row) => {
    map.set(row._id || "Admin", row.count);
    return map;
  }, new Map());
};

const buildUserRolePayload = async () => {
  await ensureAdminRoles();
  const [adminUsers, roles, counts] = await Promise.all([
    User.find({ role: "admin" }).sort({ createdAt: -1 }).lean(),
    AdminRole.find({}).sort({ roleName: 1 }).lean(),
    roleCounts()
  ]);

  const users = adminUsers.map(adminUserShape);
  const roleRows = roles.map((role) => roleShape(role, counts.get(role.roleName) || 0));
  const activeUsers = users.filter((user) => user.status === "Active").length;
  const inactiveUsers = users.filter((user) => user.status !== "Active").length;
  const roleSegments = roleRows.map((role, index) => {
    const count = counts.get(role.roleName) || 0;
    const percent = users.length ? ((count / users.length) * 100).toFixed(1) : "0.0";
    const colors = ["bg-upchar-blue", "bg-upchar-green", "bg-upchar-orange", "bg-upchar-purple", "bg-upchar-red", "bg-slate-400"];
    return { label: role.roleName, value: `${count} (${percent}%)`, color: colors[index % colors.length] };
  });

  const recent = [
    ...users.slice(0, 3).map((user) => ({ title: user.userName, text: `${user.role} - ${user.status} - ${user.createdOn}` })),
    ...roleRows.slice(0, 2).map((role) => ({ title: role.roleName, text: `${role.status} role - ${role.usersCount}` }))
  ].slice(0, 5);

  return {
    stats: [
      { title: "Total Users", value: String(users.length), text: "Database users", icon: "users", color: "green" },
      { title: "Total Roles", value: String(roleRows.length), text: "Database roles", icon: "shield", color: "blue" },
      { title: "Active Users", value: String(activeUsers), text: `${users.length ? ((activeUsers / users.length) * 100).toFixed(1) : "0.0"}% of total`, icon: "userPlus", color: "purple", tone: "green" },
      { title: "Inactive Users", value: String(inactiveUsers), text: `${users.length ? ((inactiveUsers / users.length) * 100).toFixed(1) : "0.0"}% of total`, icon: "userX", color: "orange", tone: inactiveUsers ? "red" : "green" }
    ],
    users,
    roles: roleRows,
    roleOptions: ["All Roles", ...roleRows.map((role) => role.roleName)],
    usersByRole: {
      title: "Users by Role",
      chart: "bg-[conic-gradient(#1358f6_0_35%,#099447_35%_65%,#ff9800_65%_82%,#7c3aed_82%_100%)]",
      segments: roleSegments.length ? roleSegments : [{ label: "No Roles", value: "0 (0.0%)", color: "bg-slate-400" }]
    },
    recentActivity: recent,
    permissionPages,
    permissionTypes,
    featureAccessOptions: defaultFeatures
  };
};

const normalizeAdminPayload = async (body, existing = {}) => {
  const roleName = body.adminRole || body.role || "Admin";
  const status = normalizeAdminStatus(body.status || body.accountStatus);
  const payload = {
    fullName: body.fullName || body.userName || existing.fullName || "Admin User",
    username: String(body.username || body.email || existing.username || "").trim().toLowerCase(),
    email: String(body.email || existing.email || "").trim().toLowerCase(),
    phone: String(body.mobile || body.phone || existing.phone || "").trim(),
    role: "admin",
    adminRole: roleName,
    accountStatus: status,
    isActive: status === "Active"
  };

  if (!payload.phone) delete payload.phone;

  const role = await AdminRole.findOne({ roleName }).lean();
  payload.permissions = body.permissions || role?.pageAccess || {};

  return payload;
};

export const getUserRoleManagement = asyncHandler(async (_req, res) => {
  if (!ensureDatabase(res)) return;
  return res.json({ success: true, data: await buildUserRolePayload() });
});

export const createAdminUser = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  if (!isSuperAdmin(req.admin)) return res.status(403).json({ success: false, message: "Access Denied" });

  const temporaryPassword = String(req.body.temporaryPassword || req.body.password || "").trim();
  if (!temporaryPassword || temporaryPassword.length < 8) {
    return res.status(400).json({ success: false, message: "Temporary password must be at least 8 characters." });
  }

  const payload = await normalizeAdminPayload(req.body);
  if (!payload.email || !payload.fullName) return res.status(400).json({ success: false, message: "Full name and email are required." });
  payload.passwordHash = await bcrypt.hash(temporaryPassword, 12);

  const user = await User.create(payload);
  return res.status(201).json({
    success: true,
    data: {
      user: adminUserShape(user.toObject()),
      credentials: {
        email: user.email,
        username: user.username,
        temporaryPassword
      }
    }
  });
});

export const updateAdminUser = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  if (!isSuperAdmin(req.admin)) return res.status(403).json({ success: false, message: "Access Denied" });

  const existing = await User.findById(req.params.id);
  if (!existing || existing.role !== "admin") return res.status(404).json({ success: false, message: "User not found." });

  const payload = await normalizeAdminPayload(req.body, existing);
  Object.assign(existing, payload);
  await existing.save();

  return res.json({ success: true, data: adminUserShape(existing.toObject()) });
});

export const deleteAdminUser = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  if (!isSuperAdmin(req.admin)) return res.status(403).json({ success: false, message: "Access Denied" });

  if (String(req.admin?._id) === String(req.params.id)) {
    return res.status(400).json({ success: false, message: "Super Admin cannot delete their own account." });
  }

  const user = await User.findById(req.params.id);
  if (!user || user.role !== "admin") return res.status(404).json({ success: false, message: "User not found." });

  const deletingActiveSuperAdmin = user.isActive && user.accountStatus === "Active" && isSuperAdmin(user);
  if (deletingActiveSuperAdmin) {
    const activeAdmins = await User.find({ role: "admin", isActive: true, accountStatus: "Active" })
      .select("_id username email role adminRole accountStatus isActive")
      .lean();
    const activeSuperAdminCount = activeAdmins.filter((admin) => isSuperAdmin(admin)).length;

    if (activeSuperAdminCount <= 1) {
      return res.status(400).json({ success: false, message: "Cannot delete the last active Super Admin." });
    }
  }

  await user.deleteOne();
  return res.json({ success: true, message: "User deleted successfully." });
});

export const resetAdminUserPassword = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  if (!isSuperAdmin(req.admin)) return res.status(403).json({ success: false, message: "Access Denied" });

  const temporaryPassword = String(req.body.temporaryPassword || req.body.password || "").trim();
  if (!temporaryPassword || temporaryPassword.length < 8) {
    return res.status(400).json({ success: false, message: "Temporary password must be at least 8 characters." });
  }

  const user = await User.findById(req.params.id);
  if (!user || user.role !== "admin") return res.status(404).json({ success: false, message: "User not found." });
  user.passwordHash = await bcrypt.hash(temporaryPassword, 12);
  await user.save();

  return res.json({
    success: true,
    data: {
      user: adminUserShape(user.toObject()),
      credentials: {
        email: user.email,
        username: user.username,
        temporaryPassword
      }
    }
  });
});

export const createAdminRole = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  if (!isSuperAdmin(req.admin)) return res.status(403).json({ success: false, message: "Access Denied" });

  const roleName = String(req.body.roleName || "").trim();
  if (!roleName) return res.status(400).json({ success: false, message: "Role name is required." });

  const role = await AdminRole.create({
    roleName,
    description: req.body.description || "",
    pageAccess: req.body.pageAccess || {},
    featureAccess: req.body.featureAccess || {},
    status: req.body.status || "Active"
  });

  return res.status(201).json({ success: true, data: roleShape(role.toObject(), 0) });
});

export const updateAdminRole = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  if (!isSuperAdmin(req.admin)) return res.status(403).json({ success: false, message: "Access Denied" });

  const role = await AdminRole.findByIdAndUpdate(
    req.params.id,
    {
      roleName: req.body.roleName,
      description: req.body.description || "",
      pageAccess: req.body.pageAccess || {},
      featureAccess: req.body.featureAccess || {},
      status: req.body.status || "Active"
    },
    { new: true, runValidators: true }
  ).lean();

  if (!role) return res.status(404).json({ success: false, message: "Role not found." });
  const counts = await roleCounts();
  return res.json({ success: true, data: roleShape(role, counts.get(role.roleName) || 0) });
});

export const deleteAdminRole = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  if (!isSuperAdmin(req.admin)) return res.status(403).json({ success: false, message: "Access Denied" });

  const role = await AdminRole.findById(req.params.id);
  if (!role) return res.status(404).json({ success: false, message: "Role not found." });

  if (normalizePermissionValue(role.roleName) === "super admin") {
    return res.status(400).json({ success: false, message: "Super Admin role cannot be deleted." });
  }

  await role.deleteOne();
  return res.json({ success: true, message: "Role deleted successfully." });
});

const bookingNotificationMessage = (booking) => {
  const bookingId = formatBookingId(booking);
  const customer = booking.customerName || booking.fullName || "Customer";
  return `${bookingId} for ${customer}`;
};

const notificationShape = (event, readKeys) => ({
  ...event,
  timestamp: notificationDateTime(event.createdAt),
  read: readKeys.has(event.eventKey)
});

const buildSystemNotifications = async () => {
  const [bookings, users, contactMessages] = await Promise.all([
    BookingLead.find({}).sort({ updatedAt: -1 }).limit(40).lean(),
    User.find({ role: "customer" }).sort({ createdAt: -1 }).limit(20).lean(),
    ContactMessage.find({}).sort({ createdAt: -1 }).limit(20).lean()
  ]);

  const events = [];

  bookings.forEach((booking) => {
    events.push({
      eventKey: `booking:new:${booking._id}`,
      eventType: "new_booking",
      title: "New Booking",
      message: bookingNotificationMessage(booking),
      createdAt: booking.createdAt,
      href: "/admin/bookings"
    });

    const bookingStatus = booking.bookingStatus || "Pending Confirmation";
    if (bookingStatus !== "Pending Confirmation") {
      events.push({
        eventKey: `booking:status:${booking._id}:${bookingStatus}`,
        eventType: "booking_status_update",
        title: "Booking Status Update",
        message: `${bookingNotificationMessage(booking)} is now ${bookingStatus}`,
        createdAt: booking.updatedAt || booking.createdAt,
        href: "/admin/booking-status"
      });
    }

    if (["Report Ready", "Completed"].includes(bookingStatus)) {
      events.push({
        eventKey: `report:upload:${booking._id}`,
        eventType: "report_upload",
        title: "Report Upload",
        message: `Report is ready for ${bookingNotificationMessage(booking)}`,
        createdAt: booking.updatedAt || booking.createdAt,
        href: "/admin/booking-status"
      });
    }
  });

  users.forEach((user) => {
    events.push({
      eventKey: `user:new:${user._id}`,
      eventType: "new_user_registration",
      title: "New User Registration",
      message: `${user.fullName || "Customer"} registered with ${user.email || user.phone || "Upchar"}`,
      createdAt: user.createdAt,
      href: "/admin/customers"
    });
  });

  contactMessages.forEach((message) => {
    events.push({
      eventKey: `contact:new:${message._id}`,
      eventType: "contact_form_submission",
      title: "Contact Form Submission",
      message: `${message.fullName} submitted ${message.subject}`,
      createdAt: message.createdAt,
      href: "/admin/content-pages/contact-us"
    });
  });

  return events
    .filter((event) => event.createdAt)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 60);
};

export const listAdminNotifications = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;

  const events = await buildSystemNotifications();
  const readStates = await Notification.find({ eventKey: { $in: events.map((event) => event.eventKey) }, readAt: { $ne: null } }, "eventKey").lean();
  const readKeys = new Set(readStates.map((item) => item.eventKey));
  const notifications = events.map((event) => notificationShape(event, readKeys));

  return res.json({
    success: true,
    data: {
      unreadCount: notifications.filter((event) => !event.read).length,
      notifications
    }
  });
});

export const markAdminNotificationRead = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;

  const eventKey = decodeURIComponent(req.params.eventKey || "");
  if (!eventKey) return res.status(400).json({ success: false, message: "Notification event key is required." });

  const doc = await Notification.findOneAndUpdate(
    { eventKey },
    {
      $set: {
        eventKey,
        eventType: eventKey.split(":").slice(0, 2).join("_") || "system_event",
        readAt: new Date(),
        readBy: req.user?._id || null
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  return res.json({ success: true, data: doc });
});

export const getDashboardSummary = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;

  const { start, end, days } = dateRange(req.query);
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(start, -days);
  const labels = rangeLabels(start, days);
  const previousLabels = rangeLabels(previousStart, days);
  const previousMatchStart = startOfDay(previousStart);
  const previousMatchEnd = endOfDay(previousEnd);
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const [
    prices,
    totalBookings,
    statusCounts,
    currentStatusCounts,
    previousStatusCounts,
    dailyCounts,
    previousDailyCounts,
    revenueGroups,
    currentRevenueGroups,
    previousRevenueGroups,
    recentLeads,
    serviceLocations,
    inactiveLabCount
  ] = await Promise.all([
    catalogPriceMap(),
    BookingLead.countDocuments({}),
    BookingLead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    BookingLead.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    BookingLead.aggregate([
      { $match: { createdAt: { $gte: previousMatchStart, $lte: previousMatchEnd } } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    BookingLead.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
    ]),
    BookingLead.aggregate([
      { $match: { createdAt: { $gte: previousMatchStart, $lte: previousMatchEnd } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
    ]),
    BookingLead.aggregate([
      { $match: { status: { $in: ["converted", "closed"] } } },
      { $group: { _id: "$selectedTestOrPackage", count: { $sum: 1 } } }
    ]),
    BookingLead.aggregate([
      { $match: { status: { $in: ["converted", "closed"] }, createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$selectedTestOrPackage", count: { $sum: 1 } } }
    ]),
    BookingLead.aggregate([
      { $match: { status: { $in: ["converted", "closed"] }, createdAt: { $gte: previousMatchStart, $lte: previousMatchEnd } } },
      { $group: { _id: "$selectedTestOrPackage", count: { $sum: 1 } } }
    ]),
    BookingLead.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ServiceLocation.find({}, "centerName city isActive").lean(),
    ServiceLocation.countDocuments({ isActive: false })
  ]);

  const dailyCountMap = new Map(dailyCounts.map((item) => [item._id, Number(item.count || 0)]));
  const previousDailyCountMap = new Map(previousDailyCounts.map((item) => [item._id, Number(item.count || 0)]));
  const serviceLocationByCity = new Map(
    serviceLocations
      .filter((location) => location.city)
      .map((location) => [normalizeLookupName(location.city), location.centerName])
  );

  const totalOrders = totalBookings;
  const testsConducted = statusTotal(statusCounts, ["converted", "closed"]);
  const reportsGenerated = statusTotal(statusCounts, ["closed"]);
  const pendingOrders = statusTotal(statusCounts, ["new"]);
  const totalRevenue = revenueFromGroups(revenueGroups, prices);

  const currentBookings = currentStatusCounts.reduce((total, row) => total + Number(row.count || 0), 0);
  const previousBookings = previousStatusCounts.reduce((total, row) => total + Number(row.count || 0), 0);
  const currentTestsConducted = statusTotal(currentStatusCounts, ["converted", "closed"]);
  const previousTestsConducted = statusTotal(previousStatusCounts, ["converted", "closed"]);
  const currentReportsGenerated = statusTotal(currentStatusCounts, ["closed"]);
  const previousReportsGenerated = statusTotal(previousStatusCounts, ["closed"]);
  const currentPendingOrders = statusTotal(currentStatusCounts, ["new"]);
  const previousPendingOrders = statusTotal(previousStatusCounts, ["new"]);
  const currentRevenue = revenueFromGroups(currentRevenueGroups, prices);
  const previousRevenue = revenueFromGroups(previousRevenueGroups, prices);

  const statusTotals = dashboardStatusOrder.map((label) => ({
    label,
    value: statusCounts
      .filter((row) => statusLabel(row._id) === label)
      .reduce((total, row) => total + Number(row.count || 0), 0)
  }));

  const recentOrders = recentLeads.map((lead) => ({
    id: orderIdFor(lead._id),
    patient: lead.fullName || "",
    test: lead.selectedTestOrPackage || "",
    lab: serviceLocationByCity.get(normalizeLookupName(lead.city)) || lead.city || "Not Assigned",
    status: statusLabel(lead.status),
    date: formatDashboardDate(lead.createdAt),
    amount: amountForItem(prices, lead.selectedTestOrPackage),
    reportStatus: String(lead.status || "").toLowerCase() === "closed" ? "Generated" : "Pending"
  }));

  return res.json({
    success: true,
    data: {
      stats: {
        totalBookings,
        totalOrders,
        testsConducted,
        totalRevenue,
        reportsGenerated,
        pendingOrders
      },
      statTrends: {
        totalBookings: trendFor(currentBookings, previousBookings),
        totalOrders: trendFor(currentBookings, previousBookings),
        testsConducted: trendFor(currentTestsConducted, previousTestsConducted),
        totalRevenue: trendFor(currentRevenue, previousRevenue),
        reportsGenerated: trendFor(currentReportsGenerated, previousReportsGenerated),
        pendingOrders: trendFor(currentPendingOrders, previousPendingOrders)
      },
      bookingOverview: {
        labels: labels.map((item) => item.label),
        thisWeek: labels.map((item) => dailyCountMap.get(item.key) || 0),
        lastWeek: previousLabels.map((item) => previousDailyCountMap.get(item.key) || 0)
      },
      ordersByStatus: statusTotals.map((item) => ({
        ...item,
        percent: percentText(item.value, totalOrders)
      })),
      topPerformingLabs: [],
      recentOrders,
      sampleCollectionSummary: buildDefaultSampleSummary(),
      systemAlerts: buildDashboardAlerts(statusCounts, inactiveLabCount),
      dateRange: {
        startDate: dayKey(start),
        endDate: dayKey(end)
      },
      generatedAt: new Date().toISOString()
    }
  });
});

export const listPackages = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  await ensurePackageSeedData();
  const docs = await PackageModel.find({}).sort({ popularity: -1, updatedAt: -1 }).lean();
  return res.json({ success: true, data: docs.map(packageAdminShape) });
});
export const createPackage = createOne(PackageModel, packagePayload, packageAdminShape);
export const updatePackage = updateOne(PackageModel, packagePayload, packageAdminShape);
export const deletePackage = deleteOne(PackageModel);

export const listAdminBookings = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  const docs = await BookingLead.find({ userId: { $ne: null } }).sort({ createdAt: -1 }).lean();
  return res.json({ success: true, data: docs.map(buildAdminBookingShape) });
});

export const updateAdminBookingStatus = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  const bookingStatus = req.body.bookingStatus || req.body.currentStatus || req.body.status;
  if (!bookingStatusOptions.has(bookingStatus)) {
    return res.status(400).json({ success: false, message: "Invalid booking status." });
  }

  const doc = await BookingLead.findByIdAndUpdate(
    req.params.id,
    { $set: { bookingStatus } },
    { new: true, runValidators: true }
  ).lean();

  if (!doc) return res.status(404).json({ success: false, message: "Booking not found." });
  return res.json({ success: true, data: buildAdminBookingShape(doc) });
});

export const uploadAdminBookingReport = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  if (!req.file) return res.status(400).json({ success: false, message: "Please upload a JPG, PNG or PDF report." });

  const doc = await BookingLead.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        reportFile: `/uploads/reports/${req.file.filename}`,
        reportUploadedAt: new Date(),
        bookingStatus: "Report Ready",
        status: "closed"
      }
    },
    { new: true, runValidators: true }
  ).lean();

  if (!doc) return res.status(404).json({ success: false, message: "Booking not found." });
  return res.json({ success: true, message: "Report uploaded successfully.", data: buildAdminBookingShape(doc) });
});

export const deleteAdminBookingReport = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;

  const doc = await BookingLead.findByIdAndUpdate(
    req.params.id,
    { $set: { reportFile: "", reportUploadedAt: null, bookingStatus: "Testing In Progress", status: "converted" } },
    { new: true, runValidators: true }
  ).lean();

  if (!doc) return res.status(404).json({ success: false, message: "Booking not found." });
  return res.json({ success: true, message: "Report deleted successfully.", data: buildAdminBookingShape(doc) });
});

export const deleteAdminBookingPermanent = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;

  if (!isSuperAdmin(req.admin)) {
    return res.status(403).json({ success: false, message: "Super Admin access is required to permanently delete bookings." });
  }

  const query = mongoose.Types.ObjectId.isValid(req.params.id)
    ? { _id: req.params.id }
    : { bookingId: req.params.id };
  const doc = await BookingLead.findOneAndDelete(query).lean();

  if (!doc) return res.status(404).json({ success: false, message: "Booking not found." });
  return res.json({ success: true, message: "Booking permanently deleted." });
});

export const listAdminPrescriptions = asyncHandler(async (_req, res) => {
  if (!ensureDatabase(res)) return;
  const docs = await BookingLead.find({ prescriptionFile: { $nin: ["", null] } }).sort({ createdAt: -1 }).lean();
  return res.json({ success: true, data: docs.map(buildAdminPrescriptionShape) });
});

export const updateAdminPrescription = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  const status = normalizePrescriptionStatus(req.body.status || req.body.bookingStatus);
  const query = mongoose.Types.ObjectId.isValid(req.params.id)
    ? { _id: req.params.id }
    : { bookingId: req.params.id };
  const doc = await BookingLead.findOneAndUpdate(
    { ...query, prescriptionFile: { $nin: ["", null] } },
    { $set: { bookingStatus: status } },
    { new: true, runValidators: true }
  ).lean();

  if (!doc) return res.status(404).json({ success: false, message: "Prescription not found." });
  return res.json({ success: true, data: buildAdminPrescriptionShape(doc) });
});

export const deleteAdminPrescription = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  const query = mongoose.Types.ObjectId.isValid(req.params.id)
    ? { _id: req.params.id }
    : { bookingId: req.params.id };
  const doc = await BookingLead.findOneAndDelete({ ...query, prescriptionFile: { $nin: ["", null] } }).lean();

  if (!doc) return res.status(404).json({ success: false, message: "Prescription not found." });
  return res.json({ success: true, message: "Prescription deleted successfully." });
});

export const listTests = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  await ensureTestSeedData();
  const docs = await TestModel.find({}).sort({ sortOrder: 1, updatedAt: -1 }).lean();
  return res.json({ success: true, data: docs.map(testAdminShape) });
});
export const createTest = createOne(TestModel, testPayload, testAdminShape);
export const updateTest = updateOne(TestModel, testPayload, testAdminShape);
export const deleteTest = deleteOne(TestModel);

export const listTestCategories = listAll(TestCategory, toAdminId);
export const createTestCategory = createOne(TestCategory, categoryPayload);
export const updateTestCategory = updateOne(TestCategory, categoryPayload);
export const deleteTestCategory = deleteOne(TestCategory);

export const listCoupons = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  const docs = await Coupon.find({}).sort({ sortOrder: 1, updatedAt: -1 }).lean();
  return res.json({ success: true, data: docs.map(couponAdminShape) });
});
export const createCoupon = createOne(Coupon, couponPayload, couponAdminShape);
export const updateCoupon = updateOne(Coupon, couponPayload, couponAdminShape);
export const deleteCoupon = deleteOne(Coupon);

export const listHomepageBanners = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  await ensureDefaultHomepageBanner();
  const docs = await HomepageBanner.find({}).sort({ sortOrder: 1, updatedAt: -1 }).lean();
  return res.json({ success: true, data: docs.map(bannerAdminShape) });
});
export const createHomepageBanner = createOne(HomepageBanner, bannerPayload, bannerAdminShape);
export const updateHomepageBanner = updateOne(HomepageBanner, bannerPayload, bannerAdminShape);
export const deleteHomepageBanner = deleteOne(HomepageBanner);

export const listServiceLocations = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  await ensureServiceLocationSeedData();
  const docs = await ServiceLocation.find({}).sort({ sortOrder: 1, updatedAt: -1 }).lean();
  return res.json({ success: true, data: docs.map(serviceLocationAdminShape) });
});

export const createServiceLocation = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  const payload = serviceLocationPayload(req.body);
  if (payload.isFeatured) await ServiceLocation.updateMany({}, { isFeatured: false });
  const doc = await ServiceLocation.create(payload);
  return res.status(201).json({ success: true, data: serviceLocationAdminShape(doc.toObject()) });
});

export const updateServiceLocation = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  const payload = serviceLocationPayload(req.body);
  if (payload.isFeatured) await ServiceLocation.updateMany({ _id: { $ne: req.params.id } }, { isFeatured: false });
  const doc = await ServiceLocation.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).lean();
  if (!doc) return res.status(404).json({ success: false, message: "Service location not found." });
  return res.json({ success: true, data: serviceLocationAdminShape(doc) });
});

export const deleteServiceLocation = deleteOne(ServiceLocation);

export const listBlogs = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  const docs = await Blog.find({}).sort({ publishDate: -1, updatedAt: -1 }).lean();
  return res.json({ success: true, data: docs.map(blogShape) });
});
export const createBlog = createOne(Blog, normalizeBlogPayload, blogShape);
export const updateBlog = updateOne(Blog, normalizeBlogPayload, blogShape);
export const deleteBlog = deleteOne(Blog);

export const listReviews = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  const docs = await Review.find({}).sort({ reviewDate: -1, updatedAt: -1 }).lean();
  return res.json({ success: true, data: docs.map(reviewAdminShape) });
});
export const createReview = createOne(Review, reviewPayload, reviewAdminShape);
export const updateReview = updateOne(Review, reviewPayload, reviewAdminShape);
export const deleteReview = deleteOne(Review);

export const importGoogleReviews = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;
  const googlePlaceId = String(req.body.googlePlaceId || "").trim();
  if (!googlePlaceId) return res.status(400).json({ success: false, message: "Google Place ID is required." });

  const googleReviews = await getGoogleReviews(googlePlaceId);
  let imported = 0;

  for (const review of googleReviews) {
    const duplicate = await Review.exists({
      customerName: review.customerName,
      content: review.content
    });
    if (duplicate) continue;

    await Review.create({
      name: review.customerName,
      customerName: review.customerName,
      image: review.customerPhoto,
      customerPhoto: review.customerPhoto,
      rating: review.rating,
      comment: review.content,
      content: review.content,
      testimonialContent: review.content,
      reviewDate: review.reviewDate,
      source: "Google",
      status: "Published",
      displayedOn: "Homepage",
      googlePlaceId,
      isActive: true
    });
    imported += 1;
  }

  const docs = await Review.find({}).sort({ reviewDate: -1, updatedAt: -1 }).lean();
  return res.json({
    success: true,
    message: `${imported} Google review${imported === 1 ? "" : "s"} imported.`,
    imported,
    skipped: googleReviews.length - imported,
    data: docs.map(reviewAdminShape)
  });
});

export const updateHomeHero = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;

  const hero = await HomeHero.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true
  });

  return res.json({ success: true, data: hero });
});

export const updateSiteSettings = asyncHandler(async (req, res) => {
  if (!ensureDatabase(res)) return;

  const settings = await SiteSetting.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true
  });

  return res.json({ success: true, data: settings });
});
