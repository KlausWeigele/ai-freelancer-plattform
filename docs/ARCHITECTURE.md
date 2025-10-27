# Architecture & Technical Design
# AI-Freelancer-Plattform Deutschland

**Version:** 1.0
**Datum:** 27. Oktober 2025
**Status:** In Progress

---

## Document History

| Version | Datum | Änderungen |
|---------|-------|------------|
| 1.0 | 2025-10-27 | Initial Architecture Design |

---

## 1. Technical Requirements Summary

Aus dem PRD extrahierte technische Anforderungen:

### 1.1 Scale & Performance
- **MVP Target:** 50 concurrent users
- **V1.0 Target:** 500+ users
- **Expected Data:**
  - 50 Freelancer (MVP) → 100 (V1.0)
  - 30 Firmen (MVP) → 50 (V1.0)
  - 30 Projekte (MVP) → 100 (V1.0)
- **Performance:** <2s Page Load, <500ms API Response

### 1.2 Security Requirements
- HTTPS only (TLS 1.3)
- DSGVO-Compliance (EU Data Residency)
- Password Hashing (bcrypt, cost 12+)
- JWT Tokens (Access 15min, Refresh 7d)
- Rate Limiting (100 req/min per IP, 5 login attempts/15min)
- Input Sanitization (XSS, SQL Injection Prevention)
- Prompt Injection Prevention (V1.0 für AI-Features)
- Bot Spam Prevention (hCaptcha, Honeypots)

### 1.3 Integration Requirements
- **Email:** Transactional Emails (Verification, Notifications)
- **Payments:** Manual (MVP) → Stripe (V1.0)
- **AI:** Anthropic Claude API (V1.0 für AI-Features)
- **Monitoring:** Sentry, CloudWatch

### 1.4 Resource Constraints
- **Developer:** Solo (1 Person)
- **Timeline:** 3 Monate MVP Development
- **Budget:** 18k€ Pre-Launch, 2k€/Monat Running

---

## 2. Tech Stack Decision

### 2.1 Final Tech Stack

#### Frontend
```yaml
Framework: Next.js 14+ (App Router)
Language: TypeScript 5.0+
Styling: Tailwind CSS 3.x + shadcn/ui
State Management: Zustand (global state) + React Context (auth)
Forms: React Hook Form + Zod Validation
HTTP Client: Fetch API (native) + tRPC Client
```

#### Backend
```yaml
Runtime: Node.js 20 LTS
Framework: Next.js 14+ (API Routes + Server Actions)
Language: TypeScript 5.0+
API Pattern: tRPC (end-to-end type safety)
Auth: NextAuth.js v5 (next-auth@beta)
Validation: Zod
Email: Nodemailer + AWS SES (später)
Cron Jobs: Vercel Cron oder GitHub Actions
```

#### Database
```yaml
Primary DB: PostgreSQL 15 (AWS RDS)
ORM: Prisma 5.x
Migrations: Prisma Migrate
Connection Pool: Prisma Connection Pool (Max 10)
Future: Redis (V1.0 für Caching/Sessions)
```

#### AI Stack (V1.0)
```yaml
LLM: Anthropic Claude 3.5 Sonnet
Framework: Separate Python FastAPI Microservice
Vector DB: pgvector (PostgreSQL extension)
Embedding Model: text-embedding-3-small (OpenAI)
```

#### Infrastructure & Deployment
```yaml
Hosting: AWS (Primary)
  - Compute: ECS Fargate (Container)
  - Database: RDS PostgreSQL (eu-central-1)
  - Storage: S3 (File Storage)
  - CDN: CloudFront
  - Monitoring: CloudWatch
Container: Docker + docker-compose
CI/CD: GitHub Actions
Domain: [TBD] (AI-Match.de, ExpertFlow.de)
SSL: AWS Certificate Manager
```

#### Development Tools
```yaml
Package Manager: pnpm (required by user preference)
Version Control: Git + GitHub
Code Quality:
  - ESLint (Next.js Config + Prettier)
  - Prettier (Code Formatting)
  - TypeScript Strict Mode
Testing:
  - Unit: Vitest
  - Integration: Vitest + Supertest
  - E2E: Playwright
Error Tracking: Sentry
```

### 2.2 Why This Stack?

**Next.js 14+ (Full-Stack)**
- ✅ Unified codebase (Frontend + Backend)
- ✅ App Router: Server Components, Server Actions
- ✅ Great TypeScript support
- ✅ Built-in optimizations (Images, Fonts, Code Splitting)
- ✅ Easy deployment (Vercel, AWS, Docker)
- ✅ Solo-dev friendly

**PostgreSQL + Prisma**
- ✅ Relational data model (Users, Projects, Bookings)
- ✅ ACID compliance (Critical für Payments)
- ✅ Prisma: Best-in-class TypeScript ORM
- ✅ pgvector extension (für AI-Features V1.0)
- ✅ AWS RDS: Managed, Backups, Scaling

