/**
 * Datenschutzerklärung (Privacy Policy)
 *
 * DSGVO-konforme Datenschutzerklärung für Test-/Staging-Webseite
 *
 * Date: 2025-10-27
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | AI-Freelancer-Plattform',
  description: 'Datenschutzerklärung gemäß DSGVO',
  robots: 'noindex, nofollow',
};

export default function DatenschutzPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block">
          ← Zurück zur Startseite
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Datenschutzerklärung</h1>
        <p className="text-lg text-gray-600">
          Information über die Verarbeitung personenbezogener Daten
        </p>
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
            <h2 className="text-lg font-bold text-amber-900 mb-2">
              Test-Webseite: Keine echten Daten verwenden!
            </h2>
            <p className="text-amber-800 text-sm">
              Dies ist eine Test-Webseite. Bitte geben Sie{' '}
              <strong>keine echten personenbezogenen Daten</strong> ein. Alle Daten können jederzeit
              gelöscht werden.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {/* 1. Name und Anschrift des Verantwortlichen */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            1. Name und Anschrift des Verantwortlichen
          </h2>
          <p className="text-gray-700 mb-4">
            Der Verantwortliche im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer
            nationaler Datenschutzgesetze der Mitgliedsstaaten sowie sonstiger
            datenschutzrechtlicher Bestimmungen ist:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-900">
              Klaus Weigele
              <br />
              [Straße und Hausnummer]
              <br />
              [PLZ und Ort]
              <br />
              Deutschland
            </p>
            <div className="mt-4 space-y-1 text-gray-700">
              <p>
                <strong>E-Mail:</strong>{' '}
                <a href="mailto:kontakt@weigele.art" className="text-blue-600 hover:underline">
                  kontakt@weigele.art
                </a>
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a href="https://www.weigele.art" className="text-blue-600 hover:underline">
                  www.weigele.art
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* 2. Allgemeines zur Datenverarbeitung */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            2. Allgemeines zur Datenverarbeitung
          </h2>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            2.1 Umfang der Verarbeitung
          </h3>
          <p className="text-gray-700 mb-4">
            Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur
            Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen
            erforderlich ist.
          </p>
          <p className="text-gray-700 mb-4">
            <strong className="text-red-600">Wichtiger Hinweis für Test-Webseite:</strong> Da dies
            eine Test- und Demonstrationswebseite ist, werden alle eingegebenen Daten ausschließlich
            zu Test- und Entwicklungszwecken verarbeitet. Es erfolgt keine kommerzielle Nutzung.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Rechtsgrundlage</h3>
          <p className="text-gray-700 mb-4">
            Soweit wir für Verarbeitungsvorgänge personenbezogener Daten eine Einwilligung der
            betroffenen Person einholen, dient Art. 6 Abs. 1 lit. a EU-Datenschutzgrundverordnung
            (DSGVO) als Rechtsgrundlage.
          </p>
          <p className="text-gray-700 mb-4">
            Bei der Verarbeitung von personenbezogenen Daten, die zur Erfüllung eines Vertrages
            erforderlich sind, dient Art. 6 Abs. 1 lit. b DSGVO als Rechtsgrundlage (gilt nicht für
            Test-Webseite, da keine echten Verträge).
          </p>
          <p className="text-gray-700">
            Soweit eine Verarbeitung personenbezogener Daten zur Erfüllung einer rechtlichen
            Verpflichtung erforderlich ist, dient Art. 6 Abs. 1 lit. c DSGVO als Rechtsgrundlage.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            2.3 Datenlöschung und Speicherdauer
          </h3>
          <p className="text-gray-700 mb-4">
            Die personenbezogenen Daten der betroffenen Person werden gelöscht oder gesperrt, sobald
            der Zweck der Speicherung entfällt.
          </p>
          <p className="text-gray-700 mb-4">
            <strong className="text-red-600">Besonderheit für Test-Webseite:</strong> Alle
            Test-Daten können jederzeit ohne Vorankündigung vollständig gelöscht werden. Es besteht
            kein Anspruch auf dauerhafte Datenspeicherung.
          </p>
        </section>

        {/* 3. Bereitstellung der Website */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            3. Bereitstellung der Website und Erstellung von Logfiles
          </h2>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            3.1 Beschreibung und Umfang
          </h3>
          <p className="text-gray-700 mb-4">
            Bei jedem Aufruf unserer Internetseite erfasst unser System automatisiert Daten und
            Informationen vom Computersystem des aufrufenden Rechners. Folgende Daten werden hierbei
            erhoben:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>Informationen über den Browsertyp und die verwendete Version</li>
            <li>Das Betriebssystem des Nutzers</li>
            <li>Die IP-Adresse des Nutzers</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>
              Websites, von denen das System des Nutzers auf unsere Internetseite gelangt (Referrer)
            </li>
            <li>Websites, die vom System des Nutzers über unsere Website aufgerufen werden</li>
          </ul>
          <p className="text-gray-700">
            Die Daten werden ebenfalls in den Logfiles unseres Systems gespeichert. Eine Speicherung
            dieser Daten zusammen mit anderen personenbezogenen Daten des Nutzers findet nicht
            statt.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Rechtsgrundlage</h3>
          <p className="text-gray-700">
            Rechtsgrundlage für die vorübergehende Speicherung der Daten und der Logfiles ist Art. 6
            Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung einer funktionsfähigen
            Website).
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            3.3 Zweck der Datenverarbeitung
          </h3>
          <p className="text-gray-700 mb-4">
            Die vorübergehende Speicherung der IP-Adresse durch das System ist notwendig, um eine
            Auslieferung der Website an den Rechner des Nutzers zu ermöglichen. Die Speicherung in
            Logfiles erfolgt, um die Funktionsfähigkeit der Website sicherzustellen und zur
            Optimierung der Website.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            3.4 Dauer der Speicherung
          </h3>
          <p className="text-gray-700">
            Die Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung
            nicht mehr erforderlich sind. Logfiles werden in der Regel nach maximal 7 Tagen
            gelöscht.
          </p>
        </section>

        {/* 4. Verwendung von Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Verwendung von Cookies</h2>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.1 Beschreibung</h3>
          <p className="text-gray-700 mb-4">
            Unsere Webseite verwendet Cookies. Bei Cookies handelt es sich um Textdateien, die im
            Internetbrowser bzw. vom Internetbrowser auf dem Computersystem des Nutzers gespeichert
            werden.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            4.2 Technisch notwendige Cookies
          </h3>
          <p className="text-gray-700 mb-4">
            Unsere Website verwendet Cookies, die für die Funktion der Website erforderlich sind:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>
              <strong>Session-Cookies:</strong> Zur Aufrechterhaltung der Benutzer-Session (z.B. bei
              Anmeldung)
            </li>
            <li>
              <strong>Security-Cookies:</strong> Zum Schutz vor Cross-Site Request Forgery (CSRF)
            </li>
          </ul>
          <p className="text-gray-700">
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherer
            Website-Funktion)
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            4.3 Widerspruch und Löschung
          </h3>
          <p className="text-gray-700">
            Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert
            werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte
            Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim
            Schließen des Browsers aktivieren.
          </p>
        </section>

        {/* 5. Registrierung / Nutzerkonto */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            5. Registrierung und Nutzerkonto (Test-Phase)
          </h2>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.1 Beschreibung</h3>
          <p className="text-gray-700 mb-4">
            Auf unserer Test-Webseite besteht die Möglichkeit, sich zu Test-Zwecken zu registrieren.
            Folgende Daten werden hierbei erhoben:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
            <li>E-Mail-Adresse (für Test-Zwecke)</li>
            <li>Passwort (verschlüsselt gespeichert)</li>
            <li>Optionale Profil-Informationen (für Test-Zwecke)</li>
          </ul>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
            <p className="text-red-900 font-semibold">
              ⚠️ WICHTIG: Verwenden Sie KEINE echten persönlichen Daten!
            </p>
            <p className="text-red-800 text-sm mt-2">
              Verwenden Sie für Tests ausschließlich Dummy-Daten, Wegwerf-E-Mail-Adressen und
              niemals Ihr echtes Passwort!
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Datenlöschung</h3>
          <p className="text-gray-700">
            Alle Test-Accounts und zugehörige Daten können jederzeit ohne Vorankündigung gelöscht
            werden. Ein Anspruch auf Datenspeicherung besteht nicht.
          </p>
        </section>

        {/* 6. Hosting */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            6. Hosting und Datenverarbeitung
          </h2>
          <p className="text-gray-700 mb-4">
            Unsere Website wird bei Amazon Web Services (AWS) gehostet:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700">
              <strong>Amazon Web Services EMEA SARL</strong>
              <br />
              38 Avenue John F. Kennedy
              <br />
              L-1855 Luxembourg
              <br />
              Luxemburg
            </p>
          </div>
          <p className="text-gray-700 mt-4">
            Der Hosting-Anbieter verarbeitet Daten im Auftrag des Betreibers. Die Datenverarbeitung
            erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse). AWS ist
            nach EU-US Data Privacy Framework zertifiziert.
          </p>
          <p className="text-gray-700 mt-4">
            <strong>Serverstandort:</strong> Frankfurt am Main, Deutschland (eu-central-1)
          </p>
        </section>

        {/* 7. Betroffenenrechte */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            7. Rechte der betroffenen Person
          </h2>
          <p className="text-gray-700 mb-4">
            Werden personenbezogene Daten von Ihnen verarbeitet, sind Sie Betroffener i.S.d. DSGVO
            und es stehen Ihnen folgende Rechte gegenüber dem Verantwortlichen zu:
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            7.1 Auskunftsrecht (Art. 15 DSGVO)
          </h3>
          <p className="text-gray-700">
            Sie können von uns eine Bestätigung darüber verlangen, ob personenbezogene Daten, die
            Sie betreffen, von uns verarbeitet werden und welche Daten dies sind.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            7.2 Recht auf Berichtigung (Art. 16 DSGVO)
          </h3>
          <p className="text-gray-700">
            Sie haben ein Recht auf Berichtigung und/oder Vervollständigung, sofern die
            verarbeiteten personenbezogenen Daten, die Sie betreffen, unrichtig oder unvollständig
            sind.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            7.3 Recht auf Löschung (Art. 17 DSGVO)
          </h3>
          <p className="text-gray-700">
            Sie können die Löschung Ihrer personenbezogenen Daten verlangen, soweit die gesetzlichen
            Voraussetzungen hierfür vorliegen.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            7.4 Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
          </h3>
          <p className="text-gray-700">
            Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu
            verlangen.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            7.5 Recht auf Datenübertragbarkeit (Art. 20 DSGVO)
          </h3>
          <p className="text-gray-700">
            Sie haben das Recht, Ihre personenbezogenen Daten, die Sie uns bereitgestellt haben, in
            einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            7.6 Widerspruchsrecht (Art. 21 DSGVO)
          </h3>
          <p className="text-gray-700">
            Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben,
            jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten
            Widerspruch einzulegen.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            7.7 Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO)
          </h3>
          <p className="text-gray-700">
            Sie haben das Recht, Ihre datenschutzrechtliche Einwilligungserklärung jederzeit zu
            widerrufen.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
            7.8 Recht auf Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)
          </h3>
          <p className="text-gray-700 mb-4">
            Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Zuständig ist die
            Aufsichtsbehörde Ihres üblichen Aufenthaltsortes, Ihres Arbeitsplatzes oder unseres
            Unternehmenssitzes.
          </p>
        </section>

        {/* 8. Änderungen */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            8. Aktualität und Änderung dieser Datenschutzerklärung
          </h2>
          <p className="text-gray-700">
            Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Oktober 2025. Durch die
            Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher bzw.
            behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern.
          </p>
          <p className="text-gray-700 mt-4">
            <strong>Stand:</strong> 27. Oktober 2025
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
          <Link href="/disclaimer" className="hover:text-gray-900">
            Hinweise
          </Link>
        </div>
      </div>
    </div>
  );
}
