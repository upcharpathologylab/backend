import crypto from "crypto";
import Razorpay from "razorpay";
import BookingLead from "../models/BookingLead.js";
import Coupon from "../models/Coupon.js";
import Package from "../models/Package.js";
import Test from "../models/Test.js";
import { createBookingLeadRecord } from "./bookingLeadController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { couponDiscountAmount, isCouponUsable } from "../utils/couponUtils.js";

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.KEY_SECRET;

  if (!keyId || !keySecret) {
    const error = new Error("Razorpay credentials are not configured.");
    error.statusCode = 500;
    throw error;
  }

  return { keyId, keySecret };
}

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

function normalizeAmountToPaise(amount, message = "A valid payment amount is required.") {
  const numericAmount = numeric(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }

  return Math.round(numericAmount * 100);
}

function sanitizeReceipt(receipt) {
  const value = String(receipt || "").trim();
  return value ? value.slice(0, 40) : `upchar_${Date.now()}`;
}

function sanitizeNotes(notes = {}) {
  if (!notes || typeof notes !== "object" || Array.isArray(notes)) return {};

  return Object.entries(notes).reduce((safeNotes, [key, value]) => {
    if (value === undefined || value === null || value === "") return safeNotes;
    safeNotes[String(key).slice(0, 30)] = typeof value === "object" ? JSON.stringify(value).slice(0, 250) : String(value).slice(0, 250);
    return safeNotes;
  }, {});
}

function getBookingBody(req) {
  return req.body.bookingData || req.body.booking || req.body;
}

function getItemIdentity(item = {}) {
  return {
    id: String(item.itemId || item._id || item.id || item.testId || item.packageId || "").trim(),
    type: String(item.itemType || item.type || item.resultType || "").trim().toLowerCase(),
    name: String(item.name || item.title || item.testName || item.packageName || "").trim().toLowerCase()
  };
}

function catalogPrice(record = {}) {
  return numeric(record.finalPrice || record.discountedPrice || record.price || record.originalPrice);
}

async function calculateBookingAmount(bookingBody = {}, user) {
  let items = parseJson(bookingBody.items ?? bookingBody.cartItems ?? bookingBody.orderItems ?? bookingBody.selectedItems, []);
  const appliedCoupon = parseJson(bookingBody.appliedCoupon, null);

  if ((!Array.isArray(items) || !items.length) && bookingBody.itemId) {
    items = [{
      itemId: bookingBody.itemId,
      itemType: bookingBody.itemType || bookingBody.type,
      name: bookingBody.name || bookingBody.title,
      quantity: bookingBody.quantity || 1
    }];
  }

  if ((!Array.isArray(items) || !items.length) && bookingBody.bookingId) {
    const existingBooking = await BookingLead.findOne({ bookingId: bookingBody.bookingId, userId: user?._id }).lean();
    if (existingBooking) {
      items = Array.isArray(existingBooking.items) ? existingBooking.items : [];
    }
  }

  if (!Array.isArray(items) || !items.length) {
    throw setErrorStatus(new Error("Selected test or package is required before payment."), 400);
  }

  const [tests, packages] = await Promise.all([
    Test.find({ isActive: { $ne: false }, status: { $ne: "Inactive" } }).select("name testName testCode finalPrice discountedPrice price originalPrice").lean(),
    Package.find({ isActive: { $ne: false }, status: { $ne: "Inactive" } }).select("name packageName packageCode finalPrice discountedPrice price originalPrice").lean()
  ]);
  const byId = { test: new Map(), package: new Map(), all: new Map() };
  const byName = { test: new Map(), package: new Map(), all: new Map() };

  const addCatalogRecord = (record, type) => {
    const value = {
      type,
      price: catalogPrice(record),
      name: record.name || record.testName || record.packageName || "Selected Item"
    };
    [record._id, record.id, record.testCode, record.packageCode].filter(Boolean).forEach((id) => {
      byId[type].set(String(id), value);
      byId.all.set(String(id), value);
    });
    [record.name, record.testName, record.packageName].filter(Boolean).forEach((name) => {
      byName[type].set(String(name).trim().toLowerCase(), value);
      byName.all.set(String(name).trim().toLowerCase(), value);
    });
  };

  tests.forEach((record) => addCatalogRecord(record, "test"));
  packages.forEach((record) => addCatalogRecord(record, "package"));

  const subtotal = items.reduce((total, item) => {
    const identity = getItemIdentity(item);
    const type = identity.type === "package" ? "package" : identity.type === "test" ? "test" : "all";
    const catalogItem =
      (identity.id && (byId[type].get(identity.id) || byId.all.get(identity.id))) ||
      (identity.name && (byName[type].get(identity.name) || byName.all.get(identity.name)));

    if (!catalogItem || catalogItem.price <= 0) {
      const error = new Error(`Unable to verify price for ${item.name || item.title || "selected item"}.`);
      error.statusCode = 400;
      throw error;
    }

    return total + catalogItem.price * Math.max(1, numeric(item.quantity, 1));
  }, 0);

  const cartDiscount = items.length ? Math.floor(subtotal * 0.5) : 0;
  let couponDiscount = 0;
  const couponCode = String(bookingBody.couponCode || appliedCoupon?.couponCode || "").trim().toUpperCase();
  const couponBaseAmount = Math.max(0, subtotal - cartDiscount);

  if (couponCode) {
    const coupon = await Coupon.findOne({ couponCode }).lean();

    if (!coupon || !isCouponUsable(coupon, subtotal)) {
      throw setErrorStatus(new Error("Invalid or expired coupon code."), 400);
    }

    if (Array.isArray(coupon.applicableItems) && coupon.applicableItems.length) {
      const allowed = coupon.applicableItems.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
      const hasApplicableItem = items.some((item) => allowed.includes(String(item.name || item.title || item.testName || item.packageName || "").trim().toLowerCase()));
      if (!hasApplicableItem) {
        throw setErrorStatus(new Error("Coupon is not applicable to selected tests or packages."), 400);
      }
    }

    couponDiscount = Math.min(couponDiscountAmount(coupon, subtotal), couponBaseAmount);
  }

  const totalPayable = Math.max(0, subtotal - cartDiscount - couponDiscount);
  const amountPaise = normalizeAmountToPaise(totalPayable, "Unable to calculate a valid booking amount.");

  return {
    amount: amountPaise / 100,
    amountPaise,
    subtotal,
    discount: cartDiscount,
    couponDiscount,
    items
  };
}

