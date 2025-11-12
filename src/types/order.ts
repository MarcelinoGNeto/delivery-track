import { OrderStatus, PaymentStatus } from "@/models/Order";

export interface Order {
  _id: string;
  clientId: string;
  items: OrderItem[];
  createdAt: string;
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}
