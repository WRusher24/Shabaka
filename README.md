# شبكة (Shabaka) — منصة التوظيف المحلية

منصة شبكة تربط العمال وأصحاب العمل في الداخل العربي. وظائف، فرص يومية، ومهن يدوية في منطقتك.

A dual-sided workforce marketplace connecting Arab employers and non-graduate workers in the '48 territories.

---

## Features

- **Dual-role system**: Workers (عامل) and Employers (صاحب عمل)
- **Admin approval gate**: All new accounts and job listings require admin approval
- **Worker directory**: Browse workers by trade, town, and availability
- **Company directory**: Browse companies by industry and town
- **Job board**: Daily shifts, gigs, and full-time jobs with flexible hours
- **Join requests**: Workers can apply to companies without sharing contact info
- **Interest notifications**: Employers can express interest in workers
- **Contact system**: Feedback and inquiries from any visitor
- **Full RTL Arabic interface** with Tailwind CSS logical properties
- **Mobile-first responsive design**

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Auth**: HMAC-signed session cookies + bcrypt password hashing
- **Validation**: Zod

---

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Initialize database with seed data
npm run db:setup

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Login Credentials

| Role     | Phone       | Password    |
|----------|-------------|-------------|
| Admin    | 0500000001  | Password123 |
| Worker   | 0541234567  | Password123 |
| Employer | 046543210   | Password123 |

---

## Project Structure

```
shabaka/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── admin/         # Admin dashboard
│   │   ├── api/           # API routes
│   │   ├── companies/     # Company directory
│   │   ├── company/       # Company profile
│   │   ├── contact/       # Contact page
│   │   ├── employer/      # Employer dashboard
│   │   ├── job/           # Job detail
│   │   ├── jobs/          # Job board
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration
│   │   ├── worker/        # Worker profile
│   │   ├── workers/       # Worker directory
│   │   └── worker/        # Worker dashboard
│   ├── components/        # React components
│   └── lib/               # Utilities (auth, db, validation)
├── .env.example           # Environment template
├── DEPLOYS_GUIDE.md       # Deployment guide
└── ADMIN_GUIDE.md         # Admin guide
```

---

## Documentation

- [DEPLOYS_GUIDE.md](./DEPLOYS_GUIDE.md) — How to deploy to production
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) — How to use the admin dashboard

---

## License

Proprietary — All rights reserved.
