import mongoose from "mongoose";

const familyMemberSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true
    },
    avatar: { type: String, trim: true, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("FamilyMember", familyMemberSchema);
