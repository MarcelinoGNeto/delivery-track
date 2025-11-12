"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import ClientForm from "./components/ClientForm";
import ClientList from "./components/ClientList";

export interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("Erro ao buscar clientes");
      const data: Client[] = await res.json();
      setClients(data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchClients();
  }, []);

  // Atualiza a lista após criação, edição ou exclusão
  const handleClientsUpdated = async () => {
    await fetchClients();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Gerenciar Clientes</h1>

      <ClientForm onCreated={handleClientsUpdated} />

      <div className="border-t pt-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando clientes...</p>
        ) : clients.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado.</p>
        ) : (
          <ClientList clients={clients} onUpdated={handleClientsUpdated} />
        )}
      </div>
    </div>
  );
}
