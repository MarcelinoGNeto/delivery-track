"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

interface ClientFormProps {
  onSubmit: (data: any) => Promise<void>;
}

export default function ClientForm({ onSubmit }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { name: "", cpf: "", address: "", phone: "" },
  });

  const submitForm = async (data: any) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-2">
      <Input {...register("name")} placeholder="Nome" required />
      <Input {...register("cpf")} placeholder="CPF" required />
      <Input {...register("address")} placeholder="Endereço" />
      <Input {...register("phone")} placeholder="Telefone" />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
