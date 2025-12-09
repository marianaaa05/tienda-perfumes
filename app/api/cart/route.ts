// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const { productId, quantity } = await req.json();

//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!product) {
//       return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
//     }

//     // Validar stock
//     if (product.stock < quantity) {
//       return NextResponse.json({ error: "Stock insuficiente" }, { status: 400 });
//     }

//     // Restar stock
//     await prisma.product.update({
//       where: { id: productId },
//       data: { stock: product.stock - quantity },
//     });

//     return NextResponse.json({ message: "Stock actualizado" });
//   } catch (error) {
//     console.error("❌ Error en add-to-cart:", error);
//     return NextResponse.json(
//       { error: "Error al agregar al carrito" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    // si no está logueado → devolver carrito vacío
    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    // buscar carrito en BD
    const cart = await prisma.order.findUnique({
      where: { userId },
      include: { items: true },
    });

    return NextResponse.json({
      items: cart?.items ?? [],
    });
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { productId, quantity } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId es requerido" },
        { status: 400 }
      );
    }

    const id = Number(productId);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Stock insuficiente" },
        { status: 400 }
      );
    }

    await prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    });

    return NextResponse.json({ message: "Stock actualizado" });
  } catch (error) {
    console.error("❌ Error en add-to-cart:", error);
    return NextResponse.json(
      { error: "Error al agregar al carrito" },
      { status: 500 }
    );
  }
}
