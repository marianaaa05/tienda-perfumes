import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const orders = await prisma.order.findMany();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0
    );

    const todayOrders = orders.filter(
      (o) => o.createdAt >= startOfDay
    ).length;

    const monthOrders = orders.filter(
      (o) => o.createdAt >= startOfMonth
    ).length;

    const completed = orders.filter((o) => o.status === "PAID").length;
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const canceled = orders.filter((o) => o.status === "CANCELED").length;

    return NextResponse.json({
      totalRevenue,
      totalOrders: orders.length,
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
      { status: 500 }
    );
  }
}
