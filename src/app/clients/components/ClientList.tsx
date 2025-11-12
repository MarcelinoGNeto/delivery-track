"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Client } from "../page";
import ClientEditDialog from "./ClientEditDialog";

interface ClientListProps {
  clients: Client[];
  onUpdated: () => Promise<void>;
}

export default function ClientList({ clients, onUpdated }: ClientListProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este cliente?")) return;

    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir cliente");

      toast.success("Cliente excluído com sucesso!");
      await onUpdated();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      toast.error("Erro ao excluir cliente.");
    }
  };

  return (
    <ul className="space-y-2">
      {clients.map((c) => (
        <li
          key={c._id}
          className="border rounded-md p-3 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{c.name}</p>
            <p className="text-sm text-muted-foreground">{c.email}</p>
            <p className="text-sm text-muted-foreground">{c.phone}</p>
            {c.address && (
              <p className="text-sm text-muted-foreground">{c.address}</p>
            )}
          </div>
          <div className="flex gap-2">
            <ClientEditDialog client={c} onUpdated={onUpdated} />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(c._id)}
            >
              Excluir
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
