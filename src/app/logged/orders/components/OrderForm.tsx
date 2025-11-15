"use client";

import { useFieldArray, useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { Client } from "@/types/client";
import { useAuth } from "@/context/AuthContext";
import { PaymentMethod } from "@/models/Order";

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
  paymentMethod: z
    .nativeEnum(PaymentMethod)
    .refine((val) => Object.values(PaymentMethod).includes(val), {
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
      const res = await fetch("/api/orders", {
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
        <label>Cliente</label>
        <select {...register("clientId")} className="w-full border rounded p-2">
          <option value="">Selecione um cliente</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.clientId && (
          <p className="text-red-500 text-sm">{errors.clientId.message}</p>
        )}
      </div>

      {/* Itens */}
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            <select
              {...register(`items.${index}.productId`)}
              className="border rounded p-2 flex-1"
            >
              <option value="">Selecione o produto</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

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
              Remover
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
      {/* Método de pagamento */}
      <div>
        <label>Método de pagamento</label>
        <select
          {...register("paymentMethod")}
          className="w-full border rounded p-2"
        >
          <option value="">Selecione o método</option>
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
