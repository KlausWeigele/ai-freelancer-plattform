# GitHub Actions Workflows

**AI-Freelancer-Plattform**
**Date:** 27. Oktober 2025

---

## 📚 Overview

This directory contains GitHub Actions workflows for automated CI/CD pipeline.

**Workflows:**
1. `ci.yml` - Continuous Integration
2. `nightly.yml` - Nightly Testing
3. `deploy-production.yml` - Production Deployment

---

## 🔄 Continuous Integration (`ci.yml`)

**Trigger:** Push to `main`, Pull Requests

**Purpose:** Automated quality checks and staging deployment

### Jobs

```
quality → test → build → docker → deploy-staging
```

**1. Code Quality**
- Lint (ESLint)
- Type Check (TypeScript)
- Format Check (Prettier)
- Security Audit (pnpm audit)

**2. Tests**
- Unit Tests (Vitest) - *To be implemented*
- Integration Tests - *To be implemented*
- Database: PostgreSQL 15

**3. Build**
- Next.js Production Build
- Prisma Client Generation

**4. Docker**
- Build Docker image
- Test image health

**5. Deploy Staging** (if `main` branch)
- Automatic deployment to staging
- Smoke tests

### Usage

```bash
# Automatically runs on push to main
git push origin main

# Manually trigger
gh workflow run ci.yml

# View status
gh run list --workflow=ci.yml
```

---

## 🌙 Nightly Testing (`nightly.yml`)

**Trigger:** Daily at 2:00 AM UTC (3:00 AM CET), Manual

**Purpose:** Comprehensive testing suite

### Jobs

```
nightly-tests → backup-test → dependency-check
```

**1. Comprehensive Tests**
- Full Unit Test Suite - *To be implemented*
- Full Integration Tests - *To be implemented*
- E2E Tests (Playwright) - *To be implemented*
- Performance Tests - *To be implemented*
- Visual Regression Tests - *To be implemented*
- Deep Security Audit
- Docker Build Test
- Database Migration Test

**2. Database Backup Test**
- Test backup creation
- Test restore process
- Verify data integrity

**3. Dependency Check**
- Check for outdated dependencies
- Security vulnerability scan

### Usage

```bash
# Automatically runs nightly at 2:00 AM UTC

# Manual trigger
gh workflow run nightly.yml

# View results
gh run view --workflow=nightly.yml
```

### Notifications

- ✅ Success: Silent (check GitHub Actions)
- 🚨 Failure: Notification (to be configured)

---

## 🚀 Production Deployment (`deploy-production.yml`)

**Trigger:** Manual with version tag input

**Purpose:** Controlled production deployment with approval

### Jobs

```
validate → pre-deployment-tests → build → deploy → rollback (if fails) → monitor
```

**1. Validate**
- Check version tag exists
- Verify version format
- Create deployment summary

**2. Pre-Deployment Tests**
- Run critical tests
- Build application
- Database migrations (test)

**3. Build**
- Build Docker image
- Tag with version
- Push to registry (when configured)
- Test image

**4. Deploy** (requires approval)
- Update production service
- Run database migrations (manual)
- Health checks
- Smoke tests

**5. Rollback** (if failure)
- Generate rollback instructions
- Notify team

**6. Monitor**
- 10-minute monitoring period
- Check error rates
- Success notification

### Usage

```bash
# 1. Create version tag
git tag -a v1.0.0 -m "Release v1.0.0: Description"
git push origin v1.0.0

# 2. Trigger deployment
gh workflow run deploy-production.yml \
  -f version=v1.0.0 \
  -f skip_tests=false

# 3. Monitor deployment
gh run watch

# 4. Approve deployment when prompted (in GitHub UI)
```

### Approval Gate

⚠️ **Production deployment requires manual approval**

**Settings → Environments → production → Required reviewers**

---

## 🔐 Required Secrets

Configure these secrets in GitHub repository settings:

### General

```bash
DATABASE_URL              # PostgreSQL connection string
NEXTAUTH_SECRET           # NextAuth.js secret (32 chars)
JWT_SECRET                # JWT signing secret (32 chars)
NEXTAUTH_URL              # Production URL
```

### Docker Registry (if using)

```bash
DOCKER_USERNAME           # Docker Hub username
DOCKER_PASSWORD           # Docker Hub password/token
```

### AWS (if using)

```bash
AWS_ACCESS_KEY_ID         # AWS access key
AWS_SECRET_ACCESS_KEY     # AWS secret key
AWS_REGION                # eu-central-1 (Frankfurt)
```

### Generate Secrets

