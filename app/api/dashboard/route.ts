import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const activeProducts = await prisma.product.count({
      where: { stock: { gt: 0 } },
    });

    const pendingOrders = await prisma.order.count({
      where: { status: "PENDING" },
    });

    const totalClients = await prisma.user.count();

    const totalSales = await prisma.order.aggregate({
      _sum: { totalAmount: true },
    });

    return NextResponse.json({
      activeProducts,
      pendingOrders,
      totalClients,
      totalSales: totalSales._sum.totalAmount || 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener dashboard" },
      { status: 500 }
    );
  }
}


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, items, totalAmount, paymentMethod } = await req.json();

    type OrderItem = {
      productId: number;
      quantity: number;
      price: number;
    };
    // 1️⃣ Crear la orden
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: "PENDING",
        paymentMethod: paymentMethod || "EFECTIVO",
        items: {
          create: items.map((item: OrderItem) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    // 2️⃣ Descontar stock de cada producto
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creando orden" }, { status: 500 });
  }
}
