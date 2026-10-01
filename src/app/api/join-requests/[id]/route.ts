import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "EMPLOYER" || session.status !== "APPROVED") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const body = await request.json();
    const status = body.status === "ACCEPTED" ? "ACCEPTED" : body.status === "DECLINED" ? "DECLINED" : null;
    if (!status) {
      return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
    }

    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: params.id },
    });
    if (!joinRequest || joinRequest.companyId !== session.userId) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    await prisma.joinRequest.update({
      where: { id: params.id },
      data: { status },
    });

    // Notify the worker
    const worker = await prisma.workerProfile.findUnique({
      where: { userId: joinRequest.workerId },
    });
    if (worker) {
      const company = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { company: true },
      });
      const companyName = company?.company?.businessName || company?.name || "الشركة";
      await prisma.notification.create({
        data: {
          userId: joinRequest.workerId,
          message:
            status === "ACCEPTED"
              ? `${companyName} قبلت طلب انضمامك`
              : `${companyName} اعتذرت عن طلب انضمامك`,
          link: "/worker/dashboard",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Join request update error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
