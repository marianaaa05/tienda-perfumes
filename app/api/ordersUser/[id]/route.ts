import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const orderId = Number(id);

  if (!Number.isInteger(orderId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }

  if (order.status !== OrderStatus.PENDING) {
    return NextResponse.json(
      { error: "Solo pedidos pendientes pueden cancelarse" },
      { status: 400 }
    );
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELED },
  });

  return NextResponse.json({ ok: true });
}
