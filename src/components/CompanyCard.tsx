import Link from "next/link";
import { CONTACT_MODES } from "@/lib/constants";

interface CompanyCardProps {
  company: {
    id: string;
    businessName: string;
    town: string;
    industry: string;
    openingsCount: number;
    workingHours: string | null;
    contactMode: string;
  };
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link
      href={`/company/${company.id}`}
      className="block rounded-xl border border-sand-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{company.businessName}</h3>
          <p className="mt-0.5 text-sm text-gray-600">{company.industry}</p>
        </div>
        <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-800">
          {company.openingsCount} وظائف
        </span>
      </div>

      <div className="mt-3 space-y-1.5 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {company.town}
        </div>
        {company.workingHours && (
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {company.workingHours}
          </div>
        )}
        <div className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {company.contactMode === "DIRECT" ? CONTACT_MODES.DIRECT : CONTACT_MODES.JOIN_REQUEST}
        </div>
      </div>

      <div className="mt-4 border-t border-sand-100 pt-3">
        <span className="text-sm font-medium text-brand-700">عرض الملف الشخصي ←</span>
      </div>
    </Link>
  );
}
