import mongoose, { Schema, models } from "mongoose";

const OrderSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product", required: true }],
  total: { type: Number, required: true },
  status: { type: String, default: "Pendente" },
});

export const Order = models.Order || mongoose.model("Order", OrderSchema);
