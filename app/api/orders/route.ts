import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CartItem = {
  id: number;
  cantidad: number;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "El usuario no tiene email" },
        { status: 400 }
      );
    }

    // Buscar usuario en BD o crearlo
    let userDB = await prisma.user.findUnique({
      where: { email },
    });

    if (!userDB) {
      userDB = await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          name: clerkUser?.firstName || "Usuario",
        },
      });
    }

    // BODY
    const body = await req.json();
    const {
      cartItems,
      department,
      city,
      addressLine1,
      addressLine2,
      postalCode,
      phone1,
      phone2,
      paymentMethod,
      note,
    } = body;

    // Validaciones...
    if (!cartItems || !Array.isArray(cartItems) || !cartItems.length) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    if (!department || !city || !addressLine1 || !phone1 || !paymentMethod) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "El método de pago es obligatorio" },
        { status: 400 }
      );
    }

const result = await prisma.$transaction(
  async (tx: Prisma.TransactionClient) => {
  // Productos reales desde BD
  const products = await tx.product.findMany({
    where: {
      id: { in: cartItems.map((i: CartItem) => i.id) },
    },
  });

  if (products.length !== cartItems.length) {
    throw new Error("Uno o más productos no existen");
  }

  // Verificar stock + calcular total
  let totalAmount = 0;
  const itemsData = cartItems.map((item: CartItem) => {
    const product = products.find((p) => p.id === item.id)!;

    if (product.stock < item.cantidad) {
      throw new Error(
        `Stock insuficiente para ${product.name}`
      );
    }

    totalAmount += product.price * item.cantidad;

    return {
      productId: product.id,
      quantity: item.cantidad,
      price: product.price,
    };
  });

  // Crear dirección de envío
  const shippingAddress = await tx.shippingAddress.create({
    data: {
      department,
      city,
      addressLine1,
      addressLine2,
      postalCode,
      phone1: phone1 ?? null,
      phone2: phone2 ?? null,
      notes: note ?? null,
    },
  });

  // Crear orden
  const order = await tx.order.create({
    data: {
      user: { connect: { id: userDB.id } },
      status: "PENDING",
      totalAmount,
      paymentMethod,
      shippingAddress: { connect: { id: shippingAddress.id } },
    },
  });

  // Crear items
  await tx.orderItem.createMany({
    data: itemsData.map((item) => ({
      ...item,
      orderId: order.id,
    })),
  });

  // REDUCIR STOCK 
  for (const item of itemsData) {
    await tx.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  }

  return order;
});

    return NextResponse.json({
      message: "Orden creada con éxito",
      orderId: result.id,
    });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Error interno al crear la orden" },
      { status: 500 }
    );
  }
}
