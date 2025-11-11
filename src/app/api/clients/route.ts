import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";

export async function GET() {
  await connectDB();
  const clients = await Client.find().sort({ createdAt: -1 });
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const data = await request.json();
  await connectDB();
  const newClient = await Client.create(data);
  return NextResponse.json(newClient);
}
