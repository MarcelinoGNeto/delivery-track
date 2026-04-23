import { useMutation } from "@tanstack/react-query";
import { fetchCustomer, createCustomer } from "@/services/customer.service";
import { Customer } from "@/types";

export function useSearchCustomer(token: string) {
  return useMutation<Customer | null, Error, string>({
    mutationFn: (phone) => fetchCustomer(phone, token),
  });
}

export function useCreateCustomer(token: string) {
  return useMutation({
    mutationFn: (data: { name: string; phone: string }) =>
      createCustomer(data, token),
  });
}