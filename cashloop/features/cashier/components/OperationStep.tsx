"use client";

import { Customer, TransactionResult } from "@/types";
import { useState } from "react";
import { useTransaction } from "@/hooks/useTransaction";
import { TOKEN } from "@/constants";

type Props = {
  customer: Customer;
  onSuccess: (data: TransactionResult) => void;
};

export function OperationStep({ customer, onSuccess }: Props) {
  const [amount, setAmount] = useState<number>(0);

  const { mutate, isPending, error } = useTransaction(TOKEN);

  const handleTransaction = () => {
    if (!TOKEN) return;
    if (!amount || amount <= 0) return;

    mutate(
      {
        customerId: customer._id,
        amount,
      },
      {
        onSuccess: (data: TransactionResult) => {
          onSuccess(data);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{customer.name}</h1>

      <p className="text-lg">
        Saldo: <strong>R$ {customer.balance.toFixed(2)}</strong>
      </p>

      {!TOKEN && (
        <p className="text-red-500 text-sm">
          Usuário não autenticado
        </p>
      )}

      <input
        type="number"
        className="border rounded-md p-3"
        placeholder="Valor"
        value={amount === 0 ? "" : amount}
        onChange={(e) => {
          const value = Number(e.target.value);
          setAmount(Number.isNaN(value) ? 0 : value);
        }}
      />

      <button
        onClick={handleTransaction}
        disabled={isPending || amount <= 0 || !TOKEN}
        className="bg-primary text-white rounded-md p-3 disabled:opacity-50"
      >
        {isPending ? "Processando..." : "Finalizar"}
      </button>

      {error && (
        <span className="text-red-500 text-sm">
          {error.message}
        </span>
      )}
    </div>
  );
}