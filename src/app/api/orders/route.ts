import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
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
  const orders = await Order.find({ userId: decoded.userId }).sort({
    createdAt: -1,
  });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();
  const newOrder = await Order.create(data);
  return NextResponse.json(newOrder, { status: 201 });
}
