# Learning Guide 20: Server & Administration

> **Für Klaus** - Server-Grundlagen und System-Administration verstehen

---

## Inhaltsverzeichnis

1. [Was ist ein Server?](#was-ist-ein-server)
2. [Server-Hardware](#server-hardware)
3. [Betriebssysteme](#betriebssysteme)
4. [Prozess-Management](#prozess-management)
5. [Systemd & Services](#systemd--services)
6. [Benutzer & Berechtigungen](#benutzer--berechtigungen)
7. [Logging & Monitoring](#logging--monitoring)
8. [Backup & Recovery](#backup--recovery)
9. [Sicherheit](#sicherheit)
10. [Cloud vs. On-Premise](#cloud-vs-on-premise)

---

## Was ist ein Server?

### Definition

Ein Server ist ein Computer, der Dienste für andere Computer (Clients) bereitstellt.

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT-SERVER MODELL                      │
│                                                             │
│     ┌────────┐          Request           ┌────────────┐   │
│     │ Client │ ─────────────────────────▶ │   Server   │   │
│     │  (PC)  │ ◀───────────────────────── │  (Dienst)  │   │
│     └────────┘          Response          └────────────┘   │
│                                                             │
│  Client: Anfrage stellen                                    │
│  Server: Anfrage verarbeiten, Antwort senden               │
└─────────────────────────────────────────────────────────────┘
```

### Server-Typen nach Funktion

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVER-TYPEN                              │
├────────────────┬────────────────────────────────────────────┤
│ Web Server     │ HTTP/HTTPS Anfragen, statische Dateien    │
│                │ Nginx, Apache, Caddy                       │
├────────────────┼────────────────────────────────────────────┤
│ Application    │ Business-Logik, APIs                       │
│ Server         │ Node.js, Python, Java                      │
├────────────────┼────────────────────────────────────────────┤
│ Database       │ Datenspeicherung & Abfragen               │
│ Server         │ PostgreSQL, MySQL, MongoDB                 │
├────────────────┼────────────────────────────────────────────┤
│ Mail Server    │ E-Mail senden/empfangen                   │
│                │ Postfix, Exchange                          │
├────────────────┼────────────────────────────────────────────┤
│ File Server    │ Dateispeicherung im Netzwerk              │
│                │ NFS, Samba, S3                             │
├────────────────┼────────────────────────────────────────────┤
│ DNS Server     │ Domain-Namen auflösen                     │
│                │ BIND, Unbound, Route53                     │
├────────────────┼────────────────────────────────────────────┤
│ Proxy Server   │ Vermittler zwischen Client & Server       │
│                │ Nginx, HAProxy, Traefik                    │
└────────────────┴────────────────────────────────────────────┘
```

### Server-Deployment-Modelle

```
┌─────────────────────────────────────────────────────────────┐
│             PHYSICAL vs VIRTUAL vs CONTAINER                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PHYSICAL SERVER (Bare Metal):                              │
│  ┌─────────────────────────────────────┐                   │
│  │           Application               │                   │
│  │           Betriebssystem            │                   │
│  │           Hardware                  │                   │
│  └─────────────────────────────────────┘                   │
│  + Maximum Performance                                      │
│  - Teuer, unflexibel                                       │
│                                                             │
│  VIRTUAL MACHINE:                                           │
│  ┌──────────────┐ ┌──────────────┐                         │
│  │ App    │ App │ │ App    │ App │                         │
│  │ OS (VM1)     │ │ OS (VM2)     │                         │
│  ├──────────────┴─┴──────────────┤                         │
│  │        Hypervisor             │                         │
│  │        Host OS                │                         │
│  │        Hardware               │                         │
│  └───────────────────────────────┘                         │
│  + Isolation, flexibel                                      │
│  - Overhead durch mehrere OS                               │
│                                                             │
│  CONTAINER:                                                 │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                      │
│  │ App1 │ │ App2 │ │ App3 │ │ App4 │                      │
│  ├──────┴─┴──────┴─┴──────┴─┴──────┤                      │
│  │        Container Runtime         │                      │
│  │        Host OS (Linux)           │                      │
│  │        Hardware                  │                      │
│  └──────────────────────────────────┘                      │
│  + Schnell, leichtgewichtig                                │
│  + Gleicher Kernel = weniger Overhead                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Server-Hardware

### Rack Server

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVER RACK (42U)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ████████████████████████████████████ │ 1U Server    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ ████████████████████████████████████ │ 1U Server    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ ████████████████████████████████████ │              │   │
│  │ ████████████████████████████████████ │ 2U Server    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ ████████████████████████████████████ │              │   │
│  │ ████████████████████████████████████ │              │   │
│  │ ████████████████████████████████████ │ 4U Storage   │   │
│  │ ████████████████████████████████████ │              │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ ═══════════════════════════════════ │ Network      │   │
│  │ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ │ Switch       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  U = Unit = 1.75 Zoll (44.45mm) Höhe                       │
│  Standard Rack = 42U                                        │
└─────────────────────────────────────────────────────────────┘
```

### Server-Komponenten

```
┌─────────────────────────────────────────────────────────────┐
│                  SERVER KOMPONENTEN                          │
├───────────────┬─────────────────────────────────────────────┤
│ CPU           │ Server-Grade: Intel Xeon, AMD EPYC         │
│               │ Mehr Kerne, höhere Cache, ECC Support      │
│               │ Multi-Socket Boards (2-8 CPUs)             │
├───────────────┼─────────────────────────────────────────────┤
│ RAM           │ ECC Memory (Error Correcting Code)         │
│               │ Server: 64GB - 2TB+                        │
│               │ Registered DIMMs für Stabilität            │
├───────────────┼─────────────────────────────────────────────┤
│ Storage       │ RAID Controller                            │
│               │ SSD/NVMe für Performance                   │
│               │ HDD für Kapazität                          │
│               │ Hot-Swap Bays                              │
├───────────────┼─────────────────────────────────────────────┤
│ Netzwerk      │ Redundante NICs (2-4x)                     │
│               │ 1/10/25 Gbit/s                             │
│               │ iLO/iDRAC/IPMI (Remote Management)         │
├───────────────┼─────────────────────────────────────────────┤
│ Netzteil      │ Redundant (2x PSU)                         │
│               │ Hot-Swap fähig                             │
│               │ 80+ Platinum Effizienz                     │
└───────────────┴─────────────────────────────────────────────┘
```

### RAID-Level

```
┌─────────────────────────────────────────────────────────────┐
│                    RAID ÜBERSICHT                            │
├──────────┬───────────┬────────────┬─────────────────────────┤
│ RAID     │ Min. Disk │ Kapazität  │ Beschreibung            │
├──────────┼───────────┼────────────┼─────────────────────────┤
│ RAID 0   │ 2         │ 100%       │ Striping, keine         │
│          │           │            │ Redundanz               │
├──────────┼───────────┼────────────┼─────────────────────────┤
│ RAID 1   │ 2         │ 50%        │ Mirroring, 1 Disk       │
│          │           │            │ kann ausfallen          │
├──────────┼───────────┼────────────┼─────────────────────────┤
│ RAID 5   │ 3         │ n-1        │ Striping + Parität      │
│          │           │            │ 1 Disk kann ausfallen   │
├──────────┼───────────┼────────────┼─────────────────────────┤
│ RAID 6   │ 4         │ n-2        │ Doppelte Parität        │
│          │           │            │ 2 Disks können ausfallen│
├──────────┼───────────┼────────────┼─────────────────────────┤
│ RAID 10  │ 4         │ 50%        │ Mirror + Stripe         │
│          │           │            │ Performance + Redundanz │
└──────────┴───────────┴────────────┴─────────────────────────┘

Beispiel RAID 5 mit 4x 1TB Disks:
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ D1   │ │ D2   │ │ D3   │ │ P1   │  ← Parität rotiert
│ D4   │ │ D5   │ │ P2   │ │ D6   │
│ D7   │ │ P3   │ │ D8   │ │ D9   │
│ P4   │ │ D10  │ │ D11  │ │ D12  │
└──────┘ └──────┘ └──────┘ └──────┘

Nutzbare Kapazität: 3 TB (4-1)
```

---

## Betriebssysteme

### Linux-Distributionen für Server

```
┌─────────────────────────────────────────────────────────────┐
│              SERVER LINUX DISTRIBUTIONEN                     │
├───────────────┬─────────────────────────────────────────────┤
│ Ubuntu Server │ Am weitesten verbreitet                    │
│               │ LTS: 5 Jahre Support                        │
│               │ APT Package Manager                         │
│               │ → Empfohlen für Einsteiger                 │
├───────────────┼─────────────────────────────────────────────┤
│ Debian        │ Sehr stabil, konservativ                   │
│               │ Basis für Ubuntu                           │
│               │ Lange Release-Zyklen                       │
├───────────────┼─────────────────────────────────────────────┤
│ RHEL/Rocky    │ Enterprise Standard                        │
│ /AlmaLinux    │ 10 Jahre Support                           │
│               │ DNF/YUM Package Manager                    │
│               │ → Enterprise-Umgebungen                    │
├───────────────┼─────────────────────────────────────────────┤
│ Amazon Linux  │ Optimiert für AWS                          │
│               │ AL2023: Neueste Version                    │
│               │ DNF Package Manager                        │
├───────────────┼─────────────────────────────────────────────┤
│ Alpine Linux  │ Minimal, für Container                     │
│               │ ~5MB Base Image                            │
│               │ musl libc (nicht glibc!)                   │
│               │ → Docker Images                            │
└───────────────┴─────────────────────────────────────────────┘
```

### System-Informationen abrufen

```bash
# Betriebssystem-Info
cat /etc/os-release
uname -a

# Kernel-Version
uname -r

# CPU-Informationen
lscpu
cat /proc/cpuinfo | head -30

# RAM
free -h
cat /proc/meminfo

# Disk-Platz
df -h
lsblk

# Hardware-Übersicht
sudo lshw -short

# Uptime & Load
uptime
# 10:30:15 up 45 days, load average: 0.15, 0.20, 0.18

# Wer ist eingeloggt?
who
w
```

---

## Prozess-Management

### Prozesse verstehen

```
┌─────────────────────────────────────────────────────────────┐
│                    PROZESS-HIERARCHIE                        │
│                                                             │
│  PID 1 (init/systemd)                                       │
│  ├── PID 123 (sshd)                                        │
│  │   └── PID 456 (sshd: user)                              │
│  │       └── PID 789 (bash)                                │
│  │           └── PID 1011 (vim)                            │
│  ├── PID 200 (nginx master)                                │
│  │   ├── PID 201 (nginx worker)                            │
│  │   └── PID 202 (nginx worker)                            │
│  └── PID 300 (postgres)                                    │
│      ├── PID 301 (postgres: checkpointer)                  │
│      └── PID 302 (postgres: walwriter)                     │
│                                                             │
│  PPID = Parent Process ID                                   │
│  PID 1 ist immer init/systemd (erster Prozess)             │
└─────────────────────────────────────────────────────────────┘
```

### Prozess-Befehle

```bash
# Prozesse anzeigen
ps aux                    # Alle Prozesse
ps -ef                    # Alternative Ansicht
ps aux | grep nginx       # Nach Prozess suchen

# Interaktive Prozess-Ansicht
top                       # Standard
htop                      # Bessere UI (installieren!)

# Prozess-Baum
pstree
pstree -p                 # Mit PIDs

# Prozess-Details
ps -p 1234 -o pid,ppid,cmd,%cpu,%mem

# Prozess finden
pgrep nginx               # PID von nginx
pidof nginx               # Alternative
```

### Prozesse beenden

```bash
# Signale an Prozesse senden
kill PID                  # SIGTERM (15) - freundlich beenden
kill -9 PID               # SIGKILL (9) - sofort beenden (hart)
kill -HUP PID             # SIGHUP (1) - Reload Config

# Nach Name beenden
pkill nginx               # Alle nginx Prozesse
killall nginx             # Alternative

# Alle Signale
kill -l
# 1) SIGHUP      2) SIGINT     3) SIGQUIT    4) SIGILL
# 9) SIGKILL    15) SIGTERM   18) SIGCONT   19) SIGSTOP

┌─────────────────────────────────────────────────────────────┐
│ Signal    │ Bedeutung                                       │
├───────────┼─────────────────────────────────────────────────┤
│ SIGTERM   │ Bitte beenden (Cleanup möglich)                │
│ SIGKILL   │ Sofort beenden (kein Cleanup!)                 │
│ SIGHUP    │ Hangup - oft für Config-Reload                 │
│ SIGINT    │ Interrupt (Ctrl+C)                             │
│ SIGSTOP   │ Pausieren (Ctrl+Z)                             │
│ SIGCONT   │ Weitermachen nach STOP                         │
└───────────┴─────────────────────────────────────────────────┘
```

### Hintergrund-Prozesse

```bash
# Prozess im Hintergrund starten
./long_running_script.sh &

# Laufenden Prozess in Hintergrund
Ctrl+Z                    # Pausieren
bg                        # Im Hintergrund weiterlaufen
fg                        # Zurück in Vordergrund

# Jobs anzeigen
jobs
# [1]+  Running    ./script.sh &

# Prozess auch nach Logout laufen lassen
nohup ./script.sh &       # Output → nohup.out
nohup ./script.sh > /dev/null 2>&1 &  # Kein Output

# Besser: screen oder tmux
screen -S mysession       # Neue Session
# ... Arbeit machen ...
Ctrl+A, D                 # Detach
screen -r mysession       # Wieder anhängen
```

---

## Systemd & Services

### Was ist Systemd?

Systemd ist das Init-System moderner Linux-Distributionen:

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTEMD ÜBERSICHT                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  systemd (PID 1)                                            │
│  ├── Startet alle Services                                 │
│  ├── Verwaltet Dependencies                                │
│  ├── Überwacht Services (Restart bei Crash)                │
│  ├── Logging (journald)                                    │
│  └── Timer (cron-Alternative)                              │
│                                                             │
│  Unit-Typen:                                                │
│  ├── .service  → Dienste (nginx, postgresql)               │
│  ├── .socket   → Socket-Aktivierung                        │
│  ├── .timer    → Zeitgesteuerte Aufgaben                   │
│  ├── .mount    → Dateisystem-Mounts                        │
│  ├── .target   → Gruppierung von Units                     │
│  └── .path     → Pfad-Überwachung                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Systemctl Befehle

```bash
# Service starten/stoppen
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx      # Config neu laden

# Status prüfen
systemctl status nginx
systemctl is-active nginx
systemctl is-enabled nginx

# Beim Boot aktivieren/deaktivieren
sudo systemctl enable nginx      # Autostart
sudo systemctl disable nginx     # Kein Autostart

# Alle Services anzeigen
systemctl list-units --type=service
systemctl list-units --type=service --state=running

# Failed Services
systemctl --failed

# Dependencies
systemctl list-dependencies nginx

# Unit-File anzeigen
systemctl cat nginx
```

### Service Unit erstellen

```bash
# /etc/systemd/system/myapp.service
[Unit]
Description=My Node.js Application
Documentation=https://example.com/docs
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/myapp
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/node /opt/myapp/server.js
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=10

# Security Hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/opt/myapp/data

[Install]
WantedBy=multi-user.target
```

```bash
# Nach Änderungen
sudo systemctl daemon-reload
sudo systemctl enable myapp
sudo systemctl start myapp
```

### Journalctl - Logs lesen

```bash
# Alle Logs
journalctl

# Logs eines Services
journalctl -u nginx
journalctl -u nginx -f           # Follow (wie tail -f)

# Letzte 100 Zeilen
journalctl -u nginx -n 100

# Seit bestimmter Zeit
journalctl -u nginx --since "1 hour ago"
journalctl -u nginx --since "2024-01-01 10:00:00"

# Nur Fehler
journalctl -u nginx -p err

# Boot-Logs
journalctl -b                    # Aktueller Boot
journalctl -b -1                 # Letzter Boot

# Kernel-Logs
journalctl -k

# Disk Usage von Logs
journalctl --disk-usage

# Alte Logs löschen
sudo journalctl --vacuum-size=500M
sudo journalctl --vacuum-time=7d
```

---

## Benutzer & Berechtigungen

### Benutzer-Management

```bash
# Benutzer erstellen
sudo useradd -m -s /bin/bash username    # Mit Home-Dir
sudo useradd -r -s /sbin/nologin appuser # System-User

# Passwort setzen
sudo passwd username

# Benutzer löschen
sudo userdel username
sudo userdel -r username    # Mit Home-Dir

# Benutzer-Info
id username
groups username
cat /etc/passwd | grep username

# Gruppen-Management
sudo groupadd developers
sudo usermod -aG developers username     # Zu Gruppe hinzufügen
sudo gpasswd -d username developers      # Aus Gruppe entfernen
```

### Sudo-Konfiguration

```bash
# Sudoers editieren (IMMER mit visudo!)
sudo visudo

# Beispiel-Einträge:
# User kann alles als root
username ALL=(ALL:ALL) ALL

# User kann bestimmte Befehle ohne Passwort
username ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx

# Gruppe kann sudo
%developers ALL=(ALL:ALL) ALL

# Include-Verzeichnis
@includedir /etc/sudoers.d
```

### Dateiberechtigungen

```
┌─────────────────────────────────────────────────────────────┐
│                LINUX BERECHTIGUNGEN                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  -rwxr-xr-x  1  root  root  4096  Jan 1 10:00  script.sh   │
│  │└┬┘└┬┘└┬┘     └─┬─┘ └─┬─┘                                │
│  │ │  │  │        │     └── Gruppe                         │
│  │ │  │  │        └── Owner                                │
│  │ │  │  └── Others (alle anderen)                         │
│  │ │  └── Group                                            │
│  │ └── Owner                                               │
│  └── Typ (- = Datei, d = Directory, l = Link)              │
│                                                             │
│  Berechtigungen:                                            │
│  r (4) = read    (lesen)                                   │
│  w (2) = write   (schreiben)                               │
│  x (1) = execute (ausführen / Directory betreten)          │
│                                                             │
│  Numerische Notation:                                       │
│  rwx = 4+2+1 = 7                                           │
│  rw- = 4+2+0 = 6                                           │
│  r-x = 4+0+1 = 5                                           │
│  r-- = 4+0+0 = 4                                           │
│                                                             │
│  chmod 755 = rwxr-xr-x (Owner: alles, Rest: lesen+ausf.)   │
│  chmod 644 = rw-r--r-- (Owner: lesen+schreiben, Rest: lesen)│
│  chmod 600 = rw------- (Nur Owner lesen+schreiben)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

```bash
# Berechtigungen ändern
chmod 755 script.sh
chmod u+x script.sh         # Owner +execute
chmod g-w file.txt          # Group -write
chmod o-rwx secret.txt      # Others: nichts

# Owner/Gruppe ändern
chown user:group file.txt
chown -R user:group /dir/   # Rekursiv

# Spezielle Berechtigungen
chmod u+s binary            # SUID - läuft als Owner
chmod g+s directory         # SGID - neue Files erben Gruppe
chmod +t directory          # Sticky Bit - nur Owner kann löschen
```

---

## Logging & Monitoring

### Log-Dateien

```
┌─────────────────────────────────────────────────────────────┐
│               WICHTIGE LOG-DATEIEN                           │
├────────────────────────┬────────────────────────────────────┤
│ /var/log/syslog        │ System-Logs (Debian/Ubuntu)       │
│ /var/log/messages      │ System-Logs (RHEL)                │
│ /var/log/auth.log      │ Authentifizierung, SSH            │
│ /var/log/kern.log      │ Kernel-Nachrichten                │
│ /var/log/nginx/        │ Nginx Access & Error Logs         │
│ /var/log/postgresql/   │ PostgreSQL Logs                   │
│ /var/log/cron          │ Cron-Job Logs                     │
│ /var/log/mail.log      │ Mail-Server Logs                  │
└────────────────────────┴────────────────────────────────────┘
```

```bash
# Logs live verfolgen
tail -f /var/log/syslog
tail -f /var/log/nginx/access.log

# Mehrere Logs gleichzeitig
tail -f /var/log/nginx/*.log

# Logs durchsuchen
grep "error" /var/log/syslog
grep -i "failed" /var/log/auth.log

# Letzte 50 Zeilen
tail -n 50 /var/log/syslog

# Log-Rotation
cat /etc/logrotate.conf
ls /etc/logrotate.d/
```

### System-Monitoring

```bash
# CPU, RAM, Prozesse
top
htop                        # Besser!

# RAM-Details
free -h
vmstat 1 5                  # 5 Sekunden, jede Sekunde

# CPU-Details
mpstat 1 5                  # Benötigt sysstat

# I/O Statistiken
iostat 1 5                  # Disk I/O
iotop                       # I/O nach Prozess

# Netzwerk
iftop                       # Netzwerk-Traffic
nethogs                     # Traffic nach Prozess
ss -tuln                    # Offene Ports

# Disk
df -h                       # Freier Platz
du -sh /var/*               # Verzeichnis-Größen
ncdu /                      # Interaktiv
```

### Health Checks

```bash
#!/bin/bash
# health_check.sh

echo "=== System Health Check ==="
echo

echo "--- Uptime & Load ---"
uptime
echo

echo "--- Memory ---"
free -h
echo

echo "--- Disk Usage ---"
df -h | grep -v tmpfs
echo

echo "--- Top 5 CPU Prozesse ---"
ps aux --sort=-%cpu | head -6
echo

echo "--- Top 5 Memory Prozesse ---"
ps aux --sort=-%mem | head -6
echo

echo "--- Services Status ---"
for svc in nginx postgresql; do
    status=$(systemctl is-active $svc 2>/dev/null || echo "not installed")
    echo "$svc: $status"
done
echo

echo "--- Open Connections ---"
ss -tuln | grep LISTEN
```

---

## Backup & Recovery

### Backup-Strategien

```
┌─────────────────────────────────────────────────────────────┐
│                  BACKUP STRATEGIEN                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  3-2-1 Regel:                                               │
│  ├── 3 Kopien der Daten                                    │
│  ├── 2 verschiedene Medien                                 │
│  └── 1 offsite (extern)                                    │
│                                                             │
│  Backup-Typen:                                              │
│  ├── Full Backup: Alles (groß, langsam)                   │
│  ├── Incremental: Nur Änderungen seit letztem Backup      │
│  └── Differential: Änderungen seit letztem Full Backup    │
│                                                             │
│  Beispiel-Schema:                                           │
│  Sonntag:    Full Backup                                   │
│  Mo-Sa:      Incremental                                   │
│  Monatlich:  Full Backup offsite                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Backup-Befehle

```bash
# tar - Archive erstellen
tar -czvf backup.tar.gz /path/to/backup/
tar -xzvf backup.tar.gz                    # Entpacken

# rsync - Synchronisieren
rsync -avz /source/ /destination/
rsync -avz /local/ user@remote:/backup/    # Remote
rsync -avz --delete /source/ /dest/        # Löscht extra Files

# PostgreSQL Backup
pg_dump dbname > backup.sql
pg_dump -Fc dbname > backup.dump           # Custom Format
pg_dumpall > all_databases.sql             # Alle DBs

# PostgreSQL Restore
psql dbname < backup.sql
pg_restore -d dbname backup.dump
```

### Automatische Backups mit Cron

```bash
# crontab -e
# Backup jeden Tag um 2:00 Uhr
0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1

# backup.sh
#!/bin/bash
set -e

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d)

# Datenbank
pg_dump -Fc mydb > "$BACKUP_DIR/db_$DATE.dump"

# Anwendungsdaten
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" /opt/myapp/data/

# Alte Backups löschen (älter als 7 Tage)
find "$BACKUP_DIR" -type f -mtime +7 -delete

# Zu S3 hochladen
aws s3 sync "$BACKUP_DIR" s3://my-backup-bucket/

echo "Backup completed: $DATE"
```

---

## Sicherheit

### SSH Hardening

```bash
# /etc/ssh/sshd_config

# Root-Login deaktivieren
PermitRootLogin no

# Nur Key-basierte Auth
PasswordAuthentication no
PubkeyAuthentication yes

# Nur bestimmte User
AllowUsers deploy admin

# Timeout
ClientAliveInterval 300
ClientAliveCountMax 2

# Protokoll 2 (Standard in modernen Versionen)
Protocol 2

# Port ändern (optional, security through obscurity)
Port 2222
```

```bash
# SSH-Key erstellen
ssh-keygen -t ed25519 -C "your_email@example.com"

# Key zum Server kopieren
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server

# Config neu laden
sudo systemctl reload sshd
```

### Firewall (UFW)

```bash
# UFW (Uncomplicated Firewall)

# Status
sudo ufw status verbose

# Aktivieren
sudo ufw enable

# Default-Regeln
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Ports öffnen
sudo ufw allow 22/tcp          # SSH
sudo ufw allow 80/tcp          # HTTP
sudo ufw allow 443/tcp         # HTTPS
sudo ufw allow from 10.0.0.0/8 to any port 5432  # PostgreSQL von intern

# Regel löschen
sudo ufw delete allow 80/tcp

# Alle Regeln anzeigen (nummeriert)
sudo ufw status numbered
```

### Fail2ban

```bash
# Installation
sudo apt install fail2ban

# Konfiguration
# /etc/fail2ban/jail.local
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

# Status prüfen
sudo fail2ban-client status
sudo fail2ban-client status sshd

# IP entbannen
sudo fail2ban-client set sshd unbanip 1.2.3.4
```

### Security Checklist

```
┌─────────────────────────────────────────────────────────────┐
│               SERVER SECURITY CHECKLIST                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Basis-Sicherheit:                                           │
│ □ System aktuell (apt update && apt upgrade)               │
│ □ Automatische Sicherheits-Updates aktiviert               │
│ □ Unnötige Services deaktiviert                            │
│ □ Firewall konfiguriert (nur nötige Ports)                 │
│                                                             │
│ SSH:                                                        │
│ □ Root-Login deaktiviert                                   │
│ □ Key-basierte Authentifizierung                           │
│ □ Passwort-Auth deaktiviert                                │
│ □ Fail2ban installiert                                     │
│                                                             │
│ Benutzer:                                                   │
│ □ Minimale Berechtigungen (Least Privilege)                │
│ □ Keine shared Accounts                                    │
│ □ Starke Passwörter/Keys                                   │
│ □ Sudo nur wo nötig                                        │
│                                                             │
│ Anwendung:                                                  │
│ □ Services als non-root User                               │
│ □ Sichere Dateiberechtigungen                              │
│ □ Secrets nicht in Code/Logs                               │
│ □ HTTPS erzwingen                                          │
│                                                             │
│ Monitoring:                                                 │
│ □ Logs überwachen                                          │
│ □ Intrusion Detection (optional)                           │
│ □ Regelmäßige Security-Audits                              │
│                                                             │
│ Backup:                                                     │
│ □ Regelmäßige Backups                                      │
│ □ Backup-Tests (Restore testen!)                           │
│ □ Offsite-Backup                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Cloud vs. On-Premise

### Vergleich

```
┌─────────────────────────────────────────────────────────────┐
│            CLOUD vs ON-PREMISE                               │
├───────────────┬─────────────────┬───────────────────────────┤
│ Aspekt        │ Cloud (AWS)     │ On-Premise               │
├───────────────┼─────────────────┼───────────────────────────┤
│ Initiale      │ Niedrig         │ Hoch (Hardware)          │
│ Kosten        │ Pay-as-you-go   │                          │
├───────────────┼─────────────────┼───────────────────────────┤
│ Laufende      │ Variabel        │ Fix (Personal, Strom)    │
│ Kosten        │ Kann teuer sein │                          │
├───────────────┼─────────────────┼───────────────────────────┤
│ Skalierung    │ Minuten         │ Wochen/Monate            │
├───────────────┼─────────────────┼───────────────────────────┤
│ Verfügbarkeit │ 99.9%+ SLA     │ Eigenverantwortung       │
├───────────────┼─────────────────┼───────────────────────────┤
│ Wartung       │ Provider        │ Eigenes Team             │
├───────────────┼─────────────────┼───────────────────────────┤
│ Kontrolle     │ Limitiert       │ Volle Kontrolle          │
├───────────────┼─────────────────┼───────────────────────────┤
│ Compliance    │ Shared          │ Volle Verantwortung      │
│               │ Responsibility  │                          │
├───────────────┼─────────────────┼───────────────────────────┤
│ Expertise     │ Cloud-Kenntnisse│ Hardware + Software      │
│ benötigt      │ erforderlich    │ Kenntnisse nötig         │
└───────────────┴─────────────────┴───────────────────────────┘
```

### Für die AI-Freelancer-Plattform

```
Unsere Wahl: AWS (Cloud)

Gründe:
├── Schneller Start (kein Hardware-Kauf)
├── Skalierbar bei Wachstum
├── Managed Services (RDS, ECS)
├── Weniger Ops-Aufwand
└── Pay-as-you-go für MVP

Architektur:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Internet → CloudFront → ALB → ECS Fargate → RDS           │
│            (CDN)       (LB)   (Container)   (PostgreSQL)   │
│                                                             │
│  Managed Services = weniger Server-Admin:                   │
│  - AWS übernimmt: Patching, Backups, HA                    │
│  - Wir übernehmen: App-Code, Config, Security              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Praktische Tipps

### Nützliche Aliase

```bash
# ~/.bashrc oder ~/.zshrc

# Systemd
alias sctl='sudo systemctl'
alias jctl='journalctl'

# Logs
alias logs='sudo journalctl -f'
alias nginxlog='tail -f /var/log/nginx/access.log'

# System
alias ports='sudo ss -tuln'
alias meminfo='free -h'
alias diskinfo='df -h'

# Updates
alias update='sudo apt update && sudo apt upgrade -y'

# Reload
alias reload='source ~/.bashrc'
```

### Wichtige Dateien kennen

```
┌─────────────────────────────────────────────────────────────┐
│               WICHTIGE SYSTEM-DATEIEN                        │
├────────────────────────────┬────────────────────────────────┤
│ /etc/passwd                │ Benutzer-Datenbank            │
│ /etc/shadow                │ Passwort-Hashes               │
│ /etc/group                 │ Gruppen                       │
│ /etc/hosts                 │ Lokale DNS-Auflösung          │
│ /etc/hostname              │ Hostname                      │
│ /etc/resolv.conf           │ DNS-Server                    │
│ /etc/fstab                 │ Dateisystem-Mounts            │
│ /etc/crontab               │ System Cron-Jobs              │
│ /etc/ssh/sshd_config       │ SSH-Server Config             │
│ /etc/systemd/system/       │ Systemd Unit Files            │
│ /var/log/                  │ Log-Dateien                   │
│ /opt/                      │ Third-Party Software          │
│ /srv/                      │ Service-Daten (Web, etc.)     │
└────────────────────────────┴────────────────────────────────┘
```

---

## Zusammenfassung

### Key Takeaways

```
┌─────────────────────────────────────────────────────────────┐
│              SERVER ADMINISTRATION ESSENTIALS                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Systemd verstehen                                        │
│    - systemctl für Services                                │
│    - journalctl für Logs                                   │
│    - Unit-Files schreiben können                           │
│                                                             │
│ 2. Benutzer & Berechtigungen                               │
│    - Least Privilege Prinzip                               │
│    - chmod/chown beherrschen                               │
│    - sudo sicher konfigurieren                             │
│                                                             │
│ 3. Monitoring                                              │
│    - System-Ressourcen im Blick                            │
│    - Logs regelmäßig prüfen                                │
│    - Alerting einrichten                                   │
│                                                             │
│ 4. Sicherheit                                              │
│    - SSH hardening                                         │
│    - Firewall aktiv                                        │
│    - Updates automatisieren                                │
│                                                             │
│ 5. Backup                                                  │
│    - 3-2-1 Regel                                           │
│    - Regelmäßig testen!                                    │
│    - Automatisieren                                        │
│                                                             │
│ 6. Cloud nutzen (für uns)                                  │
│    - Managed Services reduzieren Aufwand                   │
│    - Aber: Grundlagen trotzdem verstehen!                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Quick Reference

```bash
# Service-Management
sudo systemctl start/stop/restart/status nginx
sudo systemctl enable/disable nginx
journalctl -u nginx -f

# Benutzer
sudo useradd -m username
sudo usermod -aG group username
id username

# Berechtigungen
chmod 755 file
chown user:group file

# System-Info
top / htop
free -h
df -h
uptime

# Logs
tail -f /var/log/syslog
journalctl -f

# Netzwerk
ss -tuln
sudo ufw status
```

---

**Nächstes Learning:** [LEARNING_21_INTERNET.md](./LEARNING_21_INTERNET.md) - Wie das Internet funktioniert

---

*Erstellt: 17. Dezember 2025*
*Für: Klaus Weigele - AI-Freelancer-Plattform*
