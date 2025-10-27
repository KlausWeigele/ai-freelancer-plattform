# Product Requirements Document (PRD)
# AI-Freelancer-Plattform Deutschland

**Version:** 1.0
**Datum:** 27. Oktober 2025
**Status:** Draft → Ready for Architecture
**Modus:** MVP (Lean PRD)

---

## Document History

| Version | Datum | Autor | Änderungen |
|---------|-------|-------|------------|
| 1.0 | 2025-10-27 | Gründer | Initial PRD (MVP-Scope) |

---

## 1. Product Overview

### 1.1 Product Name
**[TBD]** - AI-Freelancer-Plattform für Deutschland

**Naming-Optionen:**
- AI-Match.de
- ExpertFlow.de
- TalentForge.de
- KI-Talente.de

**Entscheidung:** Nach Phase 3 (Architektur) - Domain-Check durchführen

---

### 1.2 Product Vision

> **"Die fairste und intelligenteste Plattform für KI-Talente in Deutschland."**

Eine Premium-Freelancer-Börse, die KI-Experten und Firmen durch AI-powered Matching zusammenbringt, mit revolutionär fairer Provision (2%) und Flexibilität, die keine andere Plattform bietet.

---

### 1.3 Product Mission

**Problem:**
- Firmen finden keine qualifizierten KI-Experten (149.000 offene IT-Stellen)
- Freelancer verlieren 10-16% an Provisionen
- Keine deutsche Plattform hat KI-Spezialisierung oder AI-Features

**Lösung:**
Premium AI-Talent-Plattform mit:
- 2% Provision (statt 10-16%)
- AI-gestütztem Matching, Project Building, Career Coaching
- 3-Tier-System (Apprentice → Intermediate → Expert)
- Trial Period (1 Woche, jederzeit abbrechbar)
- Flexiblen Vertragsmodellen (Milestone/Sprint/Retainer/T&M)

---

### 1.4 Target Release

**MVP Launch:** Monat 4 (nach 3 Monaten Development)
- Beta (Private): Monat 4, Woche 1-2
- Public Launch: Monat 5

**V1.0:** Monat 6-12
- Alle Core Features stabil
- AI-Features produktiv
- 100 Projekte durchgeführt

---

### 1.5 Product Goals

1. **Product-Market Fit erreichen** (Monat 1-6)
   - 50 kuratierte Freelancer (Top 10% KI-Experten)
   - 30 aktive Firmen
   - 30 erfolgreiche Projekte
   - >80% Trial-to-Project Conversion

2. **Skalierung beginnen** (Monat 7-12)
   - 100 kuratierte Freelancer
   - 50 aktive Firmen
   - 100 Projekte
   - 1 Mio. € Projektvolumen

3. **Revenue Milestone** (Jahr 1)
   - 100.000€ Umsatz (entspricht 5 Mio. € Projektvolumen)
   - Break-even erreicht
   - Positive Unit Economics

4. **Quality Metrics** (kontinuierlich)
   - >90% Projekterfolgsrate
   - >85% AI-Match-Accuracy
   - NPS >50 (Freelancer & Firmen)
   - <48h Time-to-Match

5. **Marktposition** (Ende Jahr 1)
   - #1 KI-Freelancer-Plattform in Deutschland
   - Bekannt in AI-Community (Berlin, München, Hamburg)
   - 3+ Press Features (Heise, t3n, Gründerszene)

---

## 2. User Personas & Use Cases

### 2.1 Freelancer Personas

#### Persona F1: Senior AI Expert (Max, 36)

**Profil:**
- 10+ Jahre Software-Entwicklung
- 4 Jahre AI/ML-Erfahrung
- Skills: LangChain, Vector DBs, RAG, Fine-tuning, Python, FastAPI
- Rate: 1.000-1.200€/Tag
- Location: Berlin, arbeitet remote

**Motivations:**
- Faire Provision (2% vs. 10-16%)
- Hochwertige Projekte (keine Low-Quality-Anfragen)
- Flexible Verträge (keine festen 12-Monats-Commitments)
- Transparenz (klare Requirements, faire Firmen)

**Pain Points:**
- freelance.de: Zu viele unpassende Anfragen, 10% Provision
- Toptal: 30-50% Provision (versteckt)
- LinkedIn: Zeit-intensiv, viel Spam

**Use Cases:**
1. **UC-F1-1:** Findet passendes KI-Projekt in 48h
2. **UC-F1-2:** Verhandelt flexible Verträge (Milestone-based)
3. **UC-F1-3:** Arbeitet an 2-3 Projekten parallel (Retainer)
4. **UC-F1-4:** Zahlt nur 2% Provision

---

#### Persona F2: Junior AI Enthusiast (Timo, 28)

**Profil:**
- 3 Jahre Backend-Entwicklung (Python, Node.js)
- KEINE AI-Projekt-Erfahrung (nur Kurse)
- Skills: Python, APIs, Datenbanken, hat LLM-Kurse gemacht
- Rate: 400-500€/Tag (Apprentice-Level)
- Location: München, remote bevorzugt

**Motivations:**
- In AI-Feld einsteigen (Learning on the Job)
- Portfolio aufbauen (echte Projekte)
- Karriere-Pfad (Apprentice → Expert)
- AI Career Coach nutzen (strategische Weiterentwicklung)

**Pain Points:**
- Seniors verdrängen ihn (kann nicht mit 1.000€/Tag konkurrieren)
- Niemand gibt Chance ohne Erfahrung
- Weiß nicht, welche Skills er lernen soll

**Use Cases:**
1. **UC-F2-1:** Startet als Apprentice mit 400€/Tag
2. **UC-F2-2:** Arbeitet an einfachem AI-Projekt (Learning on the Job)
3. **UC-F2-3:** Nutzt AI Career Coach für Skill-Empfehlungen
4. **UC-F2-4:** Upgraded nach 3 Projekten zu Intermediate (600€/Tag)

---

#### Persona F3: Mid-Level ML Engineer (Sarah, 31)

**Profil:**
- 6 Jahre Software-Entwicklung
- 2 Jahre ML/Data Science (klassisches ML, scikit-learn)
- Will GenAI/LLM lernen (Trend)
- Rate: 650-800€/Tag (Intermediate-Level)
- Location: Hamburg, hybrid

**Motivations:**
- Weiterentwicklung in GenAI/LLM
- Höhere Tagessätze erreichen (900-1.000€)
- AI Career Coach für strategische Planung
- Spannende AI-Projekte

**Pain Points:**
- Weiß nicht, welche Skills sie priorisieren soll (LangChain? RAG? Vector DBs?)
- Klassisches ML wird weniger nachgefragt
- Will nicht zurückfallen

**Use Cases:**
1. **UC-F3-1:** Nimmt GenAI-Projekte an (lernt LangChain on the Job)
2. **UC-F3-2:** AI Career Coach zeigt Markt-Trends (LangChain +689%)
3. **UC-F3-3:** Steigt von 650€ auf 900€/Tag (nach Skill-Upgrade)
4. **UC-F3-4:** Nutzt flexible Verträge (Sprint-based)

---

### 2.2 Firmen Personas

#### Persona C1: Startup CTO (Lisa, 29)

**Profil:**
- Frühes Startup, 5 Mitarbeiter, Series A (2 Mio. €)
- Braucht AI-Integration (Chatbot, RAG)
- Budget: 20-40k€ pro AI-Projekt
- Location: Berlin

**Motivations:**
- Schnell AI-Expertise zukaufen (nicht 3 Monate warten)
- Budget schonen (2% vs. 10-16%)
- Trial Period nutzen (Risiko minimieren)
- Junior + Senior kombinieren (Kosten senken)

**Pain Points:**
- Toptal zu teuer (30-50% Markup)
- Upwork zu viel Schrott (Qualität unsicher)
- Interne Hiring dauert zu lange
- Kein Budget für Full-Time Senior

**Use Cases:**
1. **UC-C1-1:** Erstellt Projekt mit AI Project Builder (perfekte Beschreibung)
2. **UC-C1-2:** Bekommt in 48h 3 Freelancer-Vorschläge (AI-gematched)
3. **UC-C1-3:** Startet 1-Woche-Trial mit Senior (testet Qualität)
4. **UC-C1-4:** Bucht Milestone-based (zahlt nur für Deliverables)
5. **UC-C1-5:** Kombiniert Senior (15 Tage) + Junior (10 Tage) → spart 5.000€

---

#### Persona C2: Enterprise AI Lead (Thomas, 42)

