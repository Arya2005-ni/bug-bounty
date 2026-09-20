# CyberScope Bug Bounty Management Platform (Full-Stack)

A full-stack cybersecurity bug bounty and vulnerability management platform built with **Next.js 15 (App Router)**, **TypeScript**, **Prisma ORM**, **SQLite**, and **Tailwind CSS**.

---

## 🌟 Architecture & Highlights

- **Full-Stack Next.js 15 App Router**: Server-side and client-side rendering with typed API routes.
- **Prisma ORM & SQLite**: File-based database (`prisma/dev.db`) pre-populated with 10 sample vulnerabilities, 3 users, 2 bounty programs, tools, and methodology steps. Zero external database configuration required.
- **Role-Based Access Control (RBAC)**: Interactive **Role Switcher** in the top navigation bar (`👨‍💻 Researcher`, `🛡️ Triager`, `⚡ Admin`) for testing all permission boundaries in real time.
- **Researcher Workspace (`/researcher`)**:
  - Live vulnerability submission form with CVSS v3.1 calculation.
  - "My Submissions" tracker with real-time lifecycle status badges.
  - Total bounty payouts and reputation score tracking.
- **Triage & Operations Console (`/triage`)**:
  - Live triage queue with search, status filters, and severity filters.
  - Interactive triage drawer to update status (`SUBMITTED`, `TRIAGED`, `ACCEPTED`, `IN_PROGRESS`, `RESOLVED`, `DUPLICATE`, `REJECTED`).
  - Award bounty amounts in USD ($) and post internal/public triage comments.
- **Public Transparency Dashboard (`/`)**:
  - Live executive telemetry cards (total vulnerabilities, critical/high counts, mean CVSS, and total bounties paid).
  - Standardized CVSS v3.1 Severity Guide & Interactive Vector Matrix.
  - 6-Stage Penetration Testing Methodology Stepper.
  - 12 Security Testing Arsenal cards.
  - Remediation Recommendations Matrix.
  - Educational simulation disclaimers.

---

## 🚀 Getting Started

### 1. Start the Development Server
The application runs locally on port 3000:
```bash
npm run dev
```
Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Database Management & Re-seeding
To reset and re-seed the SQLite database with fresh records:
```bash
npx prisma db push
npx prisma db seed
```

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🗄️ Database Models (`prisma/schema.prisma`)

| Model | Description |
|-------|-------------|
| `User` | Stores researchers, triagers, and admins with reputation and bounty totals. |
| `Program` | In-scope bug bounty programs (`*.example.com`, `api.example.com`). |
| `Report` | Vulnerability reports with CVSS vectors, severity, status, reproduction steps, sanitized PoCs, and bounty payouts. |
| `Comment` | Public feedback and internal triage notes linked to reports. |
| `Tool` | Security tools arsenal (Nmap, Burp Suite, ZAP, Metasploit, etc.). |
| `MethodologyStep` | 6-phase testing methodology workflow. |

---

## 🧭 Application Routes

- **`/`**: Public Transparency Dashboard & Assessment Overview
- **`/researcher`**: Researcher Portal & Submission Center
- **`/triage`**: Security Operations & Triage Queue Console
- **`/api/reports`**: GET / POST vulnerability findings
- **`/api/reports/[id]`**: GET / PATCH (status, bounty, severity) / DELETE finding
- **`/api/comments`**: POST triage comments and internal notes
- **`/api/stats`**: Aggregated platform metrics and payout statistics
