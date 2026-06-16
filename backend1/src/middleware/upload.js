import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const backendRootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const uploadRootDir = path.join(backendRootDir, "uploads");
const uploadDir = path.join(uploadRootDir, "prescriptions");
const reportUploadDir = path.join(uploadRootDir, "reports");
export const contentUploadDir = path.join(uploadRootDir, "content");
export const profileUploadDir = path.join(uploadRootDir, "profiles");

fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(reportUploadDir, { recursive: true });
fs.mkdirSync(contentUploadDir, { recursive: true });
fs.mkdirSync(profileUploadDir, { recursive: true });

const extensionFromMime = (mimeType) => {
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "application/pdf") return ".pdf";
  return ".jpg";
};

const safeFileName = (name = "upload", mimeType = "") => {
  const ext = extensionFromMime(mimeType);
  const base = path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const suffix = Math.round(Math.random() * 1e9).toString(36);
  return `${Date.now()}-${suffix}-${base || "upload"}${ext}`;
};

const prescriptionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, safeFileName(file.originalname, file.mimetype));
  }
});

const contentImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(contentUploadDir, { recursive: true });
    cb(null, contentUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, safeFileName(file.originalname, file.mimetype));
  }
});

const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(reportUploadDir, { recursive: true });
    cb(null, reportUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, safeFileName(file.originalname, file.mimetype));
  }
});

const profileImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(profileUploadDir, { recursive: true });
    cb(null, profileUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, safeFileName(file.originalname, file.mimetype));
  }
});

const prescriptionTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);
const contentImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export const prescriptionUpload = multer({
  storage: prescriptionStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!prescriptionTypes.has(file.mimetype)) {
      return cb(new Error("Only JPG, PNG and PDF prescriptions are allowed."));
    }
    return cb(null, true);
  }
});

export const reportUpload = multer({
  storage: reportStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!prescriptionTypes.has(file.mimetype)) {
      return cb(new Error("Only JPG, PNG and PDF reports are allowed."));
    }
    return cb(null, true);
  }
});

export const contentImageUpload = multer({
  storage: contentImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!contentImageTypes.has(file.mimetype)) {
      const error = new Error("Only JPG, JPEG, PNG and WEBP images are allowed.");
      error.statusCode = 400;
      return cb(error);
    }
    return cb(null, true);
  }
});

export const profileImageUpload = multer({
  storage: profileImageStorage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!contentImageTypes.has(file.mimetype)) {
      const error = new Error("Only JPG, JPEG, PNG and WEBP images are allowed.");
      error.statusCode = 400;
      return cb(error);
    }
    return cb(null, true);
  }
});
