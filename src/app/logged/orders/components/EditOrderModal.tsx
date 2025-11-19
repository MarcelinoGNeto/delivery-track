"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { Client } from "@/types/client";
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
  status: z.string().min(1, "Selecione o status."),
  paymentStatus: z.string().min(1, "Selecione o status de pagamento."),
  paymentMethod: z.string().min(1, "Selecione o método de pagamento."),
});

export type EditOrderFormData = z.infer<typeof orderSchema>;

interface EditOrderModalProps {
  order: {
    _id: string;
    clientId: string;
    items: { productId: string; quantity: number; price: number }[];
    additionalAddress?: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
  };
  clients: Client[];
  products: Product[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}

export default function EditOrderModal({
  order,
  clients,
  products,
  onClose,
  onSaved,
}: EditOrderModalProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditOrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      clientId: order.clientId,
      items: order.items,
      status: order.status,
      additionalAddress: order.additionalAddress,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
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

  const onSubmit: SubmitHandler<EditOrderFormData> = async (data) => {
    try {
      const res = await fetchWithAuth(`/api/orders/${order._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, totalPrice }),
      });

      if (!res.ok) throw new Error("Falha ao atualizar pedido.");

      toast.success("Pedido atualizado com sucesso!");
      await onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar pedido.");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Pedido #{order._id}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Cliente */}
          <div>
            <label>Cliente</label>
            <select
              {...register("clientId")}
              className="w-full border rounded p-2"
            >
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
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 items-center"
              >
                <select
                  {...register(`items.${index}.productId`)}
                  className="col-span-5 border rounded p-2"
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
                  {...register(`items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  className="col-span-2"
                />

                <Input
                  readOnly
                  value={formatCurrency(items[index]?.price || 0)}
                  className="col-span-3 bg-gray-100"
                />

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                  className="col-span-2"
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
              <p className="text-red-500 text-sm">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label>Status do Pedido</label>
            <select
              {...register("status")}
              className="w-full border rounded p-2"
            >
              <option value="pendente">Pendente</option>
              <option value="à caminho">À caminho</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          {/* Pagamento */}
          <div>
            <label>Status do Pagamento</label>
            <select
              {...register("paymentStatus")}
              className="w-full border rounded p-2"
            >
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
            </select>
            {errors.paymentStatus && (
              <p className="text-red-500 text-sm">
                {errors.paymentStatus.message}
              </p>
            )}
          </div>

          {/* Total */}
          <div className="text-right font-bold text-lg">
            Total do Pedido: {formatCurrency(totalPrice)}
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => window.print()}>
              Imprimir Comanda
            </Button>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
