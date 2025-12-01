import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Clock, Users } from 'lucide-react';
import { Header } from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Provision', value: '2%', detail: '80% günstiger als Markt' },
  { label: 'Time-to-Match', value: '48h', detail: 'Qualifizierte Vorschläge' },
  { label: 'Talent-Pool', value: 'Top 10%', detail: 'Kuratierte Experten' },
];

const freelancerPoints = [
  'Karriere-Coaching mit klaren Rates & Skill-Gaps',
  'Faire Verträge ohne Mindestlaufzeit',
  'Mentoring-Pfade von Apprentice bis Expert',
];

const companyPoints = [
  'AI-gestütztes Briefing → weniger Rückfragen',
  'Semantisches Matching statt Keyword-Suche',
  'Trial Week: risikofrei testen und entscheiden',
];

const features = [
  {
    icon: Sparkles,
    title: 'AI Project Builder',
    copy: 'In 3 Minuten zu einem klaren Briefing, das Engineers sofort umsetzen können.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Ready',
    copy: 'DSGVO, NDAs und Auftragsverarbeitung standardisiert ab Tag 1.',
  },
  {
    icon: Clock,
    title: 'Speed to Impact',
    copy: 'Erste Ergebnisse in der Trial Week — sonst keine Provision.',
  },
];

const pricing = [
  { tier: 'Apprentice', rate: '300–500€', note: 'Guided by Seniors' },
  { tier: 'Intermediate', rate: '500–800€', note: 'Standard AI-Projekte' },
  { tier: 'Expert', rate: '800–1.200€', note: 'Enterprise & Architektur' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Header />

      <main>
        <section className="section-padding bg-white">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                Deutsche AI-Freelancer Plattform
              </p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                KI-Experten in <span className="text-gradient">48 Stunden</span> statt Wochen.
              </h1>
              <p className="text-lg text-neutral-500">
                Kuratierter Pool, nur 2% Provision und eine Trial Week zum risikofreien Start. Von
                ersten Prototypen bis Enterprise-AI.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Kostenlos prüfen
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/kontakt">Mit uns sprechen</Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-600" />
                  DSGVO-konform
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-600" />
                  Kuratierte Community
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:justify-end">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-neutral-200 p-4 bg-neutral-50 card-hover"
                >
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-sm font-medium text-neutral-600">{item.label}</div>
                  <p className="text-xs text-neutral-500 mt-2">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="freelancer"
          className="section-padding bg-neutral-50 border-y border-neutral-200"
        >
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                Für Freelancer
              </p>
              <h2 className="text-3xl font-bold">Verdiene fair. Wachse schnell.</h2>
              <p className="text-neutral-600">
                Wir koppeln dich mit Projekten, die zu deinem Level passen und geben klares
                Feedback, welche Skills deinen Tagessatz heben.
              </p>
              <ul className="space-y-3">
                {freelancerPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-cyan-600" />
                    <span className="text-neutral-700">{point}</span>
                  </li>
                ))}
              </ul>
              <Button variant="secondary" asChild>
                <Link href="/register">Jetzt Profil prüfen lassen</Link>
              </Button>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-semibold">
                  AI
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">Persönlicher Plan</p>
                  <p className="text-xs text-neutral-500">Tagessatz- und Skill-Empfehlungen</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-neutral-700">
                <div className="flex justify-between">
                  <span>Aktueller Fokus</span>
                  <span className="font-semibold text-neutral-900">RAG + Eval</span>
                </div>
                <div className="flex justify-between">
                  <span>Nächster Schritt</span>
                  <span className="font-semibold text-neutral-900">Agentic Orchestration</span>
                </div>
                <div className="flex justify-between">
                  <span>Empfohlene Rate</span>
                  <span className="font-semibold text-neutral-900">780€</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="unternehmen" className="section-padding bg-white">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
              <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                Trial Week
              </p>
              <h3 className="text-2xl font-bold mb-4">
                Ergebnisse sehen, bevor Sie sich festlegen.
              </h3>
              <p className="text-neutral-600 mb-4">
                Wir starten mit einem klaren Scope, definieren KPIs und liefern erste Ergebnisse
                innerhalb der Testwoche.
              </p>
              <ul className="space-y-3 text-sm text-neutral-700">
                {companyPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-neutral-900" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                Für Unternehmen
              </p>
              <h2 className="text-3xl font-bold">Teams, die liefern – nicht nur Profile.</h2>
              <p className="text-neutral-600">
                Wir kombinieren semantisches Matching mit manueller Kuratierung. Sie sprechen nur
                mit Kandidaten, die wirklich passen.
              </p>
              <Button asChild>
                <Link href="/kontakt">
                  Projekt anfragen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="section-padding bg-neutral-50 border-y border-neutral-200"
        >
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                Features
              </p>
              <h2 className="text-3xl font-bold mb-4">Gebaut für Tempo und Compliance.</h2>
              <p className="text-neutral-600">
                Wir automatisieren Briefing, Matching und Vertragsstrecke, damit Sie in Stunden
                statt Wochen starten.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 card-hover"
                >
                  <feature.icon className="h-8 w-8 text-cyan-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-600">{feature.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="preise" className="section-padding bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                  Preise
                </p>
                <h2 className="text-3xl font-bold">Klarer Rahmen. Faire Provision.</h2>
                <p className="text-neutral-600">
                  Alle Modelle mit 2% Plattform-Provision und klarer Trial Week.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/kontakt">Rates besprechen</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {pricing.map((plan) => (
                <div
                  key={plan.tier}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 card-hover"
                >
                  <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
                    {plan.tier}
                  </p>
                  <p className="text-2xl font-bold mt-2">{plan.rate}</p>
                  <p className="text-sm text-neutral-600 mt-2">{plan.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-neutral-900 text-white">
          <div className="container mx-auto px-6 text-center space-y-4">
            <p className="text-sm uppercase tracking-wide text-neutral-300">Startklar</p>
            <h2 className="text-3xl font-bold">
              Lassen Sie uns Ihr nächstes AI-Projekt in einer Woche live bringen.
            </h2>
            <div className="flex justify-center gap-3 flex-wrap">
              <Button asChild>
                <Link href="/kontakt">Projekt anfragen</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/register">Freelancer werden</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
