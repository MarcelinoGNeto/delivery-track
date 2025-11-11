"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const productSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(1, "O nome é obrigatório."),
  description: z.string().min(1, "A descrição é obrigatória."),
  // mantemos price como string no form para evitar problemas com input number controlado
  price: z
    .string()
    .min(1, "O preço é obrigatório.")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Informe um preço válido.",
    }),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export default function ProductForm({ onSubmit }: ProductFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      image: "",
      name: "",
      description: "",
      price: "",
    },
  });

  const submitForm = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
      toast.success("Produto salvo com sucesso!");

      // Reset completo: campos + erros + touched
      reset(
        { image: "", name: "", description: "", price: "" },
        { keepErrors: false, keepDirty: false, keepTouched: false }
      );

      // Por garantia extra (quando algum input custom não responde ao reset),
      // setamos manualmente todos os campos também:
      setValue("image", "");
      setValue("name", "");
      setValue("description", "");
      setValue("price", "");

      // limpamos erros explicitamente
      clearErrors();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar o produto.");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-3 max-w-md mx-auto">
      <div>
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="URL da imagem (opcional)" />
          )}
        />
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
      </div>

      <div>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Nome do produto" />}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Textarea {...field} placeholder="Descrição" />}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            // mantemos type=number para melhor UX, mas armazenamos como string no RHF
            <Input {...field} type="number" step="0.01" placeholder="Preço (R$)" />
          )}
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
}
