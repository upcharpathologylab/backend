import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    couponCode: { type: String, required: true, trim: true, uppercase: true },
    couponName: { type: String, required: true, trim: true },
    title: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    type: { type: String, enum: ["Percentage", "Flat"], default: "Percentage" },
    discountType: { type: String, enum: ["Percentage", "Flat"], default: "Percentage" },
    discountValue: { type: Number, min: 0, required: true },
    discount: { type: String, trim: true, default: "" },
    minOrder: { type: Number, min: 0, default: 0 },
    maxDiscount: { type: Number, min: 0, default: 0 },
    validFrom: { type: String, trim: true, default: "" },
    validTo: { type: String, trim: true, default: "" },
    usageLimit: { type: String, trim: true, default: "Unlimited" },
    used: { type: Number, min: 0, default: 0 },
    applicableOn: { type: String, trim: true, default: "All Tests & Packages" },
    applicableItems: { type: [String], default: [] },
    isBestOffer: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive", "Scheduled", "Expired"], default: "Active" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
