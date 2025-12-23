'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { 
  Video, 
  Users, 
  CheckCircle2, 
  TrendingUp,
  ArrowRight,
  Clock,
  Plus
} from 'lucide-react';
import { interviewsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { cn, getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const { data: stats } = useQuery({
    queryKey: ['statistics'],
    queryFn: async () => {
      const { data } = await interviewsApi.statistics();
      return data;
    },
  });

  const { data: interviews } = useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      const { data } = await interviewsApi.list();
      return data;
    },
  });

  const statCards = [
    {
      label: 'Toplam Mülakat',
      value: stats?.totalInterviews || 0,
      icon: Video,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Aktif Mülakat',
      value: stats?.activeInterviews || 0,
      icon: Clock,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Toplam Aday',
      value: stats?.totalCandidates || 0,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Tamamlanan',
      value: stats?.completedCandidates || 0,
      icon: CheckCircle2,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Hoş geldin, {user?.name?.split(' ')[0]} 👋
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
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm text-surface-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Interviews */}
      <div className="card">
        <div className="p-6 border-b border-surface-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Son Mülakatlar</h2>
          <Link
            href="/dashboard/interviews"
            className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            Tümünü Gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {interviews && interviews.length > 0 ? (
          <div className="divide-y divide-surface-200">
            {interviews.slice(0, 5).map((interview: any) => (
              <Link
                key={interview.id}
                href={`/dashboard/interviews/${interview.id}`}
                className="flex items-center justify-between p-6 hover:bg-surface-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-200 flex items-center justify-center">
                    <Video className="w-6 h-6 text-surface-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">{interview.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-surface-600">
                      <span>{interview._count?.candidates || 0} aday</span>
                      <span>•</span>
                      <span>{interview._count?.questions || 0} soru</span>
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
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-200 flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-surface-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Henüz mülakat yok
            </h3>
            <p className="text-surface-600 mb-6">
              İlk mülakatınızı oluşturarak başlayın.
            </p>
            <Link href="/dashboard/interviews/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              Yeni Mülakat Oluştur
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

