# Learning Guide Teil 3 - Node.js

**Zuletzt aktualisiert:** 2025-12-03

Dieses Dokument erklärt Node.js - die JavaScript-Laufzeitumgebung die unser Projekt antreibt.

---

## Inhaltsverzeichnis

### Grundlagen
- [Was ist Node.js?](#was-ist-nodejs)
- [Node.js vs. Browser JavaScript](#nodejs-vs-browser-javascript)
- [Die V8 Engine](#die-v8-engine)
- [Event Loop](#event-loop)

### Versionen & Installation
- [Node.js Versionen](#nodejs-versionen)
- [LTS vs. Current](#lts-vs-current)
- [NVM (Node Version Manager)](#nvm-node-version-manager)
- [Unser Projekt: Node 20 vs. 22](#unser-projekt-node-20-vs-22)

### Module & Pakete
- [CommonJS vs. ES Modules](#commonjs-vs-es-modules)
- [node_modules](#node_modules)
- [Package Manager: npm, yarn, pnpm](#package-manager-npm-yarn-pnpm)

### Wichtige Konzepte
- [Asynchrone Programmierung](#asynchrone-programmierung)
- [Callbacks, Promises, async/await](#callbacks-promises-asyncawait)
- [Environment Variables](#environment-variables)
- [process Objekt](#process-objekt)

### Node.js in unserem Projekt
- [Next.js und Node.js](#nextjs-und-nodejs)
- [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
- [API Routes](#api-routes)
- [Prisma und Node.js](#prisma-und-nodejs)

### Performance & Best Practices
- [Memory Management](#memory-management)
- [Cluster Mode](#cluster-mode)
- [Debugging](#debugging)

---

## Grundlagen

### Was ist Node.js?

```
Was ist das?   JavaScript-Laufzeitumgebung für Server
Vergleich:     Wie ein Motor der JavaScript außerhalb des Browsers ausführt
Zweck:         Server, CLI-Tools, Build-Tools, APIs
```

**Die Geschichte:**

```
2009: Ryan Dahl erstellt Node.js
      └── Idee: JavaScript auch auf dem Server nutzen

Vorher:
┌─────────────────────────────────────────────────────────┐
│  Browser                     Server                     │
│  ────────                    ──────                     │
│  JavaScript ✓                PHP, Python, Java, Ruby    │
│                              JavaScript ✗               │
└─────────────────────────────────────────────────────────┘

Nachher:
┌─────────────────────────────────────────────────────────┐
│  Browser                     Server                     │
│  ────────                    ──────                     │
│  JavaScript ✓                JavaScript ✓ (Node.js!)   │
│                                                         │
│  → Eine Sprache für Frontend UND Backend!              │
└─────────────────────────────────────────────────────────┘
```

---

### Node.js vs. Browser JavaScript

```
┌──────────────────────────────────────────────────────────────────┐
│                    Browser JavaScript                            │
├──────────────────────────────────────────────────────────────────┤
│  ✓ DOM (document.getElementById)                                 │
│  ✓ Window-Objekt                                                 │
│  ✓ Browser APIs (fetch, localStorage, WebSocket)                │
│  ✗ Dateisystem-Zugriff (Sicherheit!)                            │
│  ✗ Netzwerk-Sockets erstellen                                   │
│  ✗ Prozesse starten                                              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      Node.js                                     │
├──────────────────────────────────────────────────────────────────┤
│  ✗ Kein DOM (kein document, kein window)                        │
│  ✓ Dateisystem (fs.readFile, fs.writeFile)                      │
│  ✓ Netzwerk (http.createServer, net.Socket)                     │
│  ✓ Prozesse (child_process.spawn)                               │
│  ✓ OS-Zugriff (os.cpus(), os.freemem())                        │
│  ✓ Buffer (Binärdaten verarbeiten)                              │
└──────────────────────────────────────────────────────────────────┘
```

**Beispiel - Dateien lesen:**

```javascript
// ❌ Im Browser - NICHT möglich (Sicherheit!)
const content = readFile('/etc/passwd');

// ✓ In Node.js - Voller Zugriff!
const fs = require('fs');
const content = fs.readFileSync('/etc/passwd', 'utf8');
```

---

### Die V8 Engine

```
Was ist das?   Googles JavaScript-Engine (auch in Chrome)
Vergleich:     Wie ein Übersetzer: JavaScript → Maschinencode
Zweck:         Macht JavaScript extrem schnell
```

**Wie V8 funktioniert:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    JavaScript Code                               │
│         function add(a, b) { return a + b; }                    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      V8 Parser                                   │
│              (Analysiert den Code)                               │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Ignition (Interpreter)                         │
│         (Führt Code sofort aus - "warm up")                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼ (Wenn Code oft ausgeführt wird)
┌─────────────────────────────────────────────────────────────────┐
│                  TurboFan (JIT Compiler)                         │
│      (Optimiert zu schnellem Maschinencode)                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Maschinencode                                 │
│              (Direkt auf CPU ausführbar)                        │
└─────────────────────────────────────────────────────────────────┘
```

**JIT = Just-In-Time Compilation:**
- Code wird WÄHREND der Ausführung optimiert
- Häufig genutzter Code wird zu Maschinencode kompiliert
- Daher ist Node.js so schnell

---

### Event Loop

```
Was ist das?   Das "Herz" von Node.js
Vergleich:     Wie ein Kellner der viele Tische gleichzeitig bedient
Zweck:         Ermöglicht nicht-blockierende I/O
```

**Das Problem ohne Event Loop:**

```
Traditioneller Server (z.B. PHP):
┌─────────────────────────────────────────────────────────────────┐
│  Request 1 kommt an                                             │
│       │                                                          │
│       ▼                                                          │
│  [Warte auf Datenbank...] ← 100ms BLOCKIERT                     │
│       │                                                          │
│       ▼                                                          │
│  Response 1 senden                                               │
│       │                                                          │
│  Request 2 kommt an  ← MUSS WARTEN!                             │
│       │                                                          │
│       ▼                                                          │
│  [Warte auf Datenbank...]                                       │
└─────────────────────────────────────────────────────────────────┘
Problem: Jeder Request blockiert den Server!
```

**Node.js mit Event Loop:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Request 1 kommt an                                             │
│       │                                                          │
│       ▼                                                          │
│  Starte DB-Abfrage (async) → Ab in die Queue!                   │
│       │                                                          │
│  Request 2 kommt an  ← SOFORT bearbeitet!                       │
│       │                                                          │
│       ▼                                                          │
│  Starte DB-Abfrage (async) → Ab in die Queue!                   │
│       │                                                          │
│  ◄──── DB-Antwort 1 fertig                                      │
│       │                                                          │
│       ▼                                                          │
│  Response 1 senden                                               │
│       │                                                          │
│  ◄──── DB-Antwort 2 fertig                                      │
│       │                                                          │
│       ▼                                                          │
│  Response 2 senden                                               │
└─────────────────────────────────────────────────────────────────┘
Lösung: Nichts blockiert! Alles läuft parallel!
```

**Event Loop Phasen:**

```
   ┌───────────────────────────────┐
┌─▶│         timers                │ ← setTimeout, setInterval
│  │   (Callbacks ausführen)       │
│  └───────────────┬───────────────┘
│                  │
│                  ▼
│  ┌───────────────────────────────┐
│  │     pending callbacks         │ ← System-Callbacks
│  │                               │
│  └───────────────┬───────────────┘
│                  │
│                  ▼
│  ┌───────────────────────────────┐
│  │         poll                  │ ← I/O Callbacks (DB, Netzwerk)
│  │   (Hauptarbeit passiert hier) │
│  └───────────────┬───────────────┘
│                  │
│                  ▼
│  ┌───────────────────────────────┐
│  │         check                 │ ← setImmediate
│  │                               │
│  └───────────────┬───────────────┘
│                  │
│                  ▼
│  ┌───────────────────────────────┐
│  │      close callbacks          │ ← socket.on('close')
│  │                               │
│  └───────────────┬───────────────┘
│                  │
└──────────────────┘
```

---

## Versionen & Installation

### Node.js Versionen

**Aktueller Stand (Ende 2024):**

| Version | Status | Support bis | Empfehlung |
|---------|--------|-------------|------------|
| Node 18 | Maintenance LTS | April 2025 | Für legacy Projekte |
| Node 20 | Active LTS | April 2026 | **Für Produktion** |
| Node 22 | Current | Oktober 2025 → LTS | Für Entwicklung |
| Node 23 | Current | - | Bleeding Edge |

**Unser Projekt:**
- **Lokal:** Node 22.20.0 (Entwicklung)
- **Docker:** Node 20-alpine (Produktion)

---

### LTS vs. Current

```
LTS (Long Term Support):
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Stabil und getestet                                          │
│  ✓ 30 Monate Support                                            │
│  ✓ Sicherheitsupdates garantiert                                │
│  ✓ Für Produktion empfohlen                                     │
│  ✗ Keine neuesten Features                                      │
└─────────────────────────────────────────────────────────────────┘

Current:
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Neueste Features                                             │
│  ✓ Gut für Entwicklung/Testing                                  │
│  ✗ Nur 8 Monate Support                                         │
│  ✗ Möglicherweise instabil                                      │
│  ✗ Nicht für Produktion empfohlen                               │
└─────────────────────────────────────────────────────────────────┘
```

**Release-Zyklus:**

```
      Apr 2024        Okt 2024        Apr 2025        Okt 2025
         │               │               │               │
         ▼               ▼               ▼               ▼
┌────────────────────────────────────────────────────────────────┐
│ Node 20 │───── Active LTS ─────│─── Maintenance ───│  EOL     │
└────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────┐
│ Node 22 │──── Current ────│───── Active LTS ─────│─── Maint ──│
└────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────┐
│ Node 23 │────────────── Current ──────────────│               │
└────────────────────────────────────────────────────────────────┘

Gerade Versionen (18, 20, 22) → Werden LTS
Ungerade Versionen (19, 21, 23) → Werden NICHT LTS
```

---

### NVM (Node Version Manager)

```
Was ist das?   Tool zum Verwalten mehrerer Node.js Versionen
Vergleich:     Wie verschiedene Werkzeugkästen für verschiedene Projekte
Zweck:         Schnell zwischen Node-Versionen wechseln
```

**Installation (macOS/Linux):**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

**Wichtige Befehle:**

```bash
# Verfügbare Versionen anzeigen
nvm ls-remote

# Version installieren
nvm install 20          # Installiert Node 20 (neueste Minor)
nvm install 22.20.0     # Installiert exakte Version

# Version wechseln
nvm use 20              # Wechselt zu Node 20
nvm use 22              # Wechselt zu Node 22

# Installierte Versionen anzeigen
nvm ls

# Standard-Version setzen
nvm alias default 20

# Aktuelle Version anzeigen
node --version
```

**Automatischer Wechsel mit .nvmrc:**

```bash
# Im Projektverzeichnis .nvmrc erstellen
echo "20" > .nvmrc

# Dann automatisch nutzen
nvm use
# → Found '.nvmrc' with version <20>
# → Now using node v20.x.x
```

---

### Unser Projekt: Node 20 vs. 22

**Warum verschiedene Versionen?**

```
Lokal (Entwicklung):     Node 22.20.0
─────────────────────────────────────
✓ Neueste Features zum Testen
✓ Bessere Entwickler-Experience
✓ Schnellere Startup-Zeit
✓ Egal wenn mal was nicht funktioniert

Docker (Produktion):     Node 20-alpine
─────────────────────────────────────
✓ LTS = Stabil und getestet
✓ Sicherheitsupdates für 2+ Jahre
✓ Kleineres Image (alpine)
✓ Bewährt in Produktion
```

**In unserem Dockerfile:**

```dockerfile
# Wir nutzen Node 20 LTS
FROM node:20-alpine AS deps
FROM node:20-alpine AS builder
FROM node:20-alpine AS runner
```

**Was ist Alpine?**

```
node:20           → ~1 GB    (basiert auf Debian)
node:20-alpine    → ~180 MB  (basiert auf Alpine Linux)

Alpine Linux:
- Minimales Linux (nur das Nötigste)
- Nutzt musl statt glibc
- Perfekt für Container
```

---

## Module & Pakete

### CommonJS vs. ES Modules

**CommonJS (CJS) - Der alte Standard:**

```javascript
// Exportieren
module.exports = { add, subtract };
// oder
exports.add = function(a, b) { return a + b; };

// Importieren
const { add } = require('./math');
const fs = require('fs');
```

**ES Modules (ESM) - Der neue Standard:**

```javascript
// Exportieren
export function add(a, b) { return a + b; }
export default class Calculator { }

// Importieren
import { add } from './math.js';
import Calculator from './calc.js';
import * as fs from 'fs';
```

**Unterschiede:**

| Aspekt | CommonJS | ES Modules |
|--------|----------|------------|
| Syntax | `require()` / `module.exports` | `import` / `export` |
| Laden | Synchron | Asynchron |
| Dateiendung | `.js` (default) | `.mjs` oder `"type": "module"` |
| Top-level await | ❌ Nicht möglich | ✅ Möglich |
| Tree Shaking | ❌ Schwierig | ✅ Einfach |

**Unser Projekt nutzt ESM:**

```json
// package.json
{
  "type": "module"  // ← ESM als Standard
}
```

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';  // ESM Syntax
export const prisma = new PrismaClient();
```

---

### node_modules

```
Was ist das?   Ordner mit allen installierten Paketen
Vergleich:     Wie eine Bibliothek mit allen Büchern die dein Projekt braucht
Zweck:         Zentrale Ablage für Dependencies
```

**Struktur:**

```
node_modules/
├── .pnpm/                    # pnpm's Content-Addressable Store
│   ├── react@19.2.0/
│   ├── next@16.0.0/
│   └── ...
├── react -> .pnpm/react@19.2.0/node_modules/react
├── next -> .pnpm/next@16.0.0/node_modules/next
└── ...
```

**Warum so groß?**

```
Dein Projekt
    │
    ├── react (1 Paket)
    │   └── hat 5 Dependencies
    │       └── haben jeweils 3 Dependencies
    │           └── haben jeweils 2 Dependencies
    │
    └── Ergebnis: Hunderte von Paketen!

Beispiel:
next@16.0.0 hat ~80 direkte Dependencies
Die haben wiederum Dependencies...
→ Am Ende: 500+ Pakete in node_modules
```

**Wichtig:**
- ❌ NIEMALS in Git committen (zu groß!)
- ✅ Immer in .gitignore
- ✅ Wird durch `pnpm install` wiederhergestellt

---

### Package Manager: npm, yarn, pnpm

**npm (Node Package Manager):**

```
Was ist das?   Der Standard-Paketmanager (kommt mit Node.js)
Vorteile:      Immer verfügbar, große Community
Nachteile:     Langsamer, größere node_modules
```

```bash
npm install           # Dependencies installieren
npm install react     # Paket hinzufügen
npm run dev           # Script ausführen
```

**yarn:**

```
Was ist das?   Alternative von Facebook (2016)
Vorteile:      Schneller als npm, besseres Locking
Nachteile:     Zusätzliche Installation nötig
```

```bash
yarn install          # Dependencies installieren
yarn add react        # Paket hinzufügen
yarn dev              # Script ausführen
```

**pnpm (Performant npm):**

```
Was ist das?   Modernste Alternative (wir nutzen es!)
Vorteile:      Am schnellsten, spart Speicherplatz
Nachteile:     Weniger verbreitet
```

```bash
pnpm install          # Dependencies installieren
pnpm add react        # Paket hinzufügen
pnpm dev              # Script ausführen
```

**Vergleich:**

| Aspekt | npm | yarn | pnpm |
|--------|-----|------|------|
| Geschwindigkeit | Langsam | Schnell | Am schnellsten |
| Speicherplatz | Hoch | Hoch | Niedrig (Symlinks) |
| Lock File | package-lock.json | yarn.lock | pnpm-lock.yaml |
| Strict | Nein | Nein | Ja (sicherer!) |

**Warum pnpm?**

```
pnpm's Geheimnis: Content-Addressable Storage
─────────────────────────────────────────────

npm/yarn (pro Projekt):
┌─────────────────────────────────────────────────────────────────┐
│ Projekt A/node_modules/   │  Projekt B/node_modules/           │
│   react@19.2.0 (5 MB)     │    react@19.2.0 (5 MB) ← KOPIE!   │
│   lodash@4.17.0 (1 MB)    │    lodash@4.17.0 (1 MB) ← KOPIE!  │
└─────────────────────────────────────────────────────────────────┘
Speicher: 12 MB (doppelt!)

pnpm (global + Symlinks):
┌─────────────────────────────────────────────────────────────────┐
│ ~/.pnpm-store/             │  Projekt A/node_modules/          │
│   react@19.2.0 (5 MB)      │    react → ~/.pnpm-store/react   │
│   lodash@4.17.0 (1 MB)     │    lodash → ~/.pnpm-store/lodash │
│                            │                                    │
│                            │  Projekt B/node_modules/          │
│                            │    react → ~/.pnpm-store/react   │
│                            │    lodash → ~/.pnpm-store/lodash │
└─────────────────────────────────────────────────────────────────┘
Speicher: 6 MB (nur einmal!)
```

---

## Wichtige Konzepte

### Asynchrone Programmierung

```
Was ist das?   Code der nicht blockiert während er auf etwas wartet
Vergleich:     Wie Kochen: Wasser aufsetzen, dann Gemüse schneiden (parallel)
Zweck:         Server kann viele Anfragen gleichzeitig bearbeiten
```

**Synchron (blockierend):**

```javascript
// ❌ SCHLECHT - Blockiert alles!
const data = fs.readFileSync('big-file.txt');  // Wartet...
console.log(data);                              // Erst dann
console.log('Weiter...');                       // Und dann
```

**Asynchron (nicht-blockierend):**

```javascript
// ✅ GUT - Läuft parallel!
fs.readFile('big-file.txt', (err, data) => {
  console.log(data);                            // Später
});
console.log('Weiter...');                       // Sofort!
```

---

### Callbacks, Promises, async/await

**1. Callbacks (alt):**

```javascript
// Die "Callback-Hölle"
fs.readFile('file1.txt', (err, data1) => {
  if (err) return console.error(err);
  fs.readFile('file2.txt', (err, data2) => {
    if (err) return console.error(err);
    fs.readFile('file3.txt', (err, data3) => {
      if (err) return console.error(err);
      // Endlich! 😱
    });
  });
});
```

**2. Promises (besser):**

```javascript
const fs = require('fs').promises;

fs.readFile('file1.txt')
  .then(data1 => fs.readFile('file2.txt'))
  .then(data2 => fs.readFile('file3.txt'))
  .then(data3 => {
    // Alle Dateien gelesen!
  })
  .catch(err => console.error(err));
```

**3. async/await (modern):**

```javascript
// ✅ SO machen wir es!
async function readAllFiles() {
  try {
    const data1 = await fs.readFile('file1.txt');
    const data2 = await fs.readFile('file2.txt');
    const data3 = await fs.readFile('file3.txt');
    // Alle Dateien gelesen!
  } catch (err) {
    console.error(err);
  }
}
```

**In unserem Projekt:**

```typescript
// src/app/api/health/route.ts
export async function GET() {
  try {
    // await = Warte auf Datenbank-Antwort
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'healthy' });
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy' }, { status: 503 });
  }
}
```

---

### Environment Variables

```
Was ist das?   Konfigurationswerte von außerhalb des Codes
Vergleich:     Wie Einstellungen die man ändern kann ohne Code zu ändern
Zweck:         Secrets, URLs, Feature-Flags
```

**Zugriff in Node.js:**

```javascript
// Alle Umgebungsvariablen
console.log(process.env);

// Einzelne Variable
const dbUrl = process.env.DATABASE_URL;
const nodeEnv = process.env.NODE_ENV;  // 'development' oder 'production'
```

**Unsere Variablen:**

```bash
# .env.local (für Entwicklung)
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
NEXTAUTH_SECRET="geheimer-schlüssel"
NEXTAUTH_URL="http://localhost:3000"
BASIC_AUTH_USER="staging"
BASIC_AUTH_PASSWORD="geheim123"

# Prefix NEXT_PUBLIC_ = Im Browser verfügbar
NEXT_PUBLIC_ENVIRONMENT="staging"
```

**Wichtig:**
- `NEXT_PUBLIC_*` → Sichtbar im Browser (nur nicht-sensible Daten!)
- Ohne Prefix → Nur auf dem Server verfügbar

---

### process Objekt

```
Was ist das?   Globales Objekt mit Prozess-Informationen
Vergleich:     Wie ein Dashboard das alles über den laufenden Prozess zeigt
Zweck:         Zugriff auf Umgebung, Argumente, Ein-/Ausgabe
```

**Wichtige Eigenschaften:**

```javascript
// Umgebungsvariablen
process.env.NODE_ENV           // 'development' | 'production'
process.env.DATABASE_URL       // Datenbank-URL

// Node.js Version
process.version                // 'v22.20.0'
process.versions               // { node: '22.20.0', v8: '12.4.x', ... }

// Betriebssystem
process.platform               // 'darwin' (macOS), 'linux', 'win32'
process.arch                   // 'x64', 'arm64'

// Arbeitsverzeichnis
process.cwd()                  // '/Users/klaus/project'

// Prozess-ID
process.pid                    // 12345

// Speicherverbrauch
process.memoryUsage()          // { heapUsed: 50000000, ... }

// Beenden
process.exit(0)                // Erfolgreich beenden
process.exit(1)                // Mit Fehler beenden
```

**In unserem Dockerfile:**

```dockerfile
# Health Check mit process.exit
HEALTHCHECK CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 0 = Gesund
# 1 = Ungesund
```

---

## Node.js in unserem Projekt

### Next.js und Node.js

```
Next.js = React Framework das auf Node.js läuft
──────────────────────────────────────────────

Browser (Client):          Server (Node.js):
┌─────────────────┐       ┌─────────────────┐
│  React          │ ◄──── │  Next.js        │
│  Komponenten    │       │  Server         │
│                 │       │                 │
│  JavaScript     │       │  Node.js        │
│  im Browser     │       │  Runtime        │
└─────────────────┘       └─────────────────┘
```

**Was läuft wo?**

```typescript
// Diese Datei läuft auf dem SERVER (Node.js)
// src/app/api/health/route.ts
import { prisma } from '@/lib/db';

export async function GET() {
  await prisma.$queryRaw`SELECT 1`;  // ← Node.js: Kann auf DB zugreifen!
  return NextResponse.json({ status: 'healthy' });
}
```

```typescript
// Diese Komponente kann auf BEIDEN laufen
// src/app/page.tsx
export default function Home() {
  return <h1>Hello World</h1>;
  // Server-Side Rendering: Erst auf Node.js gerendert
  // Dann als HTML zum Browser geschickt
  // Dann hydrated (React übernimmt im Browser)
}
```

---

### Server-Side Rendering (SSR)

```
Was ist das?   HTML wird auf dem Server generiert
Vergleich:     Wie ein Restaurant das fertige Gerichte serviert
Zweck:         Schnellerer First Paint, besseres SEO
```

**Ohne SSR (Client-Side Rendering):**

```
1. Browser lädt HTML (fast leer)
   <div id="root"></div>

2. Browser lädt JavaScript (~500 KB)

3. JavaScript lädt Daten von API

4. JavaScript rendert UI

Zeit bis Content sichtbar: 2-3 Sekunden 😢
```

**Mit SSR (Server-Side Rendering):**

```
1. Node.js rendert komplettes HTML
   <div id="root">
     <h1>Willkommen!</h1>
     <p>Hier sind deine Projekte...</p>
   </div>

2. Browser zeigt HTML sofort an ← Schnell!

3. JavaScript "hydrated" die Seite
   (macht sie interaktiv)

Zeit bis Content sichtbar: 0.5 Sekunden 🚀
```

---

### API Routes

```
Was ist das?   Backend-Endpoints direkt in Next.js
Vergleich:     Wie ein Mini-Server in deiner App
Zweck:         APIs ohne separaten Server
```

**Unsere API Routes:**

```typescript
// src/app/api/health/route.ts
// GET /api/health
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch {
    return NextResponse.json({ status: 'unhealthy' }, { status: 503 });
  }
}
```

```typescript
// src/app/api/version/route.ts
// GET /api/version
export async function GET() {
  return NextResponse.json({
    version: process.env.npm_package_version || '0.1.0',
    commit: process.env.COMMIT_SHA || 'unknown',
    node: process.version,
    environment: process.env.NODE_ENV
  });
}
```

**API Route Konventionen:**

| Datei | HTTP Methode |
|-------|--------------|
| `route.ts` mit `export function GET` | GET |
| `route.ts` mit `export function POST` | POST |
| `route.ts` mit `export function PUT` | PUT |
| `route.ts` mit `export function DELETE` | DELETE |

---

### Prisma und Node.js

```
Prisma = ORM für Node.js/TypeScript
─────────────────────────────────────

JavaScript/TypeScript  ←──→  Prisma Client  ←──→  PostgreSQL
    (Dein Code)              (Übersetzer)         (Datenbank)
```

**Wie Prisma Node.js nutzt:**

```typescript
// 1. Prisma Client importieren
import { PrismaClient } from '@prisma/client';

// 2. Client erstellen (nutzt Node.js Netzwerk-APIs)
const prisma = new PrismaClient();

// 3. Queries ausführen (async/await)
async function getUsers() {
  // Prisma generiert SQL und führt es aus
  const users = await prisma.user.findMany({
    where: { role: 'FREELANCER' },
    include: { profile: true }
  });
  return users;
}

// 4. Verbindung schließen (wichtig!)
await prisma.$disconnect();
```

**Connection Pooling:**

```
Ohne Pool:
┌──────────────────────────────────────────────────────────────┐
│  Request 1 → Neue Verbindung → Query → Schließen            │
│  Request 2 → Neue Verbindung → Query → Schließen            │
│  Request 3 → Neue Verbindung → Query → Schließen            │
└──────────────────────────────────────────────────────────────┘
Problem: Neue Verbindungen sind langsam (50-100ms)!

Mit Pool (Prisma Default):
┌──────────────────────────────────────────────────────────────┐
│  Pool: [Verbindung 1] [Verbindung 2] [Verbindung 3]         │
│                                                              │
│  Request 1 → Pool[1] → Query → Zurück in Pool               │
│  Request 2 → Pool[2] → Query → Zurück in Pool               │
│  Request 3 → Pool[3] → Query → Zurück in Pool               │
└──────────────────────────────────────────────────────────────┘
Lösung: Verbindungen werden wiederverwendet!
```

---

## Performance & Best Practices

### Memory Management

**Speicherverbrauch überwachen:**

```javascript
const used = process.memoryUsage();

console.log({
  heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)} MB`,
  heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)} MB`,
  rss: `${Math.round(used.rss / 1024 / 1024)} MB`  // Resident Set Size
});
```

**Memory Leaks vermeiden:**

```javascript
// ❌ SCHLECHT - Memory Leak!
const cache = [];
app.get('/data', (req, res) => {
  cache.push(largeObject);  // Wächst ewig!
  res.json(cache);
});

// ✅ GUT - Begrenzte Cache-Größe
const cache = new Map();
const MAX_SIZE = 1000;

app.get('/data', (req, res) => {
  if (cache.size > MAX_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, data);
  res.json(data);
});
```

---

### Cluster Mode

```
Was ist das?   Mehrere Node.js Prozesse nutzen alle CPU-Kerne
Vergleich:     Wie mehrere Kellner statt nur einem
Zweck:         Bessere Auslastung von Multi-Core CPUs
```

**Node.js ist Single-Threaded:**

```
Standard Node.js:
┌──────────────────────────────────────────────────────────────┐
│  CPU: [Kern 1 ✓] [Kern 2 ✗] [Kern 3 ✗] [Kern 4 ✗]          │
│                                                              │
│  Nur EIN Kern wird genutzt!                                 │
└──────────────────────────────────────────────────────────────┘

Mit Cluster:
┌──────────────────────────────────────────────────────────────┐
│  CPU: [Kern 1 ✓] [Kern 2 ✓] [Kern 3 ✓] [Kern 4 ✓]          │
│                                                              │
│  ALLE Kerne werden genutzt!                                 │
└──────────────────────────────────────────────────────────────┘
```

**Für uns: ECS Task Scaling ist besser:**

```
Statt Cluster auf einem Server:
→ Mehrere ECS Tasks (Container) starten
→ ALB verteilt Traffic automatisch
→ Einfacher zu skalieren
```

---

### Debugging

**console.log (Basic):**

```javascript
console.log('Variable:', variable);
console.table(arrayOfObjects);
console.time('operation');
// ... code ...
console.timeEnd('operation');  // Zeigt Dauer
```

**Node.js Inspector (Advanced):**

```bash
# Mit Debugger starten
node --inspect server.js

# In Chrome öffnen:
chrome://inspect
```

**VS Code Debugging:**

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Next.js",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"],
      "port": 9229
    }
  ]
}
```

---

## Glossar

| Begriff | Erklärung |
|---------|-----------|
| **V8** | Google's JavaScript-Engine (kompiliert JS zu Maschinencode) |
| **Event Loop** | Mechanismus der asynchrone Operationen ermöglicht |
| **LTS** | Long Term Support - stabile Version mit langem Support |
| **npm** | Node Package Manager - Standard-Paketmanager |
| **pnpm** | Performant npm - schnellerer Paketmanager (wir nutzen es) |
| **CommonJS** | Altes Modulsystem (`require`/`module.exports`) |
| **ESM** | ES Modules - neues Modulsystem (`import`/`export`) |
| **async/await** | Syntax für asynchrone Programmierung |
| **Callback** | Funktion die nach Abschluss aufgerufen wird |
| **Promise** | Objekt das zukünftiges Ergebnis repräsentiert |
| **SSR** | Server-Side Rendering - HTML auf Server generieren |
| **Cluster** | Mehrere Node.js Prozesse für Multi-Core Nutzung |
| **Alpine** | Minimales Linux für kleine Docker-Images |

---

## Weiterführende Links

- [Node.js Dokumentation](https://nodejs.org/docs/)
- [Node.js Release Schedule](https://nodejs.org/en/about/releases/)
- [V8 Engine](https://v8.dev/)
- [pnpm Dokumentation](https://pnpm.io/)
- [NVM GitHub](https://github.com/nvm-sh/nvm)
- [Event Loop Explained (Video)](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

---

*Dieses Dokument wird kontinuierlich erweitert.*
