"use client";

import { Order } from "@/types/order";
import React from "react";

interface Client {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
}




interface OrderReceiptProps {
  order: Order;
  client: Client;
  products: Product[];
}

export default function OrderReceipt({ order, client, products }: OrderReceiptProps) {
  const findProductName = (id: string) =>
    products.find((p) => p._id === id)?.name || "Produto não encontrado";

  const renderItems = () =>
    order.items.map((item, i) => (
      <tr key={i}>
        <td>{findProductName(item.productId)}</td>
        <td style={{ textAlign: "center" }}>{item.quantity}</td>
        <td style={{ textAlign: "right" }}>R$ {item.price.toFixed(2)}</td>
        <td style={{ textAlign: "right" }}>
          R$ {(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    ));

  return (
    <div className="receipt">
      <style>
        {`
          .receipt {
            font-family: monospace;
            width: 280px; /* tamanho típico de impressora térmica */
            padding: 10px;
          }
          .receipt h2 {
            text-align: center;
            margin-bottom: 10px;
          }
          .receipt table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
          }
          .receipt th, .receipt td {
            padding: 3px 0;
          }
          .receipt .totals {
            border-top: 1px dashed #000;
            margin-top: 5px;
            padding-top: 5px;
            text-align: right;
          }
          @media print {
            body * {
              visibility: hidden;
            }
            .receipt, .receipt * {
              visibility: visible;
            }
            .receipt {
              position: absolute;
              left: 0;
              top: 0;
            }
          }
        `}
      </style>

      <h2>Comanda</h2>
      <p>Cliente: {client.name}</p>
      <p>Data: {new Date(order.createdAt).toLocaleString()}</p>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtde</th>
            <th>Preço</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>{renderItems()}</tbody>
      </table>

      <div className="totals">
        <p>Total: R$ {order.totalPrice.toFixed(2)}</p>
        <p>Status: {order.status}</p>
        <p>Pagamento: {order.paymentStatus}</p>
      </div>
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        Obrigado pela preferência!
      </p>

      <button onClick={() => window.print()}>Imprimir Comanda</button>
    </div>
  );
}
