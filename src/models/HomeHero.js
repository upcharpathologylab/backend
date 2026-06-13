import mongoose from "mongoose";

const homeHeroSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    highlightText: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    trustPoints: [
      {
        label: { type: String, required: true, trim: true },
        icon: { type: String, default: "ShieldCheck" }
      }
    ],
    buttons: [
      {
        label: { type: String, required: true, trim: true },
        href: { type: String, default: "#booking" },
        variant: { type: String, enum: ["primary", "outline"], default: "primary" }
      }
    ],
    offerText: { type: String, required: true, trim: true },
    image: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("HomeHero", homeHeroSchema);
