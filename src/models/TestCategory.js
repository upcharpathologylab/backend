import mongoose from "mongoose";

const testCategorySchema = new mongoose.Schema(
  {
    categoryName: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    icon: { type: String, trim: true, default: "" },
    totalTests: { type: Number, min: 0, default: 0 },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("TestCategory", testCategorySchema);
