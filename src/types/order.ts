import { OrderStatus, PaymentStatus } from "@/models/Order";

export interface Order {
  _id: string;
  clientId: string;
  items: OrderItem[];
  createdAt: string;
  totalPrice: number;
  additionalAddress?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}
