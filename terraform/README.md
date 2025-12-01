# Terraform Infrastructure as Code

Infrastructure für die AI-Freelancer-Plattform, verwaltet mit Terraform.

## 📁 Structure

```
terraform/
├── environments/           # Environment-specific configurations
│   ├── dev/               # Development environment
│   ├── staging/           # Staging environment
│   └── production/        # Production environment
├── modules/               # Reusable Terraform modules
│   ├── ecs/              # ECS Cluster + Service
│   ├── rds/              # PostgreSQL Database
│   ├── s3/               # S3 Buckets
│   ├── networking/       # VPC, Subnets, Security Groups
│   └── monitoring/       # CloudWatch, Alarms
└── README.md             # This file
```

## 🚀 Prerequisites

### 1. Install Terraform

```bash
# macOS (Homebrew)
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Verify installation
terraform --version
```

### 2. AWS Credentials

```bash
# Configure AWS CLI
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="eu-central-1"
```

### 3. S3 Backend Setup (One-time)

Erstelle S3 Bucket + DynamoDB Table für Terraform State:

```bash
# Create S3 bucket for state
aws s3api create-bucket \
  --bucket freelancer-terraform-state \
  --region eu-central-1 \
  --create-bucket-configuration LocationConstraint=eu-central-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket freelancer-terraform-state \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket freelancer-terraform-state \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name freelancer-terraform-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region eu-central-1
```

## 🛠️ Usage

### Development Environment

```bash
# Navigate to dev environment
cd terraform/environments/dev

# Initialize Terraform (first time)
terraform init

# Create terraform.tfvars (gitignored)
cat > terraform.tfvars <<EOF
# Database
db_username = "freelancer_admin"
db_password = "your-secure-password-here"

# Container Image
container_image = "your-ecr-url/freelancer-app:latest"

# Domain
domain_name = "dev.ai-match.de"
EOF

# Plan changes (dry-run)
terraform plan

# Apply changes (execute)
terraform apply

# Destroy (cleanup)
terraform destroy
```

### Staging Environment

```bash
cd terraform/environments/staging
terraform init
terraform plan
terraform apply
```

### Production Environment

```bash
cd terraform/environments/production

# WICHTIG: Immer erst plan reviewen!
terraform plan -out=tfplan

# Review plan file
terraform show tfplan

# Apply only after review
terraform apply tfplan
```

## 📋 Common Commands

```bash
# Format Terraform files
terraform fmt -recursive

# Validate configuration
terraform validate

# Show current state
terraform show

# List resources in state
terraform state list

# Import existing resource
terraform import aws_ecs_cluster.main arn:aws:ecs:...

# Refresh state from AWS
terraform refresh

# View outputs
terraform output
```

## 🔍 Troubleshooting

### Debug Mode

```bash
export TF_LOG=DEBUG
terraform apply
```

### State Issues

```bash
# If state is locked
terraform force-unlock <lock-id>

# If state is corrupted (use backup)
terraform state pull > backup.tfstate
terraform state push backup.tfstate
```

### Drift Detection

```bash
# Check if infrastructure differs from state
terraform plan -detailed-exitcode
# Exit code 0 = no changes
# Exit code 1 = error
# Exit code 2 = changes detected (drift)
```

## 🔒 Security Best Practices

### 1. Secrets Management

❌ **NEVER** commit secrets to Git:

```hcl
# ❌ DON'T DO THIS
variable "db_password" {
  default = "my-secret-password"  # DON'T!
}
```

✅ **DO THIS:**

```hcl
# ✅ Use terraform.tfvars (gitignored)
variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# In terraform.tfvars (gitignored):
db_password = "actual-secret-password"
```

### 2. State Security

- ✅ S3 Bucket encrypted (AES-256)
- ✅ S3 Versioning enabled (backup)
- ✅ DynamoDB for state locking (prevent concurrent changes)
- ✅ IAM Roles with least privilege

### 3. Access Control

```bash
# Use IAM Roles (not root credentials)
# Use MFA for production access
# Separate AWS accounts for dev/staging/prod (ideal)
```

## 📊 Cost Estimation

```bash
# Use Infracost for cost estimates
brew install infracost
infracost breakdown --path .

# Shows:
# - Monthly cost estimate
# - Cost breakdown per resource
# - Cost diff for changes
```

## 🔄 CI/CD Integration

GitHub Actions Workflow (Phase 3.6):

```yaml
# .github/workflows/terraform.yml
name: Terraform

on:
  push:
    paths:
      - 'terraform/**'

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0

      - name: Terraform Init
        run: terraform init
        working-directory: terraform/environments/production

      - name: Terraform Plan
        run: terraform plan -out=tfplan
        working-directory: terraform/environments/production

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve tfplan
        working-directory: terraform/environments/production
```

## 📚 Module Documentation

### ECS Module

Erstellt ECS Cluster + Service + Task Definition für Next.js App.

**Inputs:**

- `cluster_name`: ECS Cluster Name
- `service_name`: ECS Service Name
- `desired_count`: Number of tasks (1 for dev, 3+ for prod)
- `container_image`: Docker image URL from ECR
- `cpu`: Task CPU (256, 512, 1024, 2048, 4096)
- `memory`: Task Memory in MB (512, 1024, 2048, 4096, 8192)

**Outputs:**

- `cluster_id`: ECS Cluster ID
- `service_name`: ECS Service Name

### RDS Module

Erstellt PostgreSQL RDS Instance.

**Inputs:**

- `db_name`: Database name
- `db_username`: Master username
- `db_password`: Master password (sensitive)
- `instance_class`: Instance type (db.t3.micro, db.t3.small, etc.)
- `allocated_storage`: Storage size in GB
- `multi_az`: Enable Multi-AZ (true/false)

**Outputs:**

- `db_endpoint`: Database connection endpoint
- `db_port`: Database port (5432)

### Networking Module

Erstellt VPC, Subnets, Security Groups.

**Outputs:**

- `vpc_id`: VPC ID
- `private_subnet_ids`: Private subnet IDs (für ECS, RDS)
- `public_subnet_ids`: Public subnet IDs (für Load Balancer)
- `app_security_group_id`: Security Group für App
- `db_security_group_id`: Security Group für Database

## 🆘 Support

- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Registry](https://registry.terraform.io/) (Community Modules)

## 📝 Notes

- **State Location:** S3 `s3://freelancer-terraform-state/<env>/terraform.tfstate`
- **Region:** eu-central-1 (Frankfurt) - DSGVO-compliant
- **Terraform Version:** >= 1.5.0

---

**Author:** Max Mustermann
**Date:** 27. Oktober 2025
**Status:** Setup Phase (Phase 3)
**Next Steps:** Module Implementation (Phase 3.6)
