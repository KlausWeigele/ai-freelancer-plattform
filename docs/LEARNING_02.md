# Learning Guide Teil 2 - Codebase & Konfiguration

**Zuletzt aktualisiert:** 2025-12-03

Dieses Dokument erklärt alle Konfigurationsdateien und die Struktur unserer Codebase.

---

## Inhaltsverzeichnis

### Projekt-Konfiguration
- [package.json](#packagejson)
- [pnpm-lock.yaml](#pnpm-lockyaml)
- [.npmrc](#npmrc)
- [pnpm-workspace.yaml](#pnpm-workspaceyaml)

### TypeScript & JavaScript
- [tsconfig.json](#tsconfigjson)
- [next-env.d.ts](#next-envdts)

### Code-Qualität
- [ESLint (eslint.config.js)](#eslint-eslintconfigjs)
- [Prettier (.prettierrc)](#prettier-prettierrc)

### Next.js
- [next.config.js](#nextconfigjs)
- [Middleware (middleware.ts)](#middleware-middlewarets)

### Styling
- [Tailwind CSS (tailwind.config.ts)](#tailwind-css-tailwindconfigts)
- [PostCSS (postcss.config.js)](#postcss-postcssconfigjs)
- [shadcn/ui (components.json)](#shadcnui-componentsjson)

### Datenbank
- [Prisma (schema.prisma)](#prisma-schemaprisma)
- [Database Client (db.ts)](#database-client-dbts)

### Docker
- [Dockerfile](#dockerfile)
- [.dockerignore](#dockerignore)
- [docker-compose.yml](#docker-composeyml)
- [Multi-Stage Builds](#multi-stage-builds)
- [Der nextjs User](#der-nextjs-user)

### Git
- [.gitignore](#gitignore)

### Verzeichnisstruktur
- [src/ Ordner](#src-ordner)
- [Wichtige Dateien](#wichtige-dateien)

---

## Projekt-Konfiguration

### package.json

```
Was ist das?   Das "Manifest" des Projekts
Vergleich:     Wie ein Rezept mit Zutatenliste
Zweck:         Definiert Name, Version, Abhängigkeiten, Scripts
```

**Wichtige Bereiche:**

```json
{
  "name": "ai-freelancer-plattform",    // Projektname
  "version": "0.1.0",                    // Versionsnummer
  "private": true,                       // Nicht auf npm veröffentlichen
  "packageManager": "pnpm@10.11.1",      // Welcher Package Manager

  "scripts": {                           // Verfügbare Befehle
    "dev": "next dev",                   // pnpm dev → Startet Dev-Server
    "build": "next build",               // pnpm build → Erstellt Production Build
    "lint": "eslint .",                  // pnpm lint → Prüft Code-Qualität
    "format": "prettier --write ..."     // pnpm format → Formatiert Code
  },

  "dependencies": {                      // Produktions-Abhängigkeiten
    "next": "^16.0.0",                   // Framework
    "react": "^19.2.0",                  // UI-Library
    "@prisma/client": "^6.18.0"          // Datenbank-Client
  },

  "devDependencies": {                   // Entwicklungs-Abhängigkeiten
    "typescript": "^5.9.3",              // TypeScript Compiler
    "eslint": "^9.14.0",                 // Code-Linter
    "prettier": "^3.6.2"                 // Code-Formatter
  }
}
```

**Scripts erklärt:**

| Script | Befehl | Was passiert? |
|--------|--------|---------------|
| `pnpm dev` | `next dev` | Startet Entwicklungsserver auf localhost:3000 |
| `pnpm build` | `next build` | Erstellt optimierte Production-Version |
| `pnpm start` | `next start` | Startet Production-Server |
| `pnpm lint` | `eslint .` | Prüft Code auf Fehler/Stil |
| `pnpm format` | `prettier --write` | Formatiert alle Dateien automatisch |
| `pnpm typecheck` | `tsc --noEmit` | Prüft TypeScript-Typen |
| `pnpm db:generate` | `prisma generate` | Generiert Prisma Client |
| `pnpm db:studio` | `prisma studio` | Öffnet Datenbank-GUI |

---

### pnpm-lock.yaml

```
Was ist das?   "Einkaufsliste" mit exakten Versionen
Vergleich:     Wie eine Quittung die zeigt was genau gekauft wurde
Zweck:         Garantiert identische Versionen auf allen Rechnern
```

**Warum wichtig?**

```
Ohne Lock-File:
┌─────────────────────────────────────────────────────────┐
│  Klaus' Rechner    →  react@19.2.0                      │
│  Server            →  react@19.2.1 (neuere Version)    │
│  CI Pipeline       →  react@19.1.9 (ältere Version)    │
└─────────────────────────────────────────────────────────┘
Problem: Unterschiedliche Versionen = unterschiedliches Verhalten!

Mit Lock-File:
┌─────────────────────────────────────────────────────────┐
│  Klaus' Rechner    →  react@19.2.0                      │
│  Server            →  react@19.2.0 (gleich!)           │
│  CI Pipeline       →  react@19.2.0 (gleich!)           │
└─────────────────────────────────────────────────────────┘
Lösung: Alle haben exakt dieselben Versionen!
```

**Wichtig:** Lock-File immer committen! (`git add pnpm-lock.yaml`)

---

### .npmrc

```
Was ist das?   Konfiguration für pnpm/npm
Vergleich:     Wie Einstellungen für den Paketmanager
Zweck:         Steuert wie Pakete installiert werden
```

**Unsere Einstellungen:**

```ini
shamefully-hoist=true
ignore-workspace-root-check=true
```

| Einstellung | Bedeutung |
|-------------|-----------|
| `shamefully-hoist=true` | Hebt Pakete in den Root node_modules (Kompatibilität) |
| `ignore-workspace-root-check=true` | Erlaubt Installation im Workspace-Root |

**Warum "shamefully"?**
- pnpm isoliert normalerweise Pakete strikt (gut für Sicherheit)
- Manche Pakete erwarten aber "gehobene" Struktur
- "Schamvoll" weil es die strenge Isolation aufweicht

---

### pnpm-workspace.yaml

```
Was ist das?   Definiert Monorepo-Struktur
Vergleich:     Wie ein Grundriss der zeigt welche "Räume" zusammengehören
Zweck:         Bei uns: Isoliert Projekt vom HOME-Verzeichnis
```

**Unsere Datei:**

```yaml
packages: []
```

**Hintergrund:**
- Im HOME-Verzeichnis existierte eine globale `pnpm-workspace.yaml`
- pnpm installierte dadurch Pakete am falschen Ort
- Lösung: Lokale leere Workspace-Datei "überschreibt" die globale

---

## TypeScript & JavaScript

### tsconfig.json

```
Was ist das?   TypeScript-Compiler-Konfiguration
Vergleich:     Wie Regeln für einen Übersetzer
Zweck:         Definiert wie TypeScript in JavaScript übersetzt wird
```

**Wichtige Einstellungen:**

```json
{
  "compilerOptions": {
    "target": "ES2022",           // Ziel-JavaScript-Version
    "strict": true,               // Strenge Typ-Prüfung AN
    "noEmit": true,               // Kein Output (Next.js macht das)
    "jsx": "react-jsx",           // React JSX-Syntax
    "paths": {
      "@/*": ["./src/*"]          // Import-Alias: @/components statt ../../../
    }
  }
}
```

**Was bedeutet "strict: true"?**

```typescript
// Ohne strict: true (gefährlich!)
function greet(name) {           // name hat Typ "any" - alles erlaubt
  return name.toUpperCase();     // Könnte crashen wenn name = null
}

// Mit strict: true (sicher!)
function greet(name: string) {   // name MUSS string sein
  return name.toUpperCase();     // TypeScript garantiert: das funktioniert
}
```

**Der @-Alias erklärt:**

```typescript
// Ohne Alias (hässlich):
import { Button } from '../../../components/ui/button';
import { prisma } from '../../../../lib/db';

// Mit Alias (schön):
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/db';
```

---

### next-env.d.ts

```
Was ist das?   TypeScript-Definitionen für Next.js
Vergleich:     Wie ein Wörterbuch das TypeScript erklärt was Next.js kann
Zweck:         Ermöglicht Autovervollständigung und Typ-Prüfung
```

**Inhalt:**

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

**Wichtig:** Diese Datei NIE manuell bearbeiten! Next.js generiert sie automatisch.

---

## Code-Qualität

### ESLint (eslint.config.js)

```
Was ist das?   Code-Linter (findet Fehler und Stilprobleme)
Vergleich:     Wie ein Korrekturleser der Fehler markiert
Zweck:         Verhindert häufige Bugs und erzwingt Coding-Standards
```

**Unsere Konfiguration:**

```javascript
import nextCoreWeb from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextCoreWeb,                    // Next.js Best Practices
  {
    ignores: ['.next/**', 'node_modules/**']  // Diese ignorieren
  },
];

export default config;
```

**Was ESLint findet:**

```typescript
// ESLint Fehler:
const x = 5;              // Error: 'x' is assigned but never used
if (x = 5) { }            // Error: Expected '===' but found '='
console.log(foo);         // Error: 'foo' is not defined

// ESLint OK:
const x = 5;
console.log(x);           // x wird verwendet ✓
if (x === 5) { }          // Korrekter Vergleich ✓
```

---

### Prettier (.prettierrc)

```
Was ist das?   Code-Formatter (macht Code einheitlich schön)
Vergleich:     Wie ein Layouter der Text schön formatiert
Zweck:         Einheitlicher Code-Stil im ganzen Team
```

**Unsere Einstellungen:**

```json
{
  "semi": true,           // Semikolons am Ende: ja
  "singleQuote": true,    // Einfache Anführungszeichen: ja
  "tabWidth": 2,          // Einrückung: 2 Leerzeichen
  "trailingComma": "es5", // Trailing Comma nach ES5-Standard
  "printWidth": 100,      // Max. Zeilenlänge: 100 Zeichen
  "endOfLine": "lf"       // Unix-Zeilenenden (LF statt CRLF)
}
```

**Vorher/Nachher:**

```typescript
// Vorher (unformatiert):
const user={name:"Klaus",age:30,skills:["TypeScript","React","AWS"]}
function greet(name){return "Hello "+name}

// Nach pnpm format (formatiert):
const user = {
  name: 'Klaus',
  age: 30,
  skills: ['TypeScript', 'React', 'AWS'],
};
function greet(name) {
  return 'Hello ' + name;
}
```

**ESLint vs. Prettier:**

| Tool | Aufgabe | Beispiel |
|------|---------|----------|
| **ESLint** | Findet Bugs | "Diese Variable wird nie verwendet" |
| **Prettier** | Formatiert Code | "Hier fehlt ein Leerzeichen" |

---

## Next.js

### next.config.js

```
Was ist das?   Next.js Framework-Konfiguration
Vergleich:     Wie die Einstellungen für das gesamte Projekt
Zweck:         Steuert Build-Prozess, Features, Optimierungen
```

**Unsere wichtigsten Einstellungen:**

```javascript
const nextConfig = {
  // Standalone Output für Docker
  output: 'standalone',

  // React Strict Mode (findet Probleme)
  reactStrictMode: true,

  // SWC Minifier (schneller als Terser)
  swcMinify: true,

  // Bild-Optimierung
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

**Was ist `output: 'standalone'`?**

```
Ohne standalone:
┌─────────────────────────────────────────┐
│  Docker Image: ~1 GB                    │
│  - Alle node_modules                    │
│  - Alle Source Files                    │
│  - Build-Tools                          │
└─────────────────────────────────────────┘

Mit standalone:
┌─────────────────────────────────────────┐
│  Docker Image: ~150 MB                  │
│  - Nur notwendige Dateien               │
│  - Optimierter Server                   │
│  - Keine Build-Tools                    │
└─────────────────────────────────────────┘
```

---

### Middleware (middleware.ts)

```
Was ist das?   Code der VOR jeder Anfrage läuft
Vergleich:     Wie ein Türsteher der jeden Besucher prüft
Zweck:         Auth-Check, Weiterleitungen, Header setzen
```

**Unsere Middleware (Basic Auth):**

```typescript
export function middleware(request: NextRequest) {
  // 1. Prüfe ob Basic Auth konfiguriert ist
  const basicAuthUser = process.env.BASIC_AUTH_USER;
  const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD;

  // 2. Wenn nicht konfiguriert → durchlassen
  if (!basicAuthUser || !basicAuthPassword) {
    return NextResponse.next();
  }

  // 3. Health-Endpoints immer durchlassen
  if (request.nextUrl.pathname === '/api/health') {
    return NextResponse.next();
  }

  // 4. Authorization Header prüfen
  const authHeader = request.headers.get('authorization');
  // ... Prüfung ...

  // 5. Bei Fehler: 401 zurückgeben
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Staging Area"' },
  });
}
```

**Request-Flow mit Middleware:**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │───▶│  Middleware │───▶│    Page     │
│   Request   │    │   (Check)   │    │   /route    │
└─────────────┘    └──────┬──────┘    └─────────────┘
                          │
                          ▼
                   Auth OK? ────▶ Ja: Weiter zur Page
                          │
                          ▼
                        Nein: 401 Unauthorized
```

---

## Styling

### Tailwind CSS (tailwind.config.ts)

```
Was ist das?   Utility-First CSS Framework
Vergleich:     Wie ein Baukasten mit fertigen CSS-Klassen
Zweck:         Schnelles Styling direkt im HTML/JSX
```

**Konfiguration:**

```typescript
const config: Config = {
  // Welche Dateien nach Klassen durchsuchen
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],

  // Theme erweitern
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',      // CSS Variable
        secondary: 'hsl(var(--secondary))',
      },
    },
  },

  // Plugins
  plugins: [require('tailwindcss-animate')],
};
```

**Tailwind vs. normales CSS:**

```jsx
// Normales CSS (eigene Datei nötig):
<div className="card">
  <h1 className="card-title">Hello</h1>
</div>

// Tailwind (alles inline):
<div className="bg-white rounded-lg shadow-md p-4">
  <h1 className="text-xl font-bold text-gray-900">Hello</h1>
</div>
```

---

### PostCSS (postcss.config.js)

```
Was ist das?   CSS-Transformer/Prozessor
Vergleich:     Wie eine Werkstatt die CSS verbessert
Zweck:         Verarbeitet CSS (Tailwind, Autoprefixer)
```

**Unsere Plugins:**

```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // Tailwind-Klassen → echtes CSS
    autoprefixer: {},            // Fügt Browser-Prefixe hinzu
  },
};
```

**Was macht Autoprefixer?**

```css
/* Dein CSS: */
.box {
  display: flex;
}

/* Nach Autoprefixer (für ältere Browser): */
.box {
  display: -webkit-box;    /* Safari 6 */
  display: -ms-flexbox;    /* IE 10 */
  display: flex;           /* Modern */
}
```

---

### shadcn/ui (components.json)

```
Was ist das?   Konfiguration für shadcn/ui Komponenten
Vergleich:     Wie Einstellungen für einen UI-Baukasten
Zweck:         Steuert wie neue Komponenten generiert werden
```

**Unsere Konfiguration:**

```json
{
  "style": "new-york",           // Design-Stil (new-york vs. default)
  "rsc": true,                   // React Server Components: ja
  "tsx": true,                   // TypeScript: ja
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",        // Basis-Farbschema
    "cssVariables": true         // CSS-Variablen nutzen
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  },
  "iconLibrary": "lucide"        // Icon-Bibliothek
}
```

**Komponente hinzufügen:**

```bash
# Button-Komponente installieren
pnpm dlx shadcn@latest add button

# Generiert: src/components/ui/button.tsx
```

---

## Datenbank

### Prisma (schema.prisma)

```
Was ist das?   Datenbank-Schema und ORM-Konfiguration
Vergleich:     Wie ein Bauplan für die Datenbank-Tabellen
Zweck:         Definiert Tabellen, Beziehungen, Typen
```

**Aufbau:**

```prisma
// 1. Generator: Was soll generiert werden?
generator client {
  provider = "prisma-client-js"    // JavaScript/TypeScript Client
}

// 2. Datasource: Welche Datenbank?
datasource db {
  provider = "postgresql"           // PostgreSQL
  url      = env("DATABASE_URL")    // Aus Umgebungsvariable
}

// 3. Enums: Vordefinierte Werte
enum UserRole {
  FREELANCER
  COMPANY
  ADMIN
}

// 4. Models: Tabellen
model User {
  id            String    @id @default(uuid())    // Primary Key
  email         String    @unique                 // Eindeutig
  role          UserRole                          // Enum-Typ
  createdAt     DateTime  @default(now())         // Auto-Datum

  // Beziehung zu anderem Model
  profile       FreelancerProfile?

  @@index([email])                                // Index für Suche
  @@map("users")                                  // Tabellen-Name in DB
}
```

**Prisma-Workflow:**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  schema.prisma  │───▶│ prisma generate │───▶│  Prisma Client  │
│   (Bauplan)     │    │  (Generieren)   │    │  (TypeScript)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │◀───│ prisma migrate  │◀───│  schema.prisma  │
│   (Datenbank)   │    │  (Migration)    │    │   (Bauplan)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

### Database Client (db.ts)

```
Was ist das?   Singleton-Pattern für Prisma Client
Vergleich:     Wie ein "Türsteher" der nur EINE Verbindung erlaubt
Zweck:         Verhindert zu viele Datenbankverbindungen
```

**Der Code erklärt:**

```typescript
import { PrismaClient } from '@prisma/client';

// 1. Global-Speicher für Prisma-Instanz
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 2. Nutze existierende Instanz ODER erstelle neue
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']  // In Dev: Mehr Logs
      : ['error'],                   // In Prod: Nur Fehler
  });

// 3. In Development: Speichere Instanz global
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Warum Singleton?**

```
Ohne Singleton (in Development):
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Hot Reload  │───▶│ Neue Prisma │───▶│ Neue DB     │
│ (Änderung)  │    │  Instanz    │    │ Connection  │
└─────────────┘    └─────────────┘    └─────────────┘
        │                                    │
        ▼                                    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Hot Reload  │───▶│ Neue Prisma │───▶│ NOCH eine   │
│ (Änderung)  │    │  Instanz    │    │ Connection  │
└─────────────┘    └─────────────┘    └─────────────┘
Problem: Zu viele Connections → Database Error!

Mit Singleton:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Hot Reload  │───▶│ Gleiche     │───▶│ Gleiche DB  │
│ (Änderung)  │    │  Instanz    │    │ Connection  │
└─────────────┘    └─────────────┘    └─────────────┘
Lösung: Immer dieselbe Connection!
```

---

## Docker

### Dockerfile

```
Was ist das?   Bauanleitung für Docker-Image
Vergleich:     Wie ein Rezept das Schritt für Schritt erklärt
Zweck:         Definiert wie die App in einen Container verpackt wird
```

**Multi-Stage Build erklärt:**

```dockerfile
# ═══════════════════════════════════════════════════════════════
# STAGE 1: deps (Abhängigkeiten installieren)
# ═══════════════════════════════════════════════════════════════
FROM node:20-alpine AS deps

# pnpm aktivieren
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ═══════════════════════════════════════════════════════════════
# STAGE 2: builder (App bauen)
# ═══════════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.11.1 --activate
WORKDIR /app

# Dependencies von Stage 1 kopieren
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma Client generieren & App bauen
RUN pnpm prisma generate
RUN pnpm build

# ═══════════════════════════════════════════════════════════════
# STAGE 3: runner (Produktions-Image)
# ═══════════════════════════════════════════════════════════════
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Sicherheit: Nicht-Root User
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Nur das Nötigste kopieren
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Als nextjs User ausführen
USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
```

---

### Multi-Stage Builds

```
Was ist das?   Mehrere Build-Phasen in einer Dockerfile
Vergleich:     Wie eine Fabrik mit verschiedenen Abteilungen
Zweck:         Kleines, sicheres Production-Image
```

**Visualisierung:**

```
┌─────────────────────────────────────────────────────────────────┐
│                        STAGE 1: deps                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Node.js 20 Alpine                                      │   │
│  │  + pnpm                                                 │   │
│  │  + node_modules (1.2 GB)                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ COPY node_modules
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       STAGE 2: builder                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Node.js 20 Alpine                                      │   │
│  │  + node_modules (von Stage 1)                          │   │
│  │  + Source Code                                          │   │
│  │  + pnpm build → .next/standalone                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ COPY nur .next/standalone (~150 MB)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                       STAGE 3: runner                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Node.js 20 Alpine                                      │   │
│  │  + .next/standalone (150 MB)                           │   │
│  │  + .next/static                                         │   │
│  │  + public/                                              │   │
│  │  ────────────────────────────────────────              │   │
│  │  KEIN: node_modules, Source Code, Build-Tools          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  FINAL IMAGE: ~300 MB (statt 1.5 GB!)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### Der nextjs User

```
Was ist das?   Nicht-Root User im Docker Container
Vergleich:     Wie ein Mitarbeiter mit eingeschränkten Rechten
Zweck:         Sicherheit - verhindert Systemzugriff bei Hack
```

**Warum wichtig?**

```dockerfile
# GEFÄHRLICH - Root User:
CMD ["node", "server.js"]
# Wenn Hacker eindringt → hat VOLLE Kontrolle über Container
# Kann Dateien lesen/schreiben, Netzwerk manipulieren, etc.

# SICHER - nextjs User:
USER nextjs
CMD ["node", "server.js"]
# Wenn Hacker eindringt → nur eingeschränkte Rechte
# Kann nur /app Verzeichnis lesen, keine Systemdateien
```

**Der User wird so erstellt:**

```dockerfile
# Gruppe erstellen (GID 1001)
RUN addgroup --system --gid 1001 nodejs

# User erstellen (UID 1001)
RUN adduser --system --uid 1001 nextjs

# Dateien dem User zuweisen
COPY --chown=nextjs:nodejs /app/.next/standalone ./

# Als User ausführen
USER nextjs
```

---

### .dockerignore

```
Was ist das?   Liste von Dateien die Docker ignorieren soll
Vergleich:     Wie .gitignore aber für Docker
Zweck:         Kleineres Build-Context, schnellerer Build
```

**Wichtige Einträge:**

```
node_modules/       # Werden im Container neu installiert
.next/              # Wird im Container neu gebaut
.git/               # Nicht im Image nötig
*.md                # Dokumentation nicht im Image
terraform/          # Infrastruktur-Code nicht im Image
tests/              # Tests nicht in Production
```

---

### docker-compose.yml

```
Was ist das?   Orchestrierung mehrerer Container
Vergleich:     Wie ein Dirigent der mehrere Musiker koordiniert
Zweck:         Startet App + Datenbank + andere Services zusammen
```

**Beispiel:**

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/freelancer
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: freelancer
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Befehle:**

```bash
docker-compose up       # Alle Services starten
docker-compose down     # Alle Services stoppen
docker-compose logs -f  # Logs aller Services anzeigen
```

---

## Git

### .gitignore

```
Was ist das?   Liste von Dateien die Git ignorieren soll
Vergleich:     Wie eine "Nicht-Einpacken"-Liste beim Umzug
Zweck:         Hält Repository sauber, schützt Secrets
```

**Wichtige Kategorien:**

```gitignore
# Dependencies (werden frisch installiert)
node_modules/

# Build Output (wird frisch gebaut)
.next/
dist/

# Secrets (NIEMALS committen!)
.env
.env.local
*.pem

# IDE-spezifisch (jeder hat andere)
.vscode/
.idea/

# OS-spezifisch
.DS_Store        # macOS
Thumbs.db        # Windows
```

---

## Verzeichnisstruktur

### src/ Ordner

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth-Routen (gruppiert)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Dashboard-Routen (gruppiert)
│   │   └── dashboard/
│   ├── api/               # API Routes
│   │   ├── health/        # GET /api/health
│   │   └── version/       # GET /api/version
│   ├── layout.tsx         # Root Layout
│   ├── page.tsx           # Homepage (/)
│   └── globals.css        # Globale Styles
│
├── components/            # React Komponenten
│   ├── layouts/           # Layout-Komponenten (Header, Footer)
│   └── ui/                # UI-Komponenten (Button, Card, etc.)
│
├── lib/                   # Utility-Funktionen
│   ├── db.ts              # Prisma Client
│   └── utils.ts           # Hilfsfunktionen
│
├── middleware.ts          # Next.js Middleware (Basic Auth)
│
├── server/                # Server-seitiger Code
│   └── trpc/              # tRPC Router (geplant)
│
├── hooks/                 # Custom React Hooks
├── store/                 # State Management (geplant)
├── types/                 # TypeScript Type Definitionen
└── config/                # App-Konfiguration
```

---

### Wichtige Dateien

| Datei | Ort | Zweck |
|-------|-----|-------|
| `layout.tsx` | src/app/ | Root Layout (HTML, Head, Body) |
| `page.tsx` | src/app/ | Homepage-Komponente |
| `globals.css` | src/app/ | Globale CSS-Variablen und Styles |
| `middleware.ts` | src/ | Request-Interceptor (Basic Auth) |
| `db.ts` | src/lib/ | Prisma Client Singleton |
| `route.ts` | src/app/api/*/ | API Endpoint Handler |

---

## Glossar

| Begriff | Erklärung |
|---------|-----------|
| **Linter** | Tool das Code auf Fehler und Stil prüft (ESLint) |
| **Formatter** | Tool das Code automatisch formatiert (Prettier) |
| **ORM** | Object-Relational Mapping - Datenbank als Objekte (Prisma) |
| **Singleton** | Design Pattern - nur EINE Instanz erlaubt |
| **Multi-Stage Build** | Docker Build mit mehreren Phasen für kleinere Images |
| **Lock File** | Datei mit exakten Paket-Versionen |
| **Monorepo** | Ein Repository mit mehreren Projekten |
| **Utility-First CSS** | CSS-Klassen für einzelne Eigenschaften (Tailwind) |
| **Hot Reload** | Automatisches Neuladen bei Code-Änderungen |
| **Middleware** | Code der vor dem eigentlichen Request-Handler läuft |

---

*Dieses Dokument wird kontinuierlich erweitert.*
