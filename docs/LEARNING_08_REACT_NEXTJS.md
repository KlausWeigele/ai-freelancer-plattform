# Learning 08: React und Next.js

**Erstellt:** 2025-12-10
**Kontext:** AI-Freelancer-Plattform (Next.js 16, React 19)

---

## Inhaltsverzeichnis

1. [React Grundlagen](#1-react-grundlagen)
2. [JSX verstehen](#2-jsx-verstehen)
3. [Komponenten](#3-komponenten)
4. [Props und State](#4-props-und-state)
5. [React Hooks](#5-react-hooks)
6. [Next.js Grundlagen](#6-nextjs-grundlagen)
7. [App Router (Next.js 13+)](#7-app-router-nextjs-13)
8. [Server vs. Client Components](#8-server-vs-client-components)
9. [Routing und Navigation](#9-routing-und-navigation)
10. [Data Fetching](#10-data-fetching)
11. [Unser Projekt: Praktische Beispiele](#11-unser-projekt-praktische-beispiele)

---

## 1. React Grundlagen

### Was ist React?

React ist eine **JavaScript-Library** zum Erstellen von Benutzeroberflächen. Entwickelt von Facebook (Meta), ist es die populärste Frontend-Library weltweit.

```
Kernkonzepte:
1. Komponentenbasiert - UI in wiederverwendbare Teile aufteilen
2. Deklarativ - Beschreibe WAS du willst, nicht WIE
3. Virtuelles DOM - Effiziente UI-Updates
4. Unidirektionaler Datenfluss - Daten fließen von oben nach unten
```

### Warum React?

| Vorteil | Erklärung |
|---------|-----------|
| **Wiederverwendbarkeit** | Komponenten können überall verwendet werden |
| **Entwicklererfahrung** | Hot Reloading, DevTools, großes Ökosystem |
| **Performance** | Virtuelles DOM minimiert echte DOM-Updates |
| **Flexibilität** | Kann mit jeder Backend-Technologie kombiniert werden |
| **Community** | Riesige Community, viele Libraries und Ressourcen |

### React vs. andere Frameworks

```
React      - Library, flexibel, du entscheidest die Architektur
Vue        - Framework, einfacher Einstieg, "Batteries included"
Angular    - Full Framework, von Google, TypeScript-first
Svelte     - Compiler, kein Virtual DOM, sehr performant
```

---

## 2. JSX verstehen

### Was ist JSX?

JSX ist eine **Syntax-Erweiterung** für JavaScript, die HTML-ähnlichen Code in JavaScript ermöglicht.

```tsx
// JSX
const element = <h1>Hallo Welt</h1>;

// Wird zu JavaScript kompiliert:
const element = React.createElement('h1', null, 'Hallo Welt');
```

### JSX-Grundregeln

#### 1. Nur ein Root-Element
```tsx
// ❌ Falsch - mehrere Root-Elemente
return (
  <h1>Titel</h1>
  <p>Text</p>
);

// ✅ Richtig - in div oder Fragment wrappen
return (
  <div>
    <h1>Titel</h1>
    <p>Text</p>
  </div>
);

// ✅ Besser - Fragment (kein extra DOM-Element)
return (
  <>
    <h1>Titel</h1>
    <p>Text</p>
  </>
);
```

#### 2. Alle Tags müssen geschlossen sein
```tsx
// ❌ HTML erlaubt
<br>
<img src="...">
<input type="text">

// ✅ JSX erfordert Schließen
<br />
<img src="..." />
<input type="text" />
```

#### 3. className statt class
```tsx
// ❌ HTML
<div class="container">

// ✅ JSX (class ist reserviertes JavaScript-Keyword)
<div className="container">
```

#### 4. camelCase für Attribute
```tsx
// HTML: onclick, tabindex, for
// JSX: onClick, tabIndex, htmlFor

<button onClick={handleClick} tabIndex={0}>
  Klick mich
</button>

<label htmlFor="email">E-Mail</label>
<input id="email" type="email" />
```

### JavaScript in JSX

```tsx
// Variablen einbetten mit {}
const name = 'Klaus';
return <h1>Hallo {name}</h1>;

// Ausdrücke
return <p>2 + 2 = {2 + 2}</p>;

// Funktionen aufrufen
return <p>Heute ist {new Date().toLocaleDateString()}</p>;

// Bedingungen (Ternary)
return <p>{isLoggedIn ? 'Willkommen!' : 'Bitte einloggen'}</p>;

// Kurzschluss-Auswertung
return <>{showWarning && <p>Warnung!</p>}</>;

// Arrays mappen
const items = ['Apfel', 'Birne', 'Orange'];
return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
```

### Styling in JSX

```tsx
// Inline Styles (als Objekt)
<div style={{ backgroundColor: 'blue', fontSize: '16px' }}>
  Styled Div
</div>

// Mit Variable
const styles = {
  container: {
    padding: '20px',
    margin: '10px',
  },
};
<div style={styles.container}>Content</div>

// Besser: Tailwind CSS (unser Projekt)
<div className="bg-blue-500 text-white p-4 rounded">
  Tailwind Styled
</div>
```

---

## 3. Komponenten

### Was sind Komponenten?

Komponenten sind **wiederverwendbare UI-Bausteine**. Jede Komponente ist eine Funktion, die JSX zurückgibt.

```tsx
// Eine einfache Komponente
function Greeting() {
  return <h1>Hallo Welt!</h1>;
}

// Verwendung
<Greeting />
```

### Funktionskomponenten (Modern)

```tsx
// Arrow Function (empfohlen in unserem Projekt)
const Button = () => {
  return <button>Klick mich</button>;
};

// Oder mit implizitem Return
const Button = () => <button>Klick mich</button>;

// Mit TypeScript-Typen
interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <button onClick={onClick}>{label}</button>;
};
```

### Klassenkomponenten (Legacy)

```tsx
// ❌ Alt - nicht mehr verwenden
class Greeting extends React.Component {
  render() {
    return <h1>Hallo {this.props.name}</h1>;
  }
}

// ✅ Modern - Funktionskomponente
const Greeting = ({ name }: { name: string }) => {
  return <h1>Hallo {name}</h1>;
};
```

### Komponenten-Hierarchie

```tsx
// src/components/layouts/Header.tsx
const Header = () => {
  return (
    <header>
      <Logo />
      <Navigation />
      <UserMenu />
    </header>
  );
};

// src/components/layouts/Logo.tsx
const Logo = () => {
  return <img src="/logo.svg" alt="Logo" />;
};

// src/components/layouts/Navigation.tsx
const Navigation = () => {
  return (
    <nav>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/projects">Projekte</NavLink>
      <NavLink href="/freelancers">Freelancer</NavLink>
    </nav>
  );
};
```

---

## 4. Props und State

### Props (Properties)

Props sind **Eingabewerte** für Komponenten - wie Funktionsparameter.

```tsx
// Komponente mit Props
interface UserCardProps {
  name: string;
  email: string;
  avatar?: string; // Optional
}

const UserCard = ({ name, email, avatar }: UserCardProps) => {
  return (
    <div className="card">
      <img src={avatar || '/default-avatar.png'} alt={name} />
      <h2>{name}</h2>
      <p>{email}</p>
    </div>
  );
};

// Verwendung
<UserCard
  name="Klaus Weigele"
  email="klaus@example.com"
  avatar="/avatars/klaus.jpg"
/>
```

### Props weitergeben

```tsx
// Spread-Operator für alle Props
const Button = (props: ButtonProps) => {
  return <button {...props}>{props.children}</button>;
};

// Destructuring mit Rest
const Button = ({ className, children, ...rest }: ButtonProps) => {
  return (
    <button className={`btn ${className}`} {...rest}>
      {children}
    </button>
  );
};
```

### Children Props

```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card = ({ title, children }: CardProps) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

// Verwendung
<Card title="Mein Profil">
  <p>Hier steht der Inhalt</p>
  <button>Bearbeiten</button>
</Card>
```

### State

State ist der **interne Zustand** einer Komponente, der sich ändern kann.

```tsx
import { useState } from 'react';

const Counter = () => {
  // useState gibt [wert, setterFunktion] zurück
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Zähler: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
};
```

### Props vs. State

| Eigenschaft | Props | State |
|-------------|-------|-------|
| Quelle | Von außen (Parent) | Intern (Komponente selbst) |
| Änderbar | Nein (read-only) | Ja (mit setter) |
| Wer ändert | Parent-Komponente | Komponente selbst |
| Verwendung | Konfiguration | Dynamische Daten |

```tsx
// Props: Kommen von außen, können nicht geändert werden
// State: Intern, kann geändert werden

const ProfileEditor = ({ initialName }: { initialName: string }) => {
  // initialName ist eine Prop - read-only
  // name ist State - kann geändert werden
  const [name, setName] = useState(initialName);

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
};
```

---

## 5. React Hooks

### Was sind Hooks?

Hooks sind Funktionen, die es erlauben, **React-Features in Funktionskomponenten** zu nutzen.

```
Regeln für Hooks:
1. Nur auf oberster Ebene aufrufen (nicht in if/for/etc.)
2. Nur in React-Funktionskomponenten oder Custom Hooks aufrufen
3. Namen beginnen immer mit "use"
```

### useState - Zustand verwalten

```tsx
const [value, setValue] = useState(initialValue);
```

```tsx
// Verschiedene Typen
const [count, setCount] = useState(0);           // number
const [name, setName] = useState('');            // string
const [isOpen, setIsOpen] = useState(false);     // boolean
const [items, setItems] = useState<string[]>([]); // array
const [user, setUser] = useState<User | null>(null); // object oder null

// Lazy Initialization (für teure Berechnungen)
const [data, setData] = useState(() => {
  return computeExpensiveValue();
});

// State-Update basierend auf vorherigem State
setCount(prev => prev + 1);

// Array-Updates (immer neue Referenz!)
setItems(prev => [...prev, newItem]);           // Hinzufügen
setItems(prev => prev.filter(i => i.id !== id)); // Entfernen
setItems(prev => prev.map(i =>
  i.id === id ? { ...i, updated: true } : i
)); // Aktualisieren
```

### useEffect - Seiteneffekte

```tsx
useEffect(() => {
  // Effekt-Code
  return () => {
    // Cleanup (optional)
  };
}, [dependencies]);
```

```tsx
// 1. Läuft nach JEDEM Render
useEffect(() => {
  console.log('Komponente gerendert');
});

// 2. Läuft nur beim MOUNT (einmal)
useEffect(() => {
  console.log('Komponente gemountet');
  fetchData();
}, []); // Leeres Dependency-Array

// 3. Läuft wenn sich userId ÄNDERT
useEffect(() => {
  fetchUserData(userId);
}, [userId]);

// 4. Mit Cleanup (z.B. für Subscriptions, Timer)
useEffect(() => {
  const interval = setInterval(() => {
    console.log('tick');
  }, 1000);

  // Cleanup-Funktion - läuft beim Unmount oder vor nächstem Effekt
  return () => {
    clearInterval(interval);
  };
}, []);

// 5. Praktisches Beispiel: Fenstergröße beobachten
useEffect(() => {
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

### useContext - Context API

Context ermöglicht **globalen State** ohne Prop-Drilling.

```tsx
// 1. Context erstellen
import { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Provider-Komponente
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook für einfache Nutzung
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// 4. In Komponente verwenden
const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return <p>Nicht eingeloggt</p>;

  return (
    <div>
      <p>Hallo {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### useRef - Referenzen

```tsx
// 1. DOM-Elemente referenzieren
const InputWithFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
};

// 2. Werte speichern ohne Re-Render
const Timer = () => {
  const countRef = useRef(0);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      countRef.current += 1; // Ändert sich, aber kein Re-Render
      console.log(countRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <p>Renders: {renderCount}</p>;
};
```

### useMemo - Werte cachen

```tsx
// Teuer zu berechnen → nur neu berechnen wenn sich dependencies ändern
const ExpensiveList = ({ items, filter }: Props) => {
  const filteredItems = useMemo(() => {
    console.log('Filtere...');
    return items.filter(item => item.includes(filter));
  }, [items, filter]); // Nur neu berechnen wenn items oder filter ändern

  return (
    <ul>
      {filteredItems.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
};
```

### useCallback - Funktionen cachen

```tsx
// Funktion stabil halten (gleiche Referenz)
// Wichtig für Child-Komponenten mit React.memo
const Parent = () => {
  const [count, setCount] = useState(0);

  // ❌ Neue Funktion bei jedem Render
  const handleClick = () => {
    console.log('clicked');
  };

  // ✅ Gleiche Funktion-Referenz
  const handleClickStable = useCallback(() => {
    console.log('clicked');
  }, []);

  return <Child onClick={handleClickStable} />;
};

const Child = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});
```

### Custom Hooks

```tsx
// Wiederverwendbare Logik extrahieren
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

// Verwendung
const Settings = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  // theme wird automatisch in localStorage gespeichert
};
```

---

## 6. Next.js Grundlagen

### Was ist Next.js?

Next.js ist ein **React-Framework** für Production. Es erweitert React um:

```
Features von Next.js:
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- API Routes
- File-based Routing
- Image Optimization
- CSS Support (Tailwind, CSS Modules)
- TypeScript Support
- Middleware
```

### Warum Next.js für unser Projekt?

| Feature | Vorteil für uns |
|---------|-----------------|
| **SSR** | Bessere SEO für Freelancer-Profile |
| **API Routes** | Backend in gleichem Projekt |
| **App Router** | Moderne, flexible Architektur |
| **Vercel Hosting** | Einfaches Deployment (oder AWS) |
| **Image Optimization** | Schnelle Ladezeiten |

### Projekt-Struktur (App Router)

```
src/
├── app/                    # App Router
│   ├── layout.tsx         # Root Layout (Header, Footer)
│   ├── page.tsx           # Homepage (/)
│   ├── globals.css        # Globale Styles
│   ├── api/               # API Routes
│   │   ├── health/
│   │   │   └── route.ts   # GET /api/health
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts
│   ├── (auth)/            # Route Group (kein URL-Segment)
│   │   ├── login/
│   │   │   └── page.tsx   # /login
│   │   └── register/
│   │       └── page.tsx   # /register
│   └── (dashboard)/       # Route Group
│       ├── layout.tsx     # Dashboard-spezifisches Layout
│       └── projects/
│           └── page.tsx   # /projects
├── components/
│   ├── layouts/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Card.tsx
└── lib/
    ├── db.ts              # Prisma Client
    └── utils.ts           # Helper Functions
```

---

## 7. App Router (Next.js 13+)

### Grundkonzept

Der App Router nutzt **File-System-basiertes Routing**:

```
Datei              → URL
app/page.tsx       → /
app/about/page.tsx → /about
app/blog/[slug]/page.tsx → /blog/hello-world
```

### Spezielle Dateien

| Datei | Zweck |
|-------|-------|
| `page.tsx` | UI für Route (rendert die Seite) |
| `layout.tsx` | Geteiltes Layout (bleibt bei Navigation) |
| `loading.tsx` | Loading UI (mit Suspense) |
| `error.tsx` | Error Boundary für Route |
| `not-found.tsx` | 404 für Route |
| `route.ts` | API Endpoint (nicht UI) |

### Layouts

```tsx
// app/layout.tsx - Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// app/(dashboard)/layout.tsx - Nested Layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
```

### Loading States

```tsx
// app/projects/loading.tsx
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  );
}
```

### Error Handling

```tsx
// app/projects/error.tsx
'use client'; // Error components müssen Client Components sein

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-10">
      <h2 className="text-xl font-bold text-red-600">
        Etwas ist schief gelaufen!
      </h2>
      <p className="text-gray-600 mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Erneut versuchen
      </button>
    </div>
  );
}
```

### Route Groups

Route Groups organisieren Code ohne URL zu beeinflussen:

```
app/
├── (marketing)/        # URL: / (nicht /marketing)
│   ├── page.tsx       # Homepage
│   ├── about/page.tsx # /about
│   └── layout.tsx     # Marketing Layout
├── (dashboard)/        # URL: / (nicht /dashboard)
│   ├── projects/page.tsx  # /projects
│   ├── settings/page.tsx  # /settings
│   └── layout.tsx         # Dashboard Layout mit Sidebar
└── (auth)/
    ├── login/page.tsx     # /login
    └── register/page.tsx  # /register
```

### Dynamische Routen

```tsx
// app/freelancers/[id]/page.tsx
// URL: /freelancers/123

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FreelancerPage({ params }: PageProps) {
  const { id } = await params;
  const freelancer = await getFreelancer(id);

  if (!freelancer) {
    notFound();
  }

  return (
    <div>
      <h1>{freelancer.name}</h1>
      <p>{freelancer.bio}</p>
    </div>
  );
}

// Statische Params generieren (für SSG)
export async function generateStaticParams() {
  const freelancers = await getAllFreelancers();
  return freelancers.map((f) => ({ id: f.id }));
}
```

### Catch-All Routen

```tsx
// app/docs/[...slug]/page.tsx
// Matched: /docs/a, /docs/a/b, /docs/a/b/c

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DocsPage({ params }: PageProps) {
  const { slug } = await params;
  // slug = ['a', 'b', 'c'] für /docs/a/b/c

  const docPath = slug.join('/');
  return <DocViewer path={docPath} />;
}
```

---

## 8. Server vs. Client Components

### Grundkonzept

```
Server Components (Default in Next.js 13+):
- Rendern auf dem Server
- Kein JavaScript an Client gesendet
- Können async sein (await in Komponente)
- Können direkt auf DB zugreifen
- KEIN useState, useEffect, onClick, etc.

Client Components:
- Rendern auf Client (auch SSR, aber hydrated)
- JavaScript wird an Client gesendet
- Interaktivität (Events, State, Hooks)
- Browser APIs (window, localStorage, etc.)
```

### Wann welche nutzen?

| Use Case | Component Type |
|----------|---------------|
| Daten fetchen | Server |
| Direkt auf Backend/DB zugreifen | Server |
| Statischer Content | Server |
| Sensitive Logik/Keys | Server |
| Interaktivität (onClick, onChange) | Client |
| useState, useEffect, useContext | Client |
| Browser APIs | Client |
| Event Listeners | Client |

### Server Component (Default)

```tsx
// app/freelancers/page.tsx
// Kein 'use client' → Server Component

import { prisma } from '@/lib/db';

export default async function FreelancersPage() {
  // Direkt await in Komponente - nur Server Components!
  const freelancers = await prisma.user.findMany({
    where: { role: 'FREELANCER' },
    include: { profile: true },
  });

  return (
    <div>
      <h1>Freelancer finden</h1>
      <div className="grid grid-cols-3 gap-4">
        {freelancers.map((f) => (
          <FreelancerCard key={f.id} freelancer={f} />
        ))}
      </div>
    </div>
  );
}
```

### Client Component

```tsx
// src/components/LikeButton.tsx
'use client'; // ← Markiert als Client Component

import { useState } from 'react';

export function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    // Optimistic Update
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);

    // API Call
    await fetch('/api/like', {
      method: 'POST',
      body: JSON.stringify({ liked: !isLiked }),
    });
  };

  return (
    <button onClick={handleLike} className="flex items-center gap-2">
      <span>{isLiked ? '❤️' : '🤍'}</span>
      <span>{likes}</span>
    </button>
  );
}
```

### Kombination: Server + Client

```tsx
// app/freelancers/[id]/page.tsx (Server Component)
import { prisma } from '@/lib/db';
import { LikeButton } from '@/components/LikeButton';
import { ContactForm } from '@/components/ContactForm';

export default async function FreelancerPage({ params }: Props) {
  const { id } = await params;

  // Server: Daten laden
  const freelancer = await prisma.user.findUnique({
    where: { id },
    include: { profile: true },
  });

  return (
    <div>
      {/* Statischer Content - Server */}
      <h1>{freelancer.name}</h1>
      <p>{freelancer.profile.bio}</p>

      {/* Interaktiv - Client Components */}
      <LikeButton initialLikes={freelancer.profile.likes} />
      <ContactForm freelancerId={freelancer.id} />
    </div>
  );
}
```

### Pattern: Composition

```tsx
// Server Component mit Client Component als Children

// ServerWrapper.tsx (Server)
export async function ServerWrapper() {
  const data = await fetchData();

  return (
    <ClientComponent>
      {/* Diese Children werden auf Server gerendert */}
      <p>{data.title}</p>
    </ClientComponent>
  );
}

// ClientComponent.tsx (Client)
'use client';

export function ClientComponent({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children}
    </div>
  );
}
```

---

## 9. Routing und Navigation

### Link Component

```tsx
import Link from 'next/link';

// Basis-Link
<Link href="/about">Über uns</Link>

// Mit dynamischen Parametern
<Link href={`/freelancers/${freelancer.id}`}>
  {freelancer.name}
</Link>

// Mit Query Parameters
<Link href={{ pathname: '/search', query: { q: 'react' } }}>
  React suchen
</Link>

// Prefetching deaktivieren
<Link href="/slow-page" prefetch={false}>
  Langsame Seite
</Link>

// Replace statt Push (kein Browser-History-Eintrag)
<Link href="/dashboard" replace>
  Dashboard
</Link>
```

### useRouter Hook (Client)

```tsx
'use client';

import { useRouter } from 'next/navigation';

export function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    const success = await login();
    if (success) {
      router.push('/dashboard');    // Navigation
      // oder
      router.replace('/dashboard'); // Ohne History
      // oder
      router.refresh();             // Server Components neu laden
      // oder
      router.back();                // Zurück
      router.forward();             // Vorwärts
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### usePathname und useSearchParams

```tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';

export function SearchResults() {
  const pathname = usePathname();     // z.B. '/search'
  const searchParams = useSearchParams();
  const query = searchParams.get('q'); // z.B. 'react'

  return (
    <div>
      <p>Aktuelle Seite: {pathname}</p>
      <p>Suchbegriff: {query}</p>
    </div>
  );
}
```

### Middleware (Redirects, Auth)

```tsx
// middleware.ts (im Root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Auth Check
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};
```

---

## 10. Data Fetching

### Server Components (empfohlen)

```tsx
// Direkt in Server Component
export default async function Page() {
  // 1. Prisma (direkt DB)
  const users = await prisma.user.findMany();

  // 2. Fetch API
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store', // Immer frisch
    // oder
    next: { revalidate: 60 }, // Alle 60 Sekunden
  });
  const data = await res.json();

  return <div>{/* ... */}</div>;
}
```

### Caching-Strategien

```tsx
// 1. Static (Default) - Cache permanent
const data = await fetch('https://api.example.com/static');

// 2. Revalidate - Cache für Zeit X
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 }, // 1 Stunde
});

// 3. No Cache - Immer frisch
const data = await fetch('https://api.example.com/realtime', {
  cache: 'no-store',
});

// 4. On-Demand Revalidation
// In API Route:
import { revalidatePath, revalidateTag } from 'next/cache';

// Bei Tag
const data = await fetch('https://...', { next: { tags: ['products'] } });
// Später: revalidateTag('products')

// Bei Path
revalidatePath('/products');
```

### Client-Side Fetching

```tsx
'use client';

import { useState, useEffect } from 'react';

// 1. Klassisch mit useEffect
export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Lädt...</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// 2. Besser: SWR (empfohlen)
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function UserList() {
  const { data, error, isLoading } = useSWR('/api/users', fetcher);

  if (isLoading) return <p>Lädt...</p>;
  if (error) return <p>Fehler!</p>;
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### Server Actions (Next.js 14+)

```tsx
// Server Action definieren
async function createProject(formData: FormData) {
  'use server'; // Markiert als Server Action

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  const project = await prisma.project.create({
    data: { title, description },
  });

  revalidatePath('/projects');
  redirect(`/projects/${project.id}`);
}

// In Formular verwenden
export default function NewProjectPage() {
  return (
    <form action={createProject}>
      <input name="title" required />
      <textarea name="description" />
      <button type="submit">Erstellen</button>
    </form>
  );
}
```

---

## 11. Unser Projekt: Praktische Beispiele

### Aktuelle Komponenten-Struktur

```
src/
├── app/
│   ├── layout.tsx          # Root Layout
│   ├── page.tsx            # Homepage
│   ├── api/
│   │   ├── health/route.ts # Health Check
│   │   └── version/route.ts # Version Info
│   └── (dashboard)/
│       └── layout.tsx      # Dashboard Layout (geplant)
├── components/
│   ├── layouts/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── TestBanner.tsx  # Dev Environment Banner
│   └── ui/                 # UI Komponenten (shadcn/ui)
└── lib/
    ├── db.ts               # Prisma Client
    └── utils.ts            # cn() Funktion für Tailwind
```

### Beispiel: Homepage (app/page.tsx)

```tsx
// app/page.tsx
import { Header } from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Finde die besten AI & IT Freelancer
            </h1>
            <p className="text-xl mb-8">
              Deutschlands Plattform für AI-Experten und IT-Profis
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/register" className="btn-primary">
                Als Freelancer registrieren
              </a>
              <a href="/projects" className="btn-secondary">
                Projekte entdecken
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Warum unsere Plattform?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                title="Transparente Vermittlung"
                description="Keine versteckten Gebühren"
                icon="💎"
              />
              <FeatureCard
                title="Deutsche Qualität"
                description="DSGVO-konform, deutsche Server"
                icon="🇩🇪"
              />
              <FeatureCard
                title="AI-Fokus"
                description="Spezialisiert auf AI & ML Projekte"
                icon="🤖"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center">
      <span className="text-4xl">{icon}</span>
      <h3 className="text-xl font-semibold mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}
```

### Beispiel: API Route (Health Check)

```tsx
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // DB-Verbindung prüfen
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
```

### Beispiel: Client Component (Interaktiv)

```tsx
// src/components/ui/SearchBar.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Freelancer oder Skills suchen..."
        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Suchen
      </button>
    </form>
  );
}
```

### Beispiel: shadcn/ui Button

```tsx
// src/components/ui/button.tsx (von shadcn/ui)
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

---

## Zusammenfassung

### Wichtigste Konzepte

```
React:
- Komponenten = Wiederverwendbare UI-Bausteine
- Props = Eingabe von außen (read-only)
- State = Interner Zustand (änderbar)
- Hooks = React-Features in Funktionskomponenten

Next.js:
- Server Components = Default, kein JS an Client
- Client Components = 'use client', interaktiv
- App Router = File-based Routing
- API Routes = Backend im gleichen Projekt
```

### Best Practices für unser Projekt

```
1. Server Components als Default
   → Nur 'use client' wenn nötig (Events, State)

2. Daten auf Server laden
   → prisma direkt in Page/Layout

3. Client Components klein halten
   → Nur interaktive Teile

4. TypeScript überall
   → Interface für Props definieren

5. Tailwind für Styling
   → cn() für konditionelle Klassen

6. shadcn/ui für UI-Komponenten
   → Konsistentes Design
```

---

## Ressourcen

- [React Dokumentation](https://react.dev/)
- [Next.js Dokumentation](https://nextjs.org/docs)
- [Next.js App Router Tutorial](https://nextjs.org/learn)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
