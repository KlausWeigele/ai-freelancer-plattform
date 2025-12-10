# Learning Guide Teil 5 - Terraform

**Zuletzt aktualisiert:** 2025-12-03

Dieses Dokument erklärt Terraform - unser Infrastructure as Code (IaC) Tool für AWS.

---

## Inhaltsverzeichnis

### Grundlagen
- [Was ist Terraform?](#was-ist-terraform)
- [Infrastructure as Code (IaC)](#infrastructure-as-code-iac)
- [HCL - HashiCorp Configuration Language](#hcl---hashicorp-configuration-language)

### Kernkonzepte
- [Provider](#provider)
- [Resources](#resources)
- [Data Sources](#data-sources)
- [Variables](#variables)
- [Outputs](#outputs)
- [Modules](#modules)

### Workflow
- [terraform init](#terraform-init)
- [terraform plan](#terraform-plan)
- [terraform apply](#terraform-apply)
- [terraform destroy](#terraform-destroy)

### State Management
- [Was ist State?](#was-ist-state)
- [Remote State (S3)](#remote-state-s3)
- [State Locking](#state-locking)

### Unsere Terraform-Struktur
- [Verzeichnisstruktur](#verzeichnisstruktur)
- [ECR Modul](#ecr-modul)
- [ECS Modul](#ecs-modul)
- [Production Environment](#production-environment)

### Best Practices
- [Modulare Struktur](#modulare-struktur)
- [Sicherheit](#sicherheit)
- [Versionierung](#versionierung)

---

## Grundlagen

### Was ist Terraform?

```
Was ist das?   Tool für Infrastructure as Code von HashiCorp
Vergleich:     Wie ein Bauplan für deine Cloud-Infrastruktur
Zweck:         Infrastruktur deklarativ und wiederholbar erstellen
```

**Vorteile:**
- ✅ Infrastruktur als Code (versionierbar)
- ✅ Multi-Cloud (AWS, GCP, Azure, etc.)
- ✅ Deklarativ (was, nicht wie)
- ✅ Plan vor Apply (Preview von Änderungen)
- ✅ State Management (weiß was existiert)

**Terraform vs. Alternativen:**

| Tool | Anbieter | Vorteile | Nachteile |
|------|----------|----------|-----------|
| **Terraform** | HashiCorp | Multi-Cloud, große Community | HCL lernen |
| CloudFormation | AWS | Native AWS, kostenlos | Nur AWS |
| Pulumi | Pulumi | Echte Programmiersprachen | Weniger verbreitet |
| CDK | AWS | TypeScript/Python | Nur AWS, komplex |
| Ansible | Red Hat | Auch für Config Mgmt | Nicht deklarativ |

---

### Infrastructure as Code (IaC)

**Ohne IaC (manuell):**

```
1. Login AWS Console
2. Klicke "Create Repository"
3. Fülle Formular aus
4. Klicke "Create"
5. Wiederhole für jede Ressource...
6. Dokumentiere was du gemacht hast (vergisst man oft)

Probleme:
- Nicht reproduzierbar
- Fehleranfällig
- Keine Versionskontrolle
- Schwer zu reviewen
```

**Mit IaC (Terraform):**

```hcl
# ecr.tf
resource "aws_ecr_repository" "app" {
  name = "freelancer-app"
}
```

```bash
terraform apply
# → Repository wird automatisch erstellt
# → Code ist dokumentation
# → Versioniert in Git
# → Review per Pull Request
```

---

### HCL - HashiCorp Configuration Language

**Grundsyntax:**

```hcl
# Kommentar
// Auch ein Kommentar

# Block-Typ "resource" mit Type "aws_instance" und Name "example"
resource "aws_instance" "example" {
  # Argument
  ami           = "ami-12345678"
  instance_type = "t2.micro"

  # Verschachtelter Block
  tags = {
    Name = "Example"
  }
}

# Variable
variable "region" {
  type    = string
  default = "eu-central-1"
}

# String Interpolation
resource "aws_s3_bucket" "example" {
  bucket = "my-bucket-${var.environment}"
}

# Conditional
count = var.create_resource ? 1 : 0

# For-Each Loop
for_each = toset(["dev", "staging", "prod"])
```

---

## Kernkonzepte

### Provider

```
Was ist das?   Plugin das mit einer API kommuniziert
Vergleich:     Wie ein Treiber für verschiedene Cloud-Anbieter
Zweck:         Ermöglicht Terraform mit AWS/GCP/Azure/etc. zu sprechen
```

**AWS Provider:**

```hcl
# Terraform Version und Provider Requirements
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

# Provider Konfiguration
provider "aws" {
  region = "eu-central-1"

  # Optional: Profil aus ~/.aws/credentials
  # profile = "production"

  # Optional: Default Tags für alle Ressourcen
  default_tags {
    tags = {
      Project     = "freelancer"
      ManagedBy   = "terraform"
    }
  }
}
```

**Mehrere Provider:**

```hcl
# Default Provider
provider "aws" {
  region = "eu-central-1"
}

# Alias für andere Region
provider "aws" {
  alias  = "us_east"
  region = "us-east-1"
}

# Ressource in anderer Region
resource "aws_acm_certificate" "cert" {
  provider = aws.us_east    # CloudFront braucht us-east-1
  # ...
}
```

---

### Resources

```
Was ist das?   Die eigentlichen Infrastruktur-Komponenten
Vergleich:     Wie LEGO-Steine die du zusammenbaust
Zweck:         Erstellt/Ändert/Löscht Cloud-Ressourcen
```

**Syntax:**

```hcl
resource "PROVIDER_TYPE" "NAME" {
  # Argumente
  argument1 = "value1"
  argument2 = "value2"
}
```

**Beispiele:**

```hcl
# ECR Repository
resource "aws_ecr_repository" "app" {
  name                 = "freelancer-app"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "freelancer-prod"

  setting {
    name  = "containerInsights"
    value = "disabled"
  }
}

# S3 Bucket
resource "aws_s3_bucket" "assets" {
  bucket = "freelancer-assets"
}
```

**Ressourcen referenzieren:**

```hcl
resource "aws_ecr_repository" "app" {
  name = "freelancer-app"
}

# Referenziere andere Ressource
resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name    # ← Referenz!
  # ...
}
```

---

### Data Sources

```
Was ist das?   Liest existierende Ressourcen (erstellt sie NICHT)
Vergleich:     Wie eine Abfrage: "Zeig mir was schon da ist"
Zweck:         Informationen über bestehende Infrastruktur abrufen
```

**Beispiele:**

```hcl
# Aktuelle AWS Account ID abrufen
data "aws_caller_identity" "current" {}

# Verfügbare Availability Zones
data "aws_availability_zones" "available" {
  state = "available"
}

# Existierendes VPC finden
data "aws_vpc" "existing" {
  filter {
    name   = "tag:Name"
    values = ["production-vpc"]
  }
}

# Verwenden
resource "aws_subnet" "public" {
  vpc_id            = data.aws_vpc.existing.id
  availability_zone = data.aws_availability_zones.available.names[0]
  # ...
}
```

---

### Variables

```
Was ist das?   Eingabe-Parameter für Terraform-Konfiguration
Vergleich:     Wie Funktionsparameter in Programmiersprachen
Zweck:         Macht Konfiguration wiederverwendbar
```

**Variable definieren:**

```hcl
# variables.tf
variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
  default     = "freelancer-prod"
}

variable "container_insights" {
  description = "Enable Container Insights"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Tags for resources"
  type        = map(string)
  default     = {}
}

variable "subnet_ids" {
  description = "List of subnet IDs"
  type        = list(string)
}
```

**Variable verwenden:**

```hcl
resource "aws_ecs_cluster" "main" {
  name = var.cluster_name

  setting {
    name  = "containerInsights"
    value = var.container_insights ? "enabled" : "disabled"
  }

  tags = var.tags
}
```

**Werte übergeben:**

```hcl
# terraform.tfvars
environment        = "production"
cluster_name       = "freelancer-prod"
container_insights = false
```

```bash
# Oder per CLI
terraform apply -var="environment=staging"

# Oder per Environment Variable
export TF_VAR_environment="staging"
```

---

### Outputs

```
Was ist das?   Ausgabe-Werte nach terraform apply
Vergleich:     Wie return-Werte einer Funktion
Zweck:         Zeigt wichtige Informationen, Export zu anderen Modulen
```

```hcl
# outputs.tf
output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.app.repository_url
}

output "ecs_cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = aws_ecs_cluster.main.arn
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}
```

**Nach terraform apply:**

```
Outputs:

ecr_repository_url = "123456789.dkr.ecr.eu-central-1.amazonaws.com/freelancer-app"
ecs_cluster_arn = "arn:aws:ecs:eu-central-1:123456789:cluster/freelancer-prod"
ecs_cluster_name = "freelancer-prod"
```

---

### Modules

```
Was ist das?   Wiederverwendbare Terraform-Pakete
Vergleich:     Wie Funktionen/Klassen in Programmiersprachen
Zweck:         DRY - Don't Repeat Yourself
```

**Modul-Struktur:**

```
modules/
├── ecr/
│   ├── main.tf        # Ressourcen
│   ├── variables.tf   # Input
│   └── outputs.tf     # Output
├── ecs/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
└── rds/
    └── ...
```

**Modul verwenden:**

```hcl
# In environments/production/main.tf
module "ecr" {
  source = "../../modules/ecr"

  repository_name = "freelancer-app"
  force_delete    = true
}

module "ecs_cluster" {
  source = "../../modules/ecs"

  cluster_name       = "freelancer-prod"
  container_insights = false
}

# Modul-Output verwenden
output "ecr_url" {
  value = module.ecr.repository_url
}
```

---

## Workflow

### terraform init

```
Was macht es?   Initialisiert Terraform-Arbeitsverzeichnis
Wann?           Einmal am Anfang, nach Provider-Änderungen
```

```bash
terraform init
```

**Was passiert:**
1. Provider-Plugins herunterladen
2. Module herunterladen
3. Backend initialisieren
4. `.terraform/` Verzeichnis erstellen

**Output:**

```
Initializing the backend...
Initializing provider plugins...
- Finding hashicorp/aws versions matching ">= 5.0"...
- Installing hashicorp/aws v5.31.0...

Terraform has been successfully initialized!
```

---

### terraform plan

```
Was macht es?   Zeigt was passieren WÜRDE (ohne Änderungen)
Wann?           Vor jedem apply, zum Überprüfen
```

```bash
terraform plan
```

**Output:**

```
Terraform will perform the following actions:

  # aws_ecr_repository.app will be created
  + resource "aws_ecr_repository" "app" {
      + arn                  = (known after apply)
      + name                 = "freelancer-app"
      + registry_id          = (known after apply)
      + repository_url       = (known after apply)
    }

Plan: 1 to add, 0 to change, 0 to destroy.
```

**Symbole:**

| Symbol | Bedeutung |
|--------|-----------|
| `+` | Wird erstellt |
| `-` | Wird gelöscht |
| `~` | Wird geändert (in-place) |
| `-/+` | Wird gelöscht und neu erstellt |

---

### terraform apply

```
Was macht es?   Führt Änderungen tatsächlich durch
Wann?           Wenn du sicher bist dass plan OK ist
```

```bash
terraform apply

# Oder ohne Bestätigung (CI/CD)
terraform apply -auto-approve
```

**Output:**

```
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

aws_ecr_repository.app: Creating...
aws_ecr_repository.app: Creation complete after 2s [id=freelancer-app]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

---

### terraform destroy

```
Was macht es?   Löscht ALLE Ressourcen die Terraform verwaltet
Wann?           Nur wenn du alles löschen willst!
⚠️ VORSICHT!
```

```bash
terraform destroy

# Oder spezifische Ressource
terraform destroy -target=aws_ecr_repository.app
```

---

## State Management

### Was ist State?

```
Was ist das?   Terraform's "Gedächtnis" über erstellte Ressourcen
Vergleich:     Wie eine Inventarliste: was existiert, mit welchen Werten
Zweck:         Terraform weiß was es verwaltet
```

**State-Datei (`terraform.tfstate`):**

```json
{
  "version": 4,
  "terraform_version": "1.6.0",
  "resources": [
    {
      "type": "aws_ecr_repository",
      "name": "app",
      "instances": [
        {
          "attributes": {
            "id": "freelancer-app",
            "arn": "arn:aws:ecr:eu-central-1:123456:repository/freelancer-app",
            "repository_url": "123456.dkr.ecr.eu-central-1.amazonaws.com/freelancer-app"
          }
        }
      ]
    }
  ]
}
```

**Warum wichtig?**

```
Ohne State:
  terraform apply → Erstellt Ressource
  terraform apply → Erstellt NOCHMAL (Duplikat!)

Mit State:
  terraform apply → Erstellt Ressource, speichert in State
  terraform apply → "Ah, existiert schon" → Keine Änderung
```

---

### Remote State (S3)

**Warum Remote State?**
- Mehrere Personen können zusammenarbeiten
- State ist sicher gespeichert (nicht nur lokal)
- Backup automatisch

**Konfiguration:**

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "freelancer-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "freelancer-terraform-locks"  # Optional: Locking
  }
}
```

---

### State Locking

**Problem ohne Locking:**

```
Person A: terraform apply    # Startet
Person B: terraform apply    # Startet gleichzeitig
           → Beide ändern State → KORRUPTION!
```

**Mit DynamoDB Locking:**

```
Person A: terraform apply    # Lockt State in DynamoDB
Person B: terraform apply    # "Error: State locked by Person A"
Person A: (fertig)           # Unlock
Person B: terraform apply    # Jetzt OK
```

---

## Unsere Terraform-Struktur

### Verzeichnisstruktur

```
terraform/
├── modules/                      # Wiederverwendbare Module
│   ├── ecr/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── ecs/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── rds/
│   │   └── .gitkeep
│   └── networking/
│       └── .gitkeep
│
├── environments/                 # Umgebungs-spezifische Konfiguration
│   ├── production/
│   │   ├── main.tf              # Ruft Module auf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── backend.tf           # S3 State Backend
│   │   └── terraform.tfvars     # Werte (gitignored!)
│   ├── staging/
│   │   └── .gitkeep
│   └── dev/
│       └── .gitkeep
│
└── README.md
```

---

### ECR Modul

**modules/ecr/main.tf:**

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_ecr_repository" "this" {
  name                 = var.repository_name
  image_tag_mutability = var.image_tag_mutability

  image_scanning_configuration {
    scan_on_push = var.scan_on_push
  }

  force_delete = var.force_delete
}

resource "aws_ecr_lifecycle_policy" "this" {
  repository = aws_ecr_repository.this.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description  = "Keep last ${var.lifecycle_keep_last} images",
        selection = {
          tagStatus   = "any",
          countType   = "imageCountMoreThan",
          countNumber = var.lifecycle_keep_last
        },
        action = { type = "expire" }
      }
    ]
  })
}
```

**modules/ecr/variables.tf:**

```hcl
variable "repository_name" {
  description = "Name of the ECR repository"
  type        = string
  default     = "freelancer-app"
}

variable "image_tag_mutability" {
  description = "Tag mutability (MUTABLE or IMMUTABLE)"
  type        = string
  default     = "MUTABLE"
}

variable "scan_on_push" {
  description = "Scan images on push"
  type        = bool
  default     = true
}

variable "force_delete" {
  description = "Delete repository even if images exist"
  type        = bool
  default     = true
}

variable "lifecycle_keep_last" {
  description = "Number of images to keep"
  type        = number
  default     = 20
}
```

---

### ECS Modul

**modules/ecs/main.tf:**

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_ecs_cluster" "this" {
  name = var.cluster_name

  setting {
    name  = "containerInsights"
    value = var.container_insights ? "enabled" : "disabled"
  }

  tags = var.tags
}
```

**modules/ecs/variables.tf:**

```hcl
variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
  default     = "freelancer-prod"
}

variable "container_insights" {
  description = "Enable Container Insights (costs ~$0.01/task/hour)"
  type        = bool
  default     = false
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
```

---

### Production Environment

**environments/production/main.tf:**

```hcl
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "freelancer"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}

# ECR Repository
module "ecr" {
  source = "../../modules/ecr"

  repository_name     = var.ecr_repository_name
  force_delete        = true
  lifecycle_keep_last = 20
}

# ECS Cluster
module "ecs_cluster" {
  source = "../../modules/ecs"

  cluster_name       = "freelancer-prod"
  container_insights = false

  tags = {
    Component = "compute"
  }
}
```

---

## Best Practices

### Modulare Struktur

```
✅ GUT: Module für Wiederverwendbarkeit
────────────────────────────────────────
modules/
├── ecr/      # ECR Repository Modul
├── ecs/      # ECS Cluster Modul
├── rds/      # RDS Database Modul
└── vpc/      # Networking Modul

❌ SCHLECHT: Alles in einer Datei
────────────────────────────────────────
main.tf (1000 Zeilen mit allem)
```

---

### Sicherheit

**1. Keine Secrets in Code:**
```hcl
# ❌ SCHLECHT
resource "aws_db_instance" "db" {
  password = "super-secret-123"
}

# ✅ GUT
resource "aws_db_instance" "db" {
  password = var.db_password    # Aus tfvars oder Environment
}
```

**2. tfvars gitignoren:**
```gitignore
# .gitignore
*.tfvars
*.tfvars.json
```

**3. Sensitive Outputs:**
```hcl
output "db_password" {
  value     = var.db_password
  sensitive = true    # Wird nicht in Logs angezeigt
}
```

---

### Versionierung

**Provider-Versionen pinnen:**
```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.31"    # >= 5.31.0, < 5.32.0
    }
  }
}
```

**Lock-File committen:**
```bash
# .terraform.lock.hcl sollte in Git sein!
git add .terraform.lock.hcl
```

---

## Glossar

| Begriff | Erklärung |
|---------|-----------|
| **IaC** | Infrastructure as Code - Infrastruktur als Code |
| **HCL** | HashiCorp Configuration Language |
| **Provider** | Plugin für Cloud-Anbieter (AWS, GCP, etc.) |
| **Resource** | Infrastruktur-Komponente (EC2, S3, etc.) |
| **Data Source** | Liest existierende Ressourcen |
| **Variable** | Input-Parameter |
| **Output** | Ausgabe-Werte |
| **Module** | Wiederverwendbares Terraform-Paket |
| **State** | Terraform's "Gedächtnis" |
| **Backend** | Wo State gespeichert wird (S3, local) |
| **Plan** | Preview von Änderungen |
| **Apply** | Änderungen durchführen |

---

## Weiterführende Links

- [Terraform Dokumentation](https://developer.hashicorp.com/terraform/docs)
- [AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)
- [Terraform Module Registry](https://registry.terraform.io/)

---

*Dieses Dokument wird kontinuierlich erweitert.*
