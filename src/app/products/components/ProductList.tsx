interface ProductListProps {
    products: any[];
  }
  
  export default function ProductList({ products }: ProductListProps) {
    if (products.length === 0)
      return <p className="text-sm text-muted-foreground">Nenhum produto cadastrado.</p>;
  
    return (
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p._id} className="border-b pb-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">{p.name}</span> — R${Number(p.price).toFixed(2)}
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </div>
              {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 object-cover rounded-md border"
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  }
  