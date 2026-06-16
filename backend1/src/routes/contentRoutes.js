import express from "express";
import {
  getContentPages,
  getPageContent,
  savePageContent,
  uploadContentImage
} from "../controllers/contentController.js";
import { contentImageUpload } from "../middleware/upload.js";

const router = express.Router();

router.get("/pages", getContentPages);
router.get("/pages/:pageSlug", getPageContent);
router.put("/pages/:pageSlug", savePageContent);
router.post("/images", contentImageUpload.single("image"), uploadContentImage);

export default router;
