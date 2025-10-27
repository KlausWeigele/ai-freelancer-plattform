# ADR-005: Use AWS for Hosting (EU Data Residency)

## Status

✅ **Accepted**

**Date:** 27. Oktober 2025

## Context

Die AI-Freelancer-Plattform muss deployed werden mit folgenden Requirements:
- **DSGVO-Compliance:** EU Data Residency (Deutschland)
- **Scalability:** 50 users (MVP) → 500+ (V1.0)
- **Reliability:** 99.5% Uptime (MVP) → 99.9% (Production)
- **Security:** HTTPS, Encrypted Storage, Backups
- **Cost:** Budget 2k€/Monat (Running Costs)

## Decision

Ich verwende **AWS (Amazon Web Services)** mit **Region eu-central-1 (Frankfurt)**.

### AWS Services Used

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS Infrastructure                        │
├─────────────────────────────────────────────────────────────┤
│  • ECS Fargate       - Container Hosting (Next.js App)      │
│  • RDS PostgreSQL    - Database (Managed)                   │
│  • S3                - File Storage (später)                 │
│  • CloudFront        - CDN (Static Assets)                  │
│  • Certificate Mgr   - SSL/TLS Certificates                 │
│  • Route 53          - DNS Management                       │
│  • CloudWatch        - Monitoring & Logs                    │
│  • Parameter Store   - Secrets Management                   │
│  • SES               - Email Service                        │
│  • ECR               - Docker Registry                      │
└─────────────────────────────────────────────────────────────┘
```

## Rationale

### Why AWS?

**1. DSGVO-Compliance**
- ✅ EU Region (Frankfurt, eu-central-1)
- ✅ Data Residency: Alle Daten bleiben in Deutschland
- ✅ GDPR-compliant (AWS BAA verfügbar)
- ✅ Encryption at Rest (RDS, S3)

**2. Mature Ecosystem**
- ✅ 15+ Jahre AWS Erfahrung (etabliert)
- ✅ Große Community, viele Tutorials
- ✅ Support (falls nötig)

**3. Managed Services**
- ✅ RDS: Automated Backups, Multi-AZ, Monitoring
- ✅ ECS: Container Orchestration, Auto-Scaling
- ✅ CloudWatch: Logs, Metrics, Alarms (built-in)

**4. Scalability**
- ✅ ECS Auto-Scaling (CPU/Memory Thresholds)
- ✅ RDS Read Replicas (später)
- ✅ CloudFront CDN (global distribution)

**5. Cost**
- ✅ Pay-as-you-go (keine upfront costs)
- ✅ Free Tier (12 Monate, RDS, EC2)
- ✅ Cost-effective für MVP (50 users: ~200-300€/Monat)

## Alternatives Considered

### Alternative 1: Vercel

**Pros:**
- ✅ Next.js-native (zero-config deployment)
- ✅ Einfachstes Setup
- ✅ Automatic HTTPS, CDN
- ✅ Serverless (keine Infra-Verwaltung)

**Cons:**
- ❌ **KEINE EU Data Residency** (USA-basiert)
- ❌ DSGVO-kritisch (Daten könnten in USA liegen)
- ❌ Keine Kontrolle über DB-Location
- ❌ Teurer bei Scale (Serverless Premium)

**Warum nicht gewählt:**
DSGVO-Compliance ist kritisch. Vercel hat keine garantierte EU-Data-Residency. AWS Frankfurt ist sicherer.

**Wann Vercel?**
- Nicht-DSGVO-kritische Apps
- Prototyping
- Global Deployment

### Alternative 2: Google Cloud Platform (GCP)

**Pros:**
- ✅ EU Region (Belgium, Frankfurt)
- ✅ DSGVO-compliant
- ✅ Cloud Run (ähnlich ECS Fargate)
- ✅ Good performance

**Cons:**
- ❌ Weniger etabliert als AWS (kleineres Ecosystem)
- ❌ Weniger Tutorials für Next.js
- ❌ GCP-Kenntnisse nötig (Learning Curve)

**Warum nicht gewählt:**
AWS ist etablierter, mehr Community-Ressourcen. GCP wäre auch ok, aber AWS ist "safer choice".

**Wann GCP?**
- Wenn bereits GCP-Erfahrung
- Wenn Google-Services genutzt (BigQuery, etc.)

### Alternative 3: Hetzner Cloud (Germany)

**Pros:**
- ✅ **Deutscher Anbieter** (DSGVO-optimal)
- ✅ Sehr günstig (3-10x billiger als AWS)
- ✅ EU-Datacenter (Falkenstein, Nürnberg)
- ✅ Good performance

**Cons:**
- ❌ **Weniger Managed Services** (mehr selbst managen)
- ❌ Kein RDS (PostgreSQL selbst verwalten)
- ❌ Kein CloudWatch (Monitoring selbst setup)
- ❌ Kleineres Ecosystem

**Warum nicht gewählt:**
Für Solo-Dev sind Managed Services wichtiger als Kosten. RDS + ECS + CloudWatch sparen viel Zeit. Hetzner wäre günstiger, aber mehr Aufwand.

**Wann Hetzner?**
- Wenn Budget sehr knapp (<500€/Monat)
- Wenn DevOps-Erfahrung vorhanden
- Später, wenn mehr Kontrolle gewünscht

### Alternative 4: Self-Hosted (VPS)

**Pros:**
- ✅ Volle Kontrolle
- ✅ Günstig (Hetzner VPS: 20-50€/Monat)

**Cons:**
- ❌ **Alles selbst managen** (DB, Backups, Monitoring, Scaling)
- ❌ Kein High Availability
- ❌ Zeitaufwändig

**Warum nicht gewählt:**
Solo-Dev sollte sich auf Produkt fokussieren, nicht auf Infra. Managed Services sind wichtiger.

## Trade-offs

### Pros (AWS)

1. **DSGVO-Compliant**
   - EU Data Residency garantiert
   - Wichtig für deutsches B2B-Geschäft

2. **Managed Services**
   - RDS: Backups, Monitoring, Scaling automatisch
   - ECS: Container-Orchestration
   - CloudWatch: Logging, Alerting

3. **Reliability**
   - 99.99% SLA (RDS Multi-AZ)
   - Battle-tested (Netflix, Airbnb, etc.)

4. **Scalability**
   - Auto-Scaling out-of-the-box
   - Horizontal + Vertical Scaling

### Cons (AWS)

1. **Complexity**
   - Viele Services, steile Lernkurve
   - IAM, VPC, Security Groups
   - **Mitigation:** Start simple (MVP), mehr später

2. **Cost**
   - Teurer als Hetzner (2-3x)
   - Kann teuer werden bei schlechter Optimierung
   - **Mitigation:** Cost Alerts, tagging, regelmäßige Reviews

3. **Vendor Lock-in**
   - ECS ist AWS-specific
   - Migration zu GCP/Azure aufwendig
   - **Mitigation:** Docker (portabel), Kubernetes (später)

## Implementation: MVP Architecture

### ECS Fargate (Next.js App)

```yaml
Service: freelancer-service
Cluster: freelancer-cluster
Task Definition:
  Image: ECR (freelancer-app:latest)
  CPU: 0.5 vCPU (MVP) → 2 vCPU (Production)
  Memory: 1 GB (MVP) → 4 GB (Production)
  Port: 3000
  Environment Variables: Parameter Store

