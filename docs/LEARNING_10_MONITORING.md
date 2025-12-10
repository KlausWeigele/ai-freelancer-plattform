# Learning 10: Monitoring, Logging und Observability

**Erstellt:** 2025-12-10
**Kontext:** AI-Freelancer-Plattform (AWS, Next.js, PostgreSQL)

---

## Inhaltsverzeichnis

1. [Warum Monitoring?](#1-warum-monitoring)
2. [Die drei Säulen der Observability](#2-die-drei-säulen-der-observability)
3. [Logging](#3-logging)
4. [Metriken](#4-metriken)
5. [Tracing](#5-tracing)
6. [AWS CloudWatch](#6-aws-cloudwatch)
7. [Alerting](#7-alerting)
8. [Error Tracking](#8-error-tracking)
9. [Performance Monitoring](#9-performance-monitoring)
10. [Implementierung für unser Projekt](#10-implementierung-für-unser-projekt)

---

## 1. Warum Monitoring?

### Ohne Monitoring

```
😱 "Die App ist down!"
   "Wann ist das passiert?"
   "Keine Ahnung..."
   "Was ist die Ursache?"
   "Keine Ahnung..."
```

### Mit Monitoring

```
🔔 Alert: "API Response Time > 2s seit 5 Minuten"
📊 Dashboard: "Database CPU bei 95%"
🔍 Logs: "Query SELECT * FROM projects timeout"
✅ Fix: "Index auf projects.status hinzugefügt"
```

### Business Impact

| Problem | Ohne Monitoring | Mit Monitoring |
|---------|-----------------|----------------|
| App down | Kunde meldet (Stunden) | Alert sofort |
| Langsam | "Gefühlt langsam" | Konkrete Metriken |
| Fehler | "Irgendwas geht nicht" | Stack Trace + Context |
| Ursache | Raten | Daten-basierte Analyse |

---

## 2. Die drei Säulen der Observability

### 1. Logs (Was passiert?)

```
Textuelle Aufzeichnungen von Events

[2024-01-15 14:30:22] INFO: User klaus@example.com logged in
[2024-01-15 14:30:25] ERROR: Database connection failed
[2024-01-15 14:30:26] WARN: Retry attempt 1/3
```

### 2. Metriken (Wie viel/schnell?)

```
Numerische Zeitreihen-Daten

request_count: 1,245 req/min
response_time_p99: 450ms
error_rate: 0.5%
cpu_usage: 45%
```

### 3. Traces (Wie hängt alles zusammen?)

```
Request-Pfad durch das System

[Trace ID: abc123]
├── API Gateway (5ms)
├── Next.js Handler (15ms)
│   ├── Auth Check (3ms)
│   └── Database Query (120ms)
└── Response (2ms)
Total: 145ms
```

### Zusammenspiel

```
User meldet: "Seite lädt langsam"

1. Metriken → "P99 Latency ist 3s (normal: 200ms)"
2. Traces → "Database Query dauert 2.8s"
3. Logs → "Query: SELECT * FROM projects (no index)"
```

---

## 3. Logging

### Log-Level

| Level | Verwendung | Beispiel |
|-------|------------|----------|
| `ERROR` | Fehler, die behandelt werden müssen | DB Connection failed |
| `WARN` | Potenzielle Probleme | Retry attempt, Slow query |
| `INFO` | Wichtige Business-Events | User registered, Order placed |
| `DEBUG` | Entwickler-Details | Query parameters, Cache hit |
| `TRACE` | Sehr detailliert (selten) | Every function call |

### Strukturiertes Logging (JSON)

```typescript
// ❌ Unstrukturiert - schwer zu parsen
console.log('User klaus@example.com logged in from 192.168.1.1');

// ✅ Strukturiert - maschinenlesbar
logger.info({
  event: 'user_login',
  userId: '123',
  email: 'klaus@example.com',
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...',
  timestamp: '2024-01-15T14:30:22.123Z',
});
```

### Logger Setup mit Pino

```typescript
// src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
        },
      }
    : undefined,
  base: {
    env: process.env.NODE_ENV,
    version: process.env.APP_VERSION,
  },
  redact: ['password', 'token', 'secret', 'authorization'],
});

// Child Logger mit Context
export function createRequestLogger(requestId: string) {
  return logger.child({ requestId });
}
```

### Verwendung im Code

```typescript
import { logger } from '@/lib/logger';

// In API Route
export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const log = logger.child({ requestId });

  log.info({ event: 'request_start', path: '/api/projects' });

  try {
    const data = await request.json();
    log.debug({ event: 'request_body', data });

    const project = await createProject(data);
    log.info({ event: 'project_created', projectId: project.id });

    return Response.json(project);
  } catch (error) {
    log.error({
      event: 'request_error',
      error: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Log Aggregation

```
App Instances → CloudWatch Logs → CloudWatch Insights / OpenSearch

Logs von allen ECS Tasks werden zentral gesammelt.
```

### CloudWatch Log Insights Queries

```sql
-- Fehler in letzter Stunde
fields @timestamp, @message
| filter level = 'error'
| sort @timestamp desc
| limit 100

-- Langsame Requests
fields @timestamp, duration, path
| filter duration > 1000
| sort duration desc
| limit 50

-- Fehler-Rate pro Endpoint
fields path
| filter level = 'error'
| stats count(*) as errors by path
| sort errors desc
```

---

## 4. Metriken

### Arten von Metriken

#### Counter (nur steigend)
```
request_count: 0 → 1 → 2 → 3 → ...
error_count: 0 → 1 → 1 → 2 → ...

Verwendung: Requests, Errors, Bytes sent
```

#### Gauge (kann steigen und fallen)
```
active_connections: 5 → 8 → 3 → 6
cpu_usage: 45% → 60% → 30%

Verwendung: Current values, Queue size, Memory
```

#### Histogram (Verteilung)
```
response_time:
  p50 (median): 50ms
  p90: 150ms
  p95: 200ms
  p99: 500ms

Verwendung: Latency, Request size
```

### Die vier goldenen Signale (Google SRE)

```
1. Latency (Antwortzeit)
   - Wie lange dauern Requests?
   - Wichtig: p50, p95, p99

2. Traffic (Durchsatz)
   - Wie viele Requests/Sekunde?
   - Trend: Wächst, fällt, stabil?

3. Errors (Fehlerrate)
   - Wie viel % der Requests schlagen fehl?
   - Ziel: < 0.1%

4. Saturation (Auslastung)
   - Wie voll sind die Ressourcen?
   - CPU, Memory, Disk, Connections
```

### RED Method (für Services)

```
Rate   - Requests pro Sekunde
Errors - Fehler pro Sekunde
Duration - Latenz pro Request
```

### USE Method (für Ressourcen)

```
Utilization - % Nutzung (CPU 60%)
Saturation  - Warteschlange (Queue depth)
Errors      - Error count
```

### Custom Metriken in Next.js

```typescript
// src/lib/metrics.ts
import { CloudWatch } from '@aws-sdk/client-cloudwatch';

const cloudwatch = new CloudWatch({ region: 'eu-central-1' });

export async function recordMetric(
  name: string,
  value: number,
  unit: 'Count' | 'Milliseconds' | 'Percent' = 'Count',
  dimensions?: Record<string, string>
) {
  await cloudwatch.putMetricData({
    Namespace: 'AI-Freelancer-Platform',
    MetricData: [
      {
        MetricName: name,
        Value: value,
        Unit: unit,
        Dimensions: dimensions
          ? Object.entries(dimensions).map(([Name, Value]) => ({ Name, Value }))
          : undefined,
        Timestamp: new Date(),
      },
    ],
  });
}

// Verwendung
await recordMetric('RequestDuration', 150, 'Milliseconds', {
  Path: '/api/projects',
  Method: 'GET',
});

await recordMetric('UserRegistration', 1, 'Count');
```

---

## 5. Tracing

### Was ist Distributed Tracing?

```
Ein Request durchläuft mehrere Services:

Browser → CloudFront → ALB → ECS (Next.js) → RDS

Tracing verfolgt den Request durch alle Services.
```

### Trace-Struktur

```
Trace (gesamter Request)
└── Span: HTTP Request (150ms)
    ├── Span: Auth Check (5ms)
    ├── Span: Database Query (100ms)
    │   └── Span: Connection Pool (2ms)
    └── Span: Response Serialization (3ms)
```

### AWS X-Ray für Tracing

```typescript
// Middleware für X-Ray
import AWSXRay from 'aws-xray-sdk';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const segment = AWSXRay.getSegment();
  const subsegment = segment?.addNewSubsegment('next-middleware');

  try {
    subsegment?.addAnnotation('path', request.nextUrl.pathname);
    return NextResponse.next();
  } finally {
    subsegment?.close();
  }
}
```

### OpenTelemetry (offener Standard)

```typescript
// src/lib/tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'ai-freelancer-platform',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  }),
  traceExporter: new OTLPTraceExporter({
    url: 'https://otel-collector.example.com/v1/traces',
  }),
});

sdk.start();
```

---

## 6. AWS CloudWatch

### CloudWatch Components

```
CloudWatch Logs    - Log-Aggregation
CloudWatch Metrics - Zeit-Serien-Daten
CloudWatch Alarms  - Alerting
CloudWatch Dashboards - Visualisierung
CloudWatch Insights - Log-Analyse
```

### ECS Logging zu CloudWatch

```json
// Task Definition (vereinfacht)
{
  "containerDefinitions": [
    {
      "name": "app",
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ai-freelancer-platform",
          "awslogs-region": "eu-central-1",
          "awslogs-stream-prefix": "app"
        }
      }
    }
  ]
}
```

### Terraform für CloudWatch

```hcl
# modules/monitoring/main.tf

# Log Group
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.app_name}"
  retention_in_days = 30

  tags = {
    Application = var.app_name
    Environment = var.environment
  }
}

# Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.app_name}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "ECS CPU Utilization"
          region = var.aws_region
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ClusterName", var.cluster_name]
          ]
          period = 300
          stat   = "Average"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "ECS Memory Utilization"
          region = var.aws_region
          metrics = [
            ["AWS/ECS", "MemoryUtilization", "ClusterName", var.cluster_name]
          ]
          period = 300
          stat   = "Average"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          title  = "ALB Request Count"
          region = var.aws_region
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", var.alb_arn_suffix]
          ]
          period = 60
          stat   = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          title  = "ALB Target Response Time"
          region = var.aws_region
          metrics = [
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", var.alb_arn_suffix]
          ]
          period = 60
          stat   = "p99"
        }
      }
    ]
  })
}
```

### Wichtige AWS Metriken

```
ECS:
- CPUUtilization
- MemoryUtilization
- RunningTaskCount

