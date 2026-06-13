import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import AdminRole from "../models/AdminRole.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const dbReady = () => mongoose.connection.readyState === 1;

function signToken(user) {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function requireDatabase(res) {
  if (dbReady()) return true;
  res.status(503).json({ success: false, message: "Database is not connected." });
  return false;
}

export const register = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const { fullName, phone, email, password } = req.body;
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPhone = String(phone || "").trim();

  if (!fullName?.trim()) {
    return res.status(400).json({ success: false, message: "Full name is required." });
  }

  if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
    return res.status(400).json({ success: false, message: "Valid 10-digit phone number is required." });
  }

  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    return res.status(400).json({ success: false, message: "Valid email address is required." });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
  }

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { phone: normalizedPhone }]
  });

  if (existingUser) {
    return res.status(409).json({ success: false, message: "An account with this email or phone already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    fullName,
    phone: normalizedPhone,
    email: normalizedEmail,
    passwordHash,
    role: "customer"
  });

  return res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: {
      user: user.toSafeJSON()
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const { identifier, password } = req.body;
  const normalizedIdentifier = String(identifier || "").trim().toLowerCase();

  if (!normalizedIdentifier || !password) {
    return res.status(400).json({ success: false, message: "Email or phone and password are required." });
  }

  const user = await User.findOne({
    $or: [{ email: normalizedIdentifier }, { phone: normalizedIdentifier }]
  });

  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, message: "Invalid email/phone or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ success: false, message: "Invalid email/phone or password." });
  }

  return res.json({
    success: true,
    message: "Signed in successfully.",
    data: {
      token: signToken(user),
      user: user.toSafeJSON()
    }
  });
});

export const adminLogin = asyncHandler(async (req, res) => {
  if (!requireDatabase(res)) return;

  const username = String(req.body.username || "").trim().toLowerCase();
  const { password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username and password are required." });
  }

  const user = await User.findOne({ username, role: "admin" });

  if (!user || !user.isActive || user.accountStatus === "Suspended") {
    return res.status(401).json({ success: false, message: "Invalid username or password." });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ success: false, message: "Invalid username or password." });
  }

  const roleName = user.adminRole || "Admin";
  const adminRole = await AdminRole.findOne({ roleName }).lean();
  const safeUser = user.toSafeJSON();

  return res.json({
    success: true,
    message: "Admin signed in successfully.",
    data: {
      token: signToken(user),
      user: {
        ...safeUser,
        adminRole: roleName,
        accountStatus: user.accountStatus || "Active",
        permissions: adminRole?.pageAccess || user.permissions || {},
        featureAccess: adminRole?.featureAccess || {}
      }
    }
  });
});
