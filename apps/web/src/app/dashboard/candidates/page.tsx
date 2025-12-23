'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Brain,
  Calendar,
  ArrowRight,
  Filter
} from 'lucide-react';
import { interviewsApi } from '@/lib/api';
import { cn, getStatusColor, getStatusLabel, formatDate, getScoreColor, getScoreBgColor } from '@/lib/utils';
import { useState } from 'react';

export default function CandidatesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: interviews, isLoading } = useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      const { data } = await interviewsApi.list();
      return data;
    },
  });

  // Flatten all candidates from all interviews
  const allCandidates = interviews?.flatMap((interview: any) =>
    (interview.candidates || []).map((candidate: any) => ({
      ...candidate,
      interviewTitle: interview.title,
      interviewId: interview.id,
    }))
  ) || [];

  const filteredCandidates = allCandidates.filter((candidate: any) => {
    const matchesSearch = 
      candidate.name.toLowerCase().includes(search.toLowerCase()) ||
      candidate.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Adaylar</h1>
        <p className="text-surface-600">
          Tüm mülakatlardan adayları görüntüleyin ve yönetin.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12"
            placeholder="Aday ara..."
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input pl-10 pr-8 appearance-none cursor-pointer"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="INVITED">Davet Edildi</option>
            <option value="STARTED">Başladı</option>
            <option value="IN_PROGRESS">Devam Ediyor</option>
            <option value="COMPLETED">Tamamlandı</option>
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      {isLoading ? (
        <div className="card animate-pulse">
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-surface-200 rounded" />
            ))}
          </div>
        </div>
      ) : filteredCandidates.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-100">
                <th className="text-left p-4 text-sm font-medium text-surface-600">Aday</th>
                <th className="text-left p-4 text-sm font-medium text-surface-600">Mülakat</th>
                <th className="text-left p-4 text-sm font-medium text-surface-600">Durum</th>
                <th className="text-left p-4 text-sm font-medium text-surface-600">AI Puan</th>
                <th className="text-left p-4 text-sm font-medium text-surface-600">Karar</th>
                <th className="text-left p-4 text-sm font-medium text-surface-600">Tarih</th>
                <th className="text-left p-4 text-sm font-medium text-surface-600"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate: any) => (
                <tr key={candidate.id} className="border-b border-surface-200 hover:bg-surface-100">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
                        <span className="text-brand-400 font-medium">
                          {candidate.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{candidate.name}</p>
                        <p className="text-sm text-surface-600">{candidate.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Link 
                      href={`/dashboard/interviews/${candidate.interviewId}`}
                      className="text-surface-700 hover:text-brand-400 transition-colors"
                    >
                      {candidate.interviewTitle}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium',
                        'bg-surface-200 text-surface-700'
                      )}
                    >
                      <span
                        className={cn('inline-block w-2 h-2 rounded-full mr-2', getStatusColor(candidate.status))}
                      />
                      {getStatusLabel(candidate.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    {candidate.evaluation?.aiScore ? (
                      <div className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-lg border', getScoreBgColor(candidate.evaluation.aiScore))}>
                        <Brain className="w-4 h-4" />
                        <span className={cn('font-bold', getScoreColor(candidate.evaluation.aiScore))}>
                          {Math.round(candidate.evaluation.aiScore)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-surface-600">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    {candidate.evaluation?.decision ? (
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          candidate.evaluation.decision === 'SHORTLISTED' && 'bg-green-500/10 text-green-400',
                          candidate.evaluation.decision === 'REJECTED' && 'bg-red-500/10 text-red-400',
                          candidate.evaluation.decision === 'HIRED' && 'bg-brand-500/10 text-brand-400',
                          candidate.evaluation.decision === 'PENDING' && 'bg-surface-200 text-surface-600'
                        )}
                      >
                        {getStatusLabel(candidate.evaluation.decision)}
                      </span>
                    ) : (
                      <span className="text-surface-600">-</span>
                    )}
                  </td>
                  <td className="p-4 text-surface-600">
                    {formatDate(candidate.createdAt)}
                  </td>
                  <td className="p-4">
                    {candidate.status === 'COMPLETED' && (
                      <Link
                        href={`/dashboard/candidates/${candidate.id}`}
                        className="p-2 text-surface-600 hover:text-brand-400 transition-colors inline-flex items-center gap-1"
                      >
                        Detay
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-200 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-surface-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {search || statusFilter !== 'all' ? 'Aday bulunamadı' : 'Henüz aday yok'}
          </h3>
          <p className="text-surface-600">
            {search || statusFilter !== 'all' 
              ? 'Filtrelerinizi değiştirmeyi deneyin.'
              : 'Mülakatlarınıza aday davet ettiğinizde burada görünecekler.'}
          </p>
        </div>
      )}
    </div>
  );
}

