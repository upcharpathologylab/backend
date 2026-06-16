import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment } from "../controllers/paymentController.js";
import { protectUser } from "../middleware/auth.js";

const router = express.Router();

router.use(protectUser);

router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);
router.post("/verify-payment", verifyRazorpayPayment);

export default router;
