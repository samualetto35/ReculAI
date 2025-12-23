'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { 
  Video, 
  Plus, 
  Search, 
  MoreVertical,
  Users,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { interviewsApi } from '@/lib/api';
import { cn, getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';
import { useState } from 'react';

export default function InterviewsPage() {
  const [search, setSearch] = useState('');

  const { data: interviews, isLoading } = useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      const { data } = await interviewsApi.list();
      return data;
    },
  });

  const filteredInterviews = interviews?.filter((interview: any) =>
    interview.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Mülakatlar</h1>
          <p className="text-surface-600">
            Tüm video mülakatlarınızı yönetin.
          </p>
        </div>
        <Link href="/dashboard/interviews/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Yeni Mülakat
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12"
            placeholder="Mülakat ara..."
          />
        </div>
      </div>

      {/* Interview Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-surface-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-surface-200 rounded w-1/2 mb-6" />
              <div className="h-10 bg-surface-200 rounded" />
            </div>
          ))}
        </div>
      ) : filteredInterviews && filteredInterviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map((interview: any) => (
            <Link
              key={interview.id}
              href={`/dashboard/interviews/${interview.id}`}
              className="card p-6 hover:border-brand-500/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center">
                  <Video className="w-6 h-6 text-brand-400" />
                </div>
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
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-400 transition-colors">
                {interview.title}
              </h3>
              
              {interview.description && (
                <p className="text-sm text-surface-600 mb-4 line-clamp-2">
                  {interview.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-surface-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{interview._count?.candidates || 0} aday</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(interview.createdAt)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-surface-200 flex items-center justify-between">
                <span className="text-sm text-surface-600">
                  {interview._count?.questions || 0} soru
                </span>
                <span className="text-brand-400 flex items-center gap-1 text-sm">
                  Detaylar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-200 flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-surface-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {search ? 'Mülakat bulunamadı' : 'Henüz mülakat yok'}
          </h3>
          <p className="text-surface-600 mb-6">
            {search 
              ? 'Farklı bir arama terimi deneyin.'
              : 'İlk mülakatınızı oluşturarak başlayın.'}
          </p>
          {!search && (
            <Link href="/dashboard/interviews/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              Yeni Mülakat Oluştur
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

