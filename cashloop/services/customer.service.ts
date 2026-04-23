import { Customer } from "@/types";

const BASE = "/api/customers";

function authHeader(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchCustomer(
  phone: string,
  token: string
): Promise<Customer | null> {
  const res = await fetch(`${BASE}?phone=${phone}`, {
    headers: authHeader(token),
  });

  if (!res.ok) throw new Error("Erro ao buscar cliente");

  const data = await res.json();
  return data ?? null;
}

export async function createCustomer(
  payload: { name: string; phone: string },
  token: string
): Promise<Customer> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(token),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Erro ao criar cliente");

  return res.json();
}