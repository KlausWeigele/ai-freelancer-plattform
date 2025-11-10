# AI-Freelancer-Plattform - Deployment Checkliste

**Ziel:** Deployment auf **weigele.art** mit CloudFront + ECS + RDS
**Start:** 2025-11-10
**Geschätzte Dauer:** 5-7 Tage (12-15 Stunden)

---

## 📊 Fortschritt Overview

| Phase                       | Tasks  | Implementiert | Getestet | Status       |
| --------------------------- | ------ | ------------- | -------- | ------------ |
| **Phase 0: Bestand**        | 9      | 9/9 ✅        | 0/9      | Vorhanden    |
| **Phase 1: Next.js**        | 3      | 3/3 ✅        | 3/3 ✅   | ✅ Complete  |
| **Phase 2: AWS Setup**      | 4      | 0/4           | 0/4      | 🔴 Todo      |
| **Phase 3: Terraform**      | 8      | 0/8           | 0/8      | 🔴 Todo      |
| **Phase 4: CloudFront**     | 4      | 0/4           | 0/4      | 🔴 Todo      |
| **Phase 5: GitHub Actions** | 3      | 0/3           | 0/3      | 🔴 Todo      |
| **Phase 6: Migrations**     | 2      | 0/2           | 0/2      | 🔴 Todo      |
| **Phase 7: Rollout**        | 6      | 0/6           | 0/6      | 🔴 Todo      |
| **GESAMT**                  | **39** | **12/39**     | **3/39** | **31% Done** |

---

## Phase 0: Bestehende Infrastruktur ✅

> Diese Ressourcen existieren bereits und werden wiederverwendet

### Route 53 & DNS

- [x] Implementiert
- [ ] Getestet
- **Ressource:** Route 53 Hosted Zone `weigele.art` (Z05025201BQ9KO181NQS8)
- **Kosten:** $0.50/Monat
- **Status:** ✅ Aktiv
- **Notizen:** 7 DNS Records vorhanden, CloudFront Alias aktiv

### CloudFront Distribution

- [x] Implementiert
- [ ] Getestet
- **Ressource:** CloudFront Distribution `E10XAH9K76973M`
- **Domains:** weigele.art, www.weigele.art
- **Kosten:** Free Tier, dann pay-per-use
- **Status:** ✅ Aktiv (Origin fehlt momentan)
- **Notizen:** Functions für www→apex redirect vorhanden

### ACM Certificate

- [x] Implementiert
- [ ] Getestet
- **Ressource:** SSL Certificate für `weigele.art` (us-east-1)
- **Status:** ✅ Issued, von CloudFront genutzt
- **Kosten:** Kostenlos

### Terraform State Backend

- [x] Implementiert
- [ ] Getestet
- **S3 Bucket:** `weigele-terraform-state`
- **DynamoDB Table:** `weigele-terraform-locks`
- **Status:** ✅ Vorhanden, leer
- **Kosten:** ~$0.002/Monat

### GitHub Repository

- [x] Implementiert
- [ ] Getestet
- **Repository:** `https://github.com/KlausWeigele/ai-freelancer-plattform.git`
- **Branch:** master
- **Status:** ✅ Konfiguriert
- **Secrets:** 4 Secrets (DATABASE_URL, JWT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL)

### Docker Setup

- [x] Implementiert
- [ ] Getestet
- **Files:** Dockerfile, docker-compose.yml, docker-compose.prod.yml
- **Status:** ✅ Vollständig
- **Notizen:** Multi-stage build, optimiert für Production

### GitHub Actions CI/CD

- [x] Implementiert
- [ ] Getestet
- **Workflows:** ci.yml, nightly.yml, deploy-production.yml
- **Status:** ✅ Vollständig, aber Deployment-Targets auskommentiert
- **Notizen:** Bereit für AWS Integration

### Dokumentation

- [x] Implementiert
- [ ] Getestet
- **Files:** deployment-guide.md, terraform/README.md, docker/README.md, ARCHITECTURE.md
- **Status:** ✅ Umfassend (806+ Zeilen)

### ADR (Architecture Decision Records)

- [x] Implementiert
- [ ] Getestet
- **Files:** ADR-001 bis ADR-006
- **Status:** ✅ 6 ADRs dokumentiert (inkl. Terraform ADR-006)

---

