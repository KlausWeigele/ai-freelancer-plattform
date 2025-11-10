# Docker Setup

Docker configuration für die AI-Freelancer-Plattform.

**Date:** 27. Oktober 2025

---

## 📁 Structure

```
docker/
├── nginx/
│   └── nginx.conf         # Nginx reverse proxy configuration
└── README.md              # This file

Root files:
├── Dockerfile             # Production multi-stage build
├── docker-compose.yml     # Local development
├── docker-compose.prod.yml # Production-like environment
└── .dockerignore          # Files excluded from Docker build
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Docker Desktop 4.0+ installed
- Docker Compose V2

### Start Development Environment

```bash
# Start all services (PostgreSQL + Next.js App)
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Stop and remove volumes (cleanup database)
docker-compose down -v
```

**Services started:**

- **PostgreSQL:** `localhost:5432`
- **Next.js App:** `http://localhost:3000`
- **Prisma Studio:** `http://localhost:5555` (optional, see below)

### Optional: Start Prisma Studio

```bash
# Start with Prisma Studio (database GUI)
docker-compose --profile studio up

# Prisma Studio will be available at:
# http://localhost:5555
```

---

## 🏗️ Docker Architecture

### Multi-Stage Dockerfile

```
┌─────────────────────────────────────────┐
│  Stage 1: deps                          │
│  - Install pnpm                         │
│  - Install node_modules                 │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│  Stage 2: builder                       │
│  - Copy dependencies                    │
│  - Generate Prisma Client               │
│  - Build Next.js (pnpm build)           │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│  Stage 3: runner (FINAL)                │
│  - Minimal production image             │
│  - Non-root user (nextjs)               │
│  - Only built files + runtime           │
│  - Health check configured              │
└─────────────────────────────────────────┘
```

**Benefits:**

- ✅ Small image size (~150MB vs. ~1GB)
- ✅ Security (non-root user)
- ✅ Fast startup
- ✅ Production-optimized

---

## 🛠️ Development Workflow

### 1. Start Services

```bash
docker-compose up
```

**What happens:**

1. PostgreSQL starts (health check until ready)
2. Next.js app starts:
   - `pnpm prisma generate` (generate client)
   - `pnpm prisma migrate dev` (run migrations)
   - `pnpm dev` (start dev server with hot-reload)

### 2. Code Changes

Your code is mounted as a volume:

```yaml
volumes:
  - .:/app # Source code mounted
```

**Hot-reload works!** Changes trigger rebuild automatically.

### 3. Database Management

**Run Prisma commands:**

```bash
# Generate Prisma Client
docker-compose exec app pnpm prisma generate

# Create migration
docker-compose exec app pnpm prisma migrate dev --name add_new_table

# Reset database
docker-compose exec app pnpm prisma migrate reset

# Open Prisma Studio
docker-compose exec app pnpm prisma studio
```

**Or use Prisma Studio service:**

```bash
docker-compose --profile studio up
# Open http://localhost:5555
```

### 4. Debugging

**View logs:**

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres

# Last 100 lines
docker-compose logs --tail=100 app
```

**Shell access:**

```bash
# Next.js container
docker-compose exec app sh

# PostgreSQL container
docker-compose exec postgres sh

# PostgreSQL CLI
docker-compose exec postgres psql -U freelancer_admin -d freelancer_db
```

---

## 🏭 Production Build

### Build Production Image

```bash
# Build production image
docker build -t freelancer-app:latest .

# Test production image locally
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  -e JWT_SECRET="..." \
  freelancer-app:latest
```

### Production-like Environment

```bash
# Create .env.prod file
cat > .env.prod <<EOF
DB_USER=freelancer_admin
DB_PASSWORD=your_secure_password
DB_NAME=freelancer_db
NEXTAUTH_SECRET=your_nextauth_secret
JWT_SECRET=your_jwt_secret
NEXTAUTH_URL=http://localhost:3000
EOF

# Start production-like environment
docker-compose -f docker-compose.prod.yml --env-file .env.prod up

# Services:
# - PostgreSQL (production-like config)
# - Next.js App (production build)
# - Nginx (reverse proxy with rate limiting)
```

**Access:**

- **App via Nginx:** `http://localhost:80`
- **App direct:** `http://localhost:3000`
- **PostgreSQL:** `localhost:5432`

---

## 📊 Image Size Optimization

### Multi-Stage Build Results

```
Stage         Size      Description
────────────────────────────────────────────────────
deps          ~800MB    Full node_modules
builder       ~1.2GB    Build artifacts
runner        ~150MB    Production (FINAL) ✅
```

**Optimization techniques:**

