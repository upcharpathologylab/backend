import mongoose from "mongoose";

const bookingLeadSchema = new mongoose.Schema(
  {
    bookingId: { type: String, trim: true, unique: true, sparse: true },
    bookingType: { type: String, enum: ["Guest", "User"], default: "User", index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    customerName: { type: String, trim: true, default: "" },
    mobile: { type: String, required: true, trim: true },
    mobileNumber: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    pincode: { type: String, trim: true, default: "" },
    collectionType: { type: String, trim: true, default: "Home Collection" },
    collectionDate: { type: String, trim: true, default: "" },
    timeSlot: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    selectedTestOrPackage: { type: String, required: true, trim: true },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
    quantity: { type: Number, default: 1 },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, trim: true, default: "" },
    couponName: { type: String, trim: true, default: "" },
    couponDiscount: { type: Number, default: 0 },
    appliedCoupon: { type: mongoose.Schema.Types.Mixed, default: null },
    totalPayable: { type: Number, default: 0 },
    paymentMethod: { type: String, trim: true, default: "Pay Later" },
    paymentId: { type: String, trim: true, default: "" },
    paymentStatus: { type: String, trim: true, default: "Pending" },
    bookingStatus: { type: String, trim: true, default: "Pending Confirmation" },
    prescriptionFile: { type: String, default: "" },
    reportFile: { type: String, default: "" },
    reportUploadedAt: { type: Date, default: null },
    source: { type: String, default: "home-page" },
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new"
    }
  },
  { timestamps: true }
);

export default mongoose.model("BookingLead", bookingLeadSchema);
