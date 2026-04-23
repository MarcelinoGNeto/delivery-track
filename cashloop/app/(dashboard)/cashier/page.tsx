"use client";

import { useState } from "react";
import { Customer, TransactionResult } from "@/types";
import { CashierStep } from "@/enums/index.enum";

import { SearchStep } from "@/features/cashier/components/SearchStep";
import { NotFoundStep } from "@/features/cashier/components/NotFoundStep";
import { CreateCustomerStep } from "@/features/cashier/components/CreateCustomerStep";
import { OperationStep } from "@/features/cashier/components/OperationStep";
import { SuccessStep } from "@/features/cashier/components/SuccessStep";

export default function CashierPage() {
  const [step, setStep] = useState<CashierStep>(
    CashierStep.SEARCH
  );

  const [phone, setPhone] = useState<string>("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [result, setResult] = useState<TransactionResult | null>(null);

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col gap-4">
      {step === CashierStep.SEARCH && (
        <SearchStep
          phone={phone}
          setPhone={setPhone}
          onFound={(customer) => {
            setCustomer(customer as unknown as Customer);
            setStep(CashierStep.OPERATION);
          }}
          onNotFound={() => setStep(CashierStep.NOT_FOUND)}
        />
      )}

      {step === CashierStep.NOT_FOUND && (
        <NotFoundStep
          phone={phone}
          onCreate={() => setStep(CashierStep.CREATE)}
          onBack={() => setStep(CashierStep.SEARCH)}
        />
      )}

      {step === CashierStep.CREATE && (
        <CreateCustomerStep
          phone={phone}
          onCreated={(customer) => {
            setCustomer(customer);
            setStep(CashierStep.OPERATION);
          }}
        />
      )}

      {step === CashierStep.OPERATION && customer && (
        <OperationStep
          customer={customer}
          onSuccess={(data) => {
            setResult(data);
            setStep(CashierStep.SUCCESS);
          }}
        />
      )}

      {step === CashierStep.SUCCESS && result && customer && (
        <SuccessStep
          result={result}
          customer={customer}
          onReset={() => {
            setStep(CashierStep.SEARCH);
            setPhone("");
            setCustomer(null);
            setResult(null);
          }}
        />
      )}
    </div>
  );
}