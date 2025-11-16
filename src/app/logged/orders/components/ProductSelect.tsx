"use client";

import { Product } from "@/types/product";
import { useRef, useState, useEffect } from "react";

interface ProductSelectComboboxProps {
  value: string;
  onChange: (value: string) => void;
  products: Product[];
}

export default function ProductSelectCombobox({
  value,
  onChange,
  products,
}: ProductSelectComboboxProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedProduct = products.find((p) => p._id === value);
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        if (selectedProduct) {
          setSearch(selectedProduct.name);
        } else {
          setSearch("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedProduct]);

  return (
    <div className="relative w-full" ref={ref}>
      <input
        type="text"
        placeholder="Selecione ou digite o nome do produto"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full border rounded p-2"
      />

      {open && (
        <ul className="absolute z-10 bg-white border rounded w-full max-h-48 overflow-auto shadow-md">
          {filtered.length === 0 && (
            <li className="p-2 text-gray-500">Nenhum produto encontrado</li>
          )}
          {filtered.map((p) => (
            <li
              key={p._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(p._id);
                setSearch(p.name);
                setOpen(false);
              }}
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}