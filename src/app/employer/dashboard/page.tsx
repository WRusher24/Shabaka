import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { JOIN_REQUEST_STATUS } from "@/lib/constants";
import { formatRelative } from "@/lib/format";
import EmployerDashboardClient from "@/components/EmployerDashboardClient";

export const dynamic = "force-dynamic";

export default async function EmployerDashboardPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "EMPLOYER") redirect("/login");
  if (session.status !== "APPROVED") redirect("/pending");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      company: true,
      jobs: { orderBy: { createdAt: "desc" } },
      companyRequests: {
        include: {
          worker: { include: { worker: true } },
          job: true,
        },
        orderBy: { createdAt: "desc" },
      },
      notifications: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم الشركة</h1>
          <p className="mt-1 text-sm text-gray-600">
            مرحباً، {user.company?.businessName || user.name}
          </p>
        </div>
      </div>

      <EmployerDashboardClient
        company={user.company}
        jobs={user.jobs}
        joinRequests={user.companyRequests}
        notifications={user.notifications}
      />
    </div>
  );
}
