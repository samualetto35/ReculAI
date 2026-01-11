'use client';

import Link from 'next/link';
import { Video, Brain, Clock, Shield, Zap, Users, Sun, Moon, ArrowRight, CheckCircle, Building2, Briefcase, GraduationCap, Factory, Sparkles } from 'lucide-react';
import { useTheme } from '../providers';
import { cn } from '@/lib/utils';
import { MobileNavMenu } from '@/components/MobileNavMenu';

const solutions = [
  {
    icon: Building2,
    title: 'Kurumsal Şirketler',
    desc: 'Büyük ölçekli işe alım süreçleri için kapsamlı çözümler',
    features: ['Sınırsız mülakat', 'Özel API entegrasyonu', 'Dedicated destek', 'Custom AI modelleri'],
    badge: 'Kurumsal',
  },
  {
    icon: Briefcase,
    title: 'KOBİ\'ler',
    desc: 'Küçük ve orta ölçekli işletmeler için uygun fiyatlı çözümler',
    features: ['Uygun fiyat', 'Hızlı kurulum', 'Kolay kullanım', 'Standart özellikler'],
    badge: 'Popüler',
  },
  {
    icon: Factory,
    title: 'İşe Alım Ajansları',
    desc: 'Profesyonel işe alım ajansları için gelişmiş araçlar',
    features: ['Çoklu müşteri yönetimi', 'White-label seçeneği', 'Toplu davet', 'Aday havuzu'],
    badge: 'Pro',
  },
  {
    icon: GraduationCap,
    title: 'Eğitim Kurumları',
    desc: 'Üniversiteler ve kariyer merkezleri için özel paketler',
    features: ['Öğrenci dostu', 'Staj mülakatları', 'Kariyer etkinlikleri', 'Özel indirimler'],
    badge: 'Eğitim',
  },
];

const features = [
  { icon: Video, title: 'Asenkron Video', desc: 'Adaylar istedikleri zaman mülakat yapabilir' },
  { icon: Brain, title: 'AI Analizi', desc: 'GPT-4 ile otomatik değerlendirme ve puanlama' },
  { icon: Clock, title: 'Zaman Atlama', desc: 'Önemli anları işaretleyin, hızlı izleyin' },
  { icon: Shield, title: 'Güvenlik', desc: 'KVKK uyumlu, şifreli altyapı' },
  { icon: Zap, title: 'Hızlı Kurulum', desc: '5 dakikada ilk mülakatınızı oluşturun' },
  { icon: Users, title: 'Ekip İşbirliği', desc: 'Notlar ve puanları ekiple paylaşın' },
];

const useCases = [
  { title: 'Toplu İşe Alım', desc: 'Yüzlerce adayı aynı anda değerlendirin' },
  { title: 'Uzaktan Mülakat', desc: 'Lokasyon bağımsız işe alım yapın' },
  { title: 'Teknik Mülakat', desc: 'Kod paylaşımı ve teknik sorular sorun' },
  { title: 'Stajyer Seçimi', desc: 'Genç yetenekleri keşfedin' },
];

