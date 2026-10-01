import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="rounded-xl border border-sand-200 bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">تواصل معنا</h1>
        <p className="mt-2 text-sm text-gray-600">
          لديك سؤال، اقتراح، أو ملاحظة؟ أرسل لنا رسالة وسنرد عليك في أقرب وقت
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
