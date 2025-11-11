# AGENTS.md — Projektleitfaden für Agents (Codex, Claude Code) und Mitwirkende

Geltungsbereich: Gesamtes Repository. Dieses Dokument beschreibt, wie in diesem Projekt gearbeitet wird und worauf Agents achten müssen. Bei widersprüchlichen Angaben haben direkte Anweisungen von Klaus Vorrang.

## Quellen der Wahrheit
- `CLAUDE.md` – Projektkontext (Vision, Architektur, Phasen, Standards). Vor größeren Änderungen lesen/aktualisieren.
- `SESSIONS.md` – Fortlaufendes Team-Log jeder Session (Wer? Was? Ergebnis? Nächste Schritte?). Am Ende jeder Session ergänzen.
- `TODO.md` – Aufgaben/Phasen-Tracking. Tasks hier pflegen, PR-Links ergänzen.

## Zuständigkeiten & Vergabe
- Aufgaben- und Rollenvergabe erfolgt pro Task/Session durch Klaus.
- Agents (Claude Code, Codex) machen Vorschläge; finale Entscheidung liegt bei Klaus.
- Jede Vergabe bitte in `SESSIONS.md` dokumentieren (Owner, Reviewer, Ziel, Ergebnis).
- Es gibt keine festen, vorab definierten Zuständigkeiten.

Capabilities-Übersicht (nicht bindend):
- Claude Code: App-Features, UI/UX, Content, Produktdokumentation.
- Codex: CI/CD, Docker, Lint/Typecheck, Terraform/IaC, AWS-Deployments.

## Tooling und Versionen
- Package Manager: pnpm 10.11.1 (über Corepack). Lockfile ist verpflichtend und im Repo getrackt (`pnpm-lock.yaml`).
  - Aktivieren: `corepack enable && corepack prepare pnpm@10.11.1 --activate`
  - Falls pnpm ein Parent-Workspace erkennt: im Projektverzeichnis mit `--ignore-workspace` arbeiten (z. B. `pnpm install --ignore-workspace`).
- Node.js: Zielumgebung ist Node 20 (siehe CI). Lokal Node >= 20 verwenden.
  - Hinweis zur lokalen Shell: In interaktiven zsh‑Shells wird NVM i. d. R. automatisch geladen. In nicht-interaktiven bash‑Shells ggf. `source ~/.nvm/nvm.sh && nvm use 20` ausführen, damit die korrekte Node‑Version aktiv ist.

## Qualitätssicherung
- Lint: ESLint 9 (Flat Config) mit `eslint-config-next/core-web-vitals`.
  - Befehl: `pnpm lint` (nutzt `eslint .`), nicht `next lint`.
- Formatierung: Prettier (`pnpm format`, `pnpm format:check`).
- Type-Check: `pnpm typecheck`.
- Build: `pnpm build` (Next `output: 'standalone'`).

## Docker und CI/CD
- Dockerfile (Multi-Stage) pinnt pnpm auf 10.11.1. Health‑Check: `/api/health`.
- GitHub Actions Workflows nutzen:
  - pnpm-Cache (`cache: 'pnpm'`) und `pnpm install --frozen-lockfile`.
  - Lint/Typecheck/Build/Docker‑Build als Gates. Tests sind aktuell noch nicht implementiert.
- Wichtige Regel: Entferne `--frozen-lockfile` oder den Cache nur mit Begründung (und Dokumentation in `SESSIONS.md`).

## Branch/PR/Commits
- Branches: `feat/*`, `fix/*`, `chore/*`, `ci/*`, `infra/*`.
- Conventional Commits; Footer: „🤖 Generated with Claude Code“.
- Kleine, fokussierte PRs. PR‑Beschreibung: Zweck, Änderungen, Checks, ggf. Links zu `TODO.md`/`SESSIONS.md`.

## Arbeitsweise für Agents
1. Vor Start kurz `CLAUDE.md` und offene Punkte in `TODO.md` prüfen.
2. Bei mehrschrittigen Aufgaben eine kurze Plan‑Notiz pflegen und am Ende aktualisieren (Status + nächste Schritte).
3. Änderungen minimal-invasiv halten; keine Versions‑Upgrades großer Abhängigkeiten ohne Freigabe.
4. Nach substantiellen Änderungen:
   - `SESSIONS.md` mit Ergebnis/Commits/Nächsten Schritten ergänzen.
   - Bei größeren Architektur-/Prozessänderungen zusätzlich `CLAUDE.md` aktualisieren.

## Do/Don’t
- Do: pnpm + Lockfile nutzen; deterministische Builds sicherstellen.
- Do: ESLint Flat Config verwenden; `next lint` nicht verwenden.
- Do: Docker‑Build lokal testen, wenn CI‑Änderungen.
- Don’t: Unverlangt Major‑Upgrades von Node/Next/Prisma einführen.
- Don’t: Unzusammenhängende Refactors in denselben PR mischen.

## Nützliche Kommandos
```
corepack enable && corepack prepare pnpm@10.11.1 --activate
pnpm install --frozen-lockfile
pnpm lint && pnpm typecheck && pnpm build
docker build -t app . && docker run -p 3000:3000 app
```

## Pflege dieses Dokuments
- Dieses AGENTS.md ist projektspezifisch. Bei Änderungen am Workflow, an CI/CD oder am Tooling hier aktualisieren.
- Hinweis: Dieses Projekt nutzt `CLAUDE.md` explizit als kontextgebendes „Agent‑Gedächtnis“. Agents sollen `CLAUDE.md` proaktiv lesen und aktualisieren.
