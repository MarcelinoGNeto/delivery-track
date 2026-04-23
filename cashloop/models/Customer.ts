import mongoose, { Schema, Model, models, Types } from "mongoose";

export interface ICustomer {
  tenantId: Types.ObjectId;
  name: string;
  phone: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

CustomerSchema.index({ tenantId: 1, phone: 1 }, { unique: true });

export const Customer: Model<ICustomer> =
  models.Customer || mongoose.model("Customer", CustomerSchema);