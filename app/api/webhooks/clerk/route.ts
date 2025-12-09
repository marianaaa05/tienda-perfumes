import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (payload.type === "user.created") {
      const user = payload.data;

      const email = user.email_addresses?.[0]?.email_address;
      const name = user.first_name || user.username || "Usuario";

      if (!email) {
        return NextResponse.json(
          { error: "No email provided" },
          { status: 400 }
        );
      }

      const exist = await prisma.user.findUnique({
        where: { email },
      });

      if (!exist) {
        await prisma.user.create({
          data: {
            name,
            email,
            role: "CLIENT",
          },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("❌ Error Clerk Webhook:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
