# Learning 14: Testing

**Erstellt:** 2025-12-17
**Kontext:** AI-Freelancer-Plattform (Next.js, TypeScript, Prisma)

---

## Inhaltsverzeichnis

1. [Warum Testen?](#1-warum-testen)
2. [Test-Pyramide](#2-test-pyramide)
3. [Unit Tests](#3-unit-tests)
4. [Integration Tests](#4-integration-tests)
5. [End-to-End Tests](#5-end-to-end-tests)
6. [Test-Runner & Tools](#6-test-runner--tools)
7. [Mocking](#7-mocking)
8. [Testing Best Practices](#8-testing-best-practices)
9. [CI/CD Integration](#9-cicd-integration)
10. [Unser Projekt: Test-Setup](#10-unser-projekt-test-setup)

---

## 1. Warum Testen?

### Ohne Tests

```
Code ändern → Deployen → Hoffen → Bug in Production → Stress
                         😰
```

### Mit Tests

```
Code ändern → Tests laufen → Fehler gefunden → Fix vor Deploy → Sicher
                              ✅
```

### Vorteile von Tests

| Vorteil | Erklärung |
|---------|-----------|
| **Bugs früh finden** | Fehler vor Production entdecken |
| **Refactoring sicher** | Code ändern ohne Angst |
| **Dokumentation** | Tests zeigen wie Code funktioniert |
| **Design verbessern** | Testbarer Code = Besserer Code |
| **Vertrauen** | Sicher deployen |

### Kosten von Bugs

```
Fehler gefunden in:           Kosten (relativ):
- Entwicklung                 1x
- Code Review                 2x
- QA/Testing                  5x
- Production                  100x+
```

---

## 2. Test-Pyramide

### Die klassische Pyramide

```
                 /\
                /  \
               / E2E\        ← Wenige, langsam, teuer
              /------\
             /        \
            /Integration\    ← Mittel, mittel
           /------------\
          /              \
         /   Unit Tests   \  ← Viele, schnell, günstig
        /------------------\
```

### Test-Typen im Detail

```
Unit Tests (70%):
├── Testen einzelne Funktionen/Klassen
├── Isoliert (keine echte DB, API, etc.)
├── Sehr schnell (Millisekunden)
└── Beispiel: validateEmail(), calculateTotal()

Integration Tests (20%):
├── Testen Zusammenspiel mehrerer Komponenten
├── Können echte DB/Services nutzen
├── Mittelschnell (Sekunden)
└── Beispiel: API Route mit DB, React Hook mit API

E2E Tests (10%):
├── Testen gesamte User Flows
├── Browser-Automatisierung
├── Langsam (Sekunden bis Minuten)
└── Beispiel: Login → Dashboard → Create Project → Logout
```

### Testing Trophy (Kent C. Dodds)

```
        Integration Tests     ← Meiste ROI
       /                 \
      /                   \
     /  Static Types (TS)  \
    /-----------------------\
   /                         \
  /       Unit Tests          \
 /-----------------------------\
/                               \
           E2E Tests
```

---

## 3. Unit Tests

### Was testen?

```
✅ Pure Functions
✅ Utility Functions
✅ Validierung
✅ Business Logic
✅ Datenumwandlung

❌ Framework-Code (React, Next.js)
❌ Externe Libraries
❌ Triviale Getter/Setter
```

### Beispiel: Utility Function

```typescript
// src/lib/utils.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function calculateCommission(amount: number, rate: number = 0.02): number {
  return Math.round(amount * rate * 100) / 100;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

```typescript
// src/lib/__tests__/utils.test.ts
import { formatCurrency, calculateCommission, slugify } from '../utils';

describe('formatCurrency', () => {
  it('formats positive numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('1.234,56 €');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('0,00 €');
  });

  it('formats negative numbers', () => {
    expect(formatCurrency(-100)).toBe('-100,00 €');
  });
});

describe('calculateCommission', () => {
  it('calculates default 2% commission', () => {
    expect(calculateCommission(1000)).toBe(20);
  });

  it('calculates custom commission rate', () => {
    expect(calculateCommission(1000, 0.05)).toBe(50);
  });

  it('rounds to 2 decimal places', () => {
    expect(calculateCommission(33.33)).toBe(0.67);
  });

  it('handles zero amount', () => {
    expect(calculateCommission(0)).toBe(0);
  });
});

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('AI Freelancer Platform')).toBe('ai-freelancer-platform');
  });

  it('removes special characters', () => {
    expect(slugify('Hello! World?')).toBe('hello-world');
  });

  it('handles German umlauts', () => {
    expect(slugify('München Straße')).toBe('mnchen-strae');
  });

  it('trims whitespace', () => {
    expect(slugify('  hello  ')).toBe('hello');
  });
});
```

### Beispiel: Validation

```typescript
// src/lib/validation.ts
import { z } from 'zod';

export const FreelancerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  dayRate: z.number().min(100, 'Day rate must be at least 100€'),
  skills: z.array(z.string()).min(1, 'At least one skill required'),
});

export function validateFreelancer(data: unknown) {
  return FreelancerSchema.safeParse(data);
}
```

```typescript
// src/lib/__tests__/validation.test.ts
import { validateFreelancer } from '../validation';

describe('validateFreelancer', () => {
  const validData = {
    name: 'Klaus Weigele',
    email: 'klaus@example.com',
    dayRate: 800,
    skills: ['python', 'langchain'],
  };

  it('accepts valid data', () => {
    const result = validateFreelancer(validData);
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = validateFreelancer({ ...validData, name: 'K' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 2');
    }
  });

  it('rejects invalid email', () => {
    const result = validateFreelancer({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects day rate below minimum', () => {
    const result = validateFreelancer({ ...validData, dayRate: 50 });
    expect(result.success).toBe(false);
  });

  it('rejects empty skills array', () => {
    const result = validateFreelancer({ ...validData, skills: [] });
    expect(result.success).toBe(false);
  });
});
```

---

## 4. Integration Tests

### Was testen?

```
✅ API Routes mit echten Requests
✅ Database Queries
✅ React Komponenten mit Hooks
✅ Zusammenspiel mehrerer Module

❌ Vollständige User Flows (→ E2E)
❌ Externe APIs (→ Mock)
```

### Beispiel: API Route Test

```typescript
// src/app/api/freelancers/__tests__/route.test.ts
import { testApiHandler } from 'next-test-api-route-handler';
import { prisma } from '@/lib/db';
import * as appHandler from '../route';

// Test-DB Setup
beforeEach(async () => {
  await prisma.freelancerProfile.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/freelancers', () => {
  it('returns empty array when no freelancers', async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' });
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.data).toEqual([]);
      },
    });
  });

  it('returns freelancers list', async () => {
    // Seed test data
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hash',
        role: 'FREELANCER',
      },
    });

    await prisma.freelancerProfile.create({
      data: {
        userId: user.id,
        name: 'Test Freelancer',
        location: 'Berlin',
        skills: ['python'],
        experienceLevel: 'EXPERT',
        dayRate: 800,
        status: 'ACTIVE',
      },
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' });
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.data).toHaveLength(1);
        expect(data.data[0].name).toBe('Test Freelancer');
      },
    });
  });
});

