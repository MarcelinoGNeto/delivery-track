import router from "next/router";

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);

  const tokenExpired = res.headers.get("x-token-expired") === "1";

  if (res.status === 401 || tokenExpired) {
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  return res;
}
