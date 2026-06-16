import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    eventKey: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true, trim: true },
    readAt: { type: Date, default: null },
    readBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
