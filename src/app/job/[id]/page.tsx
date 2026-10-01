import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { JOB_TYPES, HOURS_MODES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import ApplyJobButton from "@/components/ApplyJobButton";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      company: {
        include: { company: true },
      },
    },
  });

  if (!job || job.status !== "APPROVED") notFound();

  const session = await getSessionUser();
  const jobTypeLabel = JOB_TYPES.find((t) => t.value === job.jobType)?.label || job.jobType;
  const hoursModeLabel = HOURS_MODES.find((h) => h.value === job.hoursMode)?.label || job.hoursMode;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="rounded-xl border border-sand-200 bg-white p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <a
              href={`/company/${job.company.company?.id}`}
              className="mt-1 inline-block text-lg text-brand-700 hover:underline"
            >
              {job.company.company?.businessName}
            </a>
          </div>
          <span className="shrink-0 rounded-full bg-brand-100 px-3 py-1.5 text-sm font-medium text-brand-800">
            {jobTypeLabel}
          </span>
        </div>

        {/* Meta */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-lg bg-sand-50 p-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <div className="text-xs text-gray-500">الموقع</div>
              <div className="text-sm font-medium text-gray-900">{job.town}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-sand-50 p-3">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <div className="text-xs text-gray-500">ساعات العمل</div>
              <div className="text-sm font-medium text-gray-900">
                {job.workingHours || hoursModeLabel}
              </div>
            </div>
          </div>

          {job.workingDays && (
            <div className="flex items-center gap-2 rounded-lg bg-sand-50 p-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">أيام العمل</div>
                <div className="text-sm font-medium text-gray-900">{job.workingDays}</div>
              </div>
            </div>
          )}

          {job.salaryVisible && job.salaryAmount && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-xs text-green-600">الراتب</div>
                <div className="text-sm font-medium text-green-800">
                  {job.salaryAmount} ₪ / شهر
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-900">وصف الوظيفة</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900">المتطلبات</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{job.requirements}</p>
          </div>
        )}

        {/* Posted date */}
        <div className="mt-6 border-t border-sand-100 pt-4 text-xs text-gray-400">
          تاريخ النشر: {formatDate(job.createdAt)}
        </div>

        {/* Apply button */}
        {session?.role === "WORKER" && session.status === "APPROVED" && (
          <ApplyJobButton jobId={job.id} companyId={job.companyId} />
        )}
      </div>
    </div>
  );
}
