'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import { OrderStatus, PaymentStatus } from '@/models/Order';
import { Client } from '@/types/client';
import OrderPagination from './components/OrderPagination';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

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
  paymentMethod: string;
}

export default function OrdersPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [ordersApi, setOrdersApi] = useState<OrderApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchAll = async () => {
    try {
      const [clientsRes, productsRes] = await Promise.all([
        fetchWithAuth('/api/clients'),
        fetchWithAuth('/api/products'),
      ]);

      if (!clientsRes.ok || !productsRes.ok)
        throw new Error('Erro ao carregar dados');

      const clientsData = await clientsRes.json();
      const productsData = await productsRes.json();

      setClients(clientsData);
      setProducts(productsData);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar dados.');
    }
  };

  const fetchOrders = async (date: Date, page: number) => {
    try {
      const dateStr = date.toISOString().split('T')[0];
      const res = await fetchWithAuth(`/api/orders?date=${dateStr}&page=${page}&limit=10`);
      if (!res.ok) throw new Error('Erro ao carregar pedidos');
      const { orders, total } = await res.json();
      setOrdersApi(orders);
      setTotalOrders(total);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar pedidos.');
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchAll();
      await fetchOrders(selectedDate, page);
      setLoading(false);
    };
    init();
  }, [page, selectedDate]);

  useEffect(() => {
    fetchOrders(selectedDate, page);
  }, [selectedDate, page]);

  const handleOrderCreated = async () => {
    await fetchAll();
    await fetchOrders(selectedDate, page);
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-6 space-y-6">
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
      <OrderPagination
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        page={page}
        onPageChange={setPage}
        total={totalOrders}
      />
    </div>
  );
}
