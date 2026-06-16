import crypto from "crypto";
import Razorpay from "razorpay";
import { createBookingLeadRecord } from "./bookingLeadController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const error = new Error("Razorpay credentials are not configured.");
    error.statusCode = 500;
    throw error;
  }

  return { keyId, keySecret };
}

function normalizeAmountToPaise(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    const error = new Error("A valid payment amount is required.");
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
  const amount = normalizeAmountToPaise(req.body.amount);
  const currency = String(req.body.currency || "INR").toUpperCase();
  const receipt = sanitizeReceipt(req.body.receipt);
  const notes = sanitizeNotes(req.body.notes);
  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  const order = await razorpay.orders.create({ amount, currency, receipt, notes });

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
  const { keySecret } = getRazorpayCredentials();
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body;

  if (!orderId || !paymentId || !signature) {
    throw setErrorStatus(new Error("Razorpay order ID, payment ID and signature are required."), 400);
  }

  const expectedSignature = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");

  if (!timingSafeEqualString(expectedSignature, signature)) {
    throw setErrorStatus(new Error("Payment verification failed."), 400);
  }

  const bookingBody = req.body.bookingData || req.body.booking || req.body;
  const booking = await createBookingLeadRecord({
    body: {
      ...bookingBody,
      paymentMethod: bookingBody.paymentMethod || req.body.paymentMethod || "Razorpay",
      paymentId,
      source: bookingBody.source || "razorpay-checkout"
    },
    user: req.user,
    overrides: {
      paymentMethod: bookingBody.paymentMethod || req.body.paymentMethod || "Razorpay",
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
      paymentId
    }
  });

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
