import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const body = await request.json();
    const read = typeof body.read === "boolean" ? body.read : true;

    const message = await prisma.contactMessage.findUnique({ where: { id: params.id } });
    if (!message) {
      return NextResponse.json({ error: "الرسالة غير موجودة" }, { status: 404 });
    }

    await prisma.contactMessage.update({
      where: { id: params.id },
      data: { read },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin contact update error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