## Phase 1: Next.js Optimierungen

**Dauer:** ~30 Minuten
**Abhängigkeiten:** Keine

### 1.1 Next.js Standalone Output aktivieren

- [x] Implementiert
- [x] Getestet
- **File:** `next.config.js`
- **Change:** `output: 'standalone'` hinzufügen ✅
- **Zweck:** Docker Image Size von ~1GB auf ~150MB reduzieren
- **Test:** `pnpm build` → Prüfe `.next/standalone/` Ordner ✅
- **Result:** ✅ Standalone output: 147 MB (2025-11-10)

### 1.2 Health Check Endpoint implementieren

- [x] Implementiert
- [x] Getestet
- **File:** `src/app/api/health/route.ts` ✅
- **Funktionalität:**
  - Database Connection Check (Prisma) ✅
  - Return: `{ status: "ok", timestamp, version, database: "connected" }` ✅
  - Error Handling: Return 503 bei Fehler ✅
- **Test:** `curl http://localhost:3000/api/health` ✅
- **Result:** ✅ Returns 503 when DB disconnected, 200 when connected (2025-11-10)

### 1.3 Version Endpoint implementieren

- [x] Implementiert
- [x] Getestet
- **File:** `src/app/api/version/route.ts` ✅
- **Funktionalität:**
  - Return: `{ version: "0.1.0", commit: "17754e1", buildTime, environment }` ✅
  - Version aus package.json + Git commit hash ✅
- **Test:** `curl http://localhost:3000/api/version` ✅
- **Result:** ✅ Returns version 0.1.0, commit 17754e1, Node v22.20.0 (2025-11-10)

---

## Phase 2: AWS Account Setup

**Dauer:** ~1-2 Stunden
**Abhängigkeiten:** AWS Account mit Admin-Zugang

### 2.1 IAM User für Terraform erstellen

- [ ] Implementiert
- [ ] Getestet
- **AWS Console:** IAM → Users → Add User
- **Username:** `terraform-freelancer-app`
- **Access Type:** Programmatic access
- **Policies:**
  - `AmazonEC2FullAccess`
  - `AmazonECSFullAccess`
  - `AmazonRDSFullAccess`
  - `AmazonS3FullAccess`
  - `AmazonVPCFullAccess`
  - `ElasticLoadBalancingFullAccess`
  - `AmazonRoute53ReadOnlyAccess` (nur read für weigele.art)
  - `CloudFrontFullAccess`
  - `AmazonEC2ContainerRegistryFullAccess` (ECR)
- **Output:** Access Key ID + Secret Access Key (sicher speichern!)
- **Test:** `aws configure` mit neuen Credentials → `aws sts get-caller-identity`

### 2.2 ECR Repository erstellen

- [ ] Implementiert
- [ ] Getestet
- **Command:**
  ```bash
  aws ecr create-repository \
    --repository-name freelancer-app \
    --region eu-central-1 \
    --image-scanning-configuration scanOnPush=true
  ```
- **Output:** Repository URI (z.B. `093205941484.dkr.ecr.eu-central-1.amazonaws.com/freelancer-app`)
- **Test:**
  ```bash
  aws ecr describe-repositories --region eu-central-1
  docker login zu ECR
  ```

### 2.3 Terraform State Backend konfigurieren

- [ ] Implementiert
- [ ] Getestet
- **S3 Bucket:** Bereits vorhanden (`weigele-terraform-state`)
- **DynamoDB Table:** Bereits vorhanden (`weigele-terraform-locks`)
- **Action:** Konfiguration in Terraform Backend Block
- **Test:** `terraform init` in dev environment

### 2.4 GitHub Secrets hinzufügen

- [ ] Implementiert
- [ ] Getestet
- **Via GitHub CLI:**
  ```bash
  gh secret set AWS_ACCESS_KEY_ID --body "AKIA..."
  gh secret set AWS_SECRET_ACCESS_KEY --body "..."
  gh secret set AWS_ACCOUNT_ID --body "093205941484"
  gh secret set ECR_REPOSITORY_URL --body "093205941484.dkr.ecr.eu-central-1.amazonaws.com/freelancer-app"
  gh secret set AWS_REGION --body "eu-central-1"
  ```
- **Test:** `gh secret list` → Alle Secrets sichtbar

---

## Phase 3: Terraform Infrastructure

