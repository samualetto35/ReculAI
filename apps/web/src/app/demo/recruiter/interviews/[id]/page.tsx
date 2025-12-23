'use client';

import { useState } from 'react';
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
  Star,
  Clock,
  Video,
  Brain,
  Eye
} from 'lucide-react';
import { cn, getStatusColor, getStatusLabel, formatDate, getScoreColor, getScoreBgColor } from '@/lib/utils';

// Demo interview data
const demoInterviewsData: Record<string, any> = {
  '1': {
    id: '1',
    title: 'Senior Frontend Developer',
    description: 'React, TypeScript ve modern frontend teknolojileri konusunda deneyimli yazılımcı arıyoruz.',
    status: 'ACTIVE',
    questions: [
      { id: 'q1', text: 'Kendinizi kısaca tanıtır mısınız?', thinkingTime: 30, answerTime: 120, retakes: 1 },
      { id: 'q2', text: 'En zorlu teknik problemi nasıl çözdünüz?', thinkingTime: 45, answerTime: 180, retakes: 1 },
      { id: 'q3', text: 'React performans optimizasyonu hakkında neler biliyorsunuz?', thinkingTime: 30, answerTime: 150, retakes: 0 },
      { id: 'q4', text: 'Takım çalışması deneyimlerinizi paylaşır mısınız?', thinkingTime: 30, answerTime: 120, retakes: 1 },
      { id: 'q5', text: 'Gelecek 5 yılda kendinizi nerede görüyorsunuz?', thinkingTime: 30, answerTime: 120, retakes: 0 },
    ],
    candidates: [
      { id: 'c1', name: 'Ahmet Yılmaz', email: 'ahmet@email.com', status: 'COMPLETED', accessToken: 'demo1', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 92, summary: 'Mükemmel teknik bilgi, güçlü iletişim.' } },
      { id: 'c2', name: 'Elif Kaya', email: 'elif@email.com', status: 'COMPLETED', accessToken: 'demo2', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 88, summary: 'Deneyimli, problem çözme odaklı.' } },
      { id: 'c3', name: 'Mehmet Demir', email: 'mehmet@email.com', status: 'COMPLETED', accessToken: 'demo3', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 76, summary: 'İyi potansiyel, gelişime açık.' } },
      { id: 'c4', name: 'Zeynep Aksoy', email: 'zeynep@email.com', status: 'IN_PROGRESS', accessToken: 'demo4', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), evaluation: null },
      { id: 'c5', name: 'Can Öztürk', email: 'can@email.com', status: 'INVITED', accessToken: 'demo5', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), evaluation: null },
      { id: 'c6', name: 'Selin Yıldız', email: 'selin@email.com', status: 'COMPLETED', accessToken: 'demo6', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 85, summary: 'Solid teknik beceriler, iyi sunum.' } },
    ],
  },
  '2': {
    id: '2',
    title: 'Product Manager',
    description: 'Ürün yönetimi ve stratejisi konusunda tecrübeli PM.',
    status: 'ACTIVE',
    questions: [
      { id: 'q1', text: 'Ürün yönetimi deneyiminizi anlatır mısınız?', thinkingTime: 30, answerTime: 150, retakes: 1 },
      { id: 'q2', text: 'Bir ürün lansmanı sürecini nasıl yönetirsiniz?', thinkingTime: 45, answerTime: 180, retakes: 1 },
      { id: 'q3', text: 'Stakeholder yönetimi hakkında deneyimleriniz neler?', thinkingTime: 30, answerTime: 150, retakes: 0 },
    ],
    candidates: [
      { id: 'c1', name: 'Deniz Çelik', email: 'deniz@email.com', status: 'COMPLETED', accessToken: 'demo1', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 94, summary: 'Harika stratejik düşünce.' } },
      { id: 'c2', name: 'Berk Şahin', email: 'berk@email.com', status: 'COMPLETED', accessToken: 'demo2', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), evaluation: { aiScore: 82, summary: 'İyi analitik beceriler.' } },
    ],
  },
};

// Default interview for unknown IDs
const defaultInterview = demoInterviewsData['1'];

export default function DemoInterviewDetailPage() {
  const { id } = useParams();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const interview = demoInterviewsData[id as string] || defaultInterview;

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/demo/candidate`;
    navigator.clipboard.writeText(link);
    setCopiedLink(token);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const stats = [
    { label: 'Toplam Aday', value: interview.candidates.length, icon: Users },
    { label: 'Tamamlanan', value: interview.candidates.filter((c: any) => c.status === 'COMPLETED').length, icon: Check },
    { label: 'Bekleyen', value: interview.candidates.filter((c: any) => c.status === 'INVITED').length, icon: Clock },
    { label: 'Ortalama Puan', value: Math.round(interview.candidates.filter((c: any) => c.evaluation?.aiScore).reduce((acc: number, c: any) => acc + c.evaluation.aiScore, 0) / (interview.candidates.filter((c: any) => c.evaluation?.aiScore).length || 1)) || 0, icon: Star },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/demo/recruiter/interviews"
          className="inline-flex items-center gap-2 text-surface-600 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Mülakatlar
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{interview.title}</h1>
            <div className="flex items-center gap-4 text-surface-600">
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
              <span>{interview.questions.length} soru</span>
              <span>{interview.candidates.length} aday</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {interview.status === 'DRAFT' && (
              <button className="btn-primary">
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
        {stats.map((stat, index) => (
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
                          href={`/demo/recruiter/candidates/${candidate.id}`}
                          className="p-2 text-surface-600 hover:text-white transition-colors"
                          title="Detayları Gör"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <DemoInviteModal onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}

function DemoInviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-white mb-6">Aday Davet Et</h2>

        {sent ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 mb-2">Demo: Davet gönderildi!</p>
              <p className="text-surface-600 text-sm">
                Gerçek uygulamada aday e-posta alacak ve mülakat linkine yönlendirilecek.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-primary flex-1">
                Tamam
              </button>
              <button onClick={() => { setSent(false); setEmail(''); setName(''); }} className="btn-secondary flex-1">
                Başka Ekle
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <button type="submit" className="btn-primary flex-1">
                Davet Gönder
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

