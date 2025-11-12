"use client";

import { usePathname } from "next/navigation";

export const TitlePage = () => {
  const path = usePathname();

  const translatedPaths: { [key: string]: string } = {
    "/clients": "Clientes",
    "/products": "Produtos",
    "/orders": "Pedidos",
    "/": "Dashboard",
  };

  const pageName = path.split("/").pop();
  const pageTitle = translatedPaths[`/${pageName}`] || "Delivery Track";

  return <h1 className="text-2xl font-semibold">{pageTitle}</h1>;
};
