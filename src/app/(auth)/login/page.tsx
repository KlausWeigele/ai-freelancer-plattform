'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Sparkles, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement login logic with NextAuth
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-slate-900">
              AI<span className="text-blue-600">Match</span>
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Willkommen zurück</h1>
            <p className="text-slate-600">Melde dich an, um auf dein Dashboard zuzugreifen.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@beispiel.de"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Passwort</Label>
                <Link href="/reset-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Passwort vergessen?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                'Wird angemeldet...'
              ) : (
                <>
                  Anmelden
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Register Link */}
          <p className="mt-8 text-center text-slate-600">
            Noch kein Konto?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Jetzt registrieren
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12"
        style={{ background: 'linear-gradient(to bottom right, #2563eb, #1e40af)' }}
      >
        <div className="max-w-md text-white text-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Die fairste Plattform für KI-Talente</h2>
          <p className="text-blue-100 text-lg">
            Nur 2% Provision. AI-gestütztes Matching. Kuratierte Top 10% Qualität.
          </p>
          <div className="mt-8 flex justify-center gap-8">
            <div>
              <div className="text-3xl font-bold">2%</div>
              <div className="text-sm text-blue-200">Provision</div>
            </div>
            <div>
              <div className="text-3xl font-bold">48h</div>
              <div className="text-sm text-blue-200">Time-to-Match</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Top 10%</div>
              <div className="text-sm text-blue-200">Qualität</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
