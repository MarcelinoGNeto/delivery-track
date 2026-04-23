import { Customer, TransactionResult } from "@/types";

type Props = {
  result: TransactionResult;
  customer: Customer;
  onReset: () => void;
};

export function SuccessStep({ result, customer, onReset }: Props) {
  return (
    <>
      <h1 className="text-green-600 text-xl font-bold">
        Cashback gerado!
      </h1>

      <p>{customer.name}</p>

      <p>
        Cashback: R$ {result.transaction.cashbackGenerated.toFixed(2)}
      </p>

      <p>
        Saldo: R$ {result.customerBalance.toFixed(2)}
      </p>

      <button
        onClick={onReset}
        className="bg-green-600 text-white p-3"
      >
        Nova operação
      </button>
    </>
  );
}