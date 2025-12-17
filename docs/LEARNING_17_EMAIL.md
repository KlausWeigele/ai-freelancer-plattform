# Learning 17: E-Mail-Infrastruktur

**Erstellt:** 2025-12-17
**Kontext:** AI-Freelancer-Plattform - E-Mail-Versand verstehen

---

## Inhaltsverzeichnis

1. [Wie E-Mail funktioniert](#1-wie-e-mail-funktioniert)
2. [E-Mail-Protokolle](#2-e-mail-protokolle)
3. [DNS Records für E-Mail](#3-dns-records-für-e-mail)
4. [E-Mail-Authentifizierung](#4-e-mail-authentifizierung)
5. [Transactional vs. Marketing E-Mails](#5-transactional-vs-marketing-e-mails)
6. [E-Mail-Dienste](#6-e-mail-dienste)
7. [Deliverability](#7-deliverability)
8. [E-Mail in Code](#8-e-mail-in-code)
9. [Spam-Vermeidung](#9-spam-vermeidung)
10. [Best Practices](#10-best-practices)

---

## 1. Wie E-Mail funktioniert

### Der E-Mail-Weg

```
Klaus schreibt E-Mail an Anna:

1. Klaus tippt E-Mail in Client (Gmail, Outlook)
   ↓
2. Client sendet an Postausgangsserver (SMTP)
   klaus@weigele.art → smtp.weigele.art
   ↓
3. SMTP-Server sucht Ziel via DNS
   "Wo ist der Mailserver für anna@example.com?"
   DNS MX-Record: mail.example.com
   ↓
4. SMTP-Server sendet an Ziel-Mailserver
   smtp.weigele.art → mail.example.com
   ↓
5. Ziel-Mailserver speichert E-Mail
   ↓
6. Anna ruft E-Mail ab (IMAP/POP3)
   mail.example.com → Annas Client
```

### E-Mail-Komponenten

```
MUA (Mail User Agent):
└── E-Mail Client (Outlook, Gmail, Thunderbird)

MTA (Mail Transfer Agent):
└── Sendet E-Mails zwischen Servern (Postfix, Sendmail)

MDA (Mail Delivery Agent):
└── Stellt E-Mail in Mailbox zu (Dovecot)

MSA (Mail Submission Agent):
└── Nimmt E-Mails vom Client entgegen
```

### E-Mail-Header

```
From: Klaus Weigele <klaus@weigele.art>
To: Anna Schmidt <anna@example.com>
Subject: Projektanfrage
Date: Tue, 17 Dec 2024 10:30:00 +0100
Message-ID: <abc123@weigele.art>
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

Hallo Anna,

hier ist meine Nachricht...
```

### Versteckte Header

```
Received: from smtp.weigele.art (52.28.45.123)
        by mail.example.com (10.0.0.5)
        Tue, 17 Dec 2024 10:30:05 +0100
X-Spam-Score: 0.1
X-Spam-Status: No
Authentication-Results: mail.example.com;
        spf=pass smtp.mailfrom=weigele.art;
        dkim=pass header.d=weigele.art;
        dmarc=pass
```

---

## 2. E-Mail-Protokolle

### SMTP (Simple Mail Transfer Protocol)

```
Port 25:   Server-zu-Server (oft blockiert)
Port 587:  Client-zu-Server (Submission, empfohlen)
Port 465:  SMTPS (SSL/TLS von Anfang an)

SMTP ist NUR zum SENDEN!
```

### SMTP-Dialog

```
Client: EHLO mail.weigele.art
Server: 250-mail.example.com Hello
        250-STARTTLS
        250 OK

Client: STARTTLS
Server: 220 Ready for TLS

[TLS-Handshake]

Client: AUTH LOGIN
Server: 334 VXNlcm5hbWU6
Client: a2xhdXNAd2VpZ2VsZS5hcnQ=  (base64: klaus@weigele.art)
Server: 334 UGFzc3dvcmQ6
Client: cGFzc3dvcmQxMjM=  (base64: password123)
Server: 235 Authentication successful

Client: MAIL FROM:<klaus@weigele.art>
Server: 250 OK

Client: RCPT TO:<anna@example.com>
Server: 250 OK

Client: DATA
Server: 354 Start mail input

Client: Subject: Test
        From: klaus@weigele.art
        To: anna@example.com

        Hello World!
        .
Server: 250 OK: Message queued

Client: QUIT
Server: 221 Bye
```

### IMAP (Internet Message Access Protocol)

```
Port 143:  Unverschlüsselt (veraltet)
Port 993:  IMAPS (SSL/TLS)

IMAP ist zum ABRUFEN (E-Mails bleiben auf Server)
```

```
IMAP Features:
├── E-Mails bleiben auf Server
├── Mehrere Geräte synchronisiert
├── Ordner-Struktur
├── Teilweises Laden (nur Header)
└── Serverseitige Suche
```

### POP3 (Post Office Protocol)

```
Port 110:  Unverschlüsselt (veraltet)
Port 995:  POP3S (SSL/TLS)

POP3 ist zum HERUNTERLADEN (E-Mails werden gelöscht)
```

```
POP3 vs. IMAP:
POP3: Download → Löschen auf Server → Ein Gerät
IMAP: Sync → Server behält → Mehrere Geräte
```

---

## 3. DNS Records für E-Mail

### MX Record (Mail Exchanger)

```
Welcher Server empfängt E-Mails für diese Domain?

weigele.art.    MX    10 mail1.weigele.art.
weigele.art.    MX    20 mail2.weigele.art.
                 ↑
            Priorität (niedriger = bevorzugt)
```

### A/AAAA Record für Mailserver

```
mail1.weigele.art.    A       52.28.45.123
mail2.weigele.art.    A       52.28.45.124
mail1.weigele.art.    AAAA    2001:db8::1
```

### Reverse DNS (PTR Record)

```
IP-Adresse → Hostname

52.28.45.123 → mail1.weigele.art

Wichtig für Spam-Prüfung!
Ohne PTR: Oft als Spam markiert
```

### DNS-Abfrage

```bash
# MX Records abfragen
dig weigele.art MX

# Antwort:
weigele.art.    300    IN    MX    10 mail.weigele.art.
```

---

## 4. E-Mail-Authentifizierung

### Warum wichtig?

```
Ohne Authentifizierung:
- Jeder kann E-Mails "von" deiner Domain senden
- Phishing-Angriffe möglich
- Spam von deiner Domain
- Schlechte Reputation

Mit Authentifizierung:
- Nur autorisierte Server senden
- Empfänger kann Echtheit prüfen
- Bessere Zustellrate
```

### SPF (Sender Policy Framework)

```
"Welche Server dürfen E-Mails für meine Domain senden?"

DNS TXT Record:
weigele.art.  TXT  "v=spf1 include:_spf.google.com include:amazonses.com ~all"
```

```
SPF Syntax:
v=spf1              - Version
ip4:52.28.45.123    - Diese IP erlaubt
ip6:2001:db8::1     - Diese IPv6 erlaubt
include:domain.com  - SPF von anderer Domain einbinden
a                   - A-Record der Domain erlaubt
mx                  - MX-Server erlaubt
~all                - Soft Fail (nicht autorisiert, aber akzeptieren)
-all                - Hard Fail (ablehnen)
```

### DKIM (DomainKeys Identified Mail)

```
"Diese E-Mail wurde wirklich von uns gesendet und nicht verändert."

1. Server signiert E-Mail mit privatem Schlüssel
2. Öffentlicher Schlüssel in DNS
3. Empfänger prüft Signatur
```

```
DNS TXT Record:
selector._domainkey.weigele.art.  TXT  "v=DKIM1; k=rsa; p=MIGfMA0GCS..."
```

```
E-Mail Header:
DKIM-Signature: v=1; a=rsa-sha256; d=weigele.art; s=selector;
        h=from:to:subject:date;
        bh=abc123...;
        b=xyz789...
```

### DMARC (Domain-based Message Authentication)

```
"Was soll passieren, wenn SPF oder DKIM fehlschlagen?"

DNS TXT Record:
_dmarc.weigele.art.  TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc@weigele.art"
```

```
DMARC Policy:
p=none        - Nur beobachten (Reports bekommen)
p=quarantine  - In Spam-Ordner verschieben
p=reject      - Ablehnen

rua=          - Reports an diese Adresse
ruf=          - Forensic Reports
pct=100       - Prozent der E-Mails prüfen
```

### Zusammenspiel

```
E-Mail kommt an:

1. SPF Check
   "Darf dieser Server für weigele.art senden?"
   ↓ Pass/Fail

2. DKIM Check
   "Ist die Signatur gültig?"
   ↓ Pass/Fail

3. DMARC Check
   "Was sagt die Policy?"
   ↓ SPF oder DKIM muss passen

4. Entscheidung
   Pass → Inbox
   Fail + p=quarantine → Spam
   Fail + p=reject → Abgelehnt
```

---

## 5. Transactional vs. Marketing E-Mails

### Transactional E-Mails

```
Ausgelöst durch Nutzeraktion:

├── Willkommens-E-Mail (nach Registrierung)
├── Passwort zurücksetzen
├── E-Mail-Verifizierung
├── Bestellbestätigung
├── Versandbenachrichtigung
├── Rechnungen
└── Account-Warnungen

Eigenschaften:
- 1:1 (ein Empfänger)
- Erwartet vom Nutzer
- Zeitkritisch
- Kein Opt-out nötig (aber Link sollte da sein)
```

### Marketing E-Mails

```
Geplante Kampagnen:

├── Newsletter
├── Produktankündigungen
├── Promotions/Rabatte
├── Re-Engagement
└── Event-Einladungen

Eigenschaften:
- 1:N (viele Empfänger)
- Opt-in erforderlich (DSGVO!)
- Opt-out/Unsubscribe Pflicht
- Weniger zeitkritisch
```

### Für unsere Plattform

```
Transactional:
├── Willkommen bei AI-Freelancer-Plattform
├── E-Mail bestätigen
├── Passwort zurücksetzen
├── Neues Projekt-Match gefunden
├── Buchungsbestätigung
├── Projekt abgeschlossen
├── Rechnung verfügbar
└── Neue Nachricht von [Firma]

Marketing (optional, mit Opt-in):
├── Wöchentliche Projekt-Übersicht
├── Tipps für Freelancer
└── Plattform-Updates
```

---

## 6. E-Mail-Dienste

### AWS SES (Simple Email Service)

```
Vorteile:
├── Sehr günstig ($0.10 / 1000 E-Mails)
├── AWS-Integration
├── Hohe Zustellrate
├── API + SMTP
└── Bounce/Complaint Handling

Setup:
1. Domain verifizieren (DNS Records)
2. Aus Sandbox beantragen
3. SPF/DKIM konfigurieren
4. API oder SMTP nutzen
```

### SendGrid

```
Vorteile:
├── Einfaches Setup
├── Gute Dokumentation
├── Templates
├── Analytics
└── Free Tier (100/Tag)

Preise:
Free: 100/Tag
Essentials: $20/Monat (50k)
Pro: $90/Monat (100k)
```

### Andere Dienste

```
Mailgun    - Developer-freundlich
Postmark   - Fokus auf Transactional
Resend     - Modern, React Email
Mailchimp  - Marketing fokussiert
```

### Vergleich für uns

| Dienst | Preis (10k/Monat) | Für uns |
|--------|-------------------|---------|
| AWS SES | ~$1 | ✅ Bereits AWS |
| SendGrid | $0 (Free Tier) | ✅ Einfach |
| Postmark | $15 | Gut |
| Resend | $0 (Free Tier) | ✅ Modern |

---

## 7. Deliverability

### Was ist Deliverability?

```
Deliverability = Prozent der E-Mails, die ankommen

Inbox Placement Rate:
- Inbox: E-Mail kommt an ✅
- Spam: E-Mail im Spam-Ordner ⚠️
- Bounce: E-Mail abgelehnt ❌
- Dropped: Nie gesendet ❌

Ziel: >95% Inbox Placement
```

### Bounce-Typen

```
Hard Bounce (permanent):
├── E-Mail existiert nicht
├── Domain existiert nicht
└── Server lehnt ab

→ Sofort aus Liste entfernen!

Soft Bounce (temporär):
├── Postfach voll
├── Server nicht erreichbar
├── E-Mail zu groß
└── Temporäre Probleme

→ Später erneut versuchen (max. 3x)
```

### Sender Reputation

```
ISPs (Gmail, Outlook, etc.) bewerten Absender:

Faktoren:
├── Bounce Rate (sollte <2%)
├── Spam Complaints (<0.1%)
├── Engagement (Öffnungen, Klicks)
├── List Quality (echte Adressen)
├── Authentication (SPF, DKIM, DMARC)
└── Sending Patterns (konsistent)

Tools:
├── Google Postmaster Tools
├── Microsoft SNDS
└── SenderScore.org
```

### Warm-up

```
Neue Domain/IP muss "aufgewärmt" werden:

Tag 1-3:   50 E-Mails/Tag
Tag 4-7:   100 E-Mails/Tag
Tag 8-14:  500 E-Mails/Tag
Tag 15-30: 2000 E-Mails/Tag
...

Langsam steigern, Reputation aufbauen!
```

---

## 8. E-Mail in Code

### Mit Resend (empfohlen für Next.js)

```typescript
// src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) {
  const { data, error } = await resend.emails.send({
    from: 'AI-Freelancer <noreply@weigele.art>',
    to: [to],
    subject: 'Willkommen bei AI-Freelancer-Plattform!',
    html: `
      <h1>Hallo ${name}!</h1>
      <p>Willkommen auf unserer Plattform.</p>
      <p>
        <a href="https://weigele.art/verify?token=...">
          E-Mail bestätigen
        </a>
      </p>
    `,
  });

  if (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }

  return data;
}
```

### Mit Nodemailer + SMTP

```typescript
// src/lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  const info = await transporter.sendMail({
    from: '"AI-Freelancer" <noreply@weigele.art>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  console.log('Message sent:', info.messageId);
  return info;
}
```

### Mit AWS SES

```typescript
// src/lib/email.ts
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'eu-central-1' });

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  const command = new SendEmailCommand({
    Source: 'noreply@weigele.art',
    Destination: {
      ToAddresses: [options.to],
    },
    Message: {
      Subject: { Data: options.subject },
      Body: {
        Html: { Data: options.html },
      },
    },
  });

  const response = await ses.send(command);
  return response;
}
```

### React Email Templates

```typescript
// emails/WelcomeEmail.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  verifyUrl: string;
}

export function WelcomeEmail({ name, verifyUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Willkommen bei AI-Freelancer-Plattform</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            Hallo {name}!
          </Heading>
          <Text style={styles.text}>
            Willkommen auf unserer Plattform für AI & IT Freelancer.
          </Text>
          <Link href={verifyUrl} style={styles.button}>
            E-Mail bestätigen
          </Link>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' },
  container: { padding: '40px', maxWidth: '600px', margin: '0 auto' },
  heading: { color: '#1a1a1a', fontSize: '24px' },
  text: { color: '#4a4a4a', fontSize: '16px', lineHeight: '24px' },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '12px 24px',
    borderRadius: '6px',
    textDecoration: 'none',
    display: 'inline-block',
  },
};
```

---

## 9. Spam-Vermeidung

### Technische Maßnahmen

```
✅ Muss haben:
├── SPF Record konfiguriert
├── DKIM signiert
├── DMARC Policy gesetzt
├── Reverse DNS (PTR) korrekt
├── TLS für SMTP
└── Gültige From-Adresse

✅ Sollte haben:
├── Dedicated IP (bei hohem Volumen)
├── Feedback Loops eingerichtet
└── Bounce Handling automatisiert
```

### Inhaltliche Maßnahmen

```
✅ Best Practices:
├── Klarer, ehrlicher Betreff
├── Keine GROSSBUCHSTABEN
├── Wenig Ausrufezeichen!!!
├── Balance Text/Bilder
├── Unsubscribe-Link
├── Physische Adresse (rechtlich)
└── Relevanter Inhalt

❌ Vermeiden:
├── "GRATIS!!!", "Gewonnen!!!"
├── Nur Bilder, kein Text
├── Verdächtige Links
├── Zu viele Links
├── Versteckte Texte
└── Gekaufte E-Mail-Listen
```

### Spam-Score testen

```
Tools:
├── mail-tester.com (kostenlos, 3/Tag)
├── glockapps.com
└── litmus.com

Ziel: Score 9-10/10
```

---

## 10. Best Practices

### Für unsere Plattform

```
E-Mail-Typen implementieren:

1. Verifizierung (Pflicht)
   ├── Nach Registrierung
   ├── Token mit Ablauf (24h)
   └── Nur 1x verwendbar

2. Passwort Reset (Pflicht)
   ├── Auf Anfrage
   ├── Token mit Ablauf (1h)
   └── IP-Logging

3. Benachrichtigungen (Optional, Einstellbar)
   ├── Neues Projekt-Match
   ├── Neue Nachricht
   └── Buchungsstatus-Änderung
```

### Double Opt-In

```
DSGVO-konform für Marketing:

1. User trägt E-Mail ein
2. Bestätigungs-E-Mail senden
3. User klickt Bestätigungslink
4. Erst dann: In Liste aufnehmen

Wichtig: Consent dokumentieren (Timestamp, IP)
```

### Unsubscribe

```
Jede E-Mail braucht:

1. Unsubscribe-Link (sichtbar)
2. List-Unsubscribe Header

List-Unsubscribe: <mailto:unsubscribe@weigele.art>,
                  <https://weigele.art/unsubscribe?token=abc>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

### Checkliste

```
Setup:
☐ Domain verifiziert
☐ SPF Record gesetzt
☐ DKIM konfiguriert
☐ DMARC Policy aktiv
☐ Reverse DNS korrekt

Code:
☐ E-Mail-Service integriert
☐ Templates erstellt
☐ Error Handling
☐ Logging für Debugging

Compliance:
☐ Unsubscribe-Link
☐ Double Opt-In für Marketing
☐ Consent dokumentiert
☐ Physische Adresse in E-Mail
```

---

## DNS Records Beispiel

```
# MX Record
weigele.art.    MX    10 inbound-smtp.eu-central-1.amazonaws.com.

# SPF
weigele.art.    TXT   "v=spf1 include:amazonses.com ~all"

# DKIM (von SES generiert)
xxxxxxxxx._domainkey.weigele.art.    CNAME    xxxxxxxxx.dkim.amazonses.com.

# DMARC
_dmarc.weigele.art.    TXT    "v=DMARC1; p=quarantine; rua=mailto:dmarc@weigele.art"
```

---

## Ressourcen

- [SPF Record Syntax](https://www.spf-record.de/)
- [DKIM Validator](https://dkimvalidator.com/)
- [DMARC Analyzer](https://dmarcanalyzer.com/)
- [Mail Tester](https://www.mail-tester.com/)
- [React Email](https://react.email/)
- [AWS SES Docs](https://docs.aws.amazon.com/ses/)
