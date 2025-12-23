'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Brain,
  Star,
  Clock,
  Video,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Mail,
  Phone,
  Calendar,
  FileText
} from 'lucide-react';
import { cn, getScoreColor, getScoreBgColor, formatDate, formatDuration } from '@/lib/utils';

// Demo candidate data
const demoCandidateData = {
  id: 'c1',
  name: 'Ahmet Yılmaz',
  email: 'ahmet@email.com',
  phone: '+90 555 123 4567',
  interview: {
    id: '1',
    title: 'Senior Frontend Developer',
  },
  status: 'COMPLETED',
  createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  completedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
  deviceInfo: {
    browser: 'Chrome 120',
    os: 'macOS Sonoma',
  },
  evaluation: {
    aiScore: 92,
    summary: 'Ahmet Yılmaz, güçlü teknik bilgi ve iletişim becerileriyle öne çıkan bir aday. React ekosisteminde derin deneyim, TypeScript konusunda uzmanlık gösteriyor. Takım çalışmasına yatkın, problem çözme yaklaşımı metodolojik ve sistematik.',
    strengths: [
      'React ve TypeScript konusunda ileri düzey bilgi',
      'Etkili iletişim ve sunum becerileri',
      'Problem çözme odaklı düşünce yapısı',
      'Takım çalışmasına yatkınlık',
    ],
    improvements: [
      'Backend teknolojileri konusunda deneyim artırılabilir',
      'Yöneticilik deneyimi sınırlı',
    ],
    recommendation: 'STRONGLY_RECOMMEND',
  },
  responses: [
    {
      id: 'r1',
      question: { id: 'q1', text: 'Kendinizi kısaca tanıtır mısınız?', thinkingTime: 30, answerTime: 120 },
      duration: 95,
      aiScore: 88,
      aiAnalysis: 'Net ve özlü bir tanıtım. Teknik geçmiş ve motivasyon iyi aktarılmış. STAR metoduna uygun yapılandırılmış.',
      videoUrl: '/demo-video.mp4',
      transcript: 'Merhaba, ben Ahmet Yılmaz. 6 yıldır yazılım geliştirme alanında çalışıyorum. Son 4 yılımı React ve TypeScript ile enterprise düzeyde uygulamalar geliştirerek geçirdim. Şu anda çalıştığım şirkette Senior Frontend Developer olarak çalışıyor, aynı zamanda 3 kişilik bir ekibe mentorluk yapıyorum...',
    },
    {
      id: 'r2',
      question: { id: 'q2', text: 'En zorlu teknik problemi nasıl çözdünüz?', thinkingTime: 45, answerTime: 180 },
      duration: 156,
      aiScore: 95,
      aiAnalysis: 'Mükemmel STAR formatında yanıt. Teknik derinlik, problem analizi ve çözüm süreci net bir şekilde açıklanmış. Sonuç odaklı yaklaşım sergilenmiş.',
      videoUrl: '/demo-video.mp4',
      transcript: 'Geçen yıl karşılaştığımız en büyük teknik problem, 10.000+ satırlık bir React uygulamasının performans sorunlarıydı. Sayfa yükleme süreleri 8 saniyenin üzerine çıkmıştı ve kullanıcı deneyimi ciddi şekilde etkilenmişti...',
    },
    {
      id: 'r3',
      question: { id: 'q3', text: 'React performans optimizasyonu hakkında neler biliyorsunuz?', thinkingTime: 30, answerTime: 150 },
      duration: 142,
      aiScore: 94,
      aiAnalysis: 'Derin teknik bilgi gösterilmiş. Memorization, virtualization, code splitting konularında pratik örnekler verilmiş.',
      videoUrl: '/demo-video.mp4',
      transcript: 'React performans optimizasyonu konusunda birçok strateji uyguluyorum. Öncelikle React.memo ve useMemo kullanarak gereksiz render\'ları önlüyorum. Büyük listeler için react-window veya react-virtualized kullanıyorum...',
    },
    {
      id: 'r4',
      question: { id: 'q4', text: 'Takım çalışması deneyimlerinizi paylaşır mısınız?', thinkingTime: 30, answerTime: 120 },
      duration: 108,
      aiScore: 90,
      aiAnalysis: 'İyi iletişim becerileri ve takım odaklı yaklaşım. Spesifik örnekler ve sonuçlar paylaşılmış.',
      videoUrl: '/demo-video.mp4',
      transcript: 'Takım çalışması benim için yazılım geliştirmenin en önemli parçalarından biri. Şu anki pozisyonumda 3 junior developer\'a mentorluk yapıyorum. Haftalık code review seansları ve pair programming oturumları düzenliyoruz...',
    },
    {
      id: 'r5',
      question: { id: 'q5', text: 'Gelecek 5 yılda kendinizi nerede görüyorsunuz?', thinkingTime: 30, answerTime: 120 },
      duration: 87,
      aiScore: 85,
      aiAnalysis: 'Kariyer vizyonu net ve gerçekçi. Şirketin büyüme hedefleriyle uyumlu.',
      videoUrl: '/demo-video.mp4',
      transcript: 'Önümüzdeki 5 yılda teknik liderlik rolüne geçmeyi hedefliyorum. Frontend mimarisi konusunda daha derin uzmanlık kazanmak ve büyük ekipleri yönetebilecek yetkinliğe ulaşmak istiyorum...',
    },
  ],
  behaviorAnalysis: {
    tabSwitches: 0,
    avgResponseTime: 'Normal',
    confidence: 'Yüksek',
  },
};

