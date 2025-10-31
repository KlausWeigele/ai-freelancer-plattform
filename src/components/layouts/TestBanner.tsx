/**
 * Test/Demo Website Banner
 *
 * Displays a prominent warning banner indicating this is a test/demo website.
 * Only shown when NEXT_PUBLIC_ENVIRONMENT is set to "staging" or "test".
 *
 * Purpose: Legal protection and user clarity
 * Date: 2025-10-27
 */

import Link from 'next/link';

export default function TestBanner() {
  // Only show in staging/test environments
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT;

  if (environment !== 'staging' && environment !== 'test') {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Warning Message */}
          <div className="flex items-center gap-3">
            {/* Warning Icon */}
            <svg
              className="h-6 w-6 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>

            {/* Text */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-bold text-lg">
                ⚠️ Dies ist eine Test-/Demowebseite
              </span>
              <span className="text-sm text-white/90">
                Nicht für den produktiven Einsatz bestimmt.
              </span>
            </div>
          </div>

          {/* Links to Legal Pages */}
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/disclaimer"
              className="hover:underline underline-offset-2 transition-all hover:text-amber-100"
            >
              Hinweise
            </Link>
            <Link
              href="/impressum"
              className="hover:underline underline-offset-2 transition-all hover:text-amber-100"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="hover:underline underline-offset-2 transition-all hover:text-amber-100"
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
