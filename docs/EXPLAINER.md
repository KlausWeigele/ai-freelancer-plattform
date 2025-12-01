# EXPLAINER — Erklärungen & Q&A (Living Doc)

Zweck: Dieses Dokument sammelt erklärende Einträge (How/Why) zu diesem Repository
(CI/CD, Docker, Terraform, Next.js, Architektur). Einträge werden ausschließlich
auf konkrete Fragen hin ergänzt.

Status: Keine Einträge vorhanden. Bitte eine konkrete Frage stellen.

## So funktioniert’s

- Du stellst eine konkrete Frage (z. B. „Wie funktioniert der Staging-Job in `ci.yml`?“).
- Ich füge einen neuen Eintrag hinzu: kompakt, umsetzungsorientiert, mit klickbaren Dateipfaden.
- Jeder Eintrag enthält Kurzantwort, Details mit Datei-Referenzen und ggf. nächste Schritte.

## Inhaltsverzeichnis

<!-- Wird dynamisch gepflegt, sobald Einträge existieren. -->

## Eintragsvorlage (Template)

```
## Q001 — <Kurzfrage>

- Kurzantwort: <1–3 Sätze mit der Essenz>
- Details:
  - Datei: <pfad>:<zeile> — <kurzer Hinweis>
  - Datei: <pfad>:<zeile> — <kurzer Hinweis>
- Nächste Schritte (optional): <konkret, test-/deploybar>
- Zuletzt aktualisiert: <YYYY-MM-DD>
```

Hinweise zur Darstellung:

- Datei-Referenzen als klickbare Pfade (z. B. `path/to/file.ts:42`).
- Kurze Absätze, maximal benötigte Tiefe, keine überflüssige Prosa.
- Wenn sinnvoll: Unterschiede „lokal vs. CI“, „dev vs. prod“ hervorheben.

---

Letzte Aktualisierung: 2025-11-12
Owner: Codex (auf Anfrage von Max)

---

## Q001 — Was steht in den Configuration Files?

- Kurzantwort: Die Config-Dateien definieren Build-/Lint-/Typecheck-Tasks, Styling‑Pipelines, Next.js‑Runtime/Build‑Optionen, TypeScript‑Strenge/Module und Beispiel‑Umgebungsvariablen. Sie sind auf pnpm 10.11.1 und Node 20 ausgerichtet, mit ESLint 9 (Flat Config) und Next.js Standalone‑Build für Docker.

- Details:
  - Datei: `package.json`
    - Scripts: `dev` (Next Dev), `build` (Next Build), `start` (Next Start), `lint` (ESLint 9 Flat via `eslint .`), `format`/`format:check` (Prettier), `typecheck` (tsc `--noEmit`). Prisma: `db:*` (generate, migrate, studio). Docker‑Hilfsbefehle vorhanden.
    - Package Manager: `packageManager: pnpm@10.11.1` (erzwingt Konsistenz lokal/CI).
    - Stack: Next 16, React 19, Prisma 6.18, tRPC 11.7, NextAuth v5 beta, Zod 4. Dev‑Tools: ESLint 9, Prettier 3, TS 5.9, Tailwind 4.1.

  - Datei: `pnpm-lock.yaml`
    - Lockfile für deterministische Installs/Builds. In CI wird mit `pnpm install --frozen-lockfile` gearbeitet; nicht manuell editieren.

  - Datei: `tsconfig.json`
    - Strict TS: `strict: true`, `noEmit: true`, `forceConsistentCasingInFileNames: true`.
    - Module/Target: `module: ESNext`, `moduleResolution: Bundler`, `target: ES2022`.
    - JSX: `react-jsx` (neue JSX‑Transform).
    - Pfadalias: `@/*` → `src/*` (nutzt `baseUrl` implizit Projektroot).
    - Next‑Plugin: `plugins: [{ name: "next" }]` für bessere TS‑Intellisense.
    - Includes: `next-env.d.ts`, `**/*.ts(x)`, `.next/types/**` (für App Router Typen).

  - Datei: `next.config.js`
    - `output: 'standalone'` für optimierte Docker‑Images (kopiert `.next/standalone`).
    - `reactStrictMode: true`, `swcMinify: true` (Standard‑Optimierungen).
    - Images: `formats: ['image/avif','image/webp']`, `remotePatterns` Platzhalter.
    - `env.NEXT_PUBLIC_APP_URL` Default: `http://localhost:3000`.
    - `experimental` Platzhalter ohne aktivierte Features.

  - Datei: `tailwind.config.ts`
    - Content‑Globs: `src/app`, `src/components` etc. (Purge/Safelist Quelle).
    - Theme‑Erweiterungen über CSS‑Variablen (`--primary`, `--background` …).
    - `borderRadius` an `--radius` gekoppelt.
    - Plugins: `tailwindcss-animate`.

  - Datei: `postcss.config.js`
    - Pipeline: `@tailwindcss/postcss` + `autoprefixer` (reihenfolgegerecht).

  - Datei: `eslint.config.js`
    - ESLint 9 Flat Config; erweitert `eslint-config-next/core-web-vitals`.
    - Globale Ignores: `.next/**`, `node_modules/**`, `dist/**`, `coverage/**`.
    - Hinweis: Diese Flat‑Config ist maßgeblich. Die Legacy‑Datei `.eslintrc.json` existiert zwar, wird von ESLint 9/Flat nicht mehr ausgewertet (kann für ältere Tools/Editor‑Erweiterungen nützlich sein).

  - Datei: `.prettierrc`
    - Formatting: `semi: true`, `singleQuote: true`, `trailingComma: 'es5'`, `printWidth: 100`, `endOfLine: 'lf'`.

  - Datei: `.env.example`
    - `NEXT_PUBLIC_ENVIRONMENT`: steuert Staging/Test‑Banner und Robots (siehe `src/app/layout.tsx`, `src/components/layouts/TestBanner.tsx`).
    - `DATABASE_URL`: Postgres‑Connection; wird u. a. für `/api/health` benötigt (Healthcheck liefert 503, wenn DB fehlt).
    - Auth: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `JWT_SECRET` (NextAuth v5).
    - Optional/Später: AWS SES (`EMAIL_FROM`, `AWS_SES_REGION`, Keys), `SENTRY_DSN`, Feature‑Flags (`NEXT_PUBLIC_ENABLE_MESSAGING`), AI/Payments (Anthropic/Stripe Platzhalter).

