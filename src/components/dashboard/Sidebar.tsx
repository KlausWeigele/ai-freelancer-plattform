'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  User,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Profil',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    title: 'Projekte',
    href: '/dashboard/projects',
    icon: Briefcase,
    badge: 3,
  },
  {
    title: 'Nachrichten',
    href: '/dashboard/messages',
    icon: MessageSquare,
    badge: 5,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    title: 'Benachrichtigungen',
    href: '/dashboard/notifications',
    icon: Bell,
    badge: 2,
  },
  {
    title: 'Hilfe',
    href: '/dashboard/help',
    icon: HelpCircle,
  },
  {
    title: 'Einstellungen',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-xl text-slate-900">
              AI<span className="text-blue-600">Match</span>
            </span>
          )}
        </Link>
        <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-2">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Suchen..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className={cn('mb-2', !collapsed && 'px-3')}>
          {!collapsed && (
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Hauptmenü
            </span>
          )}
        </div>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                collapsed && 'justify-center'
              )}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0')} />
              {!collapsed && (
                <>
                  <span className="flex-1 font-medium">{item.title}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </Link>
          );
        })}

        <div className={cn('mt-6 mb-2', !collapsed && 'px-3')}>
          {!collapsed && (
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Weitere
            </span>
          )}
        </div>
        {secondaryNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                collapsed && 'justify-center'
              )}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0')} />
              {!collapsed && (
                <>
                  <span className="flex-1 font-medium">{item.title}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-slate-200">
        {!collapsed ? (
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)' }}
            >
              MK
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Max Kellermann</p>
              <p className="text-xs text-slate-500 truncate">Freelancer</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)' }}
            >
              MK
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            'w-full text-slate-600 hover:text-red-600 hover:bg-red-50',
            collapsed && 'px-0'
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Abmelden</span>}
        </Button>
      </div>
    </aside>
  );
}
