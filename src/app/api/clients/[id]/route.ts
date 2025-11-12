import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await req.json();
    await connectDB();

    const updatedClient = await Client.findByIdAndUpdate(id, data, { new: true });
    if (!updatedClient) {
      return NextResponse.json({ error: "Cliente não encontrado." }, { status: 404 });
    }

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const deletedClient = await Client.findByIdAndDelete(id);
    if (!deletedClient) {
      return NextResponse.json({ error: "Cliente não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ message: "Cliente removido com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
