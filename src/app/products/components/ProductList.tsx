import { Product } from "@/types/product";
import Image from "next/image";

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum produto cadastrado.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {products.map((p) => (
        <li key={p._id} className="border-b pb-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold">{p.name}</span> — R$
              {Number(p.price).toFixed(2)}
              {p.description && (
                <p className="text-sm text-muted-foreground">{p.description}</p>
              )}
            </div>

            {p.image && (
              <Image
                src={p.image}
                alt={p.name}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-md border"
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
