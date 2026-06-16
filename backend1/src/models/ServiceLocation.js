import mongoose from "mongoose";

const serviceLocationSchema = new mongoose.Schema(
  {
    centerName: { type: String, required: true, trim: true },
    fullAddress: { type: String, required: true, trim: true },
    areaLabel: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    pincode: { type: String, trim: true, default: "" },
    latitude: { type: Number, min: -90, max: 90, default: null },
    longitude: { type: Number, min: -180, max: 180, default: null },
    googleMapEmbedUrl: { type: String, trim: true, default: "" },
    googleDirectionUrl: { type: String, trim: true, default: "" },
    googlePlaceUrl: { type: String, trim: true, default: "" },
    openingTime: { type: String, trim: true, default: "" },
    closingTime: { type: String, trim: true, default: "" },
    openStatusText: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("ServiceLocation", serviceLocationSchema);