**Profil:**
- Konzern, 5.000+ Mitarbeiter
- AI-Transformation verantwortlich
- Budget: 100-300k€ pro Pilotprojekt
- Location: Frankfurt

**Motivations:**
- Teams schnell skalieren (mal 3, mal 10 Freelancer)
- Kuratierte Qualität (Top 10%)
- AI Team Assembly (komplexe Projekte)
- Schnelligkeit (48h statt 3 Monate)

**Pain Points:**
- Interne Hiring dauert Monate (Compliance, HR-Prozesse)
- Externe Consultancies zu teuer (McKinsey, BCG)
- Braucht flexible Kapazität (Pilot-Phase unklar)
- Qualität kritisch (kann sich Fails nicht leisten)

**Use Cases:**
1. **UC-C2-1:** Erstellt komplexes Projekt (AI-Chatbot + RAG + Frontend)
2. **UC-C2-2:** AI Team Assembly schlägt 3er-Team vor (LLM Engineer + Backend + Frontend)
3. **UC-C2-3:** Bucht Team für Pilotprojekt (3 Monate)
4. **UC-C2-4:** Skaliert auf 2 Teams (Erfolg im Pilot)
5. **UC-C2-5:** Nutzt Sprint-based (alle 2 Wochen Review)

---

#### Persona C3: Agentur-Inhaber (Michael, 39)

**Profil:**
- Software-Agentur, 12 Mitarbeiter
- Kunden fragen nach AI, Team hat keine Expertise
- Budget: 10-30k€ (White-Label für Kunden)
- Location: München

**Motivations:**
- Schnell AI-Kapazität zukaufen (für Kundenprojekte)
- Apprentice-Freelancer für einfache Tasks (günstig)
- Trial Period nutzen (will Qualität prüfen)
- Flexible Verträge (mal 2 Wochen, mal 3 Monate)

**Pain Points:**
- Kann nicht permanent 1.000€/Tag Seniors leisten
- Braucht verschiedene Skill-Levels (Junior für Prompt Engineering, Senior für Architektur)
- Will AI-Skills intern aufbauen (Team lernt mit)

**Use Cases:**
1. **UC-C3-1:** Bucht Apprentice (400€/Tag) für Prompt Engineering
2. **UC-C3-2:** Bucht Expert (1.000€/Tag) für 3 Tage Architektur-Beratung
3. **UC-C3-3:** Nutzt Trial Period (testet Qualität vor Commitment)
4. **UC-C3-4:** Flexible Verträge (2 Wochen, dann Stop/Extend)

---

## 3. Feature Definition (MVP Scope)

### 3.1 MVP Features (Must-Have, P0)

#### F1: User Authentication & Profile Management

**Category:** Core (P0)
**For:** Freelancer + Firmen
**Description:** User können Accounts erstellen, sich anmelden, Profile verwalten

**Business Value:**
- Grundvoraussetzung für personalisierte Plattform
- Kuratierung möglich (Freelancer-Vetting)
- Sicherheit (Datenschutz, DSGVO)

**MVP Scope:**
- Registrierung (Email + Password)
- Login/Logout
- Email-Verification
- Passwort-Reset
- Profile (Basic: Name, Skills, Rate, Location)

**Complexity:** Medium
**Priority:** P0 (Critical)
**Dependencies:** None

---

#### F2: Freelancer-Profile (Kuratiert)

**Category:** Core (P0)
**For:** Freelancer
**Description:** Freelancer können detaillierte Profile erstellen (Skills, Erfahrung, Portfolio, Rate)

**Business Value:**
- Basis für AI-Matching
- Qualitätssicherung durch Vetting
- Differenzierung (kuratiert vs. Open-Marketplace)

**MVP Scope:**
- Basic Info (Name, Location, Bio)
- Skills (Tags: LangChain, RAG, Python, etc.)
- Erfahrungs-Level (Apprentice/Intermediate/Expert)
- Tagessatz (€/Tag)
- Verfügbarkeit (ab wann, Tage/Woche)
- Portfolio (GitHub-Link, Projekte-Beschreibung)
- **KEIN:** File-Uploads (später), Zertifikate, detaillierte CV

**Vetting-Prozess (Manual für MVP):**
- Admin reviewed alle Profile manuell
- Checks: Portfolio, Skills, References
- Accept/Reject (nur Top 10%)

**Complexity:** Medium
**Priority:** P0
**Dependencies:** F1 (Auth)

---

#### F3: Firmen-Profile

**Category:** Core (P0)
**For:** Firmen
**Description:** Firmen können Company-Profile erstellen

**Business Value:**
- Trust (Freelancer sehen, wer Firma ist)
- Compliance (Handelsregister-Check später)

**MVP Scope:**
- Basic Info (Firmenname, Location, Website)
- Beschreibung (Was macht die Firma?)
- Firmengröße (1-10, 11-50, 51-200, 201-1000, 1000+)
- **KEIN:** Logo-Upload (später), Handelsregister-Verification

**Complexity:** Low
**Priority:** P0
**Dependencies:** F1 (Auth)

---

#### F4: Projekt erstellen (Basic)

**Category:** Core (P0)
**For:** Firmen
**Description:** Firmen können Projekte posten

**Business Value:**
- Core Value Proposition (Firmen finden Freelancer)
- Basis für Matching

**MVP Scope:**
- Projektname
- Beschreibung (Freitext)
- Benötigte Skills (Tags)
- Budget (Range: 10-20k, 20-50k, 50-100k, 100k+)
- Dauer (geschätzt: 1-2 Wochen, 2-4 Wochen, 1-3 Monate, 3-6 Monate, 6+ Monate)
- Start-Datum (ab wann?)
- Remote/Vor Ort/Hybrid
- Vertragsmodell (Milestone/Sprint/Retainer/Time&Material)

**KEIN (für später):**
- AI Project Builder (V1.0)
- File-Uploads (später)
- Detaillierte Milestones (später)

**Complexity:** Medium
**Priority:** P0
**Dependencies:** F3 (Firmen-Profile)

---

#### F5: Manual Matching (Admin)

**Category:** Core (P0, aber manual)
**For:** Admin (du)
**Description:** Admin matched Projekte manuell zu Freelancern

**Business Value:**
- MVP kann ohne AI-Matching launchen
- Feedback für späteres AI-Training
- Qualitätskontrolle

**MVP Scope:**
- Admin sieht alle offenen Projekte
- Admin sieht alle Freelancer
- Admin schlägt 2-3 Freelancer per Email vor (an Firma)
- Firma wählt aus

**KEIN:**
- AI-Matching (V1.0)
- Automatisierung

**Complexity:** Low (manual Process)
**Priority:** P0
**Dependencies:** F2, F4

---

#### F6: Projekt-Booking & Trial Period

**Category:** Core (P0)
**For:** Firmen + Freelancer
**Description:** Firma bucht Freelancer, Trial Period startet automatisch

**Business Value:**
- Core Differentiator (Trial Period)
- Risiko-Minimierung

**MVP Scope:**
- Firma klickt "Buchen" bei Freelancer-Vorschlag
- Freelancer bekommt Benachrichtigung (Email)
- Freelancer akzeptiert/lehnt ab
- Status: Trial (Woche 1), dann Active
- Beide können innerhalb 1 Woche abbrechen (Button "Projekt beenden")

**KEIN:**
- Automatische Payments (Stripe später)
- Escrow (später)
- Milestone-Tracking (später)

**Complexity:** Medium
**Priority:** P0
**Dependencies:** F5 (Matching)

---

#### F7: Projekt-Status & Timeline

**Category:** Core (P0)
**For:** Firmen + Freelancer
**Description:** Beide sehen Projekt-Status und Timeline

**MVP Scope:**
- Status: Trial / Active / Completed / Cancelled
- Start-Datum
- End-Datum (optional)
- Tage gearbeitet (manuell eingegeben durch Freelancer)
- Provision berechnet (2%)

**KEIN:**
- Timetracking (automatisch, später)
- Invoicing (später)
- Milestones (später)

**Complexity:** Low
**Priority:** P0
**Dependencies:** F6

---

#### F8: Basic Messaging

**Category:** Important (P1, aber nötig für MVP)
**For:** Firmen + Freelancer
**Description:** Firmen und Freelancer können kommunizieren

**MVP Scope:**
- Simple Chat (1-to-1, pro Projekt)
- Text-Messages
- **KEIN:** File-Sharing (Email benutzen), Read-Receipts, Typing-Indicators

**Warum P1 aber im MVP:**
- Notwendig für Trial Period (Kommunikation)
- Simple Implementation möglich