- Nächste Schritte (optional):
  - Falls Editor noch die Legacy ESLint‑Config nutzt, sicherstellen, dass ESLint 9 Flat aktiv ist (Script `pnpm lint` nutzt bereits `eslint.config.js`).
  - Vor Deployment Secrets aus `.env.example` in GitHub Secrets/Runtime‑Env setzen (keine echten Secrets ins Repo).
  - Bei Docker‑Healthchecks Datenbank erreichbar machen oder Health‑Probe temporär anpasssen, wenn reine App‑Smoke‑Tests ohne DB gewünscht sind.
  - Zuletzt aktualisiert: 2025-11-12

---

## Q002 — Wie schreibe ich diese Configs selbst? (Lernpfad + Rezepte)

- Kurzantwort: Starte mit `package.json` (Scripts/Tools), sperre den Package‑Manager (`packageManager`), lege striktes `tsconfig.json` fest, nutze ESLint 9 Flat + Prettier, konfiguriere Next über `next.config.js` (optional `output: 'standalone'` für Docker), füge Tailwind/PostCSS bei Bedarf hinzu und dokumentiere alle Env‑Variablen in `.env.example`. Validiere mit `pnpm lint && pnpm typecheck && pnpm build`.

- Schritt‑für‑Schritt‑Rezept (Minimal viable Setup):
  1. `package.json` erstellen
     - Felder: `name`, `private`, `version`, `packageManager`, `scripts`.
     - Lege direkte, verständliche Scripts fest (kein Magic):

     ```json
     {
       "name": "my-app",
       "version": "0.1.0",
       "private": true,
       "packageManager": "pnpm@10.11.1",
       "scripts": {
         "dev": "next dev",
         "build": "next build",
         "start": "next start",
         "lint": "eslint .",
         "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
         "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
         "typecheck": "tsc --noEmit"
       },
       "dependencies": {
         "next": "^16.0.0",
         "react": "^19.2.0",
         "react-dom": "^19.2.0"
       },
       "devDependencies": {
         "typescript": "^5.9.3",
         "eslint": "^9.14.0",
         "eslint-config-next": "^16.0.0",
         "prettier": "^3.6.2"
       }
     }
     ```

     - Warum? `packageManager` sorgt für Reproduzierbarkeit; klare Scripts sind die Basis deiner Toolchain.

  2. `tsconfig.json` (strict + moderne Module)

     ```json
     {
       "compilerOptions": {
         "target": "ES2022",
         "lib": ["DOM", "DOM.Iterable", "ES2022"],
         "strict": true,
         "noEmit": true,
         "module": "ESNext",
         "moduleResolution": "Bundler",
         "esModuleInterop": true,
         "resolveJsonModule": true,
         "jsx": "react-jsx",
         "paths": { "@/*": ["./src/*"] },
         "forceConsistentCasingInFileNames": true,
         "plugins": [{ "name": "next" }]
       },
       "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
       "exclude": ["node_modules"]
     }
     ```

     - Warum? `strict` verhindert ganze Klassen von Bugs; `Bundler` passt zu Next.js und modernen Bundlern; Alias `@/*` hält Imports sauber.

  3. ESLint 9 Flat (`eslint.config.js`)

     ```js
     // eslint.config.js
     import nextCoreWeb from 'eslint-config-next/core-web-vitals';
     export default [
       ...nextCoreWeb,
       { ignores: ['.next/**', 'node_modules/**', 'dist/**', 'coverage/**'] },
       // Optional: projektweite Regeln
       // { rules: { 'no-console': 'warn' } }
     ];
     ```

     - Warum? Flat Config ist das neue ESLint‑Format; Next‑Preset deckt React/Next‑Spezifika ab.

  4. Prettier (`.prettierrc`)

     ```json
     {
       "semi": true,
       "singleQuote": true,
       "trailingComma": "es5",
       "printWidth": 100,
       "endOfLine": "lf"
     }
     ```

     - Warum? Einheitlicher Stil; CI kann `format:check` als Gate nutzen.

  5. Next.js (`next.config.js`)

     ```js
     /** @type {import('next').NextConfig} */
     const nextConfig = {
       reactStrictMode: true,
       swcMinify: true,
       output: 'standalone', // für Docker-Images sinnvoll
       images: { formats: ['image/avif', 'image/webp'] },
       env: { NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' },
     };
     module.exports = nextConfig;
     ```

     - Wann `standalone`? Wenn du in Docker/Server laufst und ein schlankes Image willst. In Serverless/Edge-Umgebungen meist nicht nötig.

  6. Tailwind + PostCSS (optional, falls Styling mit Tailwind)

     ```ts
     // tailwind.config.ts
     import type { Config } from 'tailwindcss';
     export default {
       content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
       theme: { extend: {} },
       plugins: [],
     } satisfies Config;
     ```

     ```js
     // postcss.config.js
     module.exports = { plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} } };
     ```

     - Denke an: `src/app/globals.css` mit `@tailwind base; @tailwind components; @tailwind utilities;` und Import in `src/app/layout.tsx`.

  7. `.env.example` (Vorlage statt Geheimnisse)

     ```bash
     NEXT_PUBLIC_ENVIRONMENT="development"
     NEXT_PUBLIC_APP_URL="http://localhost:3000"
     DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public"
     NEXTAUTH_URL="http://localhost:3000"
     NEXTAUTH_SECRET="<generate-32-chars>"
     JWT_SECRET="<generate-32-chars>"
     ```

     - Regeln: Nie echte Secrets committen; alles, was im Browser sichtbar sein darf, mit `NEXT_PUBLIC_` prefixen.

  8. Lockfile & Tooling festzurren
     - `corepack enable && corepack prepare pnpm@10.11.1 --activate`
     - `pnpm install` erzeugt/aktualisiert `pnpm-lock.yaml` → committen.
     - CI verwendet `pnpm install --frozen-lockfile` für deterministische Installs.

  9. Validieren (rote Fäden)
     - `pnpm lint` → Lintrules greifen.
     - `pnpm typecheck` → TS streng, keine Emission.
     - `pnpm build` → Next‑Build erfolgreich; bei Docker: Image bauen und `/api/health` pingen.

