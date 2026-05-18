import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;     
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


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const productId = Number(id);

  if (isNaN(productId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.orderItem.deleteMany({
      where: { productId },
    }),
    prisma.product.delete({
      where: { id: productId },
    }),
  ]);

  return NextResponse.json({ ok: true, message: "Producto eliminado" });
}