ALB:
- RequestCount
- TargetResponseTime
- HTTPCode_Target_4XX_Count
- HTTPCode_Target_5XX_Count
- ActiveConnectionCount

RDS:
- CPUUtilization
- DatabaseConnections
- FreeStorageSpace
- ReadLatency, WriteLatency
```

---

## 7. Alerting

### Alert-Strategie

```
Wichtig: Nicht zu viele Alerts!

Alert Fatigue = Zu viele Alerts → Ignorieren → Echte Probleme übersehen
```

### Alert-Prioritäten

| Priorität | Response Time | Beispiel |
|-----------|---------------|----------|
| **Critical** | < 5 min | App down, Data loss |
| **High** | < 30 min | Error rate > 5%, Latency > 3s |
| **Medium** | < 4h | Disk 80%, Memory high |
| **Low** | Next business day | Warning trends |

### CloudWatch Alarms

```hcl
# modules/monitoring/alarms.tf

# Critical: ECS Tasks nicht running
resource "aws_cloudwatch_metric_alarm" "ecs_running_tasks" {
  alarm_name          = "${var.app_name}-ecs-running-tasks"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  metric_name         = "RunningTaskCount"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 1
  alarm_description   = "No ECS tasks running!"

  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.service_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]
}

# High: Error rate zu hoch
resource "aws_cloudwatch_metric_alarm" "alb_5xx_errors" {
  alarm_name          = "${var.app_name}-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "Too many 5XX errors!"

  dimensions = {
    LoadBalancer = var.alb_arn_suffix
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# Medium: CPU hoch
resource "aws_cloudwatch_metric_alarm" "ecs_cpu_high" {
  alarm_name          = "${var.app_name}-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 5
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "ECS CPU above 80%"

  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.service_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
}

# SNS Topic für Alerts
resource "aws_sns_topic" "alerts" {
  name = "${var.app_name}-alerts"
}

# E-Mail Subscription
resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}
```

### Alert-Kanäle

```
E-Mail    - Für nicht-kritische Alerts
SMS       - Für kritische Alerts (nachts)
Slack     - Team-Benachrichtigung
PagerDuty - On-Call Rotation (Enterprise)
```

### Slack Integration

```typescript
// src/lib/alerts.ts
export async function sendSlackAlert(
  channel: string,
  message: string,
  severity: 'critical' | 'high' | 'medium' | 'low'
) {
  const colors = {
    critical: '#ff0000',
    high: '#ff6600',
    medium: '#ffcc00',
    low: '#00ff00',
  };

  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel,
      attachments: [
        {
          color: colors[severity],
          title: `[${severity.toUpperCase()}] Alert`,
          text: message,
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    }),
  });
}
```

---

## 8. Error Tracking

### Warum dediziertes Error Tracking?

```
Logs:
- Alle Events (Info, Debug, Errors)
- Chronologisch
- Schwer zu gruppieren

