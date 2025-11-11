# GitHub Actions Secrets & Environment Configuration

This document lists the required secrets/variables for CI/CD and deployment.

## GitHub Secrets (Repository Settings → Secrets and variables → Actions)

- `AWS_ACCESS_KEY_ID` – IAM user key with permissions for ECR (and later ECS).
- `AWS_SECRET_ACCESS_KEY` – IAM secret key.
- `AWS_ACCOUNT_ID` – Your AWS account ID (12 digits).
- `AWS_REGION` – Default `eu-central-1` (can be overridden per workflow).

Optional (later phases):
- `ECR_REPOSITORY` – Defaults to `freelancer-app` if unset.
- `DATABASE_URL` – For migrations during deploy (Phase 3+).
- `NEXTAUTH_SECRET` – For app runtime (stored in ECS task definition or AWS Secrets Manager).

## Terraform Variables (production)

In `terraform/environments/production/terraform.tfvars` (gitignored):

```
aws_region         = "eu-central-1"
ecr_repository_name = "freelancer-app"
```

## Notes
- The deploy workflow will push images to:
  `${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/<repository>:<version>`
- Ensure the ECR repository exists (Terraform module provided under `terraform/modules/ecr`).
- Never commit secrets to Git. Use GitHub Secrets or AWS Secrets Manager.

