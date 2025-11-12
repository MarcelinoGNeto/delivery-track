"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Client } from "@/app/clients/page";

const clientSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  email: z.string().email("E-mail inválido."),
  phone: z.string().min(8, "Telefone é obrigatório."),
  address: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientEditDialogProps {
  client: Client;
  onUpdated: () => Promise<void>;
}

export default function ClientEditDialog({
  client,
  onUpdated,
}: ClientEditDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address ?? "",
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      const res = await fetch(`/api/clients/${client._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao atualizar cliente");

      toast.success("Cliente atualizado com sucesso!");
      setOpen(false);
      await onUpdated();
      reset(data);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar cliente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-2">
          <Input {...register("name")} placeholder="Nome" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <Input {...register("email")} placeholder="E-mail" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <Input {...register("phone")} placeholder="Telefone" />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

          <Input {...register("address")} placeholder="Endereço (opcional)" />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
