"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      {user ? (
        <>
          <h1 className="text-2xl font-bold">Seja bem vindo {user?.name}</h1>
          <Link href="/logged/dashboard" className="text-blue-600 underline">
            Go to Dashboard
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Seja bem vindo! Faça login para continuar</h1>
          <Link href="/login" className="text-blue-600 underline">
            Go to Login
          </Link>
        </>
      )}
    </div>
  );
}
