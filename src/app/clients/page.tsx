"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import ClientForm from "./components/ClientForm";
import ClientList from "./components/ClientList";
import { createClient, getClients } from "@/lib/api/clients";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);

  async function fetchClients() {
    const data = await getClients();
    setClients(data);
  }

  useEffect(() => {
    fetchClients();
  }, []);

  async function handleAddClient(formData: any) {
    await createClient(formData);
    await fetchClients();
  }

  return (
    <div className="p-6 space-y-4">
      <Card className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Cadastrar Cliente</h2>
        <ClientForm onSubmit={handleAddClient} />
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Clientes cadastrados</h2>
        <ClientList clients={clients} />
      </Card>
    </div>
  );
}
