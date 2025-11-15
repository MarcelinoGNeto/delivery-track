import mongoose, { Schema, Document } from "mongoose";

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  Pending = "pendente",
  InDelivery = "à caminho",
  Delivered = "entregue",
  Cancelled = "cancelado",
}

export enum PaymentStatus {
  Paid = "pago",
  Unpaid = "pendente",
}

export enum PaymentMethod {
  CreditCard = "cartão de crédito",
  DebitCard = "cartão de débito",
  Cash = "dinheiro",
  Pix = "pix",
}

export interface OrderDocument extends Document {
  userId?: mongoose.Types.ObjectId;
  clientId: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  createdAt: Date;
}

const OrderSchema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    clientId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Pending,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Unpaid,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
    },
  },
  { timestamps: true }
);

const OrderModel =
  mongoose.models?.Order || mongoose.model<OrderDocument>("Order", OrderSchema);

export default OrderModel;
