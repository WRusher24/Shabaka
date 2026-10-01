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
    const data: Record<string, unknown> = {};

    if (body.status === "APPROVED" || body.status === "REJECTED") {
      data.status = body.status;
    }
    if (typeof body.title === "string") data.title = body.title;
    if (typeof body.town === "string") data.town = body.town;
    if (typeof body.description === "string") data.description = body.description;
    if (typeof body.requirements === "string") data.requirements = body.requirements;
    if (typeof body.workingHours === "string") data.workingHours = body.workingHours;
    if (typeof body.workingDays === "string") data.workingDays = body.workingDays;
    if (typeof body.salaryAmount === "string") data.salaryAmount = body.salaryAmount;
    if (typeof body.salaryVisible === "boolean") data.salaryVisible = body.salaryVisible;

    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job) {
      return NextResponse.json({ error: "الوظيفة غير موجودة" }, { status: 404 });
    }

    await prisma.job.update({ where: { id: params.id }, data });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin job update error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job) {
      return NextResponse.json({ error: "الوظيفة غير موجودة" }, { status: 404 });
    }

    await prisma.job.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin job delete error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
