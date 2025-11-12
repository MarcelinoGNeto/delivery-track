"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditOrderModal from "./EditOrderModal";
import { EditIcon, Printer } from "lucide-react";

interface OrderApi {
  _id: string;
  clientId: string;
  items: { productId: string; quantity: number; price: number }[];
  createdAt: string;
  status: "pendente" | "à caminho" | "entregue" | "cancelado";
  paymentStatus: "pago" | "pendente";
}

interface Client {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface TableOrder {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  products: string[];
  items: { productId: string; quantity: number; price: number }[];
  totalPrice: number;
  status: "pendente" | "à caminho" | "entregue" | "cancelado";
  paymentStatus: "pago" | "pendente";
}

interface OrdersTableProps {
  ordersApi: OrderApi[];
  clients: Client[];
  products: Product[];
  onUpdated: () => Promise<void>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const truncateText = (text: string, maxLength = 20) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export default function OrdersTable({
  ordersApi,
  clients,
  products,
  onUpdated,
}: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<TableOrder | null>(null);

  // 🔄 Faz o mapeamento aqui dentro
  const mappedOrders: TableOrder[] = ordersApi.map((o) => {
    const client = clients.find((c) => c._id === o.clientId);
    return {
      id: o._id,
      date: new Date(o.createdAt).toLocaleDateString("pt-BR"),
      clientId: o.clientId,
      clientName: client ? client.name : "Desconhecido",
      items: o.items,
      products: o.items.map((i) => {
        const product = products.find((p) => p._id === i.productId);
        return product ? product.name : "Produto";
      }),
      totalPrice: o.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      status: o.status,
      paymentStatus: o.paymentStatus,
    };
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data do Pedido</TableHead>
            <TableHead>Nº Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Produtos</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.date}</TableCell>
              <TableCell title={order.id}>{truncateText(order.id, 5)}</TableCell>
              <TableCell title={order.clientName}>
                {truncateText(order.clientName, 10)}
              </TableCell>
              <TableCell title={order.products.join(", ")}>
                {truncateText(order.products.join(", "), 10)}
              </TableCell>
              <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === "entregue" ? "secondary" : "destructive"
                  }
                  className={
                    order.status === "entregue" ? "bg-green-500 text-white" : ""
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={order.paymentStatus === "pago" ? "secondary" : "outline"}
                  className={
                    order.paymentStatus === "pago"
                      ? "bg-green-500 text-white"
                      : ""
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  <EditIcon size={16} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.print()}
                >
                  <Printer size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          clients={clients}
          products={products}
          onClose={() => setSelectedOrder(null)}
          onSaved={onUpdated}
        />
      )}
    </div>
  );
}