export default function SolutionsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Header */}
      <header className="border-b border-surface-200 bg-surface-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-semibold text-surface-900">Recula</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/solutions" className="text-sm text-surface-900 font-medium">
              Çözümler
            </Link>
            <Link href="/pricing" className="text-sm text-surface-600 hover:text-surface-900 transition-colors">
              Fiyatlandırma
            </Link>
            <Link href="/contact" className="text-sm text-surface-600 hover:text-surface-900 transition-colors">
              İletişim
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-surface-100 hover:bg-surface-200 text-surface-600 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a href="https://apprecula.netlify.app/login" className="text-sm text-surface-600 hover:text-surface-900">
              Giriş
            </a>
            <a href="https://apprecula.netlify.app/register" className="text-sm bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Ücretsiz Başla
            </a>
          </nav>
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-3xl bg-surface-100 text-surface-600">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a href="https://apprecula.netlify.app/register" className="text-xs bg-black text-white px-3 py-1.5 rounded-3xl font-medium">
              Başla
            </a>
            <MobileNavMenu />
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-12 md:pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs md:text-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>Her İhtiyaca Uygun Çözümler</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-surface-900 mb-4">
              İşletmenize Özel Çözümler
            </h1>
            <p className="text-base md:text-lg text-surface-600">
              Recula, her ölçekte şirket için özelleştirilmiş video mülakat çözümleri sunar.
            </p>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {solutions.map((sol, i) => (
                <div key={i} className="bg-surface-50 border border-surface-200 rounded-xl p-5 md:p-6 hover:border-surface-300 hover:shadow-sm transition-all relative">
                  <span
                    className={cn(
                      'absolute top-4 right-4 text-[10px] md:text-xs px-2 py-0.5 rounded-full font-medium border',
                      sol.badge === 'Kurumsal' && 'bg-indigo-500/15 border-indigo-500/25 text-indigo-700 dark:text-indigo-300',
                      sol.badge === 'Popüler' && 'bg-amber-500/15 border-amber-500/25 text-amber-700 dark:text-amber-300',
                      sol.badge === 'Pro' && 'bg-fuchsia-500/15 border-fuchsia-500/25 text-fuchsia-700 dark:text-fuchsia-300',
                      sol.badge === 'Eğitim' && 'bg-sky-500/15 border-sky-500/25 text-sky-700 dark:text-sky-300'
                    )}
                  >
                    {sol.badge}
                  </span>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-zinc-100">
                      <sol.icon className="w-6 h-6 md:w-7 md:h-7 text-zinc-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-lg font-semibold text-surface-900 mb-1.5">{sol.title}</h3>
                      <p className="text-sm text-surface-600 mb-4">{sol.desc}</p>
                      <ul className="grid grid-cols-2 gap-2">
                        {sol.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-1.5 text-xs md:text-sm text-surface-600">
                            <CheckCircle className="w-3.5 h-3.5 text-zinc-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 md:py-16 border-t border-surface-200/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-12">
              <span className="inline-block text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full mb-3 border border-emerald-500/20">ÖZELLİKLER</span>
              <h2 className="text-2xl md:text-3xl font-semibold text-surface-900 mb-3">Tüm Özellikler</h2>
              <p className="text-sm md:text-base text-surface-600">Her çözümde dahil olan temel özellikler</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {features.map((f, i) => (
                <div key={i} className="bg-surface-50 border border-surface-200 rounded-xl p-4 md:p-5 hover:border-surface-300 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center bg-zinc-100">
                      <f.icon className="w-4 h-4 md:w-5 md:h-5 text-zinc-700" />
                    </div>
                    <h3 className="text-sm md:text-base font-semibold text-surface-900">{f.title}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-surface-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-12 md:py-16 border-t border-surface-200/50">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-12">
              <span className="inline-block text-xs font-medium text-violet-700 dark:text-violet-300 bg-violet-500/10 px-3 py-1 rounded-full mb-3 border border-violet-500/20">KULLANIM ALANLARI</span>
              <h2 className="text-2xl md:text-3xl font-semibold text-surface-900 mb-3">Kullanım Senaryoları</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {useCases.map((uc, i) => (
                <div key={i} className="text-center bg-surface-50 border border-surface-200 rounded-xl p-4 md:p-5">
                  <div className="w-2 h-2 rounded-full mx-auto mb-3 bg-zinc-600" />
                  <h3 className="text-sm md:text-base font-semibold text-surface-900 mb-1">{uc.title}</h3>
                  <p className="text-xs md:text-sm text-surface-600">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 border-t border-surface-200/50">
          <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
            <span className="inline-block text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full mb-4 border border-rose-500/20">BAŞLAYIN</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-surface-900 mb-3">Hemen Başlayın</h2>
            <p className="text-sm md:text-base text-surface-600 mb-6">14 gün ücretsiz deneyin.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="https://apprecula.netlify.app/register" className="w-full sm:w-auto text-[13px] md:text-base bg-black hover:bg-zinc-800 text-white px-6 py-2.5 rounded-3xl font-medium transition-colors flex items-center justify-center gap-2">
                Ücretsiz Başla
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link href="/contact" className="w-full sm:w-auto text-[13px] md:text-base bg-surface-100 hover:bg-surface-200 text-surface-700 px-6 py-[10px] rounded-3xl font-medium transition-colors">
                Demo Talep Et
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 py-8 md:py-10 bg-surface-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-surface-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-surface-900">Recula</span>
            </div>
            <p>© 2024 Recula. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
