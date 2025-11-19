import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date"); // formato: YYYY-MM-DD
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = { userId: decoded.userId };

  if (dateParam) {
    const start = new Date(`${dateParam}T00:00:00.000Z`);
    const end = new Date(`${dateParam}T23:59:59.999Z`);
    query.createdAt = { $gte: start, $lte: end };
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const formattedOrders = orders.map((order) => ({
    ...order,
    createdAtBR: new Intl.DateTimeFormat("pt-BR").format(new Date(order.createdAt)),
  }));

  const total = await Order.countDocuments(query);

  return NextResponse.json({ orders: formattedOrders, total });
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();
  const newOrder = await Order.create(data);
  return NextResponse.json(newOrder, { status: 201 });
}
