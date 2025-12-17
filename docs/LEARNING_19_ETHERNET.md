# Learning Guide 19: Ethernet & LAN

> **Für Klaus** - Netzwerk-Hardware und physische Verbindungen verstehen

---

## Inhaltsverzeichnis

1. [Was ist Ethernet?](#was-ist-ethernet)
2. [Physische Komponenten](#physische-komponenten)
3. [MAC-Adressen](#mac-adressen)
4. [Ethernet-Frames](#ethernet-frames)
5. [Switches & Hubs](#switches--hubs)
6. [VLANs](#vlans)
7. [Verkabelung](#verkabelung)
8. [Geschwindigkeiten & Standards](#geschwindigkeiten--standards)
9. [Troubleshooting](#troubleshooting)
10. [Cloud-Relevanz](#cloud-relevanz)

---

## Was ist Ethernet?

### Definition

Ethernet ist die dominierende Technologie für lokale Netzwerke (LAN). Es definiert:
- **Physische Verbindungen** (Kabel, Stecker)
- **Datenformat** (Frames)
- **Zugriffsverfahren** (CSMA/CD)

### OSI-Modell Einordnung

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 7: Application    │ HTTP, HTTPS, SSH, SMTP           │
├─────────────────────────────────────────────────────────────┤
│ Layer 6: Presentation   │ SSL/TLS, Encoding                │
├─────────────────────────────────────────────────────────────┤
│ Layer 5: Session        │ Sessions, Connections            │
├─────────────────────────────────────────────────────────────┤
│ Layer 4: Transport      │ TCP, UDP                         │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: Network        │ IP, ICMP, Routing                │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Data Link      │ ← ETHERNET (Frames, MAC)         │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Physical       │ ← ETHERNET (Kabel, Signale)      │
└─────────────────────────────────────────────────────────────┘
```

**Ethernet arbeitet auf Layer 1 & 2!**

### Geschichte

```
1973 │ Xerox PARC - Erste Ethernet-Version (2.94 Mbit/s)
1980 │ DIX Standard (DEC, Intel, Xerox)
1983 │ IEEE 802.3 Standard
1995 │ Fast Ethernet (100 Mbit/s)
1999 │ Gigabit Ethernet (1 Gbit/s)
2010 │ 10 Gigabit Ethernet
2017 │ 25/50/100 Gigabit Ethernet
2020 │ 400 Gigabit Ethernet
```

---

## Physische Komponenten

### Network Interface Card (NIC)

```
┌────────────────────────────────────────┐
│          Network Interface Card         │
│                                        │
│  ┌──────────┐  ┌──────────────────┐   │
│  │   LED    │  │                  │   │
│  │ Activity │  │   RJ45 Port      │   │
│  │          │  │                  │   │
│  │   LED    │  │  ════════════    │   │
│  │   Link   │  │                  │   │
│  └──────────┘  └──────────────────┘   │
│                                        │
│  MAC: 00:1A:2B:3C:4D:5E               │
└────────────────────────────────────────┘
```

**LEDs bedeuten:**
- **Link LED** (grün): Physische Verbindung vorhanden
- **Activity LED** (blinkt): Datenübertragung aktiv

### RJ45-Stecker

```
        ┌─────────────────┐
        │  │ │ │ │ │ │ │ │ │  ← 8 Pins
        │  1 2 3 4 5 6 7 8   │
        │                   │
        │     ┌─────┐       │
        │     │     │       │  ← Clip
        └─────┴─────┴───────┘

Pin-Belegung (T568B - Standard):
┌─────┬────────────┬─────────────┐
│ Pin │ Farbe      │ Funktion    │
├─────┼────────────┼─────────────┤
│  1  │ weiß/orange│ TX+ (senden)│
│  2  │ orange     │ TX- (senden)│
│  3  │ weiß/grün  │ RX+ (empf.) │
│  4  │ blau       │ -           │
│  5  │ weiß/blau  │ -           │
│  6  │ grün       │ RX- (empf.) │
│  7  │ weiß/braun │ -           │
│  8  │ braun      │ -           │
└─────┴────────────┴─────────────┘
```

### Kabeltypen

```
┌─────────────────────────────────────────────────────────────┐
│                    ETHERNET KABEL                           │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  KUPFER      │  ═══════════════════════════                │
│  (Twisted    │  Cat5e: 1 Gbit/s, 100m max                  │
│   Pair)      │  Cat6:  10 Gbit/s, 55m (oder 1Gbit/100m)    │
│              │  Cat6a: 10 Gbit/s, 100m                     │
│              │  Cat7:  10 Gbit/s, 100m (geschirmt)         │
│              │  Cat8:  25-40 Gbit/s, 30m                   │
│              │                                              │
├──────────────┼──────────────────────────────────────────────┤
│              │                                              │
│  GLASFASER   │  ═══════════════════════════                │
│  (Fiber      │  Singlemode: 10+ km, teuer                  │
│   Optic)     │  Multimode:  550m, günstiger               │
│              │  Geschwindigkeiten: 10-400 Gbit/s           │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

---

## MAC-Adressen

### Was ist eine MAC-Adresse?

**MAC = Media Access Control**

Eine weltweit eindeutige Hardware-Adresse für jede Netzwerkkarte.

```
MAC-Adresse Format:
┌─────────────────────────────────────────────────┐
│         00:1A:2B:3C:4D:5E                       │
│         ├─────┤ ├────────┤                     │
│           OUI      NIC                          │
│                                                 │
│  OUI (Organizationally Unique Identifier):      │
│  - Ersten 3 Bytes                              │
│  - Identifiziert Hersteller                    │
│                                                 │
│  NIC (Network Interface Controller):            │
│  - Letzten 3 Bytes                             │
│  - Eindeutig pro Hersteller                    │
└─────────────────────────────────────────────────┘
```

### Bekannte OUIs

```bash
# Beispiel OUIs (Hersteller-Präfixe)
00:00:0C  →  Cisco
00:1A:2B  →  Ayecom Technology
00:50:56  →  VMware
08:00:27  →  Oracle VirtualBox
AC:DE:48  →  Apple
```

### MAC-Adresse anzeigen

```bash
# macOS
ifconfig en0 | grep ether
# ether ac:de:48:00:11:22

# Linux
ip link show eth0
# link/ether 00:1a:2b:3c:4d:5e

# Windows
ipconfig /all
# Physische Adresse: 00-1A-2B-3C-4D-5E
```

### Spezielle MAC-Adressen

```
┌────────────────────┬─────────────────────────────────┐
│ Adresse            │ Bedeutung                       │
├────────────────────┼─────────────────────────────────┤
│ FF:FF:FF:FF:FF:FF  │ Broadcast (alle Geräte)        │
│ 01:00:5E:xx:xx:xx  │ IPv4 Multicast                 │
│ 33:33:xx:xx:xx:xx  │ IPv6 Multicast                 │
│ 00:00:00:00:00:00  │ Ungültig/Nicht gesetzt         │
└────────────────────┴─────────────────────────────────┘
```

### ARP - Address Resolution Protocol

ARP verbindet IP-Adressen mit MAC-Adressen:

```
Computer A will mit 192.168.1.5 kommunizieren:

1. ARP Request (Broadcast):
┌──────────────────────────────────────────────────────────┐
│  "Wer hat 192.168.1.5? Bitte sag 192.168.1.10"          │
│  Ziel-MAC: FF:FF:FF:FF:FF:FF (Broadcast)                │
└──────────────────────────────────────────────────────────┘
                    ↓ (geht an alle)

2. ARP Reply (Unicast):
┌──────────────────────────────────────────────────────────┐
│  "192.168.1.5 ist bei 00:1A:2B:3C:4D:5E"                │
│  Von: Computer B                                         │
└──────────────────────────────────────────────────────────┘

3. Computer A speichert in ARP-Cache:
   192.168.1.5 → 00:1A:2B:3C:4D:5E
```

```bash
# ARP-Cache anzeigen
arp -a

# Beispiel-Ausgabe:
# ? (192.168.1.1) at 00:1a:2b:3c:4d:5e on en0 [ethernet]
# ? (192.168.1.5) at 00:1a:2b:3c:4d:5f on en0 [ethernet]
```

---

## Ethernet-Frames

### Frame-Struktur

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ETHERNET FRAME                                  │
├──────────┬──────────┬──────────┬────────┬───────────────┬──────────┤
│ Preamble │ Dest MAC │ Src MAC  │ Type   │    Payload    │   FCS    │
│ 8 Bytes  │ 6 Bytes  │ 6 Bytes  │2 Bytes │ 46-1500 Bytes │ 4 Bytes  │
├──────────┼──────────┼──────────┼────────┼───────────────┼──────────┤
│10101010..│FF:FF:FF..│00:1A:2B..│ 0x0800 │  IP Packet    │ Checksum │
│          │          │          │ (IPv4) │               │          │
└──────────┴──────────┴──────────┴────────┴───────────────┴──────────┘

Type-Feld (EtherType):
┌────────┬─────────────────────────────┐
│ 0x0800 │ IPv4                        │
│ 0x0806 │ ARP                         │
│ 0x86DD │ IPv6                        │
│ 0x8100 │ VLAN Tag (802.1Q)           │
└────────┴─────────────────────────────┘
```

### MTU - Maximum Transmission Unit

```
Standard Ethernet MTU: 1500 Bytes (Payload)

┌──────────────────────────────────────────────────────────┐
│  Warum ist MTU wichtig?                                  │
│                                                          │
│  • Größere MTU = weniger Overhead                       │
│  • Kleinere MTU = mehr Frames für gleiche Daten         │
│  • Jumbo Frames: MTU bis 9000 Bytes (Datacenter)        │
│                                                          │
│  IP Packet > MTU → Fragmentierung (schlecht!)           │
└──────────────────────────────────────────────────────────┘
```

```bash
# MTU anzeigen
ifconfig en0 | grep mtu
# mtu 1500

# MTU ändern (temporär)
sudo ifconfig en0 mtu 9000  # Jumbo Frames

# Path MTU Discovery
ping -D -s 1472 google.com  # 1472 + 28 (Header) = 1500
```

---

## Switches & Hubs

### Hub (veraltet)

```
Hub = "Dummes" Gerät

              ┌─────────┐
     PC-A ────┤         ├──── PC-B
              │   HUB   │
     PC-C ────┤         ├──── PC-D
              └─────────┘

Funktionsweise:
- Empfängt Signal an einem Port
- Sendet an ALLE anderen Ports (Broadcast)
- Keine Intelligenz
- Kollisionen möglich
- Shared Bandwidth (alle teilen 100 Mbit/s)
```

### Switch (modern)

```
Switch = "Intelligentes" Gerät

              ┌─────────────────────┐
     PC-A ────┤ Port 1    Port 2   ├──── PC-B
              │                     │
              │   MAC Address Table │
              │   ┌───────────────┐ │
              │   │ Port │ MAC    │ │
              │   │ 1    │ AA:AA  │ │
              │   │ 2    │ BB:BB  │ │
              │   │ 3    │ CC:CC  │ │
              │   │ 4    │ DD:DD  │ │
              │   └───────────────┘ │
              │                     │
     PC-C ────┤ Port 3    Port 4   ├──── PC-D
              └─────────────────────┘

Funktionsweise:
- Lernt MAC-Adressen (MAC Address Table)
- Sendet nur an Ziel-Port (Unicast)
- Keine Kollisionen
- Dedicated Bandwidth pro Port
- Full Duplex möglich
```

### Switch-Typen

```
┌─────────────────────────────────────────────────────────────┐
│                    SWITCH KATEGORIEN                         │
├───────────────┬─────────────────────────────────────────────┤
│ Unmanaged     │ Plug & Play, keine Konfiguration           │
│               │ Günstig, für kleine Netzwerke              │
├───────────────┼─────────────────────────────────────────────┤
│ Smart/Web     │ Einfache Web-GUI                           │
│ Managed       │ VLAN, QoS, Port Mirroring                  │
│               │ Mittelklasse, KMUs                         │
├───────────────┼─────────────────────────────────────────────┤
│ Fully         │ CLI, SSH, SNMP, volle Kontrolle            │
│ Managed       │ Enterprise-Features, teuer                  │
│               │ Datacenter, große Unternehmen              │
├───────────────┼─────────────────────────────────────────────┤
│ Layer 3       │ Kann routen (wie Router)                   │
│ Switch        │ Inter-VLAN Routing                         │
│               │ Ersetzt Router in manchen Fällen           │
└───────────────┴─────────────────────────────────────────────┘
```

### Switch-Features

```bash
# Typische Switch-Konfiguration (CLI)

# VLAN erstellen
vlan 10
  name Development
vlan 20
  name Production

# Port konfigurieren
interface GigabitEthernet0/1
  description "Web Server"
  switchport mode access
  switchport access vlan 10
  spanning-tree portfast

# Trunk Port (mehrere VLANs)
interface GigabitEthernet0/24
  description "Uplink to Core"
  switchport mode trunk
  switchport trunk allowed vlan 10,20
```

---

## VLANs

### Was ist ein VLAN?

**VLAN = Virtual Local Area Network**

Logische Trennung eines physischen Netzwerks:

```
OHNE VLANs:
┌─────────────────────────────────────────────────────────────┐
│                    Ein großes Netzwerk                       │
│                                                             │
│  [HR-PC]  [Dev-PC]  [Server]  [Drucker]  [Gast-Laptop]     │
│                                                             │
│  Alle können miteinander kommunizieren!                     │
│  Broadcast-Storms möglich                                   │
│  Keine Sicherheitstrennung                                  │
└─────────────────────────────────────────────────────────────┘

MIT VLANs:
┌─────────────────────────────────────────────────────────────┐
│                    Physischer Switch                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │   VLAN 10     │  │   VLAN 20     │  │   VLAN 30     │   │
│  │   (HR)        │  │   (Dev)       │  │   (Gäste)     │   │
│  │               │  │               │  │               │   │
│  │  [HR-PC]      │  │  [Dev-PC]     │  │  [Gast-PC]    │   │
│  │  [HR-Drucker] │  │  [Server]     │  │               │   │
│  │               │  │               │  │               │   │
│  └───────────────┘  └───────────────┘  └───────────────┘   │
│                                                             │
│  VLANs sind isoliert - brauchen Router für Kommunikation    │
└─────────────────────────────────────────────────────────────┘
```

### VLAN Tagging (802.1Q)

```
Normaler Ethernet Frame:
┌──────────┬──────────┬────────┬───────────────┬──────────┐
│ Dest MAC │ Src MAC  │ Type   │    Payload    │   FCS    │
└──────────┴──────────┴────────┴───────────────┴──────────┘

802.1Q Tagged Frame:
┌──────────┬──────────┬────────────┬────────┬───────────────┬──────────┐
│ Dest MAC │ Src MAC  │ VLAN Tag   │ Type   │    Payload    │   FCS    │
│          │          │ (4 Bytes)  │        │               │          │
└──────────┴──────────┴────────────┴────────┴───────────────┴──────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │ TPID   │ TCI     │
                    │ 0x8100 │         │
                    │        │ PRI│CFI │VLAN ID│
                    │        │ 3b │1b  │ 12b   │
                    └──────────────────┘

VLAN ID: 1-4094 (0 und 4095 reserviert)
```

### Port-Typen

```
ACCESS PORT:
┌─────────────────────────────────────────────────────────────┐
│  - Ein VLAN zugewiesen                                      │
│  - Frames werden NICHT getaggt                              │
│  - Für Endgeräte (PCs, Drucker, etc.)                      │
│                                                             │
│  [PC] ───────── [Switch Port] ── VLAN 10                   │
│        (untagged)                                           │
└─────────────────────────────────────────────────────────────┘

TRUNK PORT:
┌─────────────────────────────────────────────────────────────┐
│  - Mehrere VLANs transportieren                            │
│  - Frames sind getaggt (802.1Q)                            │
│  - Für Switch-zu-Switch Verbindungen                       │
│                                                             │
│  [Switch A] ════════════ [Switch B]                        │
│             VLAN 10,20,30                                   │
│              (tagged)                                       │
└─────────────────────────────────────────────────────────────┘
```

### Inter-VLAN Routing

```
VLANs kommunizieren nicht direkt - brauchen Router!

Option 1: Router-on-a-Stick
┌──────────┐
│  Router  │ ← Ein physisches Interface
│          │   Mehrere Sub-Interfaces
│ .1       │   (VLAN Tags)
└────┬─────┘
     │ Trunk (VLAN 10,20)
┌────┴─────┐
│  Switch  │
├──────────┤
│ VLAN 10  │ → 192.168.10.0/24
│ VLAN 20  │ → 192.168.20.0/24
└──────────┘

Option 2: Layer 3 Switch
┌──────────────────┐
│  Layer 3 Switch  │
│                  │
│  SVI (Switched   │
│  Virtual         │
│  Interface)      │
│                  │
│  VLAN 10: .1     │ → 192.168.10.0/24
│  VLAN 20: .1     │ → 192.168.20.0/24
└──────────────────┘
```

---

## Verkabelung

### Kabelkategorien

```
┌──────────┬─────────────┬───────────┬───────────┬───────────┐
│ Kategorie│ Geschw.     │ Frequenz  │ Max. Länge│ Schirmung │
├──────────┼─────────────┼───────────┼───────────┼───────────┤
│ Cat 5    │ 100 Mbit/s  │ 100 MHz   │ 100m      │ UTP       │
│ Cat 5e   │ 1 Gbit/s    │ 100 MHz   │ 100m      │ UTP       │
│ Cat 6    │ 1/10 Gbit/s │ 250 MHz   │ 100/55m   │ UTP/STP   │
│ Cat 6a   │ 10 Gbit/s   │ 500 MHz   │ 100m      │ STP       │
│ Cat 7    │ 10 Gbit/s   │ 600 MHz   │ 100m      │ S/FTP     │
│ Cat 8    │ 25-40 Gbit/s│ 2000 MHz  │ 30m       │ S/FTP     │
└──────────┴─────────────┴───────────┴───────────┴───────────┘

UTP = Unshielded Twisted Pair (ungeschirmt)
STP = Shielded Twisted Pair (geschirmt)
S/FTP = Overall Shield + Foil Twisted Pair
```

### Kabelarten

```
STRAIGHT-THROUGH (Standard):
┌──────────────────────────────────────────────────────────┐
│  Beide Enden gleiche Belegung (T568B)                   │
│  PC → Switch, Router → Switch                           │
│                                                          │
│  Pin 1 ─────────────── Pin 1                            │
│  Pin 2 ─────────────── Pin 2                            │
│  Pin 3 ─────────────── Pin 3                            │
│  ...                                                     │
└──────────────────────────────────────────────────────────┘

CROSSOVER (für gleiche Geräte):
┌──────────────────────────────────────────────────────────┐
│  TX/RX gekreuzt                                         │
│  PC → PC, Switch → Switch (ohne Auto-MDI/X)             │
│                                                          │
│  Pin 1 (TX+) ────────── Pin 3 (RX+)                     │
│  Pin 2 (TX-) ────────── Pin 6 (RX-)                     │
│  Pin 3 (RX+) ────────── Pin 1 (TX+)                     │
│  Pin 6 (RX-) ────────── Pin 2 (TX-)                     │
└──────────────────────────────────────────────────────────┘

Hinweis: Moderne Geräte haben Auto-MDI/X und erkennen
automatisch, welches Kabel verwendet wird.
```

### Glasfaser

```
┌─────────────────────────────────────────────────────────────┐
│                    GLASFASER-TYPEN                           │
├───────────────┬─────────────────────────────────────────────┤
│ Singlemode    │ • Kern: 8-10 μm                            │
│ (SMF)         │ • Laser als Lichtquelle                    │
│               │ • Reichweite: 10-100+ km                   │
│               │ • Teurer, für WAN                          │
├───────────────┼─────────────────────────────────────────────┤
│ Multimode     │ • Kern: 50-62.5 μm                         │
│ (MMF)         │ • LED als Lichtquelle                      │
│               │ • Reichweite: 300-550m                     │
│               │ • Günstiger, für LAN/Datacenter            │
└───────────────┴─────────────────────────────────────────────┘

Stecker-Typen:
┌──────────┬─────────────────────────────────────────┐
│ LC       │ Klein, modern, häufig in Datacenters   │
│ SC       │ Push-Pull, robust                       │
│ ST       │ Bajonett, ältere Installationen        │
│ MPO/MTP  │ Multi-Faser (12-24 Fasern)             │
└──────────┴─────────────────────────────────────────┘
```

---

## Geschwindigkeiten & Standards

### Ethernet-Standards

```
┌─────────────────────────────────────────────────────────────┐
│                  ETHERNET EVOLUTION                          │
├───────────────┬──────────────┬───────────────┬──────────────┤
│ Standard      │ Geschw.      │ Medium        │ IEEE         │
├───────────────┼──────────────┼───────────────┼──────────────┤
│ Ethernet      │ 10 Mbit/s    │ Coax, Kupfer  │ 802.3        │
│ Fast Ethernet │ 100 Mbit/s   │ Kupfer, Fiber │ 802.3u       │
│ Gigabit       │ 1 Gbit/s     │ Kupfer, Fiber │ 802.3ab/z    │
│ 2.5G BASE-T   │ 2.5 Gbit/s   │ Kupfer        │ 802.3bz      │
│ 5G BASE-T     │ 5 Gbit/s     │ Kupfer        │ 802.3bz      │
│ 10G           │ 10 Gbit/s    │ Kupfer, Fiber │ 802.3an/ae   │
│ 25G           │ 25 Gbit/s    │ Fiber         │ 802.3by      │
│ 40G           │ 40 Gbit/s    │ Fiber         │ 802.3ba      │
│ 100G          │ 100 Gbit/s   │ Fiber         │ 802.3ba/bm   │
│ 200G          │ 200 Gbit/s   │ Fiber         │ 802.3bs      │
│ 400G          │ 400 Gbit/s   │ Fiber         │ 802.3bs      │
└───────────────┴──────────────┴───────────────┴──────────────┘
```

### Duplex-Modi

```
HALF DUPLEX (veraltet):
┌─────────────────────────────────────────────────────────────┐
│  Senden ODER Empfangen - nicht gleichzeitig                 │
│                                                             │
│  PC ════════▶ Switch    (PC sendet)                        │
│  PC ◀════════ Switch    (PC empfängt)                      │
│                                                             │
│  Kollisionen möglich → CSMA/CD nötig                       │
└─────────────────────────────────────────────────────────────┘

FULL DUPLEX (modern):
┌─────────────────────────────────────────────────────────────┐
│  Senden UND Empfangen gleichzeitig                          │
│                                                             │
│  PC ════════▶ Switch                                       │
│  PC ◀════════ Switch                                       │
│      (gleichzeitig)                                         │
│                                                             │
│  Keine Kollisionen → volle Bandbreite in beide Richtungen  │
│  1 Gbit/s Full Duplex = 2 Gbit/s theoretisch               │
└─────────────────────────────────────────────────────────────┘
```

### Auto-Negotiation

```
Automatische Aushandlung von:
- Geschwindigkeit (10/100/1000 Mbit/s)
- Duplex (Half/Full)
- Flow Control

┌─────────┐                         ┌─────────┐
│   PC    │  "Ich kann 1000 Full"   │ Switch  │
│         │ ──────────────────────▶ │         │
│         │  "Ich auch!"            │         │
│         │ ◀────────────────────── │         │
│         │                         │         │
│         │  ═══════════════════    │         │
│         │  1000 Mbit/s Full Duplex│         │
└─────────┘                         └─────────┘

⚠️ Problem: Auto-Negotiation Mismatch
   - Ein Gerät Auto, anderes Fixed
   - Kann zu Duplex-Mismatch führen
   - Symptom: Langsame Verbindung, viele Fehler
```

---

## Troubleshooting

### Häufige Probleme

```
┌─────────────────────────────────────────────────────────────┐
│ Problem              │ Symptom                 │ Lösung      │
├──────────────────────┼─────────────────────────┼─────────────┤
│ Kein Link            │ Link-LED aus           │ Kabel prüfen│
│ Duplex Mismatch      │ Langsam, viele Fehler  │ Auto-Neg    │
│ Speed Mismatch       │ Keine Verbindung       │ Speed prüfen│
│ VLAN falsch          │ Kein Netzwerk          │ VLAN-Config │
│ Loop                 │ Broadcast Storm        │ STP prüfen  │
│ MTU Mismatch         │ Große Pakete scheitern │ MTU anpassen│
└─────────────────────────────────────────────────────────────┘
```

### Diagnose-Befehle

```bash
# macOS/Linux: Interface-Status
ifconfig en0
ip link show eth0

# Speed/Duplex prüfen (Linux)
ethtool eth0

# macOS: Netzwerk-Details
networksetup -getinfo "Ethernet"

# ARP-Cache
arp -a

# Netzwerk-Statistiken
netstat -i

# Ping für Connectivity
ping 192.168.1.1

# Traceroute für Pfad
traceroute 8.8.8.8

# DNS-Lookup
nslookup google.com
dig google.com
```

### Switch-Diagnose

```bash
# Cisco Switch CLI Beispiele

# Port-Status
show interfaces status

# Interface Details
show interfaces GigabitEthernet0/1

# MAC-Adress-Tabelle
show mac address-table

# VLAN-Übersicht
show vlan brief

# Trunk-Status
show interfaces trunk

# Spanning Tree
show spanning-tree

# Log
show logging
```

### Kabel-Test

```
┌─────────────────────────────────────────────────────────────┐
│                  KABELTEST METHODEN                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Visuell:                                                 │
│    - Kabel auf Knicke/Beschädigungen prüfen                │
│    - Stecker-Clips intakt?                                 │
│    - Kabel richtig eingesteckt?                            │
│                                                             │
│ 2. Link-LED:                                                │
│    - Grün = Verbindung OK                                  │
│    - Aus = Keine physische Verbindung                      │
│    - Orange/Amber = Fehler oder 10/100 Mbit/s              │
│                                                             │
│ 3. Kabel-Tester:                                            │
│    - Günstig: Einfacher Durchgangsprüfer                   │
│    - Mittel: Zeigt Verdrahtungsfehler                      │
│    - Profi: Fluke-Tester, misst Länge, Crosstalk, etc.     │
│                                                             │
│ 4. Loopback-Test:                                           │
│    - Kabel an beiden Enden am selben Gerät                 │
│    - Wenn Traffic fließt → Kabel OK                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Cloud-Relevanz

### AWS Networking = Virtuelles Ethernet

```
┌─────────────────────────────────────────────────────────────┐
│              AWS VPC = Virtuelles LAN                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  VPC (Virtual Private Cloud)                                │
│  ├── Subnets = Virtuelle VLANs                             │
│  │   ├── Public Subnet (10.0.1.0/24)                       │
│  │   └── Private Subnet (10.0.2.0/24)                      │
│  │                                                          │
│  ├── Security Groups = Virtuelle Firewall                   │
│  │   (wie VLAN ACLs)                                       │
│  │                                                          │
│  ├── Route Tables = Virtuelles Routing                      │
│  │   (wie Layer 3 Switch)                                  │
│  │                                                          │
│  └── ENI (Elastic Network Interface)                        │
│      = Virtuelle NIC mit MAC-Adresse                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Für die AI-Freelancer-Plattform

```typescript
// Netzwerk-Konzepte in Terraform

// VPC = Virtuelles Netzwerk (wie physisches LAN)
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"  // 65.536 IPs

  enable_dns_hostnames = true
  enable_dns_support   = true
}

// Subnet = Virtuelles VLAN
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"  // 256 IPs
  availability_zone = "eu-central-1a"

  // Wie VLAN mit Internet-Zugang
  map_public_ip_on_launch = true
}

// Security Group = Virtuelle Port-Security
resource "aws_security_group" "web" {
  vpc_id = aws_vpc.main.id

  // Eingehend: Port 443 (wie Switch ACL)
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  // Ausgehend: Alles erlaubt
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### ENI - Elastic Network Interface

```
EC2 Instance mit ENI:

┌─────────────────────────────────────────────────────────────┐
│                    EC2 Instance                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Primary ENI (eth0)                                   │   │
│  │ ├── Private IP: 10.0.1.10                           │   │
│  │ ├── MAC: 02:xx:xx:xx:xx:xx                          │   │
│  │ └── Security Groups: sg-web                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Secondary ENI (eth1) - Optional                      │   │
│  │ ├── Private IP: 10.0.2.10                           │   │
│  │ ├── MAC: 02:yy:yy:yy:yy:yy                          │   │
│  │ └── Security Groups: sg-db                          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

Anwendungsfälle für Multiple ENIs:
- Management-Netzwerk separieren
- Verschiedene Security Groups
- MAC-basierte Lizenzierung
```

---

## Zusammenfassung

### Key Takeaways

```
┌─────────────────────────────────────────────────────────────┐
│                ETHERNET ESSENTIALS                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Ethernet = Layer 1 & 2 (physisch + Data Link)           │
│                                                             │
│ 2. MAC-Adressen = Hardware-Adressen (48 Bit)               │
│    - Eindeutig pro NIC                                     │
│    - ARP verbindet IP → MAC                                │
│                                                             │
│ 3. Switch > Hub                                            │
│    - Lernt MAC-Adressen                                    │
│    - Sendet gezielt (nicht Broadcast)                      │
│    - Full Duplex möglich                                   │
│                                                             │
│ 4. VLANs = Logische Trennung                               │
│    - Isoliert Broadcast-Domains                            │
│    - Erhöht Sicherheit                                     │
│    - Trunk für Switch-Verbindungen                         │
│                                                             │
│ 5. Geschwindigkeiten                                       │
│    - Standard: 1 Gbit/s (Cat5e reicht)                     │
│    - Datacenter: 10-100 Gbit/s (Glasfaser)                 │
│                                                             │
│ 6. Cloud-Mapping                                           │
│    - VPC = LAN                                             │
│    - Subnet = VLAN                                         │
│    - Security Group = Firewall/ACL                         │
│    - ENI = Virtuelle NIC                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Quick Reference

```bash
# Netzwerk-Info anzeigen
ifconfig                    # macOS
ip addr                     # Linux
ipconfig /all              # Windows

# MAC-Adresse
ifconfig en0 | grep ether

# ARP-Cache
arp -a

# Netzwerk-Statistiken
netstat -i

# DNS-Test
nslookup google.com

# Connectivity
ping -c 4 192.168.1.1

# Traceroute
traceroute google.com       # macOS/Linux
tracert google.com         # Windows
```

---

**Nächstes Learning:** [LEARNING_20_SERVER.md](./LEARNING_20_SERVER.md) - Server & Administration

---

*Erstellt: 17. Dezember 2025*
*Für: Klaus Weigele - AI-Freelancer-Plattform*
