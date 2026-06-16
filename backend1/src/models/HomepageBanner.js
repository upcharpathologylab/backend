import mongoose from "mongoose";

const homepageBannerSchema = new mongoose.Schema(
  {
    bannerTitle: { type: String, required: true, trim: true },
    bannerDescription: { type: String, trim: true, default: "" },
    bannerImage: { type: String, default: "" },
    headingLine1: { type: String, trim: true, default: "" },
    headingHighlightText: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    feature1: { type: String, trim: true, default: "" },
    feature2: { type: String, trim: true, default: "" },
    feature3: { type: String, trim: true, default: "" },
    feature4: { type: String, trim: true, default: "" },
    primaryButtonText: { type: String, trim: true, default: "Book Test Now" },
    primaryButtonUrl: { type: String, trim: true, default: "#booking" },
    secondaryButtonText: { type: String, trim: true, default: "View Packages" },
    secondaryButtonUrl: { type: String, trim: true, default: "#packages" },
    offerText: { type: String, trim: true, default: "" },
    offerHighlightText: { type: String, trim: true, default: "" },
    position: { type: String, enum: ["Top Slider", "Below Slider", "Middle Banner", "Bottom Banner"], default: "Top Slider" },
    linkUrl: { type: String, trim: true, default: "/" },
    buttonText: { type: String, trim: true, default: "Book Now" },
    startDate: { type: String, trim: true, default: "" },
    endDate: { type: String, trim: true, default: "" },
    sortOrder: { type: Number, default: 0 },
    addedOn: { type: String, trim: true, default: "" },
    addedBy: { type: String, trim: true, default: "Admin User" },
    status: { type: String, enum: ["Active", "Inactive", "Archived"], default: "Active" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("HomepageBanner", homepageBannerSchema);