Error Tracking (Sentry, etc.):
- Nur Errors
- Gruppiert nach Ursache
- Stack Traces
- Betroffene User
- Release-Tracking
```

### Sentry Setup

```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_APP_VERSION,

  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% der Requests

  // Session Replay (optional)
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,

  // Ignore bekannte Fehler
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
});
```

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION,
  tracesSampleRate: 0.1,
});
```

### Error Context hinzufügen

```typescript
import * as Sentry from '@sentry/nextjs';

// User-Context setzen (nach Login)
Sentry.setUser({
  id: user.id,
  email: user.email,
});

// Custom Tags
Sentry.setTag('feature', 'project_booking');

// Breadcrumbs (was passierte vor dem Error)
Sentry.addBreadcrumb({
  category: 'ui',
  message: 'User clicked "Book Freelancer"',
  level: 'info',
});

// Manuell Error melden
try {
  await bookFreelancer(projectId, freelancerId);
} catch (error) {
  Sentry.captureException(error, {
    tags: { action: 'book_freelancer' },
    extra: { projectId, freelancerId },
  });
  throw error;
}
```

---

## 9. Performance Monitoring

### Core Web Vitals

```
LCP (Largest Contentful Paint)
- Wann ist der Hauptinhalt sichtbar?
- Ziel: < 2.5s

FID (First Input Delay)
- Wie schnell reagiert die Seite auf Interaktion?
- Ziel: < 100ms

CLS (Cumulative Layout Shift)
- Wie stabil ist das Layout?
- Ziel: < 0.1
```

