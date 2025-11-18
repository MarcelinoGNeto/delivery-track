import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { name, phone, address, userId } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    await connectDB();
    const client = await Client.create({ name, phone, address, userId });
    return NextResponse.json(client, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Erro ao criar cliente:", error);

    if (error.code === 11000 && error.keyPattern?.phone) {
      return NextResponse.json(
        {
          error: `O telefone '${error.keyValue.phone}' já está cadastrado. Por favor, utilize outro.`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    let token: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || null;
    }

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();

    const clients = await Client.find({ userId: decoded.userId }).sort({ createdAt: -1 });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json({ error: "Erro ao buscar clientes." }, { status: 500 });
  }
}
