/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { Customer } from "@/models/Customer";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const session = await mongoose.startSession();

  try {
    await connectDB();

    const user = getUserFromRequest(req);

    const body = await req.json();

    const { customerId, amount, cashbackUsed = 0 } = body;

    if (!customerId || !amount) {
      return NextResponse.json(
        { message: "customerId e amount são obrigatórios" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { message: "Valor da compra deve ser maior que zero" },
        { status: 400 }
      );
    }

    session.startTransaction();

    // 🔍 busca cliente dentro do tenant
    const customer = await Customer.findOne({
      _id: customerId,
      tenantId: user.tenantId,
    }).session(session);

    if (!customer) {
      throw new Error("Cliente não encontrado");
    }

    // 💸 valida cashback disponível
    if (cashbackUsed > customer.balance) {
      throw new Error("Saldo de cashback insuficiente");
    }

    // 🧮 regra de negócio (exemplo: 10% cashback)
    const cashbackGenerated = amount * 0.1;

    // 💰 atualiza saldo
    customer.balance =
      customer.balance - cashbackUsed + cashbackGenerated;

    await customer.save({ session });

    // 🧾 cria transação
    const transaction = await Transaction.create(
      [
        {
          tenantId: user.tenantId,
          customerId,
          operatorId: user.userId,
          amount,
          cashbackGenerated,
          cashbackUsed,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return NextResponse.json({
      transaction: transaction[0],
      customerBalance: customer.balance,
    });
  } catch (error: any) {
    await session.abortTransaction();

    return NextResponse.json(
      {
        message: error.message || "Erro ao processar transação",
      },
      { status: 400 }
    );
  } finally {
    session.endSession();
  }
}