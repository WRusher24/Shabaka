import { prisma } from "@/lib/db";
import { INDUSTRIES, TOWNS } from "@/lib/constants";
import CompanyCard from "@/components/CompanyCard";

export const dynamic = "force-dynamic";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: { industry?: string; town?: string };
}) {
  const where: Record<string, string> = {};
  if (searchParams.industry) where.industry = searchParams.industry;
  if (searchParams.town) where.town = searchParams.town;

  const companies = await prisma.companyProfile.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">دليل الشركات</h1>
          <p className="mt-1 text-sm text-gray-600">
            تصفح الشركات وأصحاب العمل في منطقتك
          </p>
        </div>

        <form className="flex flex-wrap gap-2">
          <select name="industry" defaultValue={searchParams.industry || ""} className="text-sm">
            <option value="">جميع القطاعات</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
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

      {companies.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="text-4xl">🏢</div>
          <h3 className="mt-3 text-lg font-semibold text-gray-900">لا توجد شركات</h3>
          <p className="mt-1 text-sm text-gray-500">لم يتم العثور على شركات تطابق معايير البحث</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
