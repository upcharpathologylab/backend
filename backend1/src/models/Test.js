import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    testName: { type: String, trim: true, default: "" },
    testCode: { type: String, trim: true, default: "" },
    category: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    originalPrice: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, required: true, min: 0 },
    price: { type: Number, min: 0, default: 0 },
    finalPrice: { type: Number, min: 0, default: 0 },
    discountPercent: { type: Number, min: 0, max: 100, default: 0 },
    discount: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    testImage: { type: String, default: "" },
    icon: { type: String, default: "TestTube2" },
    color: { type: String, default: "green" },
    badge: { type: String, trim: true, default: "" },
    badgeType: { type: String, trim: true, default: "green" },
    sampleType: { type: String, trim: true, default: "" },
    reportTime: { type: String, trim: true, default: "24 hrs" },
    fastingRequired: { type: Boolean, default: false },
    homeCollection: { type: Boolean, default: true },
    rating: { type: Number, min: 0, max: 5, default: 4.6 },
    popularity: { type: Number, default: 0 },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);
