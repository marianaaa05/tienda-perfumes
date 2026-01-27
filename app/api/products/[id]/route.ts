import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;     // ✅ FIX: params es Promise
    const productId = Number(id);

    const body = await req.json();
    const { id: _remove, createdAt, updatedAt, ...safeData } = body;

    const updated = await prisma.product.update({
      where: { id: productId },
      data: safeData,
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}


