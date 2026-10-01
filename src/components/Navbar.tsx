import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

export default async function Navbar() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-xl font-bold text-white">
            ش
          </span>
          <span className="text-xl font-bold text-brand-800">شبكة</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/workers"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-sand-100 hover:text-brand-700"
          >
            العمال
          </Link>
          <Link
            href="/companies"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-sand-100 hover:text-brand-700"
          >
            الشركات
          </Link>
          <Link
            href="/jobs"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-sand-100 hover:text-brand-700"
          >
            الوظائف
          </Link>
          <Link
            href="/contact"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-sand-100 hover:text-brand-700"
          >
            تواصل معنا
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
                >
                  لوحة التحكم
                </Link>
              )}
              {user.role === "EMPLOYER" && (
                <Link
                  href="/employer/dashboard"
                  className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
                >
                  لوحة الشركة
                </Link>
              )}
              {user.role === "WORKER" && (
                <Link
                  href="/worker/dashboard"
                  className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
                >
                  حسابي
                </Link>
              )}
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-sand-100"
                >
                  خروج
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-sand-100"
              >
                دخول
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                تسجيل
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 border-t border-sand-200 px-4 py-2 md:hidden">
        <Link href="/workers" className="rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-sand-100">
          العمال
        </Link>
        <Link href="/companies" className="rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-sand-100">
          الشركات
        </Link>
        <Link href="/jobs" className="rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-sand-100">
          الوظائف
        </Link>
        <Link href="/contact" className="rounded-lg px-3 py-1.5 text-sm text-gray-700 hover:bg-sand-100">
          تواصل
        </Link>
      </nav>
    </header>
  );
}
