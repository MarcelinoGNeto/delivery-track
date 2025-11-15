"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditIcon } from "lucide-react";
import EditOrderModal from "./EditOrderModal";
import OrderReceiptDialog from "./OrderReceiptDialog";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { Client } from "@/types/client";

interface OrderListProps {
  orders: Order[];
  clients: Client[];
  products: Product[];
  onUpdated: () => Promise<void>;
}

export default function OrderList({
  orders,
  clients,
  products,
  onUpdated,
}: OrderListProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);

  if (orders.length === 0)
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum pedido cadastrado.
      </p>
    );

  const findClientName = (id: string) =>
    clients.find((c) => c._id === id)?.name || "Cliente não encontrado";

  const findProductName = (id: string) =>
    products.find((p) => p._id === id)?.name || "Produto não encontrado";

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order._id} className="border rounded-lg shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{findClientName(order.clientId)}</h3>
                <p className="text-sm text-muted-foreground">
                  Criado em: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOrderToEdit(order)}
                >
                  <EditIcon size={16} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  Visualizar / Imprimir
                </Button>
              </div>
            </div>

            <ul className="text-sm text-muted-foreground space-y-1">
              {order.items.map((item, i) => (
                <li key={i}>
                  {findProductName(item.productId)} — {item.quantity}x
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-sm">
              <p className="text-muted-foreground">Método de pagamento:</p>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge
                  variant={order.status === "entregue" ? "secondary" : "destructive"}
                  className={order.status === "entregue" ? "bg-green-500 text-white" : ""}
                >
                  Pedido: {order.status}
                </Badge>
                <Badge
                  variant={order.paymentStatus === "pago" ? "secondary" : "outline"}
                  className={order.paymentStatus === "pago" ? "bg-green-500 text-white" : ""}
                >
                  Pagamento: {order.paymentStatus}
                </Badge>
              </div>
              <p className="font-semibold">Total: R$ {order.totalPrice.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Modal de edição */}
      {orderToEdit && (
        <EditOrderModal
          order={orderToEdit}
          clients={clients}
          products={products}
          onClose={() => setOrderToEdit(null)}
          onSaved={onUpdated}
        />
      )}

      {/* Modal de impressão */}
      {selectedOrder && (
        <OrderReceiptDialog
          open={!!selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
          order={selectedOrder}
          client={clients.find((c) => c._id === selectedOrder.clientId)!}
          products={products}
        />
      )}
    </div>
  );
}