**tRPC**
- ✅ End-to-end type safety (Frontend ↔ Backend)
- ✅ No code generation needed
- ✅ Perfect für TypeScript Full-Stack
- ✅ Better DX als REST für solo dev
- ❌ NOT public API (nur internal)

**AWS**
- ✅ EU Data Residency (Frankfurt)
- ✅ DSGVO-Compliance
- ✅ Mature ecosystem
- ✅ RDS, ECS, S3, CloudFront
- ❌ Complexity (aber notwendig für Production)

**Tailwind CSS + shadcn/ui**
- ✅ Utility-first CSS (schnelle Entwicklung)
- ✅ shadcn/ui: Copy-paste Components (kein Heavy Framework)
- ✅ Customizable, Type-safe
- ✅ Great für Prototyping

---

## 3. Architecture Decision Records (ADRs)

ADRs werden in separatem Folder dokumentiert: `/docs/adr/`

**Created ADRs:**
- ADR-001: Use Next.js 14 for Full-Stack Framework
- ADR-002: Use PostgreSQL + Prisma for Data Layer
- ADR-003: Use tRPC for Type-Safe API
- ADR-004: Use JWT with Refresh Tokens for Auth
- ADR-005: Use AWS for Hosting (EU Data Residency)
- ADR-006: Use Tailwind CSS + shadcn/ui for UI
- ADR-007: Manual Matching (MVP) → AI-Matching (V1.0)

*(ADRs werden separat erstellt)*

---

## 4. System Architecture

### 4.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                             │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS (TLS 1.3)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   AWS CloudFront (CDN)                       │
│          Static Assets, Images, Edge Caching                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              AWS Application Load Balancer                   │
│            HTTPS Termination, Health Checks                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    AWS ECS Fargate                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │       Next.js Application (Docker Container)        │   │
│  │                                                       │   │
│  │  ┌──────────────────┬──────────────────────────┐   │   │
│  │  │   Frontend       │   Backend API            │   │   │
│  │  │   (React + TSX)  │   (tRPC + Server Actions)│   │   │
│  │  │                  │                           │   │   │
│  │  │  - Pages         │  - Auth Procedures       │   │   │
│  │  │  - Components    │  - User Procedures       │   │   │
│  │  │  - Client State  │  - Project Procedures    │   │   │
│  │  │  - Forms         │  - Booking Procedures    │   │   │
│  │  └──────────────────┴──────────────────────────┘   │   │
│  │                                                       │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │         Prisma ORM (Data Access Layer)     │    │   │
│  │  │  - Type-safe queries                       │    │   │
│  │  │  - Connection pooling                      │    │   │
│  │  │  - Migrations                              │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
       ┌─────────────┼─────────────┬──────────────┐
       │             │             │              │
       ↓             ↓             ↓              ↓
┌─────────────┐ ┌────────────┐ ┌──────────┐ ┌─────────────┐
│   AWS RDS   │ │  AWS SES   │ │  AWS S3  │ │  Sentry     │
│ PostgreSQL  │ │  (Email)   │ │ (Files)  │ │ (Errors)    │
│             │ │            │ │          │ │             │
│ - Users     │ │ - Verify   │ │ - Later  │ │ - Tracking  │
│ - Projects  │ │ - Reset    │ │ - Images │ │ - Alerts    │
│ - Bookings  │ │ - Notif.   │ │ - Docs   │ │             │
└─────────────┘ └────────────┘ └──────────┘ └─────────────┘

      V1.0: Add Redis (Sessions/Cache) + Python AI Service
```

### 4.2 Component Breakdown

#### 4.2.1 Client Layer (Browser)
- **Responsibility:** User Interface, Client-side State, Form Validation
- **Technology:** React 18+ (Server Components + Client Components)
- **Communication:** tRPC Client → Backend

#### 4.2.2 Application Layer (Next.js)
**Frontend:**
- Server Components (default, fast rendering)
- Client Components (interactive, marked with `'use client'`)
- App Router Pages (`/app` directory)
- Layouts & Templates
- Route Handlers (API Routes)

**Backend:**
- tRPC Procedures (Type-safe API)
- Server Actions (mutations)
- Middleware (Auth, CORS, Rate Limiting)
- Cron Jobs (Trial → Active transition)

#### 4.2.3 Data Layer
**PostgreSQL:**
- Relational DB (Users, Projects, Bookings, Messages)
- ACID transactions
- Full-text search (später)
- pgvector (V1.0 für AI Embeddings)

**Prisma ORM:**
- Type-safe queries
- Automatic migrations
- Connection pooling
- Query optimization

#### 4.2.4 External Services
- **AWS SES:** Transactional Emails
- **AWS S3:** File Storage (V1.0)
- **Sentry:** Error Tracking
- **Anthropic API:** AI Features (V1.0)
- **Stripe:** Payments (V1.0)

### 4.3 Data Flow

**Example: Firma bucht Freelancer**

```
1. User clicks "Book Freelancer" (Browser)
   ↓
2. tRPC Client calls: bookings.create({ freelancerId, projectId })
   ↓
3. Next.js Backend receives request
   ↓
