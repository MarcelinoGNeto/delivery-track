// app/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import ProductForm, { ProductFormData } from "./components/ProductForm";
import ProductEditDialog from "./components/ProductEditDialog";

type Product = {
  _id: string;
  image?: string;
  name: string;
  description: string;
  price: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Erro ao buscar produtos");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar produtos");
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchProducts();
    };
    void load();
  }, []);

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      const isEdit = !!editingProduct;
      const url = isEdit ? `/api/products/${editingProduct!._id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        const message = result?.error || "Erro ao salvar produto";
        toast.error(message);
        throw new Error(message);
      }

      toast.success(isEdit ? "Produto atualizado" : "Produto criado");

      // Atualiza estado local sem recarregar toda a lista (ótimo UX)
      if (isEdit) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct!._id ? result : p))
        );
        setEditingProduct(null);
      } else {
        // insere no topo
        setProducts((prev) => [result, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este produto?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const result = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(result?.error || "Erro ao excluir produto");
        return;
      }

      toast.success("Produto excluído");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir produto");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <ProductForm
        onSubmit={handleSubmit}
        defaultValues={
          editingProduct
            ? {
                image: editingProduct.image || "",
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price.toString(),
              }
            : undefined
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {products.map((p) => (
          <div key={p._id} className="border rounded-lg p-4 shadow">
            {p.image && (
              <Image src={p.image} alt={p.name} className="h-40 w-full object-cover mb-2" />
            )}
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{p.description}</p>
            <p className="font-medium">R$ {Number(p.price).toFixed(2)}</p>

            <div className="flex justify-between mt-3">
              <ProductEditDialog product={p} onUpdated={fetchProducts} />
              <Button size="sm" variant="destructive" onClick={() => handleDelete(p._id)}>
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
