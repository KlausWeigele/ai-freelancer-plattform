# Learning 18: Linux Shell & Bash

**Erstellt:** 2025-12-17
**Kontext:** AI-Freelancer-Plattform - Terminal-Grundlagen

---

## Inhaltsverzeichnis

1. [Was ist eine Shell?](#1-was-ist-eine-shell)
2. [Navigation und Dateisystem](#2-navigation-und-dateisystem)
3. [Dateien und Verzeichnisse](#3-dateien-und-verzeichnisse)
4. [Textverarbeitung](#4-textverarbeitung)
5. [Berechtigungen](#5-berechtigungen)
6. [Prozesse](#6-prozesse)
7. [Pipes und Redirection](#7-pipes-und-redirection)
8. [Bash-Scripting](#8-bash-scripting)
9. [SSH und Remote](#9-ssh-und-remote)
10. [Nützliche Tools](#10-nützliche-tools)

---

## 1. Was ist eine Shell?

### Definition

Eine **Shell** ist ein Kommandozeilen-Interpreter, der zwischen Benutzer und Betriebssystem vermittelt.

```
Benutzer → Shell → Betriebssystem → Hardware
         Befehle    Ausführung      Ressourcen
```

### Shell-Typen

```
sh      - Bourne Shell (Original, 1979)
bash    - Bourne Again Shell (Standard Linux)
zsh     - Z Shell (Standard macOS)
fish    - Friendly Interactive Shell
dash    - Debian Almquist Shell (schnell, minimal)
```

### Terminal vs. Shell vs. Console

```
Terminal:
└── Programm zur Anzeige (iTerm, Terminal.app, Windows Terminal)

Shell:
└── Interpreter (bash, zsh, fish)

Console:
└── Physisches Gerät (historisch) / Textmodus
```

### Dein Shell herausfinden

```bash
# Aktuelle Shell
echo $SHELL
# /bin/zsh oder /bin/bash

# Shell wechseln
chsh -s /bin/bash
```

---

## 2. Navigation und Dateisystem

### Linux Verzeichnisstruktur

```
/                   # Root (Wurzel)
├── bin/           # Wichtige Programme (ls, cp, etc.)
├── boot/          # Boot-Dateien, Kernel
├── dev/           # Geräte-Dateien (/dev/sda, /dev/null)
├── etc/           # Konfigurationsdateien
├── home/          # Benutzer-Verzeichnisse
│   └── klaus/     # Home von Klaus
├── lib/           # Shared Libraries
├── opt/           # Optionale Software
├── proc/          # Prozess-Informationen (virtuell)
├── root/          # Home von root
├── tmp/           # Temporäre Dateien
├── usr/           # User System Resources
│   ├── bin/       # Benutzer-Programme
│   └── local/     # Lokal installiert
└── var/           # Variable Daten (Logs, Datenbanken)
    └── log/       # Log-Dateien
```

### Navigation

```bash
# Aktuelles Verzeichnis
pwd
# /home/klaus/projects

# Verzeichnis wechseln
cd /home/klaus          # Absoluter Pfad
cd projects             # Relativ
cd ..                   # Ein Level hoch
cd ../..                # Zwei Level hoch
cd ~                    # Home-Verzeichnis
cd -                    # Vorheriges Verzeichnis

# Inhalt anzeigen
ls                      # Liste
ls -l                   # Details (long)
ls -la                  # Inkl. versteckte Dateien
ls -lh                  # Human-readable Größen
ls -lt                  # Sortiert nach Zeit
ls -lS                  # Sortiert nach Größe
```

### Pfade

```bash
# Absoluter Pfad (von Root)
/home/klaus/projects/freelancer

# Relativer Pfad (vom aktuellen Verzeichnis)
projects/freelancer
./projects/freelancer   # Explizit relativ

# Spezielle Verzeichnisse
.                       # Aktuelles Verzeichnis
..                      # Parent-Verzeichnis
~                       # Home-Verzeichnis
~klaus                  # Home von klaus
```

### Tab-Completion

```bash
# Tab drücken für Auto-Vervollständigung
cd pro<TAB>             # → cd projects/
cat /etc/pass<TAB>      # → cat /etc/passwd

# Doppel-Tab für Optionen
cd p<TAB><TAB>          # Zeigt: projects/ pictures/ ...
```

---

## 3. Dateien und Verzeichnisse

### Erstellen

```bash
# Datei erstellen
touch datei.txt
touch file1.txt file2.txt file3.txt

# Verzeichnis erstellen
mkdir ordner
mkdir -p parent/child/grandchild   # Mit Parents

# Datei mit Inhalt erstellen
echo "Hallo" > datei.txt
cat > datei.txt << EOF
Zeile 1
Zeile 2
EOF
```

### Kopieren

```bash
# Datei kopieren
cp original.txt kopie.txt
cp file.txt /backup/

# Verzeichnis kopieren
cp -r ordner/ backup/

# Mit Fortschritt
cp -rv ordner/ backup/

# Attribute erhalten
cp -a ordner/ backup/
```

### Verschieben/Umbenennen

```bash
# Verschieben
mv datei.txt /backup/
mv datei.txt ordner/

# Umbenennen
mv alt.txt neu.txt
mv ordner/ neuer-name/
```

### Löschen

```bash
# Datei löschen
rm datei.txt
rm file1.txt file2.txt

# Verzeichnis löschen
rmdir leerer-ordner/      # Nur wenn leer
rm -r ordner/             # Rekursiv
rm -rf ordner/            # Force, keine Nachfrage ⚠️

# Interaktiv (sicherer)
rm -i datei.txt           # Fragt nach
rm -ri ordner/
```

### Finden

```bash
# Datei finden
find . -name "*.txt"              # Nach Name
find . -type f -name "*.js"       # Nur Dateien
find . -type d -name "node*"      # Nur Verzeichnisse
find . -mtime -7                  # Geändert letzte 7 Tage
find . -size +10M                 # Größer 10MB

# Mit Aktion
find . -name "*.log" -delete      # Löschen
find . -name "*.sh" -exec chmod +x {} \;  # Ausführbar machen

# locate (schneller, nutzt Datenbank)
locate nginx.conf
updatedb                          # Datenbank aktualisieren
```

---

## 4. Textverarbeitung

### Anzeigen

```bash
# Ganze Datei
cat datei.txt

# Mit Zeilennummern
cat -n datei.txt

# Erste/Letzte Zeilen
head datei.txt            # Erste 10 Zeilen
head -n 20 datei.txt      # Erste 20 Zeilen
tail datei.txt            # Letzte 10 Zeilen
tail -f log.txt           # Follow (live)

# Seitenweise
less datei.txt            # Scrollbar (q zum Beenden)
more datei.txt            # Einfacher

# Kurzer Inhalt
cat < 10KB Dateien
less/more für größere
```

### Suchen (grep)

```bash
# In Datei suchen
grep "error" log.txt
grep -i "error" log.txt           # Case-insensitive
grep -n "error" log.txt           # Mit Zeilennummern
grep -c "error" log.txt           # Nur Anzahl

# Rekursiv in Verzeichnis
grep -r "TODO" src/
grep -rn "TODO" src/              # Mit Zeilen

# Regex
grep -E "error|warning" log.txt   # ODER
grep "^Start" log.txt             # Zeilenanfang
grep "end$" log.txt               # Zeilenende

# Invertiert (NICHT)
grep -v "debug" log.txt
```

### Bearbeiten

```bash
# sed - Stream Editor
sed 's/alt/neu/' datei.txt        # Erste Vorkommen
sed 's/alt/neu/g' datei.txt       # Alle Vorkommen
sed -i 's/alt/neu/g' datei.txt    # In-place ändern
sed '5d' datei.txt                # Zeile 5 löschen

# awk - Pattern Scanning
awk '{print $1}' datei.txt        # Erste Spalte
awk -F: '{print $1}' /etc/passwd  # Mit Delimiter
awk '{sum+=$1} END {print sum}'   # Summe

# sort
sort datei.txt                    # Alphabetisch
sort -n zahlen.txt                # Numerisch
sort -r datei.txt                 # Umgekehrt
sort -u datei.txt                 # Unique

# uniq (braucht sortierte Input)
sort datei.txt | uniq             # Duplikate entfernen
sort datei.txt | uniq -c          # Mit Anzahl

# cut
cut -d: -f1 /etc/passwd           # Feld 1, Delimiter :
cut -c1-10 datei.txt              # Zeichen 1-10

# wc - Word Count
wc datei.txt                      # Zeilen, Wörter, Bytes
wc -l datei.txt                   # Nur Zeilen
wc -w datei.txt                   # Nur Wörter
```

---

## 5. Berechtigungen

### Linux Berechtigungsmodell

```
-rwxr-xr-x  1  klaus  staff  1234  Dec 17 10:00  script.sh
│└┬┘└┬┘└┬┘     │      │
│ │  │  │      │      └── Gruppe
│ │  │  │      └── Owner
│ │  │  └── Others (alle anderen)
│ │  └── Group (Gruppe)
│ └── Owner (Besitzer)
└── Dateityp (- = Datei, d = Verzeichnis, l = Link)

r = read (4)
w = write (2)
x = execute (1)
```

### Berechtigungen ändern (chmod)

```bash
# Symbolisch
chmod +x script.sh               # Execute hinzufügen
chmod -w datei.txt               # Write entfernen
chmod u+x script.sh              # Nur für User
chmod g+rw datei.txt             # Gruppe: read+write
chmod o-rwx datei.txt            # Others: nichts
chmod a+r datei.txt              # All: read

# Numerisch (Oktal)
chmod 755 script.sh              # rwxr-xr-x
chmod 644 datei.txt              # rw-r--r--
chmod 600 secret.txt             # rw-------
chmod 777 public/                # rwxrwxrwx (⚠️ selten sinnvoll)

# Rekursiv
chmod -R 755 ordner/
```

### Besitzer ändern (chown)

```bash
# Owner ändern
chown klaus datei.txt
chown klaus:staff datei.txt      # Owner und Gruppe
chown :staff datei.txt           # Nur Gruppe

# Rekursiv
chown -R klaus:klaus /home/klaus/
```

### Typische Berechtigungen

```
Dateien:
644  rw-r--r--   Standard-Datei
600  rw-------   Private Datei (Secrets)
755  rwxr-xr-x   Ausführbares Script

Verzeichnisse:
755  rwxr-xr-x   Standard-Verzeichnis
700  rwx------   Privates Verzeichnis
```

---

## 6. Prozesse

### Prozesse anzeigen

```bash
# Aktuelle Shell
ps

# Alle Prozesse
ps aux
# a = alle User
# u = user-orientiertes Format
# x = auch ohne Terminal

# Mit Baum
ps auxf
pstree

# Live-Ansicht
top
htop                    # Besser (muss installiert sein)
```

### Prozesse steuern

```bash
# Im Hintergrund starten
command &
sleep 100 &

# Jobs anzeigen
jobs

# In Vordergrund holen
fg
fg %1                   # Job 1

# In Hintergrund schicken
bg
bg %1

# Prozess stoppen
Ctrl+C                  # Beenden (SIGINT)
Ctrl+Z                  # Pausieren (SIGTSTP)
```

### Prozesse beenden

```bash
# Mit PID
kill 1234               # Sanft (SIGTERM)
kill -9 1234            # Sofort (SIGKILL)

# Nach Name
pkill nginx
pkill -f "node server"  # Full command match
killall nginx

# Port freigeben
lsof -i :3000
kill $(lsof -ti :3000)
```

### Systemd (Service Manager)

```bash
# Service Status
systemctl status nginx
systemctl status postgresql

# Service steuern
systemctl start nginx
systemctl stop nginx
systemctl restart nginx
systemctl reload nginx

# Auto-Start
systemctl enable nginx
systemctl disable nginx

# Logs
journalctl -u nginx
journalctl -u nginx -f   # Follow
```

---

## 7. Pipes und Redirection

### Pipes (|)

```bash
# Output eines Befehls als Input des nächsten
ls | wc -l                        # Dateien zählen
cat log.txt | grep error          # Fehler filtern
ps aux | grep node                # Node-Prozesse
history | tail -20                # Letzte 20 Befehle

# Mehrere Pipes
cat access.log | grep "404" | wc -l
ps aux | grep node | grep -v grep | awk '{print $2}'
```

### Output Redirection (>, >>)

```bash
# Überschreiben (>)
echo "Hallo" > datei.txt
ls > files.txt

# Anhängen (>>)
echo "Zeile 2" >> datei.txt
date >> log.txt

# Fehler umleiten (2>)
command 2> errors.txt
command 2>/dev/null              # Fehler ignorieren

# Stdout und Stderr
command > output.txt 2>&1        # Beide in Datei
command &> output.txt            # Kurzform (bash)
```

### Input Redirection (<)

```bash
# Aus Datei lesen
mysql < script.sql
sort < unsorted.txt > sorted.txt

# Here Document
cat << EOF > config.txt
line 1
line 2
EOF
```

### Nützliche Kombinationen

```bash
# Fehler und Output trennen
command > output.txt 2> errors.txt

# Tee (Output UND Datei)
command | tee output.txt         # Zeigt und speichert
command | tee -a log.txt         # Anhängen

# /dev/null (Schwarzes Loch)
command > /dev/null              # Output verwerfen
command 2> /dev/null             # Errors verwerfen
command &> /dev/null             # Beides verwerfen
```

---

## 8. Bash-Scripting

### Grundstruktur

```bash
#!/bin/bash
# Shebang - welcher Interpreter

# Kommentar
echo "Hallo Welt"
```

### Variablen

```bash
# Setzen (KEIN Leerzeichen um =)
name="Klaus"
zahl=42

# Verwenden
echo $name
echo "Hallo $name"
echo "Hallo ${name}!"    # Für Klarheit

# Umgebungsvariablen
export PATH="$PATH:/custom/bin"
echo $HOME
echo $USER
echo $PWD
```

### Bedingte Ausführung

```bash
# if-then-else
if [ "$name" = "Klaus" ]; then
    echo "Hallo Klaus"
elif [ "$name" = "Anna" ]; then
    echo "Hallo Anna"
else
    echo "Wer bist du?"
fi

# Vergleiche
[ "$a" = "$b" ]         # String gleich
[ "$a" != "$b" ]        # String ungleich
[ -z "$a" ]             # String leer
[ -n "$a" ]             # String nicht leer

[ "$a" -eq "$b" ]       # Zahlen gleich
[ "$a" -ne "$b" ]       # Zahlen ungleich
[ "$a" -lt "$b" ]       # Kleiner
[ "$a" -gt "$b" ]       # Größer
[ "$a" -le "$b" ]       # Kleiner oder gleich
[ "$a" -ge "$b" ]       # Größer oder gleich

# Datei-Tests
[ -f "$file" ]          # Ist Datei
[ -d "$dir" ]           # Ist Verzeichnis
[ -e "$path" ]          # Existiert
[ -r "$file" ]          # Lesbar
[ -w "$file" ]          # Schreibbar
[ -x "$file" ]          # Ausführbar

# Logisch
[ "$a" = "1" ] && [ "$b" = "2" ]   # UND
[ "$a" = "1" ] || [ "$b" = "2" ]   # ODER
```

### Schleifen

```bash
# for-Schleife
for i in 1 2 3 4 5; do
    echo "Nummer: $i"
done

# Range
for i in {1..10}; do
    echo $i
done

# Dateien
for file in *.txt; do
    echo "Verarbeite: $file"
done

# while-Schleife
counter=0
while [ $counter -lt 5 ]; do
    echo $counter
    counter=$((counter + 1))
done

# Datei lesen
while read line; do
    echo "Zeile: $line"
done < datei.txt
```

### Funktionen

```bash
# Definition
greet() {
    echo "Hallo $1!"
}

# Mit Return
add() {
    local result=$(($1 + $2))
    echo $result
}

# Aufruf
greet "Klaus"
summe=$(add 5 3)
echo "Summe: $summe"
```

### Beispiel-Script

```bash
#!/bin/bash
# deploy.sh - Deployment Script

set -e  # Bei Fehler abbrechen

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Funktionen
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    exit 1
}

# Checks
if [ ! -f "package.json" ]; then
    error "Nicht im Projekt-Verzeichnis!"
fi

# Deployment
log "Building..."
pnpm build || error "Build fehlgeschlagen"

log "Running tests..."
pnpm test || error "Tests fehlgeschlagen"

log "Deploying..."
# deployment commands...

log "Fertig!"
```

---

## 9. SSH und Remote

### SSH Verbindung

```bash
# Basis-Verbindung
ssh user@server.com
ssh klaus@192.168.1.100

# Mit Port
ssh -p 2222 user@server.com

# Mit Identity File
ssh -i ~/.ssh/mykey.pem user@server.com
```

### SSH Keys

```bash
# Key generieren
ssh-keygen -t ed25519 -C "klaus@example.com"
# oder RSA (älter, kompatibler)
ssh-keygen -t rsa -b 4096

# Keys anzeigen
ls ~/.ssh/
# id_ed25519      (privat - NIEMALS teilen!)
# id_ed25519.pub  (öffentlich)

# Public Key auf Server kopieren
ssh-copy-id user@server.com
# oder manuell
cat ~/.ssh/id_ed25519.pub | ssh user@server.com "cat >> ~/.ssh/authorized_keys"
```

### SSH Config

```bash
# ~/.ssh/config
Host prod
    HostName server.example.com
    User deploy
    IdentityFile ~/.ssh/deploy_key
    Port 22

Host dev
    HostName dev.example.com
    User klaus

# Nutzung
ssh prod                # Statt: ssh -i ~/.ssh/deploy_key deploy@server.example.com
```

### SCP (Secure Copy)

```bash
# Datei zum Server
scp file.txt user@server:/path/

# Datei vom Server
scp user@server:/path/file.txt ./

# Verzeichnis
scp -r ordner/ user@server:/path/
```

### Befehle auf Remote ausführen

```bash
# Einzelner Befehl
ssh user@server "ls -la"
ssh user@server "cd /app && git pull"

# Script ausführen
ssh user@server 'bash -s' < local-script.sh
```

---

## 10. Nützliche Tools

### System-Information

```bash
# OS Info
uname -a
cat /etc/os-release

# Hardware
lscpu                   # CPU Info
free -h                 # RAM
df -h                   # Disk Space
du -sh *                # Verzeichnisgrößen

# Netzwerk
ip addr                 # IP-Adressen
ifconfig                # (älter)
netstat -tulpn          # Offene Ports
ss -tulpn               # (neuer)
```

### Download

```bash
# curl
curl https://example.com                    # Anzeigen
curl -o file.txt https://example.com        # Speichern
curl -O https://example.com/file.zip        # Original-Name
curl -I https://example.com                 # Nur Header

# wget
wget https://example.com/file.zip
wget -c https://example.com/large.zip       # Continue
```

### Archive

```bash
# tar
tar -cvf archive.tar ordner/                # Erstellen
tar -xvf archive.tar                        # Entpacken
tar -czvf archive.tar.gz ordner/            # Mit gzip
tar -xzvf archive.tar.gz                    # Entpacken

# zip
zip -r archive.zip ordner/
unzip archive.zip
```

### Monitoring

```bash
# Live-Logs
tail -f /var/log/syslog
journalctl -f

# Disk I/O
iostat
iotop

# Network
iftop
nethogs
```

### Cheatsheet

```bash
# Navigation
cd, pwd, ls

# Dateien
cp, mv, rm, mkdir, touch, find

# Text
cat, less, head, tail, grep, sed, awk

# Berechtigungen
chmod, chown

# Prozesse
ps, top, kill, systemctl

# Netzwerk
ssh, scp, curl, wget

# System
df, du, free, uname
```

---

## Ressourcen

- [The Linux Command Line (Buch)](https://linuxcommand.org/tlcl.php)
- [Explain Shell](https://explainshell.com/)
- [Bash Guide](https://mywiki.wooledge.org/BashGuide)
- [ShellCheck](https://www.shellcheck.net/)
- [TLDR Pages](https://tldr.sh/)
