import Link from "next/link";
import { AVAILABILITY } from "@/lib/constants";

interface WorkerCardProps {
  worker: {
    id: string;
    name: string;
    town: string;
    trade: string;
    yearsExperience: number;
    availability: string;
  };
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const isAvailable = worker.availability === "AVAILABLE";

  return (
    <Link
      href={`/worker/${worker.id}`}
      className="block rounded-xl border border-sand-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{worker.name}</h3>
          <p className="mt-0.5 text-sm text-gray-600">{worker.trade}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isAvailable ? AVAILABILITY.AVAILABLE : AVAILABILITY.BUSY}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {worker.town}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {worker.yearsExperience} سنة خبرة
        </span>
      </div>

      <div className="mt-4 border-t border-sand-100 pt-3">
        <span className="text-sm font-medium text-brand-700">عرض الملف الشخصي ←</span>
      </div>
    </Link>
  );
}
