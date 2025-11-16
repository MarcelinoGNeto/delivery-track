"use client";

import { useCallback } from "react";
import { ArrowLeft, ArrowRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Client } from "@/types/client";
import { Product } from "@/types/product";
import { Order } from "@/types/order";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface OrderPaginationProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  page: number;
  onPageChange: (page: number) => void;
  total: number;
  limit?: number;
}

export default function OrderPagination({
  selectedDate,
  onDateChange,
  page,
  onPageChange,
  total,
  limit = 10,
}: OrderPaginationProps) {
  const { user } = useAuth();
  const dateStr = selectedDate.toISOString().split("T")[0];
  const totalPages = Math.ceil(total / limit);

  const handlePrintSalesReport = useCallback(async () => {
    try {
      const [ordersRes, clientsRes, productsRes] = await Promise.all([
        fetchWithAuth(`/api/orders?date=${dateStr}&limit=1000`),
        fetchWithAuth("/api/clients"),
        fetchWithAuth("/api/products"),
      ]);

      const [{ orders }, clients, products]: [
        { orders: Order[] },
        Client[],
        Product[]
      ] = await Promise.all([
        ordersRes.json(),
        clientsRes.json(),
        productsRes.json(),
      ]);

      const totalVendas = orders.reduce(
        (sum: number, o: Order) => sum + o.totalPrice,
        0
      );

      const findClient = (id: string): string =>
        clients.find((c: Client) => c._id === id)?.name || "Cliente desconhecido";

      const findProduct = (id: string): string =>
        products.find((p: Product) => p._id === id)?.name || "Produto desconhecido";

      const html = `
        <style>
          body { font-family: monospace; margin: 0; padding: 20px; }
          h2, h3 { margin: 0; }
          .header { text-align: center; margin-bottom: 20px; }
          .order { margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
          .products { margin-left: 20px; }
        </style>

        <div class="header">
          <h2>Relatório de Vendas</h2>
          <h3>${user?.name || "Loja"}</h3>
          <p>Data: ${dateStr}</p>
          <p>Total de vendas: R$ ${totalVendas.toFixed(2)}</p>
        </div>

        ${orders
          .map((order: Order) => {
            return `
            <div class="order">
              <h3>Pedido ID: ${order._id}</h3>
              <p>Cliente: ${findClient(order.clientId)}</p>
              <div class="products">
                ${order.items
                    .map(
                    (item: Order["items"][number]) =>
                        `<p>- ${findProduct(item.productId)} | ${item.quantity}x | R$ ${(item.price * item.quantity).toFixed(2)}</p>`
                    )
                    .join("")}
                <p style="margin-top: 8px; font-weight: bold;">Total do pedido: R$ ${order.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          `;
          })
          .join("")}
      `;

      const printWindow = window.open("", "", "width=600,height=800");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    } catch (error) {
      console.error("Erro ao gerar relatório de vendas:", error);
      alert("Erro ao gerar relatório de vendas.");
    }
  }, [dateStr, user]);

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
        <input
          type="date"
          value={dateStr}
          onChange={(e) => {
            onDateChange(new Date(e.target.value));
            onPageChange(1);
          }}
          className="border rounded p-2"
        />
        <Button variant="outline" onClick={handlePrintSalesReport}>
          <Printer className="cursor-pointer" />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ArrowLeft className="mr-2" />
        </Button>
        <Button
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}