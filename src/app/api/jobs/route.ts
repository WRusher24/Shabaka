import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { jobSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "EMPLOYER" || session.status !== "APPROVED") {
      return NextResponse.json(
        { error: "يجب أن تكون مسجلاً كصاحب عمل معتمد لنشر وظيفة" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = jobSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "بيانات غير صالحة" },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        title: parsed.data.title,
        companyId: session.userId,
        town: parsed.data.town,
        jobType: parsed.data.jobType,
        salaryAmount: parsed.data.salaryAmount || null,
        salaryVisible: parsed.data.salaryVisible,
        hoursMode: parsed.data.hoursMode,
        workingHours: parsed.data.workingHours || null,
        workingDays: parsed.data.workingDays || null,
        description: parsed.data.description,
        requirements: parsed.data.requirements || null,
        status: "PENDING",
      },
    });

    // Notify admins
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          message: `وظيفة جديدة تحتاج مراجعة: ${job.title}`,
          link: "/admin",
        },
      });
    }

    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error) {
    console.error("Job create error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
