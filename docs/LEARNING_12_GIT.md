# Learning 12: Git Basics

**Erstellt:** 2025-12-17
**Kontext:** AI-Freelancer-Plattform - Versionskontrolle verstehen

---

## Inhaltsverzeichnis

1. [Was ist Git?](#1-was-ist-git)
2. [Grundkonzepte](#2-grundkonzepte)
3. [Basis-Befehle](#3-basis-befehle)
4. [Branches](#4-branches)
5. [Remote Repositories](#5-remote-repositories)
6. [Merge und Rebase](#6-merge-und-rebase)
7. [Konflikte lösen](#7-konflikte-lösen)
8. [Fortgeschrittene Befehle](#8-fortgeschrittene-befehle)
9. [Workflows](#9-workflows)
10. [Best Practices](#10-best-practices)

---

## 1. Was ist Git?

### Definition

**Git** ist ein **verteiltes Versionskontrollsystem** (DVCS), das 2005 von Linus Torvalds für die Linux-Kernel-Entwicklung erstellt wurde.

### Warum Versionskontrolle?

```
Ohne Git:
├── projekt_v1.zip
├── projekt_v2_final.zip
├── projekt_v2_final_WIRKLICH.zip
├── projekt_v3_backup_klaus.zip
└── projekt_FINAL_FINAL.zip  😱

Mit Git:
└── projekt/
    └── .git/  (komplette History)
```

### Git vs. andere Systeme

| Feature | Git | SVN | Mercurial |
|---------|-----|-----|-----------|
| Verteilt | ✅ | ❌ | ✅ |
| Branching | Schnell | Langsam | Schnell |
| Offline | ✅ | ❌ | ✅ |
| Marktanteil | ~95% | ~3% | ~2% |

---

## 2. Grundkonzepte

### Die drei Bereiche

```
┌─────────────────────────────────────────────────────────┐
│                    Working Directory                     │
│                  (Deine Arbeitsdateien)                 │
└─────────────────────────┬───────────────────────────────┘
                          │ git add
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     Staging Area                         │
│                (Vorbereitete Änderungen)                │
└─────────────────────────┬───────────────────────────────┘
                          │ git commit
                          ▼
┌─────────────────────────────────────────────────────────┐
│                       Repository                         │
│                   (Git-Datenbank)                       │
└─────────────────────────────────────────────────────────┘
```

### Commits

Ein **Commit** ist ein Snapshot deines Projekts zu einem bestimmten Zeitpunkt.

```
Commit enthält:
├── Snapshot aller Dateien
├── Autor (Name + E-Mail)
├── Datum
├── Commit-Message
├── Parent Commit (Vorgänger)
└── SHA-1 Hash (eindeutige ID)

Beispiel:
commit 64e2a6c (HEAD -> master)
Author: Klaus Weigele <klaus@example.com>
Date:   Tue Dec 17 10:30:00 2024 +0100

    feat: add user authentication
```

### Branches

Ein **Branch** ist ein Zeiger auf einen bestimmten Commit.

```
main    ─────●─────●─────●─────●
                          │
feature/auth              └────●─────●
                                     │
                                   HEAD
```

### HEAD

**HEAD** ist ein Zeiger auf den aktuellen Branch (oder Commit).

```
HEAD → main → commit abc123
```

---

## 3. Basis-Befehle

### Repository erstellen

```bash
# Neues Repository initialisieren
git init

# Bestehendes Repository klonen
git clone https://github.com/user/repo.git

# Mit SSH
git clone git@github.com:user/repo.git

# In bestimmtes Verzeichnis
git clone https://github.com/user/repo.git mein-ordner
```

### Status und Änderungen

```bash
# Status anzeigen
git status

# Kurzform
git status -s

# Änderungen anzeigen (nicht staged)
git diff

# Änderungen anzeigen (staged)
git diff --staged

# Änderungen einer Datei
git diff src/app/page.tsx
```

### Dateien hinzufügen (Staging)

```bash
# Eine Datei hinzufügen
git add src/app/page.tsx

# Mehrere Dateien
git add src/app/page.tsx src/lib/db.ts

# Alle Änderungen im aktuellen Verzeichnis
git add .

# Alle Änderungen im gesamten Repo
git add -A

# Interaktiv (Teil einer Datei)
git add -p

# Nur bereits getrackte Dateien
git add -u
```

### Commit erstellen

```bash
# Mit Message
git commit -m "feat: add login page"

# Editor öffnen für längere Message
git commit

# Add + Commit in einem (nur getrackte Dateien)
git commit -am "fix: correct typo"

# Letzten Commit ändern (VORSICHT bei gepushten Commits!)
git commit --amend -m "neue message"

# Leeren Commit (z.B. für CI-Trigger)
git commit --allow-empty -m "trigger ci"
```

### History anzeigen

```bash
# Commit-History
git log

# Kompakte Ansicht
git log --oneline

# Mit Graph
git log --oneline --graph

# Letzte 5 Commits
git log -5

# Commits einer Datei
git log -- src/app/page.tsx

# Commits eines Autors
git log --author="Klaus"

# Commits mit Änderungen
git log -p

# Schöne formatierte Ausgabe
git log --pretty=format:"%h %ad | %s%d [%an]" --date=short
```

### Dateien entfernen

```bash
# Aus Git und Dateisystem löschen
git rm datei.txt

# Nur aus Git entfernen (Datei behalten)
git rm --cached datei.txt

# Ordner entfernen
git rm -r ordner/
```

### Dateien umbenennen/verschieben

```bash
# Umbenennen
git mv alt.txt neu.txt

# Verschieben
git mv datei.txt ordner/datei.txt
```

---

## 4. Branches

### Branch-Befehle

```bash
# Alle Branches anzeigen
git branch

# Auch Remote Branches
git branch -a

# Neuen Branch erstellen
git branch feature/login

# Branch wechseln
git checkout feature/login
# oder (neuer):
git switch feature/login

# Erstellen + Wechseln
git checkout -b feature/login
# oder:
git switch -c feature/login

# Branch umbenennen
git branch -m alter-name neuer-name

# Aktuellen Branch umbenennen
git branch -m neuer-name

# Branch löschen (nur wenn gemerged)
git branch -d feature/login

# Branch löschen (erzwungen)
git branch -D feature/login

# Remote Branch löschen
git push origin --delete feature/login
```

### Branching-Strategien

```
1. Feature Branches
   main ─────●─────●─────●
                   │
   feature/auth    └────●─────●

2. GitFlow
   main     ─────●─────────────────●
                 │                 │
   develop  ─────●─────●─────●─────●
                       │     │
   feature/x           └──●──┘

3. Trunk-Based (unser Ansatz)
   main ─────●─────●─────●─────●─────●
             │           │
   feature   └──●        └──●
             (kurz)     (kurz)
```

---

## 5. Remote Repositories

### Remote verwalten

```bash
# Remotes anzeigen
git remote -v

# Remote hinzufügen
git remote add origin https://github.com/user/repo.git

# Remote URL ändern
git remote set-url origin git@github.com:user/repo.git

# Remote entfernen
git remote remove origin
```

### Fetch, Pull, Push

```bash
# Änderungen holen (ohne zu mergen)
git fetch origin

# Alle Remotes fetchen
git fetch --all

# Änderungen holen und mergen
git pull origin main

# Pull mit Rebase (sauberer History)
git pull --rebase origin main

# Änderungen pushen
git push origin main

# Neuen Branch pushen
git push -u origin feature/login

# Force Push (VORSICHT!)
git push --force origin feature/login

# Force mit Lease (sicherer)
git push --force-with-lease origin feature/login
```

### Upstream setzen

```bash
# Upstream für aktuellen Branch setzen
git push -u origin feature/login

# Danach reicht:
git push
git pull
```

---

## 6. Merge und Rebase

### Merge

```bash
# Branch in aktuellen Branch mergen
git merge feature/login

# Merge ohne Fast-Forward (immer Merge-Commit)
git merge --no-ff feature/login

# Merge abbrechen
git merge --abort
```

```
Vor Merge:
main     ─────●─────●
                    │
feature             └────●─────●

Nach Merge (fast-forward):
main     ─────●─────●─────●─────●
                              ↑
                           feature

Nach Merge (--no-ff):
main     ─────●─────●─────────────●
                    │             │
feature             └────●─────●──┘
                              ↑
                         merge commit
```

### Rebase

```bash
# Feature Branch auf main rebasen
git checkout feature/login
git rebase main

# Interaktiver Rebase (Commits bearbeiten)
git rebase -i HEAD~3

# Rebase abbrechen
git rebase --abort

# Nach Konfliktlösung fortfahren
git rebase --continue
```

```
Vor Rebase:
main     ─────●─────●─────●
              │
feature       └────●─────●

Nach Rebase:
main     ─────●─────●─────●
                          │
feature                   └────●'─────●'
                               (neue commits)
```

### Merge vs. Rebase

| Aspekt | Merge | Rebase |
|--------|-------|--------|
| History | Merge-Commits | Linear |
| Komplexität | Einfacher | Komplexer |
| Sicherheit | Sicher | Vorsicht bei shared branches |
| Empfehlung | Für main | Für lokale feature branches |

---

## 7. Konflikte lösen

### Wann entstehen Konflikte?

```
Beide bearbeiten dieselbe Zeile:

main:      console.log("Hello");
feature:   console.log("Hallo");

Git kann nicht automatisch entscheiden!
```

### Konflikt erkennen

```bash
$ git merge feature/login
Auto-merging src/app/page.tsx
CONFLICT (content): Merge conflict in src/app/page.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

### Konflikt in Datei

```
<<<<<<< HEAD
console.log("Hello");
=======
console.log("Hallo");
>>>>>>> feature/login
```

### Konflikt lösen

```bash
# 1. Datei öffnen und manuell lösen
# 2. Konfliktmarker entfernen
# 3. Datei stagen
git add src/app/page.tsx

# 4. Merge fortsetzen
git commit -m "merge: resolve conflicts"

# Oder Merge abbrechen
git merge --abort
```

### VS Code Merge-Tool

VS Code zeigt Konflikte mit Buttons:
- **Accept Current Change** (HEAD)
- **Accept Incoming Change** (Branch)
- **Accept Both Changes**
- **Compare Changes**

### Konflikt-Prävention

```bash
# Regelmäßig main in feature branch mergen
git checkout feature/login
git merge main

# Oder rebasen
git rebase main
```

---

## 8. Fortgeschrittene Befehle

### Stash (Änderungen parken)

```bash
# Änderungen stashen
git stash

# Mit Nachricht
git stash save "WIP: login form"

# Auch ungetrackte Dateien
git stash -u

# Stash-Liste anzeigen
git stash list

# Letzten Stash anwenden (und behalten)
git stash apply

# Letzten Stash anwenden (und löschen)
git stash pop

# Bestimmten Stash anwenden
git stash apply stash@{2}

# Stash löschen
git stash drop stash@{0}

# Alle Stashes löschen
git stash clear
```

### Cherry-Pick

```bash
# Einzelnen Commit in aktuellen Branch übernehmen
git cherry-pick abc1234

# Mehrere Commits
git cherry-pick abc1234 def5678

# Ohne Commit (nur Änderungen)
git cherry-pick --no-commit abc1234
```

### Reset

```bash
# Staging rückgängig (Dateien behalten)
git reset HEAD datei.txt

# Letzten Commit rückgängig (Änderungen behalten)
git reset --soft HEAD~1

# Letzten Commit rückgängig (Änderungen staged)
git reset HEAD~1

# Letzten Commit rückgängig (Änderungen verwerfen!)
git reset --hard HEAD~1

# Auf bestimmten Commit zurücksetzen
git reset --hard abc1234
```

### Revert

```bash
# Commit rückgängig machen (mit neuem Commit)
git revert abc1234

# Mehrere Commits
git revert abc1234 def5678

# Ohne automatischen Commit
git revert --no-commit abc1234
```

### Unterschied Reset vs. Revert

```
Reset: Entfernt Commits aus der History
       (problematisch bei gepushten Commits)

Revert: Erstellt neuen Commit, der Änderungen rückgängig macht
        (sicher für gepushte Commits)
```

### Bisect (Bug finden)

```bash
# Bisect starten
git bisect start

# Aktueller Commit ist schlecht
git bisect bad

# Bekannt guter Commit
git bisect good abc1234

# Git checkt automatisch Commits aus
# Teste und markiere:
git bisect good  # oder
git bisect bad

# Bisect beenden
git bisect reset
```

### Blame (Wer hat's geschrieben?)

```bash
# Zeigt wer welche Zeile geschrieben hat
git blame src/app/page.tsx

# Bestimmte Zeilen
git blame -L 10,20 src/app/page.tsx
```

### Reflog (Rettungsring)

```bash
# Zeigt ALLE Referenz-Änderungen (auch "gelöschte" Commits)
git reflog

# Commit wiederherstellen
git checkout abc1234
git branch recovered-branch
```

---

## 9. Workflows

### Unser Workflow (Trunk-Based)

```bash
# 1. Main aktualisieren
git checkout main
git pull

# 2. Feature Branch erstellen
git checkout -b feature/user-profile

# 3. Entwickeln und committen
git add .
git commit -m "feat: add user profile page"

# 4. Regelmäßig main einarbeiten
git fetch origin
git rebase origin/main

# 5. Pushen
git push -u origin feature/user-profile

# 6. Pull Request erstellen (GitHub)
gh pr create --title "Add user profile" --body "..."

# 7. Nach Review: Merge in main
# (via GitHub UI oder gh pr merge)

# 8. Lokalen Branch aufräumen
git checkout main
git pull
git branch -d feature/user-profile
```

### Conventional Commits

```
Format: <type>(<scope>): <description>

Types:
- feat:     Neues Feature
- fix:      Bugfix
- docs:     Dokumentation
- style:    Formatierung (kein Code-Change)
- refactor: Code-Umbau (keine neuen Features)
- test:     Tests hinzufügen/ändern
- chore:    Maintenance (Dependencies, CI, etc.)

Beispiele:
feat(auth): add Google OAuth login
fix(api): handle null values in response
docs: update README installation steps
refactor(db): extract query builder
chore: update dependencies
```

### GitHub Flow

```
1. Branch von main erstellen
2. Commits machen
3. Pull Request öffnen
4. Review und Diskussion
5. Merge in main
6. Deploy
```

---

## 10. Best Practices

### Commit-Messages

```
✅ Gute Messages:
- feat: add password reset functionality
- fix: prevent crash when user has no email
- refactor: extract validation logic into helper

❌ Schlechte Messages:
- update
- fix bug
- WIP
- asdfasdf
```

### Commits

```
✅ Best Practices:
- Kleine, fokussierte Commits
- Jeder Commit sollte kompilieren/funktionieren
- Logische Einheiten (nicht "EOD commit")
- Keine Secrets committen!

❌ Vermeiden:
- Riesige Commits mit vielen Änderungen
- "Fix typo" zwischen Feature-Commits
- Commits die den Build brechen
```

### Branches

```
✅ Best Practices:
- Kurze Lebenszeit (max. wenige Tage)
- Beschreibende Namen: feature/user-auth, fix/login-crash
- Regelmäßig main einarbeiten
- Nach Merge löschen

❌ Vermeiden:
- Langlebige Feature Branches
- Namen wie "test", "dev2", "klaus-branch"
- Direkt auf main committen (bei Team-Projekten)
```

### .gitignore

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build Output
.next/
dist/
build/

# Environment
.env
.env.local
.env*.local

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/

# Secrets (WICHTIG!)
*.pem
*.key
credentials.json
```

### Git-Konfiguration

```bash
# Globale Einstellungen
git config --global user.name "Klaus Weigele"
git config --global user.email "klaus@example.com"

# Standard-Branch
git config --global init.defaultBranch main

# Editor
git config --global core.editor "code --wait"

# Aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --decorate"

# Pull-Strategie
git config --global pull.rebase true

# Auto-Stash bei Pull
git config --global rebase.autoStash true
```

### Nützliche Aliases

```bash
# In ~/.gitconfig oder via git config
[alias]
    # Shortcuts
    co = checkout
    br = branch
    ci = commit
    st = status

    # Schönes Log
    lg = log --oneline --graph --decorate --all

    # Letzten Commit anzeigen
    last = log -1 HEAD

    # Unstage
    unstage = reset HEAD --

    # Alle Änderungen verwerfen
    discard = checkout --

    # Branches aufräumen (gemergte löschen)
    cleanup = "!git branch --merged | grep -v '\\*\\|main\\|master' | xargs -n 1 git branch -d"
```

---

## Cheatsheet

```bash
# Basis
git init                    # Repo erstellen
git clone <url>             # Repo klonen
git status                  # Status anzeigen
git add <file>              # Datei stagen
git commit -m "msg"         # Commit erstellen
git log --oneline           # History anzeigen

# Branches
git branch                  # Branches anzeigen
git checkout -b <name>      # Branch erstellen + wechseln
git merge <branch>          # Branch mergen
git branch -d <name>        # Branch löschen

# Remote
git remote -v               # Remotes anzeigen
git fetch                   # Änderungen holen
git pull                    # Fetch + Merge
git push                    # Änderungen pushen

# Rückgängig
git reset HEAD <file>       # Unstagen
git checkout -- <file>      # Änderungen verwerfen
git revert <commit>         # Commit rückgängig
git stash                   # Änderungen parken

# Fortgeschritten
git rebase <branch>         # Rebase
git cherry-pick <commit>    # Commit übernehmen
git bisect                  # Bug-Suche
git reflog                  # Alle Aktionen anzeigen
```

---

## Ressourcen

- [Pro Git Book (kostenlos)](https://git-scm.com/book/de/v2)
- [Git Cheatsheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Learn Git Branching (interaktiv)](https://learngitbranching.js.org/)
- [Oh Shit, Git!?!](https://ohshitgit.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
