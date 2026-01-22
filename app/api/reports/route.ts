import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const orders = await prisma.order.findMany({
    where: {
      status: "PAID",
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  let totalRevenue = 0;
  let totalCost = 0;
  let totalProfit = 0;

  const ordersReport = orders.map((order) => {
    let orderRevenue = 0;
    let orderCost = 0;

    const items = order.items.map((item) => {
      const revenue = item.price * item.quantity;
      const cost = (item.product.costPrice ?? 0) * item.quantity;

      orderRevenue += revenue;
      orderCost += cost;

      return {
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      };
    });

    const profit = orderRevenue - orderCost;

    totalRevenue += orderRevenue;
    totalCost += orderCost;
    totalProfit += profit;

    return {
      orderId: order.id,
      revenue: orderRevenue,
      cost: orderCost,
      profit,
      createdAt: order.createdAt,            
      paidAt: order.paidAt ?? order.updatedAt, 
      items,                               
    };
  });

  return NextResponse.json({
    totalRevenue,
    totalCost,
    totalProfit,
    orders: ordersReport,
  });
}
