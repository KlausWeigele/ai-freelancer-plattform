# Learning 07: DSGVO, Impressum und rechtliche Anforderungen

**Erstellt:** 2025-12-10
**Kontext:** AI-Freelancer-Plattform - Rechtliche Anforderungen für Deutschland/EU

---

## Inhaltsverzeichnis

1. [Warum ist das wichtig?](#1-warum-ist-das-wichtig)
2. [DSGVO (Datenschutz-Grundverordnung)](#2-dsgvo-datenschutz-grundverordnung)
3. [Impressumspflicht](#3-impressumspflicht)
4. [Datenschutzerklärung](#4-datenschutzerklärung)
5. [Cookie-Banner und Consent](#5-cookie-banner-und-consent)
6. [AGB (Allgemeine Geschäftsbedingungen)](#6-agb-allgemeine-geschäftsbedingungen)
7. [Besondere Anforderungen für Plattformen](#7-besondere-anforderungen-für-plattformen)
8. [Technische Umsetzung](#8-technische-umsetzung)
9. [Checkliste für unsere Plattform](#9-checkliste-für-unsere-plattform)
10. [Wichtige Begriffe](#10-wichtige-begriffe)

---

## 1. Warum ist das wichtig?

### Rechtliche Konsequenzen bei Verstößen

| Verstoß | Mögliche Strafe |
|---------|-----------------|
| DSGVO-Verstoß (schwer) | Bis zu 20 Mio. € oder 4% des Jahresumsatzes |
| DSGVO-Verstoß (leicht) | Bis zu 10 Mio. € oder 2% des Jahresumsatzes |
| Fehlendes Impressum | Bis zu 50.000 € Bußgeld |
| Fehlende Datenschutzerklärung | Abmahnung + Bußgeld |
| Unzulässige Cookies | Bis zu 300.000 € (bekannte Fälle) |

### Für unsere Plattform besonders relevant

Als Freelancer-Plattform verarbeiten wir:
- **Personenbezogene Daten** (Name, E-Mail, Adresse)
- **Berufliche Daten** (Skills, Stundensatz, Portfolio)
- **Finanzdaten** (bei Zahlungsabwicklung)
- **Kommunikationsdaten** (Nachrichten zwischen Nutzern)

**Fazit:** Wir müssen die DSGVO vollständig einhalten!

---

## 2. DSGVO (Datenschutz-Grundverordnung)

### Was ist die DSGVO?

Die **Datenschutz-Grundverordnung** (DSGVO, englisch: GDPR) ist seit 25. Mai 2018 in der gesamten EU gültig. Sie regelt, wie personenbezogene Daten verarbeitet werden dürfen.

### Grundprinzipien der DSGVO

#### 1. Rechtmäßigkeit, Verarbeitung nach Treu und Glauben, Transparenz
```
Daten dürfen nur auf Basis einer Rechtsgrundlage verarbeitet werden.
Der Nutzer muss verstehen, was mit seinen Daten passiert.
```

#### 2. Zweckbindung
```
Daten dürfen nur für den Zweck verwendet werden, für den sie erhoben wurden.
Beispiel: E-Mail für Login ≠ E-Mail für Marketing (ohne Einwilligung)
```

#### 3. Datenminimierung
```
Nur die Daten erheben, die wirklich benötigt werden.
Beispiel: Für Freelancer-Profil brauchen wir keine Blutgruppe.
```

#### 4. Richtigkeit
```
Daten müssen korrekt und aktuell sein.
Nutzer müssen ihre Daten berichtigen können.
```

#### 5. Speicherbegrenzung
```
Daten nur so lange speichern wie nötig.
Danach löschen oder anonymisieren.
```

#### 6. Integrität und Vertraulichkeit
```
Daten müssen vor unbefugtem Zugriff geschützt sein.
→ Verschlüsselung, sichere Passwörter, HTTPS
```

### Rechtsgrundlagen für Datenverarbeitung

| Rechtsgrundlage | Artikel | Beispiel |
|-----------------|---------|----------|
| **Einwilligung** | Art. 6 Abs. 1 lit. a | Newsletter-Anmeldung |
| **Vertragserfüllung** | Art. 6 Abs. 1 lit. b | Nutzerdaten für Plattform-Nutzung |
| **Rechtliche Verpflichtung** | Art. 6 Abs. 1 lit. c | Aufbewahrungspflichten für Rechnungen |
| **Berechtigtes Interesse** | Art. 6 Abs. 1 lit. f | Sicherheitsmaßnahmen, Betrugsprävention |

### Betroffenenrechte

Die DSGVO gibt Nutzern folgende Rechte:

#### Recht auf Auskunft (Art. 15)
```
"Welche Daten habt ihr über mich?"
→ Wir müssen innerhalb 1 Monat antworten
→ Kostenlos für den Nutzer
```

#### Recht auf Berichtigung (Art. 16)
```
"Meine Daten sind falsch, bitte korrigieren."
→ Nutzer kann Profil selbst bearbeiten
→ Oder uns kontaktieren
```

#### Recht auf Löschung / "Recht auf Vergessenwerden" (Art. 17)
```
"Löscht alle meine Daten!"
→ Wir MÜSSEN löschen, außer:
  - Gesetzliche Aufbewahrungspflichten (z.B. Rechnungen: 10 Jahre)
  - Laufende Rechtsstreitigkeiten
```

#### Recht auf Datenübertragbarkeit (Art. 20)
```
"Gebt mir meine Daten in einem gängigen Format."
→ JSON oder CSV Export ermöglichen
→ Damit Nutzer zu anderer Plattform wechseln kann
```

#### Recht auf Widerspruch (Art. 21)
```
"Ich will nicht mehr, dass ihr meine Daten für X nutzt."
→ Z.B. Widerspruch gegen Profiling oder Marketing
```

### Auftragsverarbeitung (AVV)

Wenn externe Dienste unsere Nutzerdaten verarbeiten, brauchen wir einen **Auftragsverarbeitungsvertrag (AVV)**:

```
Beispiele, wo AVV nötig ist:
- AWS (Hosting) → AWS DPA (Data Processing Addendum)
- Stripe (Zahlungen) → Stripe DPA
- SendGrid (E-Mails) → SendGrid DPA
- Google Analytics → Google DPA (besser: Matomo nutzen!)
```

**Wichtig:** Die meisten Cloud-Anbieter haben Standard-AVVs, die man online akzeptieren kann.

---

## 3. Impressumspflicht

### Wer braucht ein Impressum?

Nach § 5 TMG (Telemediengesetz) braucht jeder ein Impressum, der:
- Einen kommerziellen/geschäftsmäßigen Online-Dienst betreibt
- Das gilt auch für Freiberufler und Kleinunternehmer!

### Pflichtangaben im Impressum

```
Impressum

Angaben gemäß § 5 TMG:

[Firmenname oder Vor- und Nachname]
[Straße und Hausnummer]
[PLZ und Ort]
[Land]

Kontakt:
Telefon: [Telefonnummer]
E-Mail: [E-Mail-Adresse]

[Bei Unternehmen:]
Vertreten durch: [Geschäftsführer/Inhaber]
Registergericht: [Amtsgericht XY]
Registernummer: [HRB 12345]

[Bei Freiberuflern:]
Umsatzsteuer-ID: [DE123456789]
(oder: "Kleinunternehmer nach § 19 UStG")

Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
[Name und Anschrift]
```

### Besonderheiten für unsere Plattform

```
Zusätzlich bei Plattformen mit nutzergenerierten Inhalten:

EU-Streitschlichtung:
Die Europäische Kommission stellt eine Plattform zur
Online-Streitbeilegung (OS) bereit:
https://ec.europa.eu/consumers/odr/

Wir sind nicht bereit oder verpflichtet, an
Streitbeilegungsverfahren vor einer
Verbraucherschlichtungsstelle teilzunehmen.
```

### Platzierung des Impressums

```
Anforderungen:
✅ Von jeder Seite erreichbar (z.B. Footer)
✅ Maximal 2 Klicks entfernt
✅ Klar erkennbar als "Impressum"
✅ Nicht hinter Login versteckt!
```

---

## 4. Datenschutzerklärung

### Pflichtinhalt einer Datenschutzerklärung

```
1. Name und Kontaktdaten des Verantwortlichen
   - Wer ist für die Datenverarbeitung verantwortlich?

2. Kontaktdaten des Datenschutzbeauftragten (falls vorhanden)
   - Pflicht ab 20 Mitarbeitern mit regelmäßiger Datenverarbeitung

3. Zwecke und Rechtsgrundlagen der Verarbeitung
   - Warum verarbeiten wir welche Daten?
   - Auf welcher Rechtsgrundlage?

4. Empfänger der Daten
   - An wen geben wir Daten weiter?
   - Z.B. Zahlungsdienstleister, Hosting-Provider

5. Übermittlung in Drittländer
   - Werden Daten außerhalb der EU verarbeitet?
   - Welche Garantien gibt es? (z.B. EU-US Data Privacy Framework)

6. Speicherdauer
   - Wie lange speichern wir die Daten?

7. Betroffenenrechte
   - Auskunft, Berichtigung, Löschung, etc.

8. Beschwerderecht bei der Aufsichtsbehörde
   - Nutzer können sich beim Landesdatenschutzbeauftragten beschweren

9. Information über Pflicht zur Bereitstellung
   - Welche Daten sind Pflicht, welche freiwillig?

10. Automatisierte Entscheidungsfindung / Profiling
    - Falls wir KI für Matching nutzen → erklären!
```

### Beispiel-Struktur für unsere Plattform

```markdown
# Datenschutzerklärung

## 1. Verantwortlicher
[Name, Adresse, Kontakt]

## 2. Erhebung und Speicherung personenbezogener Daten

### 2.1 Beim Besuch der Website
- IP-Adresse
- Browsertyp und -version
- Betriebssystem
- Referrer URL
- Uhrzeit der Anfrage
→ Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)

### 2.2 Bei der Registrierung
- E-Mail-Adresse
- Name
- Passwort (gehasht)
→ Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

### 2.3 Bei der Profilerstellung (Freelancer)
- Berufliche Qualifikationen
- Portfolio
- Stundensatz
→ Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

### 2.4 Bei der Projektvermittlung
- Projektdetails
- Kommunikation zwischen Nutzern
- Bewertungen
→ Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)

## 3. Weitergabe von Daten
- AWS (Hosting): [Datenschutz-Link]
- [Weitere Dienstleister]

## 4. Cookies
[Siehe Cookie-Banner]

## 5. Ihre Rechte
[Betroffenenrechte auflisten]

## 6. Änderungen dieser Datenschutzerklärung
[Aktualisierungshinweis]

Stand: [Datum]
```

---

## 5. Cookie-Banner und Consent

### Cookie-Arten

| Cookie-Typ | Einwilligung nötig? | Beispiel |
|------------|---------------------|----------|
| **Technisch notwendig** | Nein | Session-Cookie, CSRF-Token |
| **Funktional** | Ja | Spracheinstellung speichern |
| **Analyse/Statistik** | Ja | Google Analytics, Matomo |
| **Marketing/Tracking** | Ja | Facebook Pixel, Google Ads |

### Anforderungen an Cookie-Banner

```
Nach DSGVO und ePrivacy-Richtlinie:

✅ VOR dem Setzen von Cookies muss Einwilligung eingeholt werden
✅ Einwilligung muss AKTIV erfolgen (kein Pre-Checked)
✅ Ablehnen muss genauso einfach sein wie Akzeptieren
✅ Nutzer muss wissen, WELCHE Cookies gesetzt werden
✅ Einwilligung muss dokumentiert werden
✅ Nutzer muss Einwilligung jederzeit widerrufen können
```

### Implementierung mit Cookie-Consent-Tools

**Empfohlene Tools (DSGVO-konform):**
```
1. Cookiebot (kostenpflichtig, sehr sicher)
2. Usercentrics (kostenpflichtig, Enterprise)
3. Klaro! (Open Source, kostenlos)
4. Cookie Consent by Osano (Freemium)
```

### Beispiel: Cookie-Banner mit Klaro!

```tsx
// src/components/CookieBanner.tsx
import { useEffect, useState } from 'react';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Immer true, da notwendig
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie_consent');
    if (!savedConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const fullConsent = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem('cookie_consent', JSON.stringify(fullConsent));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
    // Hier Analytics laden etc.
  };

  const acceptNecessary = () => {
    const minimalConsent = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem('cookie_consent', JSON.stringify(minimalConsent));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-50">
      <div className="max-w-4xl mx-auto">
        <h3 className="font-bold mb-2">Cookie-Einstellungen</h3>
        <p className="text-sm mb-4">
          Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung
          auf unserer Website zu bieten. Einige sind notwendig,
          andere helfen uns, die Website zu verbessern.
        </p>
        <div className="flex gap-4">
          <button
            onClick={acceptNecessary}
            className="px-4 py-2 border rounded"
          >
            Nur Notwendige
          </button>
          <button
            onClick={() => {/* Zeige Einstellungen */}}
            className="px-4 py-2 border rounded"
          >
            Einstellungen
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Alle akzeptieren
          </button>
        </div>
        <a href="/datenschutz" className="text-sm text-blue-600 mt-2 block">
          Mehr erfahren in unserer Datenschutzerklärung
        </a>
      </div>
    </div>
  );
}
```

### Cookie-Consent dokumentieren

```typescript
// Consent-Dokumentation für Nachweis
interface ConsentRecord {
  userId?: string;        // Falls eingeloggt
visitorId: string;      // Anonyme ID
  consent: CookieConsent;
  timestamp: string;
  version: string;        // Version der Datenschutzerklärung
  userAgent: string;
  ipHash: string;         // Gehashte IP für Nachweis
}

// Bei Consent speichern (z.B. in DB)
async function recordConsent(consent: CookieConsent) {
  const record: ConsentRecord = {
    visitorId: getOrCreateVisitorId(),
    consent,
    timestamp: new Date().toISOString(),
    version: '2024-01-01',
    userAgent: navigator.userAgent,
    ipHash: await hashIP(), // Serverseitig
  };

  await fetch('/api/consent', {
    method: 'POST',
    body: JSON.stringify(record),
  });
}
```

---

## 6. AGB (Allgemeine Geschäftsbedingungen)

### Warum AGB?

```
AGB sind nicht gesetzlich vorgeschrieben, aber sinnvoll:
- Regeln Rechte und Pflichten zwischen Plattform und Nutzern
- Haftungsbeschränkungen
- Zahlungsbedingungen
- Nutzungsregeln
- Kündigungsrechte
```

### Wichtige Klauseln für unsere Plattform

#### 1. Geltungsbereich
```
Diese AGB gelten für alle Nutzer der Plattform
[Name], betrieben von [Betreiber].
```

#### 2. Registrierung und Nutzerkonto
```
- Mindestalter (18 Jahre für B2B)
- Wahrheitsgemäße Angaben
- Geheimhaltung des Passworts
- Ein Konto pro Person/Firma
```

#### 3. Leistungsbeschreibung
```
- Was bietet die Plattform?
- Keine Garantie für Projektvermittlung
- Vermittlung, nicht Arbeitsvermittlung
```

#### 4. Gebühren und Zahlungsbedingungen
```
- Provisionsmodell erklären
- Zahlungsfristen
- Währung (EUR)
- Mehrwertsteuer
```

#### 5. Pflichten der Freelancer
```
- Wahrheitsgemäße Profilangaben
- Qualifikationen müssen stimmen
- Rechtzeitige Projektabwicklung
- Keine illegalen Angebote
```

#### 6. Pflichten der Auftraggeber
```
- Klare Projektbeschreibung
- Rechtzeitige Zahlung
- Feedback-Pflicht (optional)
```

#### 7. Haftung der Plattform
```
- Keine Haftung für Inhalte der Nutzer
- Keine Haftung für Projektqualität
- Haftung nur bei Vorsatz und grober Fahrlässigkeit
- Haftungshöchstgrenze
```

#### 8. Kündigung
```
- Jederzeitige Kündigung möglich
- Laufende Projekte werden abgeschlossen
- Datenlöschung nach Kündigung
```

#### 9. Streitbeilegung
```
- Schlichtung vor Klage bevorzugt
- Gerichtsstand (für B2B: Sitz des Betreibers)
- OS-Plattform der EU (Link)
```

#### 10. Schlussbestimmungen
```
- Salvatorische Klausel
- Änderungsvorbehalt (mit Ankündigungsfrist!)
- Schriftform
```

### AGB-Änderungen kommunizieren

```typescript
// Bei AGB-Änderung: Nutzer informieren und neue Zustimmung einholen
async function notifyAGBChange() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    // E-Mail senden
    await sendEmail({
      to: user.email,
      subject: 'Aktualisierung unserer AGB',
      body: `
        Liebe(r) ${user.name},

        wir haben unsere AGB aktualisiert. Die Änderungen treten
        am [Datum] in Kraft.

        Die wichtigsten Änderungen:
        - [Änderung 1]
        - [Änderung 2]

        Die vollständigen AGB finden Sie unter: [Link]

        Mit der weiteren Nutzung der Plattform nach dem [Datum]
        stimmen Sie den neuen AGB zu.
      `,
    });

    // In DB markieren
    await prisma.user.update({
      where: { id: user.id },
      data: { agbAcceptedVersion: null }, // Muss neu akzeptieren
    });
  }
}
```

---

## 7. Besondere Anforderungen für Plattformen

### Digital Services Act (DSA)

Seit Februar 2024 gilt der **Digital Services Act** für alle Online-Plattformen in der EU:

```
Anforderungen für uns:
1. Transparenzberichte (ab bestimmter Größe)
2. Meldemechanismus für illegale Inhalte
3. Beschwerdeverfahren für Nutzer
4. Transparenz bei Empfehlungsalgorithmen
5. Verbot von Dark Patterns
```

### Platform-to-Business (P2B) Verordnung

Als Plattform, die Freelancer (Businesses) mit Auftraggebern verbindet:

```
Pflichten nach P2B-Verordnung:
1. Transparente AGB
2. Ranking-Kriterien offenlegen
3. Unterschiedliche Behandlung offenlegen
4. Internes Beschwerdesystem
5. Mediationsverfahren anbieten
```

### Verbot von Dark Patterns

```
Verbotene Praktiken:

❌ Versteckte Kosten
❌ Kündigungen erschweren
❌ Manipulative Cookie-Banner
❌ Falsche Dringlichkeit ("Nur noch 2 Plätze!")
❌ Bestätigungsshaming ("Nein, ich möchte keine Vorteile")
❌ Vorausgewählte Optionen (Pre-Ticked Boxes)
❌ Versteckte Abonnements
```

### Scheinselbständigkeit vermeiden

Als Freelancer-Plattform müssen wir aufpassen:

```
Risiko: Freelancer könnten als scheinselbständig eingestuft werden

Anzeichen für Scheinselbständigkeit:
- Weisungsgebundenheit
- Feste Arbeitszeiten
- Nur ein Auftraggeber
- Einbindung in betriebliche Organisation
- Kein eigenes unternehmerisches Risiko

Unsere Maßnahmen:
✅ Freelancer arbeiten eigenverantwortlich
✅ Keine Vorgaben zu Arbeitszeiten oder -ort
✅ Freelancer können mehrere Auftraggeber haben
✅ Klare Projektverträge (Werkvertrag, nicht Arbeitsvertrag)
✅ Hinweis in AGB und Profil
```

---

## 8. Technische Umsetzung

### Datenschutz by Design (Art. 25 DSGVO)

```typescript
// prisma/schema.prisma - Privacy by Design

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String    // Niemals Klartext!
  name          String?

  // Consent Tracking
  privacyPolicyAccepted     DateTime?
  privacyPolicyVersion      String?
  marketingConsent          Boolean   @default(false)
  marketingConsentDate      DateTime?

  // Datenlöschung
  deletionRequested         DateTime?
  deletedAt                 DateTime?

  // Anonymisierung statt Löschung bei Aufbewahrungspflicht
  anonymizedAt              DateTime?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model ConsentLog {
  id          String   @id @default(cuid())
  userId      String?
  visitorId   String
  consentType String   // 'cookies', 'marketing', 'privacy_policy'
  granted     Boolean
  version     String
  ipHash      String
  userAgent   String
  createdAt   DateTime @default(now())
}
```

### Datenexport implementieren (Art. 20 DSGVO)

```typescript
// src/app/api/user/export/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Alle Nutzerdaten sammeln
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      projects: true,
      bids: true,
      reviews: true,
      messages: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Sensible Daten entfernen
  const exportData = {
    user: {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    profile: user.profile,
    projects: user.projects,
    bids: user.bids,
    reviews: user.reviews,
    // Nachrichten nur eigene
    messages: user.messages.map((m) => ({
      content: m.content,
      createdAt: m.createdAt,
    })),
    exportedAt: new Date().toISOString(),
    format: 'GDPR Data Export v1.0',
  };

  // Als JSON-Download
  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="data-export-${user.id}.json"`,
    },
  });
}
```

### Datenlöschung implementieren (Art. 17 DSGVO)

```typescript
// src/app/api/user/delete/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function DELETE() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  // Prüfen auf Aufbewahrungspflichten
  const hasActiveProjects = await prisma.project.findFirst({
    where: {
      OR: [
        { clientId: userId, status: 'ACTIVE' },
        { freelancerId: userId, status: 'ACTIVE' },
      ],
    },
  });

  if (hasActiveProjects) {
    return NextResponse.json(
      { error: 'Active projects must be completed first' },
      { status: 400 }
    );
  }

  // Prüfen auf Rechnungen (10 Jahre Aufbewahrungspflicht)
  const hasInvoices = await prisma.invoice.findFirst({
    where: { userId },
  });

  if (hasInvoices) {
    // Anonymisieren statt Löschen
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@anonymized.local`,
        name: 'Gelöschter Nutzer',
        passwordHash: '',
        anonymizedAt: new Date(),
        // Profile-Daten löschen
        profile: { delete: true },
      },
    });

    return NextResponse.json({
      message: 'Account anonymized (invoices retained for legal reasons)',
      retentionReason: 'Invoices must be kept for 10 years (§ 14b UStG)',
    });
  }

  // Vollständige Löschung möglich
  await prisma.$transaction([
    prisma.message.deleteMany({ where: { userId } }),
    prisma.review.deleteMany({ where: { authorId: userId } }),
    prisma.bid.deleteMany({ where: { freelancerId: userId } }),
    prisma.project.deleteMany({ where: { clientId: userId } }),
    prisma.profile.delete({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  return NextResponse.json({ message: 'Account fully deleted' });
}
```

### Logging ohne personenbezogene Daten

```typescript
// src/lib/logger.ts
import pino from 'pino';

// IP-Adressen hashen
function hashIP(ip: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT).digest('hex').slice(0, 16);
}

// Sensible Daten aus Logs entfernen
function sanitizeForLog(obj: any): any {
  const sensitive = ['password', 'token', 'secret', 'email', 'ip'];
  const sanitized = { ...obj };

  for (const key of Object.keys(sanitized)) {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
}

export const logger = pino({
  hooks: {
    logMethod(inputArgs, method) {
      if (inputArgs.length > 0 && typeof inputArgs[0] === 'object') {
        inputArgs[0] = sanitizeForLog(inputArgs[0]);
      }
      return method.apply(this, inputArgs);
    },
  },
});
```

---

## 9. Checkliste für unsere Plattform

### Vor dem Launch

```
Rechtliche Dokumente:
☐ Impressum erstellt und verlinkt
☐ Datenschutzerklärung erstellt und verlinkt
☐ AGB erstellt und bei Registrierung akzeptiert
☐ Cookie-Banner implementiert
☐ Newsletter mit Double-Opt-In

Technische Maßnahmen:
☐ HTTPS überall (SSL-Zertifikat)
☐ Passwörter gehasht (bcrypt)
☐ Datenexport-Funktion
☐ Datenlöschungs-Funktion
☐ Consent-Logging implementiert
☐ Security Headers gesetzt

Verträge:
☐ AWS DPA akzeptiert
☐ Stripe DPA akzeptiert (falls Zahlungen)
☐ Alle Drittanbieter-DPAs geprüft

Prozesse:
☐ Prozess für Auskunftsanfragen definiert
☐ Prozess für Löschanfragen definiert
☐ Datenschutz-Kontakt eingerichtet
☐ Datenpanne-Meldeprozess (72h an Aufsichtsbehörde!)
```

### Nach dem Launch

```
Regelmäßig:
☐ Cookie-Liste aktuell halten
☐ Drittanbieter-Liste aktuell halten
☐ Datenschutzerklärung bei Änderungen aktualisieren
☐ AGB bei Änderungen aktualisieren (mit Ankündigung!)
☐ Security-Updates einspielen
☐ Zugriffsrechte prüfen

Bei Vorfällen:
☐ Datenpanne: Innerhalb 72h an Aufsichtsbehörde melden
☐ Bei hohem Risiko: Betroffene informieren
☐ Dokumentation des Vorfalls
```

---

## 10. Wichtige Begriffe

| Begriff | Erklärung |
|---------|-----------|
| **DSGVO** | Datenschutz-Grundverordnung (EU-weit gültig seit 2018) |
| **Personenbezogene Daten** | Alle Daten, die sich auf eine identifizierbare Person beziehen |
| **Verarbeitung** | Jeder Vorgang mit Daten (Speichern, Lesen, Ändern, Löschen) |
| **Verantwortlicher** | Wer über Zweck und Mittel der Verarbeitung entscheidet (wir) |
| **Auftragsverarbeiter** | Wer Daten im Auftrag verarbeitet (z.B. AWS) |
| **AVV** | Auftragsverarbeitungsvertrag |
| **DPA** | Data Processing Agreement/Addendum (englisch für AVV) |
| **Einwilligung** | Freiwillige, informierte Zustimmung zur Datenverarbeitung |
| **Berechtigtes Interesse** | Rechtsgrundlage, wenn Interesse des Verantwortlichen überwiegt |
| **TMG** | Telemediengesetz (regelt Impressumspflicht) |
| **TTDSG** | Telekommunikation-Telemedien-Datenschutz-Gesetz (Cookie-Gesetz) |
| **DSA** | Digital Services Act (EU-Verordnung für Online-Plattformen) |
| **P2B** | Platform-to-Business Verordnung |

---

## Ressourcen

### Offizielle Quellen
- [DSGVO Volltext](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32016R0679)
- [Landesdatenschutzbeauftragte](https://www.datenschutzkonferenz-online.de/)
- [BSI IT-Grundschutz](https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Standards-und-Zertifizierung/IT-Grundschutz/it-grundschutz_node.html)

### Generatoren und Tools
- [e-recht24.de Impressum-Generator](https://www.e-recht24.de/impressum-generator.html)
- [Datenschutz-Generator.de](https://datenschutz-generator.de/)
- [Cookiebot](https://www.cookiebot.com/de/)

### Wichtige Aufsichtsbehörden
- **Bayern:** Bayerisches Landesamt für Datenschutzaufsicht
- **NRW:** Landesbeauftragte für Datenschutz NRW
- **Bundesebene:** Der Bundesbeauftragte für den Datenschutz (BfDI)

---

**Hinweis:** Diese Dokumentation ersetzt keine rechtliche Beratung. Für die finale Umsetzung sollte ein Anwalt für IT-Recht konsultiert werden.