4. Middleware validates JWT token (NextAuth)
   ↓
5. tRPC Procedure validates input (Zod schema)
   ↓
6. Prisma creates ProjectBooking record (DB Transaction)
   ↓
7. Email Notification sent (AWS SES)
   ↓
8. Response returned to Client (tRPC)
   ↓
9. UI updates (Optimistic Update)
```

---

## 5. Database Schema Design

*(Separate file: `/docs/DATABASE_SCHEMA.md` with full Prisma schema)*

**Preview: Core Models**

### 5.1 Prisma Schema Overview

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enums
enum UserRole {
  FREELANCER
  COMPANY
  ADMIN
}

enum FreelancerStatus {
  PENDING_REVIEW
  ACTIVE
  REJECTED
}

enum ExperienceLevel {
  APPRENTICE
  INTERMEDIATE
  EXPERT
}

enum ProjectStatus {
  OPEN
  PROPOSALS_SENT
  TRIAL_ACTIVE
  ACTIVE
  COMPLETED
  CANCELLED
  DISPUTED
  PAID
  CLOSED
}

enum BookingStatus {
  PENDING_ACCEPTANCE
  TRIAL_ACTIVE
  ACTIVE
  COMPLETED
  CANCELLED
  DISPUTED
  PAID
  CLOSED
}

enum BudgetRange {
  LESS_10K
  RANGE_10_20K
  RANGE_20_50K
  RANGE_50_100K
  MORE_100K
}

enum DurationEstimate {
  ONE_TWO_WEEKS
  TWO_FOUR_WEEKS
  ONE_THREE_MONTHS
  THREE_SIX_MONTHS
  MORE_SIX_MONTHS
}

enum RemoteType {
  REMOTE
  ONSITE
  HYBRID
}

enum ContractModel {
  MILESTONE
  SPRINT
  RETAINER
  TIME_MATERIAL
}

enum CompanySize {
  SIZE_1_10
  SIZE_11_50
  SIZE_51_200
  SIZE_201_1000
  MORE_1000
}

enum PaymentStatus {
  PENDING
  PAID
  PAYOUT_COMPLETE
}

// Models
model User {
  id             String    @id @default(uuid())
  email          String    @unique
  passwordHash   String    @map("password_hash")
  emailVerified  Boolean   @default(false) @map("email_verified")
  role           UserRole
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")
  lastLogin      DateTime? @map("last_login")

  // Relations
  freelancerProfile FreelancerProfile?
  companyProfile    CompanyProfile?
  messages          Message[]

  @@index([email])
  @@map("users")
}

model FreelancerProfile {
  id                    String            @id @default(uuid())
  userId                String            @unique @map("user_id")
  name                  String
  location              String
  bio                   String?           @db.Text
  skills                String[]          // Array of skill tags
  experienceLevel       ExperienceLevel   @map("experience_level")
  dayRate               Int               @map("day_rate") // in Euro
  availableFrom         DateTime?         @map("available_from")
  daysPerWeek           Int               @map("days_per_week") // 1-5
  portfolioUrl          String?           @map("portfolio_url")
  portfolioDescription  String?           @map("portfolio_description") @db.Text
  status                FreelancerStatus
  rejectionReason       String?           @map("rejection_reason") @db.Text
  createdAt             DateTime          @default(now()) @map("created_at")
  updatedAt             DateTime          @updatedAt @map("updated_at")

  // Relations
  user     User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  bookings ProjectBooking[]

  @@index([status])
  @@index([experienceLevel])
  @@map("freelancer_profiles")
}

model CompanyProfile {
  id          String       @id @default(uuid())
  userId      String       @unique @map("user_id")
  companyName String       @map("company_name")
  location    String
  website     String?
  description String?      @db.Text
  companySize CompanySize  @map("company_size")
  createdAt   DateTime     @default(now()) @map("created_at")
  updatedAt   DateTime     @updatedAt @map("updated_at")

  // Relations
  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  projects Project[]

  @@map("company_profiles")
}

model Project {
  id               String            @id @default(uuid())
  companyId        String            @map("company_id")
  name             String
  description      String            @db.Text
  skills           String[]          // Array of skill tags
  budgetRange      BudgetRange       @map("budget_range")
  durationEstimate DurationEstimate  @map("duration_estimate")
  startDate        DateTime          @map("start_date")
  remoteType       RemoteType        @map("remote_type")
  contractModel    ContractModel     @map("contract_model")
  status           ProjectStatus
  createdAt        DateTime          @default(now()) @map("created_at")
  updatedAt        DateTime          @updatedAt @map("updated_at")

  // Relations
  company  CompanyProfile   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  bookings ProjectBooking[]

  @@index([companyId])
  @@index([status])
  @@map("projects")
}

model ProjectBooking {
  id              String         @id @default(uuid())
  projectId       String         @map("project_id")
  freelancerId    String         @map("freelancer_id")
  status          BookingStatus
  trialStartDate  DateTime?      @map("trial_start_date")
  trialEndDate    DateTime?      @map("trial_end_date")
  daysWorked      Decimal?       @map("days_worked") @db.Decimal(10, 2)
  totalAmount     Decimal?       @map("total_amount") @db.Decimal(10, 2)
  commission      Decimal?       @db.Decimal(10, 2) // 2% of totalAmount
  freelancerPayout Decimal?      @map("freelancer_payout") @db.Decimal(10, 2)
  createdAt       DateTime       @default(now()) @map("created_at")
  updatedAt       DateTime       @updatedAt @map("updated_at")

  // Relations
  project    Project            @relation(fields: [projectId], references: [id], onDelete: Cascade)
  freelancer FreelancerProfile  @relation(fields: [freelancerId], references: [id], onDelete: Cascade)
  messages   Message[]
  invoice    Invoice?

  @@index([projectId])
  @@index([freelancerId])
  @@index([status])
  @@map("project_bookings")
}

model Message {
  id        String   @id @default(uuid())
  bookingId String   @map("booking_id")
  senderId  String   @map("sender_id")
  content   String   @db.Text // max 5000 chars validated in code
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  booking ProjectBooking @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  sender  User           @relation(fields: [senderId], references: [id], onDelete: Cascade)

  @@index([bookingId])
  @@index([createdAt])
  @@map("messages")
}

model Invoice {
  id               String        @id @default(uuid())
  bookingId        String        @unique @map("booking_id")
  invoiceNumber    String        @unique @map("invoice_number")
  totalAmount      Decimal       @map("total_amount") @db.Decimal(10, 2)
  commission       Decimal       @db.Decimal(10, 2)
  freelancerPayout Decimal       @map("freelancer_payout") @db.Decimal(10, 2)
  paymentStatus    PaymentStatus @map("payment_status")
  createdAt        DateTime      @default(now()) @map("created_at")
  updatedAt        DateTime      @updatedAt @map("updated_at")

  // Relations
  booking ProjectBooking @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@index([paymentStatus])
  @@map("invoices")
}

// V1.0: Add Models for AI Features
// - SkillTrend (für Career Coach)
// - ProjectEmbedding (für AI-Matching)
// - FreelancerEmbedding (für AI-Matching)
```

