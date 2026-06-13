import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["Home", "Office", "Other"], default: "Home" },
    label: { type: String, trim: true, default: "Home" },
    name: { type: String, trim: true, default: "" },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true, default: "" },
    landmark: { type: String, trim: true, default: "" },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, trim: true, default: "India" },
    phone: { type: String, required: true, trim: true },
    isPrimary: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