```bash
# Generate random secret (32 bytes base64)
openssl rand -base64 32

# Or with Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Set Secrets

```bash
# Via GitHub CLI
gh secret set DATABASE_URL --body "postgresql://..."
gh secret set NEXTAUTH_SECRET --body "$(openssl rand -base64 32)"
gh secret set JWT_SECRET --body "$(openssl rand -base64 32)"

# Or via GitHub Web UI
# Settings → Secrets and variables → Actions → New repository secret
```

---

## 🌍 Environments

Configure two environments in GitHub settings:

### Staging

**Settings → Environments → New environment → `staging`**

- No approval required
- Automatic deployment on CI pass
- Separate database

**Environment Variables:**
```bash
NEXTAUTH_URL=https://staging.your-domain.com
DATABASE_URL=postgresql://... (staging database)
```

### Production

**Settings → Environments → New environment → `production`**

- ✅ Required reviewers (add team members)
- ✅ Wait timer: 5 minutes (optional)
- Manual deployment only

**Environment Variables:**
```bash
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL=postgresql://... (production database)
```

---

## 📦 Package Scripts

All workflows use these `package.json` scripts:

```bash
# Code Quality
pnpm run lint              # ESLint
pnpm run typecheck         # TypeScript
pnpm run format:check      # Prettier check

# Testing (to be implemented)
pnpm run test:unit         # Unit tests
pnpm run test:integration  # Integration tests
pnpm run test:e2e          # E2E tests

# Build
pnpm run build             # Next.js production build

# Database
pnpm db:generate           # Generate Prisma Client
pnpm prisma migrate deploy # Apply migrations

# Docker
pnpm run docker:build      # Build Docker image
pnpm run docker:run        # Run Docker container
```

---

## 🔧 Workflow Configuration

### Enable/Disable Jobs

Jobs marked with `if: false` are disabled:

```yaml
- name: Run Unit Tests
  run: pnpm run test:unit
  if: false  # Enable when tests are implemented
```

**To enable:**
1. Remove `if: false` line
2. Implement the corresponding functionality
3. Test locally first
4. Commit and push

### Modify Deployment Targets

Update deployment steps in workflows:

**AWS ECS:**
```yaml
- name: Deploy to AWS ECS
  run: |
    aws ecs update-service \
      --cluster production-cluster \
      --service freelancer-app \
      --force-new-deployment
```

**Railway:**
```yaml
- name: Deploy to Railway
  run: |
    npm install -g @railway/cli
    railway up --environment production
```

**Vercel:**
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📊 Monitoring Workflows

### View All Workflows

```bash
# List workflows
gh workflow list

# View recent runs
gh run list

# Filter by workflow
gh run list --workflow=ci.yml

# Watch current run
gh run watch
```

### View Specific Run

```bash
# Get run ID
gh run list --workflow=ci.yml --limit 1

# View run details
gh run view <run-id>

# View logs
gh run view <run-id> --log
```

### Cancel Running Workflow

```bash
# Cancel specific run
gh run cancel <run-id>

# Cancel all runs for a workflow
gh run list --workflow=ci.yml --status in_progress --json databaseId --jq '.[].databaseId' | xargs -I {} gh run cancel {}
```

---

## 🐛 Troubleshooting

### Workflow Fails at Checkout

**Issue:** `Error: fatal: could not read Username`

**Solution:** Check repository permissions and GitHub token

### Job Fails Due to Missing Secret

**Issue:** `Error: Secret DATABASE_URL is not set`

**Solution:** Add secret in GitHub settings

### Docker Build Fails

**Issue:** `Error: failed to solve: process "/bin/sh ..." failed`

**Solution:**
```bash
# Test locally
docker build --progress=plain -t test .

# Check logs for specific error
# Common issues:
# - Missing files (.dockerignore too aggressive)
# - Prisma generation failed
# - Node modules cache issue
```

### Deployment Stuck at Approval

**Issue:** Deployment waiting for approval indefinitely

**Solution:**
1. Go to GitHub Actions
2. Find pending deployment
3. Click "Review deployments"
4. Approve or reject

### Tests Timeout

**Issue:** Test job exceeds timeout

**Solution:**
```yaml
# Increase timeout in workflow
jobs:
  test:
    timeout-minutes: 30  # Increase from default 15
```

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Deployment Guide](../../docs/deployment-guide.md)

---

## 🆘 Support

- **GitHub Actions Help:** https://github.com/features/actions
- **Community Forum:** https://github.community/
- **Project Documentation:** See `docs/` directory

---

**Author:** Klaus Weigele
**Last Updated:** 27. Oktober 2025
**Version:** 1.0.0