### Next.js Performance Monitoring

```typescript
// src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

### Custom Performance Tracking

```typescript
// src/lib/performance.ts
export function measurePerformance(name: string) {
  const start = performance.now();

  return {
    end: () => {
      const duration = performance.now() - start;
      // An Monitoring senden
      recordMetric(`timing.${name}`, duration, 'Milliseconds');
      return duration;
    },
  };
}

// Verwendung
const measure = measurePerformance('database_query');
const result = await prisma.project.findMany();
const duration = measure.end(); // z.B. 150ms
```

### API Performance

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const start = Date.now();

  const response = NextResponse.next();

  const duration = Date.now() - start;

  // Header für Debugging
  response.headers.set('X-Response-Time', `${duration}ms`);

  // Log für Monitoring
  if (duration > 1000) {
    console.warn({
      event: 'slow_request',
      path: request.nextUrl.pathname,
      duration,
    });
  }

  return response;
}
```

### Database Performance

```typescript
// Prisma Query Logging
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

prisma.$on('query', (e) => {
  if (e.duration > 100) {
    console.warn({
      event: 'slow_query',
      query: e.query,
      duration: e.duration,
    });
  }
});
```

---

## 10. Implementierung für unser Projekt

### Phase 1: Basics (Minimal Viable Monitoring)

```
1. CloudWatch Logs für ECS
2. Health Check Endpoint
3. Basis-Alarms (App down, 5XX Errors)
4. E-Mail Alerts
```

### Phase 2: Erweitertes Monitoring

```
1. CloudWatch Dashboard
2. Custom Metriken
3. Sentry für Error Tracking
4. Performance Monitoring
```

### Phase 3: Advanced

```
1. Distributed Tracing (X-Ray)
2. Log Analytics (CloudWatch Insights)
3. Slack/PagerDuty Integration
4. SLOs & Error Budgets
```

### Terraform Module

