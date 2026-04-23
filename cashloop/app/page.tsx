"use client";

import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const { data } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const res = await fetch("/api/test");
      return res.json();
    },
  });

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}