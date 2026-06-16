import mongoose from "mongoose";
import Address from "../models/Address.js";
import BookingLead from "../models/BookingLead.js";
import Coupon from "../models/Coupon.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const dbReady = () => mongoose.connection.readyState === 1;

const parseJson = (value, fallback) => {
  if (Array.isArray(value) || (value && typeof value === "object")) return value;
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const numeric = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizePhone = (value = "") => String(value).replace(/\D/g, "").slice(-10);

const addressText = (address = {}) =>
  [address.addressLine1, address.addressLine2, address.landmark, address.city, address.state, address.country]
    .filter(Boolean)
    .join(", ");

const generateBookingId = () => `UPCH${Date.now().toString().slice(-9)}`;

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("en-IN", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

const normalizeItem = (item = {}) => ({
  ...item,
  id: item.id || item._id || item.name || item.title || "booking-item",
  type: item.type || "test",
  name: item.name || item.title || "Selected Test / Package",
  subtitle: item.subtitle || item.testCount || item.testsIncluded || "Health item",
  description: item.description || "",
  price: numeric(item.price ?? item.discountedPrice ?? item.finalPrice),
  quantity: Math.max(1, numeric(item.quantity, 1)),
  icon: item.icon || "TestTube2",
  color: item.color || "green"
});

export const buildBookingDetailShape = (booking = {}) => {
  const items = Array.isArray(booking.items) && booking.items.length
    ? booking.items.map(normalizeItem)
    : String(booking.selectedTestOrPackage || "")
        .split(",")
        .filter(Boolean)
        .map((name, index) => normalizeItem({ id: `${booking.bookingId || booking._id}-${index}`, name: name.trim(), quantity: 1 }));
  const subtotal = numeric(booking.subtotal);
  const discount = numeric(booking.discount);
  const couponDiscount = numeric(booking.couponDiscount);
  const totalPayable = numeric(booking.totalPayable);

  return {
    id: String(booking._id || booking.id || ""),
    bookingId: booking.bookingId || `UPCH${String(booking._id || "").slice(-9).toUpperCase()}`,
    paymentId: booking.paymentId || booking.paymentMethod || "",
    bookingDate: formatDateTime(booking.createdAt),
    paidOn: formatDateTime(booking.updatedAt || booking.createdAt),
    paymentMode: booking.paymentMethod || "Pay Later",
    paymentStatus: booking.paymentStatus || "Pending",
    bookingStatus: booking.bookingStatus || "Pending Confirmation",
    bookingType: booking.bookingType || (booking.userId ? "User" : "Guest"),
    customer: {
      name: booking.customerName || booking.fullName || "",
      phone: booking.mobileNumber || booking.mobile || "",
      email: booking.email || "",
      address: booking.address || booking.city || "",
      pincode: booking.pincode || "",
      collectionType: booking.collectionType || "Home Collection",
      date: booking.collectionDate || formatDateTime(booking.createdAt),
      timeSlot: booking.timeSlot || "Pending Confirmation"
    },
    items,
    summary: {
      subtotal,
      discount: Math.max(0, discount - couponDiscount),
      couponDiscount,
      totalSavings: discount,
      totalPayable,
      itemCount: numeric(booking.quantity, items.reduce((total, item) => total + numeric(item.quantity, 1), 0))
    },
    appliedCoupon: booking.appliedCoupon || (booking.couponCode ? {
      couponCode: booking.couponCode,
      couponName: booking.couponName,
      discountAmount: couponDiscount
    } : null)
  };
};

export const createBookingLeadRecord = async ({ body = {}, user, file = null, overrides = {} }) => {
  if (!dbReady()) {
    const error = new Error("Database is not connected. Please configure MongoDB before saving booking leads.");
    error.statusCode = 503;
    throw error;
  }

  if (!user?._id) {
    const error = new Error("Please sign in before booking.");
    error.statusCode = 401;
    throw error;
  }

  const { selectedTestOrPackage, source } = body;
  const primaryAddress =
    (await Address.findOne({ userId: user._id, isPrimary: true }).lean()) ||
    (await Address.findOne({ userId: user._id }).sort({ updatedAt: -1 }).lean());
  const fullName = user.fullName || "";
  const mobile = normalizePhone(user.phone);
  const savedAddress = primaryAddress ? addressText(primaryAddress) : "";
  const savedPincode = primaryAddress?.pincode || "";
  const errors = {};
  const items = parseJson(body.items, []);
  const summary = parseJson(body.summary, {});
  const appliedCoupon = parseJson(body.appliedCoupon, null);
  const itemNames = Array.isArray(items)
    ? items.map((item) => `${item.name || item.title || "Item"} x ${Number(item.quantity || 1)}`).join(", ")
    : "";
  const selectedItems = selectedTestOrPackage || itemNames;

  if (!fullName?.trim()) errors.fullName = "Full name is required.";
  if (!/^[6-9]\d{9}$/.test(mobile)) errors.mobile = "Valid 10-digit mobile number is required.";
  if (!String(selectedItems || "").trim()) errors.selectedTestOrPackage = "Selected test or package is required.";

  if (Object.keys(errors).length) {
    console.error("Booking validation failed:", {
      errors,
      source,
      userId: String(user._id),
      receivedFields: Object.keys(body || {})
    });
    const error = new Error(Object.values(errors).join(" "));
    error.statusCode = 400;
    error.errors = errors;
    throw error;
  }

  const customerName = fullName.trim();
  const mobileNumber = mobile;
  const lead = await BookingLead.create({
    bookingId: body.bookingId || generateBookingId(),
    cartId: body.cartId || "",
    orderId: body.orderId || "",
    bookingType: "User",
    userId: user._id,
    fullName: customerName,
    customerName,
    mobile: mobileNumber,
    mobileNumber,
    email: user.email || "",
    address: savedAddress,
    pincode: savedPincode,
    collectionType: body.collectionType || "Home Collection",
    collectionDate: body.collectionDate || body.date || "",
    timeSlot: body.timeSlot || "",
    city: primaryAddress?.city || "",
    selectedTestOrPackage: selectedItems,
    items,
    quantity: numeric(body.quantity ?? summary.itemCount, 1),
    subtotal: numeric(body.subtotal ?? summary.subtotal),
    discount: numeric(body.discount ?? summary.totalSavings ?? (numeric(summary.discount) + numeric(summary.couponDiscount))),
    couponCode: body.couponCode || appliedCoupon?.couponCode || "",
    couponName: body.couponName || appliedCoupon?.couponName || appliedCoupon?.title || "",
    couponDiscount: numeric(body.couponDiscount ?? summary.couponDiscount ?? appliedCoupon?.discountAmount),
    appliedCoupon,
    totalPayable: numeric(overrides.totalPayable ?? body.totalPayable ?? summary.totalPayable),
    paymentMethod: overrides.paymentMethod || body.paymentMethod || "Pay Later",
    paymentStatus: overrides.paymentStatus || body.paymentStatus || "Pay Later",
    bookingStatus: overrides.bookingStatus || body.bookingStatus || "Confirmed",
    source: source || "home-page",
    paymentId: overrides.paymentId || body.paymentId || "",
    paymentProvider: overrides.paymentProvider || body.paymentProvider || "",
    razorpay_order_id: overrides.razorpay_order_id || body.razorpay_order_id || "",
    razorpay_payment_id: overrides.razorpay_payment_id || body.razorpay_payment_id || "",
    paidAmount: numeric(overrides.paidAmount ?? body.paidAmount),
    paidAt: overrides.paidAt || body.paidAt || null,
    prescriptionFile: file ? `/uploads/prescriptions/${file.filename}` : ""
  });

  if (lead.couponCode) {
    await Coupon.updateOne({ couponCode: lead.couponCode }, { $inc: { used: 1 } });
  }

  return lead;
};

export const createBookingLead = asyncHandler(async (req, res) => {
  const lead = await createBookingLeadRecord({
    body: req.body,
    user: req.user,
    file: req.file
  });

  return res.status(201).json({
    success: true,
    message: "Booking lead saved successfully.",
    data: lead
  });
});

export const getBookingLead = asyncHandler(async (req, res) => {
  if (!dbReady()) {
    return res.status(503).json({ success: false, message: "Database is not connected." });
  }

  const query = mongoose.Types.ObjectId.isValid(req.params.id)
    ? { $or: [{ _id: req.params.id }, { bookingId: req.params.id }] }
    : { bookingId: req.params.id };
  const booking = await BookingLead.findOne({
    $and: [
      query,
      { $or: [{ userId: req.user._id }, { userId: String(req.user._id) }] }
    ]
  }).lean();

  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found." });
  }

  return res.json({ success: true, data: buildBookingDetailShape(booking) });
});
