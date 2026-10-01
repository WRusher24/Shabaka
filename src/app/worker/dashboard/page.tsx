import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { JOIN_REQUEST_STATUS } from "@/lib/constants";
import { formatRelative } from "@/lib/format";
import WorkerDashboardClient from "@/components/WorkerDashboardClient";

export const dynamic = "force-dynamic";

export default async function WorkerDashboardPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "WORKER") redirect("/login");
  if (session.status !== "APPROVED") redirect("/pending");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      worker: true,
      joinRequests: {
        include: {
          company: { include: { company: true } },
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
      <h1 className="text-2xl font-bold text-gray-900">حسابي</h1>
      <p className="mt-1 text-sm text-gray-600">مرحباً، {user.worker?.name || user.name}</p>

      <WorkerDashboardClient
        worker={user.worker}
        joinRequests={user.joinRequests}
        notifications={user.notifications}
      />
    </div>
  );
}
