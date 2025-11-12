"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ThermalReceipt from "./ThermalReceipt";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { Client } from "@/types/client";
import { DialogDescription } from "@radix-ui/react-dialog";

interface OrderReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  client: Client;
  products: Product[];
}

export default function OrderReceiptDialog({
  open,
  onOpenChange,
  order,
  client,
  products,
}: OrderReceiptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="justify-center">
        <DialogHeader >
          <DialogTitle>Cliente - {client.name}</DialogTitle>
          <DialogDescription>
            Detalhes do pedido
          </DialogDescription>
        </DialogHeader>

        <div className="my-2">
          <ThermalReceipt order={order} client={client} products={products} />
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            Imprimir Comanda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
