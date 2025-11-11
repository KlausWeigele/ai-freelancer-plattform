# AI-Freelancer-Plattform - Project CLAUDE.md

**🔄 Living Document** - Update nach jedem Major Milestone oder neuen Erkenntnissen
**Last Updated:** 2025-11-10 (Session 1 - Sonnet 4.5)

---

## 🎯 Project Context

### Vision
Online-Marktplatz für AI/IT-Freelancer in Deutschland mit Fokus auf:
- Transparente Projektvermittlung
- Faire Konditionen für Freelancer
- DSGVO-konform
- Deutsche Sprache & Kultur

### Deployment Goal
**Target:** weigele.art (CloudFront → ALB → ECS Fargate → RDS PostgreSQL)
**Region:** eu-central-1 (Frankfurt)
**Timeline:** Phase 1-7, aktuell in Phase 1

### Team Structure
- **Klaus Weigele** – Product Owner, Vision, Decisions
- **AI Agents:** Claude Code, Codex – Aufgaben und Rollen werden pro Session/Task von Klaus zugewiesen (keine feste Vorab-Zuordnung). Beide Agents können sowohl App‑Features als auch Infra/CI übernehmen; Vorschläge willkommen, Entscheidung bei Klaus.

**Workflow:** Feature-Branches → PR-Review → Merge → TODO.md Tracking

---

## 📊 Current Implementation Status

### Phase 0: Existing Infrastructure ✅ COMPLETE (9/9)
- ✅ CloudFront Distribution (E2EBJUQH6VGZWO) existiert
- ✅ Route 53 Hosted Zone (weigele.art) konfiguriert
- ✅ ACM Certificate (*.weigele.art) validiert
- ✅ S3 Bucket für Terraform State existiert
- ✅ DynamoDB für State Locking gelöscht (kostensparend)
- ✅ AWS Cost von $36/Monat auf $0.60/Monat reduziert

### Phase 1: Next.js Production Optimizations ⚠️ PARTIAL (3/3 lokal, CI blocked)
- ✅ **Standalone Output aktiviert** (next.config.js:20)
  - Reduziert Docker Image von ~1GB auf ~150MB
  - `.next/standalone` build erfolgreich (147MB)
- ✅ **Health Check Endpoint** (src/app/api/health/route.ts)
  - `GET /api/health` → 200 (DB connected) oder 503 (disconnected)
  - Lokal getestet und funktioniert
- ✅ **Version Endpoint** (src/app/api/version/route.ts)
  - `GET /api/version` → { version, commit, buildTime, environment }
  - Lokal getestet: v0.1.0, commit 17754e1, Node v22.20.0
- ⚠️ **CI Pipeline:** Code Quality, Tests, Build funktionieren
- ❌ **Docker Build:** Blockiert (pnpm-lock.yaml fehlt) - **AKTUELLER BLOCKER**

**Codex Update:** Hat ESLint 9 Flat Config migriert, Lint re-enabled (Commits: 6089dde, b76c7a3)

### Phase 2-7: Pending
- Phase 2: AWS Account Setup (IAM, ECR, Secrets)
- Phase 3: Terraform Infrastructure (VPC, RDS, ECS, ALB)
- Phase 4: CloudFront Configuration
- Phase 5: GitHub Actions Integration
- Phase 6: Database Migrations
- Phase 7: Production Rollout

**Tracking:** Siehe TODO.md für vollständige Task-Liste (39 Tasks total)

---

## 🛠️ Development Standards

### Technology Stack

**Core:**
- **Framework:** Next.js 16.0.0 (Full Stack, SSR, App Router)
- **Runtime:** Node.js 22.20.0
- **Language:** TypeScript 5.9.3 (strict mode)
- **Package Manager:** pnpm 10.11.1 ⚠️ (Bleeding-Edge, Lock-File Issues)

**Frontend:**
- React 19.2.0
- Tailwind CSS 4.1.16
- Responsive Design, Mobile-First

**Backend:**
- tRPC 11.7.0 (Type-safe API)
- Prisma 6.18.0 (ORM)
- PostgreSQL 15 (RDS geplant)
- JWT Authentication (geplant)

**Infrastructure:**
- Docker (Multi-Stage Builds)
- AWS ECS Fargate (Container Orchestration)
- AWS RDS PostgreSQL (Managed Database)
- AWS CloudFront (CDN, SSL Termination)
- AWS ALB (Load Balancing)
- Terraform (Infrastructure as Code)

