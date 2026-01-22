// lib/getOrCreateUser.ts
import { prisma } from "@/lib/prisma";

export async function getOrCreateUser(
  clerkId: string,
  email?: string,
  name?: string
) {
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        email: email ?? "",
        name: name ?? "Usuario",
        cart: [],
      },
    });
  }

  return user;
}
