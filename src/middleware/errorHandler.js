export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  if (req.originalUrl?.includes("/content/images")) {
    console.error("Upload failed:", error);
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(", ")
    });
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    const limit = req.originalUrl?.includes("/profile/image") ? "4 MB" : "5 MB";
    return res.status(400).json({ success: false, message: `File must be ${limit} or smaller.` });
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong."
  });
}
