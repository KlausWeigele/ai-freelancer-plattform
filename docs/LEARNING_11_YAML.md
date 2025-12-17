# Learning 11: YAML

**Erstellt:** 2025-12-17
**Kontext:** AI-Freelancer-Plattform - Konfigurationsdateien verstehen

---

## Inhaltsverzeichnis

1. [Was ist YAML?](#1-was-ist-yaml)
2. [Grundlegende Syntax](#2-grundlegende-syntax)
3. [Datentypen](#3-datentypen)
4. [Strukturen](#4-strukturen)
5. [Fortgeschrittene Features](#5-fortgeschrittene-features)
6. [YAML in unserem Projekt](#6-yaml-in-unserem-projekt)
7. [YAML vs. JSON vs. TOML](#7-yaml-vs-json-vs-toml)
8. [Häufige Fehler](#8-häufige-fehler)
9. [Tools und Validierung](#9-tools-und-validierung)
10. [Best Practices](#10-best-practices)

---

## 1. Was ist YAML?

### Definition

**YAML** = "YAML Ain't Markup Language" (rekursives Akronym)

YAML ist ein **menschenlesbares Daten-Serialisierungsformat**, das häufig für Konfigurationsdateien verwendet wird.

### Wo wird YAML verwendet?

```
Unser Projekt:
├── .github/workflows/*.yml    # GitHub Actions
├── docker-compose.yml         # Docker Compose
├── .prettierrc.yml           # Prettier Config (optional)
└── kubernetes/*.yaml          # Kubernetes (später)

Andere Beispiele:
├── ansible/playbook.yml       # Ansible
├── .gitlab-ci.yml            # GitLab CI
├── serverless.yml            # Serverless Framework
└── swagger.yaml              # OpenAPI Specs
```

### Warum YAML?

| Vorteil | Erklärung |
|---------|-----------|
| **Lesbarkeit** | Sehr gut lesbar für Menschen |
| **Keine Klammern** | Einrückung statt {}, [] |
| **Kommentare** | Unterstützt Kommentare (#) |
| **Vielseitig** | Kann komplexe Strukturen abbilden |

---

## 2. Grundlegende Syntax

### Einrückung (Indentation)

```yaml
# YAML nutzt Einrückung für Hierarchie
# WICHTIG: Nur Leerzeichen, KEINE Tabs!
# Standard: 2 Leerzeichen pro Ebene

parent:
  child: value
  another_child:
    grandchild: nested value
```

### Schlüssel-Wert-Paare

```yaml
# Einfache Zuweisungen
name: Klaus Weigele
age: 35
email: klaus@example.com

# Schlüssel mit Leerzeichen (in Anführungszeichen)
"full name": Klaus Weigele
'job title': Software Developer
```

### Kommentare

```yaml
# Dies ist ein Kommentar
name: Klaus  # Inline-Kommentar

# Mehrzeilige Kommentare gibt es nicht
# Jede Zeile braucht ein #
# wie hier gezeigt
```

---

## 3. Datentypen

### Strings

```yaml
# Ohne Anführungszeichen (einfach)
name: Klaus Weigele
city: München

# Mit Anführungszeichen (bei Sonderzeichen)
message: "Hello: World"      # Doppelpunkt im String
path: 'C:\Users\Klaus'       # Backslashes
quoted: "true"               # Als String, nicht Boolean

# Mehrzeilige Strings
# Literal Block (|) - behält Zeilenumbrüche
description: |
  Dies ist eine
  mehrzeilige Beschreibung.
  Zeilenumbrüche bleiben erhalten.

# Folded Block (>) - faltet zu einer Zeile
description: >
  Dies ist eine lange Beschreibung
  die über mehrere Zeilen geht
  aber zu einer Zeile zusammengefasst wird.

# Mit Chomp-Indikatoren
text: |+    # Behält trailing newlines
  Line 1
  Line 2

text: |-    # Entfernt trailing newlines
  Line 1
  Line 2
```

### Zahlen

```yaml
# Integer
count: 42
negative: -17
hex: 0xFF        # 255
octal: 0o17      # 15

# Float
price: 19.99
scientific: 1.2e+5

# Spezielle Werte
infinity: .inf
negative_infinity: -.inf
not_a_number: .nan
```

### Booleans

```yaml
# Verschiedene Schreibweisen (alle gültig)
enabled: true
disabled: false

# Auch möglich (aber vermeiden!)
yes_value: yes
no_value: no
on_value: on
off_value: off

# Empfehlung: Immer true/false verwenden
```

### Null

```yaml
# Null-Werte
empty: null
also_empty: ~
implicit_null:    # Leerer Wert = null
```

### Datum und Zeit

```yaml
# ISO 8601 Format
date: 2024-01-15
datetime: 2024-01-15T14:30:00
datetime_tz: 2024-01-15T14:30:00+01:00
```

---

## 4. Strukturen

### Listen (Arrays)

```yaml
# Block-Stil (empfohlen)
fruits:
  - apple
  - banana
  - orange

# Inline-Stil
fruits: [apple, banana, orange]

# Liste von Objekten
users:
  - name: Klaus
    role: admin
  - name: Anna
    role: user

# Verschachtelte Listen
matrix:
  - [1, 2, 3]
  - [4, 5, 6]
  - [7, 8, 9]
```

### Maps (Objekte)

```yaml
# Block-Stil (empfohlen)
person:
  name: Klaus
  age: 35
  address:
    street: Hauptstraße 1
    city: München
    zip: 80331

# Inline-Stil
person: {name: Klaus, age: 35}

# Verschachtelte Maps
config:
  database:
    host: localhost
    port: 5432
    credentials:
      username: admin
      password: secret
```

### Gemischte Strukturen

```yaml
# Realistisches Beispiel
application:
  name: AI-Freelancer-Platform
  version: 1.0.0

  environments:
    - name: development
      url: http://localhost:3000
      debug: true
    - name: production
      url: https://weigele.art
      debug: false

  features:
    authentication:
      enabled: true
      providers:
        - email
        - google
        - github

    notifications:
      email: true
      push: false
      slack:
        enabled: true
        webhook: https://hooks.slack.com/...
```

---

## 5. Fortgeschrittene Features

### Anker und Aliase (Referenzen)

```yaml
# Anker definieren mit &
defaults: &defaults
  timeout: 30
  retries: 3
  logging: true

# Alias verwenden mit *
development:
  <<: *defaults          # Übernimmt alle Werte von defaults
  debug: true

production:
  <<: *defaults
  debug: false
  timeout: 60            # Überschreibt den Default

# Ergebnis für production:
# timeout: 60 (überschrieben)
# retries: 3 (von defaults)
# logging: true (von defaults)
# debug: false (eigener Wert)
```

### Mehrere Dokumente

```yaml
# Dokument 1
---
name: Document 1
type: config
---
# Dokument 2
name: Document 2
type: data
...  # Ende des Streams (optional)
```

### Tags (Typ-Hinweise)

```yaml
# Explizite Typangabe
string_number: !!str 123        # "123" als String
forced_float: !!float 42        # 42.0 als Float
binary_data: !!binary |
  R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7
```

### Komplexe Schlüssel

```yaml
# Schlüssel als Liste (selten verwendet)
? - item1
  - item2
: value for list key

# Schlüssel als Map
? key1: value1
  key2: value2
: complex value
```

---

## 6. YAML in unserem Projekt

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

env:
  NODE_VERSION: '22'
  PNPM_VERSION: '10'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run linter
        run: pnpm lint

      - name: Run type check
        run: pnpm type-check

      - name: Run tests
        run: pnpm test

      - name: Build
        run: pnpm build

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - name: Deploy to production
        run: echo "Deploying..."
```

### Docker Compose

```yaml
# docker-compose.yml
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
    volumes:
      - .:/app
      - /app/node_modules
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

### Dependabot Konfiguration

```yaml
# .github/dependabot.yml
version: 2

updates:
  # NPM Dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Europe/Berlin"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "automated"
    groups:
      dev-dependencies:
        patterns:
          - "@types/*"
          - "eslint*"
          - "prettier*"
        update-types:
          - "minor"
          - "patch"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "ci"
      - "automated"

  # Docker
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Prettier Konfiguration (YAML-Variante)

```yaml
# .prettierrc.yml
printWidth: 100
tabWidth: 2
useTabs: false
semi: true
singleQuote: true
trailingComma: es5
bracketSpacing: true
arrowParens: always
endOfLine: lf

overrides:
  - files: "*.md"
    options:
      proseWrap: always
  - files: "*.yml"
    options:
      tabWidth: 2
```

---

## 7. YAML vs. JSON vs. TOML

### Vergleich

```yaml
# YAML
database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password: secret
```

```json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "credentials": {
      "username": "admin",
      "password": "secret"
    }
  }
}
```

```toml
[database]
host = "localhost"
port = 5432

[database.credentials]
username = "admin"
password = "secret"
```

### Wann welches Format?

| Format | Vorteile | Nachteile | Verwendung |
|--------|----------|-----------|------------|
| **YAML** | Lesbar, Kommentare, kompakt | Einrückungs-sensitiv | CI/CD, K8s, Docker Compose |
| **JSON** | Universell, strikt | Keine Kommentare, verbose | APIs, package.json |
| **TOML** | Sehr lesbar, explizit | Weniger bekannt | Rust (Cargo.toml), Python |

---

## 8. Häufige Fehler

### 1. Tabs statt Leerzeichen

```yaml
# ❌ FALSCH - Tab-Zeichen
parent:
	child: value    # Tab!

# ✅ RICHTIG - Leerzeichen
parent:
  child: value      # 2 Spaces
```

### 2. Inkonsistente Einrückung

```yaml
# ❌ FALSCH - Gemischte Einrückung
parent:
  child1: value
   child2: value    # 3 Spaces statt 2!

# ✅ RICHTIG - Konsistent 2 Spaces
parent:
  child1: value
  child2: value
```

### 3. Fehlende Anführungszeichen bei Sonderzeichen

```yaml
# ❌ FALSCH - Doppelpunkt im String
message: Error: Something went wrong

# ✅ RICHTIG - Mit Anführungszeichen
message: "Error: Something went wrong"

# ❌ FALSCH - @ am Anfang
email: @username

# ✅ RICHTIG
email: "@username"
```

### 4. Unbeabsichtigte Booleans

```yaml
# ❌ FALSCH - Wird als Boolean interpretiert
country: NO      # false!
answer: yes      # true!

# ✅ RICHTIG - Als String
country: "NO"
answer: "yes"
```

### 5. Leere Werte

```yaml
# ❌ Unklar ob leer oder null
name:
value:

# ✅ Explizit
name: ""         # Leerer String
value: null      # Null-Wert
```

### 6. Falsche Listen-Syntax

```yaml
# ❌ FALSCH - Einrückung nach -
items:
  -item1
  -item2

# ✅ RICHTIG - Leerzeichen nach -
items:
  - item1
  - item2
```

---

## 9. Tools und Validierung

### Online-Validatoren

```
- https://www.yamllint.com/
- https://yamlchecker.com/
- https://codebeautify.org/yaml-validator
```

### VS Code Extensions

```
- YAML (Red Hat)
  - Syntax Highlighting
  - Validation
  - Auto-Completion
  - Schema Support

- YAML Sort
  - Sortiert YAML-Schlüssel alphabetisch
```

### Kommandozeilen-Tools

```bash
# yamllint installieren
pip install yamllint

# YAML validieren
yamllint .github/workflows/ci.yml

# Mit Konfiguration
yamllint -c .yamllint.yml .

# yq - YAML prozessieren (wie jq für JSON)
brew install yq

# Wert auslesen
yq '.jobs.build.runs-on' .github/workflows/ci.yml

# Wert setzen
yq '.version = "2.0.0"' -i docker-compose.yml
```

### yamllint Konfiguration

```yaml
# .yamllint.yml
extends: default

rules:
  line-length:
    max: 120
    level: warning

  indentation:
    spaces: 2
    indent-sequences: true

  document-start: disable

  truthy:
    allowed-values: ['true', 'false']
    check-keys: false

ignore: |
  node_modules/
  .next/
```

### Schema-Validierung

```yaml
# VS Code Settings für Schema-Validierung
# .vscode/settings.json
{
  "yaml.schemas": {
    "https://json.schemastore.org/github-workflow.json": ".github/workflows/*.yml",
    "https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json": "docker-compose*.yml"
  }
}
```

---

## 10. Best Practices

### Lesbarkeit

```yaml
# ✅ Konsistente Einrückung (2 Spaces)
# ✅ Leerzeilen zwischen Sektionen
# ✅ Kommentare für komplexe Teile

# Database Configuration
database:
  host: localhost
  port: 5432

  # Connection Pool Settings
  pool:
    min: 5
    max: 20
    idle_timeout: 30000

# Cache Configuration
cache:
  enabled: true
  ttl: 3600
```

### Sicherheit

```yaml
# ❌ NIEMALS Secrets in YAML committen!
database:
  password: super-secret-password  # NIEMALS!

# ✅ Umgebungsvariablen verwenden
database:
  password: ${DATABASE_PASSWORD}

# ✅ Oder Referenz auf Secret Manager
database:
  password: !secret database_password
```

### Wartbarkeit

```yaml
# ✅ Anker für wiederholte Werte
defaults: &defaults
  replicas: 2
  resources:
    cpu: "500m"
    memory: "512Mi"

services:
  api:
    <<: *defaults
    image: api:latest

  worker:
    <<: *defaults
    image: worker:latest
```

### Validierung

```yaml
# ✅ Schema-Referenz am Anfang
# yaml-language-server: $schema=https://json.schemastore.org/github-workflow.json

name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
```

### Checkliste

```
☐ Nur Leerzeichen, keine Tabs
☐ Konsistente Einrückung (2 Spaces empfohlen)
☐ Strings mit Sonderzeichen in Anführungszeichen
☐ Keine Secrets in YAML-Dateien
☐ yamllint in CI integrieren
☐ Schema-Validierung in VS Code aktivieren
☐ Kommentare für nicht-offensichtliche Konfigurationen
```

---

## Zusammenfassung

```yaml
# YAML Kurzreferenz

# Strings
name: Klaus
quoted: "With: special chars"
multiline: |
  Line 1
  Line 2

# Zahlen
count: 42
price: 19.99

# Boolean
enabled: true
disabled: false

# Null
empty: null

# Listen
items:
  - item1
  - item2

# Maps
person:
  name: Klaus
  age: 35

# Anker & Aliase
defaults: &defaults
  timeout: 30

production:
  <<: *defaults
  debug: false
```

---

## Ressourcen

- [YAML Specification](https://yaml.org/spec/1.2.2/)
- [Learn YAML in Y Minutes](https://learnxinyminutes.com/docs/yaml/)
- [YAML Multiline Strings](https://yaml-multiline.info/)
- [GitHub Actions YAML Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
