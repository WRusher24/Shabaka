import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { interestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "EMPLOYER" || session.status !== "APPROVED") {
      return NextResponse.json(
        { error: "يجب أن تكون مسجلاً كصاحب عمل معتمد لإبداء الاهتمام" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = interestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "بيانات غير صالحة" },
        { status: 400 }
      );
    }

    const { workerId, note } = parsed.data;

    // Verify worker exists
    const worker = await prisma.workerProfile.findUnique({
      where: { id: workerId },
    });
    if (!worker) {
      return NextResponse.json({ error: "العامل غير موجود" }, { status: 404 });
    }

    // Record the interest
    await prisma.interest.create({
      data: {
        employerId: session.userId,
        workerId,
        note: note || null,
      },
    });

    // Notify the worker: "[اسم الشركة] مهتم بخدماتك"
    const employer = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { company: true },
    });
    const employerName = employer?.company?.businessName || employer?.name || "صاحب عمل";

    await prisma.notification.create({
      data: {
        userId: worker.userId,
        message: `${employerName} مهتم بخدماتك`,
        link: "/worker/dashboard",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Interest error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
