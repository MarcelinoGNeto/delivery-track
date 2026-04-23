import { PlanType } from "@/enums/index.enum";
import mongoose, { Schema, Model, models } from "mongoose";

export interface ITenant {
  name: string;
  cnpj: string;
  plan: PlanType;
  theme?: {
    primary: string;
    secondary: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TenantSchema = new Schema<ITenant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    cnpj: {
      type: String,
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      default: PlanType.FREE,
    },
    theme: {
      primary: String,
      secondary: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Tenant: Model<ITenant> =
  models.Tenant || mongoose.model("Tenant", TenantSchema);