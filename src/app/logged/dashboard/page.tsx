"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart2,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderApi[]>([]);
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
      setOrders(ordersData);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <p className="p-4">Carregando dashboard...</p>;

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const totalOrders = orders.length;
  const totalClients = clients.length;
  const totalProducts = products.length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const productSales: Record<string, number> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
    });
  });

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p._id === productId);
      return {
        name: product?.name || "Produto desconhecido",
        quantity,
      };
    });

  return (
    <div className="p-6 space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">Total de pedidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">Clientes cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Produtos disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total recebido</p>
          </CardContent>
        </Card>
      </div>

      {/* Últimos pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 overflow-y-auto">
            <ul className="space-y-3">
              {recentOrders.map((order) => {
                const client = clients.find((c) => c._id === order.clientId);
                return (
                  <li key={order._id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{client?.name || "Cliente"}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">R$ {order.totalPrice.toFixed(2)}</p>
                      <div className="flex gap-1 justify-end">
                        <Badge variant="outline">Pedido: {order.status}</Badge>
                        <Badge
                          variant={order.paymentStatus === "pago" ? "secondary" : "outline"}
                        >
                          Pagamento: {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Produtos mais vendidos */}
      <Card>
        <CardHeader>
          <CardTitle>Top Produtos Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {topProducts.map((p, i) => (
              <li key={i} className="flex justify-between">
                <span>{p.name}</span>
                <span className="font-semibold">{p.quantity}x</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
