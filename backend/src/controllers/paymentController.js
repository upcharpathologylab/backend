import crypto from "crypto";
import { asyncHandler } from "../middleware/asyncHandler.js";

const RAZORPAY_API_BASE_URL = "https://api.razorpay.com/v1";

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
  const authorization = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const razorpayResponse = await fetch(`${RAZORPAY_API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      notes
    })
  });

  const razorpayData = await razorpayResponse.json().catch(() => ({}));

  if (!razorpayResponse.ok) {
    const description = razorpayData?.error?.description || razorpayData?.error?.reason || "Unable to create Razorpay order.";
    throw setErrorStatus(new Error(description), razorpayResponse.status >= 500 ? 502 : 400);
  }

  return res.status(201).json({
    success: true,
    message: "Razorpay order created successfully.",
    data: {
      keyId,
      orderId: razorpayData.id,
      amount: razorpayData.amount,
      currency: razorpayData.currency,
      receipt: razorpayData.receipt,
      status: razorpayData.status
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

  return res.json({
    success: true,
    message: "Payment verified successfully.",
    data: {
      verified: true,
      orderId,
      paymentId
    }
  });
});
