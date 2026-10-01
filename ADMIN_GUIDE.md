# ADMIN_GUIDE.md — شبكة (Shabaka) Administrator Guide

This guide explains how to access and use the admin dashboard to manage the شبكة (Shabaka) workforce platform.

---

## Table of Contents

1. [Accessing the Admin Dashboard](#accessing-the-admin-dashboard)
2. [Managing User Approvals](#managing-user-approvals)
3. [Managing Job Listings](#managing-job-listings)
4. [Managing Worker Profiles](#managing-worker-profiles)
5. [Managing Company Profiles](#managing-company-profiles)
6. [Reviewing Feedback](#reviewing-feedback)
7. [Notifications](#notifications)

---

## Accessing the Admin Dashboard

### URL

```
http://localhost:3000/admin
```

In production, replace `localhost:3000` with your domain.

### Default Credentials

| Field    | Value       |
|----------|-------------|
| Phone    | 0500000001  |
| Password | Password123 |

> **Important**: Change the default admin password immediately after first login.

### Access Requirements

- You must be logged in
- Your account must have `role = ADMIN`
- Your account must have `status = APPROVED`

If you try to access `/admin` without being logged in, you will be redirected to the login page.

---

## Managing User Approvals

When a new user registers (worker or employer), their account status is set to **PENDING** (قيد المراجعة). They cannot access gated features until you approve them.

### Viewing Pending Accounts

1. Go to `/admin`
2. Click the **"قيد المراجعة"** tab
3. You will see two sections:
   - **حسابات قيد المراجعة** — Pending user accounts
   - **وظائف قيد المراجعة** — Pending job listings

### Approving a User

1. Find the user in the pending list
2. Click the green **"مقبول"** button
3. The user will immediately be able to access all platform features
4. The user will receive an in-app notification: "تمت الموافقة على حسابك!"

### Rejecting a User

1. Find the user in the pending list
2. Click the **"رفض"** button
3. The user will see a rejection message when they log in
4. The user will receive an in-app notification

### Deleting a User

1. Find the user in any tab
2. Click the **"حذف"** button
3. Confirm the deletion
4. All associated data (profile, jobs, requests) will be permanently deleted

---

## Managing Job Listings

### Approving a Pending Job

1. Go to `/admin` → **"قيد المراجعة"** tab
2. Find the job in the **"وظائف قيد المراجعة"** section
3. Click **"مقبول"** to approve — the job will appear on the public board
4. Click **"رفض"** to reject — the job will not appear on the public board

### Viewing All Jobs

1. Go to `/admin` → **"الوظائف"** tab
2. All jobs are listed with their current status (مقبول / قيد المراجعة / مرفوض)

### Editing a Job

1. Go to `/admin` → **"الوظائف"** tab
2. Click on a job to edit its details
3. Modify the fields as needed
4. Save changes

### Deleting a Job

1. Go to `/admin` → **"الوظائف"** tab
2. Click the **"حذف"** button next to the job
3. Confirm the deletion

---

## Managing Worker Profiles

### Viewing All Workers

1. Go to `/admin` → **"العمال"** tab
2. All registered workers are listed with their:
   - Name
   - Phone number
   - Town
   - Trade
   - Account status

### Editing a Worker Profile

1. Go to `/admin` → **"العمال"** tab
2. Click on a worker to edit their profile
3. Modify fields (name, town, trade, bio, contact info, etc.)
4. Save changes

### Deleting a Worker Profile

1. Go to `/admin` → **"العمال"** tab
2. Click the **"حذف"** button
3. Confirm — the worker profile and associated user account will be deleted

---

## Managing Company Profiles

### Viewing All Companies

1. Go to `/admin` → **"الشركات"** tab
2. All registered companies are listed with their:
   - Business name
   - Town
   - Industry
   - Account status

### Editing a Company Profile

1. Go to `/admin` → **"الشركات"** tab
2. Click on a company to edit their profile
3. Modify fields (business name, town, industry, contact info, etc.)
4. Save changes

### Deleting a Company Profile

1. Go to `/admin` → **"الشركات"** tab
2. Click the **"حذف"** button
3. Confirm — the company profile, associated user account, and all their job listings will be deleted

---

## Reviewing Feedback

The **"تواصل معنا"** (Contact Us) tab shows all feedback submissions from the contact form.

### Viewing Feedback

1. Go to `/admin` → **"التواصل معنا"** tab
2. Each message shows:
   - Sender's name
   - Contact info (email or phone)
   - Message content
   - Submission date
   - Read/unread status

### Marking as Read

1. Find an unread message (highlighted in blue)
2. Click **"تحديد كمقروء"** to mark it as read

---

## Notifications

The admin receives in-app notifications for:

- **New user registrations** — when a worker or employer signs up
- **New job postings** — when a company posts a new job
- **Join requests** — when a worker sends a join request to a company

Notifications appear in the admin dashboard and can be marked as read.

---

## Quick Reference

| Action | Location | Button |
|--------|----------|--------|
| Approve user | `/admin` → قيد المراجعة | مقبول |
| Reject user | `/admin` → قيد المراجعة | رفض |
| Delete user | Any tab | حذف |
| Approve job | `/admin` → قيد المراجعة | مقبول |
| Reject job | `/admin` → قيد المراجعة | رفض |
| Delete job | `/admin` → الوظائف | حذف |
| Mark feedback read | `/admin` → التواصل معنا | تحديد كمقروء |

---

## Security Best Practices

1. **Change default credentials** immediately after setup
2. **Use a strong SESSION_SECRET** — at least 32 random characters
2. **Review all pending accounts** before approving
3. **Monitor job postings** for inappropriate content
4. **Regularly review feedback** for security concerns
5. **Keep dependencies updated** — run `npm audit` periodically
6. **Use HTTPS** in production (see DEPLOYS_GUIDE.md)
7. **Back up the database** regularly
