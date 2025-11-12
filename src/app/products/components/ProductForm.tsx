"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect } from "react";

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

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  defaultValues?: ProductFormData | null;
}

export default function ProductForm({ onSubmit, defaultValues }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      image: "",
      name: "",
      description: "",
      price: "",
    },
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const submitForm = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
      toast.success("Produto salvo com sucesso!");
      reset();
    } catch {
      toast.error("Erro ao salvar o produto.");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-3 max-w-md mx-auto">
      <Input {...register("image")} placeholder="URL da imagem (opcional)" />
      {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}

      <Input {...register("name")} placeholder="Nome do produto" />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Textarea {...register("description")} placeholder="Descrição" />
      {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

      <Input {...register("price")} type="number" step="0.01" placeholder="Preço (R$)" />
      {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
