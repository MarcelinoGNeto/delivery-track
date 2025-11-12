"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Product } from "@/types/product";

const productSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(1, "O nome é obrigatório."),
  description: z.string().min(1, "A descrição é obrigatória."),
  price: z
    .string()
    .min(1, "O preço é obrigatório.")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Informe um preço válido.",
    }),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductEditDialogProps {
  product: Product;
  onUpdated: () => Promise<void>;
}

export default function ProductEditDialog({
  product,
  onUpdated,
}: ProductEditDialogProps) {
  const [open, setOpen] = useState(false);

const {
  register,
  handleSubmit,
  formState: { isSubmitting, errors },
  reset,
} = useForm<ProductFormData>({
  resolver: zodResolver(productSchema),
  defaultValues: {
    image: product.image || "",
    name: product.name || "",
    description: product.description || "",
    price: product.price?.toString() || "",
  },
});

  const onSubmit = async (data: ProductFormData) => {
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Falha ao atualizar o produto");

      toast.success("Produto atualizado com sucesso!");
      await onUpdated();
      setOpen(false);
      reset(data);
    } catch (error) {
        console.error("Erro ao atualizar o produto: ", error);
      toast.error("Erro ao atualizar o produto.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Editar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-2">
          <Input {...register("image")} placeholder="URL da imagem" />
          <Input {...register("name")} placeholder="Nome do produto" />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
          <Textarea {...register("description")} placeholder="Descrição" />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
          <Input
            {...register("price")}
            type="number"
            step="0.01"
            placeholder="Preço (R$)"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