### 5.2 Key Design Decisions

**1. UUIDs für Primary Keys**
- Besser für distributed systems
- Keine Sequence-Collisions
- Nicht-sequentiell (Security)

**2. snake_case in DB, camelCase in Prisma**
- DB-Convention: snake_case
- TypeScript-Convention: camelCase
- Prisma `@map()` für Mapping

**3. Soft Deletes vs. Hard Deletes**
- Hard Deletes (CASCADE) für MVP
- Später: Soft Deletes für Audit Trail

**4. Enums in DB**
- Type-safe auf DB-Level
- Validierung in DB + Code

**5. Arrays für Skills**
- PostgreSQL native Arrays
- Simple für MVP
- Später: Many-to-Many Relation mit Skills-Table

**6. Decimal für Money**
- `Decimal(10, 2)` für Beträge
- Vermeidet Floating-Point-Fehler

---

## 6. API Design

### 6.1 API Architecture: tRPC

**Why tRPC?**
- ✅ End-to-end type safety (Frontend ↔ Backend)
- ✅ No REST endpoints → Weniger Boilerplate
- ✅ Auto-completion, Type-checking
- ✅ Einfacher für solo dev

**tRPC Router Structure:**

```
src/server/routers/
├── _app.ts              # Root Router
├── auth.ts              # Authentication procedures
├── freelancers.ts       # Freelancer CRUD
├── companies.ts         # Company CRUD
├── projects.ts          # Project CRUD
├── bookings.ts          # Booking procedures
├── messages.ts          # Messaging procedures
├── admin.ts             # Admin procedures (vetting, matching)
└── invoices.ts          # Invoice generation
```

### 6.2 tRPC Procedures Overview

#### Authentication Router

```typescript
// src/server/routers/auth.ts
import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const authRouter = router({
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(8),
      role: z.enum(['FREELANCER', 'COMPANY']),
    }))
    .mutation(async ({ input, ctx }) => {
      // Create user, send verification email
    }),

  verifyEmail: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verify email token, activate account
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Validate credentials, return JWT
    }),

  logout: protectedProcedure
    .mutation(async ({ ctx }) => {
      // Invalidate session
    }),

  requestPasswordReset: publicProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Send password reset email
    }),

  resetPassword: publicProcedure
    .input(z.object({
      token: z.string(),
      newPassword: z.string().min(8),
    }))
    .mutation(async ({ input, ctx }) => {
      // Reset password with token
    }),

  getSession: protectedProcedure
    .query(async ({ ctx }) => {
      // Return current user session
      return ctx.session.user;
    }),
});
```

#### Freelancers Router

