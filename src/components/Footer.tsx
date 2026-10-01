import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-sand-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-lg font-bold text-white">
                ش
              </span>
              <span className="text-lg font-bold text-brand-800">شبكة</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              منصة التوظيف المحلية التي تربط العمال وأصحاب العمل في الداخل العربي.
              وظائف، فرص يومية، ومهن يدوية في منطقتك.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">روابط سريعة</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link href="/workers" className="hover:text-brand-700">دليل العمال</Link></li>
              <li><Link href="/companies" className="hover:text-brand-700">دليل الشركات</Link></li>
              <li><Link href="/jobs" className="hover:text-brand-700">لوحة الوظائف</Link></li>
              <li><Link href="/contact" className="hover:text-brand-700">تواصل معنا</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">تواصل معنا</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>البريد: info@shabaka.local</li>
              <li>الهاتف: 04-000-0000</li>
              <li>العنوان: الناصرة، الداخل العربي</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-sand-200 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} شبكة — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
