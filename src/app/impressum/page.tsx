/**
 * Impressum (Legal Notice)
 *
 * Required by German law (§ 5 TMG - Telemediengesetz)
 * for commercial websites and websites that contain editorial content.
 *
 * Date: 2025-10-27
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Impressum | AI-Freelancer-Plattform',
  description: 'Impressum und rechtliche Angaben',
  robots: 'noindex, nofollow',
};

export default function ImpressumPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block">
          ← Zurück zur Startseite
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Impressum</h1>
        <p className="text-lg text-gray-600">Angaben gemäß § 5 TMG (Telemediengesetz)</p>
      </div>

      {/* Warning Box - Test Website */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8 rounded-r-lg">
        <div className="flex items-start">
          <svg
            className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h2 className="text-lg font-bold text-amber-900 mb-2">Test-Webseite</h2>
            <p className="text-amber-800 text-sm">
              Dies ist eine Test- und Demonstrationswebseite. Es handelt sich um kein kommerzielles
              Angebot. Siehe{' '}
              <Link href="/disclaimer" className="underline font-semibold">
                Hinweise
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {/* Angaben gemäß § 5 TMG */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-900 mb-2">
              Max Mustermann
              <br />
              Musterstraße 123
              <br />
              12345 Musterstadt
            </p>

            <div className="mt-4 space-y-2 text-gray-700">
              <p>
                <strong>E-Mail:</strong>{' '}
                <a
                  href="mailto:kontakt@muster-plattform.de"
                  className="text-blue-600 hover:underline"
                >
                  kontakt@muster-plattform.de
                </a>
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a href="https://www.muster-plattform.de" className="text-blue-600 hover:underline">
                  www.muster-plattform.de
                </a>
              </p>
            </div>
          </div>

          {/* TODO Comment for customization */}
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 text-sm">
            <p className="text-blue-900">
              <strong>Hinweis:</strong> Bitte ergänzen Sie Ihre vollständigen Kontaktdaten (Straße,
              Hausnummer, PLZ, Ort, ggf. Telefonnummer).
            </p>
          </div>
        </section>

        {/* Vertreten durch */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vertreten durch</h2>
          <p className="text-gray-700">Max Mustermann (Betreiber)</p>
        </section>

        {/* Kontakt */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>E-Mail:</strong>{' '}
              <a
                href="mailto:kontakt@muster-plattform.de"
                className="text-blue-600 hover:underline"
              >
                kontakt@muster-plattform.de
              </a>
            </p>
            {/* Optional: Telefon */}
            {/* <p>
              <strong>Telefon:</strong> +49 (0) XXX XXXXXXX
            </p> */}
          </div>
        </section>

        {/* Umsatzsteuer-ID (optional - nur bei USt-Pflicht) */}
        {/*
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Umsatzsteuer-ID
          </h2>
          <p className="text-gray-700">
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
          </p>
          <p className="text-gray-700 font-mono bg-gray-100 px-3 py-2 rounded mt-2 inline-block">
            DE XXXXXXXXX
          </p>
          <p className="text-gray-600 text-sm mt-2">
            (Falls vorhanden und umsatzsteuerpflichtig)
          </p>
        </section>
        */}

        {/* Berufshaftpflichtversicherung (optional) */}
        {/*
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Berufshaftpflichtversicherung
          </h2>
          <div className="text-gray-700 space-y-2">
            <p><strong>Versicherer:</strong> [Name der Versicherung]</p>
            <p><strong>Geltungsraum:</strong> Deutschland</p>
          </div>
        </section>
        */}

        {/* EU-Streitschlichtung */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">EU-Streitschlichtung</h2>
          <p className="text-gray-700 mb-4">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
          </p>
          <p>
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="text-gray-700 mt-4">Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
        </section>

        {/* Verbraucherstreitbeilegung */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Verbraucherstreitbeilegung / Universalschlichtungsstelle
          </h2>
          <p className="text-gray-700">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
          <p className="text-gray-600 text-sm mt-2">
            (Da dies eine Test-Webseite ohne kommerzielle Tätigkeit ist, besteht keine Verpflichtung
            zur Teilnahme an Streitbeilegungsverfahren.)
          </p>
        </section>

        {/* Haftungsausschluss */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftung für Inhalte</h2>
          <p className="text-gray-700 mb-4">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>
          <p className="text-gray-700">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
            allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
            erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
            Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
            entfernen.
          </p>
        </section>

        {/* Haftung für Links */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftung für Links</h2>
          <p className="text-gray-700 mb-4">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
            übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich.
          </p>
          <p className="text-gray-700">
            Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
            überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
            Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>
        </section>

        {/* Urheberrecht */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Urheberrecht</h2>
          <p className="text-gray-700 mb-4">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
            Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
          <p className="text-gray-700">
            Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen
            Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
            wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter
            als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung
            aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </section>

        {/* Quelle */}
        <section className="mb-8">
          <p className="text-gray-500 text-sm">
            Quelle: Erstellt mit Unterstützung von{' '}
            <a
              href="https://www.e-recht24.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              e-recht24.de
            </a>
          </p>
        </section>
      </div>

      {/* Footer Links */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Startseite
          </Link>
          <Link href="/disclaimer" className="hover:text-gray-900">
            Hinweise
          </Link>
          <Link href="/datenschutz" className="hover:text-gray-900">
            Datenschutz
          </Link>
        </div>
      </div>
    </div>
  );
}
