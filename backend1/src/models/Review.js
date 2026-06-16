import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    customerName: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    comment: { type: String, trim: true, default: "" },
    content: { type: String, trim: true, default: "" },
    testimonialContent: { type: String, trim: true, default: "" },
    image: { type: String, default: "" },
    customerPhoto: { type: String, default: "" },
    status: { type: String, enum: ["Published", "Pending", "Hidden"], default: "Published" },
    displayedOn: { type: String, trim: true, default: "Homepage" },
    reviewDate: { type: Date, default: Date.now },
    googlePlaceId: { type: String, trim: true, default: "" },
    googleReviewsUrl: { type: String, trim: true, default: "" },
    source: { type: String, trim: true, default: "Admin" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
