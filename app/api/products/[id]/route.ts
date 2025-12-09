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

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }  
) {
  try {
    const { id } = await context.params;     
    const productId = Number(id);

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    // console.error("DELETE /api/products error:", error);
    alert("Error al eliminar producto, revise si hace parte de algún pedido.");
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    );
  }
}


