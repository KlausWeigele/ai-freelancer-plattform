# AI-Freelancer-Plattform Deutschland

> Die fairste und intelligenteste Plattform für KI-Talente in Deutschland

**Status:** Phase 3 Complete - Architecture & Initial Setup ✅

---

## 🎯 Projekt-Überblick

Premium AI-Talent-Plattform mit:

- **2% Provision** (vs. 10-16% Markt-Standard)
- **AI-powered Features** (V1.0): Matching, Project Builder, Career Coach
- **3-Tier-System**: Apprentice → Intermediate → Expert
- **Trial Period**: 1 Woche, jederzeit abbrechbar
- **Flexible Verträge**: Milestone, Sprint, Retainer, Time & Material
- **Kuratierte Qualität**: Top 10% Vetting

---

## 🏗️ Tech Stack

### Core

- **Frontend & Backend:** Next.js 16 (App Router, Server Components)
- **Language:** TypeScript 5.9 (Strict Mode)
- **Database:** PostgreSQL 15 (AWS RDS)
- **ORM:** Prisma 6.18
- **API:** tRPC 11.7 (End-to-end Type Safety)
- **Auth:** NextAuth.js v5 (JWT + Refresh Tokens)
- **Styling:** Tailwind CSS 4.1 + shadcn/ui

### Infrastructure

- **Hosting:** AWS (ECS Fargate, RDS, S3, CloudFront)
- **Region:** eu-central-1 (Frankfurt) - DSGVO-compliant
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry + CloudWatch
- **Email:** AWS SES

### Future (V1.0)

- **AI:** Anthropic Claude 3.5 Sonnet
- **Payments:** Stripe
- **Caching:** Redis
- **Vector DB:** pgvector (PostgreSQL extension)

---

## 📁 Project Structure

```
freelancer/
├── .github/workflows/       # CI/CD Pipelines
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md      # Technical Architecture
│   └── adr/                 # Architecture Decision Records
├── prisma/                  # Database Schema & Migrations
│   └── schema.prisma
├── src/
│   ├── app/                 # Next.js App Router (Pages)
│   ├── components/          # React Components
│   │   ├── ui/              # shadcn/ui Components
│   │   ├── forms/           # Form Components
│   │   ├── layouts/         # Layout Components
│   │   └── features/        # Feature-specific Components
│   ├── server/              # Backend (tRPC)
│   │   └── routers/         # API Routers
│   ├── lib/                 # Utilities
│   ├── types/               # TypeScript Types
│   ├── hooks/               # React Hooks
│   └── store/               # State Management (Zustand)
├── tests/                   # Tests (Unit, Integration, E2E)
└── docker/                  # Docker Configuration (Phase 3.5)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 10+ (required)
- PostgreSQL 15
- AWS Account (for deployment)

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Generate Prisma Client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📜 Scripts

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # Run ESLint
pnpm format                 # Format with Prettier
pnpm typecheck              # TypeScript type checking

# Database
pnpm db:generate            # Generate Prisma Client
pnpm db:push                # Push schema to DB (dev)
pnpm db:migrate             # Run migrations
pnpm db:studio              # Open Prisma Studio (GUI)
```

---

## 📚 Documentation

### Phase 1: Business Validation ✅

- [BUSINESS_CASE.md](./BUSINESS_CASE.md) - Complete market analysis
- [PRD.md](./PRD.md) - Product Requirements Document
- [RISK_ASSESSMENT.md](./RISK_ASSESSMENT.md) - Risk analysis & mitigation

### Phase 3: Architecture ✅

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Technical Architecture
- [ADRs](./docs/adr/) - Architecture Decision Records
  - ADR-001: Next.js Full-Stack
  - ADR-002: PostgreSQL + Prisma
  - ADR-003: tRPC API
  - ADR-004: JWT Auth
  - ADR-005: AWS Hosting

### Database

- [Prisma Schema](./prisma/schema.prisma) - Complete DB Schema

---

## 🔒 Security

- ✅ bcrypt Password Hashing (cost 12)
- ✅ JWT with Refresh Tokens (15 min / 7 days)
- ✅ HTTP-only Cookies
- ✅ Input Validation (Zod)
- ✅ SQL Injection Prevention (Prisma)
- ✅ XSS Prevention (React + Sanitization)
- ✅ Rate Limiting (API + Login)
- ✅ HTTPS Only (TLS 1.3)
- ✅ EU Data Residency (DSGVO)
- ✅ Prompt Injection Prevention (V1.0, for AI Features)

---

## 🎯 Roadmap

### MVP (Monat 1-4) - Current Phase

- [x] Phase 1: Business Validation
- [x] Phase 2: PRD
- [x] Phase 3: Architecture & Tech Stack
- [ ] Phase 3.5: Docker Setup
- [ ] Phase 3.6: GitHub & CI/CD
- [ ] Phase 4-6: UX, UI, Backlog
- [ ] Phase 7: Development (3 Monate)
  - User Auth & Profiles
  - Projects & Manual Matching
  - Trial Period & Booking
  - Messages & Payments (Manual)
- [ ] Phase 8-10: Testing, Security, Performance
- [ ] Phase 11: Deployment (MVP Launch)

### V1.0 (Monat 5-12)

- [ ] AI Project Builder
- [ ] AI-Matching (Semantic)
- [ ] AI Career Coach
- [ ] Stripe Payments & Escrow
- [ ] AI Team Assembly

### V2.0+ (Future)

- [ ] Apprenticeship Program (formal)
- [ ] Reviews & Ratings
- [ ] Advanced Analytics
- [ ] Mobile Apps

---

## 💰 Business Model

- **Commission:** 2% auf alle Transaktionen
- **Target:** 100k€ Umsatz im Jahr 1 (5 Mio. € Projektvolumen)
- **Break-even:** Year 1

### Competitive Advantage

1. **Günstig:** 2% vs. 10-16% (Wettbewerb)
2. **AI-Features:** Kein Wettbewerber hat AI-Spezialisierung
3. **Trial Period:** Risiko-Minimierung
4. **Flexible Verträge:** 4 Modelle (Milestone, Sprint, Retainer, T&M)
5. **Kuratiert:** Top 10% Vetting (Qualität)

---

## 🇩🇪 Market Focus

**Target:** Deutschland (DSGVO-compliant)

- 295,000 IT Freelancer
- 149,000 offene IT-Stellen
- 57% AI-Adoption (doubled since 2022)
- 700-1,200€/Tag Rates (AI/ML Experts)

**NO German platform has AI specialization** → First-Mover Advantage

---

## 📞 Contact

**Developer:** Max Mustermann
**Status:** Solo Developer (MVP Phase)

---

## 📄 License

Private Project - All Rights Reserved

---

**Generated with:** [Claude Code](https://claude.com/claude-code)

**Date:** 27. Oktober 2025
