import express from "express";
import { getFeaturedPackages } from "../controllers/homeController.js";
import { getPackageById, getPackages } from "../controllers/listingController.js";

const router = express.Router();

router.get("/", getPackages);
router.get("/featured", getFeaturedPackages);
router.get("/:id", getPackageById);

export default router;
