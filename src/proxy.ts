import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isLoggedRoute = request.nextUrl.pathname.startsWith("/logged");

  if (isLoggedRoute) {
    if (!token) {
      return redirectToLogin(request);
    }

    try {
      jwt.verify(token, JWT_SECRET); // ✅ verifica validade e expiração
    } catch (err) {
      console.warn("Token inválido ou expirado:", err);
      const response = redirectToLogin(request);
      response.cookies.delete("token"); // limpa o token expirado
      response.headers.set("x-token-expired", "1"); // sinaliza para o frontend
      return response;
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/logged/:path*"],
};