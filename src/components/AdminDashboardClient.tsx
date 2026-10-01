"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { USER_STATUS, JOB_STATUS, JOIN_REQUEST_STATUS } from "@/lib/constants";
import { formatRelative } from "@/lib/format";

interface Props {
  pendingUsers: Array<{
    id: string;
    role: string;
    name: string;
    phone: string;
    email: string | null;
    createdAt: Date;
    worker: { trade: string; town: string } | null;
    company: { businessName: string; industry: string; town: string } | null;
  }>;
  pendingJobs: Array<{
    id: string;
    title: string;
    town: string;
    jobType: string;
    createdAt: Date;
    company: { company: { businessName: string } | null };
  }>;
  workers: Array<{
    id: string;
    name: string;
    phone: string;
    town: string;
    trade: string;
    availability: string;
    user: { status: string };
  }>;
  companies: Array<{
    id: string;
    businessName: string;
    town: string;
    industry: string;
    contactMode: string;
    user: { status: string };
  }>;
  jobs: Array<{
    id: string;
    title: string;
    town: string;
    jobType: string;
    status: string;
    createdAt: Date;
    company: { company: { businessName: string } | null };
  }>;
  contactMessages: Array<{
    id: string;
    name: string;
    contact: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }>;
}

export default function AdminDashboardClient({
  pendingUsers,
  pendingJobs,
  workers,
  companies,
  jobs,
  contactMessages,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<
    "pending" | "jobs" | "workers" | "companies" | "feedback"
  >("pending");

  async function approveUser(userId: string) {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "APPROVED" }),
    });
    router.refresh();
  }

  async function rejectUser(userId: string) {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED" }),
    });
    router.refresh();
  }

  async function deleteUser(userId: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الحساب؟")) return;
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    router.refresh();
  }

  async function approveJob(jobId: string) {
    await fetch(`/api/admin/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "APPROVED" }),
    });
    router.refresh();
  }

  async function rejectJob(jobId: string) {
    await fetch(`/api/admin/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED" }),
    });
    router.refresh();
  }

  async function deleteJob(jobId: string) {
    if (!confirm("هل أنت متأكد من حذف هذه الوظيفة؟")) return;
    await fetch(`/api/admin/jobs/${jobId}`, { method: "DELETE" });
    router.refresh();
  }

  async function deleteWorker(workerId: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الملف الشخصي؟")) return;
    await fetch(`/api/admin/workers/${workerId}`, { method: "DELETE" });
    router.refresh();
  }

  async function deleteCompany(companyId: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الملف الشخصي؟")) return;
    await fetch(`/api/admin/companies/${companyId}`, { method: "DELETE" });
    router.refresh();
  }

  async function markFeedbackRead(msgId: string) {
    await fetch(`/api/admin/contact/${msgId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
    router.refresh();
  }

  const pendingCount = pendingUsers.length + pendingJobs.length;

  return (
    <div className="mt-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-sand-200">
        {[
          { key: "pending", label: `قيد المراجعة (${pendingCount})` },
          { key: "jobs", label: "الوظائف" },
          { key: "workers", label: "العمال" },
          { key: "companies", label: "الشركات" },
          { key: "feedback", label: "التواصل معنا" },
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

      {/* Pending approvals */}
      {tab === "pending" && (
        <div className="mt-6 space-y-6">
          {/* Pending users */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">حسابات قيد المراجعة</h2>
            {pendingUsers.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">لا توجد حسابات قيد المراجعة</p>
            ) : (
              <div className="mt-3 space-y-3">
                {pendingUsers.map((u) => (
                  <div key={u.id} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{u.name}</h3>
                        <p className="mt-0.5 text-sm text-gray-600">
                          {u.role === "WORKER" ? "عامل" : "صاحب عمل"} • {u.phone}
                          {u.email && ` • ${u.email}`}
                        </p>
                        {u.worker && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            {u.worker.trade} • {u.worker.town}
                          </p>
                        )}
                        {u.company && (
                          <p className="mt-0.5 text-xs text-gray-500">
                            {u.company.businessName} • {u.company.industry} • {u.company.town}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{formatRelative(u.createdAt)}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => approveUser(u.id)}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                      >
                        مقبول
                      </button>
                      <button
                        onClick={() => rejectUser(u.id)}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        رفض
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-sand-100"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending jobs */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">وظائف قيد المراجعة</h2>
            {pendingJobs.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">لا توجد وظائف قيد المراجعة</p>
            ) : (
              <div className="mt-3 space-y-3">
                {pendingJobs.map((j) => (
                  <div key={j.id} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{j.title}</h3>
                        <p className="mt-0.5 text-sm text-gray-600">
                          {j.company.company?.businessName} • {j.town}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">{formatRelative(j.createdAt)}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => approveJob(j.id)}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                      >
                        مقبول
                      </button>
                      <button
                        onClick={() => rejectJob(j.id)}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        رفض
                      </button>
                      <button
                        onClick={() => deleteJob(j.id)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-sand-100"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* All jobs */}
      {tab === "jobs" && (
        <div className="mt-6 space-y-3">
          {jobs.length === 0 ? (
            <p className="text-sm text-gray-500">لا توجد وظائف</p>
          ) : (
            jobs.map((j) => (
              <div key={j.id} className="flex items-center justify-between rounded-xl border border-sand-200 bg-white p-4">
                <div>
                  <h3 className="font-medium text-gray-900">{j.title}</h3>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {j.company.company?.businessName} • {j.town}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      j.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : j.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {JOB_STATUS[j.status as keyof typeof JOB_STATUS] || j.status}
                  </span>
                  <button
                    onClick={() => deleteJob(j.id)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-sand-100"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Workers */}
      {tab === "workers" && (
        <div className="mt-6 space-y-3">
          {workers.length === 0 ? (
            <p className="text-sm text-gray-500">لا يوجد عمال</p>
          ) : (
            workers.map((w) => (
              <div key={w.id} className="flex items-center justify-between rounded-xl border border-sand-200 bg-white p-4">
                <div>
                  <h3 className="font-medium text-gray-900">{w.name}</h3>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {w.trade} • {w.town} • {w.phone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      w.user.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : w.user.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {USER_STATUS[w.user.status as keyof typeof USER_STATUS] || w.user.status}
                  </span>
                  <button
                    onClick={() => deleteWorker(w.id)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-sand-100"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Companies */}
      {tab === "companies" && (
        <div className="mt-6 space-y-3">
          {companies.length === 0 ? (
            <p className="text-sm text-gray-500">لا توجد شركات</p>
          ) : (
            companies.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-sand-200 bg-white p-4">
                <div>
                  <h3 className="font-medium text-gray-900">{c.businessName}</h3>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {c.industry} • {c.town}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      c.user.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : c.user.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {USER_STATUS[c.user.status as keyof typeof USER_STATUS] || c.user.status}
                  </span>
                  <button
                    onClick={() => deleteCompany(c.id)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-sand-100"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Contact messages */}
      {tab === "feedback" && (
        <div className="mt-6 space-y-3">
          {contactMessages.length === 0 ? (
            <p className="text-sm text-gray-500">لا توجد رسائل</p>
          ) : (
            contactMessages.map((m) => (
              <div
                key={m.id}
                className={`rounded-xl border p-4 ${
                  m.read ? "border-sand-200 bg-white" : "border-brand-200 bg-brand-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{m.name}</h3>
                    <p className="mt-0.5 text-sm text-gray-500" dir="ltr">{m.contact}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{formatRelative(m.createdAt)}</span>
                    {!m.read && (
                      <button
                        onClick={() => markFeedbackRead(m.id)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-sand-100"
                      >
                        تحديد كمقروء
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700">{m.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