**CI/CD:**
- GitHub Actions (ci.yml, nightly.yml, deploy-production.yml)
- ESLint 9.x (Flat Config seit Codex Update)
- Prettier 3.2.5
- Docker Build & Push zu ECR

### Code Quality Standards

**Linting:**
- ESLint 9.x mit Flat Config (eslint.config.js)
- Extends: next/core-web-vitals
- ⚠️ **Known Issue:** Next.js 16.0.0 hatte CLI Lint Bug, Codex hat zu ESLint direkt migriert

**Formatting:**
- Prettier (automatisch via CI)
- Format-Check blockiert Merges

**Type Safety:**
- TypeScript Strict Mode aktiviert
- No implicit any
- Type-Check in CI Pipeline

**Testing:**
- Unit Tests geplant (Jest/Vitest)
- Integration Tests geplant
- E2E Tests geplant (Playwright)
- Aktuell: Tests in CI disabled (noch keine Tests implementiert)

### Patterns & Conventions

**File Structure:**
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (Health, Version)
│   ├── (routes)/          # Page Routes
│   └── layout.tsx         # Root Layout
├── components/
│   ├── layouts/           # Layout Components
│   └── ui/                # UI Components (planned)
├── lib/
│   └── db.ts              # Prisma Client
└── server/                # tRPC Router (planned)
```

**API Endpoints:**
- `/api/health` - Health Check (DB connection)
- `/api/version` - Version Info (commit, buildTime)
- `/api/trpc/*` - tRPC API (planned)

**Naming Conventions:**
- Components: PascalCase
- Files: kebab-case oder camelCase
- API Routes: lowercase

**Git Workflow:**
- Branch: Feature-Branches (feature/*, fix/*, chore/*)
- Commits: Conventional Commits (feat:, fix:, chore:, docs:, style:, refactor:)
- Footer: "🤖 Generated with [Claude Code]" + Co-Authored-By: Claude

---

## 🚀 Quick Setup & Development

### Prerequisites
```bash
Node.js: 22.x
pnpm: 10.11.1
PostgreSQL: 15 (local dev or Docker)
```

### Environment Setup
```bash
# 1. Clone & Install
git clone https://github.com/KlausWeigele/ai-freelancer-plattform.git
cd ai-freelancer-plattform
pnpm install

# 2. Environment Variables
cp .env.example .env.local
# Edit .env.local:
# DATABASE_URL="postgresql://..."
# NEXTAUTH_SECRET="..."
# NEXTAUTH_URL="http://localhost:3000"

# 3. Database Setup
pnpm prisma migrate dev
pnpm prisma generate

# 4. Run Dev Server
pnpm dev
# → http://localhost:3000
```

### Common Commands
```bash
pnpm dev              # Development Server (Port 3000)
pnpm build            # Production Build
pnpm start            # Production Server
pnpm lint             # ESLint (direkt, nicht next lint)
pnpm format           # Prettier Format
pnpm format:check     # Prettier Check
pnpm type-check       # TypeScript Check
pnpm prisma studio    # Database GUI
```

### Docker Build (Local)
```bash
docker build -t ai-freelancer-plattform .
docker run -p 3000:3000 ai-freelancer-plattform
```

### Health Checks
```bash
# Development
curl http://localhost:3000/api/health
curl http://localhost:3000/api/version

# Production (nach Deployment)
curl https://weigele.art/api/health
curl https://weigele.art/api/version
```

---

## 🔧 Configuration Details

### Next.js Configuration (next.config.js)

**Key Settings:**
```javascript
{
  output: 'standalone',           // Docker optimization (150MB vs 1GB)
  reactStrictMode: true,          // Development warnings
  swcMinify: true,                // Fast minification
  experimental: {
    typedRoutes: true             // Type-safe routing
  }
}
```

### TypeScript Configuration (tsconfig.json)

**Strict Mode:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext"
  }
}
```

### Database Schema (prisma/schema.prisma)

**Models:**
- User (Freelancer, Client, Admin)
- Profile (Skills, Bio, Hourly Rate)
- Project (Title, Description, Budget)
- Bid (Freelancer bids on Projects)
- Message (Communication)
- Review (Rating & Feedback)

**Status:** Schema definiert, Migrations noch nicht ausgeführt

### Environment Variables

**Required:**
```bash
DATABASE_URL          # PostgreSQL Connection String
NEXTAUTH_SECRET       # JWT Secret (generate with: openssl rand -base64 32)
NEXTAUTH_URL          # App URL (http://localhost:3000 dev, https://weigele.art prod)
```

**Optional:**
```bash
NEXT_PUBLIC_APP_URL   # Public App URL
AWS_REGION            # eu-central-1
AWS_ACCOUNT_ID        # For ECR
```

---

## 🐛 Known Issues & Workarounds

### 1. Next.js 16.0.0 Lint CLI Bug (RESOLVED by Codex)
**Status:** ✅ Fixed
**Issue:** `next lint` interpretierte "lint" als Verzeichnisname
**Solution:** Codex migrierte zu ESLint 9 Flat Config, nutzt `eslint .` direkt
**Commits:** 6089dde, b76c7a3

### 2. pnpm 10.11.1 Lock-File Generation (ACTIVE)
**Status:** ❌ Aktiv (Docker Build blockiert)
**Issue:** pnpm 10.11.1 generiert `pnpm-lock.yaml` nicht automatisch
**Impact:** Docker Build schlägt fehl (COPY pnpm-lock.yaml not found)
**Solution Options:**
- A) Lock-File committen: `pnpm install --lockfile-only` (EMPFOHLEN)
- B) Dockerfile anpassen (nicht production-ready)
- C) Docker Build temporär disablen
**Next Action:** Codex oder nächste Session sollte Option A wählen

### 3. CI/CD Performance (Workaround Active)
**Status:** ⚠️ Workaround
**Issue:** pnpm cache disabled wegen fehlender Lock-File
**Impact:** Langsamere CI-Runs (keine Dependency Cache)
**Solution:** Nach Lock-File-Commit: Cache re-enablen in Workflows
**Files:** .github/workflows/ci.yml, nightly.yml, deploy-production.yml

### 4. Tests Not Implemented Yet
**Status:** 📝 TODO
**Issue:** Test-Suite noch nicht implementiert
**Impact:** Tests in CI disabled (Step mit `if: false`)
**Next:** Test-Setup als Teil von Phase 1.5 oder 2

---

## 📈 Quality Metrics & Performance Targets

### Build Metrics (Current)
- **Build Time:** ~30-60s (Next.js build)
- **Standalone Size:** 147 MB (ohne Docker)
- **Docker Image Size:** ~300-500 MB Target (mit Node.js Alpine)
- **Type-Check Time:** ~5-10s

### Performance Targets (Production)
- **Time to First Byte (TTFB):** < 200ms
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s (Core Web Vital)
- **Cumulative Layout Shift (CLS):** < 0.1
- **First Input Delay (FID):** < 100ms

### Availability Targets
- **Uptime:** 99.9% (ECS Auto-Scaling)
- **RTO (Recovery Time Objective):** < 15 minutes
- **RPO (Recovery Point Objective):** < 5 minutes

### Cost Targets
- **Current AWS:** $0.60/month (Route 53 only)
- **Estimated Production:** $50-100/month
  - ECS Fargate: $25-40/month (2 Tasks, 0.5 vCPU, 1GB RAM)
  - RDS t4g.micro: $15-20/month
  - ALB: $10-15/month
  - CloudFront: $5-10/month (CDN)
  - Route 53: $0.60/month

---

## 🚀 Enhancement Ideas & Future Development

### Phase 1.5: Testing Foundation (Priority: High)
- [ ] Jest/Vitest setup
- [ ] Unit Tests für Health/Version Endpoints
- [ ] Integration Tests für API Routes
- [ ] CI Test-Coverage Reports

### Phase 2.5: Monitoring & Observability (Priority: High)
- [ ] CloudWatch Dashboards
- [ ] Application Insights (Logs, Metrics, Traces)
- [ ] Error Tracking (Sentry oder AWS X-Ray)
- [ ] Performance Monitoring (Core Web Vitals)
- [ ] Cost Alerts (AWS Budgets)

### Phase 3.5: Security Hardening (Priority: Medium)
- [ ] AWS WAF Configuration (DDoS Protection)
- [ ] Security Headers (CSP, HSTS, etc.)
- [ ] Penetration Testing
- [ ] DSGVO Compliance Audit
- [ ] Secrets Rotation Strategy

### Phase 4: Feature Development (Priority: Medium)
- [ ] User Authentication (NextAuth.js mit JWT)
- [ ] Freelancer Profile CRUD
- [ ] Project Listing & Search
- [ ] Bid System
- [ ] Messaging System
- [ ] Review & Rating System
- [ ] Payment Integration (Stripe?)

### Phase 5: Advanced Features (Priority: Low)
- [ ] AI-Powered Project Matching
- [ ] Real-time Notifications (WebSockets)
- [ ] Analytics Dashboard für Klaus
- [ ] Multi-Language Support (i18n)
- [ ] Mobile App (React Native?)

### Tech Debt / Improvements
- [ ] Downgrade zu stabileren Versions? (Next.js 15.x, pnpm 9.x)
- [ ] Lock-File Strategy langfristig festlegen
- [ ] CI Performance Optimization (Cache, Parallelisierung)
- [ ] Docker Multi-Arch Builds (ARM64 support)

---

## 📚 Related Documentation

**Project Docs:**
- `README.md` - Project Overview
- `TODO.md` - Task Tracking (39 Tasks, 8 Phases)
- `SESSIONS.md` - Team Session Log (Sonnet/Codex Sync)
- `PRD.md` - Product Requirements Document
- `BUSINESS_CASE.md` - Business Model & Analysis
- `RISK_ASSESSMENT.md` - Risk Analysis

**Architecture Docs:**
- `docs/ARCHITECTURE.md` - System Architecture Overview
- `docs/deployment-guide.md` - Deployment Instructions
- `docs/adr/` - Architecture Decision Records (6 ADRs)
  - 001: Next.js Full-Stack
  - 002: PostgreSQL + Prisma
  - 003: tRPC API
  - 004: JWT Auth Strategy
  - 005: AWS Hosting
  - 006: Terraform IaC

**Infrastructure:**
- `terraform/README.md` - Terraform Setup Instructions
- `docker/README.md` - Docker Configuration Guide
- `.github/workflows/` - CI/CD Pipeline Definitions

---

## 🔄 Update History

### 2025-11-10 (Session 1 - Sonnet 4.5)
- ✅ Initial CLAUDE.md created
- ✅ Phase 0-1 Status dokumentiert
- ✅ Known Issues: Next.js 16 Lint Bug, pnpm Lock-File
- ✅ CI/CD Debugging: 10 Iterationen dokumentiert
- ✅ Tech Stack & Standards definiert
- ✅ Enhancement Ideas gesammelt

### Next Update Triggers:
- [ ] Nach Phase 1 Completion (Docker Build fixed)
- [ ] Nach Phase 2 (AWS Setup complete)
- [ ] Nach Terraform Infrastructure Deployment
- [ ] Bei neuen Known Issues oder Workarounds
- [ ] Bei Major Technology Decisions
- [ ] Mindestens einmal pro Woche während aktiver Development

---

## 💡 Lessons Learned (Running Log)

### 2025-11-10 (Session 1)
1. **Bleeding-Edge = Bleeding Time**
   - Next.js 16.0.0, pnpm 10.11.1, ESLint 9.x kombiniert = 2h CI-Debugging
   - Lesson: Für Production LTS/Stable Versions bevorzugen
   - Action: TODO für Version-Stability-Review nach Phase 1

2. **Lock-Files sind nicht optional**
   - Ohne Lock-File: Non-deterministic builds, Docker Build failure
   - Lesson: Lock-Files IMMER committen, auch bei pnpm 10.x
   - Action: Lock-File generation erzwingen

3. **Local ≠ CI Environment**
   - macOS (local) vs Linux (CI) unterschiedliches Behavior
   - Lesson: Docker Build lokal testen vor Git Push
   - Action: Pre-Push Hook mit Docker Build Check

4. **Team Workflow mit Multiple AI Models funktioniert**
   - Sonnet (Analyse) + Codex (Implementation) = Effektive Aufgabenteilung
   - Lesson: SESSIONS.md als Sync-Point ist essentiell
   - Action: Workflow beibehalten, nach 1-2 Wochen Review

---

**🤖 This is a Living Document - Update it regularly!**
**Next Update:** Nach Docker Build Fix oder Phase 2 Start
