import { fetchWithAuth } from "../fetchWithAuth";

export async function getProducts() {
    const res = await fetchWithAuth("/api/products", { cache: "no-store" });
    return res.json();
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export async function createProduct(data: any) {
    const res = await fetchWithAuth("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  