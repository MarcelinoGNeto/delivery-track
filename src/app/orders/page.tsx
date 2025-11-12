"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";
import { OrderStatus, PaymentStatus } from "@/models/Order";
import { Client } from "@/types/client";

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface OrderApi {
  _id: string;
  clientId: string;
  items: { productId: string; quantity: number; price: number }[];
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
}

export default function OrdersPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [ordersApi, setOrdersApi] = useState<OrderApi[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [clientsRes, productsRes, ordersRes] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/products"),
        fetch("/api/orders"),
      ]);

      if (!clientsRes.ok || !productsRes.ok || !ordersRes.ok)
        throw new Error("Erro ao carregar dados");

      const clientsData = await clientsRes.json();
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      setClients(clientsData);
      setProducts(productsData);
      setOrdersApi(ordersData);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleOrderCreated = async () => {
    await fetchAll();
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Pedidos</h1>
      <OrderForm
        clients={clients}
        products={products}
        onCreated={handleOrderCreated}
      />
      <OrderList
        orders={ordersApi}
        clients={clients}
        products={products}
        onUpdated={handleOrderCreated}
      />
      {/* <OrdersTable
        ordersApi={ordersApi}
        clients={clients}
        products={products}
        onUpdated={handleOrderCreated}
      /> */}
    </div>
  );
}
