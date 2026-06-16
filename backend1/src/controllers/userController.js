import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Address from "../models/Address.js";
import BookingLead from "../models/BookingLead.js";
import Coupon from "../models/Coupon.js";
import FamilyMember from "../models/FamilyMember.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { buildBookingDetailShape } from "./bookingLeadController.js";
import { couponPublicShape, couponRuntimeStatus } from "../utils/couponUtils.js";
import {
  appointmentData,
  commonQuestions,
  savedPackages,
  supportConversations
} from "../data/accountPageData.js";

const dbReady = () => mongoose.connection.readyState === 1;

const numberValue = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const dateValue = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const statusText = (value) => String(value || "").trim().toLowerCase();

const pad2 = (value) => String(value).padStart(2, "0");

const formatDateOfBirth = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${pad2(date.getUTCDate())}/${pad2(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
};

const parseDateOfBirth = (value) => {
  const text = String(value || "").trim();
  if (!text) return null;

  const ddmmyyyy = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    if (date.getUTCFullYear() === Number(year) && date.getUTCMonth() === Number(month) - 1 && date.getUTCDate() === Number(day)) return date;
    return undefined;
  }

  const yyyymmdd = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (yyyymmdd) {
    const [, year, month, day] = yyyymmdd;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    if (date.getUTCFullYear() === Number(year) && date.getUTCMonth() === Number(month) - 1 && date.getUTCDate() === Number(day)) return date;
  }

  return undefined;
};

const normalizePhone = (value = "") => String(value).replace(/\D/g, "").slice(-10);

const generatePrescriptionId = () => `RXN${Date.now().toString().slice(-9)}`;

const profileShape = (user) => ({
  ...user.toSafeJSON(),
  dateOfBirth: formatDateOfBirth(user.dateOfBirth),
  memberSince: user.createdAt ? new Date(user.createdAt).toLocaleString("en-IN", { month: "long", year: "numeric" }) : "",
  avatarInitials: String(user.fullName || "").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
  verified: true
});

const isGeneratedReport = (booking = {}) => {
  const statuses = [booking.reportStatus, booking.status, booking.bookingStatus, booking.currentStatus].map(statusText);
  return statuses.some((status) => ["generated", "completed", "complete", "closed", "available"].includes(status));
};

const isPaidOrCompleted = (booking = {}) => {
  const statuses = [booking.paymentStatus, booking.status, booking.bookingStatus, booking.currentStatus].map(statusText);
  return statuses.some((status) => ["paid", "success", "completed", "complete", "closed"].includes(status));
};

const isUpcoming = (booking = {}) => {
  const date = dateValue(booking.appointmentDate || booking.bookingDate || booking.scheduledAt || booking.collectionDate || booking.createdAt);
  if (!date || date <= new Date()) return false;
  const status = statusText(booking.status || booking.bookingStatus || booking.currentStatus);
  return !["cancelled", "canceled", "closed", "completed", "complete"].includes(status);
};

function requireDatabase(res) {
  if (dbReady()) return true;
  res.status(503).json({ success: false, message: "Database is not connected." });
  return false;
}

const addressPayload = (body) => ({
  type: body.type || body.label || "Home",
  label: body.label || body.type || "Home",
  name: body.name || "",
  addressLine1: body.addressLine1 || body.addressLine || "",
  addressLine2: body.addressLine2 || "",
  landmark: body.landmark || "",
  city: body.city || "",
  state: body.state || "",
  pincode: body.pincode || "",
  country: body.country || "India",
  phone: body.phone || "",
  isPrimary: Boolean(body.isPrimary ?? body.primary)
});

async function ensurePrimaryAddress(userId) {
  const primaryAddress = await Address.findOne({ userId, isPrimary: true });
  if (primaryAddress) return;

  const latestAddress = await Address.findOne({ userId }).sort({ updatedAt: -1 });
  if (latestAddress) {
    latestAddress.isPrimary = true;
    await latestAddress.save();
  }
}

export const getAddresses = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const addresses = await Address.find({ userId: req.user._id }).sort({ isPrimary: -1, updatedAt: -1 });
  res.json({ success: true, data: addresses });
});