- Praxis‑Tipps & Entscheidungsregeln:
  - ESLint Flat vs. `.eslintrc.*`: Nutze Flat (Zukunft), vermeide doppelte Konfigurationen.
  - `moduleResolution: Bundler`: Für Next/Vite zeitgemäß; mit Node ESM/CJS‑Mischbetrieb vorsichtig.
  - Pfadalias `@/*`: Halte Imports stabil; vermeide tiefe Relativpfade.
  - `output: 'standalone'`: Nur, wenn du im Container eine Node‑Runtime hast; nicht für Vercel/Edge.
  - Env‑Design: Alles, was Client sehen darf, `NEXT_PUBLIC_`; alles andere nur Server.
  - Commit‑Hygiene: Lockfile immer committen; Versions‑Pins für pnpm/Node in README/CI dokumentieren.

- Übung (15–20 Minuten):
  1. Lege in einem leeren Ordner `package.json`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`, `next.config.js` an (mit obigen Minimal‑Snippets).
  2. Erzeuge `src/app/page.tsx` und `src/app/layout.tsx` (+ `globals.css`).
  3. `pnpm install next react react-dom && pnpm add -D typescript eslint eslint-config-next prettier`.
  4. `pnpm dev` starten; dann `pnpm lint && pnpm typecheck && pnpm build` laufen lassen.
  5. Optional: Tailwind nachrüsten (Configs + CSS‑Direktiven), Seite neu laden.

- Nächste Schritte (optional):
  - Wir können gemeinsam eine Minimal‑App live aufsetzen; du schreibst die Dateien, ich reviewe schrittweise und erkläre „warum“ zu jeder Entscheidung.
  - Zuletzt aktualisiert: 2025-11-12
