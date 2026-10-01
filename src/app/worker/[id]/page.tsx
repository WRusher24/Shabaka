import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { AVAILABILITY } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import ContactWorkerButton from "@/components/ContactWorkerButton";

export const dynamic = "force-dynamic";

export default async function WorkerProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const worker = await prisma.workerProfile.findUnique({
    where: { id: params.id },
    include: { user: { select: { status: true } } },
  });

  if (!worker) notFound();

  const session = await getSessionUser();
  const canViewContact =
    session &&
    session.status === "APPROVED" &&
    (session.role === "EMPLOYER" || session.role === "ADMIN");

  const isAvailable = worker.availability === "AVAILABLE";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="rounded-xl border border-sand-200 bg-white p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{worker.name}</h1>
            <p className="mt-1 text-lg text-brand-700">{worker.trade}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isAvailable ? AVAILABILITY.AVAILABLE : AVAILABILITY.BUSY}
          </span>
        </div>

        {/* Details */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-sand-50 p-4">
            <div className="text-sm text-gray-500">البلدة</div>
            <div className="mt-1 font-medium text-gray-900">{worker.town}</div>
          </div>
          <div className="rounded-lg bg-sand-50 p-4">
            <div className="text-sm text-gray-500">سنوات الخبرة</div>
            <div className="mt-1 font-medium text-gray-900">{worker.yearsExperience} سنة</div>
          </div>
          <div className="rounded-lg bg-sand-50 p-4">
            <div className="text-sm text-gray-500">تاريخ التسجيل</div>
            <div className="mt-1 font-medium text-gray-900">{formatDate(worker.createdAt)}</div>
          </div>
          <div className="rounded-lg bg-sand-50 p-4">
            <div className="text-sm text-gray-500">حالة الحساب</div>
            <div className="mt-1 font-medium text-gray-900">
              {worker.user.status === "APPROVED" ? "معتمد" : worker.user.status === "PENDING" ? "قيد المراجعة" : "مرفوض"}
            </div>
          </div>
        </div>

        {/* Bio */}
        {worker.bio && (
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-900">نبذة عن العامل</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">{worker.bio}</p>
          </div>
        )}

        {/* Contact info — gated */}
        <div className="mt-6 rounded-lg border border-sand-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">معلومات التواصل</h2>

          {canViewContact ? (
            <div className="mt-3 space-y-2">
              {worker.contactPhone && (
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <span className="text-sm text-gray-700">الهاتف</span>
                  <a
                    href={`tel:${worker.contactPhone}`}
                    dir="ltr"
                    className="text-sm font-medium text-green-800 hover:underline"
                  >
                    {worker.contactPhone}
                  </a>
                </div>
              )}
              {worker.contactEmail && (
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <span className="text-sm text-gray-700">البريد الإلكتروني</span>
                  <a
                    href={`mailto:${worker.contactEmail}`}
                    dir="ltr"
                    className="text-sm font-medium text-green-800 hover:underline"
                  >
                    {worker.contactEmail}
                  </a>
                </div>
              )}
              {worker.whatsapp && (
                <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                  <span className="text-sm text-gray-700">واتساب</span>
                  <a
                    href={`https://wa.me/${worker.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="text-sm font-medium text-green-800 hover:underline"
                  >
                    {worker.whatsapp}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-3 rounded-lg bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                🔒 معلومات التواصل مخفية. يجب أن تكون مسجلاً كصاحب عمل معتمد لعرض
                معلومات التواصل المباشرة لهذا العامل.
              </p>
              {!session && (
                <a href="/login" className="mt-2 inline-block text-sm font-medium text-amber-900 hover:underline">
                  سجل دخولك ←
                </a>
              )}
            </div>
          )}
        </div>

        {/* Express interest — for approved employers */}
        {session?.role === "EMPLOYER" && session.status === "APPROVED" && (
          <ContactWorkerButton workerId={worker.id} workerName={worker.name} />
        )}
      </div>
    </div>
  );
}
