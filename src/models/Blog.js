import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    content: { type: String, default: "", trim: true },
    category: { type: String, default: "Health Tips", trim: true },
    author: { type: String, default: "Upchar Team", trim: true },
    image: { type: String, default: "" },
    publishDate: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now },
    readTime: { type: String, default: "5 min read" },
    slug: { type: String, required: true, unique: true, trim: true },
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
