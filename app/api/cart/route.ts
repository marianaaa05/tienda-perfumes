// // app/api/cart/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// type CartItem = { id: number; cantidad: number };

// function normalizeItems(raw: unknown): CartItem[] {
//   if (!Array.isArray(raw)) return [];
//   return raw
//     .map((it) => {
//       const id = Number(it?.id);
//       const cantidad = Number(it?.cantidad);
//       if (!Number.isFinite(id) || !Number.isFinite(cantidad)) return null;
//       if (cantidad <= 0) return null;
//       return { id, cantidad };
//     })
//     .filter(Boolean) as CartItem[];
// }

// export async function GET() {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return NextResponse.json({ items: [] });
//     }

//     const user = await prisma.user.findUnique({
//       where: { clerkId: userId }, 
//       select: { cart: true },
//     });

//     const items = normalizeItems(user?.cart);
//     return NextResponse.json({ items });
//   } catch (error) {
//     console.error("GET /api/cart error:", error);
//     return NextResponse.json({ items: [] }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const { userId } = await auth();
//     if (!userId) {
//       return NextResponse.json({ error: "No autenticado" }, { status: 401 });
//     }

//     const body = await req.json();
//     const items = normalizeItems(body?.items);

//     // Es válido guardar carrito vacío ([]). Si quieres evitarlo, valida aquí.
//     const updated = await prisma.user.updateMany({
//       where: { clerkId: userId },
//       data: { cart: items },
//     });

//     if (updated.count === 0) {
//       // el usuario no existe en la BD — informar en vez de intentar crear sin datos
//       return NextResponse.json(
//         { error: "Usuario no encontrado en la base de datos" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ ok: true });
//   } catch (error) {
//     console.error("POST /api/cart error:", error);
//     return NextResponse.json(
//       { error: "Error guardando carrito" },
//       { status: 500 }
//     );
//   }
// }



// // app/api/cart/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

type CartItem = { id: number; cantidad: number };

function normalizeItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((it) => {
      const id = Number(it?.id);
      const cantidad = Number(it?.cantidad);
      if (!Number.isFinite(id) || !Number.isFinite(cantidad)) return null;
      if (cantidad <= 0) return null;
      return { id, cantidad };
    })
    .filter(Boolean) as CartItem[];
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ items: [] });

  const clerkUser = await currentUser();

  const user = await getOrCreateUser(
    userId,
    clerkUser?.emailAddresses[0]?.emailAddress,
    clerkUser?.firstName ?? "Usuario"
  );

  return NextResponse.json({
    items: normalizeItems(user.cart),
  });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const items = normalizeItems(body?.items);

  await prisma.user.update({
    where: { clerkId: userId },
    data: { cart: items },
  });

  return NextResponse.json({ ok: true });
}




