import { fetchWithAuth } from "../fetchWithAuth";

export async function getClients() {
    const res = await fetchWithAuth("/api/clients", { cache: "no-store" });
    return res.json();
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export async function createClient(data: any) {
    const res = await fetchWithAuth("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  