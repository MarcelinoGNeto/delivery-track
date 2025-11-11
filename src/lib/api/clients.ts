export async function getClients() {
    const res = await fetch("/api/clients", { cache: "no-store" });
    return res.json();
  }
  
  export async function createClient(data: any) {
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  