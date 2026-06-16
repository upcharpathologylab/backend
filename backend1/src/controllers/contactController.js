import ContactMessage from "../models/ContactMessage.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^(\+\d{1,3}\s?)?\d{10}$/;

export const createContactMessage = asyncHandler(async (req, res) => {
  const { fullName, email, phone, subject, message } = req.body;

  if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !subject?.trim() || !message?.trim()) {
    res.status(400);
    throw new Error("All fields are required.");
  }

  if (!emailPattern.test(email.trim())) {
    res.status(400);
    throw new Error("Enter a valid email address.");
  }

  if (!phonePattern.test(phone.trim())) {
    res.status(400);
    throw new Error("Enter a valid 10 digit mobile number.");
  }

  await ContactMessage.create({
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    subject: subject.trim(),
    message: message.trim()
  });

  return res.status(201).json({
    success: true,
    message: "Message sent successfully"
  });
});
