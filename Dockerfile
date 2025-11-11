# Dockerfile for AI-Freelancer-Plattform (Production)
# Multi-stage build for optimal image size
# Date: 2025-10-27

# ============================================================================
# Stage 1: Dependencies (pnpm + node_modules)
# ============================================================================
FROM node:20-alpine AS deps

# Install pnpm (pin to repository version for deterministic builds)
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (production + dev for build)
RUN pnpm install --frozen-lockfile

# ============================================================================
# Stage 2: Builder (Build Next.js app)
# ============================================================================
FROM node:20-alpine AS builder

# Install pnpm (pin to repository version for deterministic builds)
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Generate Prisma Client
RUN pnpm prisma generate

# Build Next.js application
# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ============================================================================
# Stage 3: Runner (Production image)
# ============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy Next.js build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and generated client
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start Next.js server
CMD ["node", "server.js"]
