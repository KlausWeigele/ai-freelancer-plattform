# Learning Guide - AI-Freelancer-Plattform

**Zuletzt aktualisiert:** 2025-12-02

Dieses Dokument erklärt die wichtigsten Technologien und Konzepte des Projekts in einfachen Worten.

---

## Inhaltsverzeichnis

### AWS (Amazon Web Services)
- [ECR Repository](#ecr-repository-elastic-container-registry)
- [ECR Lifecycle Policy](#ecr-lifecycle-policy)
- [ECS Cluster](#ecs-cluster-elastic-container-service)
- [ECS Task & Service](#ecs-task--service-kommt-später)
- [Zusammenspiel der AWS-Komponenten](#zusammenspiel-der-aws-komponenten)

### Docker & Container
- [Was ist Docker?](#was-ist-docker)
- [Docker Image vs Container](#docker-image-vs-container)
- [Dockerfile](#dockerfile)
- [Multi-Stage Builds](#multi-stage-builds)

### CI/CD (Continuous Integration / Deployment)
- [GitHub Actions](#github-actions)
- [CI Pipeline](#ci-pipeline)
- [CD Pipeline](#cd-pipeline)
- [GitHub Secrets](#github-secrets)

### Terraform (Infrastructure as Code)
- [Was ist Terraform?](#was-ist-terraform)
- [Terraform Workflow](#terraform-workflow)
- [State Management](#state-management)

### Next.js & Web-Entwicklung
- [App Router](#app-router)
- [Middleware](#middleware)
- [API Routes](#api-routes)

### Authentifizierung & Sicherheit
- [Was ist Authentifizierung?](#was-ist-authentifizierung)
- [Basic Auth (HTTP Basic Authentication)](#basic-auth-http-basic-authentication)
- [JWT (JSON Web Tokens)](#jwt-json-web-tokens)
- [Session-basierte Auth](#session-basierte-auth)
- [OAuth 2.0](#oauth-20)
- [Vergleich der Auth-Methoden](#vergleich-der-auth-methoden)
- [Unsere Auth-Strategie](#unsere-auth-strategie)

### Kostenübersicht
- [Aktuelle Kostenübersicht](#aktuelle-kostenübersicht-stand-2025-12-02)

---

## AWS (Amazon Web Services)

### ECR Repository (Elastic Container Registry)

```
Was ist das?   Ein privates Docker-Image-Lager in der Cloud
Vergleich:     Wie Docker Hub, aber privat und in deinem AWS-Account
Zweck:         Speichert deine Docker-Images (z.B. freelancer-app:v1.0.0)
```

**Ablauf:**
```
GitHub Actions → baut Docker Image → pusht zu ECR → ECS zieht es von dort
```

**Kosten:**
- Erste 500 MB Speicher: kostenlos
- Danach: $0.10 pro GB/Monat
- Datenübertragung: Erste 1 GB/Monat kostenlos

**Beispiel-URI:**
```
093205941484.dkr.ecr.eu-central-1.amazonaws.com/freelancer-app
└── Account-ID ──┘     └── Region ──┘              └── Repo-Name ─┘
```

---

### ECR Lifecycle Policy

```
Was ist das?   Automatische Aufräum-Regel für alte Docker-Images
Vergleich:     Wie ein Müllmann, der alte Versionen wegräumt
Zweck:         Spart Speicherkosten, behält nur die letzten N Images
```

**Ohne Policy:**
```
100 Deployments = 100 Images gespeichert = hohe Kosten
```

**Mit Policy (Keep last 20):**
```
100 Deployments = nur 20 Images behalten = niedrige Kosten
```

**Unsere Konfiguration:**
```json
{
  "rules": [{
    "description": "Keep last 20 images",
    "selection": {
      "countType": "imageCountMoreThan",
      "countNumber": 20
    },
    "action": { "type": "expire" }
  }]
}
```

---

### ECS Cluster (Elastic Container Service)

```
Was ist das?   Ein logischer Container für deine laufenden Anwendungen
Vergleich:     Wie ein "Ordner" für Container - noch leer, aber bereit
Zweck:         Hier werden später deine Docker-Container gestartet
```

**Status-Beispiele:**
```
Leerer Cluster:     Keine Container laufen = $0 Kosten
Mit 1 Task:         1 Container läuft = ~$15-30/Monat (Fargate)
Mit Auto-Scaling:   1-10 Container je nach Last
```

**Container Insights:**
- Optional: Detaillierte Metriken und Logs
- Kosten: ~$0.01 pro Task/Stunde
- Bei uns: Deaktiviert (Kosteneinsparung)

---

### ECS Task & Service (kommt später)

**Task Definition:**
```
Was ist das?   "Rezept" für einen Container
Enthält:       - Welches Docker Image
               - Wie viel CPU/RAM
               - Welche Ports
               - Welche Umgebungsvariablen
```

**Service:**
```
Was ist das?   Hält eine bestimmte Anzahl Tasks am Laufen
Zweck:         - Startet Container neu bei Absturz
               - Verteilt Traffic über Load Balancer
               - Auto-Scaling bei hoher Last
```

**Fargate vs EC2:**
```
Fargate:  AWS verwaltet Server → Einfacher, etwas teurer
EC2:      Du verwaltest Server → Komplexer, günstiger bei hoher Last
```

---

### Zusammenspiel der AWS-Komponenten

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Cloud                                 │
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │     ECR     │    │     ECS     │    │        ALB          │  │
│  │ Repository  │───▶│   Cluster   │◀───│  (Load Balancer)    │  │
│  │             │    │             │    │                     │  │
│  │ freelancer- │    │ ┌─────────┐ │    │  weigele.art:443    │  │
│  │ app:latest  │    │ │  Task   │ │    │         │           │  │
│  └─────────────┘    │ │ (Cont.) │ │    └─────────┼───────────┘  │
│        ▲            │ └─────────┘ │              │              │
│        │            └─────────────┘              │              │
│        │                   │                     │              │
│        │                   ▼                     │              │
│        │            ┌─────────────┐              │              │
│        │            │     RDS     │              │              │
│        │            │ (Datenbank) │              │              │
│        │            └─────────────┘              │              │
└────────┼────────────────────────────────────────┼──────────────┘
         │                                         │
         │                                         ▼
┌────────┴────────┐                        ┌─────────────┐
│  GitHub Actions │                        │   Browser   │
│  (CI/CD)        │                        │   (User)    │
└─────────────────┘                        └─────────────┘
```

---

## Docker & Container

### Was ist Docker?

```
Was ist das?   Software zum Verpacken von Anwendungen
Vergleich:     Wie ein Umzugskarton - alles drin, funktioniert überall
Zweck:         "Works on my machine" → "Works everywhere"
```

**Vorteile:**
- Gleiche Umgebung in Entwicklung und Produktion
- Schnelles Deployment
- Isolierung von Anwendungen
- Einfaches Skalieren

---

### Docker Image vs Container

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Docker Image              Docker Container            │
│   ────────────              ────────────────            │
│                                                         │
│   "Bauplan/Rezept"    →     "Laufende Instanz"         │
│   Statisch                   Dynamisch                  │
│   Kann geteilt werden        Läuft auf einem Server    │
│                                                         │
│   Beispiel:                  Beispiel:                  │
│   freelancer-app:v1.0.0      Container ID: abc123       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Analogie:**
```
Image     = Klasse (Bauplan)
Container = Objekt (Instanz der Klasse)
```

---

### Dockerfile

Unser Dockerfile verwendet Multi-Stage Builds:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20-alpine AS builder
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm build

# Stage 3: Runner (Production)
FROM node:20-alpine AS runner
COPY --from=builder /app/.next/standalone ./
CMD ["node", "server.js"]
```

---

### Multi-Stage Builds

```
Was ist das?   Mehrere FROM-Anweisungen in einem Dockerfile
Zweck:         Kleines Production-Image (nur das Nötigste)
```

**Ohne Multi-Stage:**
```
Image-Größe: ~1.5 GB (inkl. Build-Tools, devDependencies)
```

**Mit Multi-Stage:**
```
Image-Größe: ~150 MB (nur Runtime + App)
```

**Warum wichtig:**
- Schnellerer Download/Upload
- Weniger Angriffsfläche (keine Build-Tools in Production)
- Geringere Kosten (weniger Speicher/Transfer)

---

## CI/CD (Continuous Integration / Deployment)

### GitHub Actions

```
Was ist das?   Automatisierung direkt in GitHub
Vergleich:     Wie ein Roboter, der bei jedem Push arbeitet
Zweck:         Automatisches Testen, Bauen, Deployen
```

**Workflow-Datei:** `.github/workflows/ci.yml`

**Trigger:**
```yaml
on:
  push:           # Bei jedem Push
  pull_request:   # Bei jedem PR
  schedule:       # Zeitgesteuert (z.B. Nightly)
```

---

### CI Pipeline

**Was passiert bei jedem Push:**

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Checkout  │──▶│    Lint     │──▶│    Test     │──▶│    Build    │
│    Code     │   │  (ESLint)   │   │  (Jest)     │   │  (Next.js)  │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
                         │                │                  │
                         ▼                ▼                  ▼
                    Fehler?           Fehler?           Fehler?
                    ──────            ──────            ──────
                    PR blockiert      PR blockiert      PR blockiert
```

---

### CD Pipeline

**Was passiert beim Deployment:**

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Docker    │──▶│   Push to   │──▶│   Update    │──▶│   Health    │
│    Build    │   │     ECR     │   │    ECS      │   │    Check    │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

---

### GitHub Secrets

```
Was ist das?   Sichere Speicherung von Passwörtern/Keys in GitHub
Vergleich:     Wie ein Tresor, auf den nur CI/CD zugreifen kann
Zweck:         Sensible Daten nicht im Code speichern
```

**Wo finde ich das?**
```
GitHub Repository → Settings → Secrets and variables → Actions
```

**Unsere Secrets:**

| Secret | Beschreibung | Beispiel |
|--------|--------------|----------|
| `AWS_ACCESS_KEY_ID` | AWS IAM Access Key | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Secret Key | (geheim) |
| `AWS_ACCOUNT_ID` | AWS Account Nummer | `123456789012` |
| `AWS_REGION` | AWS Region | `eu-central-1` |
| `BASIC_AUTH_USER` | HTTP Basic Auth Username | `staging` |
| `BASIC_AUTH_PASSWORD` | HTTP Basic Auth Passwort | (geheim) |

**Secrets setzen mit gh CLI:**

```bash
# Im Projektverzeichnis ausführen
cd /path/to/freelancer

# Secret interaktiv setzen (fragt nach Wert)
gh secret set BASIC_AUTH_USER
# → "staging" eingeben

gh secret set BASIC_AUTH_PASSWORD
# → Sicheres Passwort eingeben

# Oder direkt mit Wert (Vorsicht: in Shell-History sichtbar!)
gh secret set BASIC_AUTH_USER --body "staging"

# Sicheres Passwort generieren
openssl rand -base64 24
# → Ausgabe als BASIC_AUTH_PASSWORD verwenden
```

**Wie werden Secrets in Workflows genutzt?**

```yaml
# In .github/workflows/deploy-production.yml
- name: Deploy Container
  run: |
    docker run \
      -e BASIC_AUTH_USER="${{ secrets.BASIC_AUTH_USER }}" \
      -e BASIC_AUTH_PASSWORD="${{ secrets.BASIC_AUTH_PASSWORD }}" \
      my-app:latest
```

**Wichtige Regeln:**
- ❌ Secrets NIEMALS im Code speichern
- ❌ Secrets NIEMALS in Logs ausgeben
- ✅ Secrets immer über `${{ secrets.NAME }}` referenzieren
- ✅ Für lokale Entwicklung: `.env.local` (gitignored!)

---

## Terraform (Infrastructure as Code)

### Was ist Terraform?

```
Was ist das?   Tool zum Definieren von Cloud-Infrastruktur als Code
Vergleich:     Wie ein Bauplan für deine AWS-Ressourcen
Zweck:         Reproduzierbare, versionierte Infrastruktur
```

**Ohne Terraform (manuell):**
```
- Klick hier, klick da in AWS Console
- Niemand weiß genau was konfiguriert wurde
- Schwer zu reproduzieren
```

**Mit Terraform:**
```hcl
resource "aws_ecr_repository" "app" {
  name = "freelancer-app"
}
```
- Code ist dokumentiert
- Änderungen sind nachvollziehbar (Git)
- Identische Umgebungen möglich

---

### Terraform Workflow

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│    init     │──▶│    plan     │──▶│   apply     │──▶│   destroy   │
│             │   │             │   │             │   │  (optional) │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
      │                 │                 │                 │
      ▼                 ▼                 ▼                 ▼
  Provider          Zeigt was         Erstellt/        Löscht alles
  herunterladen     passieren wird    ändert           wieder
```

**Befehle:**
```bash
terraform init      # Provider installieren
terraform plan      # Vorschau (ändert nichts!)
terraform apply     # Ausführen (mit Bestätigung)
terraform destroy   # Alles löschen
```

---

### State Management

```
Was ist das?   Terraform speichert den aktuellen Zustand
Datei:         terraform.tfstate
Zweck:         Terraform weiß was existiert vs. was definiert ist
```

**Wichtig:**
- State-Datei NICHT in Git committen (enthält Secrets)
- Für Teams: Remote State (S3 Bucket)
- Bei uns: Lokaler State (Einzelentwickler)

---

## Next.js & Web-Entwicklung

### App Router

```
Was ist das?   Neues Routing-System in Next.js 13+
Vergleich:     Ordnerstruktur = URL-Struktur
```

**Beispiel:**
```
src/app/
├── page.tsx              →  /
├── impressum/
│   └── page.tsx          →  /impressum
├── (auth)/
│   ├── login/
│   │   └── page.tsx      →  /login
│   └── register/
│       └── page.tsx      →  /register
└── api/
    └── health/
        └── route.ts      →  /api/health
```

**Klammern `(auth)`:** Gruppierung ohne URL-Einfluss

---

### Middleware

```
Was ist das?   Code der VOR jeder Anfrage ausgeführt wird
Datei:         src/middleware.ts
Zweck:         Auth-Check, Redirects, Header setzen
```

**Unser Beispiel (Basic Auth):**
```typescript
export function middleware(request: NextRequest) {
  // Prüfe Credentials
  if (!authenticated) {
    return new Response('Auth required', { status: 401 });
  }
  return NextResponse.next();
}
```

---

### API Routes

```
Was ist das?   Backend-Endpunkte in Next.js
Vergleich:     Wie Express.js Routes, aber integriert
```

**Beispiel `/api/health`:**
```typescript
// src/app/api/health/route.ts
export async function GET() {
  const dbOk = await checkDatabase();
  return Response.json({
    status: dbOk ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString()
  });
}
```

**Aufruf:**
```bash
curl https://weigele.art/api/health
# → {"status":"healthy","timestamp":"2025-12-02T..."}
```

---

## Authentifizierung & Sicherheit

### Was ist Authentifizierung?

```
Authentifizierung = "Wer bist du?"
Autorisierung     = "Was darfst du?"
```

**Beispiel:**
```
1. Login mit E-Mail/Passwort     → Authentifizierung (Identität prüfen)
2. Darf User Projekt bearbeiten? → Autorisierung (Rechte prüfen)
```

**Warum wichtig:**
- Schutz sensibler Daten
- Zugriffskontrolle
- Nachvollziehbarkeit (wer hat was gemacht?)

---

### Basic Auth (HTTP Basic Authentication)

```
Was ist das?   Einfachste Form der HTTP-Authentifizierung
Wie:           Username + Passwort werden bei JEDER Anfrage mitgeschickt
Wann nutzen:   Staging-Umgebungen, interne Tools, APIs
```

**So funktioniert es:**

```
┌─────────────┐                      ┌─────────────┐
│   Browser   │                      │   Server    │
└──────┬──────┘                      └──────┬──────┘
       │                                    │
       │  1. GET /dashboard                 │
       │ ──────────────────────────────────▶│
       │                                    │
       │  2. 401 Unauthorized               │
       │     WWW-Authenticate: Basic        │
       │ ◀──────────────────────────────────│
       │                                    │
       │  ┌─────────────────────┐           │
       │  │ Browser zeigt       │           │
       │  │ Login-Dialog        │           │
       │  └─────────────────────┘           │
       │                                    │
       │  3. GET /dashboard                 │
       │     Authorization: Basic base64    │
       │ ──────────────────────────────────▶│
       │                                    │
       │  4. 200 OK + Inhalt                │
       │ ◀──────────────────────────────────│
```

**Header-Format:**
```
Authorization: Basic dXNlcjpwYXNzd29yZA==
                     └── base64("user:password")
```

**Unsere Implementierung (middleware.ts):**
```typescript
export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const [user, pwd] = atob(authHeader.split(' ')[1]).split(':');
    if (user === process.env.BASIC_AUTH_USER &&
        pwd === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next();  // ✅ Zugang erlaubt
    }
  }

  return new Response('Auth required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Staging"' }
  });
}
```

**Vorteile:**
- ✅ Extrem einfach zu implementieren
- ✅ Keine Datenbank nötig
- ✅ Browser zeigt automatisch Login-Dialog
- ✅ Perfekt für Staging/Demo-Umgebungen

**Nachteile:**
- ❌ Passwort bei jeder Anfrage übertragen (nur mit HTTPS sicher!)
- ❌ Kein Logout möglich (Browser speichert Credentials)
- ❌ Nicht geeignet für User-Management
- ❌ Keine Rollen/Berechtigungen

**Wann Basic Auth nutzen:**
```
✅ Staging-Umgebungen schützen (unser Use Case!)
✅ Einfache Admin-Panels
✅ API-Zugriff für Maschinen
✅ Temporärer Schutz vor Suchmaschinen

❌ NICHT für User-Login auf Production
❌ NICHT wenn Logout nötig ist
❌ NICHT für feingranulare Berechtigungen
```

---

### JWT (JSON Web Tokens)

```
Was ist das?   Selbstbeschreibender Token mit verschlüsselter Info
Wie:           Server erstellt Token bei Login, Client schickt ihn bei jeder Anfrage
Wann nutzen:   SPAs, Mobile Apps, APIs mit Stateless-Backend
```

**Aufbau eines JWT:**
```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyM30.SflKxwRJSMeKKF2QT4fwpM
└────── Header ──────┘.└───── Payload ─────┘.└────── Signature ──────┘
```

**Decoded:**
```json
// Header
{ "alg": "HS256", "typ": "JWT" }

// Payload
{
  "userId": 123,
  "email": "max@example.de",
  "role": "freelancer",
  "exp": 1733155200  // Ablaufzeit
}

// Signature
HMACSHA256(header + payload, SECRET_KEY)
```

**Ablauf:**
```
┌─────────────┐                      ┌─────────────┐
│   Client    │                      │   Server    │
└──────┬──────┘                      └──────┬──────┘
       │                                    │
       │  1. POST /login                    │
       │     {email, password}              │
       │ ──────────────────────────────────▶│
       │                                    │  Prüft Credentials
       │  2. 200 OK                         │  Erstellt JWT
       │     {token: "eyJ..."}              │
       │ ◀──────────────────────────────────│
       │                                    │
       │  Client speichert Token            │
       │  (localStorage/Cookie)             │
       │                                    │
       │  3. GET /api/projects              │
       │     Authorization: Bearer eyJ...   │
       │ ──────────────────────────────────▶│
       │                                    │  Prüft Signature
       │  4. 200 OK + Daten                 │  Liest userId aus Token
       │ ◀──────────────────────────────────│
```

**Vorteile:**
- ✅ Stateless (Server muss nichts speichern)
- ✅ Skalierbar (funktioniert mit Load Balancing)
- ✅ Enthält User-Info (keine DB-Abfrage nötig)
- ✅ Kann ablaufen (exp)

**Nachteile:**
- ❌ Kann nicht widerrufen werden (bis Ablauf)
- ❌ Token-Größe kann groß werden
- ❌ Muss sicher gespeichert werden (XSS-Gefahr)

---

### Session-basierte Auth

```
Was ist das?   Server speichert Session, Client bekommt nur Session-ID
Wie:           Cookie mit Session-ID, Server prüft in Datenbank/Memory
Wann nutzen:   Traditionelle Web-Apps, wenn Logout sofort wirken muss
```

**Ablauf:**
```
┌─────────────┐                      ┌─────────────┐
│   Browser   │                      │   Server    │
└──────┬──────┘                      └──────┬──────┘
       │                                    │
       │  1. POST /login                    │
       │ ──────────────────────────────────▶│
       │                                    │  Speichert Session
       │  2. Set-Cookie: sessionId=abc123   │  in Redis/DB
       │ ◀──────────────────────────────────│
       │                                    │
       │  Browser speichert Cookie          │
       │  automatisch                       │
       │                                    │
       │  3. GET /dashboard                 │
       │     Cookie: sessionId=abc123       │
       │ ──────────────────────────────────▶│
       │                                    │  Lädt Session
       │  4. 200 OK                         │  aus Redis/DB
       │ ◀──────────────────────────────────│
```

**Vorteile:**
- ✅ Sofortiger Logout möglich (Session löschen)
- ✅ Einfache Rechteverwaltung
- ✅ Keine sensiblen Daten im Client

**Nachteile:**
- ❌ Server muss Sessions speichern (State)
- ❌ Skalierung komplexer (shared Session Store)
- ❌ CSRF-Schutz nötig

---

### OAuth 2.0

```
Was ist das?   Standard für "Login mit Google/GitHub/etc."
Wie:           Drittanbieter bestätigt Identität
Wann nutzen:   Social Login, API-Zugriff auf externe Dienste
```

**Ablauf (vereinfacht):**
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│    User     │      │  Deine App  │      │   Google    │
└──────┬──────┘      └──────┬──────┘      └──────┬──────┘
       │                    │                    │
       │  1. Klick "Login   │                    │
       │     mit Google"    │                    │
       │ ──────────────────▶│                    │
       │                    │                    │
       │  2. Redirect zu Google                  │
       │ ◀─────────────────────────────────────▶│
       │                    │                    │
       │  3. User gibt Erlaubnis bei Google     │
       │ ──────────────────────────────────────▶│
       │                    │                    │
       │  4. Google redirect zurück mit Code    │
       │ ◀──────────────────│◀───────────────────│
       │                    │                    │
       │                    │  5. App tauscht    │
       │                    │     Code gegen     │
       │                    │     Access Token   │
       │                    │ ──────────────────▶│
       │                    │                    │
       │  6. User ist       │  7. Token kommt   │
       │     eingeloggt     │     zurück        │
       │ ◀──────────────────│◀───────────────────│
```

**Vorteile:**
- ✅ User braucht kein neues Passwort
- ✅ Du musst keine Passwörter speichern
- ✅ Vertrauenswürdig (Google/GitHub bekannt)

**Nachteile:**
- ❌ Abhängigkeit von Drittanbieter
- ❌ Komplexer zu implementieren
- ❌ Nicht alle User haben Google/GitHub

---

### Vergleich der Auth-Methoden

| Methode | Komplexität | Sicherheit | Use Case |
|---------|-------------|------------|----------|
| **Basic Auth** | ⭐ Einfach | ⚠️ Mit HTTPS OK | Staging, interne Tools |
| **JWT** | ⭐⭐ Mittel | ✅ Gut | SPAs, Mobile Apps, APIs |
| **Session** | ⭐⭐ Mittel | ✅ Gut | Traditionelle Web-Apps |
| **OAuth 2.0** | ⭐⭐⭐ Komplex | ✅ Sehr gut | Social Login |

**Entscheidungshilfe:**
```
Brauchst du nur Staging schützen?        → Basic Auth
Baust du eine SPA/Mobile App?            → JWT
Brauchst du sofortigen Logout?           → Session
Willst du "Login mit Google"?            → OAuth 2.0
```

---

### Unsere Auth-Strategie

**Aktuell (Staging):**
```
Basic Auth via Middleware
├── Schützt gesamte Seite
├── Ausnahmen: /api/health, /api/version
├── Credentials in .env
└── Deaktivierbar für Production
```

**Geplant (Production):**
```
NextAuth.js mit JWT
├── E-Mail/Passwort Login
├── Optional: OAuth (Google, GitHub)
├── JWT für API-Zugriff
└── Session für Web-UI
```

**Umgebungsvariablen:**
```bash
# Staging (Basic Auth)
BASIC_AUTH_USER="demo"
BASIC_AUTH_PASSWORD="staging2024"

# Production (NextAuth)
NEXTAUTH_SECRET="super-secret-key"
NEXTAUTH_URL="https://weigele.art"
```

---

## Aktuelle Kostenübersicht (Stand: 2025-12-02)

### Bereits deployte Ressourcen

| Ressource | Status | Monatliche Kosten |
|-----------|--------|-------------------|
| **Route 53 Hosted Zone** | ✅ Aktiv | ~$0.50 |
| **ECR Repository** | ✅ Erstellt | $0 (noch keine Images) |
| **ECS Cluster** | ✅ Erstellt | $0 (keine Tasks laufen) |
| **Container Insights** | ❌ Deaktiviert | $0 (Kosteneinsparung) |
| **CloudFront** | ⏸️ Pausiert | $0 |

**Aktuelle monatliche Kosten: ~$0.50-0.60**

### Geplante Kosten (nach vollem Deployment)

| Ressource | Konfiguration | Geschätzte Kosten |
|-----------|---------------|-------------------|
| **ECS Fargate Tasks** | 2x (0.5 vCPU, 1GB RAM) | $25-40/Monat |
| **RDS PostgreSQL** | t4g.micro | $15-20/Monat |
| **Application Load Balancer** | 1x ALB | $10-15/Monat |
| **CloudFront CDN** | Moderate Traffic | $5-10/Monat |
| **Route 53** | Hosted Zone + Queries | ~$1/Monat |
| **ECR Storage** | ~5GB Images | ~$0.50/Monat |

**Geschätzte Produktionskosten: $50-90/Monat**

### Kostenspar-Maßnahmen

1. **Container Insights deaktiviert** → Spart ~$7-15/Monat
2. **ECR Lifecycle Policy** → Hält nur 20 Images, löscht alte automatisch
3. **Fargate Spot** (geplant) → Kann 70% sparen für nicht-kritische Tasks
4. **RDS Reserved Instance** (später) → Kann 30-50% sparen bei 1-Jahr Commitment

---

## Glossar

| Begriff | Erklärung |
|---------|-----------|
| **Container** | Isolierte Laufzeitumgebung für eine Anwendung |
| **Image** | Bauplan/Snapshot für einen Container |
| **Registry** | Speicher für Docker Images (ECR, Docker Hub) |
| **Cluster** | Gruppe von Servern/Containern |
| **Task** | Eine laufende Container-Instanz in ECS |
| **Service** | Verwaltet mehrere Tasks mit Load Balancing |
| **Fargate** | Serverless Container-Ausführung (AWS verwaltet Server) |
| **IaC** | Infrastructure as Code (z.B. Terraform) |
| **CI/CD** | Continuous Integration / Continuous Deployment |
| **Pipeline** | Automatisierte Abfolge von Build/Test/Deploy Schritten |

---

## Weiterführende Links

- [AWS ECR Dokumentation](https://docs.aws.amazon.com/ecr/)
- [AWS ECS Dokumentation](https://docs.aws.amazon.com/ecs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Next.js Dokumentation](https://nextjs.org/docs)
- [Docker Dokumentation](https://docs.docker.com/)

---

*Dieses Dokument wird kontinuierlich erweitert.*
