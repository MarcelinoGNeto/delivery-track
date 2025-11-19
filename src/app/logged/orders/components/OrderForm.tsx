"use client";

import {
  useFieldArray,
  useForm,
  SubmitHandler,
  Controller,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { Client } from "@/types/client";
import { useAuth } from "@/context/AuthContext";
import { Trash } from "lucide-react";
import ClientSelectCombobox from "./ClientSelect";
import ProductSelectCombobox from "./ProductSelect";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const orderSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Selecione um produto."),
        quantity: z.number().min(1, "A quantidade deve ser pelo menos 1."),
        price: z.number().min(0),
      })
    )
    .min(1, "Adicione pelo menos um produto."),
  additionalAddress: z.string().optional(),
  paymentMethod: z
    .union([
      z.literal("cartão de crédito"),
      z.literal("cartão de débito"),
      z.literal("dinheiro"),
      z.literal("pix"),
      z.literal(""),
    ])
    .refine((val) => val !== "", {
      message: "Selecione um método de pagamento.",
    }),
});

export type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  clients: Client[];
  products: Product[];
  onCreated: () => Promise<void>;
}

export default function OrderForm({
  clients,
  products,
  onCreated,
}: OrderFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      clientId: "",
      items: [{ productId: "", quantity: 1, price: 0 }],
      additionalAddress: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const items = watch("items");
  items.forEach((item, index) => {
    const product = products.find((p) => p._id === item.productId);
    if (product) {
      const total = item.quantity * product.price;
      if (item.price !== total) {
        setValue(`items.${index}.price`, total);
      }
    }
  });

  const totalPrice = items.reduce((acc, item) => acc + (item.price || 0), 0);

  const { user } = useAuth();

  const onSubmit: SubmitHandler<OrderFormData> = async (data) => {
    try {
      const payload = { ...data, totalPrice, userId: user?._id };
      const res = await fetchWithAuth("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Falha ao criar pedido.");

      toast.success("Pedido criado com sucesso!");
      await onCreated();
      reset({
        clientId: "",
        items: [{ productId: "", quantity: 1, price: 0 }],
        paymentMethod: "",
        additionalAddress: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar pedido.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Cliente */}
      <div>
        <Controller
          control={control}
          name="clientId"
          render={({ field, fieldState }) => (
            <div>
              <ClientSelectCombobox
                value={field.value}
                onChange={(val) => field.onChange(val)}
                clients={clients}
              />
              {fieldState.error && fieldState.isTouched && (
                <p className="text-red-500 text-sm">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* Itens */}
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            <Controller
              control={control}
              name={`items.${index}.productId`}
              render={({ field, fieldState }) => (
                <div className="w-full">
                  <ProductSelectCombobox
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    products={products}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Input
              type="number"
              min={1}
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              className="w-24"
            />

            <Input
              readOnly
              value={formatCurrency(items[index]?.price || 0)}
              className="w-32 bg-gray-100"
            />

            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(index)}
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}
        {errors.items && (
          <p className="text-red-500 text-sm">
            {errors.items.message as string}
          </p>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ productId: "", quantity: 1, price: 0 })}
        >
          + Adicionar item
        </Button>
      </div>
      {/* Endereço adicional */}
      <div>
        <Input
          placeholder="Entregar em outro endereço? (opcional)"
          type="text"
          {...register("additionalAddress")}
          className="w-full border rounded p-2"
        />
        {errors.additionalAddress && (
          <p className="text-red-500 text-sm">
            {errors.additionalAddress.message}
          </p>
        )}
      </div>
      {/* Método de pagamento */}
      <div>
        <select
          {...register("paymentMethod")}
          className="w-full border rounded p-2"
        >
          <option value="">Selecione o método de pagamento</option>
          <option value="cartão de crédito">Cartão de Crédito</option>
          <option value="cartão de débito">Cartão de Débito</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="pix">Pix</option>
        </select>
        {errors.paymentMethod && (
          <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>
        )}
      </div>

      {/* Total do pedido */}
      <div className="text-right font-bold text-lg">
        Total do Pedido: {formatCurrency(totalPrice)}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Salvando..." : "Criar Pedido"}
      </Button>
    </form>
  );
}
