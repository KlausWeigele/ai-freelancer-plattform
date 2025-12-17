# Learning 16: Docker

**Erstellt:** 2025-12-17
**Kontext:** AI-Freelancer-Plattform (Next.js + PostgreSQL)

---

## Inhaltsverzeichnis

1. [Was ist Docker?](#1-was-ist-docker)
2. [Docker-Konzepte](#2-docker-konzepte)
3. [Dockerfile](#3-dockerfile)
4. [Docker-Befehle](#4-docker-befehle)
5. [Multi-Stage Builds](#5-multi-stage-builds)
6. [Docker Compose](#6-docker-compose)
7. [Networking in Docker](#7-networking-in-docker)
8. [Volumes und Persistenz](#8-volumes-und-persistenz)
9. [Best Practices](#9-best-practices)
10. [Unser Projekt: Docker-Setup](#10-unser-projekt-docker-setup)

---

## 1. Was ist Docker?

### Definition

**Docker** ist eine Plattform für Container-Virtualisierung. Container verpacken Anwendungen mit allen Abhängigkeiten.

### Container vs. VM

```
Virtual Machine:                 Container:
┌─────────────────────┐          ┌─────────────────────┐
│       App 1         │          │       App 1         │
├─────────────────────┤          ├─────────────────────┤
│      Guest OS       │          │    (Kein Guest OS)  │
├─────────────────────┤          │                     │
│     Hypervisor      │          │    Docker Engine    │
├─────────────────────┤          ├─────────────────────┤
│      Host OS        │          │      Host OS        │
├─────────────────────┤          ├─────────────────────┤
│     Hardware        │          │     Hardware        │
└─────────────────────┘          └─────────────────────┘

VM: Schwer (GB), Langsam         Container: Leicht (MB), Schnell
```

### Vorteile von Docker

| Vorteil | Erklärung |
|---------|-----------|
| **Portabilität** | "Works on my machine" → Überall |
| **Isolation** | Jeder Container ist isoliert |
| **Reproduzierbarkeit** | Gleiche Umgebung überall |
| **Skalierbarkeit** | Container leicht vervielfältigen |
| **Schnell** | Sekunden zum Starten |

### Docker-Komponenten

```
Docker Engine:
├── Docker Daemon (dockerd) - Hintergrund-Service
├── Docker CLI (docker) - Kommandozeile
└── Docker API - Programmierzugriff

Docker Hub:
└── Registry für Docker Images (wie npm für Node)

Docker Compose:
└── Multi-Container-Orchestrierung
```

---

## 2. Docker-Konzepte

### Image

Ein **Image** ist eine Vorlage (Snapshot) für Container.

```
Image = Rezept
Container = Gebackener Kuchen

Ein Image kann viele Container erstellen.
```

### Container

Ein **Container** ist eine laufende Instanz eines Images.

```
docker run nginx
         ↓
┌─────────────────┐
│    Container    │
│   (nginx:1.0)   │
│   PID: 1234     │
│   Port: 80      │
└─────────────────┘
```

### Registry

Eine **Registry** speichert Docker Images.

```
Öffentlich:
- Docker Hub (docker.io)
- GitHub Container Registry (ghcr.io)

Privat:
- AWS ECR (Elastic Container Registry) ← Wir nutzen das
- Google GCR
- Azure ACR
```

### Layer-System

```
Images bestehen aus Layern:

┌──────────────────────────────────┐
│ Layer 4: COPY . /app (dein Code) │  ← Ändert sich oft
├──────────────────────────────────┤
│ Layer 3: RUN npm install         │
├──────────────────────────────────┤
│ Layer 2: COPY package.json       │
├──────────────────────────────────┤
│ Layer 1: FROM node:20-alpine     │  ← Basis-Image
└──────────────────────────────────┘

Layer werden gecacht → Schnellere Builds
```

---

## 3. Dockerfile

### Grundstruktur

```dockerfile
# Basis-Image
FROM node:20-alpine

# Arbeitsverzeichnis
WORKDIR /app

# Dateien kopieren
COPY package.json .
COPY src/ ./src/

# Befehle ausführen
RUN npm install

# Port freigeben
EXPOSE 3000

# Container starten
CMD ["npm", "start"]
```

### Wichtige Dockerfile-Anweisungen

```dockerfile
# FROM - Basis-Image
FROM node:20-alpine
FROM ubuntu:22.04
FROM python:3.11-slim

# WORKDIR - Arbeitsverzeichnis setzen
WORKDIR /app
# Alle folgenden Befehle laufen in /app

# COPY - Dateien ins Image kopieren
COPY package.json .           # Einzelne Datei
COPY src/ ./src/              # Ordner
COPY . .                      # Alles (Vorsicht!)

# ADD - Wie COPY, aber kann URLs und tar-Archive
ADD https://example.com/file.tar.gz /app/
# COPY ist in den meisten Fällen vorzuziehen

# RUN - Befehl während Build ausführen
RUN npm install
RUN apt-get update && apt-get install -y curl

# ENV - Umgebungsvariable setzen
ENV NODE_ENV=production
ENV PORT=3000

# ARG - Build-Zeit Variable (nicht zur Laufzeit)
ARG VERSION=1.0.0
RUN echo "Building version $VERSION"

# EXPOSE - Port dokumentieren (nicht öffnen!)
EXPOSE 3000
EXPOSE 5432

# USER - Als welcher User ausführen
USER node
USER 1001:1001

# CMD - Standard-Befehl beim Starten
CMD ["node", "server.js"]
CMD ["npm", "start"]

# ENTRYPOINT - Unveränderlicher Startbefehl
ENTRYPOINT ["node"]
CMD ["server.js"]
# → node server.js (CMD kann überschrieben werden)

# HEALTHCHECK - Container-Gesundheit prüfen
HEALTHCHECK --interval=30s CMD curl -f http://localhost:3000/health || exit 1
```

### CMD vs. ENTRYPOINT

```dockerfile
# Nur CMD
CMD ["npm", "start"]
# → docker run myapp           → npm start
# → docker run myapp npm test  → npm test (überschrieben)

# ENTRYPOINT + CMD
ENTRYPOINT ["node"]
CMD ["server.js"]
# → docker run myapp           → node server.js
# → docker run myapp app.js    → node app.js (nur CMD überschrieben)

# Nur ENTRYPOINT
ENTRYPOINT ["node", "server.js"]
# → Nicht überschreibbar (außer mit --entrypoint)
```

### Shell vs. Exec Form

```dockerfile
# Shell Form (läuft in /bin/sh -c)
RUN npm install
CMD npm start
# Signale werden nicht korrekt weitergeleitet!

# Exec Form (direkt ausgeführt)
RUN ["npm", "install"]
CMD ["npm", "start"]
# ✅ Empfohlen - Signale funktionieren korrekt
```

---

## 4. Docker-Befehle

### Images

```bash
# Image bauen
docker build -t myapp:1.0 .
docker build -t myapp:1.0 -f Dockerfile.prod .

# Images auflisten
docker images
docker image ls

# Image löschen
docker rmi myapp:1.0
docker image rm myapp:1.0

# Ungenutzte Images löschen
docker image prune
docker image prune -a  # Auch ungetaggte

# Image taggen
docker tag myapp:1.0 registry.example.com/myapp:1.0

# Image pushen
docker push registry.example.com/myapp:1.0

# Image pullen
docker pull nginx:latest
```

### Container

```bash
# Container starten
docker run nginx
docker run -d nginx                    # Detached (Hintergrund)
docker run -p 8080:80 nginx           # Port-Mapping
docker run -e MY_VAR=value nginx      # Environment Variable
docker run --name my-nginx nginx      # Container-Name
docker run -v /host:/container nginx  # Volume Mount
docker run --rm nginx                 # Nach Stop löschen

# Kombiniert
docker run -d --name web -p 8080:80 -e NODE_ENV=prod myapp:1.0

# Laufende Container
docker ps
docker ps -a  # Auch gestoppte

# Container stoppen
docker stop my-nginx
docker stop $(docker ps -q)  # Alle stoppen

# Container starten (existierenden)
docker start my-nginx

# Container löschen
docker rm my-nginx
docker rm -f my-nginx  # Auch wenn läuft

# In Container einloggen
docker exec -it my-nginx bash
docker exec -it my-nginx sh  # Wenn kein bash

# Logs anzeigen
docker logs my-nginx
docker logs -f my-nginx     # Follow
docker logs --tail 100 my-nginx

# Container-Details
docker inspect my-nginx
```

### Aufräumen

```bash
# Alles Ungenutzte löschen
docker system prune

# Inkl. Volumes
docker system prune --volumes

# Inkl. alle ungenutzten Images
docker system prune -a

# Speicherverbrauch
docker system df
```

---

## 5. Multi-Stage Builds

### Warum Multi-Stage?

```
Problem: Build-Dependencies landen im finalen Image

Single-Stage:
├── node:20 (~900MB)
├── + node_modules (~500MB)
├── + Build Tools
├── + Source Code
└── = ~1.5GB Image 😱

Multi-Stage:
├── Stage 1: Build (~1.5GB)
├── Stage 2: Copy nur nötiges
└── = ~150MB Image ✅
```

### Unser Dockerfile (erklärt)

```dockerfile
# ============================================================================
# Stage 1: Dependencies
# ============================================================================
FROM node:20-alpine AS deps
#                     ↑ Name für diese Stage

# pnpm installieren
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate

WORKDIR /app

# Nur package-Files kopieren (für besseres Caching)
COPY package.json pnpm-lock.yaml ./

# Dependencies installieren
RUN pnpm install --frozen-lockfile

# ============================================================================
# Stage 2: Builder
# ============================================================================
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.11.1 --activate

WORKDIR /app

# node_modules aus deps-Stage kopieren
COPY --from=deps /app/node_modules ./node_modules

# Source Code kopieren
COPY . .

# Prisma Client generieren
RUN pnpm prisma generate

# Next.js bauen
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build
# → Erstellt .next/standalone (150MB statt 1GB!)

# ============================================================================
# Stage 3: Runner (Production)
# ============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Production Umgebung
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root User für Sicherheit
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Nur nötige Files aus builder kopieren
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Next.js Standalone Output (sehr klein!)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma Schema
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Als non-root User ausführen
USER nextjs

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Health Check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Starten
CMD ["node", "server.js"]
```

### Build-Kontext und .dockerignore

```bash
# Alles im aktuellen Ordner wird an Docker gesendet!
docker build .
         ↓
    Build Context
```

```gitignore
# .dockerignore
node_modules
.next
.git
*.md
.env*
coverage
.nyc_output
*.log
```

---

## 6. Docker Compose

### Was ist Docker Compose?

**Docker Compose** orchestriert mehrere Container mit einer YAML-Datei.

### docker-compose.yml Grundstruktur

```yaml
version: '3.8'

services:
  app:
    # Service Definition
    ...

  db:
    # Service Definition
    ...

volumes:
  # Named Volumes
  ...

networks:
  # Custom Networks
  ...
```

### Vollständiges Beispiel

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Next.js Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/freelancer
    depends_on:
      db:
        condition: service_healthy
    volumes:
      # Bind Mount für Hot Reload in Dev
      - .:/app
      - /app/node_modules  # Verhindert Überschreiben
      - /app/.next
    networks:
      - app-network
    restart: unless-stopped

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: freelancer
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  # Redis Cache (optional)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

# Named Volumes (persistente Daten)
volumes:
  postgres_data:
  redis_data:

# Netzwerk
networks:
  app-network:
    driver: bridge
```

### Docker Compose Befehle

```bash
# Starten
docker compose up
docker compose up -d          # Detached
docker compose up --build     # Mit Rebuild

# Stoppen
docker compose down
docker compose down -v        # Inkl. Volumes löschen

# Logs
docker compose logs
docker compose logs -f        # Follow
docker compose logs app       # Nur ein Service

# Status
docker compose ps

# In Container
docker compose exec app sh

# Rebuild
docker compose build
docker compose build --no-cache

# Nur bestimmte Services
docker compose up db redis
```

### Development vs. Production

```yaml
# docker-compose.yml (Basis)
services:
  app:
    build: .
    environment:
      - NODE_ENV=production

# docker-compose.override.yml (Dev - automatisch geladen)
services:
  app:
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
    command: pnpm dev

# docker-compose.prod.yml (Production)
services:
  app:
    image: registry.example.com/myapp:latest
    restart: always
```

```bash
# Development (nutzt override automatisch)
docker compose up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

---

## 7. Networking in Docker

### Netzwerk-Typen

```
bridge (Standard):
├── Isoliertes Netzwerk
├── Container können sich über Namen erreichen
└── NAT für externe Verbindungen

host:
├── Container nutzt Host-Netzwerk direkt
├── Kein Port-Mapping nötig
└── Keine Isolation

none:
└── Kein Netzwerk

overlay:
├── Für Docker Swarm
└── Multi-Host Networking
```

### Container-Kommunikation

```yaml
# docker-compose.yml
services:
  app:
    networks:
      - backend

  db:
    networks:
      - backend

networks:
  backend:
    driver: bridge
```

```javascript
// Im Code: Hostname = Service-Name
const dbUrl = 'postgresql://user:pass@db:5432/mydb';
//                                   ↑ Service-Name als Hostname
```

### Port-Mapping

```yaml
ports:
  - "3000:3000"       # Host:Container
  - "8080:80"         # Host 8080 → Container 80
  - "5432:5432"

# Nur localhost
ports:
  - "127.0.0.1:3000:3000"
```

### DNS in Docker

```
Docker hat eingebautes DNS:

Container-Name → IP-Adresse

app       → 172.18.0.2
db        → 172.18.0.3
redis     → 172.18.0.4
```

---

## 8. Volumes und Persistenz

### Problem: Container sind ephemer

```
Container löschen → Alle Daten weg!

Lösung: Volumes
```

### Volume-Typen

```
1. Named Volumes (empfohlen für Daten)
   docker run -v postgres_data:/var/lib/postgresql/data postgres

2. Bind Mounts (für Development)
   docker run -v $(pwd):/app myapp

3. tmpfs (im RAM, nicht persistent)
   docker run --tmpfs /tmp myapp
```

### Named Volumes

```yaml
# docker-compose.yml
services:
  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:  # Docker verwaltet
```

```bash
# Volumes auflisten
docker volume ls

# Volume inspizieren
docker volume inspect postgres_data

# Volume löschen
docker volume rm postgres_data

# Ungenutzte Volumes löschen
docker volume prune
```

### Bind Mounts (Development)

```yaml
services:
  app:
    volumes:
      # Host-Pfad : Container-Pfad
      - ./src:/app/src
      - ./package.json:/app/package.json

      # Anonymous Volume (verhindert Überschreiben)
      - /app/node_modules
```

### Backup und Restore

```bash
# Backup
docker run --rm \
  -v postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/db-backup.tar.gz /data

# Restore
docker run --rm \
  -v postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/db-backup.tar.gz -C /
```

---

## 9. Best Practices

### Dockerfile Best Practices

```dockerfile
# ✅ 1. Spezifische Base-Image Versions
FROM node:20.10.0-alpine
# Nicht: FROM node:latest

# ✅ 2. Multi-Stage Builds
FROM node:20-alpine AS builder
# ... build ...
FROM node:20-alpine AS runner
COPY --from=builder /app/dist ./dist

# ✅ 3. Layer-Caching optimieren
# Selten ändernde Dateien zuerst
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
# Dann oft ändernde
COPY src/ ./src/

# ✅ 4. RUN-Befehle kombinieren
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# ✅ 5. Non-root User
RUN adduser --system --uid 1001 appuser
USER appuser

# ✅ 6. COPY statt ADD
COPY package.json ./
# ADD nur für tar-Archive oder URLs

# ✅ 7. .dockerignore verwenden
# Siehe .dockerignore Datei

# ✅ 8. Health Checks
HEALTHCHECK --interval=30s CMD curl -f http://localhost/health || exit 1

# ✅ 9. Exec Form für CMD
CMD ["node", "server.js"]
# Nicht: CMD node server.js

# ✅ 10. Keine Secrets im Image!
# Zur Laufzeit als ENV oder Secret injizieren
```

### Sicherheit

```dockerfile
# ❌ Als root ausführen
USER root

# ✅ Eigener User
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# ❌ Secrets im Image
ENV DATABASE_PASSWORD=secret123

# ✅ Secrets zur Laufzeit
# docker run -e DATABASE_PASSWORD=$DB_PASS myapp

# ❌ Veraltete Base Images
FROM node:14

# ✅ Aktuelle, minimale Images
FROM node:20-alpine
```

### Image-Größe optimieren

```
Strategie                     Ersparnis
─────────────────────────────────────────
Alpine statt Debian           ~400MB
Multi-Stage Builds            ~500MB
.dockerignore                 ~100MB
node_modules Production only  ~200MB
Next.js Standalone           ~800MB
─────────────────────────────────────────
Total: Von ~1.5GB auf ~150MB!
```

### Development Workflow

```bash
# 1. docker-compose.yml für lokale Entwicklung
docker compose up -d db redis

# 2. App lokal laufen lassen (schnelleres Feedback)
pnpm dev

# 3. Oder alles in Docker
docker compose up

# 4. Vor Commit: Image testen
docker build -t myapp:test .
docker run --rm myapp:test

# 5. CI baut und pusht
# Siehe GitHub Actions
```

---

## 10. Unser Projekt: Docker-Setup

### Dateien-Übersicht

```
freelancer/
├── Dockerfile              # Production Multi-Stage Build
├── .dockerignore          # Exclude vom Build-Context
├── docker-compose.yml      # Development Setup
└── docker-compose.prod.yml # Production Overrides (optional)
```

### .dockerignore

```gitignore
# .dockerignore
node_modules
.next
.git
.gitignore
*.md
.env*
.env.local
coverage
.nyc_output
*.log
npm-debug.log*
.DS_Store
Thumbs.db
.idea
.vscode
*.test.ts
*.spec.ts
__tests__
e2e
playwright-report
test-results
```

### docker-compose.yml (Development)

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/freelancer
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: freelancer
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### Lokaler Build & Test

```bash
# Image bauen
docker build -t ai-freelancer:local .

# Image-Größe prüfen
docker images ai-freelancer:local
# Ziel: ~150MB

# Container starten
docker run -d \
  --name freelancer-test \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  ai-freelancer:local

# Logs prüfen
docker logs -f freelancer-test

# Health Check
curl http://localhost:3000/api/health

# Aufräumen
docker stop freelancer-test
docker rm freelancer-test
```

### AWS ECR Push

```bash
# ECR Login
aws ecr get-login-password --region eu-central-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.eu-central-1.amazonaws.com

# Tag für ECR
docker tag ai-freelancer:local \
  123456789.dkr.ecr.eu-central-1.amazonaws.com/ai-freelancer:latest

# Push
docker push \
  123456789.dkr.ecr.eu-central-1.amazonaws.com/ai-freelancer:latest
```

### CI/CD Integration

```yaml
# .github/workflows/deploy-production.yml (Auszug)
- name: Build and push Docker image
  run: |
    docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
    docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
```

### Checkliste

```
Dockerfile:
☐ Multi-Stage Build
☐ Alpine-basiertes Image
☐ Non-root User
☐ Health Check
☐ Keine Secrets hardcoded
☐ .dockerignore aktuell

Image:
☐ Unter 200MB
☐ Lokal getestet
☐ Health Check funktioniert
☐ Logs korrekt

Docker Compose:
☐ Health Checks für Services
☐ Named Volumes für Persistenz
☐ Netzwerk konfiguriert
☐ Umgebungsvariablen dokumentiert
```

---

## Zusammenfassung

```bash
# Die wichtigsten Befehle

# Image bauen
docker build -t myapp:1.0 .

# Container starten
docker run -d -p 3000:3000 myapp:1.0

# Container anzeigen
docker ps

# Logs
docker logs -f container_name

# In Container
docker exec -it container_name sh

# Aufräumen
docker system prune -a

# Compose starten
docker compose up -d

# Compose stoppen
docker compose down
```

---

## Ressourcen

- [Docker Documentation](https://docs.docker.com/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Next.js Docker Example](https://github.com/vercel/next.js/tree/canary/examples/with-docker)
- [Docker Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
