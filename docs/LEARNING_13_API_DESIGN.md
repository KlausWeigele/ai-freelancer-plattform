# Learning 13: API Design

**Erstellt:** 2025-12-17
**Kontext:** AI-Freelancer-Plattform (Next.js API Routes + tRPC)

---

## Inhaltsverzeichnis

1. [Was ist eine API?](#1-was-ist-eine-api)
2. [REST Grundlagen](#2-rest-grundlagen)
3. [HTTP im Detail](#3-http-im-detail)
4. [REST Best Practices](#4-rest-best-practices)
5. [tRPC (Type-Safe APIs)](#5-trpc-type-safe-apis)
6. [GraphQL Grundlagen](#6-graphql-grundlagen)
7. [API-Authentifizierung](#7-api-authentifizierung)
8. [Versionierung](#8-versionierung)
9. [Dokumentation](#9-dokumentation)
10. [Unser Projekt: API-Struktur](#10-unser-projekt-api-struktur)

---

## 1. Was ist eine API?

### Definition

**API** = Application Programming Interface

Eine API definiert, wie verschiedene Software-Komponenten miteinander kommunizieren.

### Arten von APIs

```
Web APIs (unser Fokus):
├── REST API       - Resource-basiert, HTTP
├── GraphQL        - Query-Sprache
├── tRPC           - Type-safe RPC
├── gRPC           - Binary Protocol (Google)
└── WebSocket      - Bidirektional, Echtzeit

Andere:
├── Library APIs   - Funktionsaufrufe (z.B. React API)
├── OS APIs        - System Calls
└── Hardware APIs  - Treiber
```

### Client-Server Kommunikation

```
┌─────────┐         Request          ┌─────────┐
│         │  ─────────────────────▶  │         │
│ Client  │   GET /api/freelancers   │ Server  │
│(Browser)│                          │(Next.js)│
│         │  ◀─────────────────────  │         │
└─────────┘         Response         └─────────┘
                 { data: [...] }
```

---

## 2. REST Grundlagen

### Was ist REST?

**REST** = Representational State Transfer

Ein Architekturstil für verteilte Systeme, definiert von Roy Fielding (2000).

### REST-Prinzipien

```
1. Client-Server Trennung
   - Unabhängige Entwicklung
   - Skalierbarkeit

2. Stateless
   - Jeder Request enthält alle nötigen Informationen
   - Server speichert keinen Client-Zustand

3. Cacheable
   - Responses können gecacht werden
   - Reduziert Server-Last

4. Uniform Interface
   - Einheitliche Schnittstelle
   - Resource-basiert
   - Self-descriptive Messages

5. Layered System
   - Mehrere Schichten möglich (Load Balancer, Proxy)
   - Client kennt nur direkten Server
```

### Resources und URLs

```
Resource = Daten-Entität (Freelancer, Projekt, Booking)
URL = Eindeutiger Identifier für Resource

Beispiele:
/api/freelancers           → Alle Freelancer
/api/freelancers/123       → Ein Freelancer
/api/freelancers/123/projects → Projekte eines Freelancers
/api/projects              → Alle Projekte
/api/projects/456          → Ein Projekt
/api/projects/456/bookings → Bookings eines Projekts
```

### HTTP-Methoden (CRUD)

| Methode | Aktion | CRUD | Beispiel |
|---------|--------|------|----------|
| `GET` | Lesen | Read | `GET /api/freelancers` |
| `POST` | Erstellen | Create | `POST /api/freelancers` |
| `PUT` | Ersetzen | Update | `PUT /api/freelancers/123` |
| `PATCH` | Teilweise ändern | Update | `PATCH /api/freelancers/123` |
| `DELETE` | Löschen | Delete | `DELETE /api/freelancers/123` |

### Idempotenz

```
Idempotent = Mehrfache Ausführung hat gleiches Ergebnis

GET    → Idempotent (Lesen ändert nichts)
PUT    → Idempotent (gleiche Daten = gleiches Ergebnis)
DELETE → Idempotent (Löschen von gelöschtem = nichts)
POST   → NICHT Idempotent (kann Duplikate erstellen)
PATCH  → Kommt drauf an (kann idempotent sein)
```

---

## 3. HTTP im Detail

### Request-Struktur

```http
POST /api/freelancers HTTP/1.1
Host: weigele.art
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1...
Accept: application/json
Cache-Control: no-cache

{
  "name": "Klaus Weigele",
  "skills": ["python", "langchain"],
  "dayRate": 800
}
```

### Response-Struktur

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/freelancers/789
X-Request-Id: abc-123-def

{
  "id": "789",
  "name": "Klaus Weigele",
  "skills": ["python", "langchain"],
  "dayRate": 800,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### HTTP Status Codes

```
2xx - Erfolg:
200 OK                  - Erfolgreiche Anfrage
201 Created             - Resource erstellt
204 No Content          - Erfolg ohne Inhalt (DELETE)

3xx - Umleitung:
301 Moved Permanently   - URL hat sich dauerhaft geändert
302 Found               - Temporäre Umleitung
304 Not Modified        - Cache gültig

4xx - Client-Fehler:
400 Bad Request         - Ungültige Anfrage
401 Unauthorized        - Nicht authentifiziert
403 Forbidden           - Keine Berechtigung
404 Not Found           - Resource nicht gefunden
409 Conflict            - Konflikt (z.B. Duplikat)
422 Unprocessable Entity - Validierungsfehler
429 Too Many Requests   - Rate Limit erreicht

5xx - Server-Fehler:
500 Internal Server Error - Unbekannter Fehler
502 Bad Gateway           - Upstream-Server Fehler
503 Service Unavailable   - Server überlastet
504 Gateway Timeout       - Upstream-Timeout
```

### Wichtige Header

```http
# Content Headers
Content-Type: application/json
Content-Length: 1234
Content-Encoding: gzip

# Authentication
Authorization: Bearer <token>
Authorization: Basic base64(user:pass)

# Caching
Cache-Control: max-age=3600
ETag: "abc123"
If-None-Match: "abc123"

# CORS
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE

# Rate Limiting (Response)
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000

# Tracking
X-Request-Id: uuid-here
```

---

## 4. REST Best Practices

### URL-Design

```
✅ Gute URLs:
GET    /api/freelancers              # Collection
GET    /api/freelancers/123          # Einzelne Resource
POST   /api/freelancers              # Erstellen
PUT    /api/freelancers/123          # Ersetzen
DELETE /api/freelancers/123          # Löschen

GET    /api/freelancers/123/projects # Sub-Resources
GET    /api/projects?status=open     # Filtern
GET    /api/projects?sort=-createdAt # Sortieren

❌ Schlechte URLs:
GET    /api/getFreelancers           # Verb in URL
GET    /api/freelancer/123           # Singular statt Plural
POST   /api/freelancers/create       # Redundant
GET    /api/freelancers/123/delete   # GET für Delete
```

### Response-Format

```json
// Einzelne Resource
{
  "id": "123",
  "name": "Klaus Weigele",
  "email": "klaus@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}

// Collection
{
  "data": [
    { "id": "123", "name": "Klaus" },
    { "id": "456", "name": "Anna" }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "perPage": 10,
    "totalPages": 15
  }
}

// Fehler
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "dayRate", "message": "Must be positive number" }
    ]
  }
}
```

### Pagination

```
Offset-based (einfach, aber langsam bei großen Daten):
GET /api/freelancers?page=3&perPage=20

Cursor-based (performant):
GET /api/freelancers?cursor=abc123&limit=20

Response:
{
  "data": [...],
  "meta": {
    "hasNextPage": true,
    "nextCursor": "xyz789"
  }
}
```

### Filtering und Sorting

```
# Filtering
GET /api/freelancers?status=active
GET /api/freelancers?skills=python,langchain
GET /api/freelancers?dayRate[gte]=500&dayRate[lte]=1000

# Sorting
GET /api/freelancers?sort=dayRate        # Aufsteigend
GET /api/freelancers?sort=-dayRate       # Absteigend
GET /api/freelancers?sort=-dayRate,name  # Mehrere

# Feldauswahl
GET /api/freelancers?fields=id,name,dayRate
```

### Error Handling

```typescript
// src/app/api/freelancers/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CreateFreelancerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  dayRate: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validierung
    const result = CreateFreelancerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: result.error.issues,
          },
        },
        { status: 422 }
      );
    }

    const freelancer = await createFreelancer(result.data);

    return NextResponse.json(freelancer, {
      status: 201,
      headers: { Location: `/api/freelancers/${freelancer.id}` },
    });
  } catch (error) {
    console.error('Error creating freelancer:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
```

---

## 5. tRPC (Type-Safe APIs)

### Was ist tRPC?

**tRPC** = TypeScript Remote Procedure Call

Type-safe API ohne Code-Generierung. Client und Server teilen sich die Typen.

### Warum tRPC für unser Projekt?

```
Vorteile:
✅ End-to-End Type Safety
✅ Kein API-Schema definieren (OpenAPI etc.)
✅ Automatische Typen im Frontend
✅ Einfacher als GraphQL
✅ Perfekt für Next.js Full-Stack

Nachteile:
❌ Nur für TypeScript
❌ Keine OpenAPI Docs automatisch
❌ Weniger geeignet für öffentliche APIs
```

### tRPC Setup

```typescript
// src/server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { getServerSession } from 'next-auth';
import superjson from 'superjson';

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Mit Auth
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { ...ctx, user: ctx.session.user },
  });
});
```

### Router definieren

```typescript
// src/server/routers/freelancer.ts
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '@/lib/db';

export const freelancerRouter = router({
  // GET /api/trpc/freelancer.list
  list: publicProcedure
    .input(
      z.object({
        status: z.enum(['ACTIVE', 'PENDING_REVIEW']).optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const freelancers = await prisma.freelancerProfile.findMany({
        where: { status: input.status },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
      });

      let nextCursor: string | undefined;
      if (freelancers.length > input.limit) {
        const nextItem = freelancers.pop();
        nextCursor = nextItem?.id;
      }

      return { freelancers, nextCursor };
    }),

  // GET /api/trpc/freelancer.byId?input={"id":"123"}
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const freelancer = await prisma.freelancerProfile.findUnique({
        where: { id: input.id },
        include: { user: { select: { email: true } } },
      });

      if (!freelancer) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Freelancer not found',
        });
      }

      return freelancer;
    }),

  // POST /api/trpc/freelancer.create (nur authentifiziert)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
        skills: z.array(z.string()).min(1),
        dayRate: z.number().positive(),
        bio: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.freelancerProfile.create({
        data: {
          ...input,
          userId: ctx.user.id,
          status: 'PENDING_REVIEW',
          experienceLevel: 'INTERMEDIATE',
          location: 'Germany',
        },
      });
    }),
});
```

### tRPC im Frontend nutzen

```typescript
// src/app/freelancers/page.tsx
'use client';

import { trpc } from '@/lib/trpc';

export default function FreelancersPage() {
  // Type-safe! TS weiß was zurückkommt
  const { data, isLoading, error } = trpc.freelancer.list.useQuery({
    status: 'ACTIVE',
    limit: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.freelancers.map((f) => (
        // f ist vollständig getypt!
        <div key={f.id}>
          <h2>{f.name}</h2>
          <p>{f.dayRate}€/Tag</p>
        </div>
      ))}
    </div>
  );
}
```

```typescript
// Mutation (Create)
const createMutation = trpc.freelancer.create.useMutation({
  onSuccess: (data) => {
    console.log('Created:', data.id);
    router.push(`/freelancers/${data.id}`);
  },
  onError: (error) => {
    console.error('Error:', error.message);
  },
});

// Aufrufen
createMutation.mutate({
  name: 'Klaus',
  skills: ['python', 'langchain'],
  dayRate: 800,
});
```

---

## 6. GraphQL Grundlagen

### Was ist GraphQL?

**GraphQL** ist eine Query-Sprache für APIs, entwickelt von Facebook (2015).

```
REST: Server bestimmt was zurückkommt
GraphQL: Client bestimmt was er braucht
```

### GraphQL Query

```graphql
# Client fragt genau die Felder an, die er braucht
query GetFreelancer {
  freelancer(id: "123") {
    id
    name
    dayRate
    skills
    projects {
      id
      name
      status
    }
  }
}
```

### GraphQL Response

```json
{
  "data": {
    "freelancer": {
      "id": "123",
      "name": "Klaus Weigele",
      "dayRate": 800,
      "skills": ["python", "langchain"],
      "projects": [
        { "id": "456", "name": "AI Chatbot", "status": "ACTIVE" }
      ]
    }
  }
}
```

### GraphQL vs. REST vs. tRPC

| Aspekt | REST | GraphQL | tRPC |
|--------|------|---------|------|
| Sprache | Any | Any | TypeScript |
| Schema | OpenAPI | GraphQL SDL | Zod |
| Typen | Codegen | Codegen | Automatisch |
| Learning Curve | Niedrig | Hoch | Mittel |
| Over-fetching | Ja | Nein | Ja |
| Caching | HTTP Cache | Komplex | React Query |
| Für uns | Public API | Overkill | Perfekt |

---

## 7. API-Authentifizierung

### Methoden im Vergleich

```
1. API Keys
   - Einfach, aber nur für Server-zu-Server
   - Nicht für User-Auth geeignet

2. Basic Auth
   - Username:Password base64
   - Nur über HTTPS!
   - Gut für einfache Fälle

3. JWT (JSON Web Tokens)
   - Stateless
   - Selbst-enthaltend
   - Standard für SPAs

4. OAuth 2.0
   - Für Third-Party Auth
   - "Login with Google/GitHub"

5. Session-based
   - Cookie mit Session ID
   - Server speichert Session
```

### JWT (für unser Projekt)

```typescript
// JWT Struktur
// Header.Payload.Signature
// eyJhbGc....eyJzdWI....TJVA95...

// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "sub": "user-id-123",
  "email": "klaus@example.com",
  "role": "FREELANCER",
  "iat": 1704100000,
  "exp": 1704186400
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### NextAuth.js Setup

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import bcrypt from 'bcrypt';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const passwordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!passwordValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

### API Route schützen

```typescript
// src/app/api/freelancers/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Session prüfen
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
      { status: 401 }
    );
  }

  // Berechtigung prüfen
  if (session.user.id !== params.id && session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'Not authorized' } },
      { status: 403 }
    );
  }

  // Update durchführen...
}
```

---

## 8. Versionierung

### Strategien

```
1. URL Path Versioning (am häufigsten)
   /api/v1/freelancers
   /api/v2/freelancers

2. Query Parameter
   /api/freelancers?version=1
   /api/freelancers?version=2

3. Header
   Accept: application/vnd.api+json;version=1

4. Content-Type
   Accept: application/vnd.api.v1+json
```

### Empfehlung

```
Für uns: URL Path Versioning

/api/v1/freelancers  - Stabil, für externe Clients
/api/trpc/...        - Intern, via tRPC (keine Version nötig)
```

### Breaking Changes vermeiden

```
Breaking Changes (erfordern neue Version):
- Felder entfernen
- Feldtyp ändern
- Pflichtfeld hinzufügen
- URL-Struktur ändern

Nicht-Breaking (gleiche Version):
- Neues optionales Feld
- Neue Endpoints
- Neuer Query-Parameter
- Performance-Verbesserungen
```

---

## 9. Dokumentation

### OpenAPI/Swagger

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: AI-Freelancer-Platform API
  version: 1.0.0
  description: API for freelancer marketplace

servers:
  - url: https://weigele.art/api/v1
    description: Production

paths:
  /freelancers:
    get:
      summary: List all freelancers
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [ACTIVE, PENDING_REVIEW]
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: List of freelancers
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Freelancer'
                  meta:
                    $ref: '#/components/schemas/Pagination'

components:
  schemas:
    Freelancer:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        dayRate:
          type: integer
        skills:
          type: array
          items:
            type: string
```

### API Documentation Tools

```
1. Swagger UI
   - Interaktive Dokumentation
   - "Try it out" Feature

2. Redoc
   - Schöne Docs aus OpenAPI
   - Drei-Spalten-Layout

3. Postman
   - API-Testing
   - Dokumentation
   - Team-Collaboration

4. Für tRPC: Trpc-panel
   - Auto-generiertes UI
   - Zum Testen der Procedures
```

---

## 10. Unser Projekt: API-Struktur

### API-Architektur

```
src/
├── app/
│   └── api/
│       ├── health/
│       │   └── route.ts          # GET /api/health
│       ├── version/
│       │   └── route.ts          # GET /api/version
│       └── trpc/
│           └── [trpc]/
│               └── route.ts      # tRPC Handler
│
└── server/
    ├── trpc.ts                   # tRPC Setup
    └── routers/
        ├── _app.ts               # Root Router
        ├── freelancer.ts         # Freelancer CRUD
        ├── project.ts            # Project CRUD
        ├── booking.ts            # Booking CRUD
        └── auth.ts               # Auth Procedures
```

### Health & Version Endpoints (REST)

```typescript
// src/app/api/health/route.ts
export async function GET() {
  const dbHealthy = await checkDatabase();

  return Response.json({
    status: dbHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
  }, { status: dbHealthy ? 200 : 503 });
}

// src/app/api/version/route.ts
export async function GET() {
  return Response.json({
    version: process.env.APP_VERSION || '0.0.0',
    commit: process.env.COMMIT_SHA || 'unknown',
    environment: process.env.NODE_ENV,
  });
}
```

### tRPC Router (Business Logic)

```typescript
// src/server/routers/_app.ts
import { router } from '../trpc';
import { freelancerRouter } from './freelancer';
import { projectRouter } from './project';
import { bookingRouter } from './booking';

export const appRouter = router({
  freelancer: freelancerRouter,
  project: projectRouter,
  booking: bookingRouter,
});

export type AppRouter = typeof appRouter;
```

### Endpunkt-Übersicht

```
Public (REST):
GET  /api/health              # Health Check
GET  /api/version             # Version Info

Public (tRPC):
trpc.freelancer.list          # Freelancer auflisten
trpc.freelancer.byId          # Einzelnen Freelancer
trpc.project.list             # Projekte auflisten
trpc.project.byId             # Einzelnes Projekt

Protected (tRPC, Auth required):
trpc.freelancer.create        # Freelancer-Profil erstellen
trpc.freelancer.update        # Profil bearbeiten
trpc.project.create           # Projekt erstellen
trpc.booking.create           # Buchung erstellen
trpc.booking.updateStatus     # Buchungsstatus ändern
```

### API Response Standards

```typescript
// types/api.ts

// Erfolg (Einzelne Resource)
interface SuccessResponse<T> {
  data: T;
}

// Erfolg (Collection)
interface CollectionResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

// Cursor-Paginierung
interface CursorResponse<T> {
  data: T[];
  nextCursor?: string;
  hasMore: boolean;
}

// Fehler
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}
```

---

## Checkliste für API-Design

```
Design:
☐ Konsistente URL-Struktur (Plural, Nomen)
☐ Richtige HTTP-Methoden (GET/POST/PUT/DELETE)
☐ Sinnvolle Status Codes
☐ Konsistentes Response-Format

Sicherheit:
☐ HTTPS only
☐ Authentication implementiert
☐ Authorization geprüft
☐ Input-Validierung (Zod)
☐ Rate Limiting

Performance:
☐ Pagination implementiert
☐ Caching-Header gesetzt
☐ Komprimierung (gzip)
☐ N+1 Queries vermieden

Dokumentation:
☐ Endpoints dokumentiert
☐ Request/Response Beispiele
☐ Error Codes erklärt
☐ Auth-Flow dokumentiert
```

---

## Ressourcen

- [REST API Design Best Practices](https://restfulapi.net/)
- [tRPC Documentation](https://trpc.io/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [HTTP Status Codes](https://httpstatuses.com/)
