'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Building2,
  Briefcase,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type UserRole = 'freelancer' | 'company';

const roleOptions = [
  {
    id: 'freelancer' as const,
    title: 'Freelancer',
    description: 'Ich biete meine KI-Expertise an',
    icon: Briefcase,
    benefits: ['Nur 2% Provision', 'AI Career Coach', 'Hochwertige Projekte'],
  },
  {
    id: 'company' as const,
    title: 'Unternehmen',
    description: 'Ich suche KI-Experten',
    icon: Building2,
    benefits: ['48h Time-to-Match', 'Trial Period', 'Kuratierte Qualität'],
  },
];

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'freelancer';

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    setIsLoading(true);
    // TODO: Implement registration logic
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Konto erstellen</h1>
            <p className="text-slate-600">
              Starte kostenlos und finde die besten KI-Projekte oder Talente.
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <Label className="mb-3 block">Ich bin ein...</Label>
            <div className="grid grid-cols-2 gap-4">
              {roleOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedRole(option.id)}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all',
                    selectedRole === option.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        selectedRole === option.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      <option.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{option.title}</div>
                      <div className="text-xs text-slate-500">{option.description}</div>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {option.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2
                          className={cn(
                            'h-3 w-3',
                            selectedRole === option.id ? 'text-blue-600' : 'text-slate-400'
                          )}
                        />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {selectedRole === 'company' && (
              <div className="space-y-2">
                <Label htmlFor="companyName">Firmenname</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Meine Firma GmbH"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">
                {selectedRole === 'freelancer' ? 'Vollständiger Name' : 'Ansprechpartner'}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Max Mustermann"
                  className="pl-10"
                  required
                />
              </div>
            </div>

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
              <Label htmlFor="password">Passwort</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mindestens 8 Zeichen"
                  className="pl-10 pr-10"
                  minLength={8}
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
              <p className="text-xs text-slate-500">
                Mindestens 8 Zeichen, eine Zahl und ein Sonderzeichen
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                Ich akzeptiere die{' '}
                <Link href="/agb" className="text-blue-600 hover:underline">
                  AGB
                </Link>{' '}
                und{' '}
                <Link href="/datenschutz" className="text-blue-600 hover:underline">
                  Datenschutzerklärung
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || !agreedToTerms}
            >
              {isLoading ? (
                'Wird erstellt...'
              ) : (
                <>
                  Kostenlos registrieren
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-slate-600">
            Bereits ein Konto?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Jetzt anmelden
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
          <h2 className="text-3xl font-bold mb-4">
            {selectedRole === 'freelancer'
              ? 'Starte deine KI-Karriere'
              : 'Finde die besten KI-Experten'}
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            {selectedRole === 'freelancer'
              ? 'Verdiene fair mit nur 2% Provision. Entwickle dich mit unserem AI Career Coach weiter.'
              : 'Kuratierte Top 10% Talente. AI-gestütztes Matching. 1 Woche Trial Period.'}
          </p>
          <div className="grid grid-cols-3 gap-4">
            {selectedRole === 'freelancer' ? (
              <>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold">2%</div>
                  <div className="text-xs text-blue-200">Provision</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold">1.200€</div>
                  <div className="text-xs text-blue-200">Max. Tagessatz</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold">0€</div>
                  <div className="text-xs text-blue-200">Abo-Gebühren</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold">48h</div>
                  <div className="text-xs text-blue-200">Match-Zeit</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold">7 Tage</div>
                  <div className="text-xs text-blue-200">Trial Period</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold">Top 10%</div>
                  <div className="text-xs text-blue-200">Kuratiert</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Laden...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
