import express from "express";
import { getFeaturedTests } from "../controllers/homeController.js";
import { getTestById, getTests } from "../controllers/listingController.js";

const router = express.Router();

router.get("/", getTests);
router.get("/featured", getFeaturedTests);
router.get("/:id", getTestById);

export default router;
