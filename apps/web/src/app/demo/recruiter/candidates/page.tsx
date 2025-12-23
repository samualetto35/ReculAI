'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Filter,
  ArrowRight,
  Brain,
  Video,
  Star,
  Mail
} from 'lucide-react';
import { cn, getStatusColor, getStatusLabel, formatDate, getScoreColor, getScoreBgColor } from '@/lib/utils';

const demoCandidates = [
  { id: 'c1', name: 'Ahmet Yılmaz', email: 'ahmet@email.com', interview: 'Senior Frontend Developer', status: 'COMPLETED', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 92, summary: 'Mükemmel teknik bilgi, güçlü iletişim becerileri.' } },
  { id: 'c2', name: 'Elif Kaya', email: 'elif@email.com', interview: 'Senior Frontend Developer', status: 'COMPLETED', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 88, summary: 'Deneyimli, problem çözme odaklı yaklaşım.' } },
  { id: 'c3', name: 'Deniz Çelik', email: 'deniz@email.com', interview: 'Product Manager', status: 'COMPLETED', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 94, summary: 'Harika stratejik düşünce ve liderlik.' } },
  { id: 'c4', name: 'Mehmet Demir', email: 'mehmet@email.com', interview: 'Senior Frontend Developer', status: 'COMPLETED', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 76, summary: 'İyi potansiyel, teknik konularda gelişime açık.' } },
  { id: 'c5', name: 'Berk Şahin', email: 'berk@email.com', interview: 'Product Manager', status: 'COMPLETED', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 82, summary: 'İyi analitik beceriler, iletişim güçlü.' } },
  { id: 'c6', name: 'Selin Yıldız', email: 'selin@email.com', interview: 'Senior Frontend Developer', status: 'COMPLETED', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 85, summary: 'Solid teknik beceriler, iyi sunum.' } },
  { id: 'c7', name: 'Zeynep Aksoy', email: 'zeynep@email.com', interview: 'Senior Frontend Developer', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), evaluation: null },
  { id: 'c8', name: 'Can Öztürk', email: 'can@email.com', interview: 'DevOps Engineer', status: 'INVITED', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), evaluation: null },
  { id: 'c9', name: 'Ayşe Koç', email: 'ayse@email.com', interview: 'DevOps Engineer', status: 'COMPLETED', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 79, summary: 'Kubernetes ve CI/CD konusunda deneyimli.' } },
  { id: 'c10', name: 'Emre Özkan', email: 'emre@email.com', interview: 'Data Scientist', status: 'COMPLETED', createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 91, summary: 'ML/AI konusunda derin bilgi, araştırma odaklı.' } },
];

export default function DemoCandidatesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCandidates = demoCandidates.filter(candidate => {
    if (statusFilter !== 'all' && candidate.status !== statusFilter) return false;
    if (search && !candidate.name.toLowerCase().includes(search.toLowerCase()) && 
        !candidate.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const completedCandidates = demoCandidates.filter(c => c.status === 'COMPLETED');
  const avgScore = Math.round(completedCandidates.reduce((acc, c) => acc + (c.evaluation?.aiScore || 0), 0) / completedCandidates.length);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Adaylar</h1>
          <p className="text-surface-600">Tüm adayları görüntüleyin ve değerlendirin</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{demoCandidates.length}</p>
              <p className="text-sm text-surface-600">Toplam Aday</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedCandidates.length}</p>
              <p className="text-sm text-surface-600">Tamamlanan</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{avgScore}</p>
              <p className="text-sm text-surface-600">Ortalama AI Puan</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedCandidates.filter(c => (c.evaluation?.aiScore || 0) >= 85).length}</p>
              <p className="text-sm text-surface-600">Yüksek Puanlı</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Aday ara..."
            className="input pl-12"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'COMPLETED', 'IN_PROGRESS', 'INVITED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                statusFilter === status
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-surface-600 hover:bg-surface-100'
              )}
            >
              {status === 'all' ? 'Tümü' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-100/50">
              <th className="text-left p-4 text-sm font-medium text-surface-600">Aday</th>
              <th className="text-left p-4 text-sm font-medium text-surface-600">Mülakat</th>
              <th className="text-left p-4 text-sm font-medium text-surface-600">Durum</th>
              <th className="text-left p-4 text-sm font-medium text-surface-600">AI Puan</th>
              <th className="text-left p-4 text-sm font-medium text-surface-600">Tarih</th>
              <th className="text-left p-4 text-sm font-medium text-surface-600">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id} className="border-b border-surface-200 hover:bg-surface-100/50 transition-colors">
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
                  <span className="text-surface-700">{candidate.interview}</span>
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
                <td className="p-4 text-surface-600">
                  {formatDate(candidate.createdAt)}
                </td>
                <td className="p-4">
                  {candidate.status === 'COMPLETED' ? (
                    <Link
                      href={`/demo/recruiter/candidates/${candidate.id}`}
                      className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm font-medium"
                    >
                      Detaylar
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : candidate.status === 'INVITED' ? (
                    <button className="text-sm text-surface-600 hover:text-white flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Hatırlat
                    </button>
                  ) : (
                    <span className="text-surface-600 text-sm">Devam ediyor...</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCandidates.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-surface-500 mx-auto mb-4" />
            <p className="text-surface-600">Aday bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}

