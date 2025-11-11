export async function getProducts() {
    const res = await fetch("/api/products", { cache: "no-store" });
    return res.json();
  }
  
  export async function createProduct(data: any) {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  