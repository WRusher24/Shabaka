# DEPLOYS_GUIDE.md — شبكة (Shabaka) Deployment Guide

This guide covers how to run the شبكة (Shabaka) workforce platform locally and deploy it to production.

---

## Table of Contents

1. [Local Development](#local-development)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Production Build](#production-build)
5. [Deployment Options](#deployment-options)
6. [DNS & Custom Domain](#dns--custom-domain)
7. [SSL](#ssl)

---

## Local Development

### Prerequisites

- **Node.js** 18.17 or later (LTS recommended)
- **npm** 9 or later
- **Git** (optional, for version control)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd shabaka

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# Initialize the database
npm run db:setup

# Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

### Default Login Credentials (after seeding)

| Role     | Phone       | Password    |
|----------|-------------|-------------|
| Admin    | 0500000001  | Password123 |
| Worker   | 0541234567  | Password123 |
| Employer | 046543210   | Password123 |

---

## Environment Variables

Create a `.env` file in the project root:

```env
# SQLite database file path (relative to prisma/ directory)
DATABASE_URL="file:./dev.db"

# Secret for signing session cookies — MUST be a long random string in production
SESSION_SECRET="your-long-random-secret-string-here"
```

### Production Recommendations

- **DATABASE_URL**: Use a managed PostgreSQL or MySQL database in production. Update the Prisma schema `provider` accordingly.
- **SESSION_SECRET**: Generate with `openssl rand -base64 64` or similar. Never commit this to version control.

---

## Database Setup

### Using SQLite (default, great for development)

```bash
# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed

# Or do both at once
npm run db:setup
```

### Using PostgreSQL (recommended for production)

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/shabaka"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

---

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

The production server runs on port 3000 by default. Set the `PORT` environment variable to change it.

---

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the simplest option for Next.js apps.

1. **Push to GitHub/GitLab/Bitbucket**
2. **Import project** at [vercel.com/new](https://vercel.com/new)
3. **Configure environment variables** in Project Settings → Environment Variables:
   - `DATABASE_URL`
   - `SESSION_SECRET`
4. **Deploy** — Vercel auto-detects Next.js and configures everything

**Note**: Vercel uses serverless functions. SQLite won't work on Vercel's ephemeral filesystem. Use PostgreSQL (e.g., [Neon](https://neon.tech), [Supabase](https://supabase.com), or [PlanetScale](https://planetscale.com)) for the database.

### Option 2: Netlify

1. **Push to GitHub**
2. **Import project** at [netlify.com](https://netlify.com)
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. **Add environment variables** in Site Settings → Environment
5. **Deploy**

### Option 3: VPS / Dedicated Server (DigitalOcean, AWS EC2, Hetzner, etc.)

```bash
# On your server
git clone <repository-url>
cd shabaka
npm install
npm run db:setup
npm run build

# Use PM2 to keep the process running
npm install -g pm2
pm2 start npm --name "shabaka" -- start
pm2 save
pm2 startup
```

### Option 4: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t shabaka .
docker run -p 3000:3000 --env-file .env shabaka
```

---

## DNS & Custom Domain

### Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `shabaka.example.com`)
3. Update your DNS records as instructed by Vercel:
   - **A record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`

### Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS:
   - **A record**: `75.2.60.5`
   - **CNAME**: `your-site.netlify.app`

### VPS with Nginx

```nginx
server {
    listen 80;
    server_name shabaka.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## SSL

### Vercel / Netlify

SSL is **automatic** — both platforms provision and renew Let's Encrypt certificates for custom domains.

### VPS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d shabaka.example.com

# Auto-renewal is set up automatically
```

### Cloudflare

If using Cloudflare as your DNS provider:
1. Set SSL/TLS mode to **Full (strict)**
2. Enable **Always Use HTTPS**
3. Enable **Automatic HTTPS Rewrites**

---

## Post-Deployment Checklist

- [ ] Change default admin credentials
- [ ] Set a strong `SESSION_SECRET`
- [ ] Configure a production database (PostgreSQL/MySQL)
- [ ] Set up automated database backups
- [ ] Configure error monitoring (Sentry, etc.)
- [ ] Set up log aggregation
- [ ] Test the full user flow: register → approve → post job → approve → apply
- [ ] Verify RTL layout renders correctly
- [ ] Test on mobile devices
