'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  GripVertical,
  Loader2,
  Clock,
  Video
} from 'lucide-react';
import { interviewsApi } from '@/lib/api';

interface Question {
  id: string;
  text: string;
  thinkingTime: number;
  answerTime: number;
  retakes: number;
}

export default function NewInterviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      text: '',
      thinkingTime: 30,
      answerTime: 120,
      retakes: 1,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        text: '',
        thinkingTime: 30,
        answerTime: 120,
        retakes: 1,
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await interviewsApi.create({
        title,
        description,
        questions: questions.map(({ text, thinkingTime, answerTime, retakes }) => ({
          text,
          thinkingTime,
          answerTime,
          retakes,
        })),
      });
      router.push(`/dashboard/interviews/${data.id}`);
    } catch (error) {
      console.error('Failed to create interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const questionTemplates = [
    'Kendinizi kısaca tanıtır mısınız?',
    'Bu pozisyona neden başvurdunuz?',
    'En zorlu projenizi anlatır mısınız?',
    'Ekip çalışması konusunda bir örnek verebilir misiniz?',
    'Stresli bir durumla nasıl başa çıktığınızı anlatın.',
    '5 yıl sonra kendinizi nerede görüyorsunuz?',
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/interviews"
          className="inline-flex items-center gap-2 text-surface-600 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </Link>
        <h1 className="text-2xl font-bold text-white mb-2">Yeni Mülakat Oluştur</h1>
        <p className="text-surface-600">
          Mülakat detaylarını ve soruları belirleyin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Temel Bilgiler</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Mülakat Başlığı *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Örn: Frontend Developer - Ocak 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input min-h-[100px]"
                placeholder="Mülakat hakkında kısa bir açıklama..."
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Sorular</h2>
            <button type="button" onClick={addQuestion} className="btn-secondary text-sm">
              <Plus className="w-4 h-4" />
              Soru Ekle
            </button>
          </div>

          {/* Question Templates */}
          <div className="mb-6 p-4 bg-surface-100 rounded-lg">
            <p className="text-sm text-surface-600 mb-3">Hızlı Şablonlar:</p>
            <div className="flex flex-wrap gap-2">
              {questionTemplates.map((template, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    const emptyQuestion = questions.find((q) => !q.text);
                    if (emptyQuestion) {
                      updateQuestion(emptyQuestion.id, 'text', template);
                    } else {
                      setQuestions([
                        ...questions,
                        {
                          id: Date.now().toString(),
                          text: template,
                          thinkingTime: 30,
                          answerTime: 120,
                          retakes: 1,
                        },
                      ]);
                    }
                  }}
                  className="px-3 py-1.5 text-xs bg-surface-200 text-surface-700 rounded-full hover:bg-surface-300 transition-colors"
                >
                  {template.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="p-4 bg-surface-100 rounded-lg border border-surface-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 text-surface-500 pt-3">
                    <GripVertical className="w-4 h-4 cursor-move" />
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Soru Metni *
                      </label>
                      <textarea
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                        className="input min-h-[80px]"
                        placeholder="Sorunuzu yazın..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-surface-600 mb-1">
                          Düşünme Süresi
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                          <select
                            value={question.thinkingTime}
                            onChange={(e) =>
                              updateQuestion(question.id, 'thinkingTime', Number(e.target.value))
                            }
                            className="input pl-10 text-sm"
                          >
                            <option value={15}>15 saniye</option>
                            <option value={30}>30 saniye</option>
                            <option value={45}>45 saniye</option>
                            <option value={60}>1 dakika</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-surface-600 mb-1">
                          Cevap Süresi
                        </label>
                        <div className="relative">
                          <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                          <select
                            value={question.answerTime}
                            onChange={(e) =>
                              updateQuestion(question.id, 'answerTime', Number(e.target.value))
                            }
                            className="input pl-10 text-sm"
                          >
                            <option value={60}>1 dakika</option>
                            <option value={90}>1.5 dakika</option>
                            <option value={120}>2 dakika</option>
                            <option value={180}>3 dakika</option>
                            <option value={300}>5 dakika</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-surface-600 mb-1">
                          Tekrar Hakkı
                        </label>
                        <select
                          value={question.retakes}
                          onChange={(e) =>
                            updateQuestion(question.id, 'retakes', Number(e.target.value))
                          }
                          className="input text-sm"
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
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="p-2 text-surface-500 hover:text-red-400 transition-colors"
                    disabled={questions.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href="/dashboard/interviews" className="btn-secondary">
            İptal
          </Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Mülakat Oluştur'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