```typescript
// src/server/routers/freelancers.ts
export const freelancersRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      location: z.string(),
      bio: z.string().max(500).optional(),
      skills: z.array(z.string()).min(1).max(20),
      experienceLevel: z.enum(['APPRENTICE', 'INTERMEDIATE', 'EXPERT']),
      dayRate: z.number().int().min(300).max(2000),
      availableFrom: z.date().optional(),
      daysPerWeek: z.number().int().min(1).max(5),
      portfolioUrl: z.string().url().optional(),
      portfolioDescription: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Create freelancer profile (status: PENDING_REVIEW)
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      // Get freelancer profile by ID
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      // ... update fields
    }))
    .mutation(async ({ input, ctx }) => {
      // Update freelancer profile (own profile only)
    }),

  list: protectedProcedure // Admin only
    .input(z.object({
      status: z.enum(['PENDING_REVIEW', 'ACTIVE', 'REJECTED']).optional(),
      limit: z.number().int().max(100).default(20),
      offset: z.number().int().default(0),
    }))
    .query(async ({ input, ctx }) => {
      // List freelancers (admin matching)
    }),
});
```

#### Projects Router

```typescript
// src/server/routers/projects.ts
export const projectsRouter = router({
  create: protectedProcedure // Company only
    .input(z.object({
      name: z.string().max(100),
      description: z.string().max(5000),
      skills: z.array(z.string()).min(1).max(10),
      budgetRange: z.enum(['LESS_10K', 'RANGE_10_20K', 'RANGE_20_50K', 'RANGE_50_100K', 'MORE_100K']),
      durationEstimate: z.enum(['ONE_TWO_WEEKS', 'TWO_FOUR_WEEKS', 'ONE_THREE_MONTHS', 'THREE_SIX_MONTHS', 'MORE_SIX_MONTHS']),
      startDate: z.date(),
      remoteType: z.enum(['REMOTE', 'ONSITE', 'HYBRID']),
      contractModel: z.enum(['MILESTONE', 'SPRINT', 'RETAINER', 'TIME_MATERIAL']),
    }))
    .mutation(async ({ input, ctx }) => {
      // Create project (status: OPEN)
      // Send admin notification
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      // Get project details (own project only, or admin)
    }),

  list: protectedProcedure // Admin only
    .input(z.object({
      status: z.enum(['OPEN', 'PROPOSALS_SENT', /* ... */]).optional(),
      limit: z.number().int().max(100).default(20),
      offset: z.number().int().default(0),
    }))
    .query(async ({ input, ctx }) => {
      // List projects (admin matching)
    }),
});
```

#### Bookings Router

```typescript
// src/server/routers/bookings.ts
export const bookingsRouter = router({
  create: protectedProcedure // Company only
    .input(z.object({
      projectId: z.string().uuid(),
      freelancerId: z.string().uuid(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Create booking (status: PENDING_ACCEPTANCE)
      // Send email to freelancer
    }),

  accept: protectedProcedure // Freelancer only
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Accept booking → status: TRIAL_ACTIVE
      // Set trial dates (now + 7 days)
    }),

  decline: protectedProcedure // Freelancer only
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Decline booking
    }),

  cancel: protectedProcedure // Both sides during trial
    .input(z.object({
      id: z.string().uuid(),
      daysWorked: z.number().min(0.5),
    }))
    .mutation(async ({ input, ctx }) => {
      // Cancel booking → status: CANCELLED
      // Calculate partial payment
    }),

  complete: protectedProcedure // Either side
    .input(z.object({
      id: z.string().uuid(),
      daysWorked: z.number().min(0.5),
    }))
    .mutation(async ({ input, ctx }) => {
      // Mark as completed → status: PENDING_COMPLETION (wait for other side)
    }),

  confirmCompletion: protectedProcedure // Other side confirms
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // Both confirmed → status: COMPLETED
      // Generate invoice
    }),
});
```

### 6.3 REST Fallback (for Webhooks, External APIs)

**Use Cases:**
- Stripe Webhooks (V1.0)
- Health Check Endpoint
- Future: Public API for Partners

**Endpoints:**

```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: Date.now() });
}

// src/app/api/webhooks/stripe/route.ts (V1.0)
export async function POST(request: Request) {
  // Handle Stripe webhook
}
```

---

## 7. Authentication & Authorization

### 7.1 Authentication Strategy

**Approach: JWT with Refresh Tokens**

```
┌─────────────────────────────────────────┐
│           Login Flow                    │
└─────────────────────────────────────────┘

1. User submits email + password
   ↓
2. Server validates credentials (bcrypt)
   ↓
3. Server generates:
   - Access Token (JWT, 15min)
   - Refresh Token (JWT, 7d)
   ↓
4. Access Token → Memory (Client State)
   Refresh Token → HTTP-only Cookie
   ↓
5. All API requests: Authorization: Bearer <access>
   ↓
6. Access Token expired? → Use Refresh Token
   ↓
7. New Access Token returned
```

**Token Structure:**

```typescript
// Access Token (JWT)
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "FREELANCER",
  "exp": 1234567890 // 15 minutes
}

// Refresh Token (JWT)
{
  "userId": "uuid",
  "tokenId": "uuid", // for revocation
  "exp": 1234567890 // 7 days
}
```