1. ✅ Alpine base image (node:20-alpine)
2. ✅ Multi-stage build (only copy necessary files)
3. ✅ .dockerignore (exclude unnecessary files)
4. ✅ Standalone output (Next.js optimization)
5. ✅ No dev dependencies in production

### Enable Next.js Standalone Output

```js
// next.config.js
module.exports = {
  output: 'standalone', // ← Required for Docker optimization
};
```

**This copies only necessary files to `.next/standalone/`**

---

## 🔒 Security Best Practices

### 1. Non-Root User

```dockerfile
# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs  # ← Run as non-root
```

### 2. Health Checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', ...)"
```

**Create health check endpoint:**

```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: Date.now() });
}
```

### 3. Secrets Management

❌ **NEVER** hardcode secrets:

```yaml
# ❌ DON'T DO THIS
environment:
  DATABASE_URL: 'postgresql://user:hardcoded_password@...'
```

✅ **DO THIS:**

```yaml
# ✅ Use environment variables
environment:
  DATABASE_URL: '${DATABASE_URL}'
```

```bash
# Pass via .env file
docker-compose --env-file .env.prod up
```

### 4. Network Isolation

```yaml
networks:
  freelancer-network:
    driver: bridge # Isolated network
```

Services can only communicate within this network.

---

## 🐛 Troubleshooting

### Issue: "Module not found" in production

**Cause:** Missing dependency or incorrect standalone build.

**Solution:**

```bash
# Ensure Next.js standalone output is enabled
# In next.config.js:
output: 'standalone'

# Rebuild image
docker build --no-cache -t freelancer-app:latest .
```

### Issue: Database connection failed

**Cause:** PostgreSQL not ready when app starts.

**Solution:** Already handled by `depends_on` + health check:

```yaml
depends_on:
  postgres:
    condition: service_healthy # ← Wait for PostgreSQL
```

### Issue: Prisma Client not generated

**Cause:** Prisma Client not generated during build.

**Solution:**

```dockerfile
# In Dockerfile builder stage:
RUN pnpm prisma generate  # ← Make sure this runs
```

### Issue: Hot-reload not working

**Cause:** Volume mounting issue on Windows.

**Solution:**

```yaml
volumes:
  - .:/app
  - /app/node_modules # ← Prevent overwriting node_modules
  - /app/.next # ← Prevent overwriting .next
```

### Issue: Port already in use

**Cause:** Another service using port 3000/5432.

**Solution:**

```bash
# Change ports in docker-compose.yml
ports:
  - "3001:3000"  # Map to different host port
```

---

## 🔄 CI/CD Integration

### Build Image in GitHub Actions

```yaml
# .github/workflows/docker-build.yml
- name: Build Docker Image
  run: |
    docker build -t ${{ secrets.ECR_REGISTRY }}/freelancer-app:${{ github.sha }} .
    docker push ${{ secrets.ECR_REGISTRY }}/freelancer-app:${{ github.sha }}
```

### Deploy to AWS ECS

```bash
# Update ECS service with new image
aws ecs update-service \
  --cluster freelancer-cluster \
  --service freelancer-service \
  --force-new-deployment
```

**Full CI/CD setup in Phase 3.6 (GitHub Actions + Terraform).**

---

## 📈 Monitoring

### Container Logs

```bash
# Stream logs
docker-compose logs -f app

# Export logs
docker-compose logs app > app.log
```

### Container Stats

```bash
# Real-time resource usage
docker stats

# Specific container
docker stats freelancer-app
```

### Health Check Status

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' freelancer-app

# Health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' freelancer-app
```

---

## 🧪 Testing

### Run Tests in Docker

```bash
# Unit tests
docker-compose exec app pnpm test

# E2E tests (with database)
docker-compose exec app pnpm test:e2e

# Type checking
docker-compose exec app pnpm typecheck
```

---

## 📝 Environment Variables Reference

### Required (Development)

```bash
DATABASE_URL="postgresql://user:password@postgres:5432/dbname"
NEXTAUTH_SECRET="dev-secret"
JWT_SECRET="dev-jwt-secret"
```

### Required (Production)

```bash
DATABASE_URL="postgresql://..."      # AWS RDS endpoint
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="secure-random-secret"
JWT_SECRET="secure-jwt-secret"
```

### Optional

```bash
NEXT_PUBLIC_ENABLE_MESSAGING="true"
NEXT_TELEMETRY_DISABLED="1"
```

---

## 🆘 Support

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)

---

**Author:** Klaus Weigele
**Date:** 27. Oktober 2025
**Status:** Phase 3.5 Complete
**Next:** Phase 3.6 (GitHub & CI/CD)
