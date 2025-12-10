# Learning Guide Teil 6 - Web Security

**Zuletzt aktualisiert:** 2025-12-03

Dieses Dokument erklärt Web-Sicherheit - kritisch für eine Plattform mit Nutzerdaten.

---

## Inhaltsverzeichnis

### Grundlagen
- [Warum Sicherheit wichtig ist](#warum-sicherheit-wichtig-ist)
- [Security Mindset](#security-mindset)

### OWASP Top 10
- [Was ist OWASP?](#was-ist-owasp)
- [A01: Broken Access Control](#a01-broken-access-control)
- [A02: Cryptographic Failures](#a02-cryptographic-failures)
- [A03: Injection](#a03-injection)
- [A04: Insecure Design](#a04-insecure-design)
- [A05: Security Misconfiguration](#a05-security-misconfiguration)
- [A06: Vulnerable Components](#a06-vulnerable-components)
- [A07: Authentication Failures](#a07-authentication-failures)
- [A08: Software Integrity Failures](#a08-software-integrity-failures)
- [A09: Logging Failures](#a09-logging-failures)
- [A10: Server-Side Request Forgery](#a10-server-side-request-forgery)

### HTTPS & Verschlüsselung
- [TLS/SSL Zertifikate](#tlsssl-zertifikate)
- [HTTPS erzwingen](#https-erzwingen)
- [Verschlüsselung at Rest](#verschlüsselung-at-rest)

### Security Headers
- [Content Security Policy (CSP)](#content-security-policy-csp)
- [CORS](#cors)
- [Weitere wichtige Header](#weitere-wichtige-header)

### Authentifizierung & Autorisierung
- [Passwort-Sicherheit](#passwort-sicherheit)
- [Session Management](#session-management)
- [JWT Best Practices](#jwt-best-practices)

### Input Validation
- [Client-Side vs. Server-Side](#client-side-vs-server-side)
- [Sanitization](#sanitization)
- [Zod Schema Validation](#zod-schema-validation)

### Dependency Security
- [npm audit](#npm-audit)
- [Dependabot](#dependabot)
- [Supply Chain Attacks](#supply-chain-attacks)

### Secrets Management
- [Niemals im Code](#niemals-im-code)
- [Environment Variables](#environment-variables)
- [AWS Secrets Manager](#aws-secrets-manager)

### Best Practices
- [Defense in Depth](#defense-in-depth)
- [Principle of Least Privilege](#principle-of-least-privilege)
- [Security Checklist](#security-checklist)

---

## Grundlagen

### Warum Sicherheit wichtig ist

**Für eine Freelancer-Plattform besonders kritisch:**
- 💳 Zahlungsdaten (falls integriert)
- 👤 Persönliche Daten (Name, Adresse, etc.)
- 📧 E-Mail-Adressen
- 💼 Geschäftsinformationen
- 🔐 Passwörter

**Konsequenzen eines Breaches:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    Datenleck                                     │
│                       │                                          │
│  ┌───────────────────┼───────────────────┐                      │
│  │                   │                   │                      │
│  ▼                   ▼                   ▼                      │
│ Rechtlich        Finanziell         Reputation                  │
│ ─────────        ──────────         ──────────                  │
│ DSGVO-Strafen    Schadensersatz     Vertrauensverlust          │
│ bis 4% Umsatz    Betriebsausfall    Nutzer wandern ab          │
│ oder 20M €       Forensik-Kosten    Negative Presse            │
└─────────────────────────────────────────────────────────────────┘
```

---

### Security Mindset

**Grundprinzipien:**

```
1. Trust No Input
   ─────────────────
   Alles was von außen kommt ist potenziell bösartig

2. Defense in Depth
   ─────────────────
   Mehrere Sicherheitsschichten, nicht nur eine

3. Fail Secure
   ─────────────────
   Bei Fehlern: lieber sperren als öffnen

4. Least Privilege
   ─────────────────
   Nur die minimal nötigen Rechte vergeben
```

---

## OWASP Top 10

### Was ist OWASP?

```
OWASP = Open Web Application Security Project
──────────────────────────────────────────────
Nonprofit-Organisation die Web-Sicherheit verbessert

Top 10 = Die 10 kritischsten Sicherheitsrisiken
        Aktualisiert alle paar Jahre (zuletzt 2021)
```

---

### A01: Broken Access Control

**Das Problem:**

```javascript
// ❌ GEFÄHRLICH: Keine Autorisierung
app.get('/api/users/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  res.json(user);  // Jeder kann jeden User sehen!
});

// ✅ SICHER: Prüfe ob User berechtigt ist
app.get('/api/users/:id', async (req, res) => {
  const currentUser = req.session.user;

  // Nur eigene Daten oder Admin
  if (req.params.id !== currentUser.id && !currentUser.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const user = await db.users.findById(req.params.id);
  res.json(user);
});
```

**Häufige Fehler:**
- URL manipulieren: `/admin` ohne Check
- ID erraten: `/api/orders/12345`
- Fehlende Checks bei API-Calls

**Schutzmaßnahmen:**
- ✅ Server-seitige Autorisierung für JEDEN Request
- ✅ Deny by Default
- ✅ Rate Limiting
- ✅ Audit Logging

---

### A02: Cryptographic Failures

**Das Problem:**

```javascript
// ❌ GEFÄHRLICH: Klartext-Passwörter
await db.users.create({
  email: 'user@example.com',
  password: 'geheim123'  // In DB als Klartext!
});

// ✅ SICHER: Passwort hashen
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash('geheim123', 12);
await db.users.create({
  email: 'user@example.com',
  password: hashedPassword  // Nur Hash in DB
});
```

**Häufige Fehler:**
- Passwörter im Klartext speichern
- Schwache Hashing-Algorithmen (MD5, SHA1)
- Sensible Daten unverschlüsselt übertragen
- Hartcodierte Secrets

**Schutzmaßnahmen:**
- ✅ bcrypt für Passwörter (mit Salt)
- ✅ HTTPS überall
- ✅ Daten at Rest verschlüsseln
- ✅ Secrets in Environment Variables

---

### A03: Injection

**SQL Injection:**

```javascript
// ❌ GEFÄHRLICH: String-Konkatenation
const query = `SELECT * FROM users WHERE email = '${email}'`;
// Angreifer: email = "'; DROP TABLE users; --"
// → SELECT * FROM users WHERE email = ''; DROP TABLE users; --'

// ✅ SICHER: Parameterisierte Queries (Prisma macht das automatisch)
const user = await prisma.user.findUnique({
  where: { email: email }
});
```

**XSS (Cross-Site Scripting):**

```jsx
// ❌ GEFÄHRLICH: dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />
// Angreifer: userInput = "<script>stealCookies()</script>"

// ✅ SICHER: React escaped automatisch
<div>{userInput}</div>  // Script wird als Text angezeigt
```

**Schutzmaßnahmen:**
- ✅ ORM verwenden (Prisma)
- ✅ Input validieren (Zod)
- ✅ Output escapen (React macht das)
- ✅ Prepared Statements

---

### A04: Insecure Design

**Das Problem:**

```
Design-Fehler die nicht durch Code behoben werden können

Beispiel: Passwort-Reset per Security Question
───────────────────────────────────────────────
"Mädchenname der Mutter?"
→ Oft öffentlich auf Social Media findbar
→ Design ist inhärent unsicher
```

**Schutzmaßnahmen:**
- ✅ Threat Modeling vor Entwicklung
- ✅ Security Requirements definieren
- ✅ Secure Design Patterns verwenden
- ✅ Security Reviews

---

### A05: Security Misconfiguration

**Häufige Fehler:**

```yaml
# ❌ GEFÄHRLICH: Debug-Mode in Production
NODE_ENV=development  # Zeigt Stack Traces!

# ❌ GEFÄHRLICH: Default-Credentials
DATABASE_URL=postgresql://admin:admin@localhost

# ❌ GEFÄHRLICH: Fehlende Security Headers
# (Keine CSP, keine HSTS, etc.)

# ❌ GEFÄHRLICH: Unnötige Features aktiviert
# Directory Listing, Admin-Panels ohne Auth
```

**Schutzmaßnahmen:**
- ✅ Minimale Installation (nur was nötig ist)
- ✅ Default-Credentials ändern
- ✅ Security Headers setzen
- ✅ Error Messages ohne Details in Production

---

### A06: Vulnerable Components

**Das Problem:**

```
node_modules enthält hunderte Pakete
Jedes Paket kann Sicherheitslücken haben

Beispiel:
- log4j (Java) - Remote Code Execution
- event-stream (npm) - Bitcoin-Stealer injiziert
- ua-parser-js (npm) - Crypto-Miner injiziert
```

**Schutzmaßnahmen:**

```bash
# Vulnerabilities prüfen
pnpm audit

# Kritische Updates automatisch
pnpm audit fix

# Dependabot aktivieren (GitHub)
# → Automatische PRs bei Sicherheitsupdates
```

---

### A07: Authentication Failures

**Häufige Fehler:**

```javascript
// ❌ GEFÄHRLICH: Schwache Passwort-Anforderungen
if (password.length < 4) {
  return "Passwort zu kurz";
}

// ❌ GEFÄHRLICH: Keine Brute-Force Protection
app.post('/login', async (req, res) => {
  // Unlimited attempts!
  const user = await checkCredentials(req.body);
});

// ❌ GEFÄHRLICH: Session nicht invalidieren nach Login
// → Session Fixation möglich
```

**Schutzmaßnahmen:**
- ✅ Starke Passwort-Regeln (min. 8 Zeichen, Komplexität)
- ✅ Rate Limiting (max. 5 Versuche, dann Sperre)
- ✅ Multi-Faktor-Authentifizierung (MFA)
- ✅ Session-ID nach Login erneuern

---

### A08: Software Integrity Failures

**Das Problem:**

```
Angreifer manipulieren Code oder Updates

Beispiele:
- Kompromittierte npm-Pakete
- Man-in-the-Middle bei Downloads
- Unsichere CI/CD Pipelines
```

**Schutzmaßnahmen:**
- ✅ Lock-Files committen (`pnpm-lock.yaml`)
- ✅ Checksums verifizieren
- ✅ Signed Commits
- ✅ CI/CD Pipeline sichern

---

### A09: Logging Failures

**Das Problem:**

```javascript
// ❌ GEFÄHRLICH: Keine Logs
// Angreifer kann unbemerkt eindringen

// ❌ GEFÄHRLICH: Sensible Daten in Logs
console.log(`Login attempt: ${email} / ${password}`);

// ✅ SICHER: Relevante Events loggen
logger.info('Login attempt', {
  email: email,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date().toISOString()
  // KEIN Passwort!
});
```

**Was loggen:**
- ✅ Login-Versuche (erfolgreich + fehlgeschlagen)
- ✅ Passwort-Änderungen
- ✅ Admin-Aktionen
- ✅ Zugriffsfehler (403, 401)

---

### A10: Server-Side Request Forgery

**Das Problem:**

```javascript
// ❌ GEFÄHRLICH: URL vom User direkt verwenden
app.get('/fetch', async (req, res) => {
  const response = await fetch(req.query.url);
  res.json(await response.json());
});
// Angreifer: /fetch?url=http://169.254.169.254/metadata
// → Zugriff auf AWS Metadata Service!

// ✅ SICHER: URL validieren
const allowedDomains = ['api.example.com'];
const url = new URL(req.query.url);
if (!allowedDomains.includes(url.hostname)) {
  return res.status(400).json({ error: 'Domain not allowed' });
}
```

---

## HTTPS & Verschlüsselung

### TLS/SSL Zertifikate

```
Was ist das?   Verschlüsselt Kommunikation zwischen Browser und Server
Vergleich:     Wie ein versiegelter Brief statt Postkarte
Zweck:         Verhindert Mitlesen und Manipulation
```

**Unsere Zertifikate:**
- CloudFront → ACM Certificate (*.weigele.art)
- Automatische Erneuerung durch AWS

---

### HTTPS erzwingen

**In Next.js Middleware:**

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  // HTTPS erzwingen (in Production)
  if (
    process.env.NODE_ENV === 'production' &&
    request.headers.get('x-forwarded-proto') !== 'https'
  ) {
    return NextResponse.redirect(
      `https://${request.headers.get('host')}${request.nextUrl.pathname}`
    );
  }
}
```

**Mit HSTS Header:**

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }
];
```

---

### Verschlüsselung at Rest

```
Datenbank (RDS):
- Encryption at Rest aktiviert
- AWS KMS Key Management

S3 Buckets:
- Server-Side Encryption (SSE-S3 oder SSE-KMS)
- Bucket Policy erzwingt Encryption
```

---

## Security Headers

### Content Security Policy (CSP)

```
Was ist das?   Whitelist welche Ressourcen geladen werden dürfen
Vergleich:     Wie eine Gästeliste die sagt wer rein darf
Zweck:         Verhindert XSS und Data Injection
```

**Beispiel:**

```typescript
// next.config.js
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
`;
```

**Direktiven:**

| Direktive | Erlaubt |
|-----------|---------|
| `default-src` | Fallback für alle |
| `script-src` | JavaScript |
| `style-src` | CSS |
| `img-src` | Bilder |
| `connect-src` | fetch, WebSocket |
| `frame-ancestors` | Wer darf einbetten (Clickjacking) |

---

### CORS

```
Was ist das?   Cross-Origin Resource Sharing
Vergleich:     Erlaubnis für andere Domains auf deine API zuzugreifen
Zweck:         Kontrolliert welche Websites deine API nutzen dürfen
```

```typescript
// API Route
export async function GET(request: Request) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Access-Control-Allow-Origin': 'https://weigele.art',
      'Access-Control-Allow-Methods': 'GET, POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

---

### Weitere wichtige Header

```typescript
const securityHeaders = [
  // Verhindert MIME-Type Sniffing
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // Verhindert Einbettung in iframes (Clickjacking)
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // Aktiviert XSS-Filter im Browser
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  // Kontrolliert Referrer-Information
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // Permissions Policy (früher Feature-Policy)
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];
```

---

## Authentifizierung & Autorisierung

### Passwort-Sicherheit

**Hashing mit bcrypt:**

```typescript
import bcrypt from 'bcryptjs';

// Passwort hashen (bei Registrierung)
const saltRounds = 12;  // Höher = sicherer, aber langsamer
const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

// Passwort verifizieren (bei Login)
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

**Passwort-Regeln:**
- ✅ Mindestens 8 Zeichen
- ✅ Groß- und Kleinbuchstaben
- ✅ Mindestens eine Zahl
- ✅ Sonderzeichen empfohlen
- ✅ Nicht in Leak-Datenbanken (haveibeenpwned)

---

### Session Management

```typescript
// Session-Konfiguration (NextAuth)
export const authOptions = {
  session: {
    strategy: 'jwt',          // Oder 'database'
    maxAge: 30 * 24 * 60 * 60, // 30 Tage
  },
  cookies: {
    sessionToken: {
      name: 'session-token',
      options: {
        httpOnly: true,        // Nicht per JavaScript lesbar
        secure: true,          // Nur über HTTPS
        sameSite: 'lax',       // CSRF-Schutz
        path: '/',
      }
    }
  }
};
```

---

### JWT Best Practices

```typescript
// ✅ Kurze Laufzeit
const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });

// ✅ Refresh Token für neue Access Tokens
const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '7d' });

// ✅ Token in httpOnly Cookie (nicht localStorage!)
res.cookie('token', accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});

// ❌ NIEMALS in localStorage
localStorage.setItem('token', accessToken);  // XSS-anfällig!
```

---

## Input Validation

### Client-Side vs. Server-Side

```
Client-Side Validation:
────────────────────────
- Für UX (schnelles Feedback)
- NIEMALS für Sicherheit
- Kann umgangen werden

Server-Side Validation:
────────────────────────
- IMMER erforderlich
- Letzte Verteidigungslinie
- Kann nicht umgangen werden
```

---

### Zod Schema Validation

```typescript
import { z } from 'zod';

// Schema definieren
const UserSchema = z.object({
  email: z.string()
    .email('Ungültige E-Mail')
    .max(255),
  password: z.string()
    .min(8, 'Mindestens 8 Zeichen')
    .max(100),
  name: z.string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-ZäöüÄÖÜß\s-]+$/, 'Nur Buchstaben erlaubt'),
  dayRate: z.number()
    .min(100)
    .max(5000),
});

// Validieren
try {
  const validData = UserSchema.parse(req.body);
  // validData ist typsicher!
} catch (error) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ errors: error.errors });
  }
}
```

---

## Dependency Security

### npm audit

```bash
# Vulnerabilities prüfen
pnpm audit

# Output:
# ┌───────────────┬──────────────────────────────────────┐
# │ Severity      │ high                                 │
# │ Package       │ lodash                               │
# │ Version       │ < 4.17.21                           │
# │ Vulnerability │ Prototype Pollution                  │
# │ Fix           │ pnpm update lodash                   │
# └───────────────┴──────────────────────────────────────┘

# Automatisch fixen
pnpm audit fix
```

---

### Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "security"
```

---

## Secrets Management

### Niemals im Code

```javascript
// ❌ FATAL: Secret im Code
const API_KEY = 'sk-1234567890abcdef';
const DB_PASSWORD = 'super-secret-123';

// ❌ FATAL: In Git-History
// Selbst wenn gelöscht, ist es in der History!

// ✅ SICHER: Environment Variables
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
```

**.gitignore:**

```gitignore
# Environment files
.env
.env.local
.env.*.local

# Terraform
*.tfvars
terraform.tfstate*
```

---

### AWS Secrets Manager

```typescript
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManager({ region: 'eu-central-1' });

async function getSecret(secretName: string) {
  const response = await client.getSecretValue({
    SecretId: secretName
  });
  return JSON.parse(response.SecretString!);
}

// Verwendung
const dbCredentials = await getSecret('freelancer/db-credentials');
```

---

## Best Practices

### Defense in Depth

```
Mehrere Sicherheitsschichten:
──────────────────────────────────────────────────────────────────

Layer 1: Network
  └── CloudFront WAF
  └── Security Groups
  └── Private Subnets

Layer 2: Application
  └── Input Validation
  └── Output Encoding
  └── Security Headers

Layer 3: Authentication
  └── Strong Passwords
  └── Rate Limiting
  └── Session Management

Layer 4: Database
  └── Parameterized Queries
  └── Encryption at Rest
  └── Least Privilege Access

Layer 5: Monitoring
  └── Audit Logging
  └── Alerting
  └── Anomaly Detection
```

---

### Security Checklist

**Vor Go-Live prüfen:**

```
Authentifizierung:
☐ Passwörter mit bcrypt gehasht
☐ Rate Limiting für Login
☐ Session-Timeout konfiguriert
☐ Sichere Cookie-Flags (httpOnly, secure, sameSite)

Datenvalidierung:
☐ Server-seitige Validierung für alle Inputs
☐ SQL Injection Prevention (ORM)
☐ XSS Prevention (Output Encoding)

HTTPS:
☐ TLS-Zertifikat konfiguriert
☐ HSTS Header gesetzt
☐ HTTP → HTTPS Redirect

Headers:
☐ CSP konfiguriert
☐ X-Frame-Options: DENY
☐ X-Content-Type-Options: nosniff

Secrets:
☐ Keine Secrets im Code
☐ Environment Variables verwendet
☐ .env Dateien in .gitignore

Dependencies:
☐ npm audit ohne kritische Vulnerabilities
☐ Dependabot aktiviert
☐ Lock-File committed

Logging:
☐ Login-Versuche geloggt
☐ Keine sensiblen Daten in Logs
☐ Log-Retention konfiguriert

Backups:
☐ Datenbank-Backups automatisiert
☐ Backup-Restore getestet
```

---

## Glossar

| Begriff | Erklärung |
|---------|-----------|
| **OWASP** | Open Web Application Security Project |
| **XSS** | Cross-Site Scripting |
| **CSRF** | Cross-Site Request Forgery |
| **SQL Injection** | Einschleusen von SQL-Befehlen |
| **SSRF** | Server-Side Request Forgery |
| **CSP** | Content Security Policy |
| **CORS** | Cross-Origin Resource Sharing |
| **HSTS** | HTTP Strict Transport Security |
| **bcrypt** | Passwort-Hashing-Algorithmus |
| **JWT** | JSON Web Token |
| **MFA** | Multi-Factor Authentication |
| **WAF** | Web Application Firewall |

---

## Weiterführende Links

- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Security Headers](https://securityheaders.com/)
- [Mozilla Web Security](https://infosec.mozilla.org/guidelines/web_security)
- [Have I Been Pwned](https://haveibeenpwned.com/)

---

*Dieses Dokument wird kontinuierlich erweitert.*
