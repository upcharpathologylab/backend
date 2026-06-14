import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import bookingLeadRoutes from "./routes/bookingLeadRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import publicContentRoutes from "./routes/publicContentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { uploadRootDir } from "./middleware/upload.js";
import { ensureDefaultAdmin } from "./utils/adminSeed.js";

dotenv.config();

const app = express();
const allowedOrigins = [
  "https://upcharpathologylab.com",
  "https://www.upcharpathologylab.com",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
];
const allowedOriginSet = new Set(allowedOrigins);
const productionOriginPattern = /^https:\/\/([a-z0-9-]+\.)*upcharpathologylab\.com$/i;
const localOriginPattern = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i;

fs.mkdirSync(uploadRootDir, { recursive: true });

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOriginSet.has(origin) || productionOriginPattern.test(origin) || localOriginPattern.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadRootDir, {
  maxAge: "7d",
  immutable: true
}));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Upchar Pathology API is running." });
});

app.use("/api", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/booking-leads", bookingLeadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/content", contentRoutes);
app.use("/api", publicContentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const connected = await connectDB();
    if (connected) await ensureDefaultAdmin();

    app.listen(port, () => {
      console.log(`API server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
