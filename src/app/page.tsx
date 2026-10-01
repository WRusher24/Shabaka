import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [workerCount, companyCount, jobCount] = await Promise.all([
    prisma.workerProfile.count(),
    prisma.companyProfile.count(),
    prisma.job.count({ where: { status: "APPROVED" } }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-700 to-brand-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              شبكة — منصة التوظيف المحلية
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-brand-100">
              نربط العمال وأصحاب العمل في الداخل العربي. ابحث عن وظائف في البناء،
              الصيانة، المطاعم، النقل، والعديد من المهن الأخرى. أو انشر وظيفتك
              واعثر على العمالة المناسبة في منطقتك.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/register?role=worker"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-800 hover:bg-brand-50"
              >
                أنا عامل — سجل الآن
              </Link>
              <Link
                href="/register?role=employer"
                className="rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                أنا صاحب عمل — سجل الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-sand-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-4 px-4 py-10 sm:px-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-700">{workerCount}</div>
            <div className="mt-1 text-sm text-gray-600">عامل مسجل</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-700">{companyCount}</div>
            <div className="mt-1 text-sm text-gray-600">شركة مسجلة</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-700">{jobCount}</div>
            <div className="mt-1 text-sm text-gray-600">وظيفة متاحة</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-gray-900">كيف تعمل المنصة؟</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-sand-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
              1
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">سجل حسابك</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              سجل كعامل أو صاحب عمل باستخدام رقم هاتفك. جميع الحسابات الجديدة تخضع
              لمراجعة الإدارة قبل التفعيل.
            </p>
          </div>
          <div className="rounded-xl border border-sand-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
              2
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">ابحث أو انشر</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              العمال يمكنهم تصفح لوحة الوظائف والتواصل مع الشركات. الشركات يمكنها
              نشر الوظائف والبحث عن العمال في دليل العمال.
            </p>
          </div>
          <div className="rounded-xl border border-sand-200 bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
              3
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">تواصل وتوظف</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              تواصل مباشرة مع الطرف الآخر أو أرسل طلب انضمام. النظام يحمي معلومات
              التواصل حتى يتم الموافقة.
            </p>
          </div>
        </div>
      </section>

      {/* Trades */}
      <section className="border-t border-sand-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">المهن والقطاعات</h2>
          <p className="mt-3 text-center text-gray-600">
            نغطي مجموعة واسعة من المهن اليدوية والخدمات
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              "بناء وأعمال عامة",
              "سائق شاحنة / توصيل",
              "صيانة وتكييف",
              "كهرباء وصحي",
              "مطاعم وضيافة",
              "مخازن وتغليف",
              "تنظيفات",
              "حدادة وألمنيوم",
              "دهانات وتشطيبات",
              "أمن وحراسة",
            ].map((trade) => (
              <span
                key={trade}
                className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800"
              >
                {trade}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold">جاهز للبدء؟</h2>
          <p className="mt-3 text-brand-100">
            انضم إلى شبكة اليوم وابدأ البحث عن عمل أو نشر وظائفك
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/register"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-800 hover:bg-brand-50"
            >
              سجل الآن
            </Link>
            <Link
              href="/jobs"
              className="rounded-lg border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              تصفح الوظائف
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
