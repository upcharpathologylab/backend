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

const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const couponRuntimeStatus = (coupon = {}, now = new Date()) => {
  const storedStatus = coupon.status || (coupon.isActive === false ? "Inactive" : "Active");
  if (storedStatus === "Inactive") return "Inactive";

  const validFrom = parseDate(coupon.validFrom);
  const validTo = parseDate(coupon.validTo);

  if (validTo && endOfDay(validTo) < now) return "Expired";
  if (validFrom && startOfDay(validFrom) > now) return "Scheduled";
  if (storedStatus === "Expired" || storedStatus === "Scheduled") return storedStatus;
  return "Active";
};

export const isCouponUsable = (coupon = {}, subtotal = 0, now = new Date()) => {
  if (couponRuntimeStatus(coupon, now) !== "Active" || coupon.isActive === false) return false;
  if (coupon.usageLimit !== "Unlimited" && Number(coupon.used || 0) >= Number(coupon.usageLimit || 0)) return false;
  return Number(subtotal || 0) >= Number(coupon.minOrder || 0);
};

export const couponDiscountAmount = (coupon = {}, subtotal = 0) => {
  const amount = coupon.discountType === "Flat"
    ? Number(coupon.discountValue || 0)
    : Math.round((Number(subtotal || 0) * Number(coupon.discountValue || 0)) / 100);
  const capped = coupon.maxDiscount ? Math.min(amount, Number(coupon.maxDiscount || 0)) : amount;
  return Math.min(capped, Number(subtotal || 0));
};

export const couponPublicShape = (coupon = {}) => {
  const id = String(coupon._id || coupon.id || "");
  const discount = coupon.discount || (coupon.discountType === "Flat" ? `Rs. ${coupon.discountValue} OFF` : `${coupon.discountValue}% OFF`);
  const [value, ...suffixParts] = discount.split(" ");

  return {
    ...coupon,
    id,
    title: coupon.title || coupon.couponName || coupon.couponCode,
    text: coupon.description || coupon.couponName || "",
    value: value || discount,
    suffix: suffixParts.join(" ") || "OFF",
    label: coupon.applicableOn || "HEALTH OFFER",
    discount,
    validTill: coupon.validTo || "",
    minOrder: `Rs. ${Number(coupon.minOrder || 0).toLocaleString("en-IN")}`,
    badge: coupon.isBestOffer ? "Best Offer" : coupon.applicableOn || "Applicable offer",
    code: coupon.couponCode,
    color: coupon.isBestOffer ? "red" : coupon.discountType === "Flat" ? "orange" : "green",
    status: couponRuntimeStatus(coupon)
  };
};
