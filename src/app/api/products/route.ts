import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

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
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();
    const products = await Product.find({ userId: decoded.userId }).sort({
      createdAt: -1,
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos." },
      { status: 500 }
    );
  }
}

// POST - Criar produto
export async function POST(req: Request) {
  try {
    const { image, name, description, price, userId } = await req.json();

    if (!name || !description || !price) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }
    console.log("Creating product:", {
      image,
      name,
      description,
      price,
      userId,
    });
    await connectDB();
    const product = await Product.create({
      image: image || null,
      name,
      description,
      price: parseFloat(price),
      userId,
    });
    console.log("Product created:", product);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
