import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema(
  {
    logo: { type: String, default: "" },
    phone: { type: String, required: true, trim: true },
    whatsappNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    hours: { type: String, default: "Mon - Sun: 7:00 AM - 9:00 PM" },
    socialLinks: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true }
      }
    ],
    footerLinks: {
      company: [{ type: String }],
      services: [{ type: String }],
      support: [{ type: String }]
    }
  },
  { timestamps: true }
);

export default mongoose.model("SiteSetting", siteSettingSchema);
