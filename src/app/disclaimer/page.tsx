/**
 * Disclaimer / Test-Website Notice
 *
 * Legal disclaimer page for test/demo website.
 * Clarifies that this is not a production system.
 *
 * Date: 2025-10-27
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hinweise zur Test-Webseite | AI-Freelancer-Plattform',
  description:
    'Wichtige Hinweise zur Nutzung dieser Test- und Demonstrationswebseite',
  robots: 'noindex, nofollow',
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Zurück zur Startseite
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ⚠️ Hinweise zur Test-Webseite
        </h1>
        <p className="text-lg text-gray-600">
          Wichtige Informationen zur Nutzung dieser Demonstrationswebseite
        </p>
      </div>

      {/* Warning Box */}
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h2 className="text-xl font-bold text-amber-900 mb-2">
              Dies ist eine Test- und Demonstrationswebseite
            </h2>
            <p className="text-amber-800">
              Diese Website dient ausschließlich zu Test-, Entwicklungs- und
              Demonstrationszwecken. Sie ist <strong>nicht</strong> für den
              produktiven Einsatz bestimmt.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {/* Status */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Status der Webseite
          </h2>
          <p className="text-gray-700 mb-4">
            Diese Webseite befindet sich in der Entwicklungsphase und dient der
            Erprobung neuer Funktionen, dem Testing von Features und der
            Demonstration technischer Konzepte.
          </p>
          <p className="text-gray-700">
            <strong>Aktuelle Phase:</strong> Staging / Pre-Production
            <br />
            <strong>Zweck:</strong> Funktions-Testing, QA, Demonstration
            <br />
            <strong>Produktiv-Start:</strong> Noch nicht geplant
          </p>
        </section>

        {/* Keine Garantie */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Keine Garantie oder Gewährleistung
          </h2>
          <p className="text-gray-700 mb-4">
            Für diese Test-Webseite wird <strong>keinerlei Garantie</strong>{' '}
            oder Gewährleistung übernommen:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Verfügbarkeit:</strong> Die Website kann jederzeit ohne
              Vorankündigung offline genommen, geändert oder gelöscht werden.
            </li>
            <li>
              <strong>Funktionalität:</strong> Funktionen können fehlerhaft
              sein, nicht vollständig funktionieren oder sich unerwartet
              verhalten.
            </li>
            <li>
              <strong>Datensicherheit:</strong> Test-Datenbanken können
              jederzeit zurückgesetzt werden. Geben Sie keine echten oder
              sensiblen Daten ein.
            </li>
            <li>
              <strong>Performance:</strong> Ladezeiten und Performance können
              variieren oder eingeschränkt sein.
            </li>
          </ul>
        </section>

        {/* Datenschutz */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Umgang mit Daten
          </h2>
          <p className="text-gray-700 mb-4">
            <strong className="text-red-600">Wichtiger Hinweis:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Geben Sie <strong>keine echten personenbezogenen Daten</strong>{' '}
              ein.
            </li>
            <li>
              Verwenden Sie <strong>keine echten E-Mail-Adressen</strong> oder
              Passwörter, die Sie anderswo verwenden.
            </li>
            <li>
              Alle eingegebenen Daten können{' '}
              <strong>jederzeit gelöscht</strong> werden.
            </li>
            <li>
              Für Test-Zwecke verwenden Sie bitte{' '}
              <strong>Dummy-/Beispieldaten</strong>.
            </li>
          </ul>
          <p className="text-gray-700 mt-4">
            Weitere Informationen finden Sie in unserer{' '}
            <Link
              href="/datenschutz"
              className="text-blue-600 hover:underline"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>
        </section>

        {/* Keine rechtliche Bindung */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Keine rechtliche Bindung
          </h2>
          <p className="text-gray-700 mb-4">
            Durch die Nutzung dieser Test-Webseite entsteht{' '}
            <strong>kein rechtlich bindendes Verhältnis</strong>:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              Es werden <strong>keine echten Verträge</strong> geschlossen.
            </li>
            <li>
              Es erfolgen <strong>keine Zahlungen</strong> oder
              Abrechnungen.
            </li>
            <li>
              Angebote und Preise sind <strong>beispielhaft</strong> und nicht
              verbindlich.
            </li>
            <li>
              Die Plattform wird <strong>nicht kommerziell</strong>{' '}
              betrieben (Staging-Phase).
            </li>
          </ul>
        </section>

        {/* Haftungsausschluss */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Haftungsausschluss
          </h2>
          <p className="text-gray-700">
            Der Betreiber dieser Test-Webseite übernimmt{' '}
            <strong>keine Haftung</strong> für:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Technische Fehler, Bugs oder Ausfälle</li>
            <li>Verlust von Daten oder Informationen</li>
            <li>Unannehmlichkeiten durch Nichtverfügbarkeit</li>
            <li>Missverständnisse durch unvollständige Features</li>
            <li>Schäden jeglicher Art durch die Nutzung</li>
          </ul>
          <p className="text-gray-700">
            Die Nutzung erfolgt <strong>auf eigenes Risiko</strong>.
          </p>
        </section>

        {/* Feedback */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Feedback erwünscht
          </h2>
          <p className="text-gray-700 mb-4">
            Als Test-Webseite freuen wir uns über Ihr Feedback:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Fehlerberichte und Bug-Reports</li>
            <li>Verbesserungsvorschläge</li>
            <li>Usability-Feedback</li>
            <li>Feature-Anfragen</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Bitte beachten Sie: Feedback wird zur Kenntnis genommen, aber es
            besteht <strong>keine Verpflichtung zur Umsetzung</strong>.
          </p>
        </section>

        {/* Kontakt */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
          <p className="text-gray-700">
            Bei Fragen zu dieser Test-Webseite wenden Sie sich bitte an das{' '}
            <Link href="/impressum" className="text-blue-600 hover:underline">
              Impressum
            </Link>
            .
          </p>
        </section>

        {/* Änderungen */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Änderungen dieser Hinweise
          </h2>
          <p className="text-gray-700">
            Diese Hinweise können jederzeit ohne Vorankündigung geändert
            werden. Es wird empfohlen, diese Seite regelmäßig zu überprüfen.
          </p>
          <p className="text-gray-700 mt-4">
            <strong>Letzte Aktualisierung:</strong> 27. Oktober 2025
          </p>
        </section>
      </div>

      {/* Footer Links */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Startseite
          </Link>
          <Link href="/impressum" className="hover:text-gray-900">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-gray-900">
            Datenschutz
          </Link>
        </div>
      </div>
    </div>
  );
}