describe('POST /api/freelancers', () => {
  it('creates a new freelancer', async () => {
    // Create user first
    const user = await prisma.user.create({
      data: {
        email: 'new@example.com',
        passwordHash: 'hash',
        role: 'FREELANCER',
      },
    });

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            name: 'New Freelancer',
            location: 'Munich',
            skills: ['typescript', 'react'],
            experienceLevel: 'INTERMEDIATE',
            dayRate: 600,
          }),
        });

        expect(res.status).toBe(201);

        const data = await res.json();
        expect(data.name).toBe('New Freelancer');
        expect(data.id).toBeDefined();
      },
    });
  });

  it('rejects invalid data', async () => {
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'X', // Too short
            dayRate: -100, // Negative
          }),
        });

        expect(res.status).toBe(422);
      },
    });
  });
});
```

### Beispiel: React Component Test

```typescript
// src/components/__tests__/FreelancerCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FreelancerCard } from '../FreelancerCard';

const mockFreelancer = {
  id: '123',
  name: 'Klaus Weigele',
  skills: ['Python', 'LangChain', 'RAG'],
  dayRate: 800,
  experienceLevel: 'EXPERT',
  status: 'ACTIVE',
};

describe('FreelancerCard', () => {
  it('renders freelancer information', () => {
    render(<FreelancerCard freelancer={mockFreelancer} />);

    expect(screen.getByText('Klaus Weigele')).toBeInTheDocument();
    expect(screen.getByText('800€/Tag')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('shows all skills', () => {
    render(<FreelancerCard freelancer={mockFreelancer} />);

    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('LangChain')).toBeInTheDocument();
    expect(screen.getByText('RAG')).toBeInTheDocument();
  });

  it('calls onContact when button clicked', async () => {
    const user = userEvent.setup();
    const onContact = jest.fn();

    render(<FreelancerCard freelancer={mockFreelancer} onContact={onContact} />);

    await user.click(screen.getByRole('button', { name: /kontakt/i }));

    expect(onContact).toHaveBeenCalledWith('123');
  });

  it('shows expert badge for expert level', () => {
    render(<FreelancerCard freelancer={mockFreelancer} />);

    expect(screen.getByText('Expert')).toBeInTheDocument();
  });
});
```

---

## 5. End-to-End Tests

### Was testen?

```
✅ Kritische User Journeys
✅ Komplette Flows (Login → Action → Logout)
✅ Cross-Browser Kompatibilität
✅ Responsive Design

❌ Jede mögliche Kombination
❌ Edge Cases (→ Unit Tests)
```

### Playwright Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Beispiel: E2E Test

```typescript
// e2e/freelancer-search.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Freelancer Search', () => {
  test('user can search and view freelancer profile', async ({ page }) => {
    // 1. Homepage besuchen
    await page.goto('/');
    await expect(page).toHaveTitle(/AI-Freelancer/);

    // 2. Zu Freelancer-Suche navigieren
    await page.click('text=Freelancer finden');
    await expect(page).toHaveURL('/freelancers');

    // 3. Nach Python-Skill filtern
    await page.fill('[data-testid="skill-search"]', 'python');
    await page.click('text=Suchen');

    // 4. Ergebnisse prüfen
    const results = page.locator('[data-testid="freelancer-card"]');
    await expect(results).toHaveCount(await results.count());

    // 5. Ersten Freelancer anklicken
    await results.first().click();

    // 6. Profil-Seite prüfen
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Kontakt aufnehmen')).toBeVisible();
  });

  test('displays empty state when no results', async ({ page }) => {
    await page.goto('/freelancers');

    // Nach nicht existierendem Skill suchen
    await page.fill('[data-testid="skill-search"]', 'xyznonexistent123');
    await page.click('text=Suchen');

    await expect(page.locator('text=Keine Freelancer gefunden')).toBeVisible();
  });
});