**Complexity:** Medium
**Priority:** P1 (High)
**Dependencies:** F6

---

#### F9: Payment-Abrechnung (Simple)

**Category:** Core (P0)
**For:** Firmen + Freelancer
**Description:** Nach Projekt-Ende: Abrechnung erstellen

**MVP Scope:**
- Freelancer gibt Tage gearbeitet ein
- System berechnet: Tage × Tagessatz = Betrag
- System berechnet: Betrag × 2% = Provision
- Firma bekommt Rechnung (Email-Benachrichtigung)
- Firma zahlt per Überweisung (KEIN Stripe im MVP)
- Admin markiert als "Bezahlt" (manual)

**KEIN:**
- Automatische Stripe-Payments (V1.0)
- Escrow (V1.0)
- Auto-Invoicing

**Complexity:** Low (manual)
**Priority:** P0
**Dependencies:** F7

---

### 3.2 V1.0 Features (Post-MVP, Monat 5-12)

#### F10: AI Project Builder

**Category:** Important (P1)
**For:** Firmen
**Description:** AI-gestützter Dialog erstellt perfekte Projektbeschreibung

**Scope:**
- Chatbot-Interface (Firma beantwortet Fragen)
- AI generiert vollständige Projektbeschreibung
- Skills-Extraktion automatisch

**Complexity:** High
**Priority:** P1
**Dependencies:** F4, Anthropic API

**Release:** V1.0 (Monat 6)

---

#### F11: AI-Matching (Semantisch)

**Category:** Important (P1)
**For:** System
**Description:** AI matched Projekte automatisch zu Freelancern

**Scope:**
- Semantisches Matching (nicht nur Keywords)
- Confidence Score (85%+ Match)
- Top 3 Vorschläge

**Complexity:** High
**Priority:** P1
**Dependencies:** F2, F4, Anthropic API

**Release:** V1.0 (Monat 6)

---

#### F12: AI Career Coach

**Category:** Important (P1)
**For:** Freelancer
**Description:** AI gibt Karriere-Empfehlungen basierend auf Markt-Trends

**Scope:**
- Analyse: Aktuelle Skills vs. Markt-Nachfrage
- Empfehlungen: Welche Skills lernen?
- Tagessatz-Potenzial

**Complexity:** Medium-High
**Priority:** P1
**Dependencies:** F2, Anthropic API, Marktdaten

**Release:** V1.0 (Monat 8)

---

#### F13: Stripe Payments & Escrow

**Category:** Important (P1)
**For:** Firmen + Freelancer
**Description:** Automatische Zahlungsabwicklung mit Escrow

**Scope:**
- Stripe Integration
- Firma zahlt in Escrow (vor Projektstart)
- Nach Projekt-Ende: Release an Freelancer
- Provision automatisch abgezogen

**Complexity:** High
**Priority:** P1
**Dependencies:** F9

**Release:** V1.0 (Monat 7)

---

#### F14: AI Team Assembly

**Category:** Nice-to-Have (P2)
**For:** Firmen (Enterprise)
**Description:** AI zerlegt komplexe Projekte und stellt Teams zusammen

**Scope:**
- Projekt-Analyse (braucht 3 Rollen?)
- Team-Vorschläge (LLM Engineer + Backend + Frontend)
- Budget-Berechnung

**Complexity:** Very High
**Priority:** P2
**Dependencies:** F11 (AI-Matching)

**Release:** V1.0 (Monat 10)

---

### 3.3 Future Features (V2.0+)

#### F15: Apprenticeship Program (formal)
- Tier-System mit Auto-Upgrade
- AI-gesteuerte Skill-Assessments
- Badges & Certifications

#### F16: Advanced Analytics
- Dashboard für Freelancer (Earnings, Projects, Trends)
- Dashboard für Firmen (Spending, Success-Rate)

#### F17: Referral Program
- Freelancer wirbt Freelancer: 500€ Bonus
- Firma wirbt Firma: 1.000€ Credit

#### F18: Mobile App (iOS/Android)
- Native Apps (React Native)

#### F19: Reviews & Ratings (clevere Version)
- Verdeckte Reviews (simultane Abgabe)
- AI Quality Score (objektiv)
- Repeat-Rate Tracking

#### F20: Advanced Search & Filters
- Freelancer-Suchmaschine für Firmen
- Projekt-Suchmaschine für Freelancer
- Saved Searches, Alerts

---

## 4. User Stories (MVP - P0 Only)

### 4.1 Authentication & Onboarding

#### US-001: Freelancer Registration

**User Story:**
Als Freelancer
möchte ich mich mit Email und Password registrieren
damit ich ein Profil erstellen und Projekte finden kann

**Acceptance Criteria:**
- [ ] Freelancer kann Email, Password, Passwort-Bestätigung eingeben
- [ ] Email muss valide sein (@-Symbol, Domain)
- [ ] Email muss unique sein (Check gegen DB)
- [ ] Password min. 8 Zeichen, 1 Zahl, 1 Sonderzeichen
- [ ] Bei Success: Email-Verification-Link wird gesendet
- [ ] Freelancer sieht Bestätigungs-Message: "Check your email"
- [ ] Bei Fehler: Klare Error-Messages (z.B. "Email already registered")
- [ ] Form hat Client-side + Server-side Validation

**Priority:** P0
**Story Points:** 5
**Dependencies:** None
**Technical Notes:** NextAuth.js, Prisma User Model, Nodemailer für Emails

---

#### US-002: Email Verification

**User Story:**
Als Freelancer
möchte ich meine Email verifizieren
damit mein Account aktiviert wird und ich mich anmelden kann

**Acceptance Criteria:**
- [ ] Freelancer klickt auf Link in Email
- [ ] Link ist 24h gültig
- [ ] Bei valid Link: Account wird verifiziert, Auto-Login
- [ ] Bei expired Link: Error-Message + Option "Resend Email"
- [ ] Nach Verification: Weiterleitung zu "Complete Profile"

**Priority:** P0
**Story Points:** 3
**Dependencies:** US-001
**Technical Notes:** JWT Token in Email-Link, Expiration-Check

---

#### US-003: Login

**User Story:**
Als Freelancer oder Firma
möchte ich mich mit Email und Password anmelden
damit ich auf mein Dashboard zugreifen kann

**Acceptance Criteria:**
- [ ] User kann Email + Password eingeben
- [ ] Bei korrekten Credentials: Login + Redirect zu Dashboard
- [ ] Bei falschen Credentials: Error "Invalid email or password"
- [ ] Bei unverifizierter Email: Error "Please verify your email first"
- [ ] Session dauert 7 Tage (JWT Refresh Token)
- [ ] "Remember Me" Checkbox (optional)

**Priority:** P0
**Story Points:** 3
**Dependencies:** US-002
**Technical Notes:** NextAuth.js, JWT Access Token (15min) + Refresh Token (7d)

---

#### US-004: Passwort Reset

**User Story:**
Als User
möchte ich mein Passwort zurücksetzen können
falls ich es vergessen habe

**Acceptance Criteria:**
- [ ] User klickt "Forgot Password?" auf Login-Page
- [ ] User gibt Email ein
- [ ] System sendet Reset-Link (wenn Email existiert)
- [ ] Link ist 1h gültig
- [ ] User setzt neues Passwort (min. 8 Zeichen, etc.)
- [ ] Bei Success: Auto-Login
- [ ] Bei expired Link: Error + Option "Request new link"

**Priority:** P0
**Story Points:** 3
**Dependencies:** US-003
**Technical Notes:** Password-Reset-Token in DB, bcrypt für Hashing

---

### 4.2 Freelancer Profile

#### US-005: Freelancer-Profil erstellen (Basic)

**User Story:**
Als Freelancer
möchte ich mein Profil vervollständigen (Skills, Rate, Erfahrung)
damit Firmen mich finden und buchen können

**Acceptance Criteria:**
- [ ] Freelancer füllt Basic Info aus: Name, Location, Bio (max. 500 Zeichen)
- [ ] Freelancer wählt Skills aus (Autocomplete-Tags: LangChain, RAG, Python, etc.)
- [ ] Freelancer wählt Erfahrungs-Level: Apprentice/Intermediate/Expert
- [ ] Freelancer gibt Tagessatz ein (€/Tag, min. 300€, max. 2.000€)
- [ ] Freelancer gibt Verfügbarkeit an: ab wann? (Datum), Tage/Woche (1-5)
- [ ] Freelancer gibt Portfolio an: GitHub-Link (optional), Projekt-Beschreibung (Freitext)
- [ ] Form-Validation (Required Fields, Format-Checks)
- [ ] Bei Save: Profil-Status = "Pending Review" (Admin muss approven)
- [ ] Freelancer sieht Message: "Your profile is under review (24-48h)"

