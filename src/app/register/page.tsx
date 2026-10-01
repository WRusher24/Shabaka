import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { TRADES, INDUSTRIES, TOWNS } from "@/lib/constants";
import RegisterForm from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const user = await getSessionUser();
  if (user) redirect("/");

  const role = searchParams.role === "employer" ? "employer" : "worker";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="rounded-xl border border-sand-200 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">إنشاء حساب جديد</h1>
        <p className="mt-2 text-sm text-gray-600">
          سجل كعامل أو صاحب عمل للانضمام إلى شبكة
        </p>

        {/* Role selector */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href="/register?role=worker"
            className={`rounded-lg border-2 p-4 text-center transition ${
              role === "worker"
                ? "border-brand-600 bg-brand-50"
                : "border-gray-200 hover:border-brand-300"
            }`}
          >
            <div className="text-2xl">👷</div>
            <div className="mt-1 font-semibold text-gray-900">عامل / باحث عن عمل</div>
            <div className="mt-1 text-xs text-gray-500">ابحث عن وظائف في منطقتك</div>
          </a>
          <a
            href="/register?role=employer"
            className={`rounded-lg border-2 p-4 text-center transition ${
              role === "employer"
                ? "border-brand-600 bg-brand-50"
                : "border-gray-200 hover:border-brand-300"
            }`}
          >
            <div className="text-2xl">🏢</div>
            <div className="mt-1 font-semibold text-gray-900">صاحب عمل / شركة</div>
            <div className="mt-1 text-xs text-gray-500">انشر وظائف وابحث عن عمالة</div>
          </a>
        </div>

        {/* Privacy notice */}
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-sm font-semibold text-amber-900">ملاحظة حول الخصوصية</h3>
          <p className="mt-1 text-sm leading-relaxed text-amber-800">
            إذا اخترت مشاركة معلومات التواصل المباشرة (الهاتف أو البريد الإلكتروني)،
            فلن تكون مرئية إلا للعمال المسجلين والمعتمدين من الإدارة. لن تظهر
            معلوماتك في الدليل العام أو لأي زائر غير مسجل.
          </p>
        </div>

        <RegisterForm role={role} />
      </div>
    </div>
  );
}
