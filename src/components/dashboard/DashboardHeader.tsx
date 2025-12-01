'use client';

import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function DashboardHeader({ title, subtitle, onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Menu & Title */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Projekte suchen..."
              className="w-64 pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {/* User Avatar (Mobile) */}
          <div
            className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)' }}
          >
            MK
          </div>
        </div>
      </div>
    </header>
  );
}
