"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { formatPhone, unmaskPhone } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const clientSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z
    .string()
    .regex(/^\(\d{2}\) 9 \d{4}-\d{4}$/, "Formato de telefone inválido."),
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
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const { user } = useAuth();
  const phoneValue = useWatch({ control, name: "phone", defaultValue: "" });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue("phone", formatted);
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      const payload = {
        ...data,
        phone: unmaskPhone(data.phone),
        userId: user?._id,
      };

      const res = await fetchWithAuth("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result?.error || "Erro ao cadastrar cliente.");
        return;
      }

      toast.success("Cliente cadastrado com sucesso!");
      reset();
      await onCreated();
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      toast.error("Erro ao cadastrar cliente.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-2 border p-4 rounded-md"
    >
      <Input placeholder="Nome" {...register("name")} />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message}</p>
      )}

      <Input placeholder="E-mail" {...register("email")} />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}

      <Input
        placeholder="Telefone"
        type="tel"
        value={phoneValue}
        onChange={handlePhoneChange}
      />
      {errors.phone && (
        <p className="text-red-500 text-sm">{errors.phone.message}</p>
      )}

      <Input placeholder="Endereço (opcional)" {...register("address")} />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Salvando..." : "Adicionar Cliente"}
      </Button>
    </form>
  );
}