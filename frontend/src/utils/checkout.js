import { defaultCartItems } from "../data/cartData.js";
import { clearCart, getCartItems, hasStoredCart } from "./cart.js";

const CHECKOUT_KEY = "upchar_checkout";
const BOOKING_KEY = "upchar_booking_confirmation";
const FAILURE_KEY = "upchar_payment_failure";

const readStorageJson = (storage, key) => {
  if (typeof window === "undefined" || !storage) return null;

  try {
    const rawValue = storage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    storage.removeItem(key);
    return null;
  }
};

const writeStorageJson = (storage, key, value) => {
  if (typeof window === "undefined" || !storage) return;
  storage.setItem(key, JSON.stringify(value));
};

const getSessionStorage = () => (typeof window === "undefined" ? null : window.sessionStorage);

export const normalizeCheckoutItem = (item) => {
  const price = item.price ?? item.discountedPrice ?? item.finalPrice ?? 0;
  const oldPrice = item.oldPrice ?? item.originalPrice ?? item.price ?? price;
  const itemType = String(item.itemType || item.type || item.resultType || "test").toLowerCase();
  const itemId = item.itemId || item._id || item.id || item.testId || item.packageId || item.name || item.title;

  return {
    ...item,
    id: item.id || itemId,
    itemId,
    itemType,
    type: item.type || itemType,
    price,
    oldPrice,
    subtitle: item.subtitle || item.testCount || item.testsIncluded || "Health item",
    description: item.description || "Trusted diagnostic service with easy booking.",
    discount: item.discount || "Best Price",
    icon: item.icon || "TestTube2",
    color: item.color || "green",
    quantity: Math.max(1, Number(item.quantity || 1))
  };
};

export const buildOrderSummary = (items, couponDiscount = 0) => {
  const normalizedItems = Array.isArray(items) ? items : [];
  const subtotal = normalizedItems.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const discount = normalizedItems.length ? Math.floor(subtotal * 0.5) : 0;
  const safeCouponDiscount = normalizedItems.length
    ? Math.min(Number(couponDiscount || 0), Math.max(0, subtotal - discount))
    : 0;
  const totalPayable = Math.max(0, subtotal - discount - safeCouponDiscount);
  const itemCount = normalizedItems.reduce((total, item) => total + Number(item.quantity || 1), 0);

  return {
    subtotal,
    discount,
    couponDiscount: safeCouponDiscount,
    totalPayable,
    totalSavings: discount + safeCouponDiscount,
    itemCount
  };
};

export const getStoredCheckoutData = () => readStorageJson(getSessionStorage(), CHECKOUT_KEY);
export const getStoredBookingData = () => readStorageJson(getSessionStorage(), BOOKING_KEY);

export const saveCheckoutData = (items, summary, appliedCoupon = null) => {
  const checkoutItems = (Array.isArray(items) ? items : []).map(normalizeCheckoutItem);
  const checkoutSummary = summary || buildOrderSummary(checkoutItems);
  const data = { items: checkoutItems, summary: checkoutSummary, appliedCoupon, savedAt: new Date().toISOString() };
  writeStorageJson(getSessionStorage(), CHECKOUT_KEY, data);
  return data;
};

export const getCheckoutData = () => {
  const storedCheckout = getStoredCheckoutData();

  if (storedCheckout?.items?.length) {
    const items = storedCheckout.items.map(normalizeCheckoutItem);
    return { items, summary: storedCheckout.summary || buildOrderSummary(items), appliedCoupon: storedCheckout.appliedCoupon || null };
  }

  const cartItems = getCartItems().map(normalizeCheckoutItem);
  if (cartItems.length) {
    return { items: cartItems, summary: buildOrderSummary(cartItems), appliedCoupon: null };
  }

  if (!hasStoredCart()) {
    const items = defaultCartItems.map(normalizeCheckoutItem);
    return { items, summary: buildOrderSummary(items), appliedCoupon: null };
  }

  return { items: [], summary: buildOrderSummary([]), appliedCoupon: null };
};

export const customerDetails = {
  name: "",
  phone: "",
  email: "",
  address: "",
  pincode: "",
  city: "",
  collectionType: "Home Collection",
  date: "",
  timeSlot: ""
};

export const createBookingData = ({ items, summary, status = "paid", paymentMode = "UPI", paymentId, razorpayOrderId, failureReason, bookingId, bookingStatus, customer }) => ({
  bookingId: bookingId || "",
  paymentId: paymentId || "",
  razorpayOrderId: razorpayOrderId || "",
  paidOn: new Date().toLocaleString("en-IN", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
  bookingDate: new Date().toLocaleString("en-IN", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
  paymentMode,
  paymentStatus: status === "paid" ? "Paid" : status === "pending" ? "Pending" : "Failed",
  bookingStatus: bookingStatus || (status === "pending" ? "Pending Confirmation" : "Confirmed"),
  customer: customer || customerDetails,
  items: (Array.isArray(items) ? items : []).map(normalizeCheckoutItem),
  summary: summary || buildOrderSummary(items || []),
  failureReason: failureReason || "The transaction was declined by your bank."
});

export const saveBookingData = (booking) => {
  writeStorageJson(getSessionStorage(), BOOKING_KEY, booking);
  clearCart();
};

export const savePaymentFailureData = (booking) => {
  writeStorageJson(getSessionStorage(), FAILURE_KEY, booking);
};

export const getBookingData = () => {
  const storedBooking = getStoredBookingData();
  if (storedBooking?.items?.length) return storedBooking;

  const data = getCheckoutData();
  return createBookingData({ ...data, status: "paid" });
};

export const getPaymentFailureData = () => {
  const storedFailure = readStorageJson(getSessionStorage(), FAILURE_KEY);
  if (storedFailure?.items?.length) return storedFailure;

  const data = getCheckoutData();
  return createBookingData({ ...data, status: "failed" });
};
