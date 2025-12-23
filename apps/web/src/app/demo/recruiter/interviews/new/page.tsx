'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Sparkles,
  Video,
  Clock,
  RotateCcw,
  GripVertical,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const suggestedQuestions = [
  'Kendinizi kısaca tanıtır mısınız?',
  'Bu pozisyona neden başvurdunuz?',
  'En büyük başarınızı anlatır mısınız?',
  'Zor bir durumla nasıl başa çıktınız?',
  'Gelecek 5 yılda kendinizi nerede görüyorsunuz?',
  'Takım çalışması konusunda deneyimleriniz neler?',
  'Teknik becerilerinizi nasıl güncel tutuyorsunuz?',
  'Bize sormak istediğiniz bir soru var mı?',
];

interface Question {
  id: string;
  text: string;
  thinkingTime: number;
  answerTime: number;
  retakes: number;
}

export default function DemoNewInterviewPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', text: '', thinkingTime: 30, answerTime: 120, retakes: 1 },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now().toString(), text: '', thinkingTime: 30, answerTime: 120, retakes: 1 },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: keyof Question, value: string | number) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const generateWithAI = async () => {
    if (!title) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedQuestions: Question[] = [
      { id: '1', text: 'Kendinizi kısaca tanıtır mısınız ve bu pozisyona neden ilgi duyduğunuzu açıklar mısınız?', thinkingTime: 30, answerTime: 120, retakes: 1 },
      { id: '2', text: `${title} pozisyonunda en zorlu bulacağınızı düşündüğünüz konu nedir ve bununla nasıl başa çıkarsınız?`, thinkingTime: 45, answerTime: 180, retakes: 1 },
      { id: '3', text: 'Önceki deneyimlerinizden bu role katabileceğiniz en önemli beceri veya bilgi nedir?', thinkingTime: 30, answerTime: 150, retakes: 0 },
      { id: '4', text: 'Takım içinde bir anlaşmazlık yaşadığınız durumu ve nasıl çözdüğünüzü anlatır mısınız?', thinkingTime: 30, answerTime: 150, retakes: 1 },
      { id: '5', text: 'Kariyer hedefleriniz neler ve bu pozisyon bu hedeflere nasıl uyuyor?', thinkingTime: 30, answerTime: 120, retakes: 0 },
    ];
    
    setQuestions(generatedQuestions);
    setIsGenerating(false);
  };

  const handleCreate = async () => {
    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    router.push('/demo/recruiter/interviews/1');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/demo/recruiter/interviews"
          className="inline-flex items-center gap-2 text-surface-600 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Mülakatlar
        </Link>
        <h1 className="text-2xl font-bold text-white">Yeni Mülakat Oluştur</h1>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                step >= s
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-200 text-surface-600'
              )}
            >
              {s}
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                step >= s ? 'text-white' : 'text-surface-600'
              )}
            >
              {s === 1 ? 'Temel Bilgiler' : 'Sorular'}
            </span>
            {s < 2 && (
              <div className="w-12 h-0.5 bg-surface-200 mx-2" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="card p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Mülakat Bilgileri</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Mülakat Başlığı *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Örn: Senior Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input min-h-[120px] resize-none"
                placeholder="Pozisyon ve beklentiler hakkında kısa açıklama..."
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={() => setStep(2)}
              disabled={!title}
              className="btn-primary"
            >
              Devam Et
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Questions */}
      {step === 2 && (
        <div className="space-y-6">
          {/* AI Generate */}
          <div className="card p-6 border-brand-500/30 bg-brand-500/5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-brand-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">AI ile Soru Oluştur</h3>
                  <p className="text-surface-600 text-sm">
                    "{title}" pozisyonu için otomatik mülakat soruları oluşturun.
                  </p>
                </div>
              </div>
              <button
                onClick={generateWithAI}
                disabled={isGenerating}
                className="btn-primary"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Oluştur
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Sorular</h2>
              <button onClick={addQuestion} className="btn-secondary text-sm">
                <Plus className="w-4 h-4" />
                Soru Ekle
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 bg-surface-100 rounded-xl border border-surface-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-2 text-surface-500 pt-3">
                      <GripVertical className="w-5 h-5 cursor-grab" />
                      <span className="text-sm font-medium w-6">{index + 1}.</span>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <textarea
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                        className="input min-h-[80px] resize-none"
                        placeholder="Sorunuzu yazın..."
                      />
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="flex items-center gap-2 text-xs text-surface-600 mb-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Düşünme Süresi
                          </label>
                          <select
                            value={question.thinkingTime}
                            onChange={(e) => updateQuestion(question.id, 'thinkingTime', parseInt(e.target.value))}
                            className="input text-sm py-2"
                          >
                            <option value={15}>15 saniye</option>
                            <option value={30}>30 saniye</option>
                            <option value={45}>45 saniye</option>
                            <option value={60}>60 saniye</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="flex items-center gap-2 text-xs text-surface-600 mb-1.5">
                            <Video className="w-3.5 h-3.5" />
                            Cevap Süresi
                          </label>
                          <select
                            value={question.answerTime}
                            onChange={(e) => updateQuestion(question.id, 'answerTime', parseInt(e.target.value))}
                            className="input text-sm py-2"
                          >
                            <option value={60}>1 dakika</option>
                            <option value={120}>2 dakika</option>
                            <option value={180}>3 dakika</option>
                            <option value={300}>5 dakika</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="flex items-center gap-2 text-xs text-surface-600 mb-1.5">
                            <RotateCcw className="w-3.5 h-3.5" />
                            Tekrar Hakkı
                          </label>
                          <select
                            value={question.retakes}
                            onChange={(e) => updateQuestion(question.id, 'retakes', parseInt(e.target.value))}
                            className="input text-sm py-2"
                          >
                            <option value={0}>Yok</option>
                            <option value={1}>1 kez</option>
                            <option value={2}>2 kez</option>
                            <option value={3}>3 kez</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeQuestion(question.id)}
                      className="p-2 text-surface-500 hover:text-red-400 transition-colors"
                      disabled={questions.length <= 1}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggested Questions */}
            <div className="mt-6 pt-6 border-t border-surface-200">
              <p className="text-sm text-surface-600 mb-3">Önerilen Sorular:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 4).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const emptyQuestion = questions.find(q => !q.text);
                      if (emptyQuestion) {
                        updateQuestion(emptyQuestion.id, 'text', q);
                      } else {
                        setQuestions([
                          ...questions,
                          { id: Date.now().toString(), text: q, thinkingTime: 30, answerTime: 120, retakes: 1 },
                        ]);
                      }
                    }}
                    className="text-sm px-3 py-1.5 rounded-lg bg-surface-200 text-surface-700 hover:bg-surface-300 transition-colors"
                  >
                    + {q.length > 40 ? q.slice(0, 40) + '...' : q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(1)} className="btn-ghost">
              <ArrowLeft className="w-4 h-4" />
              Geri
            </button>
            <div className="flex items-center gap-3">
              <button className="btn-secondary">
                Taslak Olarak Kaydet
              </button>
              <button
                onClick={handleCreate}
                disabled={isCreating || questions.every(q => !q.text)}
                className="btn-primary"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    Mülakatı Oluştur
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