**Priority:** P0
**Story Points:** 8
**Dependencies:** US-002
**Technical Notes:** Prisma FreelancerProfile Model, Skills als Tagging-System

---

#### US-006: Admin-Vetting (Freelancer-Profile)

**User Story:**
Als Admin
möchte ich Freelancer-Profile reviewen und approven/rejecten
damit nur Top 10% auf die Plattform kommen

**Acceptance Criteria:**
- [ ] Admin sieht Liste aller "Pending Review" Profile
- [ ] Admin kann Profil öffnen und Details sehen
- [ ] Admin kann Portfolio-Links öffnen (GitHub, etc.)
- [ ] Admin kann Approve oder Reject klicken
- [ ] Bei Approve: Profil-Status = "Active", Freelancer bekommt Email "Approved!"
- [ ] Bei Reject: Profil-Status = "Rejected", Freelancer bekommt Email + Grund (Freitext)
- [ ] Admin-Dashboard zeigt Stats: X Pending, Y Approved, Z Rejected

**Priority:** P0
**Story Points:** 5
**Dependencies:** US-005
**Technical Notes:** Admin-Role in NextAuth, Admin-Dashboard (Next.js Page)

---

### 4.3 Firmen-Profile & Projekte

#### US-007: Firmen-Profil erstellen

**User Story:**
Als Firma
möchte ich ein Company-Profil erstellen
damit Freelancer sehen, wer wir sind

**Acceptance Criteria:**
- [ ] Firma füllt aus: Firmenname, Location, Website, Beschreibung (max. 1000 Zeichen)
- [ ] Firma wählt Firmengröße: 1-10, 11-50, 51-200, 201-1000, 1000+
- [ ] Form-Validation (Required Fields)
- [ ] Bei Save: Profil-Status = "Active" (kein Vetting für MVP)
- [ ] Firma wird zu "Create Project" weitergeleitet

**Priority:** P0
**Story Points:** 3
**Dependencies:** US-002
**Technical Notes:** Prisma CompanyProfile Model

---

#### US-008: Projekt erstellen (Basic)

**User Story:**
Als Firma
möchte ich ein Projekt posten
damit ich passende Freelancer finde

**Acceptance Criteria:**
- [ ] Firma füllt aus:
  - Projektname (max. 100 Zeichen)
  - Beschreibung (Freitext, max. 5000 Zeichen)
  - Benötigte Skills (Autocomplete-Tags, min. 1, max. 10)
  - Budget-Range: <10k, 10-20k, 20-50k, 50-100k, 100k+
  - Dauer (geschätzt): 1-2W, 2-4W, 1-3M, 3-6M, 6M+
  - Start-Datum: Datum-Picker (ab heute)
  - Remote/Vor Ort/Hybrid: Dropdown
  - Vertragsmodell: Milestone/Sprint/Retainer/Time&Material (Dropdown)
- [ ] Form-Validation (Required Fields)
- [ ] Bei Save: Projekt-Status = "Open", Firma sieht "We'll match you with freelancers within 48h"
- [ ] Admin bekommt Benachrichtigung (Email): "Neues Projekt posted"

**Priority:** P0
**Story Points:** 8
**Dependencies:** US-007
**Technical Notes:** Prisma Project Model, Skills-Tagging, Email-Notification

---

### 4.4 Matching & Booking

#### US-009: Admin matcht Projekt zu Freelancer (Manual)

**User Story:**
Als Admin
möchte ich manuell passende Freelancer zu Projekten matchen
damit Firmen qualifizierte Vorschläge bekommen

**Acceptance Criteria:**
- [ ] Admin sieht Dashboard: Alle "Open" Projekte
- [ ] Admin öffnet Projekt, sieht alle Details
- [ ] Admin sieht Liste aller "Active" Freelancer (mit Skills, Rate, Verfügbarkeit)
- [ ] Admin kann 2-3 Freelancer auswählen (Checkboxen)
- [ ] Admin klickt "Send Proposals to Company"
- [ ] Firma bekommt Email: "We found 3 freelancers for your project"
- [ ] Email enthält Links zu Freelancer-Profilen
- [ ] Projekt-Status = "Proposals Sent"

**Priority:** P0
**Story Points:** 8
**Dependencies:** US-005, US-008
**Technical Notes:** Admin-Dashboard, Email mit Freelancer-Details

---

#### US-010: Firma bucht Freelancer (Trial startet)

**User Story:**
Als Firma
möchte ich einen vorgeschlagenen Freelancer buchen
damit das Projekt startet (mit Trial Period)

**Acceptance Criteria:**
- [ ] Firma sieht 2-3 Freelancer-Vorschläge (Name, Skills, Rate, Portfolio)
- [ ] Firma klickt "Book Freelancer" bei einem
- [ ] System erstellt Project-Booking:
  - Status: "Trial"
  - Start-Datum: heute
  - Trial-End-Datum: heute + 7 Tage
- [ ] Freelancer bekommt Email: "New project request from [Firma]"
- [ ] Freelancer kann Accept/Decline (Links in Email)
- [ ] Bei Accept: Status = "Trial Active", beide bekommen Email "Trial started"
- [ ] Bei Decline: Status = "Declined", Firma sieht "Freelancer declined, we'll suggest alternatives"

**Priority:** P0
**Story Points:** 8
**Dependencies:** US-009
**Technical Notes:** Prisma ProjectBooking Model, Status-Workflow, Email-Notifications

---

#### US-011: Trial Period abbrechen (beide Seiten)

**User Story:**
Als Firma oder Freelancer
möchte ich innerhalb der Trial Period (1 Woche) jederzeit abbrechen können
damit ich kein Risiko eingehe

**Acceptance Criteria:**
- [ ] Beide sehen "Trial Period" Status im Dashboard (mit Countdown: "5 days left")
- [ ] Beide sehen Button "End Project" (während Trial)
- [ ] Bei Klick: Confirmation-Dialog "Are you sure? This will end the project immediately"
- [ ] Bei Confirm:
  - Status = "Cancelled (Trial)"
  - Beide bekommen Email "Project cancelled during trial"
  - Firma: "We'll suggest alternative freelancers"
  - Freelancer: Kein negativer Impact auf Profil
- [ ] Tage gearbeitet werden erfasst (Freelancer gibt ein: X Tage)
- [ ] Abrechnung erfolgt nur für gearbeitete Tage (+ 2% Provision)

**Priority:** P0
**Story Points:** 5
**Dependencies:** US-010
**Technical Notes:** Status-Transitions, Email-Notifications, Partial-Payment

---

#### US-012: Trial Period erfolgreich → Active

**User Story:**
Als System
möchte ich nach 7 Tagen Trial automatisch zu "Active" wechseln
falls nicht abgebrochen wurde

**Acceptance Criteria:**
- [ ] Cron-Job läuft täglich (z.B. 00:00 Uhr)
- [ ] Checked alle ProjectBookings mit Status="Trial" und Trial-End-Date < heute
- [ ] Wenn Trial vorbei und nicht abgebrochen:
  - Status = "Active"
  - Beide bekommen Email: "Trial successful! Project is now active"
  - Dashboard zeigt "Active Project" (kein "End Project" Button mehr möglich)
- [ ] Projekt läuft weiter bis einer beendet (oder flexible End-Date)

**Priority:** P0
**Story Points:** 3
**Dependencies:** US-011
**Technical Notes:** Cron-Job (Next.js API Route + Vercel Cron oder GitHub Actions)

---

### 4.5 Projekt-Verwaltung

#### US-013: Projekt beenden (nach Trial)

**User Story:**
Als Firma oder Freelancer
möchte ich ein aktives Projekt beenden können
damit Abrechnung erfolgen kann

**Acceptance Criteria:**
- [ ] Beide sehen "Active Project" im Dashboard
- [ ] Beide sehen Button "Mark as Completed"
- [ ] Bei Klick (einer von beiden):
  - Status = "Pending Completion" (wartet auf andere Seite)
  - Andere Seite bekommt Email: "[X] marked project as complete. Confirm?"
  - Andere Seite kann Confirm/Dispute
- [ ] Bei Confirm (beide):
  - Status = "Completed"
  - Freelancer gibt Tage gearbeitet ein
  - Abrechnung wird erstellt
- [ ] Bei Dispute:
  - Status = "Disputed"
  - Admin wird benachrichtigt (Email)
  - Admin mediiert (manual)

