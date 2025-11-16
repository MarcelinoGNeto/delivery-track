"use client";

import { Client } from "@/types/client";
import { useRef, useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

interface ClientSelectComboboxProps {
  value: string;
  onChange: (value: string) => void;
  clients: Client[];
}

export default function ClientSelectCombobox({
  value,
  onChange,
  clients,
}: ClientSelectComboboxProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedClient = clients.find((c) => c._id === value);

  useEffect(() => {
    if (selectedClient) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearch(selectedClient.name);
    } else {
      setSearch("");
    }
  }, [selectedClient]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        if (search.trim() === "") {
          onChange("");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onChange, search]);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Selecione ou digite o nome do cliente"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full border rounded p-2"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setSearch("");
              setOpen(false);
            }}
            className="text-gray-500 hover:text-red-500"
            title="Limpar seleção"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {open && (
        <ul className="absolute z-10 bg-white border rounded w-full max-h-48 overflow-auto shadow-md mt-1">
          {filtered.length === 0 && (
            <li className="p-2 text-gray-500">Nenhum cliente encontrado</li>
          )}
          {filtered.map((c) => (
            <li
              key={c._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(c._id);
                setSearch(c.name);
                setOpen(false);
              }}
            >
              {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}