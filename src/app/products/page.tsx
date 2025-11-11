"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import { getProducts, createProduct } from "@/lib/api/products";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  async function fetchProducts() {
    const data = await getProducts();
    setProducts(data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleAddProduct(formData: any) {
    await createProduct(formData);
    await fetchProducts();
  }

  return (
    <div className="p-6 space-y-4">
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Cadastrar Produto</h2>
        <ProductForm onSubmit={handleAddProduct} />
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Produtos cadastrados</h2>
        <ProductList products={products} />
      </Card>
    </div>
  );
}
