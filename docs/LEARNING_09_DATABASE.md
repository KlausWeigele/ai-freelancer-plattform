# Learning 09: Datenbanken - SQL, PostgreSQL und Prisma

**Erstellt:** 2025-12-10
**Kontext:** AI-Freelancer-Plattform (PostgreSQL + Prisma ORM)

---

## Inhaltsverzeichnis

1. [Datenbank-Grundlagen](#1-datenbank-grundlagen)
2. [SQL Basics](#2-sql-basics)
3. [PostgreSQL](#3-postgresql)
4. [Prisma ORM](#4-prisma-orm)
5. [Unser Schema erklärt](#5-unser-schema-erklärt)
6. [Queries in Prisma](#6-queries-in-prisma)
7. [Migrationen](#7-migrationen)
8. [Performance & Optimierung](#8-performance--optimierung)
9. [Best Practices](#9-best-practices)
10. [Checkliste](#10-checkliste)

---

## 1. Datenbank-Grundlagen

### Was ist eine Datenbank?

Eine **Datenbank** ist ein System zur organisierten Speicherung und Verwaltung von Daten.

```
Arten von Datenbanken:

Relationale (SQL):           NoSQL:
├── PostgreSQL               ├── MongoDB (Document)
├── MySQL                    ├── Redis (Key-Value)
├── SQLite                   ├── Cassandra (Column)
└── SQL Server               └── Neo4j (Graph)
```

### Warum PostgreSQL?

| Feature | PostgreSQL | MySQL |
|---------|------------|-------|
| **ACID Compliance** | Vollständig | Vollständig |
| **JSON Support** | Nativ (JSONB) | Begrenzt |
| **Array-Typen** | Ja | Nein |
| **Full-Text Search** | Eingebaut | Plugin |
| **Erweiterungen** | pgvector, PostGIS | Begrenzt |
| **Lizenz** | Open Source (BSD) | GPL |

**Für unser Projekt:** PostgreSQL wegen:
- Arrays für Skills (`["python", "langchain", "rag"]`)
- JSONB für flexible Daten
- pgvector für AI-Embeddings (später)
- AWS RDS Support

### Grundbegriffe

```
Tabelle (Table)    = Sammlung von Daten (wie Excel-Sheet)
Zeile (Row)        = Ein Datensatz (ein User)
Spalte (Column)    = Ein Attribut (Name, Email)
Primary Key (PK)   = Eindeutiger Identifier (id)
Foreign Key (FK)   = Verweis auf andere Tabelle (user_id)
Index              = Beschleunigt Suchen
Schema             = Struktur der Datenbank
```

### Relationale Beziehungen

```
1:1 (One-to-One)
└── User ↔ FreelancerProfile (jeder User hat max. 1 Profil)

1:N (One-to-Many)
└── Company → Projects (eine Firma hat viele Projekte)

N:M (Many-to-Many)
└── Freelancer ↔ Skills (über Join-Tabelle)
```

---

## 2. SQL Basics

### SELECT - Daten abfragen

```sql
-- Alle Spalten
SELECT * FROM users;

-- Bestimmte Spalten
SELECT email, name FROM users;

-- Mit Bedingung
SELECT * FROM users WHERE role = 'FREELANCER';

-- Sortieren
SELECT * FROM users ORDER BY created_at DESC;

-- Limitieren
SELECT * FROM users LIMIT 10;

-- Kombiniert
SELECT id, email, created_at
FROM users
WHERE role = 'FREELANCER'
ORDER BY created_at DESC
LIMIT 10;
```

### WHERE - Bedingungen

```sql
-- Vergleiche
WHERE age > 18
WHERE age >= 18
WHERE age != 18
WHERE age BETWEEN 18 AND 65

-- Text
WHERE name = 'Klaus'
WHERE name LIKE 'K%'      -- Beginnt mit K
WHERE name LIKE '%aus'    -- Endet mit aus
WHERE name LIKE '%lau%'   -- Enthält lau
WHERE name ILIKE '%klaus%' -- Case-insensitive (PostgreSQL)

-- Null
WHERE email IS NULL
WHERE email IS NOT NULL

-- Listen
WHERE role IN ('ADMIN', 'FREELANCER')
WHERE role NOT IN ('GUEST')

-- Kombinieren
WHERE role = 'FREELANCER' AND status = 'ACTIVE'
WHERE role = 'ADMIN' OR email LIKE '%@company.com'
```

### INSERT - Daten einfügen

```sql
-- Ein Datensatz
INSERT INTO users (email, role, password_hash)
VALUES ('klaus@example.com', 'FREELANCER', 'hash...');

-- Mehrere Datensätze
INSERT INTO users (email, role, password_hash)
VALUES
  ('user1@example.com', 'FREELANCER', 'hash1'),
  ('user2@example.com', 'COMPANY', 'hash2'),
  ('user3@example.com', 'ADMIN', 'hash3');

-- Mit RETURNING (PostgreSQL - gibt eingefügte Daten zurück)
INSERT INTO users (email, role, password_hash)
VALUES ('klaus@example.com', 'FREELANCER', 'hash...')
RETURNING id, email;
```

### UPDATE - Daten ändern

```sql
-- Bestimmte Zeile
UPDATE users
SET email = 'new@example.com'
WHERE id = '123';

-- Mehrere Spalten
UPDATE users
SET
  email = 'new@example.com',
  updated_at = NOW()
WHERE id = '123';

-- Mehrere Zeilen
UPDATE users
SET status = 'INACTIVE'
WHERE last_login < NOW() - INTERVAL '1 year';

-- Mit RETURNING
UPDATE users
SET email = 'new@example.com'
WHERE id = '123'
RETURNING *;
```

### DELETE - Daten löschen

```sql
-- Bestimmte Zeile
DELETE FROM users WHERE id = '123';

-- Mit Bedingung
DELETE FROM users WHERE status = 'DELETED';

-- VORSICHT: Alle Daten löschen!
DELETE FROM users; -- ⚠️ Löscht ALLES

-- Sicherer: Mit RETURNING prüfen was gelöscht wird
DELETE FROM users
WHERE last_login < NOW() - INTERVAL '2 years'
RETURNING id, email;
```

### JOIN - Tabellen verbinden

```sql
-- INNER JOIN: Nur wo beide Tabellen matchen
SELECT u.email, fp.name, fp.day_rate
FROM users u
INNER JOIN freelancer_profiles fp ON u.id = fp.user_id;

-- LEFT JOIN: Alle aus links, auch ohne Match rechts
SELECT u.email, fp.name
FROM users u
LEFT JOIN freelancer_profiles fp ON u.id = fp.user_id;

-- Mehrere JOINs
SELECT
  u.email,
  fp.name,
  p.name AS project_name
FROM users u
JOIN freelancer_profiles fp ON u.id = fp.user_id
JOIN project_bookings pb ON fp.id = pb.freelancer_id
JOIN projects p ON pb.project_id = p.id;
```

### Aggregat-Funktionen

```sql
-- Zählen
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM users WHERE role = 'FREELANCER';

-- Summe
SELECT SUM(day_rate) FROM freelancer_profiles;

-- Durchschnitt
SELECT AVG(day_rate) FROM freelancer_profiles;

-- Min/Max
SELECT MIN(day_rate), MAX(day_rate) FROM freelancer_profiles;

-- GROUP BY
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;

-- Mit HAVING (Filter nach Gruppierung)
SELECT experience_level, AVG(day_rate) as avg_rate
FROM freelancer_profiles
GROUP BY experience_level
HAVING AVG(day_rate) > 500;
```

---

## 3. PostgreSQL

### PostgreSQL-spezifische Features

#### Array-Typen

```sql
-- Tabelle mit Array
CREATE TABLE freelancer_profiles (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  skills TEXT[]  -- Array von Strings
);

-- Array einfügen
INSERT INTO freelancer_profiles (id, name, skills)
VALUES ('...', 'Klaus', ARRAY['python', 'langchain', 'rag']);

-- Alternative Syntax
INSERT INTO freelancer_profiles (id, name, skills)
VALUES ('...', 'Klaus', '{"python", "langchain", "rag"}');

-- Array abfragen: Enthält?
SELECT * FROM freelancer_profiles
WHERE 'python' = ANY(skills);

-- Array abfragen: Enthält alle?
SELECT * FROM freelancer_profiles
WHERE skills @> ARRAY['python', 'rag'];

-- Array abfragen: Überschneidung?
SELECT * FROM freelancer_profiles
WHERE skills && ARRAY['python', 'java', 'go'];
```

#### JSONB

```sql
-- Tabelle mit JSONB
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  metadata JSONB
);

-- JSONB einfügen
INSERT INTO profiles (id, metadata)
VALUES ('...', '{"linkedin": "url", "github": "url"}');

-- JSONB abfragen
SELECT * FROM profiles
WHERE metadata->>'linkedin' IS NOT NULL;

-- Verschachtelte JSONB
SELECT metadata->'social'->>'twitter' FROM profiles;
```

#### UUID

```sql
-- UUID Extension aktivieren
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- UUID generieren
SELECT uuid_generate_v4();

-- Als Default
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
);
```

#### Full-Text Search

```sql
-- Einfache Suche
SELECT * FROM freelancer_profiles
WHERE to_tsvector('german', bio) @@ to_tsquery('german', 'python & machine');

-- Mit Ranking
SELECT *, ts_rank(to_tsvector('german', bio), query) AS rank
FROM freelancer_profiles, to_tsquery('german', 'python | langchain') query
WHERE to_tsvector('german', bio) @@ query
ORDER BY rank DESC;
```

### PostgreSQL Datentypen

| Typ | Beschreibung | Beispiel |
|-----|--------------|----------|
| `UUID` | Eindeutige ID | `'550e8400-e29b-41d4-a716-446655440000'` |
| `VARCHAR(n)` | String mit Max-Länge | `'Klaus'` |
| `TEXT` | String ohne Limit | Lange Texte |
| `INTEGER` | Ganzzahl | `800` |
| `DECIMAL(p,s)` | Dezimalzahl | `12400.50` |
| `BOOLEAN` | Wahr/Falsch | `true` |
| `TIMESTAMP` | Datum + Zeit | `'2024-01-15 14:30:00'` |
| `DATE` | Nur Datum | `'2024-01-15'` |
| `JSONB` | JSON (binär) | `'{"key": "value"}'` |
| `TEXT[]` | String-Array | `'{"a", "b", "c"}'` |

### Indizes in PostgreSQL

```sql
-- B-Tree Index (Standard, für =, <, >, BETWEEN)
CREATE INDEX idx_users_email ON users(email);

-- Unique Index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Composite Index (mehrere Spalten)
CREATE INDEX idx_bookings_project_status
ON project_bookings(project_id, status);

-- Partial Index (nur bestimmte Zeilen)
CREATE INDEX idx_active_freelancers
ON freelancer_profiles(day_rate)
WHERE status = 'ACTIVE';

-- GIN Index (für Arrays und JSONB)
CREATE INDEX idx_skills ON freelancer_profiles USING GIN(skills);

-- GiST Index (für Full-Text Search)
CREATE INDEX idx_bio_fts ON freelancer_profiles
USING GiST(to_tsvector('german', bio));
```

---

## 4. Prisma ORM

### Was ist Prisma?

Prisma ist ein **Next-Generation ORM** (Object-Relational Mapping) für Node.js und TypeScript.

```
Prisma besteht aus:
1. Prisma Client - Type-safe Database Client
2. Prisma Migrate - Datenbank-Migrationen
3. Prisma Studio - GUI für Datenbank
```

### Warum Prisma?

| Feature | Vorteil |
|---------|---------|
| **Type Safety** | Vollständige TypeScript-Typen |
| **Auto-Complete** | IDE weiß welche Felder existieren |
| **Migration** | Versionierte Schema-Änderungen |
| **Relations** | Einfaches Laden von Beziehungen |
| **Studio** | GUI zum Daten-Browsen |

### Prisma Setup (unser Projekt)

```bash
# Installation
pnpm add prisma @prisma/client
pnpm add -D prisma

# Initialisierung
pnpm prisma init

# Client generieren (nach Schema-Änderung)
pnpm prisma generate

# Migration erstellen & ausführen
pnpm prisma migrate dev --name init

# Prisma Studio starten
pnpm prisma studio
```

### Schema-Syntax (schema.prisma)

```prisma
// Datenbank-Verbindung
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Client-Generator
generator client {
  provider = "prisma-client-js"
}

// Enum definieren
enum UserRole {
  FREELANCER
  COMPANY
  ADMIN
}

// Model definieren
model User {
  id            String    @id @default(uuid())    // Primary Key
  email         String    @unique                  // Unique Constraint
  passwordHash  String    @map("password_hash")   // Spaltenname in DB
  role          UserRole                          // Enum
  createdAt     DateTime  @default(now())         // Default Wert
  updatedAt     DateTime  @updatedAt              // Auto-Update

  // Relation (1:1)
  profile FreelancerProfile?

  // Table & Column Mapping
  @@map("users")                                   // Tabellenname
  @@index([email])                                 // Index
}

model FreelancerProfile {
  id      String @id @default(uuid())
  userId  String @unique @map("user_id")
  name    String
  skills  String[]                                 // PostgreSQL Array
  dayRate Int    @map("day_rate")

  // Relation
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("freelancer_profiles")
}
```

### Prisma Client erstellen

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

---

## 5. Unser Schema erklärt

### Entity Relationship Diagram (vereinfacht)

```
┌─────────────┐       ┌─────────────────────┐
│    User     │───1:1─│  FreelancerProfile  │
├─────────────┤       ├─────────────────────┤
│ id          │       │ id                  │
│ email       │       │ userId (FK)         │
│ passwordHash│       │ name                │
│ role        │       │ skills[]            │
│ createdAt   │       │ dayRate             │
│ updatedAt   │       │ experienceLevel     │
└─────────────┘       │ status              │
       │              └─────────────────────┘
       │                       │
       │1:1                    │1:N
       ▼                       ▼
┌─────────────────┐    ┌───────────────────┐
│ CompanyProfile  │    │  ProjectBooking   │
├─────────────────┤    ├───────────────────┤
│ id              │    │ id                │
│ userId (FK)     │    │ projectId (FK)    │
│ companyName     │    │ freelancerId (FK) │
│ companySize     │    │ status            │
└─────────────────┘    │ daysWorked        │
       │               │ totalAmount       │
       │1:N            └───────────────────┘
       ▼                       │
┌─────────────────┐            │1:N
│    Project      │────────────┘
├─────────────────┤            │1:1
│ id              │            ▼
│ companyId (FK)  │    ┌───────────────┐
│ name            │    │   Invoice     │
│ skills[]        │    ├───────────────┤
│ budgetRange     │    │ id            │
│ status          │    │ bookingId(FK) │
└─────────────────┘    │ totalAmount   │
                       └───────────────┘
```

### Enums in unserem Schema

```prisma
// User-Rollen
enum UserRole {
  FREELANCER   // Freelancer-Account
  COMPANY      // Firmen-Account
  ADMIN        // Admin-Account
}

// Freelancer-Status (Kuration)
enum FreelancerStatus {
  PENDING_REVIEW  // Wartet auf Prüfung
  ACTIVE          // Freigeschaltet
  REJECTED        // Abgelehnt
}

// Erfahrungsstufe (bestimmt Tagessatz-Range)
enum ExperienceLevel {
  APPRENTICE    // 300-500€/Tag
  INTERMEDIATE  // 500-800€/Tag
  EXPERT        // 800-1200€/Tag
}

// Projekt-Status (Lifecycle)
enum ProjectStatus {
  OPEN                // Neu erstellt
  PROPOSALS_SENT      // Freelancer vorgeschlagen
  TRIAL_ACTIVE        // Trial Period läuft
  ACTIVE              // Projekt aktiv
  COMPLETED           // Abgeschlossen
  CANCELLED           // Abgebrochen
  DISPUTED            // Streitfall
  PAID                // Bezahlt
  CLOSED              // Final geschlossen
}
```

### Wichtige Design-Entscheidungen

```
1. UUID statt Integer für IDs
   - Sicherheit: Keine erratbaren IDs
   - Distributed: Keine DB-Abhängigkeit bei ID-Generierung
   - URL-safe: Können in URLs verwendet werden

2. snake_case in DB, camelCase in Code
   - @map("user_id") → userId in TypeScript
   - Konvention in beiden Welten eingehalten

3. Arrays für Skills
   - PostgreSQL-native Array-Typen
   - Effiziente Queries mit @> und &&

4. Decimal für Geldbeträge
   - Keine Float-Rundungsfehler
   - @db.Decimal(10, 2) = 10 Stellen, 2 Nachkommastellen

5. Soft Delete durch Status
   - Daten nicht wirklich löschen
   - Status: ACTIVE → DELETED
```

---

## 6. Queries in Prisma

### Basis-Queries

```typescript
import { prisma } from '@/lib/db';

// CREATE
const user = await prisma.user.create({
  data: {
    email: 'klaus@example.com',
    passwordHash: 'hash...',
    role: 'FREELANCER',
  },
});

// READ (findUnique - by unique field)
const user = await prisma.user.findUnique({
  where: { email: 'klaus@example.com' },
});

// READ (findFirst - erstes Match)
const freelancer = await prisma.freelancerProfile.findFirst({
  where: { status: 'ACTIVE' },
});

// READ (findMany - alle Matches)
const freelancers = await prisma.freelancerProfile.findMany({
  where: { status: 'ACTIVE' },
});

// UPDATE
const updated = await prisma.user.update({
  where: { id: '123' },
  data: { email: 'new@example.com' },
});

// DELETE
const deleted = await prisma.user.delete({
  where: { id: '123' },
});
```

### Filtering (where)

```typescript
// Mehrere Bedingungen (AND)
const freelancers = await prisma.freelancerProfile.findMany({
  where: {
    status: 'ACTIVE',
    dayRate: { gte: 500 },
  },
});

// OR
const users = await prisma.user.findMany({
  where: {
    OR: [
      { role: 'ADMIN' },
      { email: { endsWith: '@company.com' } },
    ],
  },
});

// NOT
const users = await prisma.user.findMany({
  where: {
    NOT: { role: 'ADMIN' },
  },
});

// Vergleiche
where: {
  dayRate: { equals: 800 },    // =
  dayRate: { gt: 500 },        // >
  dayRate: { gte: 500 },       // >=
  dayRate: { lt: 1000 },       // <
  dayRate: { lte: 1000 },      // <=
  dayRate: { not: 600 },       // !=
}

// String-Suche
where: {
  name: { contains: 'Klaus' },      // LIKE '%Klaus%'
  name: { startsWith: 'K' },        // LIKE 'K%'
  name: { endsWith: 'us' },         // LIKE '%us'
  name: { contains: 'klaus', mode: 'insensitive' }, // Case-insensitive
}

// Array-Queries (PostgreSQL)
where: {
  skills: { has: 'python' },                    // Enthält 'python'
  skills: { hasEvery: ['python', 'langchain'] }, // Enthält beide
  skills: { hasSome: ['python', 'java'] },       // Enthält mindestens eins
  skills: { isEmpty: false },                    // Nicht leer
}

// Null
where: {
  bio: { not: null },  // IS NOT NULL
  bio: null,           // IS NULL
}

// In Liste
where: {
  status: { in: ['ACTIVE', 'PENDING_REVIEW'] },
  status: { notIn: ['REJECTED'] },
}
```

### Sortieren & Paginieren

```typescript
// Sortieren
const freelancers = await prisma.freelancerProfile.findMany({
  orderBy: { dayRate: 'desc' },
});

// Mehrere Sortierungen
const freelancers = await prisma.freelancerProfile.findMany({
  orderBy: [
    { status: 'asc' },
    { dayRate: 'desc' },
  ],
});

// Paginierung (Offset-based)
const freelancers = await prisma.freelancerProfile.findMany({
  skip: 20,    // Überspringe 20
  take: 10,    // Nimm 10
});

// Cursor-based Pagination (performanter)
const freelancers = await prisma.freelancerProfile.findMany({
  take: 10,
  cursor: { id: 'last-seen-id' },
  skip: 1, // Skip the cursor itself
});
```

### Relationen laden (include)

```typescript
// Relation mitladen
const user = await prisma.user.findUnique({
  where: { id: '123' },
  include: {
    freelancerProfile: true,
  },
});
// user.freelancerProfile ist verfügbar

// Verschachtelte Relationen
const booking = await prisma.projectBooking.findUnique({
  where: { id: '456' },
  include: {
    project: {
      include: {
        company: true,
      },
    },
    freelancer: true,
    messages: true,
  },
});

// Mit Filtern in Relationen
const user = await prisma.user.findUnique({
  where: { id: '123' },
  include: {
    sentMessages: {
      where: { createdAt: { gte: new Date('2024-01-01') } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
  },
});
```

### Nur bestimmte Felder (select)

```typescript
// Nur bestimmte Felder
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    // passwordHash wird NICHT geladen
  },
});

// select + include kombiniert
const user = await prisma.user.findUnique({
  where: { id: '123' },
  select: {
    email: true,
    freelancerProfile: {
      select: {
        name: true,
        dayRate: true,
      },
    },
  },
});
```

### Aggregationen

```typescript
// Count
const count = await prisma.freelancerProfile.count({
  where: { status: 'ACTIVE' },
});

// Aggregate
const stats = await prisma.freelancerProfile.aggregate({
  _avg: { dayRate: true },
  _min: { dayRate: true },
  _max: { dayRate: true },
  _sum: { dayRate: true },
  where: { status: 'ACTIVE' },
});
// stats._avg.dayRate, stats._min.dayRate, etc.

// Group By
const byLevel = await prisma.freelancerProfile.groupBy({
  by: ['experienceLevel'],
  _count: true,
  _avg: { dayRate: true },
  where: { status: 'ACTIVE' },
});
```

### Transaktionen

```typescript
// Sequential Transaction
const [user, profile] = await prisma.$transaction([
  prisma.user.create({
    data: { email: 'klaus@example.com', passwordHash: 'hash', role: 'FREELANCER' },
  }),
  prisma.freelancerProfile.create({
    data: {
      userId: 'will-be-replaced',
      name: 'Klaus',
      location: 'Berlin',
      skills: ['python'],
      experienceLevel: 'EXPERT',
      dayRate: 800,
    },
  }),
]);

// Interactive Transaction (mit abhängigen Queries)
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'klaus@example.com', passwordHash: 'hash', role: 'FREELANCER' },
  });

  const profile = await tx.freelancerProfile.create({
    data: {
      userId: user.id, // Nutze ID aus vorheriger Query
      name: 'Klaus',
      location: 'Berlin',
      skills: ['python'],
      experienceLevel: 'EXPERT',
      dayRate: 800,
    },
  });

  return { user, profile };
});
```

### Raw SQL (wenn nötig)

```typescript
// Raw Query
const result = await prisma.$queryRaw`
  SELECT * FROM freelancer_profiles
  WHERE 'python' = ANY(skills)
  AND day_rate > ${500}
`;

// Raw Execute (für Updates ohne Return)
await prisma.$executeRaw`
  UPDATE freelancer_profiles
  SET status = 'INACTIVE'
  WHERE last_login < NOW() - INTERVAL '1 year'
`;
```

---

## 7. Migrationen

### Was sind Migrationen?

Migrationen sind **versionierte Schema-Änderungen**:

```
Migration 1: Create users table
Migration 2: Add email_verified column
Migration 3: Create freelancer_profiles table
Migration 4: Add index on skills
```

### Prisma Migrate Commands

```bash
# Development: Schema-Änderung erstellen & anwenden
pnpm prisma migrate dev --name add_skills_index

# Production: Nur anwenden (nicht erstellen)
pnpm prisma migrate deploy

# Status prüfen
pnpm prisma migrate status

# Reset (VORSICHT: Löscht alle Daten!)
pnpm prisma migrate reset
```

### Migration-Workflow

```bash
# 1. Schema ändern
# prisma/schema.prisma editieren

# 2. Migration erstellen
pnpm prisma migrate dev --name beschreibung

# 3. Client neu generieren (automatisch bei migrate dev)
pnpm prisma generate

# 4. Code anpassen (neue Felder nutzen)

# 5. Testen

# 6. Commit
git add prisma/migrations
git commit -m "feat: add skills index"
```

### Migration-Dateien

```
prisma/
├── schema.prisma
└── migrations/
    ├── 20240115120000_init/
    │   └── migration.sql
    ├── 20240116140000_add_skills_index/
    │   └── migration.sql
    └── migration_lock.toml
```

```sql
-- migrations/20240116140000_add_skills_index/migration.sql
-- CreateIndex
CREATE INDEX "idx_skills" ON "freelancer_profiles" USING GIN ("skills");
```

### Vorsicht bei Migrationen!

```
⚠️ Destructive Operations:

1. Spalte löschen → Datenverlust
2. Typ ändern → Kann fehlschlagen
3. NOT NULL ohne Default → Fehler bei bestehenden Rows

✅ Safe Operations:

1. Neue optionale Spalte
2. Neuer Index
3. Neue Tabelle
```

---

## 8. Performance & Optimierung

### N+1 Problem

```typescript
// ❌ N+1 Problem
const users = await prisma.user.findMany();
for (const user of users) {
  // +1 Query pro User!
  const profile = await prisma.freelancerProfile.findUnique({
    where: { userId: user.id },
  });
}

// ✅ Lösung: include
const users = await prisma.user.findMany({
  include: { freelancerProfile: true },
});
// Nur 2 Queries total
```

### Query Performance prüfen

```typescript
// Logging aktivieren
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Oder für einzelne Query
const result = await prisma.user.findMany({
  // ...
});
// Log zeigt: prisma:query SELECT ... Duration: 5ms
```

### Indizes richtig nutzen

```prisma
model FreelancerProfile {
  // ...

  // Single-Column Index
  @@index([status])

  // Composite Index (Reihenfolge wichtig!)
  @@index([status, experienceLevel])

  // Index für Array (GIN)
  // Muss manuell in SQL erstellt werden
}
```

```sql
-- Array-Index manuell erstellen
CREATE INDEX idx_skills ON freelancer_profiles USING GIN(skills);
```

### Select nur was nötig

```typescript
// ❌ Alles laden
const users = await prisma.user.findMany();

// ✅ Nur was gebraucht wird
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
  },
});
```

### Pagination statt findMany

```typescript
// ❌ Alle laden
const all = await prisma.freelancerProfile.findMany();

// ✅ Paginiert
const page1 = await prisma.freelancerProfile.findMany({
  take: 20,
  orderBy: { createdAt: 'desc' },
});

const page2 = await prisma.freelancerProfile.findMany({
  take: 20,
  skip: 20,
  orderBy: { createdAt: 'desc' },
});
```

### Connection Pooling

```typescript
// In Prisma Client automatisch
// Konfiguration via DATABASE_URL

// postgresql://USER:PASSWORD@HOST:PORT/DATABASE?connection_limit=5&pool_timeout=10
```

---

## 9. Best Practices

### Schema Design

```
1. UUIDs für IDs (nicht Integer)
2. Timestamps immer dabei (createdAt, updatedAt)
3. Soft Delete statt Hard Delete
4. Enums für feste Werte
5. Decimal für Geld (nicht Float)
6. Arrays für Listen ohne eigene Tabelle
7. snake_case in DB, camelCase in Code
```

### Query Patterns

```typescript
// 1. Repository Pattern (optional)
class FreelancerRepository {
  async findActive() {
    return prisma.freelancerProfile.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySkill(skill: string) {
    return prisma.freelancerProfile.findMany({
      where: { skills: { has: skill } },
    });
  }
}

// 2. Service Layer
async function bookFreelancer(projectId: string, freelancerId: string) {
  return prisma.$transaction(async (tx) => {
    // Prüfen ob Freelancer verfügbar
    const freelancer = await tx.freelancerProfile.findUnique({
      where: { id: freelancerId },
    });

    if (freelancer?.status !== 'ACTIVE') {
      throw new Error('Freelancer not available');
    }

    // Booking erstellen
    return tx.projectBooking.create({
      data: {
        projectId,
        freelancerId,
        status: 'PENDING_ACCEPTANCE',
      },
    });
  });
}
```

### Error Handling

```typescript
import { Prisma } from '@prisma/client';

try {
  await prisma.user.create({
    data: { email: 'existing@email.com', ... },
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = Unique Constraint Violation
    if (error.code === 'P2002') {
      throw new Error('Email already exists');
    }
  }
  throw error;
}

// Häufige Error Codes:
// P2002 - Unique constraint failed
// P2003 - Foreign key constraint failed
// P2025 - Record not found
```

### Testing mit Prisma

```typescript
// tests/helpers/db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeEach(async () => {
  // Tabellen in richtiger Reihenfolge leeren (FK beachten)
  await prisma.message.deleteMany();
  await prisma.projectBooking.deleteMany();
  await prisma.project.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.freelancerProfile.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Test
it('should create a freelancer', async () => {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: 'hash',
      role: 'FREELANCER',
    },
  });

  expect(user.email).toBe('test@example.com');
});
```

---

## 10. Checkliste

### Vor Production

```
Schema:
☐ Alle Indizes definiert (für häufige Queries)
☐ Foreign Keys mit onDelete Cascade/SetNull
☐ Timestamps auf allen Tabellen
☐ Enums statt freier Strings wo möglich
☐ Decimal für Geldbeträge

Performance:
☐ N+1 Queries eliminiert
☐ Pagination implementiert
☐ Nur nötige Felder laden (select)
☐ Query-Logging in Development

Sicherheit:
☐ Keine Raw Queries mit User-Input ohne Escape
☐ Passwörter gehasht (bcrypt)
☐ Keine sensitiven Daten in Logs

Deployment:
☐ Migration-Script im CI/CD
☐ DATABASE_URL als Secret
☐ Connection Pooling konfiguriert
☐ Backup-Strategie
```

### Nützliche Commands

```bash
# Prisma
pnpm prisma generate        # Client generieren
pnpm prisma migrate dev     # Migration erstellen
pnpm prisma migrate deploy  # Migration in Prod
pnpm prisma studio          # GUI
pnpm prisma db push         # Schema direkt pushen (dev only)
pnpm prisma format          # Schema formatieren

# PostgreSQL (direkt)
psql -U postgres -d freelancer  # DB verbinden
\dt                              # Tabellen anzeigen
\d users                         # Tabellen-Schema
\di                              # Indizes anzeigen
```

---

## Ressourcen

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
