import { Product } from "@/types/product";
import Image from "next/image";
import ProductEditDialog from "./ProductEditDialog";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductListProps {
  products: Product[];
  fetchProducts: () => Promise<void>;
  handleDelete: (productId: string) => void;
}

export default function ProductList({
  products,
  fetchProducts,
  handleDelete,
}: ProductListProps) {
  if (!products || products.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum produto cadastrado.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
      {products.map((p) => (
        <div key={p._id} className="border rounded-lg p-4 shadow">
          {p.image ? (
            <Image
              className="h-40 w-full object-cover mb-2"
              src={p.image}
              alt={p.name}
              height={64}
              width={64}
              loading="eager"
            />
          ) : (
            <div className="h-40 w-full flex items-center justify-center bg-gray-100 mb-2 rounded-md border">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}

          <h2 className="font-semibold">{p.name}</h2>
          <p className="text-sm text-gray-600 mb-2">{p.description}</p>
          <p className="font-medium">R$ {Number(p.price).toFixed(2)}</p>

          <div className="flex justify-between mt-3">
            <ProductEditDialog product={p} onUpdated={fetchProducts} />
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(p._id)}
            >
              Excluir
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
