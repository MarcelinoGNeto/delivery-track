"use client";

import { useRef } from "react";
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
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="justify-center">
        <DialogHeader>
          <DialogTitle>Cliente - {client.name}</DialogTitle>
          <DialogDescription>Detalhes do pedido</DialogDescription>
        </DialogHeader>

        <div className="my-2" ref={printRef}>
          <ThermalReceipt order={order} client={client} products={products} />
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handlePrint}>
            Imprimir Comanda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
