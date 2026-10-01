"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      contact: formData.get("contact") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "حدث خطأ أثناء الإرسال");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("حدث خطأ غير متوقع. حاول مرة أخرى.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <div className="text-3xl">✓</div>
        <h3 className="mt-2 font-semibold text-green-800">تم إرسال رسالتك بنجاح!</h3>
        <p className="mt-1 text-sm text-green-700">شكراً لتواصلك معنا. سنرد عليك في أقرب وقت.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">الاسم *</label>
        <input
          name="name"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="اسمك الكامل"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          معلومات التواصل (بريد إلكتروني أو هاتف) *
        </label>
        <input
          name="contact"
          required
          dir="ltr"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="example@email.com أو 05X-XXX-XXXX"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">الرسالة *</label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="اكتب رسالتك هنا..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "جارٍ الإرسال..." : "إرسال الرسالة"}
      </button>
    </form>
  );
}
