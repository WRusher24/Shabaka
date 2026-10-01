import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const worker = await prisma.workerProfile.findUnique({
      where: { id: params.id },
    });
    if (!worker) {
      return NextResponse.json({ error: "العامل غير موجود" }, { status: 404 });
    }

    // Only the worker themselves or an admin can update
    if (worker.userId !== session.userId && session.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.availability === "AVAILABLE" || body.availability === "BUSY") {
      data.availability = body.availability;
    }
    if (typeof body.bio === "string") data.bio = body.bio;
    if (typeof body.town === "string") data.town = body.town;
    if (typeof body.trade === "string") data.trade = body.trade;
    if (typeof body.yearsExperience === "number") data.yearsExperience = body.yearsExperience;
    if (typeof body.contactPhone === "string") data.contactPhone = body.contactPhone;
    if (typeof body.contactEmail === "string") data.contactEmail = body.contactEmail;
    if (typeof body.whatsapp === "string") data.whatsapp = body.whatsapp;

    await prisma.workerProfile.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Worker update error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
