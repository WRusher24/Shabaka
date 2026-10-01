import Link from "next/link";
import { JOB_TYPES } from "@/lib/constants";
import { formatRelative } from "@/lib/format";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    town: string;
    jobType: string;
    salaryAmount: string | null;
    salaryVisible: boolean;
    hoursMode: string;
    workingHours: string | null;
    workingDays: string | null;
    createdAt: Date;
    company: {
      company: {
        businessName: string;
      } | null;
    };
  };
}

export default function JobCard({ job }: JobCardProps) {
  const jobTypeLabel = JOB_TYPES.find((t) => t.value === job.jobType)?.label || job.jobType;

  return (
    <Link
      href={`/job/${job.id}`}
      className="block rounded-xl border border-sand-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{job.title}</h3>
        <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-800">
          {jobTypeLabel}
        </span>
      </div>

      <p className="mt-1 text-sm text-gray-600">{job.company.company?.businessName}</p>

      <div className="mt-3 space-y-1.5 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.town}
        </div>
        {job.workingHours && (
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.workingHours}
          </div>
        )}
        {job.workingDays && (
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {job.workingDays}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-sand-100 pt-3">
        <div className="flex items-center gap-2">
          {job.salaryVisible && job.salaryAmount && (
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
              {job.salaryAmount} ₪ / شهر
            </span>
          )}
          <span className="text-xs text-gray-400">{formatRelative(job.createdAt)}</span>
        </div>
        <span className="text-sm font-medium text-brand-700">التفاصيل ←</span>
      </div>
    </Link>
  );
}
