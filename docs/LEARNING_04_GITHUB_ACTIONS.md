# Learning Guide Teil 4 - GitHub Actions

**Zuletzt aktualisiert:** 2025-12-03

Dieses Dokument erklärt GitHub Actions - unser CI/CD-System für automatisierte Tests und Deployments.

---

## Inhaltsverzeichnis

### Grundlagen
- [Was ist GitHub Actions?](#was-ist-github-actions)
- [Kernkonzepte](#kernkonzepte)
- [YAML Syntax](#yaml-syntax)

### Workflow-Struktur
- [Workflows](#workflows)
- [Jobs](#jobs)
- [Steps](#steps)
- [Actions](#actions)

### Trigger & Events
- [Push & Pull Request](#push--pull-request)
- [Schedule (Cron)](#schedule-cron)
- [Manual Trigger](#manual-trigger)
- [Workflow Dispatch](#workflow-dispatch)

### Unsere Workflows
- [ci.yml - Continuous Integration](#ciyml---continuous-integration)
- [nightly.yml - Nightly Tests](#nightlyyml---nightly-tests)
- [deploy-production.yml - Deployment](#deploy-productionyml---deployment)

### Fortgeschritten
- [Secrets & Environment Variables](#secrets--environment-variables)
- [Matrix Builds](#matrix-builds)
- [Caching](#caching)
- [Services (Datenbanken)](#services-datenbanken)
- [Artifacts](#artifacts)
- [Concurrency](#concurrency)

### Best Practices
- [Workflow-Optimierung](#workflow-optimierung)
- [Sicherheit](#sicherheit)
- [Debugging](#debugging)

---

## Grundlagen

### Was ist GitHub Actions?

```
Was ist das?   CI/CD-Plattform direkt in GitHub integriert
Vergleich:     Wie ein Roboter der bei jedem Code-Push automatisch arbeitet
Zweck:         Automatisierte Tests, Builds, Deployments
```

**Vorteile:**
- ✅ Direkt in GitHub integriert
- ✅ Kostenlos für Open Source
- ✅ 2000 Minuten/Monat für Private Repos (Free Tier)
- ✅ Große Marketplace mit fertigen Actions
- ✅ Matrix Builds für mehrere Umgebungen

**Alternativen:**
| Tool | Vorteile | Nachteile |
|------|----------|-----------|
| **GitHub Actions** | Integriert, kostenlos | Nur mit GitHub |
| Jenkins | Self-hosted, flexibel | Komplex, wartungsintensiv |
| GitLab CI | Ähnlich wie GH Actions | Nur mit GitLab |
| CircleCI | Schnell, Docker-fokus | Kosten bei Scale |
| Travis CI | Einfach | Langsamer, teurer |

---

### Kernkonzepte

```
┌─────────────────────────────────────────────────────────────────┐
│                         WORKFLOW                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                         JOB 1                            │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │  │
│  │  │ Step 1  │─▶│ Step 2  │─▶│ Step 3  │─▶│ Step 4  │    │  │
│  │  │Checkout │  │ Install │  │  Test   │  │  Build  │    │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼ (depends on)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                         JOB 2                            │  │
│  │  ┌─────────┐  ┌─────────┐                               │  │
│  │  │ Step 1  │─▶│ Step 2  │                               │  │
│  │  │ Deploy  │  │ Verify  │                               │  │
│  │  └─────────┘  └─────────┘                               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

| Konzept | Beschreibung | Beispiel |
|---------|--------------|----------|
| **Workflow** | Gesamter Automatisierungsprozess | `ci.yml` |
| **Job** | Gruppe von Steps auf einem Runner | `build`, `test`, `deploy` |
| **Step** | Einzelne Aufgabe | `npm install`, `npm test` |
| **Action** | Wiederverwendbare Step-Vorlage | `actions/checkout@v4` |
| **Runner** | Server der Jobs ausführt | `ubuntu-latest` |

---

### YAML Syntax

**YAML Grundlagen:**

```yaml
# Kommentar
name: Workflow Name          # String
on: push                     # Einfacher Wert

# Liste
branches:
  - main
  - develop

# Objekt (Key-Value)
env:
  NODE_VERSION: '20'
  DEBUG: 'true'

# Mehrzeilige Strings
run: |
  echo "Zeile 1"
  echo "Zeile 2"
  echo "Zeile 3"

# Bedingung
if: github.ref == 'refs/heads/main'

# Variable-Syntax
${{ github.sha }}            # GitHub Context
${{ secrets.API_KEY }}       # Secret
${{ env.NODE_VERSION }}      # Environment Variable
```

---

## Workflow-Struktur

### Workflows

**Wo liegen Workflows?**
```
.github/
└── workflows/
    ├── ci.yml                    # Continuous Integration
    ├── nightly.yml               # Nightly Tests
    └── deploy-production.yml     # Production Deployment
```

**Basis-Struktur:**

```yaml
# Name des Workflows (erscheint in GitHub UI)
name: CI

# Wann soll der Workflow laufen?
on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

# Umgebungsvariablen (global)
env:
  NODE_VERSION: '20'

# Jobs definieren
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
```

---

### Jobs

**Jobs laufen parallel (außer mit `needs`):**

```yaml
jobs:
  # Job 1: Lint
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint

  # Job 2: Test (läuft PARALLEL zu lint)
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test

  # Job 3: Build (wartet auf lint UND test)
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]        # ← Abhängigkeit!
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
```

**Visualisierung:**

```
Zeit →
────────────────────────────────────────────────────────►

├── lint ────────┤
                  \
├── test ────────┤ ├── build ────────┤
                  /
                (wartet auf beide)
```

**Job-Optionen:**

```yaml
jobs:
  example:
    runs-on: ubuntu-latest      # Runner OS
    timeout-minutes: 30          # Max. Laufzeit
    if: github.ref == 'refs/heads/main'  # Bedingung
    environment: production      # Environment (für Secrets)
    continue-on-error: true      # Bei Fehler weitermachen
```

---

### Steps

**Steps laufen sequenziell:**

```yaml
steps:
  # Step 1: Action verwenden
  - name: Checkout code
    uses: actions/checkout@v4
    with:
      fetch-depth: 0

  # Step 2: Shell-Befehl ausführen
  - name: Install dependencies
    run: pnpm install --frozen-lockfile

  # Step 3: Mehrere Befehle
  - name: Build and Test
    run: |
      pnpm run build
      pnpm run test

  # Step 4: Mit Bedingung
  - name: Deploy
    if: success() && github.ref == 'refs/heads/main'
    run: ./deploy.sh

  # Step 5: Mit Environment Variables
  - name: Run with env
    run: echo "Version: $VERSION"
    env:
      VERSION: ${{ github.sha }}
```

---

### Actions

**Was sind Actions?**

```
Actions = Wiederverwendbare "Bausteine"
──────────────────────────────────────

Statt:
  - run: git clone https://github.com/...
  - run: cd repo && git checkout $BRANCH
  - run: ...

Einfach:
  - uses: actions/checkout@v4
```

**Beliebte Actions:**

| Action | Zweck |
|--------|-------|
| `actions/checkout@v4` | Repository klonen |
| `actions/setup-node@v4` | Node.js installieren |
| `pnpm/action-setup@v4` | pnpm installieren |
| `docker/build-push-action@v5` | Docker Image bauen |
| `aws-actions/configure-aws-credentials@v4` | AWS Login |

**Action-Syntax:**

```yaml
# Offizielle Action
- uses: actions/checkout@v4

# Action mit Parametern
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'

# Action von Drittanbieter
- uses: pnpm/action-setup@v4
  with:
    version: '10.11.1'

# Action aus anderem Repo
- uses: owner/repo@v1

# Lokale Action
- uses: ./.github/actions/my-action
```

---

## Trigger & Events

### Push & Pull Request

```yaml
on:
  # Bei jedem Push auf main/master
  push:
    branches:
      - main
      - master
    # Nur bei Änderungen in bestimmten Pfaden
    paths:
      - 'src/**'
      - 'package.json'
    # NICHT bei diesen Pfaden
    paths-ignore:
      - '**.md'
      - 'docs/**'

  # Bei Pull Requests
  pull_request:
    branches:
      - main
    types:
      - opened        # PR geöffnet
      - synchronize   # Neue Commits gepusht
      - reopened      # PR wieder geöffnet
```

---

### Schedule (Cron)

```yaml
on:
  schedule:
    # Jeden Tag um 2:00 UTC (3:00 CET)
    - cron: '0 2 * * *'

    # Jeden Montag um 9:00 UTC
    - cron: '0 9 * * 1'

    # Alle 6 Stunden
    - cron: '0 */6 * * *'
```

**Cron-Syntax:**

```
┌───────────── Minute (0 - 59)
│ ┌───────────── Stunde (0 - 23)
│ │ ┌───────────── Tag des Monats (1 - 31)
│ │ │ ┌───────────── Monat (1 - 12)
│ │ │ │ ┌───────────── Wochentag (0 - 6, 0 = Sonntag)
│ │ │ │ │
* * * * *

Beispiele:
0 2 * * *     = Täglich um 2:00 UTC
0 9 * * 1     = Jeden Montag um 9:00 UTC
*/15 * * * *  = Alle 15 Minuten
0 0 1 * *     = Am 1. jeden Monats um Mitternacht
```

---

### Manual Trigger

```yaml
on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to deploy'
        required: true
        type: string
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - staging
          - production
      skip_tests:
        description: 'Skip tests?'
        required: false
        type: boolean
        default: false
```

**Verwendung im Workflow:**

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Show inputs
        run: |
          echo "Version: ${{ inputs.version }}"
          echo "Environment: ${{ inputs.environment }}"
          echo "Skip tests: ${{ inputs.skip_tests }}"
```

---

## Unsere Workflows

### ci.yml - Continuous Integration

**Was macht er?**

```
Bei Push/PR auf main/master:
┌─────────────────────────────────────────────────────────────────┐
│  quality          test              build            docker     │
│  ────────         ────              ─────            ──────     │
│  • Lint           • Unit Tests      • Next.js        • Build    │
│  • TypeCheck      • Integration     • Build          • Test     │
│  • Format Check   • (disabled)      • Check Output   • Image    │
│  • Security Audit │                  │                │         │
│         │         │                  │                │         │
│         └────────►└─────────────────►└───────────────►│         │
│                    (needs: quality)  (needs: test)              │
└─────────────────────────────────────────────────────────────────┘
```

**Wichtige Teile erklärt:**

```yaml
# Concurrency: Nur ein Workflow pro Branch gleichzeitig
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
# → Wenn neuer Push kommt, alter Workflow wird abgebrochen

# Services: PostgreSQL für Tests
services:
  postgres:
    image: postgres:15-alpine
    env:
      POSTGRES_DB: freelancer_test
      POSTGRES_USER: test_user
      POSTGRES_PASSWORD: test_password
    ports:
      - 5432:5432
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
# → Startet echte PostgreSQL-Datenbank im Container

# Cache für pnpm
- uses: actions/setup-node@v4
  with:
    cache: 'pnpm'
# → Spart Zeit bei jedem Build (node_modules gecached)
```

---

### nightly.yml - Nightly Tests

**Was macht er?**

```
Jeden Tag um 2:00 UTC:
┌─────────────────────────────────────────────────────────────────┐
│  nightly-tests              backup-test       dependency-check  │
│  ─────────────              ───────────       ────────────────  │
│  • Full Test Suite          • pg_dump         • pnpm outdated   │
│  • E2E Tests (Playwright)   • pg_restore      • Update Check    │
│  • Performance Tests        • Verify Data     │                 │
│  • Visual Regression        │                 │                 │
│  • Security Scan            │                 │                 │
│  • Docker Build             │                 │                 │
│  • Migration Test           │                 │                 │
└─────────────────────────────────────────────────────────────────┘
```

**Warum Nightly Tests?**
- Umfangreiche Tests die zu lange für jeden Push dauern
- Frühzeitige Erkennung von Problemen
- Backup/Restore testen
- Dependency-Updates prüfen

---

### deploy-production.yml - Deployment

**Was macht er?**

```
Bei manuellem Trigger (workflow_dispatch):
┌─────────────────────────────────────────────────────────────────┐
│  validate    →    pre-tests    →    build    →    deploy        │
│  ────────         ─────────         ─────         ──────        │
│  • Version Tag    • Run Tests       • Docker      • AWS ECS     │
│  • Format Check   • Health Check    • Push ECR    • Health Check│
│                                                   • Smoke Tests │
│                                                                 │
│                        Bei Fehler:                              │
│                        ───────────                              │
│                        rollback Job + Notification              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fortgeschritten

### Secrets & Environment Variables

**Secrets setzen:**

```bash
# Via gh CLI
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY

# Oder: GitHub → Settings → Secrets → Actions
```

**Secrets verwenden:**

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1

      - name: Use in script
        run: |
          echo "Deploying..."
          # ${{ secrets.API_KEY }} - NIEMALS echo!
        env:
          API_KEY: ${{ secrets.API_KEY }}
```

**Environment Variables:**

```yaml
# Global (für alle Jobs)
env:
  NODE_VERSION: '20'

jobs:
  build:
    # Job-Level
    env:
      CI: true

    steps:
      - name: Step with env
        # Step-Level
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npm test
```

**Wichtig:**
- ❌ Secrets werden in Logs maskiert (`***`)
- ❌ Secrets nicht in echo/print ausgeben
- ✅ Secrets nur über `${{ secrets.NAME }}`

---

### Matrix Builds

**Mehrere Konfigurationen parallel testen:**

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]
        # Ergibt 3 x 3 = 9 Jobs!

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

**Visualisierung:**

```
┌─────────────────────────────────────────────────────────────────┐
│  ubuntu + node 18    ubuntu + node 20    ubuntu + node 22      │
│  windows + node 18   windows + node 20   windows + node 22     │
│  macos + node 18     macos + node 20     macos + node 22       │
└─────────────────────────────────────────────────────────────────┘
                    9 Jobs parallel!
```

**Matrix mit Exclude/Include:**

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20]
    exclude:
      - os: windows-latest
        node: 18
    include:
      - os: ubuntu-latest
        node: 22
        experimental: true
```

---

### Caching

**pnpm Cache (automatisch):**

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'pnpm'    # ← Automatisches Caching!
```

**Manuelles Caching:**

```yaml
- name: Cache node_modules
  uses: actions/cache@v4
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

**Docker Layer Caching:**

```yaml
- uses: docker/build-push-action@v5
  with:
    context: .
    cache-from: type=gha           # ← GitHub Actions Cache
    cache-to: type=gha,mode=max
```

**Caching-Effekt:**

```
Ohne Cache:
  pnpm install: 45 Sekunden

Mit Cache:
  pnpm install: 5 Sekunden (90% schneller!)
```

---

### Services (Datenbanken)

**PostgreSQL als Service:**

```yaml
jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - run: npm test
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/test_db
```

**Andere Services:**

```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - 6379:6379

  elasticsearch:
    image: elasticsearch:8.10.0
    env:
      discovery.type: single-node
    ports:
      - 9200:9200
```

---

### Artifacts

**Build-Ergebnisse speichern:**

```yaml
- name: Build
  run: npm run build

- name: Upload build artifact
  uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: .next/
    retention-days: 7

# In anderem Job verwenden:
- name: Download build artifact
  uses: actions/download-artifact@v4
  with:
    name: build-output
    path: .next/
```

**Test-Reports hochladen:**

```yaml
- name: Upload test report
  if: always()    # Auch bei Fehler
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: playwright-report/
```

---

### Concurrency

**Nur ein Workflow gleichzeitig:**

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**Beispiel:**

```
Push 1 → Workflow startet
Push 2 → Workflow 1 wird abgebrochen, Workflow 2 startet
Push 3 → Workflow 2 wird abgebrochen, Workflow 3 startet
```

**Für Deployments (NICHT abbrechen):**

```yaml
concurrency:
  group: production-deploy
  cancel-in-progress: false    # ← Warten statt abbrechen
```

---

## Best Practices

### Workflow-Optimierung

**1. Jobs parallelisieren:**
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]

  test:
    runs-on: ubuntu-latest    # Läuft parallel zu lint!
    steps: [...]

  build:
    needs: [lint, test]       # Wartet auf beide
    steps: [...]
```

**2. Früh abbrechen bei Fehlern:**
```yaml
strategy:
  fail-fast: true    # Bei erstem Fehler alle anderen abbrechen
```

**3. Timeouts setzen:**
```yaml
jobs:
  build:
    timeout-minutes: 15    # Max. 15 Minuten
```

**4. Pfad-Filter nutzen:**
```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
    paths-ignore:
      - '**.md'
```

---

### Sicherheit

**1. Secrets niemals loggen:**
```yaml
# ❌ SCHLECHT
- run: echo ${{ secrets.API_KEY }}

# ✅ GUT
- run: ./script.sh
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

**2. Actions pinnen:**
```yaml
# ❌ RISKANT (kann sich ändern)
- uses: actions/checkout@v4

# ✅ SICHER (exakte Version)
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11
```

**3. Permissions einschränken:**
```yaml
permissions:
  contents: read        # Nur lesen
  pull-requests: write  # PRs kommentieren
```

**4. GITHUB_TOKEN minimal:**
```yaml
permissions: read-all    # Oder einzeln definieren
```

---

### Debugging

**Debug-Logging aktivieren:**
```yaml
- name: Debug step
  run: |
    echo "Event: ${{ github.event_name }}"
    echo "Ref: ${{ github.ref }}"
    echo "SHA: ${{ github.sha }}"
    echo "Actor: ${{ github.actor }}"
```

**Workflow manuell testen:**
```yaml
on:
  workflow_dispatch:    # Manueller Trigger zum Testen
```

**Lokales Testen mit act:**
```bash
# act installieren (macOS)
brew install act

# Workflow lokal ausführen
act push
act pull_request
act workflow_dispatch
```

**GitHub Actions Debug-Mode:**
```
Repository → Settings → Secrets → Actions
→ Secret hinzufügen: ACTIONS_STEP_DEBUG = true
```

---

## Glossar

| Begriff | Erklärung |
|---------|-----------|
| **Workflow** | YAML-Datei mit automatisierten Aufgaben |
| **Job** | Gruppe von Steps auf einem Runner |
| **Step** | Einzelne Aufgabe (Action oder Shell-Befehl) |
| **Action** | Wiederverwendbarer Baustein |
| **Runner** | Server der Jobs ausführt |
| **Artifact** | Gespeicherte Dateien zwischen Jobs/Workflows |
| **Matrix** | Mehrere Konfigurationen parallel |
| **Secret** | Verschlüsselte Umgebungsvariable |
| **Concurrency** | Steuerung paralleler Workflows |
| **YAML** | Datenformat für Workflow-Definitionen |

---

## Weiterführende Links

- [GitHub Actions Dokumentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)
- [act - Local Testing](https://github.com/nektos/act)
- [GitHub Actions Cheat Sheet](https://github.github.io/actions-cheat-sheet/)

---

*Dieses Dokument wird kontinuierlich erweitert.*
