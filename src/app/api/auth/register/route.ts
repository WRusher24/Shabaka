import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { registerWorkerSchema, registerEmployerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = body.role === "employer" ? "employer" : "worker";

    // Check for existing phone
    const existing = await prisma.user.findUnique({ where: { phone: body.phone } });
    if (existing) {
      return NextResponse.json(
        { error: "رقم الهاتف مسجل بالفعل. حاول تسجيل الدخول." },
        { status: 409 }
      );
    }

    // Check for existing email if provided
    if (body.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email: body.email } });
      if (existingEmail) {
        return NextResponse.json(
          { error: "البريد الإلكتروني مسجل بالفعل." },
          { status: 409 }
        );
      }
    }

    if (role === "worker") {
      const parsed = registerWorkerSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message || "بيانات غير صالحة" },
          { status: 400 }
        );
      }
      const data = parsed.data;

      const user = await prisma.user.create({
        data: {
          role: "WORKER",
          status: "PENDING",
          name: data.name,
          email: data.email || null,
          phone: data.phone,
          password: hashPassword(data.password),
          worker: {
            create: {
              name: data.name,
              phone: data.phone,
              town: data.town,
              trade: data.trade,
              yearsExperience: data.yearsExperience,
              bio: data.bio || null,
              contactPhone: data.contactPhone || null,
              contactEmail: data.contactEmail || null,
              whatsapp: data.whatsapp || null,
            },
          },
        },
      });

      setSessionCookie({
        userId: user.id,
        role: user.role,
        status: user.status,
        name: user.name,
      });

      return NextResponse.json({ success: true, role: "worker" });
    } else {
      const parsed = registerEmployerSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.errors[0]?.message || "بيانات غير صالحة" },
          { status: 400 }
        );
      }
      const data = parsed.data;

      const user = await prisma.user.create({
        data: {
          role: "EMPLOYER",
          status: "PENDING",
          name: data.name,
          email: data.email || null,
          phone: data.phone,
          password: hashPassword(data.password),
          company: {
            create: {
              businessName: data.businessName,
              town: data.town,
              industry: data.industryCustom || data.industry,
              industryCustom: data.industryCustom || null,
              workingHours: data.workingHours || null,
              contactMode: data.contactMode,
              contactPhone: data.contactPhone || null,
              contactEmail: data.contactEmail || null,
              about: data.about || null,
            },
          },
        },
      });

      setSessionCookie({
        userId: user.id,
        role: user.role,
        status: user.status,
        name: user.name,
      });

      return NextResponse.json({ success: true, role: "employer" });
    }
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
