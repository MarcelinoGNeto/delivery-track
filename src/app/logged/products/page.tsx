// app/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductForm, { ProductFormData } from "./components/ProductForm";
import { Product } from "@/types/product";
import ProductList from "./components/ProductList";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetchWithAuth("/api/products");
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
      const url = isEdit
        ? `/api/products/${editingProduct!._id}`
        : "/api/products";
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
    toast("Deseja realmente excluir este produto?", {
      action: {
        label: "Confirmar",
        onClick: async () => {
          try {
            const res = await fetchWithAuth(`/api/products/${id}`, {
              method: "DELETE",
            });
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
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {
          toast.info("Exclusão cancelada");
        },
      },
    });
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
                description: editingProduct.description ?? "",
                price: editingProduct.price?.toString() ?? "",
              }
            : undefined
        }
      />
      <ProductList
        products={products}
        fetchProducts={fetchProducts}
        handleDelete={handleDelete}
      />
    </div>
  );
}
