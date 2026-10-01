"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JOIN_REQUEST_STATUS, AVAILABILITY } from "@/lib/constants";
import { formatRelative } from "@/lib/format";

interface Props {
  worker: {
    id: string;
    name: string;
    town: string;
    trade: string;
    yearsExperience: number;
    availability: string;
  } | null;
  joinRequests: Array<{
    id: string;
    message: string | null;
    status: string;
    createdAt: Date;
    company: {
      company: {
        businessName: string;
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

export default function WorkerDashboardClient({
  worker,
  joinRequests,
  notifications,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "requests" | "notifications">("overview");

  async function markNotificationRead(notifId: string) {
    await fetch(`/api/notifications/${notifId}`, { method: "PATCH" });
    router.refresh();
  }

  async function toggleAvailability() {
    if (!worker) return;
    const newAvailability = worker.availability === "AVAILABLE" ? "BUSY" : "AVAILABLE";
    await fetch(`/api/worker/${worker.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availability: newAvailability }),
    });
    router.refresh();
  }

  return (
    <div className="mt-6">
      {/* Profile summary */}
      {worker && (
        <div className="rounded-xl border border-sand-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">{worker.name}</h2>
              <p className="mt-0.5 text-sm text-gray-600">
                {worker.trade} • {worker.town} • {worker.yearsExperience} سنة خبرة
              </p>
            </div>
            <button
              onClick={toggleAvailability}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                worker.availability === "AVAILABLE"
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {worker.availability === "AVAILABLE" ? AVAILABILITY.AVAILABLE : AVAILABILITY.BUSY}
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-sand-200">
        {[
          { key: "overview", label: "نظرة عامة" },
          { key: "requests", label: `طلباتي (${joinRequests.length})` },
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
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-sand-200 bg-white p-5">
            <div className="text-3xl font-bold text-brand-700">{joinRequests.length}</div>
            <div className="mt-1 text-sm text-gray-600">طلبات الانضمام المرسلة</div>
          </div>
          <div className="rounded-xl border border-sand-200 bg-white p-5">
            <div className="text-3xl font-bold text-brand-700">
              {notifications.filter((n) => !n.read).length}
            </div>
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
              <h3 className="mt-3 text-lg font-semibold text-gray-900">لا توجد طلبات</h3>
              <p className="mt-1 text-sm text-gray-500">لم ترسل أي طلبات انضمام بعد</p>
            </div>
          ) : (
            joinRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-sand-200 bg-white p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {req.company.company?.businessName}
                    </h3>
                    {req.job && <p className="mt-0.5 text-sm text-gray-600">للوظيفة: {req.job.title}</p>}
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
                <div className="mt-3 text-xs text-gray-400">{formatRelative(req.createdAt)}</div>
              </div>
            ))
          )}
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