**Implementation (NextAuth.js):**

```typescript
// src/lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            freelancerProfile: true,
            companyProfile: true,
          },
        });

        if (!user || !user.emailVerified) return null;

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 15 * 60, // 15 minutes (access token)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId;
      session.user.role = token.role;
      return session;
    },
  },
});
```

### 7.2 Authorization Strategy

**Role-Based Access Control (RBAC)**

```typescript
// Roles
enum UserRole {
  FREELANCER
  COMPANY
  ADMIN
}

// Middleware: protectedProcedure (tRPC)
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  });
});

// Middleware: adminProcedure
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.session.user.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next();
});

// Middleware: companyProcedure
export const companyProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.session.user.role !== 'COMPANY') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next();
});

// Middleware: freelancerProcedure
export const freelancerProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.session.user.role !== 'FREELANCER') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next();
});
```

**Resource Ownership Checks:**

```typescript
// Example: User can only update own profile
freelancersRouter.update = protectedProcedure
  .input(z.object({ id: z.string().uuid(), /* ... */ }))
  .mutation(async ({ input, ctx }) => {
    const profile = await prisma.freelancerProfile.findUnique({
      where: { id: input.id },
    });

    if (profile.userId !== ctx.session.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    // Update profile
  });
```

---

## 8. Project Structure

```
freelancer/
├── .github/
│   └── workflows/
│       ├── ci.yml                  # CI: Lint, Test, Build
│       ├── nightly.yml             # Nightly Cron Jobs
│       └── deploy-production.yml   # Production Deployment
├── prisma/
│   ├── schema.prisma               # Database Schema
│   ├── migrations/                 # Migration History
│   └── seed.ts                     # Seed Data (Development)
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                 # Auth Route Group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/            # Protected Dashboard Group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx        # List Projects
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Project Details
│   │   │   └── messages/
│   │   │       └── [bookingId]/
│   │   │           └── page.tsx
│   │   ├── (admin)/                # Admin Route Group
│   │   │   └── admin/
│   │   │       ├── freelancers/
│   │   │       │   └── page.tsx    # Vetting
│   │   │       ├── projects/
│   │   │       │   └── page.tsx    # Matching
│   │   │       └── bookings/
│   │   │           └── page.tsx    # Payment Management
│   │   ├── api/
│   │   │   ├── trpc/
│   │   │   │   └── [trpc]/
│   │   │   │       └── route.ts    # tRPC Handler
│   │   │   ├── health/
│   │   │   │   └── route.ts        # Health Check
│   │   │   └── webhooks/           # (V1.0)
│   │   │       └── stripe/
│   │   │           └── route.ts
│   │   ├── layout.tsx              # Root Layout
│   │   ├── page.tsx                # Homepage
│   │   └── globals.css             # Global Styles
│   ├── components/
│   │   ├── ui/                     # shadcn/ui Components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── forms/                  # Form Components
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── project-form.tsx
│   │   │   └── profile-form.tsx
│   │   ├── layouts/                # Layout Components
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── sidebar.tsx
│   │   └── features/               # Feature-specific Components
│   │       ├── projects/
│   │       │   ├── project-card.tsx
│   │       │   └── project-list.tsx
│   │       ├── freelancers/
│   │       │   └── freelancer-card.tsx
│   │       └── messaging/
│   │           └── chat-interface.tsx
│   ├── server/
│   │   ├── routers/                # tRPC Routers
│   │   │   ├── _app.ts             # Root Router
│   │   │   ├── auth.ts
│   │   │   ├── freelancers.ts
│   │   │   ├── companies.ts
│   │   │   ├── projects.ts
│   │   │   ├── bookings.ts
│   │   │   ├── messages.ts
│   │   │   ├── admin.ts
│   │   │   └── invoices.ts
│   │   ├── trpc.ts                 # tRPC Setup
│   │   └── context.ts              # tRPC Context (Session, DB)
│   ├── lib/
│   │   ├── db.ts                   # Prisma Client
│   │   ├── auth.ts                 # NextAuth Config
│   │   ├── email.ts                # Email Service (Nodemailer)
│   │   ├── utils.ts                # Helper Functions
│   │   └── validations.ts          # Zod Schemas
│   ├── types/
│   │   ├── index.ts                # Shared Types
│   │   └── prisma.ts               # Prisma Type Helpers
│   ├── hooks/                      # React Hooks
│   │   ├── use-session.ts
│   │   ├── use-toast.ts
│   │   └── use-form-validation.ts
│   ├── store/                      # Zustand Store
│   │   └── auth-store.ts
│   └── config/
│       └── site.ts                 # Site Configuration
├── tests/
│   ├── unit/                       # Unit Tests (Vitest)
│   │   ├── utils.test.ts
│   │   └── validations.test.ts
│   ├── integration/                # Integration Tests
│   │   └── api/
│   │       ├── auth.test.ts
│   │       └── bookings.test.ts
│   └── e2e/                        # E2E Tests (Playwright)
│       ├── auth.spec.ts
│       ├── booking-flow.spec.ts
│       └── trial-period.spec.ts
├── docs/
│   ├── ARCHITECTURE.md             # This file
│   ├── DATABASE_SCHEMA.md          # Detailed DB Schema
│   ├── API_DOCS.md                 # API Documentation
│   └── adr/                        # Architecture Decision Records
│       ├── 001-nextjs-fullstack.md
│       ├── 002-postgresql-prisma.md
│       └── ...
├── docker/
│   ├── Dockerfile                  # Production Dockerfile
│   └── docker-compose.yml          # Local Development
├── .env.example                    # Environment Variables Template
├── .env.local                      # Local Env (gitignored)
├── .eslintrc.json                  # ESLint Config
├── .prettierrc                     # Prettier Config
├── tsconfig.json                   # TypeScript Config
├── tailwind.config.ts              # Tailwind Config
├── next.config.js                  # Next.js Config
├── vitest.config.ts                # Vitest Config
├── playwright.config.ts            # Playwright Config
├── package.json                    # Dependencies
├── pnpm-lock.yaml                  # pnpm Lockfile
└── README.md                       # Project Documentation
```

