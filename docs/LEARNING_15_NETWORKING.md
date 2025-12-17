# Learning 15: Networking

**Erstellt:** 2025-12-17
**Kontext:** AI-Freelancer-Plattform - Internet-Grundlagen verstehen

---

## Inhaltsverzeichnis

1. [Das Internet im Überblick](#1-das-internet-im-überblick)
2. [IP-Adressen und DNS](#2-ip-adressen-und-dns)
3. [TCP/IP und Ports](#3-tcpip-und-ports)
4. [HTTP/HTTPS](#4-httphttps)
5. [SSL/TLS und Zertifikate](#5-ssltls-und-zertifikate)
6. [CORS](#6-cors)
7. [CDN (Content Delivery Network)](#7-cdn-content-delivery-network)
8. [Load Balancing](#8-load-balancing)
9. [DNS für unser Projekt](#9-dns-für-unser-projekt)
10. [Debugging-Tools](#10-debugging-tools)

---

## 1. Das Internet im Überblick

### Was ist das Internet?

Das Internet ist ein **globales Netzwerk von Netzwerken**, die über standardisierte Protokolle kommunizieren.

### OSI-Modell (7 Schichten)

```
┌─────────────────────────────────────────────────┐
│ 7. Application (HTTP, FTP, SMTP)                │ ← Web Apps
├─────────────────────────────────────────────────┤
│ 6. Presentation (SSL/TLS, Encoding)             │ ← Verschlüsselung
├─────────────────────────────────────────────────┤
│ 5. Session (Verbindungsverwaltung)              │
├─────────────────────────────────────────────────┤
│ 4. Transport (TCP, UDP)                         │ ← Zuverlässigkeit
├─────────────────────────────────────────────────┤
│ 3. Network (IP, Routing)                        │ ← Adressierung
├─────────────────────────────────────────────────┤
│ 2. Data Link (Ethernet, WiFi)                   │
├─────────────────────────────────────────────────┤
│ 1. Physical (Kabel, Funk)                       │
└─────────────────────────────────────────────────┘
```

### Vereinfachtes TCP/IP-Modell

```
┌──────────────────────────┐
│ Application (HTTP, DNS)  │ ← Unsere Apps
├──────────────────────────┤
│ Transport (TCP, UDP)     │ ← Datenübertragung
├──────────────────────────┤
│ Internet (IP)            │ ← Routing
├──────────────────────────┤
│ Network Access (Ethernet)│ ← Hardware
└──────────────────────────┘
```

### Wie ein Request funktioniert

```
Browser tippt: weigele.art

1. DNS Lookup
   "weigele.art" → IP-Adresse (z.B. 52.28.45.123)

2. TCP Verbindung
   Browser ↔ Server (3-Way Handshake)

3. TLS Handshake
   Verschlüsselung aushandeln

4. HTTP Request
   GET / HTTP/1.1
   Host: weigele.art

5. HTTP Response
   HTTP/1.1 200 OK
   <html>...

6. Rendering
   Browser zeigt Seite an
```

---

## 2. IP-Adressen und DNS

### IP-Adressen

```
IPv4:
- 32 Bit, 4 Bytes
- Format: 192.168.1.1
- Max: ~4.3 Milliarden Adressen
- Problem: Knappheit!

IPv6:
- 128 Bit, 16 Bytes
- Format: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
- Kurz: 2001:db8:85a3::8a2e:370:7334
- Praktisch unbegrenzt
```

### Reservierte IP-Bereiche

```
Privat (nicht im Internet):
10.0.0.0/8       (10.0.0.0 - 10.255.255.255)
172.16.0.0/12    (172.16.0.0 - 172.31.255.255)
192.168.0.0/16   (192.168.0.0 - 192.168.255.255)

Loopback:
127.0.0.0/8      (localhost = 127.0.0.1)

AWS VPC Default:
10.0.0.0/16      (unsere VPC)
```

### DNS (Domain Name System)

```
DNS = "Telefonbuch des Internets"

Übersetzt: weigele.art → 52.28.45.123
```

### DNS-Hierarchie

```
Root (.)
├── com
│   ├── google.com
│   └── amazon.com
├── de
│   └── example.de
├── art
│   └── weigele.art  ← Unsere Domain
└── org
    └── wikipedia.org
```

### DNS Record-Typen

| Record | Zweck | Beispiel |
|--------|-------|----------|
| **A** | Domain → IPv4 | `weigele.art → 52.28.45.123` |
| **AAAA** | Domain → IPv6 | `weigele.art → 2001:db8::1` |
| **CNAME** | Domain → Domain | `www.weigele.art → weigele.art` |
| **MX** | Mail Server | `weigele.art → mail.provider.com` |
| **TXT** | Text (Verifizierung) | `"v=spf1 include:_spf.google.com"` |
| **NS** | Nameserver | `weigele.art → ns1.route53.aws` |

### DNS-Auflösung

```
1. Browser Cache
   ↓ (nicht gefunden)
2. OS Cache
   ↓ (nicht gefunden)
3. Router/ISP DNS
   ↓ (nicht gefunden)
4. Root DNS Server
   → "Frag .art Nameserver"
5. .art TLD Nameserver
   → "Frag Route53 für weigele.art"
6. Route53 (Authoritative)
   → "52.28.45.123"
7. Antwort cachen
8. IP an Browser
```

### DNS-Befehle

```bash
# DNS-Abfrage
nslookup weigele.art
dig weigele.art

# Alle Records
dig weigele.art ANY

# Bestimmter Record-Typ
dig weigele.art A
dig weigele.art MX
dig weigele.art TXT

# Mit bestimmtem DNS-Server
dig @8.8.8.8 weigele.art

# Trace (komplette Auflösung)
dig +trace weigele.art
```

---

## 3. TCP/IP und Ports

### TCP vs. UDP

```
TCP (Transmission Control Protocol):
├── Verbindungsorientiert
├── Zuverlässig (Acknowledgments)
├── Reihenfolge garantiert
├── Fehlerkorrektur
└── Für: HTTP, SSH, E-Mail, Datenbank

UDP (User Datagram Protocol):
├── Verbindungslos
├── Nicht zuverlässig
├── Keine Reihenfolge garantiert
├── Schneller (weniger Overhead)
└── Für: Video-Streaming, DNS, Gaming
```

### TCP 3-Way Handshake

```
Client                    Server
   │                         │
   │─── SYN ───────────────▶│  "Ich will verbinden"
   │                         │
   │◀─── SYN-ACK ───────────│  "OK, ich auch"
   │                         │
   │─── ACK ───────────────▶│  "Bestätigt"
   │                         │
   │    [Verbindung offen]   │
```

### Ports

```
Port = "Tür" zu einem Service auf einem Server

Ein Server hat 65.535 Ports (0-65534)

Well-Known Ports (0-1023):
- 20/21: FTP
- 22: SSH
- 25: SMTP (E-Mail senden)
- 53: DNS
- 80: HTTP
- 443: HTTPS
- 3306: MySQL
- 5432: PostgreSQL

Registered Ports (1024-49151):
- 3000: Dev Server (Next.js)
- 8080: Alternative HTTP
- 8443: Alternative HTTPS

Dynamic Ports (49152-65535):
- Für Client-Verbindungen
```

### Socket

```
Socket = IP + Port

Server-Socket: 52.28.45.123:443
Client-Socket: 192.168.1.100:52341

Verbindung = Client-Socket ↔ Server-Socket
```

---

## 4. HTTP/HTTPS

### HTTP (HyperText Transfer Protocol)

```
Textbasiertes Protokoll für Web-Kommunikation
- Request/Response Modell
- Stateless (jeder Request unabhängig)
- Port 80 (Standard)
```

### HTTP-Versionen

| Version | Jahr | Features |
|---------|------|----------|
| HTTP/1.0 | 1996 | Basis |
| HTTP/1.1 | 1997 | Keep-Alive, Chunked Transfer |
| HTTP/2 | 2015 | Multiplexing, Header Compression |
| HTTP/3 | 2022 | QUIC (UDP-basiert), Schneller |

### HTTP Request im Detail

```http
POST /api/freelancers HTTP/1.1        ← Request Line
Host: weigele.art                     ← Header
Content-Type: application/json
Authorization: Bearer eyJhbGc...
Accept: application/json
User-Agent: Mozilla/5.0
Content-Length: 142
                                      ← Leerzeile
{                                     ← Body
  "name": "Klaus Weigele",
  "skills": ["python", "langchain"]
}
```

### HTTP Response im Detail

```http
HTTP/1.1 201 Created                  ← Status Line
Content-Type: application/json
Location: /api/freelancers/789
Date: Tue, 15 Jan 2024 10:30:00 GMT
Cache-Control: no-cache
X-Request-Id: abc-123
Content-Length: 256
                                      ← Leerzeile
{                                     ← Body
  "id": "789",
  "name": "Klaus Weigele",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### HTTP Methods

```
Safe Methods (ändern nichts):
- GET: Daten abrufen
- HEAD: Nur Header (kein Body)
- OPTIONS: Verfügbare Methoden abfragen

Unsafe Methods (ändern Daten):
- POST: Neue Resource erstellen
- PUT: Resource ersetzen
- PATCH: Resource teilweise ändern
- DELETE: Resource löschen
```

### HTTP vs HTTPS

```
HTTP:
- Port 80
- Unverschlüsselt
- Jeder kann mitlesen!
- ❌ Nie für sensible Daten

HTTPS:
- Port 443
- TLS-verschlüsselt
- Sicher
- ✅ Standard für alles
```

---

## 5. SSL/TLS und Zertifikate

### Was ist TLS?

**TLS** (Transport Layer Security) verschlüsselt die Kommunikation zwischen Client und Server.

```
SSL = Vorgänger (veraltet)
TLS 1.0, 1.1 = Veraltet
TLS 1.2 = Noch akzeptabel
TLS 1.3 = Aktuell (empfohlen)
```

### TLS Handshake (vereinfacht)

```
Client                              Server
   │                                   │
   │──── ClientHello ────────────────▶│
   │     (unterstützte Cipher)         │
   │                                   │
   │◀─── ServerHello ─────────────────│
   │     (gewählter Cipher)            │
   │◀─── Certificate ─────────────────│
   │     (Server-Zertifikat)           │
   │                                   │
   │──── Key Exchange ───────────────▶│
   │     (verschlüsselter Key)         │
   │                                   │
   │     [Verschlüsselte Verbindung]   │
```

### Zertifikate

```
Ein SSL-Zertifikat enthält:
- Domain Name (weigele.art)
- Organisation (optional)
- Öffentlicher Schlüssel
- Gültigkeitszeitraum
- Aussteller (Certificate Authority)
- Signatur der CA
```

### Certificate Chain

```
Root CA (im Browser eingebaut)
├── Intermediate CA
│   └── weigele.art Zertifikat
```

### Zertifikat-Typen

| Typ | Validierung | Für |
|-----|-------------|-----|
| **DV** (Domain Validated) | Domain-Besitz | Kleine Sites, Blogs |
| **OV** (Organization Validated) | + Firmenprüfung | Firmen-Websites |
| **EV** (Extended Validation) | + Tiefe Prüfung | Banken, E-Commerce |
| **Wildcard** | *.domain.com | Subdomains |

### Let's Encrypt & AWS ACM

```
Let's Encrypt:
- Kostenlos
- 90 Tage gültig
- Auto-Renewal möglich

AWS ACM (Amazon Certificate Manager):
- Kostenlos für AWS-Dienste
- Auto-Renewal
- Wir nutzen: *.weigele.art
```

### Zertifikat prüfen

```bash
# Im Browser: Schloss-Symbol klicken

# Kommandozeile:
openssl s_client -connect weigele.art:443 -servername weigele.art

# Zertifikat-Details
openssl s_client -connect weigele.art:443 | openssl x509 -noout -text

# Ablaufdatum
openssl s_client -connect weigele.art:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 6. CORS

### Was ist CORS?

**CORS** (Cross-Origin Resource Sharing) kontrolliert, welche Domains auf eine API zugreifen dürfen.

### Same-Origin Policy

```
Browser blockiert standardmäßig Requests zu anderen Origins!

Origin = Protocol + Host + Port

https://weigele.art:443  ← Origin 1
https://api.weigele.art:443  ← Andere Origin!
http://weigele.art:80  ← Andere Origin! (HTTP vs HTTPS)
```

### CORS-Ablauf

```
1. Browser will Request an andere Origin senden
2. Browser sendet erst "Preflight" (OPTIONS Request)
3. Server antwortet mit CORS-Headern
4. Browser prüft Header
5. Bei Erlaubnis: Eigentlicher Request
```

### Preflight Request

```http
OPTIONS /api/freelancers HTTP/1.1
Host: api.weigele.art
Origin: https://weigele.art
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization
```

### Preflight Response

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://weigele.art
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

### CORS-Header

| Header | Bedeutung |
|--------|-----------|
| `Access-Control-Allow-Origin` | Erlaubte Origin(s) |
| `Access-Control-Allow-Methods` | Erlaubte HTTP-Methoden |
| `Access-Control-Allow-Headers` | Erlaubte Request-Header |
| `Access-Control-Allow-Credentials` | Cookies erlaubt? |
| `Access-Control-Max-Age` | Preflight-Cache-Zeit |

### CORS in Next.js

```typescript
// src/app/api/freelancers/route.ts
import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://weigele.art',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET() {
  const data = await getFreelancers();

  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': 'https://weigele.art',
    },
  });
}
```

### CORS-Probleme debuggen

```
Browser Console:

❌ "Access to fetch at 'https://api.example.com' from origin
   'https://example.com' has been blocked by CORS policy"

Lösung:
1. Server muss CORS-Header senden
2. Origin muss erlaubt sein
3. Methode muss erlaubt sein
4. Custom Headers müssen erlaubt sein
```

---

## 7. CDN (Content Delivery Network)

### Was ist ein CDN?

Ein **CDN** verteilt Inhalte auf Server weltweit, um Latenz zu reduzieren.

```
Ohne CDN:
User (Sydney) ──────────────────────▶ Server (Frankfurt)
                   ~300ms Latenz

Mit CDN:
User (Sydney) ────▶ CDN Edge (Sydney) ─Cache Hit─▶ Response
                   ~30ms Latenz
```

### Wie funktioniert ein CDN?

```
1. Erster Request:
   User → Edge (Cache Miss) → Origin → Edge (Cache) → User

2. Weitere Requests:
   User → Edge (Cache Hit) → User  ← Viel schneller!
```

### AWS CloudFront (unser CDN)

```
CloudFront Features:
├── Edge Locations weltweit (~450)
├── HTTPS Termination
├── Komprimierung (gzip, brotli)
├── Cache-Control
├── Custom Headers
├── Lambda@Edge (Code am Edge)
└── WAF Integration (DDoS-Schutz)
```

### CloudFront Caching

```
Cache-Hierarchie:
1. Edge Location (Regional)
2. Regional Edge Cache
3. Origin (unser Server)

Cache-Kontrolle via Header:
Cache-Control: max-age=3600        # 1 Stunde cachen
Cache-Control: no-cache            # Immer validieren
Cache-Control: no-store            # Nie cachen
Cache-Control: private             # Nur Browser, nicht CDN
Cache-Control: public, max-age=31536000  # 1 Jahr (static assets)
```

### Unsere CloudFront-Konfiguration

```
weigele.art
    ↓
CloudFront (HTTPS)
    ↓
    ├── /static/* → S3 Bucket (Static Assets)
    │              Cache: 1 Jahr
    │
    └── /* → ALB → ECS (Next.js)
            Cache: Dynamisch
```

---

## 8. Load Balancing

### Was ist Load Balancing?

**Load Balancing** verteilt Traffic auf mehrere Server.

```
Ohne LB:
Users ────────────────▶ Ein Server 😰
                        (Überlastet)

Mit LB:
         ┌───────────▶ Server 1
Users ───┤
         └───────────▶ Server 2
         Load Balancer (verteilt)
```

### Load Balancing Algorithmen

```
1. Round Robin
   Request 1 → Server 1
   Request 2 → Server 2
   Request 3 → Server 1
   ...

2. Least Connections
   Neuer Request → Server mit wenigsten Verbindungen

3. IP Hash
   Hash(Client IP) → Immer gleicher Server
   (für Session-Sticky)

4. Weighted
   Server 1: 70% Traffic
   Server 2: 30% Traffic
```

### AWS Application Load Balancer (ALB)

```
ALB Features:
├── Layer 7 (HTTP/HTTPS)
├── Path-basiertes Routing
├── Host-basiertes Routing
├── Health Checks
├── SSL Termination
├── Sticky Sessions
└── WebSocket Support

Unsere Konfiguration:
ALB
├── Target Group: ECS Tasks
├── Health Check: /api/health
├── Port: 3000
└── Protocol: HTTP (SSL am CloudFront)
```

### Health Checks

```
ALB prüft regelmäßig:

GET /api/health HTTP/1.1

Healthy Response:
HTTP/1.1 200 OK
{ "status": "healthy" }

Unhealthy Response:
HTTP/1.1 503 Service Unavailable
{ "status": "unhealthy" }

→ Unhealthy Targets bekommen keinen Traffic
```

---

## 9. DNS für unser Projekt

### Route 53 Konfiguration

```
Hosted Zone: weigele.art

Records:
├── weigele.art          A (Alias)  → CloudFront Distribution
├── www.weigele.art      CNAME      → weigele.art
├── api.weigele.art      A (Alias)  → ALB (falls direkt)
└── _acme-challenge      TXT        → (für SSL-Validierung)
```

### Terraform für Route 53

```hcl
# Route 53 Hosted Zone
resource "aws_route53_zone" "main" {
  name = "weigele.art"
}

# A Record für CloudFront
resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "weigele.art"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.main.domain_name
    zone_id                = aws_cloudfront_distribution.main.hosted_zone_id
    evaluate_target_health = false
  }
}

# CNAME für www
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.weigele.art"
  type    = "CNAME"
  ttl     = 300
  records = ["weigele.art"]
}
```

### DNS Propagation

```
DNS-Änderungen brauchen Zeit zur Verbreitung:

TTL (Time To Live):
- Niedrig (60s): Schnelle Updates, mehr DNS-Anfragen
- Hoch (86400s): Langsame Updates, weniger Anfragen

Empfehlung:
- Vor Migration: TTL senken (z.B. 60s)
- Migration durchführen
- Warten bis alte TTL abgelaufen
- Nach Migration: TTL wieder erhöhen
```

---

## 10. Debugging-Tools

### Browser DevTools - Network Tab

```
Informationen pro Request:
├── URL, Method, Status
├── Headers (Request & Response)
├── Timing (DNS, Connect, TLS, Waiting, Download)
├── Size (Compressed, Uncompressed)
├── Initiator (was hat Request ausgelöst)
└── Preview/Response Body
```

### curl

```bash
# Einfacher GET Request
curl https://weigele.art

# Mit Headern
curl -I https://weigele.art

# POST mit Daten
curl -X POST https://weigele.art/api/test \
  -H "Content-Type: application/json" \
  -d '{"name": "test"}'

# Mit Auth
curl -H "Authorization: Bearer token123" \
  https://weigele.art/api/protected

# Verbose (zeigt alles)
curl -v https://weigele.art

# Timing-Infos
curl -w "@curl-format.txt" -o /dev/null -s https://weigele.art

# SSL-Infos
curl -vI https://weigele.art 2>&1 | grep -A 6 "SSL connection"
```

### curl-format.txt

```
     time_namelookup:  %{time_namelookup}s\n
        time_connect:  %{time_connect}s\n
     time_appconnect:  %{time_appconnect}s\n
    time_pretransfer:  %{time_pretransfer}s\n
       time_redirect:  %{time_redirect}s\n
  time_starttransfer:  %{time_starttransfer}s\n
                     ----------\n
          time_total:  %{time_total}s\n
```

### ping & traceroute

```bash
# Erreichbarkeit prüfen
ping weigele.art

# Route zum Server
traceroute weigele.art
# oder auf macOS:
traceroute weigele.art

# Windows:
tracert weigele.art
```

### netstat & lsof

```bash
# Offene Ports anzeigen
netstat -an | grep LISTEN

# Welcher Prozess nutzt Port 3000?
lsof -i :3000

# Alle Verbindungen eines Prozesses
lsof -i -P -n | grep node
```

### dig (DNS)

```bash
# Standard-Abfrage
dig weigele.art

# Nur Antwort
dig +short weigele.art

# Alle Record-Typen
dig weigele.art ANY

# Mit bestimmtem DNS-Server
dig @8.8.8.8 weigele.art

# Komplette Auflösungskette
dig +trace weigele.art
```

### openssl (SSL/TLS)

```bash
# Verbindung testen
openssl s_client -connect weigele.art:443

# Zertifikat anzeigen
openssl s_client -connect weigele.art:443 2>/dev/null | \
  openssl x509 -noout -text

# Ablaufdatum
openssl s_client -connect weigele.art:443 2>/dev/null | \
  openssl x509 -noout -dates

# TLS-Version prüfen
openssl s_client -connect weigele.art:443 -tls1_3
```

### Netzwerk-Cheatsheet

```bash
# DNS auflösen
dig weigele.art +short

# HTTP Request
curl -I https://weigele.art

# Port offen?
nc -zv weigele.art 443

# SSL-Zertifikat
openssl s_client -connect weigele.art:443

# Lokale Ports
lsof -i :3000

# Routing
traceroute weigele.art

# Bandbreite testen
curl -o /dev/null -w "Speed: %{speed_download}\n" https://weigele.art
```

---

## Zusammenfassung für unser Projekt

```
User Request Flow:

1. Browser: weigele.art
   ↓
2. DNS (Route 53): weigele.art → CloudFront IP
   ↓
3. CloudFront (CDN):
   - SSL Termination (TLS 1.3)
   - Caching für Static Assets
   - Komprimierung
   ↓
4. ALB (Load Balancer):
   - Health Checks
   - Routing zu ECS Tasks
   ↓
5. ECS (Container):
   - Next.js App
   - API Requests
   ↓
6. RDS (Database):
   - PostgreSQL
   - Private Subnet
   ↓
7. Response zurück durch alle Layer
```

---

## Ressourcen

- [How DNS Works](https://howdns.works/)
- [High Performance Browser Networking](https://hpbn.co/)
- [MDN: HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [AWS Networking Basics](https://aws.amazon.com/getting-started/fundamentals-core-concepts/)
- [Cloudflare Learning Center](https://www.cloudflare.com/learning/)
