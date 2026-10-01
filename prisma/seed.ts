import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const password = bcrypt.hashSync("Password123", 10);

async function main() {
  console.log("🌱 Seeding شبكة (Shabaka) database...");

  // Wipe existing data (order matters for FK constraints)
  await prisma.notification.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.joinRequest.deleteMany();
  await prisma.job.deleteMany();
  await prisma.workerProfile.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.user.deleteMany();

  // ── Admin ──────────────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      role: "ADMIN",
      status: "APPROVED",
      name: "مدير المنصة",
      email: "admin@shabaka.local",
      phone: "0500000001",
      password,
    },
  });

  // ── Workers ────────────────────────────────────────────────────────────
  const workers = [
    {
      name: "أحمد محمود خليل",
      phone: "0541234567",
      town: "الناصرة",
      trade: "بناء وأعمال عامة",
      yearsExperience: 12,
      availability: "AVAILABLE",
      bio: "عامل بناء بخبرة 12 سنة في الأعمال العامة، البناء بالطوب والحجر، صب الخرسانة، والمباني السكنية. متاح للعمل الفوري في جميع مناطق الجليل.",
      contactPhone: "0541234567",
      contactEmail: "ahmad.khalil@example.com",
      whatsapp: "0541234567",
    },
    {
      name: "محمد سامي عيسى",
      phone: "0529876543",
      town: "أم الفحم",
      trade: "سائق شاحنة / توصيل",
      yearsExperience: 8,
      availability: "AVAILABLE",
      bio: "سائق شاحنة برخصة فئة 4، خبرة في توصيل البضائع داخل البلاد وخارجها. أعرف جميع الطرق الرئيسية. متاح للعمل بنظام الورديات.",
      contactPhone: "0529876543",
      contactEmail: "mohammad.issa@example.com",
      whatsapp: "0529876543",
    },
    {
      name: "خالد عبدالله حسن",
      phone: "0505551234",
      town: "سخنين",
      trade: "صيانة وتكييف",
      yearsExperience: 15,
      availability: "BUSY",
      bio: "فني تكييف وتبريد معتمد، خبرة في تركيب وصيانة أنظمة التكييف المركزي والمنزلي، تصليح الثلاجات والفريزرات. حاصل على شهادة من معهد تقني.",
      contactPhone: "0505551234",
      contactEmail: "khaled.hassan@example.com",
      whatsapp: "0505551234",
    },
    {
      name: "يوسف إبراهيم قاسم",
      phone: "0533334444",
      town: "الطيبة",
      trade: "كهرباء وصحي",
      yearsExperience: 10,
      availability: "AVAILABLE",
      bio: "كهربائي معتمد من وزارة البنية التحتية، خبرة في التركيبات الكهربائية للمباني الجديدة، صيانة لوحات الكهرباء، وأنظمة السباكة والصحي.",
      contactPhone: "0533334444",
      contactEmail: "yousef.qasem@example.com",
      whatsapp: "0533334444",
    },
    {
      name: "سامي ناصر علي",
      phone: "0544445555",
      town: "شفاعمرو",
      trade: "مطاعم وضيافة",
      yearsExperience: 6,
      availability: "AVAILABLE",
      bio: "طباخ محترف بخبرة في المطاعم العربية والغربية، إتقان الشواء والمقبلات والحلويات الشرقية. عملت في مطاعم في حيفا والناصرة.",
      contactPhone: "0544445555",
      contactEmail: "sami.ali@example.com",
      whatsapp: "0544445555",
    },
    {
      name: "عمر فؤاد إبراهيم",
      phone: "0556667777",
      town: "رهط",
      trade: "مخازن وتغليف",
      yearsExperience: 4,
      availability: "AVAILABLE",
      bio: "عامل مخازن وتغليف، خبرة في تشغيل الرافعات الشوكية، ترتيب المخزون، وتغليف الطلبات للشحن. سريع ودقيق في العمل.",
      contactPhone: "0556667777",
      contactEmail: "omar.ibrahim@example.com",
      whatsapp: "0556667777",
    },
    {
      name: "حسن محمد عبدالرحمن",
      phone: "0567778888",
      town: "كفر قاسم",
      trade: "تنظيفات",
      yearsExperience: 7,
      availability: "AVAILABLE",
      bio: "عامل تنظيفات محترف، خبرة في تنظيف المباني السكنية والتجارية، تنظيف الواجهات الزجاجية، وتعقيم الأماكن العامة. أمتلك معدات تنظيف حديثة.",
      contactPhone: "0567778888",
      contactEmail: "hassan.abdelrahman@example.com",
      whatsapp: "0567778888",
    },
    {
      name: "علي حسين جابر",
      phone: "0578889999",
      town: "يافا",
      trade: "حدادة وألمنيوم",
      yearsExperience: 20,
      availability: "BUSY",
      bio: "حداد وألمنيوم بخبرة 20 سنة، تصنيع وتركيب الأبواب والنوافذ والدرابزين، أعمال اللحام والتشكيل المعدني. جودة عمل مضمونة.",
      contactPhone: "0578889999",
      contactEmail: "ali.jaber@example.com",
      whatsapp: "0578889999",
    },
    {
      name: "محمود سعيد خليل",
      phone: "0589990000",
      town: "عرابة",
      trade: "دهانات وتشطيبات",
      yearsExperience: 9,
      availability: "AVAILABLE",
      bio: "دهان محترف بخبرة في الدهانات الداخلية والخارجية، معالجة الجدران، تركيب الجبس بورد، والتشطيبات النهائية. اهتمام بالتفاصيل والجودة.",
      contactPhone: "0589990000",
      contactEmail: "mahmoud.khalil@example.com",
      whatsapp: "0589990000",
    },
    {
      name: "نبيل أحمد يوسف",
      phone: "0590001111",
      town: "الخضيرة",
      trade: "أمن وحراسة",
      yearsExperience: 5,
      availability: "AVAILABLE",
      bio: "حارس أمن مرخص، خبرة في حراسة المنشآت التجارية والسكنية، أنظمة المراقبة، والتعامل مع حالات الطوارئ. لياقة بدنية ممتازة.",
      contactPhone: "0590001111",
      contactEmail: "nabil.yousef@example.com",
      whatsapp: "0590001111",
    },
  ];

  for (const w of workers) {
    await prisma.user.create({
      data: {
        role: "WORKER",
        status: "APPROVED",
        name: w.name,
        email: w.contactEmail,
        phone: w.phone,
        password,
        worker: {
          create: {
            name: w.name,
            phone: w.phone,
            town: w.town,
            trade: w.trade,
            yearsExperience: w.yearsExperience,
            availability: w.availability,
            bio: w.bio,
            contactPhone: w.contactPhone,
            contactEmail: w.contactEmail,
            whatsapp: w.whatsapp,
          },
        },
      },
    });
  }

  // ── Companies ──────────────────────────────────────────────────────────
  const companies = [
    {
      name: "شركة البناء الحديث للمقاولات",
      phone: "046543210",
      town: "الناصرة",
      industry: "بناء ومقاولات",
      workingHours: "الأحد - الخميس: 07:00 - 17:00",
      contactMode: "DIRECT",
      contactPhone: "046543210",
      contactEmail: "info@modern-build.example.com",
      about: "شركة مقاولات رائدة تأسست عام 2005، متخصصة في بناء المشاريع السكنية والتجارية في منطقة الجليل. نبحث دائماً عن عمال بناء محترفين للانضمام لفريقنا.",
    },
    {
      name: "مطعم الأصالة العربي",
      phone: "048765432",
      town: "حيفا",
      industry: "مطاعم وضيافة",
      workingHours: "يومياً: 10:00 - 23:00",
      contactMode: "DIRECT",
      contactPhone: "048765432",
      contactEmail: "manager@asala-restaurant.example.com",
      about: "مطعم عربي أصيل في قلب حيفا، نقدم المأكولات الشعبية الطازجة. نبحث عن طباخين وعمال نظافة للعمل بنظام ورديات مرنة.",
    },
    {
      name: "مؤسسة النقل السريع",
      phone: "039876543",
      town: "الطيبة",
      industry: "نقل وتوصيل",
      workingHours: "الأحد - السبت: 05:00 - 20:00",
      contactMode: "JOIN_REQUEST",
      contactPhone: "",
      contactEmail: "hr@fast-transport.example.com",
      about: "مؤسسة نقل وتوصيل تعمل في جميع أنحاء البلاد. نبحث عن سائقين محترفين للعمل في أسطولنا. يتم التواصل مع المرشحين المناسبين عبر طلبات الانضمام.",
    },
    {
      name: "شركة الصيانة المنزلية المتكاملة",
      phone: "097654321",
      town: "هرتسليا",
      industry: "صيانة وخدمات منزلية",
      workingHours: "الأحد - الخميس: 08:00 - 18:00",
      contactMode: "DIRECT",
      contactPhone: "097654321",
      contactEmail: "service@home-maintenance.example.com",
      about: "شركة متخصصة في الصيانة المنزلية الشاملة: كهرباء، سباكة، تكييف، وأعمال الحدادة. نبحث عن فنيين معتمدين للعمل في منطقة شارون.",
    },
    {
      name: "مصنع الأمل للتغليف",
      phone: "086543210",
      town: "رهط",
      industry: "صناعة وورش",
      workingHours: "الأحد - الخميس: 06:00 - 15:00",
      contactMode: "JOIN_REQUEST",
      contactPhone: "",
      contactEmail: "jobs@alamal-factory.example.com",
      about: "مصنع تغليف وتعبئة يعمل منذ 15 سنة. نوفر فرص عمل في خطوط الإنتاج والتغليف. يتم التوظيف عبر طلبات الانضمام فقط.",
    },
    {
      name: "شركة الأمن والحراسة المتقدمة",
      phone: "076543210",
      town: "بئر السبع",
      industry: "أمن وحراسة",
      workingHours: "ورديات 24 ساعة",
      contactMode: "DIRECT",
      contactPhone: "076543210",
      contactEmail: "recruit@advanced-security.example.com",
      about: "شركة أمن وحراسة مرخصة من وزارة العدل، نوفر خدمات الحراسة للمنشآت التجارية والسكنية في النقب. نبحث عن حراس أمن مرخصين.",
    },
  ];

  for (const c of companies) {
    await prisma.user.create({
      data: {
        role: "EMPLOYER",
        status: "APPROVED",
        name: c.name,
        email: c.contactEmail || undefined,
        phone: c.phone,
        password,
        company: {
          create: {
            businessName: c.name,
            town: c.town,
            industry: c.industry,
            openingsCount: 3,
            workingHours: c.workingHours,
            contactMode: c.contactMode,
            contactPhone: c.contactPhone || null,
            contactEmail: c.contactEmail || null,
            about: c.about,
          },
        },
      },
    });
  }

  // ── Jobs ───────────────────────────────────────────────────────────────
  const jobs = [
    {
      title: "عامل بناء للعمل في مشروع سكني",
      companyName: "شركة البناء الحديث للمقاولات",
      town: "الناصرة",
      jobType: "FULL_TIME",
      salaryAmount: "8500",
      salaryVisible: true,
      hoursMode: "EXACT",
      workingHours: "07:00 - 17:00",
      workingDays: "الأحد - الخميس",
      description: "مطلوب عامل بناء محترف للعمل في مشروع سكني جديد في الناصرة. العمل يشمل البناء بالطوب، صب الخرسانة، والتشطيبات الأولية. بيئة عمل منظمة ورواتب شهرية ثابتة.",
      requirements: "خبرة سابقة في أعمال البناء لا تقل عن 3 سنوات. القدرة على العمل تحت الضغط. إحضار معدات الحماية الشخصية.",
      status: "APPROVED",
    },
    {
      title: "طباخ للعمل في مطعم عربي",
      companyName: "مطعم الأصالة العربي",
      town: "حيفا",
      jobType: "FULL_TIME",
      salaryAmount: "7000",
      salaryVisible: true,
      hoursMode: "EXACT",
      workingHours: "10:00 - 22:00",
      workingDays: "الأحد - الخميس",
      description: "مطلوب طباخ محترف للعمل في مطبخ المطعم. تحضير الأطباق العربية التقليدية: المشاوي، المقبلات، والحلويات. العمل في فريق ودود وبيئة نظيفة.",
      requirements: "خبرة في الطبخ العربي لا تقل عن سنتين. معرفة بقواعد النظافة والسلامة الغذائية. شهادة صحية سارية المفعول.",
      status: "APPROVED",
    },
    {
      title: "سائق شاحنة لتوصيل البضائع",
      companyName: "مؤسسة النقل السريع",
      town: "الطيبة",
      jobType: "FULL_TIME",
      salaryAmount: "9000",
      salaryVisible: false,
      hoursMode: "FLEXIBLE",
      workingHours: "مرنة",
      workingDays: "الأحد - السبت",
      description: "مطلوب سائق شاحنة برخصة فئة 4 للعمل في توصيل البضائع داخل البلاد. العمل بنظام الورديات المرنة مع إمكانية اختيار الأوقات المناسبة.",
      requirements: "رخصة قيادة فئة 4 سارية المفعول. خبرة قيادة لا تقل عن 3 سنوات. معرفة جيدة بالطرق الرئيسية.",
      status: "APPROVED",
    },
    {
      title: "فني تكييف وتبريد",
      companyName: "شركة الصيانة المنزلية المتكاملة",
      town: "هرتسليا",
      jobType: "PART_TIME",
      salaryAmount: "4500",
      salaryVisible: true,
      hoursMode: "MULTIPLE",
      workingOptions: "صباحاً أو مساءً",
      workingHours: "خيارات متعددة",
      workingDays: "الأحد - الخميس",
      description: "مطلوب فني تكييف للعمل بنظام الدوام الجزئي. تركيب وصيانة أنظمة التكييف المنزلية والتجارية. إمكانية اختيار الورديات الصباحية أو المسائية.",
      requirements: "خبرة في صيانة التكييف لا تقل عن سنتين. شهادة تقنية معتمدة. امتلاك سيارة شخصية.",
      status: "APPROVED",
    },
    {
      title: "عامل تعبئة وتغليف",
      companyName: "مصنع الأمل للتغليف",
      town: "رهط",
      jobType: "SHIFT",
      salaryAmount: "5500",
      salaryVisible: true,
      hoursMode: "EXACT",
      workingHours: "06:00 - 15:00",
      workingDays: "الأحد - الخميس",
      description: "مطلوب عمال تعبئة وتغليف للعمل على خط الإنتاج. عمل روتيني ومنظم مع رواتب شهرية ومزايا اجتماعية.",
      requirements: "لا يشترط خبرة سابقة. القدرة على العمل الوقوف لفترات طويلة. الالتزام بالمواعيد.",
      status: "APPROVED",
    },
    {
      title: "حارس أمن لحراسة مجمع تجاري",
      companyName: "شركة الأمن والحراسة المتقدمة",
      town: "بئر السبع",
      jobType: "SHIFT",
      salaryAmount: "6000",
      salaryVisible: true,
      hoursMode: "MULTIPLE",
      workingOptions: "ورديات نهار وليل",
      workingHours: "خيارات متعددة",
      workingDays: "يومياً",
      description: "مطلوب حراس أمن مرخصين لحراسة مجمع تجاري في بئر السبع. ورديات نهارية وليلية مع إمكانية الاختيار.",
      requirements: "رخصة حارس أمن سارية المفعول. لياقة بدنية جيدة. لا يوجد سجل إجرامي.",
      status: "APPROVED",
    },
    {
      title: "دهان محترف لتشطيب شقق",
      companyName: "شركة البناء الحديث للمقاولات",
      town: "الناصرة",
      jobType: "GIG",
      salaryAmount: "1200",
      salaryVisible: true,
      hoursMode: "FLEXIBLE",
      workingHours: "مرنة",
      workingDays: "حسب المشروع",
      description: "مطلوب دهان محترف للعمل في تشطيب شقق سكنية. العمل بنظام المشاريع مع حرية اختيار الوقت المناسب.",
      requirements: "خبرة في الدهانات الداخلية والخارجية. إتقان استخدام الرشاشات والفرش. أعمال سابقة يمكن عرضها.",
      status: "PENDING",
    },
    {
      title: "عامل نظافة لمبنى إداري",
      companyName: "شركة الصيانة المنزلية المتكاملة",
      town: "هرتسليا",
      jobType: "PART_TIME",
      salaryAmount: "3500",
      salaryVisible: true,
      hoursMode: "EXACT",
      workingHours: "07:00 - 13:00",
      workingDays: "الأحد - الخميس",
      description: "مطلوب عامل نظافة لمبنى إداري من 5 طوابق. عمل صباحي ثابت مع إمكانية العمل الإضافي في فترة الظهر.",
      requirements: "خبرة في تنظيف المباني الإدارية. الالتزام بالمواعيد والنظافة الشخصية.",
      status: "PENDING",
    },
  ];

  for (const j of jobs) {
    const company = await prisma.user.findFirst({
      where: { name: j.companyName, role: "EMPLOYER" },
      include: { company: true },
    });
    if (!company) continue;
    await prisma.job.create({
      data: {
        title: j.title,
        companyId: company.id,
        companyProfileId: company.company?.id || null,
        town: j.town,
        jobType: j.jobType,
        salaryAmount: j.salaryAmount,
        salaryVisible: j.salaryVisible,
        hoursMode: j.hoursMode,
        workingHours: j.workingHours,
        workingDays: j.workingDays,
        description: j.description,
        requirements: j.requirements,
        status: j.status,
      },
    });
  }

  // ── Contact messages ───────────────────────────────────────────────────
  await prisma.contactMessage.createMany({
    data: [
      {
        name: "فاطمة أحمد",
        contact: "0541112233",
        message: "شكراً على المنصة الرائعة! هل يمكن إضافة قسم للعمل عن بُعد؟",
        read: false,
      },
      {
        name: "شركة التقنية المتقدمة",
        contact: "info@tech-advanced.example.com",
        message: "نرغب في الإعلان عن وظائف تقنية على المنصة. كيف يمكننا التواصل مع الإدارة؟",
        read: false,
      },
      {
        name: "سارة محمود",
        contact: "sara@example.com",
        message: "واجهت مشكلة في تسجيل الدخول برقم الهاتف. هل يمكن المساعدة؟",
        read: true,
      },
    ],
  });

  console.log("✅ Seed complete!");
  console.log("   Admin: admin@shabaka.local / Password123");
  console.log("   Workers: 0541234567 / Password123 (أحمد محمود خليل)");
  console.log("   Employers: 046543210 / Password123 (شركة البناء الحديث)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
