import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import TestBanner from '@/components/layouts/TestBanner';

const inter = Inter({ subsets: ['latin'] });

// Dynamic metadata based on environment
const isStaging =
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging' ||
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'test';

export const metadata: Metadata = {
  title: isStaging
    ? 'AI-Freelancer-Plattform Deutschland (TEST)'
    : 'AI-Freelancer-Plattform Deutschland',
  description: 'Die fairste und intelligenteste Plattform für KI-Talente in Deutschland',
  // Prevent search engine indexing for staging/test environments
  ...(isStaging && {
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {/* Test/Staging Banner - only shown in staging/test environments */}
        <TestBanner />

        {children}
      </body>
    </html>
  );
}
