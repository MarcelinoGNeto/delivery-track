"use client";

import { Customer } from "@/types";
import { useState } from "react";
import { useCreateCustomer } from "@/hooks/useCustomer";
import { TOKEN } from "@/constants";

type Props = {
  phone: string;
  onCreated: (customer: Customer) => void;
};

export function CreateCustomerStep({ phone, onCreated }: Props) {
  const [name, setName] = useState("");

  const { mutate, isPending, error } = useCreateCustomer(TOKEN);

  const handleCreate = () => {
    if (!name.trim()) return;

    mutate(
      { name, phone },
      {
        onSuccess: (customer) => {
          onCreated(customer);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <h1 className="text-xl font-bold">Novo cliente</h1>

      <input
        className="border p-3 rounded"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-3 rounded"
        value={phone}
        disabled
      />

      <button
        onClick={handleCreate}
        disabled={isPending || !name.trim()}
        className="bg-green-600 text-white p-3 rounded disabled:opacity-50"
      >
        {isPending ? "Criando..." : "Criar cliente"}
      </button>

      {error && (
        <p className="text-red-500 text-sm">
          {error.message}
        </p>
      )}
    </div>
  );
}