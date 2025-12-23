'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Users, 
  Play,
  Copy,
  Check,
  Plus,
  Mail,
  ExternalLink,
  MoreVertical,
  Star,
  Clock,
  Video,
  Brain,
  AlertTriangle
} from 'lucide-react';
import { interviewsApi, candidatesApi } from '@/lib/api';
import { cn, getStatusColor, getStatusLabel, formatDate, getScoreColor, getScoreBgColor } from '@/lib/utils';

export default function InterviewDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const { data: interview, isLoading } = useQuery({
    queryKey: ['interview', id],
    queryFn: async () => {
      const { data } = await interviewsApi.get(id as string);
      return data;
    },
  });

  const activateMutation = useMutation({
    mutationFn: () => interviewsApi.update(id as string, { status: 'ACTIVE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview', id] });
    },
  });

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/interview/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(token);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-200 rounded w-1/4" />
          <div className="h-4 bg-surface-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/interviews"
          className="inline-flex items-center gap-2 text-surface-600 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Mülakatlar
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{interview?.title}</h1>
            <div className="flex items-center gap-4 text-surface-600">
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  'bg-surface-200 text-surface-700'
                )}
              >
                <span
                  className={cn('inline-block w-2 h-2 rounded-full mr-2', getStatusColor(interview?.status))}
                />
                {getStatusLabel(interview?.status)}
              </span>
              <span>{interview?.questions?.length} soru</span>
              <span>{interview?.candidates?.length} aday</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {interview?.status === 'DRAFT' && (
              <button
                onClick={() => activateMutation.mutate()}
                className="btn-primary"
              >
                <Play className="w-4 h-4" />
                Yayınla
              </button>
            )}
            <button onClick={() => setShowInviteModal(true)} className="btn-secondary">
              <Plus className="w-4 h-4" />
              Aday Davet Et
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Toplam Aday', value: interview?.candidates?.length || 0, icon: Users },
          { label: 'Tamamlanan', value: interview?.candidates?.filter((c: any) => c.status === 'COMPLETED').length || 0, icon: Check },
          { label: 'Bekleyen', value: interview?.candidates?.filter((c: any) => c.status === 'INVITED').length || 0, icon: Clock },
          { label: 'Ortalama Puan', value: Math.round(interview?.candidates?.reduce((acc: number, c: any) => acc + (c.evaluation?.aiScore || 0), 0) / (interview?.candidates?.filter((c: any) => c.evaluation?.aiScore).length || 1)) || 0, icon: Star },
        ].map((stat, index) => (
          <div key={index} className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-surface-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Candidates Table */}
      <div className="card">
        <div className="p-6 border-b border-surface-200">
          <h2 className="text-lg font-semibold text-white">Adaylar</h2>
        </div>

        {interview?.candidates && interview.candidates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left p-4 text-sm font-medium text-surface-600">Aday</th>
                  <th className="text-left p-4 text-sm font-medium text-surface-600">Durum</th>
                  <th className="text-left p-4 text-sm font-medium text-surface-600">AI Puan</th>
                  <th className="text-left p-4 text-sm font-medium text-surface-600">Tarih</th>
                  <th className="text-left p-4 text-sm font-medium text-surface-600">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {interview.candidates.map((candidate: any) => (
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyLink(candidate.accessToken)}
                          className="p-2 text-surface-600 hover:text-white transition-colors"
                          title="Linki Kopyala"
                        >
                          {copiedLink === candidate.accessToken ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        {candidate.status === 'COMPLETED' && (
                          <Link
                            href={`/dashboard/candidates/${candidate.id}`}
                            className="p-2 text-surface-600 hover:text-white transition-colors"
                            title="Detayları Gör"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-200 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-surface-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Henüz aday yok
            </h3>
            <p className="text-surface-600 mb-6">
              Bu mülakata aday davet edin.
            </p>
            <button onClick={() => setShowInviteModal(true)} className="btn-primary">
              <Mail className="w-4 h-4" />
              Aday Davet Et
            </button>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          interviewId={id as string}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['interview', id] });
            setShowInviteModal(false);
          }}
        />
      )}
    </div>
  );
}

function InviteModal({
  interviewId,
  onClose,
  onSuccess,
}: {
  interviewId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ link?: string; error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await candidatesApi.invite(interviewId, { email, name });
      setResult({ link: data.interviewLink });
    } catch (error: any) {
      setResult({ error: error.response?.data?.message || 'Davet gönderilemedi' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-white mb-6">Aday Davet Et</h2>

        {result?.link ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 mb-2">Aday başarıyla davet edildi!</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={result.link}
                  readOnly
                  className="input flex-1 text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result.link!);
                  }}
                  className="btn-secondary"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={onSuccess} className="btn-primary flex-1">
                Tamam
              </button>
              <button
                onClick={() => {
                  setResult(null);
                  setEmail('');
                  setName('');
                }}
                className="btn-secondary flex-1"
              >
                Başka Ekle
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {result?.error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {result.error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Adayın adı soyadı"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="aday@email.com"
                required
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">
                İptal
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Gönderiliyor...' : 'Davet Gönder'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

