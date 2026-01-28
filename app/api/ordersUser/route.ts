import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { OrderStatus } from "@prisma/client";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json([], { status: 200 });
  }

  const orders = await prisma.order.findMany({
    where: {
      user: {
        clerkId: userId,
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json(orders);
}


