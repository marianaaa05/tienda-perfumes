import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      id: string;
      itemId: string;
    }>;
  },
) {
  try {
    const params = await context.params;

    const orderId = Number(params.id);
    const itemId = Number(params.itemId);

    if (isNaN(orderId) || isNaN(itemId)) {
      return NextResponse.json({ error: "IDs inválidos" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 },
      );
    }

    if (order.status !== OrderStatus.PENDING) {
      return NextResponse.json(
        { error: "Solo pedidos pendientes pueden modificarse" },
        { status: 400 },
      );
    }

    const deleted = await prisma.orderItem.deleteMany({
      where: { id: itemId, orderId },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Producto no encontrado en esta orden" },
        { status: 404 },
      );
    }

    // Items restantes tras el delete
    const remainingItems = await prisma.orderItem.findMany({
      where: { orderId },
    });

    if (remainingItems.length === 0) {
      // Sin items → cancelar y poner total en 0
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.CANCELED,
          totalAmount: 0,
        },
      });
    } else {
      // Recalcular totalAmount con los items que quedan
      const newTotal = remainingItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      await prisma.order.update({
        where: { id: orderId },
        data: { totalAmount: newTotal },
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("DELETE ITEM ERROR:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
