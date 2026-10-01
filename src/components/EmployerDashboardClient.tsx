"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JOIN_REQUEST_STATUS, JOB_STATUS } from "@/lib/constants";
import { formatRelative } from "@/lib/format";

interface Props {
  company: {
    id: string;
    businessName: string;
    town: string;
    industry: string;
    contactMode: string;
  } | null;
  jobs: Array<{
    id: string;
    title: string;
    town: string;
    jobType: string;
    status: string;
    createdAt: Date;
  }>;
  joinRequests: Array<{
    id: string;
    message: string | null;
    status: string;
    createdAt: Date;
    worker: {
      worker: {
        id: string;
        name: string;
        phone: string;
        town: string;
        trade: string;
        contactPhone: string | null;
        contactEmail: string | null;
      } | null;
    };
    job: { title: string } | null;
  }>;
  notifications: Array<{
    id: string;
    message: string;
    link: string | null;
    read: boolean;
    createdAt: Date;
  }>;
}

export default function EmployerDashboardClient({
  company,
  jobs,
  joinRequests,
  notifications,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "requests" | "jobs" | "notifications">("overview");
  const [showJobForm, setShowJobForm] = useState(false);

  async function updateRequestStatus(requestId: string, status: string) {
    await fetch(`/api/join-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function markNotificationRead(notifId: string) {
    await fetch(`/api/notifications/${notifId}`, { method: "PATCH" });
    router.refresh();
  }

  const pendingRequests = joinRequests.filter((r) => r.status === "PENDING");

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-sand-200">
        {[
          { key: "overview", label: "نظرة عامة" },
          { key: "requests", label: `طلبات الانضمام (${pendingRequests.length})` },
          { key: "jobs", label: "وظائفي" },
          { key: "notifications", label: "الإشعارات" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t.key
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-sand-200 bg-white p-5">
            <div className="text-3xl font-bold text-brand-700">{jobs.length}</div>
            <div className="mt-1 text-sm text-gray-600">إجمالي الوظائف</div>
          </div>
          <div className="rounded-xl border border-sand-200 bg-white p-5">
            <div className="text-3xl font-bold text-brand-700">{pendingRequests.length}</div>
            <div className="mt-1 text-sm text-gray-600">طلبات معلقة</div>
          </div>
          <div className="rounded-xl border border-sand-200 bg-white p-5">
            <div className="text-3xl font-bold text-brand-700">{notifications.filter((n) => !n.read).length}</div>
            <div className="mt-1 text-sm text-gray-600">إشعارات غير مقروءة</div>
          </div>
        </div>
      )}

      {/* Join Requests */}
      {tab === "requests" && (
        <div className="mt-6 space-y-4">
          {joinRequests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <div className="text-4xl">📋</div>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">لا توجد طلبات انضمام</h3>
              <p className="mt-1 text-sm text-gray-500">عندما يرسل العمال طلبات انضمام ستظهر هنا</p>
            </div>
          ) : (
            joinRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-sand-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{req.worker.worker?.name}</h3>
                    <p className="mt-0.5 text-sm text-gray-600">
                      {req.worker.worker?.trade} • {req.worker.worker?.town}
                    </p>
                    {req.job && (
                      <p className="mt-0.5 text-xs text-gray-500">للوظيفة: {req.job.title}</p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      req.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : req.status === "ACCEPTED"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {JOIN_REQUEST_STATUS[req.status as keyof typeof JOIN_REQUEST_STATUS] || req.status}
                  </span>
                </div>

                {req.message && (
                  <p className="mt-3 rounded-lg bg-sand-50 p-3 text-sm text-gray-700">{req.message}</p>
                )}

                {/* Worker contact info — visible to the company */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {req.worker.worker?.contactPhone && (
                    <a
                      href={`tel:${req.worker.worker.contactPhone}`}
                      className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800 hover:bg-green-200"
                    >
                      📞 {req.worker.worker.contactPhone}
                    </a>
                  )}
                  {req.worker.worker?.contactEmail && (
                    <a
                      href={`mailto:${req.worker.worker.contactEmail}`}
                      className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800 hover:bg-green-200"
                    >
                      ✉️ {req.worker.worker.contactEmail}
                    </a>
                  )}
                </div>

                {req.status === "PENDING" && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => updateRequestStatus(req.id, "ACCEPTED")}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      قبول
                    </button>
                    <button
                      onClick={() => updateRequestStatus(req.id, "DECLINED")}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      رفض
                    </button>
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-400">{formatRelative(req.createdAt)}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Jobs */}
      {tab === "jobs" && (
        <div className="mt-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowJobForm(!showJobForm)}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              {showJobForm ? "إخفاء النموذج" : "+ نشر وظيفة جديدة"}
            </button>
          </div>

          {showJobForm && <JobForm companyId={company?.id || ""} />}

          <div className="mt-4 space-y-3">
            {jobs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <div className="text-4xl">📋</div>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">لا توجد وظائف</h3>
                <p className="mt-1 text-sm text-gray-500">ابدأ بنشر وظيفة جديدة</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-xl border border-sand-200 bg-white p-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">{job.town}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      job.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : job.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {JOB_STATUS[job.status as keyof typeof JOB_STATUS] || job.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <div className="mt-6 space-y-2">
          {notifications.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <div className="text-4xl">🔔</div>
              <h3 className="mt-3 text-lg font-semibold text-gray-900">لا توجد إشعارات</h3>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-center justify-between rounded-xl border p-4 ${
                  n.read ? "border-sand-200 bg-white" : "border-brand-200 bg-brand-50"
                }`}
              >
                <div>
                  <p className="text-sm text-gray-900">{n.message}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{formatRelative(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-sand-100"
                  >
                    تحديد كمقروء
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function JobForm({ companyId }: { companyId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value as string;
    });
    data.salaryVisible = formData.get("salaryVisible") === "on" ? "true" : "false";

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "حدث خطأ");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("حدث خطأ غير متوقع");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-xl border border-sand-200 bg-white p-5">
      <h3 className="font-semibold text-gray-900">نشر وظيفة جديدة</h3>
      <p className="mt-1 text-xs text-gray-500">ستظهر الوظيفة في اللوحة بعد موافقة الإدارة</p>

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
      )}

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">عنوان الوظيفة *</label>
          <input name="title" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="مثال: عامل بناء" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">البلدة *</label>
          <input name="town" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="مثال: الناصرة" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">نوع الوظيفة *</label>
          <select name="jobType" required className="w-full">
            <option value="FULL_TIME">دوام كامل</option>
            <option value="PART_TIME">دوام جزئي</option>
            <option value="SHIFT">وردية / شفت</option>
            <option value="GIG">عمل يومي / مهمة</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">الراتب (اختياري)</label>
          <input name="salaryAmount" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="مثال: 8000" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">ساعات العمل *</label>
          <select name="hoursMode" required className="w-full">
            <option value="EXACT">ساعات محددة</option>
            <option value="FLEXIBLE">مرنة</option>
            <option value="MULTIPLE">خيارات متعددة</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">تفاصيل الساعات</label>
          <input name="workingHours" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="مثال: 07:00 - 17:00 أو مرنة" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">أيام العمل</label>
          <input name="workingDays" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="مثال: الأحد - الخميس" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="salaryVisible" id="salaryVisible" className="rounded border-gray-300 text-brand-600" />
          <label htmlFor="salaryVisible" className="text-sm text-gray-700">إظهار الراتب في الإعلان</label>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">وصف الوظيفة *</label>
        <textarea name="description" required rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="اكتب وصفاً تفصيلياً للوظيفة..." />
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">المتطلبات</label>
        <textarea name="requirements" rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="المهارات والخبرات المطلوبة..." />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "جارٍ النشر..." : "نشر الوظيفة"}
      </button>
    </form>
  );
}