---

## 9. Security Architecture

### 9.1 Security Checklist

✅ **Authentication**
- [x] bcrypt password hashing (cost 12)
- [x] JWT tokens with expiration
- [x] HTTP-only cookies for refresh tokens
- [x] Email verification required
- [x] Password reset flow (1h expiration)
- [x] Rate limiting on login (5 attempts / 15min)

✅ **Input Validation**
- [x] Zod schemas for all inputs
- [x] Client-side + Server-side validation
- [x] SQL injection prevention (Prisma parameterized queries)
- [x] XSS prevention (React auto-escaping + DOMPurify für user content)
- [x] CSRF protection (SameSite cookies)

✅ **API Security**
- [x] Rate limiting (100 req/min per IP)
- [x] Authentication on protected endpoints
- [x] Authorization checks (user owns resource)
- [x] CORS configuration (own domain only)

✅ **Data Security**
- [x] HTTPS only (TLS 1.3)
- [x] HSTS header enabled
- [x] Environment variables for secrets
- [x] No secrets in code or git
- [x] EU Data Residency (AWS Frankfurt)

✅ **Infrastructure Security**
- [x] Dependabot enabled (GitHub)
- [x] Regular security audits (pnpm audit)
- [x] Database backups (AWS RDS automated)
- [x] Principle of least privilege (IAM roles)

### 9.2 Prompt Injection Prevention (V1.0)

**See PRD Section 6.2 NFR-007a for details**

**Key Strategies:**
1. Input Sanitization (Blacklist dangerous patterns)
2. Secure Prompt Structure (Claude `system` parameter)
3. System-Prompt Protection (Constants, not user-modifiable)
4. Output Validation (Check for leaks, PII)
5. Rate Limiting (10 AI calls/hour per user)
6. Monitoring & Logging (CloudWatch, Sentry)
7. Content Moderation (Pre/Post AI-Call checks)

---

## 10. Performance Architecture

### 10.1 Performance Targets

| Metric | MVP Target | V1.0 Target |
|--------|-----------|-------------|
| LCP (Largest Contentful Paint) | <2s | <1.5s |
| FID (First Input Delay) | <100ms | <50ms |
| CLS (Cumulative Layout Shift) | <0.1 | <0.05 |
| API Response Time (p95) | <500ms | <300ms |
| Database Query Time (avg) | <100ms | <50ms |
| Concurrent Users | 50 | 500+ |

### 10.2 Performance Strategies

**Frontend:**
- [x] Next.js Server Components (reduce client JS)
- [x] Code Splitting (automatic via Next.js)
- [x] Image Optimization (next/image)
- [x] Lazy Loading (React.lazy for heavy components)
- [x] CDN (CloudFront for static assets)
- [x] Caching (SWR for data fetching)

**Backend:**
- [x] Database Indexes (on FK, status, frequently queried columns)
- [x] Connection Pooling (Prisma: max 10 connections MVP)
- [x] Pagination (limit query results to 20-100)
- [x] Rate Limiting (prevent abuse)
- [ ] Redis Caching (V1.0 for sessions, query results)

**Database:**
- [x] Proper Indexes (created via Prisma)
- [x] Avoid N+1 queries (Prisma `include` strategically)
- [ ] Database Views (for complex queries, später)
- [x] Regular VACUUM (PostgreSQL maintenance, automated)

**Monitoring:**
- [x] Sentry (Error Tracking)
- [x] AWS CloudWatch (Infrastructure Monitoring)
- [ ] APM (Application Performance Monitoring, später)
- [ ] Uptime Monitoring (UptimeRobot, später)

---

## 11. Deployment Architecture

### 11.1 AWS Infrastructure

