"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinRequestButton({
  companyId,
  companyName,
}: {
  companyId: string;
  companyName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/join-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, message }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "حدث خطأ");
        setLoading(false);
        return;
      }
      setDone(true);
      router.refresh();
    } catch {
      setError("حدث خطأ غير متوقع");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-center">
        <p className="text-sm font-medium text-green-800">
          ✓ تم إرسال طلب الانضمام إلى {companyName}
        </p>
        <p className="mt-1 text-xs text-green-700">
          ستتمكن الشركة من عرض معلومات التواصل الخاصة بك والرد على طلبك
        </p>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="mt-6">
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700"
        >
          طلب انضمام إلى الشركة
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-sand-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900">طلب انضمام إلى {companyName}</h3>
      <p className="mt-1 text-xs text-gray-500">
        اكتب رسالة قصيرة تقدم نفسك فيها للشركة
      </p>

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        maxLength={1000}
        className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        placeholder="مرحباً، أنا عامل بخبرة في..."
      />

      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "جارٍ الإرسال..." : "إرسال الطلب"}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-700 hover:bg-sand-100"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
