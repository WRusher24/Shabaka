import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/");

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-xl border border-sand-200 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h1>
        <p className="mt-2 text-sm text-gray-600">
          أدخل رقم هاتفك وكلمة المرور للوصول إلى حسابك
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
