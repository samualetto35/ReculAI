'use client';

import Link from 'next/link';
import { 
  Video, 
  Users, 
  CheckCircle2, 
  TrendingUp,
  ArrowRight,
  Clock,
  Plus,
  Brain,
  Star
} from 'lucide-react';
import { cn, getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';

// Demo data
const demoStats = {
  totalInterviews: 12,
  activeInterviews: 4,
  totalCandidates: 87,
  completedCandidates: 64,
};

const demoInterviews = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    status: 'ACTIVE',
    _count: { candidates: 24, questions: 5 },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Product Manager',
    status: 'ACTIVE',
    _count: { candidates: 18, questions: 6 },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    status: 'ACTIVE',
    _count: { candidates: 12, questions: 4 },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'UX Designer',
    status: 'DRAFT',
    _count: { candidates: 0, questions: 5 },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Backend Developer',
    status: 'CLOSED',
    _count: { candidates: 33, questions: 5 },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function DemoRecruiterDashboard() {
  const statCards = [
    {
      label: 'Toplam Mülakat',
      value: demoStats.totalInterviews,
      icon: Video,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Aktif Mülakat',
      value: demoStats.activeInterviews,
      icon: Clock,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Toplam Aday',
      value: demoStats.totalCandidates,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Tamamlanan',
      value: demoStats.completedCandidates,
      icon: CheckCircle2,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 mb-2">
          Hoş geldin, Demo Kullanıcı 👋
        </h1>
        <p className="text-surface-600">
          İşte işe alım süreçlerinizin genel durumu.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="card p-6 hover:border-surface-300 transition-colors"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-surface-900 mb-1">{stat.value}</p>
            <p className="text-sm text-surface-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Interviews */}
      <div className="card">
        <div className="p-6 border-b border-surface-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900">Son Mülakatlar</h2>
          <Link
            href="/demo/recruiter/interviews"
            className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            Tümünü Gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="divide-y divide-surface-200">
          {demoInterviews.map((interview) => (
            <Link
              key={interview.id}
              href={`/demo/recruiter/interviews/${interview.id}`}
              className="flex items-center justify-between p-6 hover:bg-surface-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-200 flex items-center justify-center">
                  <Video className="w-6 h-6 text-surface-600" />
                </div>
                <div>
                    <h3 className="font-medium text-surface-900 mb-1">{interview.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-surface-600">
                    <span>{interview._count.candidates} aday</span>
                    <span>•</span>
                    <span>{interview._count.questions} soru</span>
                    <span>•</span>
                    <span>{formatDate(interview.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    'bg-surface-200 text-surface-700'
                  )}
                >
                  <span
                    className={cn('inline-block w-2 h-2 rounded-full mr-2', getStatusColor(interview.status))}
                  />
                  {getStatusLabel(interview.status)}
                </span>
                <ArrowRight className="w-4 h-4 text-surface-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <Link href="/demo/recruiter/interviews/new" className="card p-6 hover:border-brand-500/50 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
              <Plus className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <h3 className="font-medium text-surface-900 mb-1">Yeni Mülakat Oluştur</h3>
              <p className="text-sm text-surface-600">AI destekli sorularla hızlıca başlayın</p>
            </div>
          </div>
        </Link>

        <Link href="/demo/recruiter/candidates" className="card p-6 hover:border-purple-500/50 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-medium text-surface-900 mb-1">AI Değerlendirmeleri</h3>
              <p className="text-sm text-surface-600">Tamamlanan mülakatları inceleyin</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

