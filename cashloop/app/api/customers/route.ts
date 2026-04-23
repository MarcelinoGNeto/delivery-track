import { connectDB } from "@/lib/mongodb";
import { Customer } from "@/models/Customer";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { NextRequest, NextResponse } from "next/server";


// 🔍 BUSCAR CLIENTE
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = getUserFromRequest(req);

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { message: "Telefone obrigatório" },
        { status: 400 }
      );
    }

    const customer = await Customer.findOne({
      phone,
      tenantId: user.tenantId,
    });

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { message: "Não autorizado" },
      { status: 401 }
    );
  }
}


// ➕ CRIAR CLIENTE
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = getUserFromRequest(req);

    const { name, phone } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { message: "Nome e telefone são obrigatórios" },
        { status: 400 }
      );
    }

    // 🔥 evita duplicidade
    const existing = await Customer.findOne({
      phone,
      tenantId: user.tenantId,
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const customer = await Customer.create({
      name,
      phone,
      tenantId: user.tenantId,
    });

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar cliente" },
      { status: 500 }
    );
  }
}