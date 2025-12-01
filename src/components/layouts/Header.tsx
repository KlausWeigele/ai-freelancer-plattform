'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Für Freelancer', href: '#freelancer' },
  { name: 'Für Unternehmen', href: '#unternehmen' },
  { name: 'Features', href: '#features' },
  { name: 'Preise', href: '#preise' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-100">
      <nav className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl text-neutral-900">
              AI<span className="text-cyan-500">Match</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Anmelden</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Kostenlos starten</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Menü öffnen</span>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-2 pt-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-neutral-200">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login">Anmelden</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/register">Kostenlos starten</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
