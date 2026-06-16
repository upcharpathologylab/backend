import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    packageName: { type: String, trim: true, default: "" },
    packageCode: { type: String, trim: true, default: "" },
    category: { type: String, required: true, trim: true },
    testCount: { type: String, required: true, trim: true },
    testsIncluded: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    originalPrice: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, required: true, min: 0 },
    price: { type: Number, min: 0, default: 0 },
    finalPrice: { type: Number, min: 0, default: 0 },
    discountPercent: { type: Number, min: 0, max: 100, default: 0 },
    discount: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    packageImage: { type: String, default: "" },
    icon: { type: String, default: "Gift" },
    color: { type: String, default: "green" },
    badge: { type: String, trim: true, default: "" },
    buttonText: { type: String, trim: true, default: "Book Now" },
    buttonUrl: { type: String, trim: true, default: "/cart" },
    homeCollection: { type: Boolean, default: true },
    reportTime: { type: String, trim: true, default: "24 - 36 hrs" },
    gender: { type: String, trim: true, default: "all" },
    popularity: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