**Dauer:** ~3-5 Stunden
**Abhängigkeiten:** Phase 2 komplett

### 3.1 Terraform Networking Module erstellen

- [ ] Implementiert
- [ ] Getestet
- **File:** `terraform/modules/networking/main.tf`
- **Ressourcen:**
  - VPC (10.0.0.0/16)
  - 2 Public Subnets (10.0.1.0/24, 10.0.2.0/24) in 2 AZs
  - 2 Private Subnets (10.0.11.0/24, 10.0.12.0/24) in 2 AZs
  - Internet Gateway
  - NAT Gateway (1x für dev, 2x für prod)
  - Route Tables (public, private)
  - Security Groups:
    - ALB SG (80, 443 → Internet)
    - ECS SG (3000 → ALB)
    - RDS SG (5432 → ECS)
- **Outputs:** vpc_id, subnet_ids, security_group_ids
- **Test:** `terraform plan` → Alle Ressourcen geplant

### 3.2 Terraform RDS Module erstellen

- [ ] Implementiert
- [ ] Getestet
- **File:** `terraform/modules/rds/main.tf`
- **Ressourcen:**
  - RDS PostgreSQL Instance
  - Instance Class: Variable (db.t3.micro/small)
  - Storage: 20 GB GP3, auto-scaling bis 100 GB
  - DB Subnet Group (private subnets)
  - Parameter Group (PostgreSQL 15)
  - Security Group (aus networking module)
  - Automated Backups: 7 Tage
  - Encryption: Enabled
  - Multi-AZ: Variable (false für dev, true für prod)
- **Outputs:** db_endpoint, db_port, db_name
- **Test:** `terraform plan` → RDS Instance geplant

### 3.3 Terraform ECS Module erstellen

- [ ] Implementiert
- [ ] Getestet
- **File:** `terraform/modules/ecs/main.tf`
- **Ressourcen:**
  - ECS Cluster
  - ECS Task Definition:
    - CPU: 256 (0.25 vCPU)
    - Memory: 512 MB
    - Container: ECR Image
    - Environment Variables: DATABASE_URL, NEXTAUTH_SECRET, etc.
    - Logs: CloudWatch
  - ECS Service:
    - Launch Type: Fargate
    - Desired Count: Variable (1 dev, 2+ prod)
    - Network: Private Subnets
    - Load Balancer: Target Group
    - Health Check: `/api/health`
  - Application Load Balancer:
    - Scheme: Internet-facing
    - Subnets: Public Subnets
    - Security Group: ALB SG
    - SSL Certificate: Existing ACM Certificate ARN
  - Target Group:
    - Port: 3000
    - Health Check: `/api/health`
    - Deregistration Delay: 30s
  - ALB Listener (HTTPS:443):
    - SSL Certificate
    - Forward to Target Group
  - ALB Listener (HTTP:80):
    - Redirect to HTTPS
- **Outputs:** alb_dns_name, ecs_cluster_id, ecs_service_name
- **Test:** `terraform plan` → ECS + ALB geplant

### 3.4 Terraform CloudWatch Module erstellen

- [ ] Implementiert
- [ ] Getestet
- **File:** `terraform/modules/monitoring/main.tf`
- **Ressourcen:**
  - CloudWatch Log Group (ECS Container Logs)
  - CloudWatch Alarms:
    - ECS CPU > 80%
    - ECS Memory > 80%
    - ALB Target 5xx > 10
    - RDS CPU > 80%
    - RDS Disk Space < 20%
- **Outputs:** log_group_name
- **Test:** `terraform plan` → Monitoring geplant

### 3.5 Development Environment konfigurieren

- [ ] Implementiert
- [ ] Getestet
- **File:** `terraform/environments/dev/main.tf`
- **Configuration:**
  - VPC mit 2 AZs
  - 1 NAT Gateway
  - RDS: db.t3.micro, Single-AZ
  - ECS: 1 Task
  - Environment: dev
- **File:** `terraform/environments/dev/terraform.tfvars`
  ```hcl
  environment = "dev"
  db_instance_class = "db.t3.micro"
  ecs_desired_count = 1
  multi_az = false
  ```
- **Test:** `terraform init && terraform plan`

### 3.6 Staging Environment konfigurieren

