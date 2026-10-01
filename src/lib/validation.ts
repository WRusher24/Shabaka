import { z } from "zod";

/// Israeli / Palestinian mobile & landline phone formats, digits and common
/// separators only. A valid phone number is strictly required for all users.
export const phoneSchema = z
  .string()
  .trim()
  .min(9, "رقم الهاتف قصير جداً")
  .max(14, "رقم الهاتف طويل جداً")
  .regex(/^[0-9+\-\s]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط")
  .refine((v) => v.replace(/\D/g, "").length >= 9, "رقم الهاتف يجب أن يحتوي على 9 أرقام على الأقل");

export const emailSchema = z
  .string()
  .trim()
  .email("البريد الإلكتروني غير صالح")
  .max(120, "البريد الإلكتروني طويل جداً")
  .optional()
  .or(z.literal(""));

export const passwordSchema = z
  .string()
  .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
  .max(72, "كلمة المرور طويلة جداً");

export const nameSchema = z
  .string()
  .trim()
  .min(2, "الاسم قصير جداً")
  .max(80, "الاسم طويل جداً");

export const registerWorkerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  town: z.string().trim().min(2, "اسم البلدة قصير جداً").max(60),
  trade: z.string().trim().min(2, "اختر أو اكتب المهنة").max(60),
  yearsExperience: z.coerce.number().int().min(0).max(60),
  bio: z.string().trim().max(1000).optional().or(z.literal("")),
  contactPhone: phoneSchema.optional().or(z.literal("")),
  contactEmail: emailSchema,
  whatsapp: phoneSchema.optional().or(z.literal("")),
});

export const registerEmployerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  businessName: nameSchema,
  town: z.string().trim().min(2, "اسم البلدة قصير جداً").max(60),
  industry: z.string().trim().min(2, "اختر أو اكتب القطاع").max(60),
  industryCustom: z.string().trim().max(60).optional().or(z.literal("")),
  workingHours: z.string().trim().max(120).optional().or(z.literal("")),
  contactMode: z.enum(["DIRECT", "JOIN_REQUEST"]),
  contactPhone: phoneSchema.optional().or(z.literal("")),
  contactEmail: emailSchema,
  about: z.string().trim().max(1500).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const jobSchema = z.object({
  title: z.string().trim().min(3, "العنوان قصير جداً").max(120),
  town: z.string().trim().min(2, "اسم البلدة قصير جداً").max(60),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "SHIFT", "GIG"]),
  salaryAmount: z.string().trim().max(40).optional().or(z.literal("")),
  salaryVisible: z.boolean(),
  hoursMode: z.enum(["EXACT", "FLEXIBLE", "MULTIPLE"]),
  workingHours: z.string().trim().max(200).optional().or(z.literal("")),
  workingDays: z.string().trim().max(200).optional().or(z.literal("")),
  description: z.string().trim().min(10, "الوصف قصير جداً").max(4000),
  requirements: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const joinRequestSchema = z.object({
  companyId: z.string().min(1),
  jobId: z.string().optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: nameSchema,
  contact: z.string().trim().min(5, "معلومات التواصل قصيرة جداً").max(120),
  message: z.string().trim().min(5, "الرسالة قصيرة جداً").max(2000),
});

export const interestSchema = z.object({
  workerId: z.string().min(1),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});
