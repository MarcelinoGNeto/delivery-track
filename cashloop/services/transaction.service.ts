import { apiFetch } from "@/lib/api";
import { TransactionResult } from "@/types";

export type TransactionPayload = {
  customerId: string;
  amount: number;
  cashbackUsed?: number;
};

export function createTransaction(
  payload: TransactionPayload,
  token: string
): Promise<TransactionResult> {
  return apiFetch<TransactionResult>(
    "/api/transactions",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token
  );
}