export const createAddress = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const payload = addressPayload(req.body);
  const count = await Address.countDocuments({ userId: req.user._id });

  if (!payload.addressLine1 || !payload.city || !payload.state || !payload.pincode || !payload.phone) {
    return res.status(400).json({ success: false, message: "Address, city, state, pincode and phone are required." });
  }

  if (count === 0 || payload.isPrimary) {
    await Address.updateMany({ userId: req.user._id }, { $set: { isPrimary: false } });
    payload.isPrimary = true;
  }

  const address = await Address.create({ ...payload, userId: req.user._id });
  res.status(201).json({ success: true, message: "Address added successfully.", data: address });
});

export const updateAddress = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const payload = addressPayload(req.body);
  const address = await Address.findOne({ _id: req.params.id, userId: req.user._id });

  if (!address) {
    return res.status(404).json({ success: false, message: "Address not found." });
  }

  if (payload.isPrimary) {
    await Address.updateMany({ userId: req.user._id }, { $set: { isPrimary: false } });
  }

  Object.assign(address, payload);
  await address.save();
  await ensurePrimaryAddress(req.user._id);

  res.json({ success: true, message: "Address updated successfully.", data: address });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const address = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!address) {
    return res.status(404).json({ success: false, message: "Address not found." });
  }

  if (address.isPrimary) {
    await ensurePrimaryAddress(req.user._id);
  }

  res.json({ success: true, message: "Address deleted successfully." });
});

export const makePrimaryAddress = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const address = await Address.findOne({ _id: req.params.id, userId: req.user._id });

  if (!address) {
    return res.status(404).json({ success: false, message: "Address not found." });
  }

  await Address.updateMany({ userId: req.user._id }, { $set: { isPrimary: false } });
  address.isPrimary = true;
  await address.save();

  res.json({ success: true, message: "Primary address updated successfully.", data: address });
});

const familyPayload = (body) => ({
  fullName: body.fullName || body.name || "",
  relation: body.relation || "",
  dateOfBirth: body.dateOfBirth || "",
  gender: body.gender || "",
  bloodGroup: body.bloodGroup || "",
  avatar: body.avatar || ""
});

export const getFamilyMembers = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const members = await FamilyMember.find({ userId: req.user._id }).sort({ updatedAt: -1 });
  res.json({ success: true, data: members });
});

export const createFamilyMember = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const payload = familyPayload(req.body);

  if (!payload.fullName || !payload.relation || !payload.dateOfBirth || !payload.gender || !payload.bloodGroup) {
    return res.status(400).json({ success: false, message: "Name, relation, date of birth, gender and blood group are required." });
  }

  const member = await FamilyMember.create({ ...payload, userId: req.user._id });
  res.status(201).json({ success: true, message: "Family member added successfully.", data: member });
});

export const updateFamilyMember = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const payload = familyPayload(req.body);
  const member = await FamilyMember.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!member) {
    return res.status(404).json({ success: false, message: "Family member not found." });
  }

  res.json({ success: true, message: "Family member updated successfully.", data: member });
});

export const deleteFamilyMember = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const member = await FamilyMember.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!member) {
    return res.status(404).json({ success: false, message: "Family member not found." });
  }

  res.json({ success: true, message: "Family member deleted successfully." });
});

const findByAnyId = (items, id, fields = ["id", "bookingId", "appointmentId"]) =>
  items.find((item) => fields.some((field) => item[field] === id));

const accountBookingShape = (doc) => {
  const booking = buildBookingDetailShape(doc);
  const itemNames = booking.items.map((item) => item.name).filter(Boolean).join(", ");
  const status = booking.bookingStatus === "Cancelled"
    ? "Cancelled"
    : booking.bookingStatus === "Completed"
      ? "Completed"
      : "Upcoming";
  const createdAt = doc.createdAt ? new Date(doc.createdAt) : null;
  const ageInDays = createdAt && !Number.isNaN(createdAt.getTime())
    ? Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    id: booking.id,
    _id: booking.id,
    bookingId: booking.bookingId,
    title: itemNames || doc.selectedTestOrPackage || "Booked Test / Package",
    date: booking.customer.date || booking.bookingDate,
    time: booking.customer.timeSlot,
    collection: booking.customer.collectionType,
    address: booking.customer.address,
    amount: booking.summary.totalPayable,
    paymentStatus: booking.paymentStatus,
    status,
    bookingStatus: booking.bookingStatus,
    createdAt: doc.createdAt,
    ageInDays,
    canDelete: ageInDays >= 30 && !["Completed", "Cancelled"].includes(booking.bookingStatus),
    action: "View Details"
  };
};

