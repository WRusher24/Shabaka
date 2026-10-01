import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { CONTACT_MODES } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import JoinRequestButton from "@/components/JoinRequestButton";

export const dynamic = "force-dynamic";

export default async function CompanyProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const company = await prisma.companyProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { status: true } },
      jobs: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!company) notFound();

  const session = await getSessionUser();
  const canViewContact =
    session &&
    session.status === "APPROVED" &&
    (session.role === "WORKER" || session.role === "ADMIN");

  const isJoinRequest = company.contactMode === "JOIN_REQUEST";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="rounded-xl border border-sand-200 bg-white p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.businessName}</h1>
            <p className="mt-1 text-lg text-brand-700">{company.industry}</p>
          </div>
          <span className="rounded-full bg-brand-100 px-3 py-1.5 text-sm font-medium text-brand-800">
            {company.openingsCount} وظائف متاحة
          </span>
        </div>

        {/* Details */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-sand-50 p-4">
            <div className="text-sm text-gray-500">البلدة</div>
            <div className="mt-1 font-medium text-gray-900">{company.town}</div>
          </div>
          <div className="rounded-lg bg-sand-50 p-4">
            <div className="text-sm text-gray-500">ساعات العمل</div>
            <div className="mt-1 font-medium text-gray-900">
              {company.workingHours || "غير محدد"}
            </div>
          </div>
          <div className="rounded-lg bg-sand-50 p-4">
            <div className="text-sm text-gray-500">طريقة التواصل</div>
            <div className="mt-1 font-medium text-gray-900">
              {isJoinRequest ? CONTACT_MODES.JOIN_REQUEST : CONTACT_MODES.DIRECT}
            </div>
          </div>
          <div className="rounded-lg bg-sand-50 p-4">
            <div className="text-sm text-gray-500">تاريخ التسجيل</div>
            <div className="mt-1 font-medium text-gray-900">{formatDate(company.createdAt)}</div>
          </div>
        </div>

        {/* About */}
        {company.about && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900">نبذة عن الشركة</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{company.about}</p>
          </div>
        )}

        {/* Contact info — gated */}
        <div className="mt-6 rounded-lg border border-sand-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">معلومات التواصل</h2>

          {canViewContact && !isJoinRequest ? (
            <div className="mt-3 space-y-2">
              {company.contactPhone && (
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <span className="text-sm text-gray-700">الهاتف</span>
                  <a
                    href={`tel:${company.contactPhone}`}
                    dir="ltr"
                    className="text-sm font-medium text-green-800 hover:underline"
                  >
                    {company.contactPhone}
                  </a>
                </div>
              )}
              {company.contactEmail && (
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <span className="text-sm text-gray-700">البريد الإلكتروني</span>
                  <a
                    href={`mailto:${company.contactEmail}`}
                    dir="ltr"
                    className="text-sm font-medium text-green-800 hover:underline"
                  >
                    {company.contactEmail}
                  </a>
                </div>
              )}
            </div>
          ) : isJoinRequest ? (
            <div className="mt-3 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                📋 هذه الشركة تستخدم نظام "طلب انضمام". يمكنك إرسال طلب انضمام
                للشركة وستتواصل معك إذا كانت مهتمة بملفك.
              </p>
            </div>
          ) : (
            <div className="mt-3 rounded-lg bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                🔒 معلومات التواصل مخفية. يجب أن تكون مسجلاً كعامل معتمد لعرض
                معلومات التواصل المباشرة لهذه الشركة.
              </p>
              {!session && (
                <a href="/login" className="mt-2 inline-block text-sm font-medium text-amber-900 hover:underline">
                  سجل دخولك ←
                </a>
              )}
            </div>
          )}
        </div>

        {/* Join request button — for approved workers */}
        {session?.role === "WORKER" && session.status === "APPROVED" && isJoinRequest && (
          <JoinRequestButton companyId={company.id} companyName={company.businessName} />
        )}

        {/* Active jobs */}
        {company.jobs.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900">الوظائف المتاحة</h2>
            <div className="mt-3 space-y-2">
              {company.jobs.map((job) => (
                <a
                  key={job.id}
                  href={`/job/${job.id}`}
                  className="flex items-center justify-between rounded-lg border border-sand-200 p-3 hover:border-brand-300 hover:bg-sand-50"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    <div className="text-xs text-gray-500">{job.town}</div>
                  </div>
                  <span className="text-sm text-brand-700">←</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
