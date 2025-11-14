"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const clientSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z.string().min(8, "O telefone é obrigatório."),
  address: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  onCreated: () => Promise<void>;
}

export default function ClientForm({ onCreated }: ClientFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const { user } = useAuth();
  
  const onSubmit = async (data: ClientFormData) => {
    try {
      const payload = { ...data, userId: user?._id };
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao criar cliente");

      toast.success("Cliente cadastrado com sucesso!");
      reset();
      await onCreated();
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      toast.error("Erro ao cadastrar cliente.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 border p-4 rounded-md">
      <Input placeholder="Nome" {...register("name")} />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Input placeholder="E-mail" {...register("email")} />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <Input placeholder="Telefone" {...register("phone")} />
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

      <Input placeholder="Endereço (opcional)" {...register("address")} />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Adicionar Cliente"}
      </Button>
    </form>
  );
}
