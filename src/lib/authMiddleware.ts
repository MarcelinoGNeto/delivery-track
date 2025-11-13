import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import UserModel from "@/models/User";
import { connectDB } from "./db";

const JWT_SECRET = process.env.JWT_SECRET!;

export const requireAuth = async (
  req: NextApiRequest,
  res: NextApiResponse,
  requireAdmin = false
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };

    await connectDB();
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    if (requireAdmin && user.role !== "admin") {
      return res.status(403).json({ error: "Acesso restrito ao administrador" });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).user = user;
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};