- [ ] Implementiert
- [ ] Getestet
- **File:** `terraform/environments/staging/main.tf`
- **Configuration:**
  - VPC mit 2 AZs
  - 2 NAT Gateways
  - RDS: db.t3.small, Multi-AZ
  - ECS: 2 Tasks
  - Environment: staging
- **Test:** `terraform plan`

### 3.7 Production Environment konfigurieren

- [ ] Implementiert
- [ ] Getestet
- **File:** `terraform/environments/production/main.tf`
- **Configuration:**
  - VPC mit 2 AZs
  - 2 NAT Gateways
  - RDS: db.t3.small, Multi-AZ
  - ECS: 3+ Tasks, Auto-scaling
  - Enhanced Monitoring
  - Environment: production
- **Test:** `terraform plan`

### 3.8 Dev Environment deployen (erster Test!)

- [ ] Implementiert
- [ ] Getestet
- **Command:** `cd terraform/environments/dev && terraform apply`
- **Dauer:** ~10-15 Minuten
- **Test:**
  - VPC erstellt: `aws ec2 describe-vpcs`
  - RDS läuft: `aws rds describe-db-instances`
  - ECS Cluster: `aws ecs describe-clusters`
  - ALB läuft: `aws elbv2 describe-load-balancers`
  - ALB DNS erreichbar (zeigt 503, da noch kein Container)

---

## Phase 4: CloudFront Anpassung

**Dauer:** ~1 Stunde
**Abhängigkeiten:** Phase 3.8 (ALB DNS Name)

### 4.1 CloudFront Origin auf ALB ändern

- [ ] Implementiert
- [ ] Getestet
- **AWS Console:** CloudFront → Distribution E10XAH9K76973M → Origins
- **Änderungen:**
  - Origin Domain: ALB DNS Name (aus Terraform output)
  - Origin Protocol: HTTPS only
  - Origin SSL Protocols: TLSv1.2
  - Custom Headers: `X-Forwarded-Host: weigele.art`
- **Test:** CloudFront zeigt Fehler (noch kein Docker Image deployed)

### 4.2 CloudFront Cache Behavior optimieren

- [ ] Implementiert
- [ ] Getestet
- **Behaviors:**
  - `/api/*`:
    - Cache Policy: CachingDisabled
    - Origin Request Policy: AllViewer
  - `/_next/static/*`:
    - Cache Policy: CachingOptimized
    - TTL: 31536000 (1 Jahr)
  - Default (`/`):
    - Cache Policy: Custom (TTL 300s = 5 Min für SSR)
    - Origin Request Policy: AllViewer
- **Test:** Nach Deployment: Headers prüfen, Cache-Verhalten validieren

### 4.3 CloudFront Functions prüfen

- [ ] Implementiert
- [ ] Getestet
- **Functions:** 2 Functions vorhanden (redirect-www-to-apex, function)
- **Action:** Funktionalität prüfen, ggf. anpassen
- **Test:** www.weigele.art → weigele.art Redirect funktioniert

### 4.4 CloudFront Monitoring aktivieren

- [ ] Implementiert
- [ ] Getestet
- **Settings:**
  - Standard Logging → S3 Bucket (optional)
  - Real-time Logs → CloudWatch (optional, kostet extra)
- **Test:** Logs sichtbar nach Deployment

---

## Phase 5: GitHub Actions Integration

**Dauer:** ~2 Stunden
**Abhängigkeiten:** Phase 3 & 4 komplett

### 5.1 CI Workflow: Staging Deployment aktivieren

- [ ] Implementiert
- [ ] Getestet
- **File:** `.github/workflows/ci.yml` (Zeile 254-260)
- **Änderungen:**
  - ECR Login hinzufügen
  - Docker build & push to ECR
  - Terraform apply (staging environment)
  - ECS force new deployment
  - Health check verification
- **Test:** Git push → CI läuft → Staging deployed → Health check OK

### 5.2 Production Workflow aktivieren

- [ ] Implementiert
- [ ] Getestet
- **File:** `.github/workflows/deploy-production.yml`
- **Änderungen:**
  - AWS ECS Section: `if: false` entfernen (Zeile ~120)
  - ECR push aktivieren
  - Terraform apply (production environment)
  - ECS Blue/Green Deployment
  - CloudFront Cache Invalidation
- **Test:** Manual trigger mit version tag → Production deployment

### 5.3 Nightly Workflow anpassen