const userReportShape = (booking = {}) => {
  const hasReport = Boolean(booking.reportFile);
  const uploadedAt = booking.reportUploadedAt || booking.updatedAt || booking.createdAt;
  const date = uploadedAt ? new Date(uploadedAt) : null;
  const itemNames = Array.isArray(booking.items) && booking.items.length
    ? booking.items.map((item) => item.name || item.title).filter(Boolean).join(", ")
    : booking.selectedTestOrPackage || "Booked Test / Package";

  return {
    id: String(booking._id || booking.id || ""),
    title: itemNames,
    subtitle: booking.selectedTestOrPackage || "Lab report",
    bookingId: booking.bookingId || `UPCH${String(booking._id || "").slice(-9).toUpperCase()}`,
    date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-",
    time: date && !Number.isNaN(date.getTime()) ? date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "",
    status: hasReport ? "Available" : "Report Pending",
    action: hasReport ? "View / Download" : "Report Pending",
    reportFile: booking.reportFile || "",
    icon: hasReport ? "FileCheck2" : "Clock3",
    color: hasReport ? "green" : "orange"
  };
};

const userBookingQuery = (user) => {
  return {
    $or: [
      { userId: user._id },
      { userId: String(user._id) }
    ]
  };
};

export const getBookings = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;
  const bookings = await BookingLead.find(userBookingQuery(req.user)).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: bookings.map(accountBookingShape) });
});

export const getBooking = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;
  const booking = await BookingLead.findOne({
    $and: [
      userBookingQuery(req.user),
      { $or: [{ bookingId: req.params.id }, ...(mongoose.Types.ObjectId.isValid(req.params.id) ? [{ _id: req.params.id }] : [])] }
    ]
  }).lean();
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found." });
  }
  res.json({ success: true, data: buildBookingDetailShape(booking) });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;
  const query = {
    $and: [
      userBookingQuery(req.user),
      { $or: [{ bookingId: req.params.id }, ...(mongoose.Types.ObjectId.isValid(req.params.id) ? [{ _id: req.params.id }] : [])] }
    ]
  };
  const existing = await BookingLead.findOne(query).lean();

  if (!existing) {
    return res.status(404).json({ success: false, message: "Booking not found." });
  }

  const createdAt = existing.createdAt ? new Date(existing.createdAt) : null;
  const ageInDays = createdAt && !Number.isNaN(createdAt.getTime())
    ? Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (req.body?.deleteRequest && (ageInDays < 30 || ["Completed", "Cancelled"].includes(existing.bookingStatus))) {
    return res.status(400).json({ success: false, message: "Only bookings older than 30 days and not completed can be deleted." });
  }

  const booking = await BookingLead.findOneAndUpdate(
    query,
    { $set: { bookingStatus: "Cancelled" } },
    { new: true }
  ).lean();
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found." });
  }
  res.json({ success: true, message: req.body?.deleteRequest ? "Booking removed successfully." : "Booking cancelled successfully.", data: accountBookingShape(booking) });
});

export const rescheduleBooking = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;
  const booking = await BookingLead.findOneAndUpdate(
    {
      $and: [
        userBookingQuery(req.user),
        { $or: [{ bookingId: req.params.id }, ...(mongoose.Types.ObjectId.isValid(req.params.id) ? [{ _id: req.params.id }] : [])] }
      ]
    },
    { $set: { collectionDate: req.body.collectionDate || req.body.date || "", timeSlot: req.body.timeSlot || "", bookingStatus: "Sample Collection Scheduled" } },
    { new: true }
  ).lean();
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found." });
  }
  res.json({ success: true, message: "Booking rescheduled successfully.", data: buildBookingDetailShape(booking) });
});

export const getReports = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;
  const bookings = await BookingLead.find(userBookingQuery(req.user)).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: bookings.map(userReportShape) });
});

