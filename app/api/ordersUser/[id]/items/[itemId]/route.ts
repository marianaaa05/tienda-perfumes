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
  }
) {
  try {
    const params = await context.params;

    const orderId = Number(params.id);
    const itemId = Number(params.itemId);

    console.log("ORDER ID:", orderId);
    console.log("ITEM ID:", itemId);

    // Validación
    if (isNaN(orderId) || isNaN(itemId)) {
      return NextResponse.json(
        { error: "IDs inválidos" },
        { status: 400 }
      );
    }

    // Buscar orden
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // Validar estado
    if (order.status !== OrderStatus.PENDING) {
      return NextResponse.json(
        { error: "Solo pedidos pendientes pueden modificarse" },
        { status: 400 }
      );
    }

    // eliminar 
    const deleted = await prisma.orderItem.deleteMany({
      where: {
        id: itemId,
        orderId: orderId,
      },
    });

    // si no encontró item
    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Producto no encontrado en esta orden" },
        { status: 404 }
      );
    }

    // verificar si quedan items
    const remainingItems = await prisma.orderItem.count({
      where: {
        orderId: orderId,
      },
    });

    // cancelar orden vacía
    if (remainingItems === 0) {
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: OrderStatus.CANCELED,
        },
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
      { status: 500 }
    );
  }
}