- [ ] Implementiert
- [ ] Getestet
- **File:** `.github/workflows/nightly.yml`
- **Änderungen:**
  - Database backup test gegen Staging DB
  - Performance Tests gegen Staging
- **Test:** Manual trigger → Alle Tests laufen durch

---

## Phase 6: Database Migrations

**Dauer:** ~1 Stunde
**Abhängigkeiten:** RDS läuft (Phase 3)

### 6.1 Initial Migration auf Dev

- [ ] Implementiert
- [ ] Getestet
- **Command:**
  ```bash
  # DATABASE_URL aus Terraform output
  DATABASE_URL="postgresql://..." pnpm prisma migrate deploy
  ```
- **Schema:** Alle Tabellen aus `prisma/schema.prisma` erstellt
- **Test:**
  ```bash
  DATABASE_URL="..." pnpm prisma studio
  # Öffne Prisma Studio, prüfe Tabellen
  ```

### 6.2 Migration Strategy dokumentieren

- [ ] Implementiert
- [ ] Getestet
- **File:** `docs/database-migrations.md` (neu)
- **Inhalt:**
  - Migration Workflow (dev → staging → prod)
  - Backup-Strategie
  - Rollback-Prozedur
  - Backward-compatibility Rules
- **Test:** Dokumentation Review

---

## Phase 7: Testing & Rollout

**Dauer:** ~2-3 Stunden
**Abhängigkeiten:** Alle vorherigen Phasen

### 7.1 Development Environment vollständiger Test

- [ ] Implementiert
- [ ] Getestet
- **Steps:**
  1. Docker Image bauen: `docker build -t freelancer-app:dev .`
  2. ECR push (manuell)
  3. ECS Service update: `aws ecs update-service --force-new-deployment`
  4. Health Check: `curl https://ALB-DNS/api/health`
  5. Website testen: Alle Hauptseiten funktionieren
  6. Database: Prisma Studio → Daten sichtbar
- **Erfolg:** Alle Funktionen laufen auf Dev

### 7.2 Staging Environment: CI/CD Test

- [ ] Implementiert
- [ ] Getestet
- **Steps:**
  1. Git commit & push to main
  2. GitHub Actions CI läuft durch
  3. Staging Auto-Deploy erfolgt
  4. Health Check: `curl https://staging-alb/api/health`
  5. Integration Tests (lokal gegen Staging)
  6. Manual QA Testing
- **Erfolg:** CI/CD Pipeline funktioniert End-to-End

### 7.3 CloudFront End-to-End Test

- [ ] Implementiert
- [ ] Getestet
- **Steps:**
  1. CloudFront Origin zeigt auf Dev/Staging ALB
  2. `curl https://weigele.art/api/health`
  3. `curl https://weigele.art/api/version`
  4. Website im Browser: `https://weigele.art`
  5. Cache-Behavior testen (API nicht gecached, Static gecached)
  6. SSL/HTTPS funktioniert
- **Erfolg:** CloudFront → ALB → ECS → RDS funktioniert

### 7.4 Production Deployment Vorbereitung

- [ ] Implementiert
- [ ] Getestet
- **Steps:**
  1. Production Terraform: `terraform apply` (production environment)
  2. Database Migration auf Production RDS
  3. Production Environment Variables in GitHub Secrets
  4. Git Tag erstellen: `git tag -a v1.0.0 -m "Initial production release"`
  5. Git Tag pushen: `git push origin v1.0.0`
- **Erfolg:** Production Infrastruktur steht, wartet auf Deployment

### 7.5 Production Deployment (Go-Live!)

- [ ] Implementiert
- [ ] Getestet
- **Steps:**
  1. GitHub Actions: Manual trigger "Deploy to Production"
  2. Version: `v1.0.0`
  3. Skip Tests: `false`
  4. Workflow läuft: Build → Tests → Deploy
  5. Approval Gate: Manuell bestätigen
  6. Deployment erfolgt: ECS Tasks starten
  7. Health Check: `curl https://prod-alb/api/health`
  8. Monitoring: 10 Minuten beobachten (keine Fehler)
- **Erfolg:** Production läuft stabil

### 7.6 CloudFront auf Production umstellen

