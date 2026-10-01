import { prisma } from "@/lib/db";
import { JOB_TYPES, TOWNS } from "@/lib/constants";
import JobCard from "@/components/JobCard";

export const dynamic = "force-dynamic";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { type?: string; town?: string };
}) {
  const where: Record<string, string> = { status: "APPROVED" };
  if (searchParams.type) where.jobType = searchParams.type;
  if (searchParams.town) where.town = searchParams.town;

  const jobs = await prisma.job.findMany({
    where,
    include: {
      company: {
        include: { company: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة الوظائف والفرص اليومية</h1>
          <p className="mt-1 text-sm text-gray-600">
            تصفح الوظائف والفرص المتاحة في منطقتك
          </p>
        </div>

        <form className="flex flex-wrap gap-2">
          <select name="type" defaultValue={searchParams.type || ""} className="text-sm">
            <option value="">جميع الأنواع</option>
            {JOB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <select name="town" defaultValue={searchParams.town || ""} className="text-sm">
            <option value="">جميع البلدات</option>
            {TOWNS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            تصفية
          </button>
        </form>
      </div>

      {jobs.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="text-4xl">📋</div>
          <h3 className="mt-3 text-lg font-semibold text-gray-900">لا توجد وظائف</h3>
          <p className="mt-1 text-sm text-gray-500">لم يتم العثور على وظائف متاحة حالياً</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
