import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";

export async function POST(req: Request) {
  try {
    const { name, email, phone, address } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    await connectDB();
    const client = await Client.create({ name, email, phone, address });
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const clients = await Client.find().sort({ createdAt: -1 });
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json({ error: "Erro ao buscar clientes." }, { status: 500 });
  }
}
