import mongoose from "mongoose";
import Blog from "../models/Blog.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const dbReady = () => mongoose.connection.readyState === 1;

const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const publicId = (item) => ({ ...item, id: String(item._id || item.id) });

const formatDate = (value) => {
  if (!value) return "";
  if (typeof value === "string" && Number.isNaN(Date.parse(value))) return value;
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(new Date(value));
};

export const normalizeBlogPayload = (body) => {
  const status = body.status || (body.isActive === false ? "Inactive" : "Active");
  const publishDate = body.publishDate || body.date || Date.now();
  const title = body.title || "Untitled Blog";
  const slug = slugify(body.slug || title);

  return {
    ...body,
    title,
    slug,
    shortDescription: body.shortDescription || "",
    content: body.content || "",
    category: body.category || "Health Tips",
    author: body.author || "Upchar Team",
    image: body.image || "",
    publishDate,
    date: publishDate,
    isFeatured: body.isFeatured === true || body.isFeatured === "Yes" || body.isFeatured === "Featured",
    status,
    isActive: status === "Active"
  };
};

export const blogShape = (doc) => {
  const item = publicId(doc);
  return {
    ...item,
    publishDate: item.publishDate || item.date,
    date: formatDate(item.publishDate || item.date),
    isFeatured: item.isFeatured ? "Featured" : "Latest",
    featuredLabel: item.isFeatured ? "Featured" : "Latest",
    status: item.status || (item.isActive ? "Active" : "Inactive")
  };
};

export const getBlogs = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.json({ success: true, data: [], source: "demo" });

  const blogs = await Blog.find({ isActive: true, status: "Active" }).sort({ isFeatured: -1, publishDate: -1, updatedAt: -1 }).lean();
  return res.json({ success: true, data: blogs.map(blogShape), source: "database" });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
  if (!dbReady()) return res.status(503).json({ success: false, message: "Blogs are unavailable." });

  const blog = await Blog.findOne({ slug: req.params.slug, isActive: true, status: "Active" }).lean();
  if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });

  return res.json({ success: true, data: blogShape(blog), source: "database" });
});