test.describe('Authentication', () => {
  test('user can login and logout', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Dashboard erreicht
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Willkommen')).toBeVisible();

    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');

    // Zurück zur Homepage
    await expect(page).toHaveURL('/');
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'wrong@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Ungültige Anmeldedaten')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
```

### Page Object Pattern

```typescript
// e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[name="email"]');
    this.passwordInput = page.locator('[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('test@example.com', 'password123');

  await expect(page).toHaveURL('/dashboard');
});
```

---

## 6. Test-Runner & Tools

### Vitest (empfohlen für unser Projekt)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js Router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));
```

### Jest (Alternative)

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**/*',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### Testing Library

```typescript
// React Testing Library Basics

// Queries (nach Priorität):
// 1. getByRole - Accessibility-first
// 2. getByLabelText - Form-Elemente
// 3. getByPlaceholderText - Inputs
// 4. getByText - Sichtbarer Text
// 5. getByTestId - Fallback

// Beispiele:
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');
screen.getByPlaceholderText('Enter your email');
screen.getByText('Welcome');
screen.getByTestId('custom-element');

// Async Queries (für dynamische Inhalte):
await screen.findByText('Loaded content');
await waitFor(() => expect(element).toBeVisible());
```

---

## 7. Mocking

### Funktionen mocken

```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock erstellen
const mockFn = vi.fn();

// Mit Return-Wert
mockFn.mockReturnValue(42);
mockFn.mockReturnValueOnce(1).mockReturnValueOnce(2);

// Mit Implementation
mockFn.mockImplementation((x) => x * 2);

// Async
mockFn.mockResolvedValue({ data: 'test' });
mockFn.mockRejectedValue(new Error('Failed'));

// Aufrufe prüfen
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');

// Reset
mockFn.mockClear();  // Aufruf-History löschen
mockFn.mockReset();  // + Return-Werte zurücksetzen
mockFn.mockRestore(); // Original wiederherstellen (bei Spies)
```

### Module mocken

```typescript
// Ganzes Modul mocken
vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// In Test verwenden
import { prisma } from '@/lib/db';

beforeEach(() => {
  vi.mocked(prisma.user.findUnique).mockResolvedValue({
    id: '123',
    email: 'test@example.com',
    // ...
  });
});
```

### API Requests mocken

```typescript
// Mit MSW (Mock Service Worker)
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  rest.get('/api/freelancers', (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          { id: '1', name: 'Klaus' },
          { id: '2', name: 'Anna' },
        ],
      })
    );
  }),

  rest.post('/api/freelancers', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(201),
      ctx.json({ id: '3', ...body })
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Database mocken

```typescript
// prisma/__mocks__/client.ts
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

export const prismaMock = mockDeep<PrismaClient>();

vi.mock('@/lib/db', () => ({
  prisma: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});

// In Tests
import { prismaMock } from '@/prisma/__mocks__/client';

it('creates user', async () => {
  const user = { id: '1', email: 'test@example.com' };
  prismaMock.user.create.mockResolvedValue(user);

  const result = await createUser({ email: 'test@example.com' });

  expect(result).toEqual(user);
  expect(prismaMock.user.create).toHaveBeenCalledWith({
    data: { email: 'test@example.com' },
  });
});
```

---

## 8. Testing Best Practices

### Test-Struktur (AAA)

```typescript
it('should calculate total correctly', () => {
  // Arrange - Setup
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 },
  ];

  // Act - Ausführen
  const result = calculateTotal(items);

  // Assert - Prüfen
  expect(result).toBe(35);
});
```

### Gute Test-Namen

```typescript
// ❌ Schlecht
it('test1', () => {});
it('works', () => {});

// ✅ Gut
it('returns empty array when no freelancers exist', () => {});
it('throws error when email is invalid', () => {});
it('calculates 2% commission by default', () => {});
```

### Was testen?

```
✅ Happy Path - Normaler Erfolgsfall
✅ Edge Cases - Grenzfälle
✅ Error Cases - Fehlerfälle
✅ Boundary Values - Grenzwerte

Beispiel für validateAge(age):
- Happy: validateAge(25) → true
- Edge: validateAge(18) → true (Grenzwert)
- Edge: validateAge(17) → false (unter Grenze)
- Error: validateAge(-1) → Error
- Error: validateAge('abc') → Error
```

### Test Isolation

```typescript
// ❌ Schlecht - Tests beeinflussen sich
let counter = 0;

it('increments counter', () => {
  counter++;
  expect(counter).toBe(1);
});

it('counter is still 1', () => {
  expect(counter).toBe(1); // Abhängig von Reihenfolge!
});

// ✅ Gut - Jeder Test ist isoliert
describe('Counter', () => {
  let counter: number;

  beforeEach(() => {
    counter = 0; // Reset vor jedem Test
  });

  it('increments counter', () => {
    counter++;
    expect(counter).toBe(1);
  });

  it('starts at 0', () => {
    expect(counter).toBe(0);
  });
});
```

### Flaky Tests vermeiden

```typescript
// ❌ Flaky - Zeitabhängig
it('expires after 1 second', async () => {
  const start = Date.now();
  await waitForExpiry();
  expect(Date.now() - start).toBe(1000); // Kann 999 oder 1001 sein!
});

// ✅ Robust
it('expires after 1 second', async () => {
  const start = Date.now();
  await waitForExpiry();
  expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
  expect(Date.now() - start).toBeLessThan(1100);
});

// ❌ Flaky - Reihenfolge abhängig
const items = await getItems();
expect(items[0].name).toBe('Klaus'); // Sortierung garantiert?

// ✅ Robust
const items = await getItems();
expect(items).toContainEqual(expect.objectContaining({ name: 'Klaus' }));
```

---

## 9. CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Run Unit Tests
        run: pnpm test:unit

      - name: Run Integration Tests
        run: pnpm test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test

      - name: Upload Coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  e2e:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      - name: Install Playwright
        run: pnpm exec playwright install --with-deps

      - name: Run E2E Tests
        run: pnpm test:e2e

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run --coverage",
    "test:watch": "vitest watch",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "pnpm test:unit && pnpm test:integration && pnpm test:e2e"
  }
}
```

---

## 10. Unser Projekt: Test-Setup

### Ordnerstruktur

```
src/
├── lib/
│   ├── utils.ts
│   └── __tests__/
│       └── utils.test.ts
├── components/
│   ├── FreelancerCard.tsx
│   └── __tests__/
│       └── FreelancerCard.test.tsx
├── app/
│   └── api/
│       └── freelancers/
│           ├── route.ts
│           └── __tests__/
│               └── route.test.ts
└── test/
    ├── setup.ts
    └── helpers/
        └── db.ts

e2e/
├── pages/
│   └── LoginPage.ts
├── freelancer.spec.ts
└── auth.spec.ts
```

### Installation

```bash
# Vitest + Testing Library
pnpm add -D vitest @vitejs/plugin-react
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
pnpm add -D jsdom

# API Testing
pnpm add -D next-test-api-route-handler

# Mocking
pnpm add -D msw jest-mock-extended

# E2E
pnpm add -D @playwright/test
pnpm exec playwright install
```

### Checkliste

```
Setup:
☐ Vitest konfiguriert
☐ Testing Library installiert
☐ Path Aliases funktionieren
☐ Test-Datenbank verfügbar

Tests schreiben:
☐ Unit Tests für Utils/Validation
☐ Integration Tests für API Routes
☐ Component Tests für wichtige UI
☐ E2E Tests für kritische Flows

CI/CD:
☐ Tests in Pipeline
☐ Coverage Reports
☐ Playwright Screenshots bei Failure
```

---

## Ressourcen

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/)
- [MSW (Mock Service Worker)](https://mswjs.io/)
- [Kent C. Dodds Testing Blog](https://kentcdodds.com/blog?q=testing)
