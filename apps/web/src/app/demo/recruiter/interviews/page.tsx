'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Video, 
  Plus, 
  Search, 
  Filter,
  ArrowRight,
  Users,
  Clock
} from 'lucide-react';
import { cn, getStatusColor, getStatusLabel, formatDate } from '@/lib/utils';

const demoInterviews = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    description: 'React, TypeScript ve modern frontend teknolojileri konusunda deneyimli yazılımcı arıyoruz.',
    status: 'ACTIVE',
    candidateCount: 24,
    completedCount: 18,
    questionCount: 5,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Product Manager',
    description: 'Ürün yönetimi ve stratejisi konusunda tecrübeli, teknik altyapısı güçlü PM.',
    status: 'ACTIVE',
    candidateCount: 18,
    completedCount: 14,
    questionCount: 6,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    description: 'Kubernetes, AWS ve CI/CD pipeline konularında uzman DevOps mühendisi.',
    status: 'ACTIVE',
    candidateCount: 12,
    completedCount: 9,
    questionCount: 4,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'UX Designer',
    description: 'Kullanıcı deneyimi tasarımı ve araştırması konusunda deneyimli tasarımcı.',
    status: 'DRAFT',
    candidateCount: 0,
    completedCount: 0,
    questionCount: 5,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: null,
  },
  {
    id: '5',
    title: 'Backend Developer',
    description: 'Node.js, Python ve veritabanı teknolojilerinde uzman backend geliştirici.',
    status: 'CLOSED',
    candidateCount: 33,
    completedCount: 33,
    questionCount: 5,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    title: 'Data Scientist',
    description: 'Makine öğrenmesi ve veri analizi konusunda deneyimli bilim insanı.',
    status: 'ACTIVE',
    candidateCount: 15,
    completedCount: 8,
    questionCount: 5,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function DemoInterviewsPage() {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredInterviews = demoInterviews.filter(interview => {
    if (filter !== 'all' && interview.status !== filter) return false;
    if (search && !interview.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Mülakatlar</h1>
          <p className="text-surface-600">Tüm mülakatlarınızı yönetin</p>
        </div>
        <Link href="/demo/recruiter/interviews/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Yeni Mülakat
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mülakat ara..."
            className="input pl-12"
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'ACTIVE', 'DRAFT', 'CLOSED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === status
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-surface-600 hover:bg-surface-100'
              )}
            >
              {status === 'all' ? 'Tümü' : getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Interviews Grid */}
      <div className="grid gap-4">
        {filteredInterviews.map((interview) => (
          <Link
            key={interview.id}
            href={`/demo/recruiter/interviews/${interview.id}`}
            className="card p-6 hover:border-brand-500/50 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-surface-200 flex items-center justify-center group-hover:bg-surface-300 transition-colors">
                  <Video className="w-7 h-7 text-surface-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{interview.title}</h3>
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
                  <p className="text-surface-600 mb-4 max-w-2xl">{interview.description}</p>
                  <div className="flex items-center gap-6 text-sm text-surface-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{interview.candidateCount} aday</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{interview.completedCount} tamamlandı</span>
                    </div>
                    <div>
                      <span>{interview.questionCount} soru</span>
                    </div>
                    <div>
                      <span>{formatDate(interview.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-surface-500 group-hover:text-brand-400 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {filteredInterviews.length === 0 && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-200 flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-surface-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            Mülakat bulunamadı
          </h3>
          <p className="text-surface-600 mb-6">
            Arama kriterlerinize uygun mülakat yok.
          </p>
        </div>
      )}
    </div>
  );
}