```hcl
# terraform/modules/monitoring/main.tf

variable "app_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "alert_email" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "service_name" {
  type = string
}

variable "alb_arn_suffix" {
  type = string
}

# Log Group
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.app_name}"
  retention_in_days = var.environment == "production" ? 90 : 14

  tags = {
    Application = var.app_name
    Environment = var.environment
  }
}

# SNS Topic für Alerts
resource "aws_sns_topic" "alerts" {
  name = "${var.app_name}-${var.environment}-alerts"
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# Critical Alarm: Service Down
resource "aws_cloudwatch_metric_alarm" "service_down" {
  alarm_name          = "${var.app_name}-${var.environment}-service-down"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 2
  metric_name         = "RunningTaskCount"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 1
  alarm_description   = "ECS Service has no running tasks!"

  dimensions = {
    ClusterName = var.cluster_name
    ServiceName = var.service_name
  }

  alarm_actions = [aws_sns_topic.alerts.arn]
  ok_actions    = [aws_sns_topic.alerts.arn]

  tags = {
    Severity = "critical"
  }
}

# High Alarm: Too many errors
resource "aws_cloudwatch_metric_alarm" "high_error_rate" {
  alarm_name          = "${var.app_name}-${var.environment}-high-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 10
  alarm_description   = "More than 10 5XX errors in 3 minutes"

  dimensions = {
    LoadBalancer = var.alb_arn_suffix
  }

  alarm_actions = [aws_sns_topic.alerts.arn]

  tags = {
    Severity = "high"
  }
}

# Medium Alarm: High latency
resource "aws_cloudwatch_metric_alarm" "high_latency" {
  alarm_name          = "${var.app_name}-${var.environment}-high-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 5
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  extended_statistic  = "p99"
  threshold           = 2 # 2 seconds
  alarm_description   = "P99 latency above 2 seconds"

  dimensions = {
    LoadBalancer = var.alb_arn_suffix
  }

  alarm_actions = [aws_sns_topic.alerts.arn]

  tags = {
    Severity = "medium"
  }
}

output "log_group_name" {
  value = aws_cloudwatch_log_group.app.name
}

output "sns_topic_arn" {
  value = aws_sns_topic.alerts.arn
}
```

### Health Check erweitern

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    database: boolean;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  version: string;
  uptime: number;
  timestamp: string;
}

const startTime = Date.now();

export async function GET() {
  const checks = {
    database: false,
    memory: {
      used: 0,
      total: 0,
      percentage: 0,
    },
  };

  // Database Check
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch {
    checks.database = false;
  }

  // Memory Check
  const memUsage = process.memoryUsage();
  checks.memory = {
    used: Math.round(memUsage.heapUsed / 1024 / 1024),
    total: Math.round(memUsage.heapTotal / 1024 / 1024),
    percentage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
  };

  // Overall Status
  let status: HealthStatus['status'] = 'healthy';
  if (!checks.database) {
    status = 'unhealthy';
  } else if (checks.memory.percentage > 90) {
    status = 'degraded';
  }

  const response: HealthStatus = {
    status,
    checks,
    version: process.env.APP_VERSION || 'unknown',
    uptime: Math.round((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
  };

  const httpStatus = status === 'unhealthy' ? 503 : 200;

  return NextResponse.json(response, { status: httpStatus });
}
```

### Checkliste

```
Phase 1 (Minimum):
☐ CloudWatch Log Group erstellt
☐ ECS Task logging konfiguriert
☐ Health Check Endpoint implementiert
☐ SNS Topic für Alerts
☐ Alarm: Service Down
☐ Alarm: High Error Rate
☐ E-Mail Subscription

Phase 2 (Empfohlen):
☐ CloudWatch Dashboard
☐ Sentry Account + Integration
☐ Custom Metriken (Request Duration)
☐ Slow Query Logging
☐ Alarm: High Latency
☐ Alarm: High CPU/Memory

Phase 3 (Nice-to-have):
☐ Distributed Tracing (X-Ray)
☐ Slack Integration
☐ On-Call Rotation
☐ SLO/SLA Definition
☐ Cost Monitoring
```

---

## Ressourcen

- [AWS CloudWatch Documentation](https://docs.aws.amazon.com/cloudwatch/)
- [Sentry Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Google SRE Book](https://sre.google/sre-book/monitoring-distributed-systems/)
- [OpenTelemetry](https://opentelemetry.io/docs/)
- [Pino Logger](https://getpino.io/)
