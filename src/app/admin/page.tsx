import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const [pendingUsers, pendingJobs, workers, companies, jobs, contactMessages] = await Promise.all([
    prisma.user.findMany({
      where: { status: "PENDING" },
      include: { worker: true, company: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.findMany({
      where: { status: "PENDING" },
      include: { company: { include: { company: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.workerProfile.findMany({
      include: { user: { select: { status: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.companyProfile.findMany({
      include: { user: { select: { status: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.findMany({
      include: { company: { include: { company: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم الإدارة</h1>
      <p className="mt-1 text-sm text-gray-600">إدارة المستخدمين والوظائف والمحتوى</p>

      <AdminDashboardClient
        pendingUsers={pendingUsers}
        pendingJobs={pendingJobs}
        workers={workers}
        companies={companies}
        jobs={jobs}
        contactMessages={contactMessages}
      />
    </div>
  );
}
