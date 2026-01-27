import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, brand, costPrice, price, imageUrl, gender, stock } = body;

    const newProduct = await prisma.product.create({
      data: { name, description, brand, costPrice, price, imageUrl, gender, stock },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Error creating product" }, { status: 500 });
  }
}
