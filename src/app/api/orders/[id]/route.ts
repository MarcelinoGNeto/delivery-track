import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";

export async function PUT(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const body = await _.json();
  const updated = await Order.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ message: "Pedido não encontrado" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const deleted = await Order.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ message: "Pedido não encontrado" }, { status: 404 });
  return NextResponse.json({ message: "Pedido excluído com sucesso" });
}
