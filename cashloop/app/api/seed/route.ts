import { PlanType, UserRole } from "@/enums/index.enum";
import { connectDB } from "@/lib/mongodb";
import { Tenant } from "@/models/Tenant";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  await connectDB();

  // 🔥 evitar duplicação
  const existingUser = await User.findOne({
    email: "operador@teste.com",
  });

  if (existingUser) {
    return Response.json({ message: "Seed já executado 🚀" });
  }

  // 🏢 criar tenant
  const tenant = await Tenant.create({
    name: "Empresa Teste",
    cnpj: "00000000000100",
    plan: PlanType.FREE,
  });

  // 🔐 hash da senha
  const hashedPassword = await bcrypt.hash("123456", 10);

  // 👤 criar operador
  const user = await User.create({
    email: "operador@teste.com",
    password: hashedPassword,
    role: UserRole.OPERATOR,
    tenantId: tenant._id,
  });

  return Response.json({
    message: "Seed criado com sucesso 🚀",
    tenant,
    user,
  });
}