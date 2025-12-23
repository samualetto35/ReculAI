'use client';

import Link from 'next/link';
import { Check, ArrowRight, Sun, Moon, ChevronDown, Sparkles, Zap, Crown } from 'lucide-react';
import { useTheme } from '../providers';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MobileNavMenu } from '@/components/MobileNavMenu';

const plans = [
  {
    name: 'Başlangıç',
    desc: 'Küçük ekipler için ideal başlangıç paketi',
    price: 0,
    features: ['5 aktif mülakat', '50 aday/ay', 'Temel AI analizi', 'E-posta destek', '7 gün video saklama'],
    cta: 'Ücretsiz Başla',
    highlighted: false,
    icon: Sparkles,
  },
  {
    name: 'Profesyonel',
    desc: 'Büyüyen şirketler için gelişmiş özellikler',
    price: 299,
    features: ['Sınırsız mülakat', 'Sınırsız aday', 'Gelişmiş AI analizi', 'Öncelikli destek', '90 gün video saklama', 'Ekip işbirliği', 'API erişimi'],
    cta: 'Denemeyi Başlat',
    highlighted: true,
    badge: 'En Popüler',
    icon: Zap,
  },
  {
    name: 'Kurumsal',
    desc: 'Büyük organizasyonlar için özel çözümler',
    price: null,
    features: ['Tüm Pro özellikler', 'Sınırsız saklama', 'Özel AI modeli', 'Dedicated yönetici', 'SLA garantisi', 'SSO entegrasyonu', 'On-premise seçeneği'],
    cta: 'İletişime Geç',
    highlighted: false,
    icon: Crown,
  },
];

const faqs = [
  { q: 'Ücretsiz plan süresiz mi?', a: 'Evet, limitler dahilinde süresiz kullanılabilir. Limit aştığınızda ücretli plana geçebilirsiniz.' },
  { q: 'Kredi kartı gerekli mi?', a: 'Hayır, ücretsiz plan ve 14 günlük deneme için kredi kartı bilgisi gerekmez.' },
  { q: 'Plan değiştirebilir miyim?', a: 'Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz.' },
  { q: 'İptal politikası nedir?', a: 'İstediğiniz zaman iptal edebilirsiniz. Dönem sonuna kadar kullanmaya devam edersiniz.' },
];

const comparisons = [
  { feature: 'Aktif Mülakat', starter: '5', pro: 'Sınırsız', enterprise: 'Sınırsız' },
  { feature: 'Aday Limiti', starter: '50/ay', pro: 'Sınırsız', enterprise: 'Sınırsız' },
  { feature: 'AI Analizi', starter: 'Temel', pro: 'Gelişmiş', enterprise: 'Özel Model' },
  { feature: 'Video Saklama', starter: '7 gün', pro: '90 gün', enterprise: 'Sınırsız' },
  { feature: 'API Erişimi', starter: '—', pro: '✓', enterprise: '✓' },
  { feature: 'SSO', starter: '—', pro: '—', enterprise: '✓' },
];

