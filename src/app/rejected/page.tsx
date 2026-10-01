import Link from "next/link";

export default function RejectedPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
      <div className="rounded-xl border border-sand-200 bg-white p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
          ✕
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">لم يتم قبول حسابك</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          نأسف، لم يتم الموافقة على طلب تسجيلك في شبكة. إذا كنت تعتقد أن هذا خطأ،
          يمكنك التواصل معنا للمزيد من المعلومات.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            تواصل معنا
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-sand-100"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
