import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const orderId = Number(id);

  if (!orderId || isNaN(orderId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();
  const { status, note } = body;

  if (!status && !note) {
    return NextResponse.json(
      { error: "No hay datos para actualizar" },
      { status: 400 }
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      ...(status && { status }),
      ...(note !== undefined && { note }),
    },
  });

  return NextResponse.json(updatedOrder);
}
