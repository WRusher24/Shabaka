import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PendingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.status === "APPROVED") redirect("/");
  if (user.status === "REJECTED") redirect("/rejected");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <div className="rounded-xl border border-sand-200 bg-white p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
          ⏳
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">حسابك قيد المراجعة</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          شكراً لتسجيلك في شبكة. حسابك الآن في حالة المراجعة من قبل الإدارة.
          سيتم تفعيل حسابك في أقرب وقت ممكن، وستتمكن من الوصول إلى جميع ميزات
          المنصة بعد الموافقة.
        </p>
        <div className="mt-6 rounded-lg bg-sand-50 p-4">
          <p className="text-sm text-gray-600">
            إذا كان لديك أي استفسار، يمكنك{" "}
            <a href="/contact" className="font-medium text-brand-700 hover:underline">
              التواصل معنا
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
