import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "@/services/transaction.service";
import { TransactionResult } from "@/types";

type TransactionPayload = {
  customerId: string;
  amount: number;
  cashbackUsed?: number;
};

export function useTransaction(token: string) {
  const queryClient = useQueryClient();

  return useMutation<
    TransactionResult,
    Error,
    TransactionPayload
  >({
    mutationFn: (payload) =>
      createTransaction(payload, token),

    onSuccess: (data, variables) => {
      // 🔄 invalida cliente (para atualizar saldo)
      queryClient.invalidateQueries({
        queryKey: ["customer", variables.customerId],
      });

      // 🔄 opcional: lista de transações
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
  });
}