export default function DemoCandidateDetailPage() {
  const { id } = useParams();
  const [selectedResponse, setSelectedResponse] = useState(demoCandidateData.responses[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const candidate = demoCandidateData;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/demo/recruiter/candidates"
          className="inline-flex items-center gap-2 text-surface-600 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Adaylar
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/20 flex items-center justify-center">
              <span className="text-brand-400 font-bold text-2xl">
                {candidate.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{candidate.name}</h1>
              <p className="text-surface-600">{candidate.interview.title}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-surface-600">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {candidate.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(candidate.completedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-secondary">
              <ThumbsDown className="w-4 h-4" />
              Reddet
            </button>
            <button className="btn-primary">
              <ThumbsUp className="w-4 h-4" />
              Kısa Listeye Ekle
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Video & Responses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="card overflow-hidden">
            <div className="aspect-video bg-surface-100 relative group">
              {/* Demo video placeholder */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-100 to-surface-200">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-brand-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-500/30 transition-colors cursor-pointer">
                    <Play className="w-8 h-8 text-brand-400 ml-1" />
                  </div>
                  <p className="text-white font-medium">Demo: Video Yanıtı</p>
                  <p className="text-surface-600 text-sm mt-1">Süre: {formatDuration(selectedResponse.duration)}</p>
                </div>
              </div>

              {/* Question overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white font-medium">{selectedResponse.question.text}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-surface-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white hover:bg-brand-600 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <span className="text-surface-600 tabular-nums">
                    00:00 / {formatDuration(selectedResponse.duration)}
                  </span>
                </div>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className={cn(
                    'btn-ghost text-sm',
                    showTranscript && 'bg-surface-200'
                  )}
                >
                  <FileText className="w-4 h-4" />
                  Transkript
                </button>
              </div>

              {/* Transcript */}
              {showTranscript && (
                <div className="mt-4 p-4 bg-surface-100 rounded-lg">
                  <p className="text-surface-700 text-sm leading-relaxed">
                    {selectedResponse.transcript}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Response List */}
          <div className="card">
            <div className="p-4 border-b border-surface-200">
              <h3 className="font-semibold text-white">Tüm Yanıtlar</h3>
            </div>
            <div className="divide-y divide-surface-200">
              {candidate.responses.map((response, index) => (
                <button
                  key={response.id}
                  onClick={() => setSelectedResponse(response)}
                  className={cn(
                    'w-full p-4 text-left hover:bg-surface-100 transition-colors',
                    selectedResponse.id === response.id && 'bg-surface-100'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-surface-600">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white mb-1 line-clamp-1">
                        {response.question.text}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-surface-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDuration(response.duration)}
                        </span>
                        <div className={cn('flex items-center gap-1 px-2 py-0.5 rounded', getScoreBgColor(response.aiScore))}>
                          <Brain className="w-3.5 h-3.5" />
                          <span className={cn('font-medium', getScoreColor(response.aiScore))}>
                            {response.aiScore}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - AI Analysis */}
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white">AI Değerlendirmesi</h3>
              <div className={cn('flex items-center gap-2 px-4 py-2 rounded-xl', getScoreBgColor(candidate.evaluation.aiScore))}>
                <Brain className="w-5 h-5" />
                <span className={cn('text-2xl font-bold', getScoreColor(candidate.evaluation.aiScore))}>
                  {candidate.evaluation.aiScore}
                </span>
              </div>
            </div>

            <p className="text-surface-600 text-sm leading-relaxed mb-6">
              {candidate.evaluation.summary}
            </p>

            {/* Recommendation */}
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-6">
              <div className="flex items-center gap-2 text-green-400 font-medium mb-1">
                <CheckCircle2 className="w-5 h-5" />
                Şiddetle Önerilir
              </div>
              <p className="text-surface-600 text-sm">
                Bu aday, pozisyon gereksinimleriyle yüksek uyum göstermektedir.
              </p>
            </div>

            {/* Strengths */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Güçlü Yönler
              </h4>
              <ul className="space-y-2">
                {candidate.evaluation.strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Gelişim Alanları
              </h4>
              <ul className="space-y-2">
                {candidate.evaluation.improvements.map((improvement, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-surface-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Current Response Analysis */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4">Seçili Yanıt Analizi</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg', getScoreBgColor(selectedResponse.aiScore))}>
                <Brain className="w-4 h-4" />
                <span className={cn('font-bold', getScoreColor(selectedResponse.aiScore))}>
                  {selectedResponse.aiScore}
                </span>
              </div>
              <span className="text-surface-600 text-sm">puan</span>
            </div>
            <p className="text-surface-600 text-sm leading-relaxed">
              {selectedResponse.aiAnalysis}
            </p>
          </div>

          {/* Behavior Analysis */}
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4">Davranış Analizi</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-surface-600 text-sm">Sekme Değişikliği</span>
                <span className="text-white font-medium">{candidate.behaviorAnalysis.tabSwitches}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600 text-sm">Yanıt Hızı</span>
                <span className="text-white font-medium">{candidate.behaviorAnalysis.avgResponseTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-600 text-sm">Özgüven</span>
                <span className="text-green-400 font-medium">{candidate.behaviorAnalysis.confidence}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

