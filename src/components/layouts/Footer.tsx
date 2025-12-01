import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const footerLinks = {
  plattform: [
    { name: 'Für Freelancer', href: '#freelancer' },
    { name: 'Für Unternehmen', href: '#unternehmen' },
    { name: 'Features', href: '#features' },
    { name: 'Preise', href: '#preise' },
  ],
  ressourcen: [
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Hilfe-Center', href: '/hilfe' },
    { name: 'Kontakt', href: '/kontakt' },
  ],
  rechtliches: [
    { name: 'Impressum', href: '/impressum' },
    { name: 'Datenschutz', href: '/datenschutz' },
    { name: 'AGB', href: '/agb' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">
                AI<span className="text-blue-400">Match</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm max-w-xs mb-6">
              Die fairste und intelligenteste Plattform für KI-Talente in Deutschland. Nur 2%
              Provision.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                DSGVO-konform
              </span>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                Made in Germany
              </span>
            </div>
          </div>

          {/* Links: Plattform */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Plattform</h3>
            <ul className="space-y-3">
              {footerLinks.plattform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Ressourcen */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Ressourcen</h3>
            <ul className="space-y-3">
              {footerLinks.ressourcen.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Rechtliches */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Rechtliches</h3>
            <ul className="space-y-3">
              {footerLinks.rechtliches.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            &copy; {currentYear} AIMatch. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-slate-500">Mit Liebe gebaut in Frankfurt am Main</p>
        </div>
      </div>
    </footer>
  );
}
