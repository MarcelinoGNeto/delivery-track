"use client";

import { useAuth } from "@/context/AuthContext";
import { Client } from "@/types/client";
import { Order } from "@/types/order";
import { Product } from "@/types/product";

interface OrderReceiptProps {
  order: Order;
  client: Client;
  products: Product[];
}

export default function ThermalReceipt({
  order,
  client,
  products,
}: OrderReceiptProps) {
  const { user } = useAuth(); 
  const findProductName = (id: string) =>
    products.find((p) => p._id === id)?.name || "Produto não encontrado";

  return (
    <div className="receipt">
      <style>
        {`
          .receipt {
            font-family: monospace;
            width: 80mm; /* impressora térmica padrão */
            padding: 5px;
            border: 1px solid #000;
            line-height: 1.2;
          }
          .receipt .header, .receipt .footer {
            text-align: center;
            margin-bottom: 5px;
          }
          .receipt .footer {
            margin-top: 25px;
          }
          .receipt .items {
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
            margin-top: 10px;
          }
          .receipt .item {
            display: flex;
            justify-content: space-between;
          }
          .receipt .totals {
            margin: 5px 0 5px 0;
            padding: 3px 0 3px 0;
            text-align: left;
          }
        @media print {
          @page {
            margin: 0;
            size: 80mm auto;
          }

          body {
            margin: 0;
            padding: 0;
          }

          body * {
            visibility: hidden;
          }

          .receipt, .receipt * {
            visibility: visible;
          }

          .receipt {
            position: absolute;
            top: 0;
            left: 0;
            width: 80mm;
            margin: 0;
            padding: 0;
            padding-left: 15px;
            padding-right: 15px;
            box-sizing: border-box;
          }
        }
        `}
      </style>

      <div className="header">
        <h3>*** {user?.name} ***</h3>
        <p>Cliente: {client.name}</p>
        <p>Endereço: {order.additionalAddress ? order.additionalAddress : client.address}</p>
        <p>Telefone: {client.phone}</p>
        <p>Data: {new Date(order.createdAt).toLocaleString()}</p>
        <p>Pedido ID: {order._id}</p>
      </div>

      <div className="items">
        {order.items.map((item, i) => (
          <div key={i} className="item">
            <span>
              {item.quantity}x {findProductName(item.productId)}
            </span>
            <span>R$ {(item.price).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="totals">
        <p className="text-right pb-1">Total: R$ {order.totalPrice.toFixed(2)}</p>
        <p>Pagamento: {order.paymentMethod}</p>
        <p>Status: {order.paymentStatus}</p>
      </div>

      <div className="footer">
        <p>Obrigado pela preferência!</p>
        <p>--------------------</p>
      </div>
    </div>
  );
}