Desired Count: 1 (MVP) → 3+ (Production)
Auto-Scaling:
  Min: 1
  Max: 5
  Target: CPU 70%
```

**Cost Estimate (MVP):**
- 1 Task (0.5 vCPU, 1 GB): ~30€/Monat

### RDS PostgreSQL

```yaml
Instance: db.t3.micro (MVP) → db.t3.medium (Production)
Storage: 20 GB (General Purpose SSD)
Backups: Automated (7 days retention)
Multi-AZ: No (MVP) → Yes (Production)
Region: eu-central-1 (Frankfurt)
Encryption: At Rest (AWS KMS)
```

**Cost Estimate (MVP):**
- db.t3.micro: ~15€/Monat
- Storage 20GB: ~3€/Monat

### S3 + CloudFront

```yaml
S3:
  Bucket: freelancer-assets
  Region: eu-central-1
  Encryption: AES-256
  Versioning: Enabled

CloudFront:
  Origin: S3 Bucket
  SSL: AWS Certificate Manager (free)
  Caching: 24h TTL
```

**Cost Estimate (MVP):**
- S3: ~5€/Monat (10 GB storage, wenig traffic)
- CloudFront: ~10€/Monat (low traffic)

### Total Cost Estimate

```
MVP (50 users):
  - ECS Fargate:        30€/Monat
  - RDS PostgreSQL:     18€/Monat
  - S3 + CloudFront:    15€/Monat
  - SES (Email):         5€/Monat
  - Route 53 + Misc:    10€/Monat
  ---------------------------------
  Total:               ~80€/Monat

Production (500 users):
  - ECS Fargate (3x):  180€/Monat
  - RDS (db.t3.medium): 100€/Monat
  - S3 + CloudFront:    50€/Monat
  - SES:                20€/Monat
  - CloudWatch:         30€/Monat
  - Route 53 + Misc:    20€/Monat
  ---------------------------------
  Total:              ~400€/Monat
```

## Security Measures

✅ **Network Security:**
- VPC (Virtual Private Cloud)
- Security Groups (Firewall Rules)
- HTTPS only (CloudFront + ALB)

✅ **Data Security:**
- RDS Encryption at Rest (AWS KMS)
- S3 Encryption (AES-256)
- Parameter Store (Secrets)

✅ **Access Control:**
- IAM Roles (Principle of Least Privilege)
- No root access
- MFA enabled

✅ **Compliance:**
- EU Data Residency (Frankfurt)
- GDPR-compliant
- Regular Backups (7 days)

## Consequences

### Positive

1. **DSGVO-Compliant**
   - Alle Daten in Deutschland
   - Wichtig für Enterprise-Kunden

2. **Reliable**
   - 99.99% SLA (RDS Multi-AZ)
   - Automated Backups

3. **Scalable**
   - Auto-Scaling möglich
   - Wächst mit Projekt

### Negative

1. **Complexity**
   - Viele Services zu lernen
   - **Mitigation:** Start simple, expand later

2. **Cost**
   - Teurer als Hetzner
   - **Mitigation:** Budget Alerts, Optimierung

## Follow-up Actions

- [ ] AWS Account erstellen (mit MFA)
- [ ] IAM User + Roles erstellen
- [ ] VPC + Security Groups setup
- [ ] RDS PostgreSQL Instance erstellen
- [ ] ECS Cluster + Task Definition
- [ ] CloudFront Distribution
- [ ] Route 53 Domain registrieren
- [ ] CI/CD Pipeline (GitHub Actions → ECR → ECS)

## References

- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS GDPR Center](https://aws.amazon.com/compliance/gdpr-center/)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)

---

**Author:** Klaus Weigele
**Date:** 27. Oktober 2025
**Status:** Accepted
