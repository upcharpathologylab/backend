import express from "express";
import { createBookingLead, getBookingLead } from "../controllers/bookingLeadController.js";
import { protectUser } from "../middleware/auth.js";
import { prescriptionUpload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", protectUser, prescriptionUpload.single("prescriptionFile"), createBookingLead);
router.get("/:id", protectUser, getBookingLead);

export default router;
