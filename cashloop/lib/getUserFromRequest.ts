import { verifyToken } from "./auth";

export function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Token não enviado");
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = verifyToken(token);
    return decoded as {
      userId: string;
      tenantId: string;
      role: string;
    };
  } catch {
    throw new Error("Token inválido");
  }
}