- [ ] Implementiert
- [ ] Getestet
- **Steps:**
  1. CloudFront Origin: Production ALB DNS
  2. Cache invalidieren: `aws cloudfront create-invalidation --paths "/*"`
  3. Website testen: `https://weigele.art`
  4. DNS Propagation warten (bis zu 48h)
  5. SSL funktioniert
  6. Alle Features funktionieren
- **Erfolg:** 🎉 **LIVE ON PRODUCTION!** 🎉

---

## Post-Launch Checklist

### Monitoring Setup

- [ ] CloudWatch Dashboards erstellen
- [ ] CloudWatch Alarms testen (Notifications)
- [ ] Sentry Error Tracking integrieren (optional)
- [ ] Uptime Monitoring (UptimeRobot) einrichten

### Documentation

- [ ] README.md aktualisieren (Status: Phase 3.6 complete → Production deployed)
- [ ] Deployment Runbook erstellen
- [ ] Incident Response Plan dokumentieren
- [ ] Rollback Prozedur testen (einmal simulieren)

### Cost Optimization

- [ ] AWS Cost Explorer prüfen (erste Woche)
- [ ] RDS Instance Size evaluieren (Performance vs. Kosten)
- [ ] ECS Auto-Scaling Policies prüfen
- [ ] CloudFront Kosten analysieren

### Security Hardening

- [ ] Security Group Rules review (Least Privilege)
- [ ] RDS Encryption prüfen
- [ ] Secrets Rotation Policy (IAM, DB Passwörter)
- [ ] WAF für CloudFront evaluieren (optional)

---

## Rollback Plan

### Wenn Deployment fehlschlägt:

#### CloudFront Rollback

- [ ] CloudFront Origin zurück auf vorherige Config
- [ ] Cache invalidieren

#### ECS Rollback

- [ ] ECS Service: Previous Task Definition
  ```bash
  aws ecs update-service --task-definition freelancer-app:42
  ```

#### Database Rollback

- [ ] RDS Snapshot restore (falls Migration fehlschlägt)
  ```bash
  aws rds restore-db-instance-from-db-snapshot
  ```

#### GitHub Deployment Rollback

- [ ] Previous Git Tag deployen: `v0.9.0`

---

## Kosten-Tracking

| Ressource     | Dev (€/Monat) | Staging (€/Monat) | Production (€/Monat) |
| ------------- | ------------- | ----------------- | -------------------- |
| Route 53      | -             | -                 | $0.50                |
| CloudFront    | -             | -                 | $0-5 (Free Tier)     |
| ALB           | $16           | $16               | $16                  |
| NAT Gateway   | $32           | $64               | $64                  |
| ECS Fargate   | $5            | $10               | $15-20               |
| RDS t3.micro  | $15           | -                 | -                    |
| RDS t3.small  | -             | $30               | $30                  |
| Data Transfer | $1            | $2                | $3-5                 |
| **TOTAL**     | **~$69**      | **~$122**         | **~$128-135**        |

**Optimierung nach 1 Monat:**

- RDS Instance downsizing möglich?
- NAT Gateway: Reduzieren auf 1 in dev?
- ECS Tasks: Auto-scaling evaluieren

---

## Notizen & Learnings

### 2025-11-10: Projekt Start

- [x] AWS Kosten von $36/Monat auf $0.60/Monat reduziert
- [x] CloudFront Distribution E10XAH9K76973M behalten für Reuse
- [x] Terraform State Backend bereits vorhanden (weigele-terraform-state)

### 2025-11-10: Phase 1 Complete ✅

- [x] Next.js Standalone Output aktiviert (147 MB)
- [x] Health Check Endpoint implementiert (`/api/health`)
- [x] Version Endpoint implementiert (`/api/version`)
- [x] Alle Tests bestanden (Build erfolgreich, Endpoints funktionieren)
- **Zeit:** ~30 Minuten (wie geschätzt)

### During Implementation:

- Next.js Config Warning: `swcMinify` und `eslint` sind deprecated in Next.js 16, aber nicht kritisch
- Standalone build erfolgreich: 147 MB (exzellent für Docker)
- Health Check zeigt korrekt 503 wenn DB nicht erreichbar

---

**Status:** ✅ Phase 1 Complete - 🟡 Phase 2 in Vorbereitung
**Nächster Schritt:** Phase 2.1 - IAM User für Terraform erstellen
**Letzte Aktualisierung:** 2025-11-10 13:56 CET
