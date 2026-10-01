"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TRADES, INDUSTRIES, TOWNS } from "@/lib/constants";

export default function RegisterForm({ role }: { role: "worker" | "employer" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value as string;
    });
    data.role = role;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "حدث خطأ أثناء التسجيل");
        setLoading(false);
        return;
      }
      router.push("/register/success");
    } catch {
      setError("حدث خطأ غير متوقع. حاول مرة أخرى.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Common fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            {role === "worker" ? "الاسم الكامل" : "اسم الشركة"} *
          </label>
          <input
            name="name"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder={role === "worker" ? "مثال: أحمد محمود خليل" : "مثال: شركة البناء الحديث"}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">رقم الهاتف *</label>
          <input
            name="phone"
            required
            dir="ltr"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="05X-XXX-XXXX"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
          <input
            name="email"
            type="email"
            dir="ltr"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">كلمة المرور *</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="8 أحرف على الأقل"
          />
        </div>
      </div>

      {/* Worker-specific fields */}
      {role === "worker" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">البلدة / المدينة *</label>
              <select name="town" required className="w-full">
                <option value="">اختر بلدتك</option>
                {TOWNS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">المهنة / الحرفة *</label>
              <select name="trade" required className="w-full">
                <option value="">اختر مهنتك</option>
                {TRADES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">سنوات الخبرة</label>
              <input
                name="yearsExperience"
                type="number"
                min="0"
                max="60"
                defaultValue="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">رقم هاتف التواصل</label>
              <input
                name="contactPhone"
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="05X-XXX-XXXX"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">نبذة عنك</label>
            <textarea
              name="bio"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="اكتب نبذة قصيرة عن خبراتك ومهاراتك..."
            />
          </div>
        </>
      )}

      {/* Employer-specific fields */}
      {role === "employer" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">البلدة / المدينة *</label>
              <select name="town" required className="w-full">
                <option value="">اختر بلدتك</option>
                {TOWNS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">القطاع / الصناعة *</label>
              <select name="industry" required className="w-full">
                <option value="">اختر القطاع</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              إذا اخترت "أخرى"، اكتب القطاع هنا
            </label>
            <input
              name="industryCustom"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="اكتب القطاع يدوياً..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">ساعات العمل</label>
            <input
              name="workingHours"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="مثال: الأحد - الخميس: 08:00 - 17:00"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">طريقة التواصل *</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 p-3 hover:border-brand-400">
                <input type="radio" name="contactMode" value="DIRECT" defaultChecked className="text-brand-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">تواصل مباشر</div>
                  <div className="text-xs text-gray-500">إظهار الهاتف/البريد للعمال المعتمدين</div>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 p-3 hover:border-brand-400">
                <input type="radio" name="contactMode" value="JOIN_REQUEST" className="text-brand-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">طلب انضمام</div>
                  <div className="text-xs text-gray-500">العمال يرسلون طلب انضمام دون إظهار معلوماتك</div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">رقم هاتف التواصل</label>
              <input
                name="contactPhone"
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="05X-XXX-XXXX"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">البريد الإلكتروني للتواصل</label>
              <input
                name="contactEmail"
                type="email"
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">نبذة عن الشركة</label>
            <textarea
              name="about"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="اكتب نبذة قصيرة عن شركتك ونشاطها..."
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "جارٍ التسجيل..." : "إنشاء الحساب"}
      </button>

      <p className="text-center text-sm text-gray-500">
        لديك حساب بالفعل؟{" "}
        <a href="/login" className="font-medium text-brand-700 hover:underline">
          سجل دخولك
        </a>
      </p>
    </form>
  );
}