export default function PricingPage() {
  const { theme, toggleTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-surface-0">
      {/* Header */}
      <header className="border-b border-surface-200 bg-surface-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-semibold text-surface-900">Recula</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/solutions" className="text-sm text-surface-600 hover:text-surface-900 transition-colors">
              Çözümler
            </Link>
            <Link href="/pricing" className="text-sm text-surface-900 font-medium">
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
            <Link href="/auth/login" className="text-sm text-surface-600 hover:text-surface-900">
              Giriş
            </Link>
            <Link href="/auth/register" className="text-sm bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Ücretsiz Başla
            </Link>
          </nav>
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-3xl bg-surface-100 text-surface-600">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/auth/register" className="text-xs bg-black text-white px-3 py-1.5 rounded-3xl font-medium">
              Başla
            </Link>
            <MobileNavMenu />
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-10 md:pb-14">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs md:text-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>14 Gün Ücretsiz Deneme</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-surface-900 mb-4">
              Basit ve Şeffaf Fiyatlandırma
            </h1>
            <p className="text-base md:text-lg text-surface-600 mb-8">
              Kredi kartı gerekmez. İstediğiniz zaman iptal edin.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 p-1.5 bg-surface-100 rounded-full">
              <button
                onClick={() => setIsYearly(false)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  !isYearly ? 'bg-surface-0 text-surface-900 shadow-sm' : 'text-surface-600 dark:text-surface-300'
                )}
              >
                Aylık
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2',
                  isYearly ? 'bg-surface-0 text-surface-900 shadow-sm' : 'text-surface-600 dark:text-surface-300'
                )}
              >
                Yıllık
                <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">%20 İndirim</span>
              </button>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="py-8 md:py-12">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {plans.map((plan, i) => (
                <div
                  key={i}
                  className={cn(
                    'bg-surface-50 border rounded-xl p-5 md:p-6 relative',
                    plan.highlighted ? 'border-zinc-800 shadow-lg shadow-zinc-900/10' : 'border-surface-200'
                  )}
                >
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-xs bg-surface-0 border border-amber-500/25 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full font-medium shadow-sm">
                      {plan.badge}
                    </span>
                  )}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4 bg-zinc-100">
                    <plan.icon className="w-5 h-5 md:w-6 md:h-6 text-zinc-700" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-surface-900">{plan.name}</h3>
                  <p className="text-xs md:text-sm text-surface-600 mb-4">{plan.desc}</p>
                  <div className="mb-5">
                    {plan.price !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl md:text-4xl font-bold text-surface-900">
                          ₺{isYearly ? Math.round(plan.price * 0.8) : plan.price}
                        </span>
                        <span className="text-sm text-surface-600">/ay</span>
                      </div>
                    ) : (
                      <span className="text-xl md:text-2xl font-semibold text-surface-900">Özel Fiyat</span>
                    )}
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-surface-600">
                        <Check className="w-4 h-4 text-zinc-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.price === null ? '/contact' : '/auth/register'}
                    className={cn(
                      'block text-center text-sm font-medium py-2.5 md:py-3 rounded-lg transition-colors',
                      plan.highlighted
                        ? 'bg-black hover:bg-zinc-800 text-white'
                        : 'bg-surface-100 hover:bg-surface-200 text-surface-700'
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-12 md:py-16 border-t border-surface-200/50">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-10">
              <span className="inline-block text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-500/10 px-3 py-1 rounded-full mb-3 border border-sky-500/20">KARŞILAŞTIRMA</span>
              <h2 className="text-2xl md:text-3xl font-semibold text-surface-900">Plan Karşılaştırması</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200">
                    <th className="text-left py-3 px-4 font-medium text-surface-600">Özellik</th>
                    <th className="text-center py-3 px-4 font-medium text-surface-600">Başlangıç</th>
                    <th className="text-center py-3 px-4 font-medium text-surface-900">Profesyonel</th>
                    <th className="text-center py-3 px-4 font-medium text-surface-600">Kurumsal</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr key={i} className="border-b border-surface-100">
                      <td className="py-3 px-4 text-surface-900">{row.feature}</td>
                      <td className="text-center py-3 px-4 text-surface-600">{row.starter}</td>
                      <td className="text-center py-3 px-4 text-surface-600">{row.pro}</td>
                      <td className="text-center py-3 px-4 text-surface-600">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16 border-t border-surface-200/50">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-10">
              <span className="inline-block text-xs font-medium text-violet-700 dark:text-violet-300 bg-violet-500/10 px-3 py-1 rounded-full mb-3 border border-violet-500/20">SSS</span>
              <h2 className="text-2xl md:text-3xl font-bold text-surface-900">Sık Sorulan Sorular</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={cn(
                    'w-full bg-surface-50 border border-surface-200 rounded-xl p-4 md:p-5 text-left transition-all',
                    openFaq === i && 'border-zinc-400'
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm md:text-base font-medium text-surface-900">{faq.q}</h3>
                    <ChevronDown className={cn('w-4 h-4 text-surface-500 transition-transform', openFaq === i && 'rotate-180')} />
                  </div>
                  {openFaq === i && (
                    <p className="text-sm text-surface-600 mt-3">{faq.a}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 border-t border-surface-200/50">
          <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-3">Sorularınız mı var?</h2>
            <p className="text-sm md:text-base text-surface-600 mb-6">Ekibimiz size yardımcı olmaktan mutluluk duyar.</p>
            <Link href="/contact" className="text-[13px] md:text-base bg-black hover:bg-zinc-800 text-white px-6 py-2.5 rounded-3xl font-medium transition-colors inline-flex items-center gap-2">
              İletişime Geç
              <ArrowRight className="w-4 h-4" />
            </Link>
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
