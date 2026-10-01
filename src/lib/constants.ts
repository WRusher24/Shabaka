/// Shared domain constants for شبكة (Shabaka).

export const TRADES = [
  "بناء وأعمال عامة",
  "سائق شاحنة / توصيل",
  "صيانة وتكييف",
  "كهرباء وصحي",
  "مطاعم وضيافة",
  "مخازن وتغليف",
  "تنظيفات",
  "حدادة وألمنيوم",
  "دهانات وتشطيبات",
  "نجارة وأثاث",
  "زراعة وأعمال خارجية",
  "أمن وحراسة",
  "أخرى",
] as const;

export const INDUSTRIES = [
  "بناء ومقاولات",
  "صيانة وخدمات منزلية",
  "مطاعم وضيافة",
  "تجارة وتجزئة",
  "نقل وتوصيل",
  "زراعة",
  "صناعة وورش",
  "تنظيفات وخدمات",
  "أمن وحراسة",
  "تعليم ورعاية",
  "أخرى",
] as const;

/// Standard list of Arab '48 towns. Users may also type a custom town.
export const TOWNS = [
  "الناصرة",
  "أم الفحم",
  "رهط",
  "سخنين",
  "الطيبة",
  "شفاعمرو",
  "حيفا",
  "يافا",
  "الخضيرة",
  "كفر قاسم",
  "كفر كنا",
  "عرابة",
  "مجدل شمس",
  "دالية الكرمل",
  "عكا",
  "نهاريا",
  "بني عرافة",
  "جسر الزرقاء",
  "الطيرة",
  "اللد",
  "الرملة",
  "قلنسوة",
  "طولكرم",
  "نابلس",
  "جنين",
  "رام الله",
  "القدس",
  "بئر السبع",
  "إيلات",
  "أخرى",
] as const;

export const JOB_TYPES = [
  { value: "FULL_TIME", label: "دوام كامل" },
  { value: "PART_TIME", label: "دوام جزئي" },
  { value: "SHIFT", label: "وردية / شفت" },
  { value: "GIG", label: "عمل يومي / مهمة" },
] as const;

export const HOURS_MODES = [
  { value: "EXACT", label: "ساعات محددة" },
  { value: "FLEXIBLE", label: "مرنة" },
  { value: "MULTIPLE", label: "خيارات متعددة" },
] as const;

export const AVAILABILITY = {
  AVAILABLE: "متاح فوراً",
  BUSY: "مشغول",
} as const;

export const USER_STATUS = {
  PENDING: "قيد المراجعة",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
} as const;

export const JOB_STATUS = {
  PENDING: "قيد المراجعة",
  APPROVED: "مقبول",
  REJECTED: "مرفوض",
} as const;

export const JOIN_REQUEST_STATUS = {
  PENDING: "قيد الانتظار",
  ACCEPTED: "مقبول",
  DECLINED: "مرفوض",
} as const;

export const CONTACT_MODES = {
  DIRECT: "تواصل مباشر",
  JOIN_REQUEST: "طلب انضمام",
} as const;