function setErrorStatus(error, fallbackStatusCode) {
  if (error.statusCode) {
    return error;
  }

  error.statusCode = fallbackStatusCode;
  return error;
}

function timingSafeEqualString(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { keyId, keySecret } = getRazorpayCredentials();
  const bookingBody = getBookingBody(req);
  const { amountPaise } = await calculateBookingAmount(bookingBody, req.user);
  const currency = String(req.body.currency || "INR").toUpperCase();
  const receipt = sanitizeReceipt(req.body.receipt);
  const notes = sanitizeNotes(req.body.notes);
  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await razorpay.orders.create({ amount: amountPaise, currency, receipt, notes });

  return res.status(201).json({
    success: true,
    message: "Razorpay order created successfully.",
    data: {
      keyId,
      key_id: keyId,
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status
    }
  });
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { keyId, keySecret } = getRazorpayCredentials();
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;

  if (!orderId || !paymentId || !signature) {
    throw setErrorStatus(new Error("Razorpay order ID, payment ID and signature are required."), 400);
  }

  const expectedSignature = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");

  if (!timingSafeEqualString(expectedSignature, signature)) {
    throw setErrorStatus(new Error("Payment verification failed."), 400);
  }

  const bookingBody = req.body.bookingData || req.body.booking || req.body;
  const { amount, amountPaise, subtotal, discount, couponDiscount } = await calculateBookingAmount(bookingBody, req.user);
  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await razorpay.orders.fetch(orderId);

  if (numeric(order?.amount) !== amountPaise) {
    throw setErrorStatus(new Error("Payment amount verification failed."), 400);
  }

  const paymentFields = {
    paymentMethod: bookingBody.paymentMethod || req.body.paymentMethod || "Razorpay",
    paymentStatus: "Paid",
    bookingStatus: "Confirmed",
    paymentProvider: "Razorpay",
    paymentId,
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    paidAmount: amount,
    paidAt: new Date(),
    totalPayable: amount
  };
  let booking = null;
  const bookingId = bookingBody.bookingId || req.body.bookingId;

  if (bookingId) {
    booking = await BookingLead.findOneAndUpdate(
      { bookingId, userId: req.user._id },
      { $set: paymentFields },
      { new: true }
    );
  }

  if (!booking) {
    booking = await createBookingLeadRecord({
      body: {
        ...bookingBody,
        totalPayable: amount,
        subtotal,
        discount,
        couponDiscount,
        summary: JSON.stringify({
          ...parseJson(bookingBody.summary, {}),
          subtotal,
          discount,
          totalSavings: discount + couponDiscount,
          couponDiscount,
          totalPayable: amount
        }),
        paymentMethod: paymentFields.paymentMethod,
        paymentId,
        source: bookingBody.source || "razorpay-checkout"
      },
      user: req.user,
      overrides: paymentFields
    });
  }

  return res.json({
    success: true,
    message: "Payment verified successfully.",
    data: {
      verified: true,
      orderId,
      paymentId,
      booking
    }
  });
});