export const getReport = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;
  const booking = await BookingLead.findOne({
    $and: [
      userBookingQuery(req.user),
      { $or: [{ bookingId: req.params.id }, ...(mongoose.Types.ObjectId.isValid(req.params.id) ? [{ _id: req.params.id }] : [])] }
    ]
  }).lean();
  const report = booking ? userReportShape(booking) : null;
  if (!report) {
    return res.status(404).json({ success: false, message: "Report not found." });
  }
  res.json({ success: true, data: report });
});

export const downloadReport = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;
  const booking = await BookingLead.findOne({
    $and: [
      userBookingQuery(req.user),
      { $or: [{ bookingId: req.params.id }, ...(mongoose.Types.ObjectId.isValid(req.params.id) ? [{ _id: req.params.id }] : [])] }
    ]
  }).lean();
  if (!booking) {
    return res.status(404).json({ success: false, message: "Report not found." });
  }
  if (!booking.reportFile) {
    return res.status(404).json({ success: false, message: "Report is pending." });
  }
  res.json({ success: true, message: "Report download is ready.", data: { reportId: String(booking._id), bookingId: booking.bookingId, reportFile: booking.reportFile } });
});

export const emailReports = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Reports will be emailed shortly.", data: { email: req.body?.email || req.user.email } });
});

export const getAppointments = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: appointmentData });
});

export const getAppointment = asyncHandler(async (req, res) => {
  const appointment = findByAnyId([...appointmentData.upcoming, ...appointmentData.rows], req.params.id, ["id", "appointmentId"]);
  if (!appointment) {
    return res.status(404).json({ success: false, message: "Appointment not found." });
  }
  res.json({ success: true, data: appointment });
});

export const rescheduleAppointment = asyncHandler(async (req, res) => {
  const appointment = findByAnyId([...appointmentData.upcoming, ...appointmentData.rows], req.params.id, ["id", "appointmentId"]);
  if (!appointment) {
    return res.status(404).json({ success: false, message: "Appointment not found." });
  }
  res.json({ success: true, message: "Appointment rescheduled successfully.", data: { ...appointment, ...req.body, status: "Upcoming" } });
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = findByAnyId([...appointmentData.upcoming, ...appointmentData.rows], req.params.id, ["id", "appointmentId"]);
  if (!appointment) {
    return res.status(404).json({ success: false, message: "Appointment not found." });
  }
  res.json({ success: true, message: "Appointment cancelled successfully.", data: { ...appointment, status: "Cancelled" } });
});

export const getSavedPackages = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: savedPackages });
});

export const savePackage = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, message: "Package saved successfully.", data: { id: `saved-${Date.now()}`, ...req.body } });
});

export const deleteSavedPackage = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: "Saved package removed successfully." });
});

const liveCoupons = async () => {
  if (!dbReady()) return [];
  const coupons = await Coupon.find({ isActive: true }).sort({ sortOrder: 1, updatedAt: -1 }).lean();
  return coupons
    .filter((coupon) => couponRuntimeStatus(coupon) === "Active")
    .map((coupon) => couponPublicShape(coupon));
};

export const getOffers = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await liveCoupons() });
});

export const getCoupons = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: await liveCoupons() });
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const values = await liveCoupons();
  const coupon = values.find((item) => item.id === req.body?.couponId || item.code === String(req.body?.code || req.body?.couponCode || "").toUpperCase());
  if (!coupon) return res.status(404).json({ success: false, message: "Invalid or expired coupon code." });
  res.json({ success: true, message: "Coupon is available at checkout.", data: coupon });
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: profileShape(req.user)
  });
});

