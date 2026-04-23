import mongoose, { Schema, Model, models, Types } from "mongoose";

export interface ITransaction {
  tenantId: Types.ObjectId;
  customerId: Types.ObjectId;
  operatorId: Types.ObjectId;

  amount: number;
  cashbackGenerated: number;
  cashbackUsed: number;

  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    operatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    cashbackGenerated: {
      type: Number,
      default: 0,
    },
    cashbackUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction: Model<ITransaction> =
  models.Transaction || mongoose.model("Transaction", TransactionSchema);