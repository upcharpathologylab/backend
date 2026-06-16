import mongoose from "mongoose";

const homeFeatureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, default: "ShieldCheck" },
    color: { type: String, default: "blue" },
    sectionType: {
      type: String,
      enum: ["whyChoose", "howItWorks", "organs", "quickCards"],
      required: true
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("HomeFeature", homeFeatureSchema);
