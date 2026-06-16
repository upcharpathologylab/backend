import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: {
      type: String,
      required() {
        return this.role === "customer";
      },
      unique: true,
      sparse: true,
      trim: true
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profileImage: { type: String, trim: true, default: "" },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, trim: true, default: "" },
    bloodGroup: { type: String, default: "" },
    alternateNumber: { type: String, trim: true, default: "" },
    preferredLanguage: { type: String, trim: true, default: "" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    adminRole: { type: String, trim: true, default: "" },
    accountStatus: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Active" },
    permissions: { type: mongoose.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    fullName: this.fullName,
    username: this.username,
    phone: this.phone,
    email: this.email,
    profileImage: this.profileImage,
    dateOfBirth: this.dateOfBirth,
    gender: this.gender,
    bloodGroup: this.bloodGroup,
    alternateNumber: this.alternateNumber,
    preferredLanguage: this.preferredLanguage,
    role: this.role,
    adminRole: this.adminRole,
    accountStatus: this.accountStatus,
    permissions: this.permissions
  };
};

export default mongoose.model("User", userSchema);
