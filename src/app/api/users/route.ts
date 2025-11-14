import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function verifyAdmin(req: Request) {
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
    return { error: "Token não fornecido", status: 401 };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };

    if (decoded.role !== "admin") {
      return { error: "Acesso restrito ao administrador", status: 403 };
    }

    return { ok: true, userId: decoded.userId };
  } catch {
    return { error: "Token inválido ou expirado", status: 401 };
  }
}

// GET - Listar usuários (admin apenas)
export async function GET(req: Request) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    await connectDB();
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json({ error: "Erro ao buscar usuários." }, { status: 500 });
  }
}

// POST - Criar usuário (admin apenas)
export async function POST(req: Request) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Preencha nome, email e senha." },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email já cadastrado." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role === "admin" ? "admin" : "user",
    });

    return NextResponse.json(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}

// DELETE - Excluir usuário (admin apenas)
export async function DELETE(req: Request) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // extrai o ID da URL

    if (!id) {
      return NextResponse.json({ error: "ID do usuário não fornecido." }, { status: 400 });
    }

    await connectDB();

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ message: "Usuário excluído com sucesso." }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
