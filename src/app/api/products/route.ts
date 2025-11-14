import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

// GET - Listar produtos
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json({ error: "Erro ao buscar produtos." }, { status: 500 });
  }
}

// POST - Criar produto
export async function POST(req: Request) {
  try {
    const { image, name, description, price, userId } = await req.json();

    if (!name || !description || !price) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
    }
    console.log("Creating product:", { image, name, description, price, userId });
    await connectDB();
    const product = await Product.create({
      image: image || null,
      name,
      description,
      price: parseFloat(price),
      userId
    });
    console.log("Product created:", product);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
