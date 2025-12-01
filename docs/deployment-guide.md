# Deployment Guide

**AI-Freelancer-Plattform**
**Date:** 27. Oktober 2025
**Version:** 1.0.0

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Deployment Environments](#deployment-environments)
3. [Prerequisites](#prerequisites)
4. [GitHub Repository Setup](#github-repository-setup)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Staging Deployment](#staging-deployment)
7. [Production Deployment](#production-deployment)
8. [Rollback Procedures](#rollback-procedures)
9. [Database Migrations](#database-migrations)
10. [Monitoring & Health Checks](#monitoring--health-checks)
11. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers the complete deployment process for the AI-Freelancer-Plattform, from local development to production deployment using GitHub Actions and Docker.

**Deployment Strategy:**

- **Trunk-based development** with `main` branch
- **Automated CI** on every push
- **Staging deployment** automatic after CI passes
- **Production deployment** manual with approval gates
- **Docker-based** infrastructure for consistency

---

## Deployment Environments

### Development (Local)

```bash
# Start with Docker Compose
docker-compose up

# Or run locally
pnpm dev
```

**Access:**

- App: http://localhost:3000
- Database: localhost:5432
- Prisma Studio: http://localhost:5555 (with --profile studio)

### Staging

**Purpose:** Pre-production testing, QA validation

**Deployment:** Automatic on push to `main` (after CI passes)

**Access:** https://staging.your-domain.com (configure in workflow)

**Database:** Separate staging database (AWS RDS or similar)

### Production

**Purpose:** Live production environment

**Deployment:** Manual via GitHub Actions (requires approval)

**Access:** https://your-domain.com

**Database:** Production database with backups

---

## Prerequisites

### Required Accounts & Tools

- ✅ **GitHub account** with repository access
- ✅ **Docker** installed locally
- ✅ **pnpm** package manager
- ✅ **GitHub CLI** (`gh`) for secrets management
- ✅ **Cloud provider account** (AWS/GCP/Railway/Vercel)

### Required Secrets

Configure these secrets in GitHub repository settings:

**Database:**

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public
```

**Authentication:**

```bash
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generated-secret-32-chars>
JWT_SECRET=<generated-secret-32-chars>
```

**Docker Registry (if using):**

```bash
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password
```

**AWS (if using):**

```bash
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=eu-central-1
```

**Generate Secrets:**

```bash
# Generate secure random secrets
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## GitHub Repository Setup

### 1. Create GitHub Repository

```bash
# Option A: Create via GitHub CLI
gh repo create ai-freelancer-plattform --private --source=. --remote=origin

# Option B: Create via GitHub Web UI and link
git remote add origin git@github.com:username/ai-freelancer-plattform.git
```

### 2. Initial Push

```bash
# Ensure all changes are committed
git status
git add .
git commit -m "feat: initial project setup with CI/CD"

# Push to GitHub
git push -u origin main
```

### 3. Configure Branch Protection (Recommended)

**Via GitHub Web UI:**

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - ✅ Require status checks before merging
   - ✅ Require branches to be up to date
   - ✅ Require CI workflow to pass

**Via GitHub CLI:**

```bash
gh api repos/:owner/:repo/branches/main/protection -X PUT \
  -F required_status_checks[strict]=true \
  -F required_status_checks[contexts][]=CI
```

### 4. Set GitHub Secrets

**Via GitHub CLI:**

```bash
# Set secrets from .env file
gh secret set DATABASE_URL < <(echo "postgresql://...")
gh secret set NEXTAUTH_SECRET < <(openssl rand -base64 32)
gh secret set JWT_SECRET < <(openssl rand -base64 32)

# For AWS
gh secret set AWS_ACCESS_KEY_ID --body "$AWS_ACCESS_KEY_ID"
gh secret set AWS_SECRET_ACCESS_KEY --body "$AWS_SECRET_ACCESS_KEY"
```

**Via GitHub Web UI:**

1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret with name and value

### 5. Configure Environments

Create two environments: `staging` and `production`

**Via GitHub Web UI:**

1. Go to Settings → Environments
2. Click "New environment"
3. Create `staging` and `production`
4. For `production`:
   - ✅ Required reviewers (add yourself)
   - ✅ Wait timer: 5 minutes (optional)
5. Add environment-specific secrets if needed

---

## CI/CD Pipeline

### Workflow Files

Three GitHub Actions workflows are configured:

1. **`.github/workflows/ci.yml`** - Continuous Integration
   - Runs on: Push to `main`, Pull Requests
   - Jobs: Lint, Type Check, Tests, Build, Docker Build
   - Auto-deploys to staging on success

2. **`.github/workflows/nightly.yml`** - Nightly Tests
   - Runs on: Schedule (2:00 AM UTC daily)
   - Jobs: Full test suite, E2E tests, Security scans
   - Can be triggered manually

3. **`.github/workflows/deploy-production.yml`** - Production Deployment
   - Runs on: Manual trigger with version tag
   - Jobs: Validation, Tests, Build, Deploy, Monitor
   - Requires approval

### CI Workflow Stages

```
┌─────────────────┐
│  Code Quality   │  (Lint, TypeCheck, Format)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│     Tests       │  (Unit, Integration)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│     Build       │  (Next.js Build)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Docker Build   │  (Build & Test Image)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Deploy Staging  │  (If main branch)
└─────────────────┘
```

### View Workflow Status

```bash
# List workflow runs
gh run list

# View specific run
gh run view <run-id>

# Watch workflow in real-time
gh run watch
```

---

## Staging Deployment

### Automatic Deployment

Staging deploys automatically when:

1. Code is pushed to `main` branch
2. CI workflow passes successfully
3. Docker image builds successfully

**Access:** https://staging.your-domain.com

### Manual Staging Deployment

```bash
# Trigger CI workflow manually
gh workflow run ci.yml
```

### Staging Environment Configuration

Update `.github/workflows/ci.yml` deploy-staging job:

```yaml
- name: Deploy to Staging
  run: |
    # Your deployment commands
    # AWS ECS example:
    aws ecs update-service \
      --cluster staging-cluster \
      --service freelancer-app \
      --force-new-deployment
```

**Common Platforms:**

**AWS ECS:**

```bash
aws ecs update-service \
  --cluster staging-cluster \
  --service freelancer-app \
  --force-new-deployment
```

**Railway:**

```bash
npm install -g @railway/cli
railway up --environment staging
```

**Vercel:**

```bash
vercel deploy
```

### Verify Staging Deployment

```bash
# Health check
curl https://staging.your-domain.com/api/health

# Check version
curl https://staging.your-domain.com/api/version

# View logs (AWS ECS example)
aws logs tail /ecs/freelancer-app --follow
```

---

## Production Deployment

### Preparation Checklist

Before production deployment:

- [ ] All tests pass in staging
- [ ] Manual QA testing complete
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Secrets configured in GitHub
- [ ] Monitoring/alerting set up
- [ ] Rollback plan ready
- [ ] Team notified

### Version Tagging

```bash
# Create semantic version tag
git tag -a v1.0.0 -m "Release v1.0.0: Initial production release"

# Push tag to GitHub
git push origin v1.0.0

# List all tags
git tag -l
```

**Semantic Versioning:**

- `vMAJOR.MINOR.PATCH`
- Example: `v1.2.3`
  - `1` = Major version (breaking changes)
  - `2` = Minor version (new features)
  - `3` = Patch version (bug fixes)

### Trigger Production Deployment

**Via GitHub Web UI:**

1. Go to Actions → Deploy to Production
2. Click "Run workflow"
3. Enter version tag: `v1.0.0`
4. Select options:
   - Skip tests: `false` (recommended)
5. Click "Run workflow"
6. **Approve deployment** when prompted (production environment)

**Via GitHub CLI:**

```bash
# Trigger deployment workflow
gh workflow run deploy-production.yml \
  -f version=v1.0.0 \
  -f skip_tests=false

# Watch deployment progress
gh run watch
```

### Deployment Process

```
┌──────────────────┐
│  Validate        │  (Check version tag exists)
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Pre-Deploy      │  (Run critical tests)
│  Tests           │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Build Docker    │  (Build & test production image)
│  Image           │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Deploy          │  (Update production service)
│  (Approval       │  ← **Manual Approval Required**
│  Required)       │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Health Checks   │  (Verify deployment)
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Monitor         │  (10 min monitoring)
└──────────────────┘
```

### Post-Deployment Verification

```bash
# 1. Health Check
curl -f https://your-domain.com/api/health

# 2. Check version
curl https://your-domain.com/api/version

# 3. Test critical endpoints
curl -f https://your-domain.com/
curl -f https://your-domain.com/api/auth/signin

# 4. Monitor logs (AWS example)
aws logs tail /ecs/freelancer-app --follow

# 5. Check error rates in monitoring dashboard
# (DataDog, New Relic, CloudWatch, etc.)
```

---

## Rollback Procedures

### Automatic Rollback

If deployment fails, the workflow will:

1. Detect failure
2. Generate rollback instructions
3. Notify team

### Manual Rollback

**Quick Rollback (Re-deploy previous version):**

```bash
# 1. Find previous stable version
git tag -l | tail -5
# Output: v1.0.0, v1.0.1, v1.0.2 (failed), v1.0.1 is last stable

# 2. Re-deploy previous version
gh workflow run deploy-production.yml \
  -f version=v1.0.1 \
  -f skip_tests=true  # Emergency rollback

# 3. Approve deployment when prompted

# 4. Verify rollback
curl https://your-domain.com/api/version
```

**Infrastructure Rollback (AWS ECS example):**

```bash
# 1. Find previous task definition
aws ecs list-task-definitions \
  --family-prefix freelancer-app \
  --sort DESC \
  --max-items 5

# 2. Update service to use previous task definition
aws ecs update-service \
  --cluster production-cluster \
  --service freelancer-app \
  --task-definition freelancer-app:42  # Previous revision

# 3. Monitor rollback
aws ecs describe-services \
  --cluster production-cluster \
  --services freelancer-app
```

### Rollback Checklist

- [ ] Identify issue and root cause
- [ ] Determine last stable version
- [ ] Notify team of rollback
- [ ] Execute rollback procedure
- [ ] Verify application functionality
- [ ] Check error rates/logs
- [ ] Document incident
- [ ] Plan fix deployment

---

## Database Migrations

### Development Migrations

```bash
# Create new migration
pnpm prisma migrate dev --name add_new_feature

# Reset database (development only)
pnpm prisma migrate reset
```

### Staging Migrations

```bash
# Deploy migrations to staging
pnpm prisma migrate deploy

# Or via Docker
docker-compose exec app pnpm prisma migrate deploy
```

### Production Migrations

⚠️ **Critical:** Always test migrations in staging first!

**Recommended Approach: Manual Migration**

```bash
# 1. Backup production database
aws rds create-db-snapshot \
  --db-instance-identifier freelancer-prod \
  --db-snapshot-identifier backup-$(date +%Y%m%d-%H%M%S)

# 2. Apply migrations (in separate step, before code deployment)
# Connect to production database securely
DATABASE_URL="postgresql://..." pnpm prisma migrate deploy

# 3. Verify migrations
DATABASE_URL="postgresql://..." pnpm prisma db pull

# 4. Deploy code (after migrations succeed)
gh workflow run deploy-production.yml -f version=v1.0.0
```

**Migration Safety Rules:**

1. ✅ **Always backward compatible** - New code works with old schema
2. ✅ **Test in staging first** - Run full test suite
3. ✅ **Backup before migration** - Always have rollback option
4. ✅ **Run migrations separately** - Before code deployment
5. ❌ **Never in deployment workflow** - Too risky for production

### Migration Rollback

```bash
# 1. Restore database from backup
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier freelancer-prod-restored \
  --db-snapshot-identifier backup-20251027-120000

# 2. Update database connection to restored instance

# 3. Rollback code to previous version
```

---

## Monitoring & Health Checks

### Health Check Endpoint

**Create:** `src/app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
      },
      { status: 503 }
    );
  }
}
```

### Monitoring Tools

**Application Performance:**

- DataDog
- New Relic
- AWS CloudWatch

**Error Tracking:**

- Sentry
- LogRocket
- Rollbar

**Uptime Monitoring:**

- UptimeRobot
- Pingdom
- Better Uptime

### Log Aggregation

**AWS CloudWatch Logs:**

```bash
# View logs
aws logs tail /ecs/freelancer-app --follow

# Search logs
aws logs filter-log-events \
  --log-group-name /ecs/freelancer-app \
  --filter-pattern "ERROR"
```

---

## Troubleshooting

### Deployment Fails at CI Stage

**Issue:** Lint, type check, or build fails

**Solution:**

```bash
# Run locally to reproduce
pnpm run lint
pnpm run typecheck
pnpm run build

# Fix issues and re-push
git add .
git commit -m "fix: resolve build errors"
git push
```

### Docker Image Build Fails

**Issue:** Docker build fails in CI

**Solution:**

```bash
# Test locally
docker build -t freelancer-app:test .

# Check build logs
docker build --progress=plain -t freelancer-app:test . 2>&1 | tee build.log

# Common fixes:
# - Check .dockerignore
# - Verify all files copied correctly
# - Check Prisma generation
```

### Deployment Succeeds but App Doesn't Start

**Issue:** Container starts but app crashes

**Solution:**

```bash
# Check container logs
docker logs <container-id>

# AWS ECS
aws ecs describe-tasks \
  --cluster production-cluster \
  --tasks <task-id>

# Common causes:
# - Missing environment variables
# - Database connection failed
# - Port binding issues
```

### Database Connection Failed

**Issue:** `Error: P1001: Can't reach database server`

**Solution:**

```bash
# 1. Verify DATABASE_URL is correct
echo $DATABASE_URL

# 2. Check database is running
# PostgreSQL
pg_isready -h <host> -p 5432

# 3. Check network access
# AWS RDS security group must allow ECS tasks

# 4. Verify connection string format
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Health Check Failing

**Issue:** Health check endpoint returns 503

**Solution:**

```bash
# 1. Check database connectivity
curl https://your-domain.com/api/health

# 2. Test database directly
psql -h <host> -U <user> -d <database>

# 3. Check application logs for errors

# 4. Verify Prisma Client is generated
pnpm prisma generate
```

### Rollback Needed

See [Rollback Procedures](#rollback-procedures) section.

---

## Best Practices

### Deployment Best Practices

1. ✅ **Always test in staging first**
2. ✅ **Deploy during low-traffic hours**
3. ✅ **Have team member available during deployment**
4. ✅ **Monitor for at least 15 minutes post-deployment**
5. ✅ **Keep rollback plan ready**
6. ✅ **Document all deployments**

### Security Best Practices

1. ✅ **Never commit secrets to Git**
2. ✅ **Use GitHub Secrets for sensitive data**
3. ✅ **Rotate secrets regularly**
4. ✅ **Limit production access**
5. ✅ **Enable audit logging**
6. ✅ **Use least-privilege IAM roles**

### Database Best Practices

1. ✅ **Always backup before migrations**
2. ✅ **Test migrations in staging**
3. ✅ **Keep migrations backward compatible**
4. ✅ **Run migrations separately from code deploy**
5. ✅ **Monitor database performance**

---

## Emergency Contacts

**Production Incidents:**

- On-call engineer: [Contact info]
- DevOps lead: [Contact info]
- Database admin: [Contact info]

**Escalation:**

- Team lead: [Contact info]
- CTO: [Contact info]

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)

---

**Author:** Max Mustermann
**Date:** 27. Oktober 2025
**Status:** Phase 3.6 Complete
**Next:** Phase 4 (UX Design)