```
┌─────────────────────────────────────────────────────────────┐
│                        Route 53                             │
│                  (DNS: ai-match.de)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              AWS Certificate Manager                         │
│              (SSL/TLS Certificate)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   CloudFront (CDN)                          │
│          Cache: Static Assets, Images                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│          Application Load Balancer (ALB)                    │
│          - HTTPS Termination                                │
│          - Health Checks                                    │
│          - Target Group: ECS Service                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    ECS Fargate                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Task Definition: Next.js App                      │    │
│  │  - Image: ECR (Docker Registry)                    │    │
│  │  - CPU: 0.5 vCPU (MVP) → 2 vCPU (Production)      │    │
│  │  - Memory: 1 GB (MVP) → 4 GB (Production)         │    │
│  │  - Port: 3000                                      │    │
│  │  - Environment Variables from Parameter Store     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  Service:                                                   │
│  - Desired Count: 1 (MVP) → 3+ (Production)                │
│  - Auto-Scaling: CPU/Memory Thresholds                     │
│  - Rolling Updates (Zero-Downtime)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
       ┌─────────────┼─────────────┬──────────────┐
       │             │             │              │
       ↓             ↓             ↓              ↓
┌─────────────┐ ┌────────────┐ ┌──────────┐ ┌─────────────┐
│   AWS RDS   │ │  AWS SES   │ │  AWS S3  │ │ CloudWatch  │
│ PostgreSQL  │ │  (Email)   │ │ (Files)  │ │ (Logs)      │
│             │ │            │ │          │ │             │
│ - eu-c-1    │ │ - eu-c-1   │ │ - eu-c-1 │ │ - Metrics   │
│ - Multi-AZ  │ │ - Verified │ │ - Private│ │ - Alarms    │
│ - Backup:   │ │   Domain   │ │ - Encrypted│ │           │
│   Daily     │ │            │ │          │ │             │
└─────────────┘ └────────────┘ └──────────┘ └─────────────┘
```

### 11.2 Environment Configuration

**Environments:**
1. **Local** (Development)
2. **Staging** (Testing, Pre-Production)
3. **Production** (Live)

**Environment Variables:**

```bash
# .env.example
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"

# Email (AWS SES)
EMAIL_FROM="noreply@ai-match.de"
AWS_SES_REGION="eu-central-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"

# Sentry
SENTRY_DSN="https://..."

# Feature Flags
NEXT_PUBLIC_ENABLE_MESSAGING="true"

# V1.0: Anthropic API
ANTHROPIC_API_KEY="sk-ant-..."

# V1.0: Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 11.3 CI/CD Pipeline (GitHub Actions)

**Workflow: `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test:unit

      - name: Setup Database
        run: docker-compose up -d postgres

      - run: pnpm prisma migrate deploy
      - run: pnpm test:integration

      - run: pnpm build
```

**Workflow: `.github/workflows/deploy-production.yml`**

```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1

      - name: Login to Amazon ECR
        run: aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY

      - name: Build and Push Docker Image
        run: |
          docker build -t freelancer-app:${{ github.sha }} .
          docker tag freelancer-app:${{ github.sha }} $ECR_REGISTRY/freelancer-app:latest
          docker push $ECR_REGISTRY/freelancer-app:latest

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster freelancer-cluster \
            --service freelancer-service \
            --force-new-deployment
```

---

## 12. Next Steps

### 12.1 Immediate Actions

1. **Create ADRs** (`docs/adr/`)
   - ADR-001: Next.js Full-Stack
   - ADR-002: PostgreSQL + Prisma
   - ADR-003: tRPC for API
   - ADR-004: JWT Auth Strategy
   - ADR-005: AWS Hosting
   - ADR-006: Tailwind + shadcn/ui
   - ADR-007: Manual Matching (MVP)

2. **Create Database Schema** (`docs/DATABASE_SCHEMA.md`)
   - Finalize Prisma schema
   - Add detailed comments
   - Document relationships

3. **Initial Project Setup**
   - Initialize Next.js project
   - Setup Prisma
   - Install dependencies (pnpm)
   - Create folder structure
   - Configure ESLint, Prettier, TypeScript
   - Setup Git repository

4. **Move to Phase 3.5: Docker Setup**

### 12.2 Open Questions

- [ ] **Domain Name:** AI-Match.de, ExpertFlow.de, TalentForge.de?
  - Action: Domain-Check durchführen

- [ ] **Email Provider:** AWS SES oder Alternative (Resend, Postmark)?
  - Decision: AWS SES (DSGVO, EU, Integration)

- [ ] **Deployment:** Vercel (einfacher) oder AWS ECS (mehr Kontrolle)?
  - Decision: AWS ECS (EU Data Residency, more control)

---

## 13. Document Status

**Status:** ✅ DRAFT COMPLETE - Ready for Review

**Sign-Off:**
- [ ] Architecture reviewed and approved
- [ ] Tech Stack finalized
- [ ] Database Schema designed
- [ ] API Design documented
- [ ] Security measures planned
- [ ] Ready for Phase 3.5 (Docker Setup)

**Next Phase:** 03.5 - Docker Setup

---

**Document Version:** 1.0
**Created:** 27. Oktober 2025
**Last Updated:** 27. Oktober 2025
**Author:** Klaus Weigele
