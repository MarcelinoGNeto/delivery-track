"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl w-full p-8 bg-white rounded-lg shadow-md space-y-6">
        {user ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800">
              Olá, {user.name} 👋
            </h1>
            <p className="text-gray-600">
              Acesse seu painel para acompanhar pedidos, clientes e relatórios.
            </p>
            <Link
              href="/logged/dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Ir para o Dashboard
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800">
              Bem-vindo ao Delivery Track 🚀
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Delivery Track é uma plataforma inteligente para gestão de pedidos
              de delivery. Cadastre produtos, clientes, emita comandas e acompanhe
              relatórios de vendas com facilidade.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Cadastro de produtos e clientes</li>
              <li>Emissão de pedidos e comandas</li>
              <li>Relatórios de vendas em tempo real</li>
              <li>Interface simples e eficiente</li>
            </ul>
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Acessar o sistema
            </Link>
          </>
        )}
      </div>
    </main>
  );
}