export const getProfileSummary = asyncHandler(async (req, res) => {
  const emptySummary = {
    totalBookings: 0,
    reportsGenerated: 0,
    upcomingAppointments: 0,
    totalSpent: 0
  };

  if (!dbReady()) {
    return res.json({ success: true, data: emptySummary });
  }

  const userId = req.user._id;
  const userIdText = String(userId);

  const matchUser = {
    $or: [
      { userId },
      { userId: userIdText }
    ]
  };

  const bookings = await BookingLead.find(matchUser).lean();
  const summary = bookings.reduce((totals, booking) => {
    const amount = numberValue(booking.amount ?? booking.paidAmount ?? booking.totalAmount ?? booking.finalAmount);
    return {
      totalBookings: totals.totalBookings + 1,
      reportsGenerated: totals.reportsGenerated + (isGeneratedReport(booking) ? 1 : 0),
      upcomingAppointments: totals.upcomingAppointments + (isUpcoming(booking) ? 1 : 0),
      totalSpent: totals.totalSpent + (isPaidOrCompleted(booking) ? amount : 0)
    };
  }, emptySummary);

  return res.json({ success: true, data: summary });
});

export const updateProfile = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const fullName = String(req.body.fullName || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const phone = String(req.body.phone || "").replace(/\D/g, "").slice(-10);
  const dateOfBirth = parseDateOfBirth(req.body.dateOfBirth);
  const gender = String(req.body.gender || "").trim();
  const bloodGroup = String(req.body.bloodGroup || "");
  const alternateNumber = String(req.body.alternateNumber || "").trim();
  const preferredLanguage = String(req.body.preferredLanguage || "").trim();

  if (!fullName || !email || !/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ success: false, message: "Name, email and valid 10-digit mobile number are required." });
  }

  if (dateOfBirth === undefined) {
    return res.status(400).json({ success: false, message: "Date of birth must be in DD/MM/YYYY format." });
  }

  const duplicate = await User.findOne({
    _id: { $ne: req.user._id },
    $or: [{ email }, { phone }]
  });

  if (duplicate) {
    return res.status(409).json({ success: false, message: "An account with this email or phone already exists." });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullName, email, phone, dateOfBirth, gender, bloodGroup, alternateNumber, preferredLanguage } },
    { new: true, runValidators: true }
  );

  res.json({ success: true, message: "Profile updated successfully.", data: profileShape(user) });
});

export const updateProfileImage = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please select a profile image." });
  }

  const profileImage = `/uploads/profiles/${req.file.filename}`;
  await User.findByIdAndUpdate(req.user._id, { $set: { profileImage } });

  res.json({
    success: true,
    message: "Profile photo updated successfully.",
    data: { profileImage }
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const currentPassword = String(req.body.currentPassword || "");
  const newPassword = String(req.body.newPassword || "");
  const confirmPassword = String(req.body.confirmPassword || "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: "Current password, new password and confirmation are required." });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: "New password must be at least 8 characters." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: "New password and confirmation do not match." });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const passwordMatches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!passwordMatches) {
    return res.status(400).json({ success: false, message: "Current password is incorrect." });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();

  res.json({ success: true, message: "Password updated successfully." });
});

export const updatePreferences = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Preferences updated successfully.", data: req.body });
});

export const updateSecuritySettings = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Security settings updated successfully.", data: req.body });
});

export const uploadPrescription = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Please upload a JPG, PNG or PDF prescription." });
  }

  const fullName = String(req.user.fullName || "").trim();
  const mobile = normalizePhone(req.user.phone);

  if (!fullName || !/^[6-9]\d{9}$/.test(mobile)) {
    return res.status(400).json({ success: false, message: "Your profile needs a valid name and mobile number before uploading a prescription." });
  }

  const lead = await BookingLead.create({
    bookingId: generatePrescriptionId(),
    bookingType: "User",
    userId: req.user._id,
    fullName,
    customerName: fullName,
    mobile,
    mobileNumber: mobile,
    email: req.user.email || "",
    selectedTestOrPackage: req.body.testsPackages || "Prescription Upload",
    collectionType: "Home Collection",
    paymentStatus: "Pending",
    bookingStatus: "Pending",
    source: "profile-prescription-upload",
    prescriptionFile: `/uploads/prescriptions/${req.file.filename}`
  });

  res.status(201).json({ success: true, message: "Prescription uploaded successfully.", data: lead });
});

export const getSupportTickets = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: supportConversations });
});

export const createSupportTicket = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, message: "Support ticket created successfully.", data: { id: `#SUP-${Date.now()}`, ...req.body } });
});

export const getFaqs = asyncHandler(async (_req, res) => {
  res.json({ success: true, data: commonQuestions });
});
