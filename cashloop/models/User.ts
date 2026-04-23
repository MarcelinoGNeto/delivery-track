import { UserRole } from "@/enums/index.enum";
import mongoose, { Schema, Model, models, Types } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  role: UserRole;
  tenantId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  models.User || mongoose.model("User", UserSchema);