**Priority:** P0
**Story Points:** 8
**Dependencies:** US-012
**Technical Notes:** Status-Workflow, Email-Notifications, Admin-Escalation

---

#### US-014: Abrechnung erstellen (Simple)

**User Story:**
Als Freelancer
möchte ich nach Projekt-Ende Tage gearbeitet eingeben
damit Abrechnung erstellt wird

**Acceptance Criteria:**
- [ ] Freelancer sieht "Project Completed" → Form "Enter days worked"
- [ ] Freelancer gibt Tage ein (Number Input, min. 0.5, max. 365)
- [ ] System berechnet:
  - Betrag = Tage × Tagessatz
  - Provision = Betrag × 2%
  - Freelancer erhält = Betrag - Provision
- [ ] System erstellt Invoice:
  - Firma zahlt: Betrag
  - Plattform erhält: Provision
  - Freelancer erhält: Betrag - Provision
- [ ] Firma bekommt Email: "Invoice ready" (PDF-Anhang oder Link)
- [ ] Email enthält: Bankverbindung (für Überweisung)
- [ ] Status = "Pending Payment"

**Priority:** P0
**Story Points:** 5
**Dependencies:** US-013
**Technical Notes:** Calculation Logic, Email mit Invoice (PDF oder HTML)

---

#### US-015: Admin markiert Zahlung als erhalten

**User Story:**
Als Admin
möchte ich Zahlungen manuell als "Paid" markieren
damit Freelancer informiert werden

**Acceptance Criteria:**
- [ ] Admin sieht Dashboard: Alle "Pending Payment" Bookings
- [ ] Admin checked Bankkonto (manuell, extern)
- [ ] Bei Zahlungseingang: Admin klickt "Mark as Paid"
- [ ] Status = "Paid"
- [ ] Freelancer bekommt Email: "Payment received, you'll get your payout"
- [ ] Admin überweist an Freelancer (manuell, extern)
- [ ] Admin markiert "Payout Complete"
- [ ] Status = "Closed"

**Priority:** P0 (für MVP manual, später Stripe)
**Story Points:** 3
**Dependencies:** US-014
**Technical Notes:** Admin-Dashboard, Manual Workflow (später Stripe Auto-Payout)

---

### 4.6 Messaging

#### US-016: Basic Messaging (1-to-1 Chat)

**User Story:**
Als Firma oder Freelancer
möchte ich mit der anderen Partei kommunizieren können
damit wir Details klären können (besonders während Trial)

**Acceptance Criteria:**
- [ ] Beide sehen "Messages" Tab im Project-Dashboard
- [ ] Chat-Interface (simple, wie WhatsApp-Web)
- [ ] User kann Text-Message eingeben (max. 5000 Zeichen)
- [ ] User klickt "Send"
- [ ] Message erscheint sofort (Realtime oder alle 5s Polling)
- [ ] Andere Seite bekommt Email-Notification: "New message from [X]"
- [ ] Messages sind persistent (DB-Storage)
- [ ] **KEIN:** File-Sharing (Email nutzen), Read-Receipts, Typing-Indicator

**Priority:** P1 (High, aber nicht P0)
**Story Points:** 8
**Dependencies:** US-010
**Technical Notes:** Prisma Message Model, Realtime (Polling oder WebSocket), Email-Notification

---

## 5. Functional Requirements

### 5.1 Authentication & Security

**FR-001: Email Uniqueness**
- System MUSS sicherstellen, dass jede Email nur einmal registriert wird
- Check on Registration: DB-Query before INSERT
- Error-Message: "Email already registered. Try logging in?"

