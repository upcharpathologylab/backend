import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false }
  },
  { _id: false }
);

const adminRoleSchema = new mongoose.Schema(
  {
    roleName: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, default: "" },
    pageAccess: { type: Map, of: permissionSchema, default: {} },
    featureAccess: { type: Map, of: Boolean, default: {} },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

export default mongoose.model("AdminRole", adminRoleSchema);
