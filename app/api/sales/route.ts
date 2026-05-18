import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const orders = await prisma.order.findMany();

    const validOrders = await prisma.order.findMany({
      where: { status: { not: "CANCELED" } },
    });

    const totalRevenue = validOrders.reduce(
      (sum, o) => sum + Number(o.totalAmount),
      0,
    );

    // Usar validOrders en todas las métricas
    const todayOrders = validOrders.filter(
      (o) => o.createdAt >= startOfDay,
    ).length;
    const monthOrders = validOrders.filter(
      (o) => o.createdAt >= startOfMonth,
    ).length;
    const completed = validOrders.filter((o) => o.status === "PAID").length;
    const pending = validOrders.filter((o) => o.status === "PENDING").length;
    const canceled = orders.filter((o) => o.status === "CANCELED").length; // este sí usa orders completo

    return NextResponse.json({
      totalRevenue,
      totalOrders: validOrders.length, 
      todayOrders,
      monthOrders,
      completed,
      pending,
      canceled,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 },
    );
  }
}
