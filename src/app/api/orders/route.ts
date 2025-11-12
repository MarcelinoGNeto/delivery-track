import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();
  const newOrder = await Order.create(data);
  return NextResponse.json(newOrder, { status: 201 });
}
