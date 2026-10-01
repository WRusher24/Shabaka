import { prisma } from "@/lib/db";
import { TRADES, TOWNS, AVAILABILITY } from "@/lib/constants";
import WorkerCard from "@/components/WorkerCard";

export const dynamic = "force-dynamic";

export default async function WorkersPage({
  searchParams,
}: {
  searchParams: { trade?: string; town?: string; availability?: string };
}) {
  const where: Record<string, string> = {};
  if (searchParams.trade) where.trade = searchParams.trade;
  if (searchParams.town) where.town = searchParams.town;
  if (searchParams.availability) where.availability = searchParams.availability;

  const workers = await prisma.workerProfile.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">دليل العمال</h1>
          <p className="mt-1 text-sm text-gray-600">
            تصفح العمال المتاحين في منطقتك وتواصل معهم مباشرة
          </p>
        </div>

        {/* Filters */}
        <form className="flex flex-wrap gap-2">
          <select name="trade" defaultValue={searchParams.trade || ""} className="text-sm">
            <option value="">جميع المهن</option>
            {TRADES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select name="town" defaultValue={searchParams.town || ""} className="text-sm">
            <option value="">جميع البلدات</option>
            {TOWNS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select name="availability" defaultValue={searchParams.availability || ""} className="text-sm">
            <option value="">جميع الحالات</option>
            <option value="AVAILABLE">{AVAILABILITY.AVAILABLE}</option>
            <option value="BUSY">{AVAILABILITY.BUSY}</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            تصفية
          </button>
        </form>
      </div>

      {workers.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="text-4xl">🔍</div>
          <h3 className="mt-3 text-lg font-semibold text-gray-900">لا يوجد عمال</h3>
          <p className="mt-1 text-sm text-gray-500">لم يتم العثور على عمال يطابقون معايير البحث</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      )}
    </div>
  );
}
