import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { joinRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "WORKER" || session.status !== "APPROVED") {
      return NextResponse.json(
        { error: "يجب أن تكون مسجلاً كعامل معتمد لإرسال طلب انضمام" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = joinRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "بيانات غير صالحة" },
        { status: 400 }
      );
    }

    const { companyId, jobId, message } = parsed.data;

    // Verify company exists
    const company = await prisma.user.findUnique({
      where: { id: companyId, role: "EMPLOYER" },
      include: { company: true },
    });
    if (!company) {
      return NextResponse.json({ error: "الشركة غير موجودة" }, { status: 404 });
    }

    // Check for duplicate pending request
    const existing = await prisma.joinRequest.findFirst({
      where: {
        companyId,
        workerId: session.userId,
        status: "PENDING",
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "لديك طلب انضمام معلق لهذه الشركة بالفعل" },
        { status: 409 }
      );
    }

    await prisma.joinRequest.create({
      data: {
        companyId,
        workerId: session.userId,
        jobId: jobId || null,
        message: message || null,
      },
    });

    // Notify the employer
    await prisma.notification.create({
      data: {
        userId: companyId,
        message: `طلب انضمام جديد من عامل${jobId ? " لوظيفة" : ""}`,
        link: "/employer/dashboard",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Join request error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
