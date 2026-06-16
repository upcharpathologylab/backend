import express from "express";
import { getReviews } from "../controllers/homeController.js";

const router = express.Router();

router.get("/", getReviews);

export default router;
