"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactWorkerButton({
  workerId,
  workerName,
}: {
  workerId: string;
  workerName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId }),
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
          ✓ تم إرسال إشعار اهتمامك إلى {workerName}
        </p>
        <p className="mt-1 text-xs text-green-700">
          سيتلقى العامل إشعاراً باهتمامك ويمكنه التواصل معك
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {error && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "جارٍ الإرسال..." : "إبداء اهتمام بهذا العامل"}
      </button>
      <p className="mt-2 text-center text-xs text-gray-500">
        سيتم إرسال إشعار للعامل باهتمامك بخدماته
      </p>
    </div>
  );
}
