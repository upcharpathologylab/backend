import express from "express";
import { createBlog, deleteBlog, updateBlog } from "../controllers/adminController.js";
import { getBlogBySlug, getBlogs } from "../controllers/blogController.js";
import { getFeaturedBlogs } from "../controllers/homeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/featured", getFeaturedBlogs);
router.get("/:slug", getBlogBySlug);
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