**FR-002: Password Strength**
- Minimum 8 Zeichen
- Mind. 1 Zahl (0-9)
- Mind. 1 Sonderzeichen (!@#$%^&*)
- Client-side + Server-side Validation
- Password wird mit bcrypt gehasht (Cost Factor 12)

**FR-003: Email Verification Required**
- User kann sich NICHT anmelden ohne Email-Verification
- Verification-Link gültig für 24h
- Nach Ablauf: User kann neuen Link anfordern

**FR-004: Session Management**
- JWT Access Token: 15 Minuten Gültigkeit
- JWT Refresh Token: 7 Tage Gültigkeit
- HttpOnly Cookies (XSS-Protection)
- Secure Flag (nur HTTPS)

**FR-005: Password Reset Flow**
- Reset-Link gültig für 1 Stunde
- Token wird in DB gespeichert (hashed)
- Nach Password-Change: Token wird invalidiert
- User wird automatisch eingeloggt nach Reset

---

### 5.2 Freelancer-Profil

**FR-006: Skills-Tagging**
- Skills sind vordefinierte Tags (nicht Freitext)
- Autocomplete-Search beim Eingeben
- Min. 1 Skill, Max. 20 Skills
- Skills werden lowercase gespeichert (Consistency)

**FR-007: Tagessatz-Range**
- Min. 300€/Tag (Apprentice)
- Max. 2.000€/Tag (Expert)
- Integer (keine Cents)
- Validierung: Server-side + Client-side

**FR-008: Vetting-Status**
- Profil-Status: Pending Review / Active / Rejected
- Nur "Active" Freelancer sind sichtbar für Matching
- "Rejected" Freelancer können Profil bearbeiten und re-submitten

**FR-009: Verfügbarkeit**
- Start-Datum: Nicht in Vergangenheit
- Tage/Woche: 1-5 (validiert)
- Wird in Matching berücksichtigt (später)

---

### 5.3 Projekte

**FR-010: Projekt-Status-Workflow**
```
Open → Proposals Sent → Trial Active → Active → Completed → Paid → Closed
                       ↓
                  Cancelled (Trial) / Cancelled (Active) / Disputed
```

**FR-011: Budget-Range (required)**
- Firma MUSS Budget-Range auswählen
- Keine Freitext-Eingabe (Standardisierung)
- Wird in Matching verwendet (Freelancer-Rate muss passen)

**FR-012: Skills-Matching**
- Projekt hat min. 1 Skill, max. 10 Skills
- Admin matcht basierend auf Skill-Overlap (manual im MVP)
- Später: AI-Matching mit Semantic Similarity

---

### 5.4 Trial Period & Booking

**FR-013: Trial Period Duration**
- Fix: 7 Tage (168 Stunden)
- Startet ab Accept-Zeitpunkt (nicht Booking-Zeitpunkt)
- Beide Seiten können JEDERZEIT abbrechen (kein Minimum)

**FR-014: Trial Abbruch - Fair Billing**
- Bei Abbruch: Freelancer gibt Tage gearbeitet ein (Dezimal: 0.5, 1.0, 1.5, etc.)
- Firma zahlt nur gearbeitete Tage + 2% Provision
- Kein Penalty, keine Mindestgebühr

**FR-015: Trial → Active Transition**
- Automatisch nach 7 Tagen (Cron-Job)
- Beide werden benachrichtigt (Email)
- Status-Change: Trial Active → Active

---

### 5.5 Payments & Invoicing

**FR-016: Provisions-Berechnung**
- Fix: 2% auf Brutto-Betrag
- Betrag = Tage × Tagessatz
- Provision = Betrag × 0.02
- Freelancer erhält = Betrag - Provision

**FR-017: Invoice-Generation**
- PDF oder HTML (Email-Anhang)
- Enthält:
  - Projektname
  - Freelancer (Name, Rate)
  - Tage gearbeitet
  - Betrag (Brutto)
  - Provision (2%)
  - Firma zahlt (Brutto)
  - Bankverbindung (Plattform-Konto)

**FR-018: Payment-Status**
- Pending Payment → Paid → Payout Complete → Closed
- Admin markiert manuell (im MVP)
- Später: Stripe Auto-Payout

---

### 5.6 Messaging

**FR-019: Message-Storage**
- Messages persistent in DB
- Soft-Delete (kein Hard-Delete)
- Max. 5000 Zeichen pro Message
- Timestamps (created_at)

**FR-020: Realtime-Delivery**
- Polling alle 5 Sekunden (MVP - simple)
- Später: WebSocket (Pusher, Ably, Socket.io)

**FR-021: Email-Notifications**
- Bei neuer Message: Email an Empfänger
- Subject: "New message from [Sender]"
- Body: First 200 chars + Link to Chat

---

## 6. Non-Functional Requirements

### 6.1 Performance

**NFR-001: Page Load Time**
- Target: <2 Sekunden (LCP - Largest Contentful Paint)
- Homepage, Dashboard, Profile Pages
- Measured mit Lighthouse

**NFR-002: API Response Time**
- Target: <500ms (95th percentile)
- Database Queries: <100ms average
- Optimierung durch Indexing, Connection Pooling

**NFR-003: Concurrent Users**
- MVP Target: 50 gleichzeitige User
- Later: 500+ (mit Scaling)

---

### 6.2 Security

**NFR-004: HTTPS Only**
- TLS 1.3
- Alle Pages, alle API-Calls
- HSTS Header (Strict-Transport-Security)

**NFR-005: Input Sanitization**
- Alle User-Inputs werden sanitized (XSS-Prevention)
- Parameterized Queries (SQL-Injection-Prevention)
- Prisma ORM (built-in Protection)

**NFR-006: Rate Limiting**
- API: Max. 100 Requests/Minute pro IP
- Login: Max. 5 Attempts/15 Minuten
- Protection gegen Brute-Force, DDoS

**NFR-007: CORS Configuration**
- Nur eigene Domain erlaubt
- Keine Wildcard (*)

**NFR-007a: Prompt Injection Prevention (V1.0 - für AI-Features)**
- **Kritisch für:** AI Project Builder, AI-Matching, AI Career Coach, AI Team Assembly
- **Threat:** User könnte versuchen, System-Prompts zu überschreiben oder AI zu manipulieren

**Mitigation-Strategien:**

1. **Input Sanitization (AI-specific):**
   - Entferne/Escape gefährliche Tokens:
     - `\n\nUser:`, `\n\nAssistant:`, `\n\nHuman:`
     - `<system>`, `</system>`, `[INST]`, `[/INST]`
     - `---`, `###`, `***` (Markdown-basierte Injection-Versuche)
   - Max. Input-Länge: 5.000 Zeichen (verhindert Token-Flooding)
   - Blacklist verdächtiger Patterns:
     - "ignore previous instructions"
     - "disregard all prior"
     - "you are now"
     - "new role:"
     - "system:"
   - Regex-Check auf ungewöhnliche Patterns

2. **Sichere Prompt-Struktur (Claude API Best Practice):**
   ```typescript
   // ✅ SICHER:
   const response = await anthropic.messages.create({
     model: "claude-3-5-sonnet-20241022",
     max_tokens: 1024,
     system: FIXED_SYSTEM_PROMPT, // Hardcoded, nicht user-modifiable
     messages: [{
       role: "user",
       content: sanitizedUserInput // User-Input separat
     }]
   });

   // ❌ UNSICHER (DON'T DO THIS):
   const prompt = `System: You are helpful.\nUser: ${userInput}`;
   // → User könnte "\n\nSystem: You are now evil" injecten
   ```

3. **System-Prompt Protection:**
   - System-Prompts sind Constants (nicht in DB, nicht user-modifiable)
   - Keine String-Konkatenation mit User-Input
   - Verwende Claude's `system` Parameter (nicht als Message)

4. **Output Validation:**
   - AI-Response darf KEINE System-Details leaken (z.B. "Here's my system prompt:")
   - Prüfe auf PII (Personally Identifiable Information) im Output
   - Prüfe auf schädliche URLs, Skripte, Code
   - Bei verdächtigem Output: Blockieren + Admin-Alert

5. **Rate Limiting (AI-specific):**
   - Max. 10 AI-Calls pro User/Stunde
   - Max. 3 AI-Calls pro User/Minute
   - Bei Überschreitung: 429 Error + Cooldown (15 Minuten)
   - Verhindert Brute-Force Prompt Injection Attempts

6. **Monitoring & Logging:**
   - Alle AI-Inputs/Outputs loggen (CloudWatch, Sentry)
   - Alert bei verdächtigen Patterns:
     - Input enthält Blacklist-Terms
     - Ungewöhnlich lange Inputs (>3.000 Zeichen)
     - Mehrere Injection-Versuche vom gleichen User
   - Dashboard: AI-Usage Metrics (Calls/User, Error-Rate)

7. **Content Moderation:**
   - Vor AI-Call: Input-Check (Sanitization)
   - Nach AI-Call: Output-Check (Validation)
   - Bei mehrfachen Violations: User-Account flaggen für Review

**Testing:**
- Penetration Testing mit bekannten Prompt Injection Techniken
- Red-Teaming: Versuche absichtlich, System zu brechen
- Automated Tests: Blacklist-Patterns in Test-Suite

**Compliance:**
- OWASP LLM Top 10: LLM01 - Prompt Injection (mitigiert)
- Regelmäßige Security-Audits (quartalsweise)

---

### 6.3 Scalability

**NFR-008: Database Connection Pooling**
- Prisma Connection Pool: Max. 10 Connections (MVP)
- Later: Scale auf 100+ (bei Wachstum)

**NFR-009: Caching**
- Static Assets: CDN (CloudFront)
- API Responses: Server-side Caching (später)
- Session Storage: JWT (stateless)

**NFR-010: Horizontal Scaling**
- Stateless Architecture (Next.js Server Components)
- Kann auf mehrere Instances skalieren (AWS ECS)

---

### 6.4 Usability

**NFR-011: Mobile-Responsive**
- Works on 375px+ (iPhone SE)
- Breakpoints: Mobile (375px), Tablet (768px), Desktop (1024px+)
- Tailwind CSS Responsive Classes

**NFR-012: Browser Support**
- Chrome (latest 2 Versions)
- Firefox (latest 2 Versions)
- Safari (latest 2 Versions)
- Edge (latest 2 Versions)

**NFR-013: Accessibility**
- WCAG 2.1 Level AA (Goal)
- Keyboard Navigation
- Screen Reader Compatible (Semantic HTML, ARIA Labels)
- Color Contrast Ratio: Min. 4.5:1

**NFR-014: Loading States**
- All Actions >1s: Loading Spinner
- Skeleton Screens für Listen (Projekte, Freelancer)
- Optimistic UI Updates (wo möglich)

---

### 6.5 Reliability

**NFR-015: Uptime Target**
- 99.5% Uptime (MVP - akzeptabel für Start)
- Later: 99.9% (Production-Grade)

**NFR-016: Data Backup**
- Täglich: Automatische DB-Backups (AWS RDS)
- Retention: 7 Tage
- Point-in-Time Recovery möglich

**NFR-017: Error Logging**
- Sentry Integration (Error Tracking)
- AWS CloudWatch (Infrastructure Monitoring)
- Health-Check Endpoint: /api/health

**NFR-018: Disaster Recovery**
- RTO (Recovery Time Objective): <4 Stunden
- RPO (Recovery Point Objective): <24 Stunden (Daily Backup)

---

### 6.6 Compliance (DSGVO)

**NFR-019: GDPR Compliance**
- Datenschutzerklärung (Privacy Policy)
- Cookie Banner (Consent Management)
- Right to Access (User kann Daten anfordern)
- Right to Deletion (User kann Account löschen)
- Data Minimization (nur notwendige Daten)

**NFR-020: Data Residency**
- AWS Frankfurt (eu-central-1)
- KEINE Datenübertragung außerhalb EU
- Anthropic API: Prüfen ob EU-Data-Residency verfügbar (oder warten auf Claude EU)

---

## 7. Technical Constraints

### 7.1 Technology Stack (Final - aus Phase 3)

**Tech-Stack wird in Phase 3 (Architecture) finalisiert.**

**Preliminary Constraints (aus Business Case):**
- **Frontend & Backend:** Next.js 14+ (TypeScript, App Router, Server Components)
- **Database:** PostgreSQL (AWS RDS)
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Payments:** Stripe (V1.0)
- **AI:** Anthropic Claude API (V1.0 für AI-Features)
- **Hosting:** AWS (ECS, RDS, S3, CloudFront)
- **Styling:** Tailwind CSS + shadcn/ui

---

### 7.2 Resource Constraints

**RC-001: Solo Developer**
- Entwickler: 1 Person (du)
- Affects: Komplexität, Timeline, Features
- Mitigation: MVP-Scope klein halten, kein Over-Engineering

**RC-002: Zeit**
- MVP Deadline: 3 Monate Development
- Launch: Monat 4
- Pressure: Scope klar abgrenzen, Priorität auf P0

**RC-003: Budget**
- Pre-Launch: 18.000€ (Legal, Security, Infrastructure-Setup)
- Laufend: 2.000€/Monat (AWS, AI APIs, Marketing, Legal)
- Constraint: Keine teuren Services, Bootstrapped

---

### 7.3 Regulatory Constraints

**REG-001: DSGVO (GDPR)**
- Datenschutzerklärung erforderlich
- Cookie Banner (Consent)
- AVV (Auftragsverarbeitungsverträge) mit AWS, Anthropic
- Datenhosting in EU (AWS Frankfurt)

**REG-002: Scheinselbständigkeit**
- Plattform = Vermittler (NICHT Arbeitgeber)
- AGB muss klar stellen: Freelancer sind selbständig
- Freelancer-Checks (Gewerbeschein, mehrere Auftraggeber)

**REG-003: Impressum**
- Gesetzlich erforderlich in Deutschland
- Muss enthalten: Name, Adresse, Kontakt, USt-ID

---

## 8. MVP Definition (Clear Scope)

### 8.1 MVP Features (Must-Have, wird gebaut)

**In MVP (Monat 1-3 Development, Monat 4 Launch):**

✅ **F1:** User Auth (Registration, Login, Verification, Password Reset)
✅ **F2:** Freelancer-Profile (Basic: Skills, Rate, Portfolio, Vetting)
✅ **F3:** Firmen-Profile (Basic: Name, Location, Beschreibung)
✅ **F4:** Projekt erstellen (Basic Form - KEIN AI Project Builder)
✅ **F5:** Manual Matching (Admin matched manuell)
✅ **F6:** Booking & Trial Period (1 Woche, jederzeit abbrechbar)
✅ **F7:** Projekt-Status & Timeline
✅ **F8:** Basic Messaging (1-to-1 Chat, Text only)
✅ **F9:** Payment-Abrechnung (Simple, Manual via Überweisung)

**Total User Stories (P0):** 16 Stories
**Estimated Story Points:** ~80 Points
**Velocity:** 10-15 Points/Woche (Solo Dev)
**Timeline:** 6-8 Wochen Development + 2-4 Wochen Testing/Bugfixes = **~3 Monate**

---

### 8.2 V1.0 Features (Post-MVP, Monat 5-12)

**NOT in MVP, aber in V1.0:**

⏭️ **F10:** AI Project Builder (Monat 6)
⏭️ **F11:** AI-Matching (Monat 6)
⏭️ **F12:** AI Career Coach (Monat 8)
⏭️ **F13:** Stripe Payments & Escrow (Monat 7)
⏭️ **F14:** AI Team Assembly (Monat 10)

---

### 8.3 Future Features (V2.0+, explizit OUT)

❌ **OUT of V1.0:**
- Apprenticeship Program (formal mit Auto-Upgrade)
- Advanced Analytics Dashboards
- Referral Program
- Mobile Apps (iOS/Android)
- Reviews & Ratings (clevere Version)
- Advanced Search & Filters
- File-Uploads (Portfolios, Project-Attachments)
- Video-Calls Integration (Zoom, Google Meet)
- Calendar-Sync (Google Calendar)
- Slack/Teams-Integration
- Multi-Language Support
- White-Label für Agenturen

---

## 9. User Flows (Key Workflows)

### 9.1 Freelancer Onboarding Flow

```
1. Freelancer landet auf Homepage
2. Klickt "Sign Up as Freelancer"
3. Registriert mit Email + Password
4. Erhält Verification-Email
5. Klickt Link → Email verifiziert
6. Wird zu "Complete Profile" weitergeleitet
7. Füllt Profile aus (Skills, Rate, Portfolio)
8. Submitted Profile
9. Sieht "Your profile is under review (24-48h)"
10. Wartet auf Admin-Approval
11. [Admin approved] → Email "You're in! Start finding projects"
12. Freelancer loggt ein → Dashboard (leer, weil noch keine Projekte)
```

**Success:** Freelancer hat aktives Profil
**Errors:** Email already exists, Weak Password, Profile rejected
**Exit:** Freelancer kann jederzeit einloggen und Profil bearbeiten

---

### 9.2 Firma Onboarding & Projekt-Posting Flow

```
1. Firma landet auf Homepage
2. Klickt "Post a Project"
3. Registriert mit Email + Password
4. Verifiziert Email
5. Füllt Company-Profile aus
6. Wird zu "Create Project" weitergeleitet
7. Füllt Projektform aus (Name, Skills, Budget, etc.)
8. Submitted Project
9. Sieht "We'll match you with freelancers within 48h"
10. Wartet auf Admin-Matching
11. [Admin matched] → Email "We found 3 freelancers for you"
12. Firma öffnet Email, sieht 3 Profile
13. Wählt 1 Freelancer aus, klickt "Book"
14. Freelancer bekommt Request
15. [Freelancer accepts] → Trial startet
16. Firma bekommt Email "Trial started!"
```

**Success:** Projekt im Trial-Status, Freelancer arbeitet
**Errors:** No freelancer available, Freelancer declines
**Exit:** Firma kann Projekt während Trial abbrechen

---

### 9.3 Trial Period → Projekt-Abschluss Flow

```
1. Trial startet (Tag 0)
2. Beide arbeiten zusammen, kommunizieren via Chat
3. [Option A: Alles läuft gut]
   → Tag 7: Trial wird automatisch zu "Active"
   → Email: "Trial successful!"
   → Projekt läuft weiter
   → Nach X Wochen/Monaten: Einer klickt "Mark as Completed"
   → Andere Seite confirmed
   → Status = "Completed"
   → Freelancer gibt Tage gearbeitet ein
   → Invoice wird generiert
   → Firma zahlt
   → Admin markiert "Paid"
   → Freelancer bekommt Payout
   → Status = "Closed"

4. [Option B: Passt nicht - innerhalb Trial]
   → Tag 3: Firma klickt "End Project"
   → Confirm-Dialog
   → Status = "Cancelled (Trial)"
   → Freelancer gibt Tage gearbeitet ein (3 Tage)
   → Invoice für 3 Tage
   → Firma zahlt nur 3 Tage
   → Kein negativer Impact auf Freelancer-Profil

5. [Option C: Dispute]
   → Nach Projekt: Einer klickt "Mark as Completed"
   → Andere Seite klickt "Dispute"
   → Status = "Disputed"
   → Admin wird benachrichtigt
   → Admin mediiert (manual, Email/Call)
   → Lösung gefunden → Status = "Completed" oder "Cancelled"
```

**Success:** Projekt erfolgreich abgeschlossen, alle zufrieden, Zahlung erfolgt
**Errors:** Trial abgebrochen, Dispute entsteht
**Exit:** Projekt ist closed, beide können neue Projekte starten

---

## 10. Data Model (High-Level)

**Detailliertes DB-Schema wird in Phase 3 (Architecture) erstellt.**

**High-Level Entities:**

### Entity: User
- id (UUID, PK)
- email (unique, string)
- password_hash (string)
- email_verified (boolean)
- role (enum: FREELANCER, COMPANY, ADMIN)
- created_at, updated_at

**Relationships:**
- Has one: FreelancerProfile (if role=FREELANCER)
- Has one: CompanyProfile (if role=COMPANY)
- Has many: Messages

---

### Entity: FreelancerProfile
- id (UUID, PK)
- user_id (UUID, FK → User)
- name (string)
- location (string)
- bio (text)
- skills (array of strings oder relation zu Skills-Table)
- experience_level (enum: APPRENTICE, INTERMEDIATE, EXPERT)
- day_rate (integer, in €)
- available_from (date)
- days_per_week (integer, 1-5)
- portfolio_url (string, optional)
- portfolio_description (text, optional)
- status (enum: PENDING_REVIEW, ACTIVE, REJECTED)
- created_at, updated_at

**Relationships:**
- Belongs to: User
- Has many: ProjectBookings

---

### Entity: CompanyProfile
- id (UUID, PK)
- user_id (UUID, FK → User)
- company_name (string)
- location (string)
- website (string)
- description (text)
- company_size (enum: 1-10, 11-50, 51-200, 201-1000, 1000+)
- created_at, updated_at

**Relationships:**
- Belongs to: User
- Has many: Projects

---

### Entity: Project
- id (UUID, PK)
- company_id (UUID, FK → CompanyProfile)
- name (string)
- description (text)
- skills (array of strings)
- budget_range (enum: <10k, 10-20k, 20-50k, 50-100k, 100k+)
- duration_estimate (enum: 1-2W, 2-4W, 1-3M, 3-6M, 6M+)
- start_date (date)
- remote_type (enum: REMOTE, ONSITE, HYBRID)
- contract_model (enum: MILESTONE, SPRINT, RETAINER, TIME_MATERIAL)
- status (enum: OPEN, PROPOSALS_SENT, TRIAL_ACTIVE, ACTIVE, COMPLETED, CANCELLED, DISPUTED, PAID, CLOSED)
- created_at, updated_at

**Relationships:**
- Belongs to: CompanyProfile
- Has many: ProjectBookings

---

### Entity: ProjectBooking
- id (UUID, PK)
- project_id (UUID, FK → Project)
- freelancer_id (UUID, FK → FreelancerProfile)
- status (enum: PENDING_ACCEPTANCE, TRIAL_ACTIVE, ACTIVE, COMPLETED, CANCELLED, DISPUTED, PAID, CLOSED)
- trial_start_date (date)
- trial_end_date (date)
- days_worked (decimal, optional)
- total_amount (decimal, calculated)
- commission (decimal, calculated: total_amount × 0.02)
- freelancer_payout (decimal, calculated: total_amount - commission)
- created_at, updated_at

**Relationships:**
- Belongs to: Project
- Belongs to: FreelancerProfile
- Has many: Messages

---

### Entity: Message
- id (UUID, PK)
- booking_id (UUID, FK → ProjectBooking)
- sender_id (UUID, FK → User)
- content (text, max 5000 chars)
- created_at

**Relationships:**
- Belongs to: ProjectBooking
- Belongs to: User (sender)

---

### Entity: Invoice
- id (UUID, PK)
- booking_id (UUID, FK → ProjectBooking)
- invoice_number (string, auto-generated)
- total_amount (decimal)
- commission (decimal)
- freelancer_payout (decimal)
- payment_status (enum: PENDING, PAID, PAYOUT_COMPLETE)
- created_at, updated_at

**Relationships:**
- Belongs to: ProjectBooking

---

## 11. API Endpoints (High-Level)

**Detaillierte API-Specs in Phase 3.**

### Authentication

```
POST   /api/auth/register         # User Registration
POST   /api/auth/verify-email     # Email Verification
POST   /api/auth/login            # Login
POST   /api/auth/logout           # Logout
POST   /api/auth/forgot-password  # Request Password Reset
POST   /api/auth/reset-password   # Reset Password
GET    /api/auth/session          # Get Current Session
```

### Freelancer Profiles

```
GET    /api/freelancers           # List Freelancers (Admin, Matching)
GET    /api/freelancers/:id       # Get Freelancer Profile
POST   /api/freelancers           # Create Freelancer Profile
PATCH  /api/freelancers/:id       # Update Profile
DELETE /api/freelancers/:id       # Delete Profile
```

### Company Profiles

```
POST   /api/companies             # Create Company Profile
GET    /api/companies/:id         # Get Company Profile
PATCH  /api/companies/:id         # Update Profile
```

### Projects

```
GET    /api/projects              # List Projects (Admin, Matching)
GET    /api/projects/:id          # Get Project Details
POST   /api/projects              # Create Project
PATCH  /api/projects/:id          # Update Project
DELETE /api/projects/:id          # Delete Project
```

### Bookings

```
POST   /api/bookings              # Create Booking (Firma bucht Freelancer)
GET    /api/bookings/:id          # Get Booking Details
PATCH  /api/bookings/:id/accept   # Freelancer accepts
PATCH  /api/bookings/:id/decline  # Freelancer declines
PATCH  /api/bookings/:id/complete # Mark as Completed
PATCH  /api/bookings/:id/cancel   # Cancel Booking
```

### Messages

```
GET    /api/bookings/:id/messages # Get Messages for Booking
POST   /api/bookings/:id/messages # Send Message
```

### Admin

```
GET    /api/admin/freelancers/pending   # List Pending Freelancer Profiles
PATCH  /api/admin/freelancers/:id/approve # Approve Profile
PATCH  /api/admin/freelancers/:id/reject  # Reject Profile
GET    /api/admin/projects/open          # List Open Projects (for Matching)
POST   /api/admin/projects/:id/match     # Send Proposals to Company
PATCH  /api/admin/bookings/:id/mark-paid # Mark Payment as Received
```

### Invoices

```
GET    /api/invoices/:id          # Get Invoice
POST   /api/invoices              # Generate Invoice (after Completion)
```

---

## 12. Out of Scope (Explicit)

### Explizit NICHT in MVP (V1.0):

❌ **AI-Features:**
- AI Project Builder (V1.0, Monat 6)
- AI-Matching (V1.0, Monat 6)
- AI Career Coach (V1.0, Monat 8)
- AI Team Assembly (V1.0, Monat 10)

❌ **Advanced Payments:**
- Stripe Auto-Payments (V1.0, Monat 7)
- Escrow (V1.0, Monat 7)
- Auto-Invoicing (V1.0)

❌ **File-Handling:**
- Portfolio-Uploads (PDF, Images)
- Project-Attachments
- Profile-Pictures

❌ **Advanced Features:**
- Reviews & Ratings
- Referral Program
- Analytics Dashboards
- Advanced Search & Filters
- Saved Searches
- Email-Alerts

❌ **Integrations:**
- Calendar-Sync
- Slack/Teams-Integration
- Zoom/Meet-Integration
- LinkedIn-Import

❌ **Mobile:**
- Native Mobile Apps (iOS/Android)
- PWA (Progressive Web App)

❌ **Multi-Language:**
- Englisch (nur Deutsch im MVP)
- Weitere Sprachen

❌ **Advanced Messaging:**
- File-Sharing im Chat
- Read-Receipts
- Typing-Indicators
- Video-Calls

---

## 13. Assumptions & Risks

### 13.1 Assumptions

**A-001: User Behavior**
- Freelancer sind tech-savvy genug, um Profile selbst auszufüllen
- Firmen können Projekte klar beschreiben (ohne AI Project Builder im MVP)
- Beide Seiten nutzen Email regelmäßig (für Notifications)

**A-002: Technical**
- AWS hat 99.9%+ Uptime (RDS, ECS)
- Anthropic API ist verfügbar für V1.0 (später)
- Next.js + Prisma sind stabil genug für Production

**A-003: Business**
- 2% Provision ist attraktiv genug (vs. 10-16%)
- Manual Matching funktioniert für ersten 50 Projekte (dann AI)
- Firmen akzeptieren Trial Period als ausreichend (kein Escrow im MVP)

**A-004: Market**
- KI-Freelancer-Nachfrage bleibt hoch (nicht nur Hype)
- Deutsche Firmen zahlen für Qualität (kuratierte Plattform)
- Freelancer wechseln für 2% (vs. 10-16%)

---

### 13.2 Risks

**Verweis auf:** `RISK_ASSESSMENT.md` (detailliert in Phase 1)

**Top 3 Risks (aus Phase 1):**

**R-001: Scheinselbständigkeit (Score 9/12)**
- Mitigation: Anwalt (5.000€), AGB, Freelancer-Checks
- Status: Mitigierbar vor Launch

**R-002: Wettbewerb senkt Provisionen (Score 6/12)**
- Mitigation: Differenzierung durch AI-Features, First-Mover (6-9 Monate Vorsprung)
- Status: Strategisch adressiert

**R-003: Schlechte AI-Matches (Score 6/12)**
- Mitigation: Human-in-Loop (MVP = Manual Matching), Pilot Testing
- Status: MVP hat kein AI-Matching → Risiko aufgeschoben auf V1.0

---

## 14. Appendix

### 14.1 Supporting Documents

- **Business Case:** `BUSINESS_CASE.md` (Phase 1)
- **Market Research:** `deutscher-ai-it-freelancer-markt-2024.md` (Phase 1)
- **Competitor Analysis:** `COMPETITIVE_ANALYSIS_GERMANY.md` (Phase 1)
- **Risk Assessment:** `RISK_ASSESSMENT.md` (Phase 1)

### 14.2 Next Steps

**Phase 3: Architecture & Tech-Stack**
- Detailliertes DB-Schema (Prisma Schema)
- API-Design (tRPC Procedures)
- System-Architektur (Deployment, Scaling)
- Tech-Stack finalisieren
- Folder-Structure

**Skill:** `03-architecture`
**Timeline:** 2-3 Tage

---

## 15. PRD Approval & Sign-Off

**Status:** ✅ DRAFT COMPLETE - Ready for Review

**Next Action:**
- Review PRD (du selbst oder Stakeholder)
- Approve & Move to Phase 3 (Architecture)

**Sign-Off:**
- [ ] PRD reviewed and approved
- [ ] MVP Scope confirmed (16 User Stories, ~80 Points)
- [ ] Ready for Phase 3 (Architecture)

---

**PRD Version:** 1.0
**Created:** 27. Oktober 2025
**Last Updated:** 27. Oktober 2025
**Status:** Draft → Awaiting Approval
