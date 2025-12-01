'use client';

import {
  TrendingUp,
  Briefcase,
  MessageSquare,
  Star,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Users,
  Euro,
  Calendar,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Stats Cards Data
type ChangeType = 'positive' | 'negative' | 'neutral';

const stats: Array<{
  title: string;
  value: string;
  change: string;
  changeType: ChangeType;
  icon: typeof Eye;
  description: string;
}> = [
  {
    title: 'Profil-Aufrufe',
    value: '1.248',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Eye,
    description: 'vs. letzten Monat',
  },
  {
    title: 'Aktive Bewerbungen',
    value: '8',
    change: '+3',
    changeType: 'positive' as const,
    icon: Briefcase,
    description: 'Diese Woche',
  },
  {
    title: 'Nachrichten',
    value: '24',
    change: '5 ungelesen',
    changeType: 'neutral' as const,
    icon: MessageSquare,
    description: 'Neue Anfragen',
  },
  {
    title: 'Bewertung',
    value: '4.9',
    change: '+0.2',
    changeType: 'positive' as const,
    icon: Star,
    description: 'aus 47 Reviews',
  },
];

// Recent Projects
const recentProjects = [
  {
    id: 1,
    title: 'KI-Chatbot für Kundenservice',
    company: 'TechCorp GmbH',
    budget: '15.000 - 25.000 €',
    deadline: '15. Jan 2025',
    skills: ['Python', 'LangChain', 'GPT-4'],
    status: 'Neu',
    statusColor: 'success',
    match: 95,
  },
  {
    id: 2,
    title: 'Computer Vision Pipeline',
    company: 'AutoMotiv AG',
    budget: '30.000 - 45.000 €',
    deadline: '28. Feb 2025',
    skills: ['PyTorch', 'OpenCV', 'YOLO'],
    status: 'Interview',
    statusColor: 'warning',
    match: 88,
  },
  {
    id: 3,
    title: 'NLP-Analyse Dashboard',
    company: 'DataInsights',
    budget: '8.000 - 12.000 €',
    deadline: '10. Jan 2025',
    skills: ['spaCy', 'React', 'FastAPI'],
    status: 'Beworben',
    statusColor: 'default',
    match: 82,
  },
];

// Activity Feed
const activities = [
  {
    id: 1,
    type: 'message',
    title: 'Neue Nachricht von TechCorp GmbH',
    description: 'Wir möchten Sie gerne zu einem Interview einladen...',
    time: 'vor 2 Stunden',
    icon: MessageSquare,
  },
  {
    id: 2,
    type: 'view',
    title: 'Profil angesehen: AutoMotiv AG',
    description: 'HR Manager hat Ihr Profil besucht',
    time: 'vor 5 Stunden',
    icon: Eye,
  },
  {
    id: 3,
    type: 'match',
    title: 'Neues Projekt-Match: 95%',
    description: 'KI-Chatbot für Kundenservice passt zu Ihrem Profil',
    time: 'vor 1 Tag',
    icon: TrendingUp,
  },
  {
    id: 4,
    type: 'review',
    title: 'Neue Bewertung erhalten',
    description: '⭐⭐⭐⭐⭐ Exzellente Zusammenarbeit!',
    time: 'vor 2 Tagen',
    icon: Star,
  },
];

// Upcoming Events
const upcomingEvents = [
  {
    id: 1,
    title: 'Interview: TechCorp GmbH',
    date: 'Morgen, 14:00',
    type: 'interview',
  },
  {
    id: 2,
    title: 'Projekt-Deadline: DataInsights',
    date: '15. Jan 2025',
    type: 'deadline',
  },
  {
    id: 3,
    title: 'Vertragsbeginn: AutoMotiv AG',
    date: '01. Feb 2025',
    type: 'contract',
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader title="Dashboard" subtitle="Willkommen zurück, Max!" />

      <main className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.changeType === 'positive' && (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      )}
                      {stat.changeType === 'negative' && (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={cn(
                          'text-sm font-medium',
                          stat.changeType === 'positive' && 'text-green-500',
                          stat.changeType === 'negative' && 'text-red-500',
                          stat.changeType === 'neutral' && 'text-slate-500'
                        )}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">{stat.description}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Empfohlene Projekte</CardTitle>
                <Button variant="ghost" size="sm">
                  Alle anzeigen
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">{project.title}</h3>
                        <p className="text-sm text-slate-500">{project.company}</p>
                      </div>
                      <Badge
                        variant={
                          project.statusColor === 'success'
                            ? 'success'
                            : project.statusColor === 'warning'
                              ? 'warning'
                              : 'secondary'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-xs bg-white rounded-md text-slate-600 border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Euro className="h-4 w-4" />
                          {project.budget}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="h-4 w-4" />
                          {project.deadline}
                        </span>
                      </div>
                      <span className="font-semibold text-blue-600">{project.match}% Match</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Anstehende Termine
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full',
                        event.type === 'interview' && 'bg-blue-500',
                        event.type === 'deadline' && 'bg-orange-500',
                        event.type === 'contract' && 'bg-green-500'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{event.title}</p>
                      <p className="text-xs text-slate-500">{event.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle>Aktivitäten</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <activity.icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-500 truncate">{activity.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="text-white"
            style={{ background: 'linear-gradient(to bottom right, #2563eb, #1d4ed8)' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Gesamtverdienst</p>
                  <p className="text-3xl font-bold mt-1">47.500 €</p>
                  <p className="text-blue-200 text-sm mt-1">Dieses Jahr</p>
                </div>
                <Euro className="h-12 w-12 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="text-white"
            style={{ background: 'linear-gradient(to bottom right, #16a34a, #15803d)' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Abgeschlossene Projekte</p>
                  <p className="text-3xl font-bold mt-1">12</p>
                  <p className="text-green-200 text-sm mt-1">100% Erfolgsrate</p>
                </div>
                <Briefcase className="h-12 w-12 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="text-white"
            style={{ background: 'linear-gradient(to bottom right, #9333ea, #7e22ce)' }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Netzwerk</p>
                  <p className="text-3xl font-bold mt-1">234</p>
                  <p className="text-purple-200 text-sm mt-1">Kontakte & Unternehmen</p>
                </div>
                <Users className="h-12 w-12 text-purple-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
