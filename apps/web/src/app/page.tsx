'use client';

import Link from 'next/link';
import { ArrowRight, Video, Brain, Clock, Shield, Zap, Users, Sun, Moon, Play, ChevronDown, Quote, Building2, Sparkles, TrendingUp, Award } from 'lucide-react';
import { useTheme } from './providers';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MobileNavMenu } from '@/components/MobileNavMenu';

const features = [
  { icon: Video, title: 'Asenkron Video', desc: 'Adaylar istedikleri zaman mülakat yapabilir. Takvim çakışması yok.', badge: 'Popüler' },
  { icon: Brain, title: 'AI Analizi', desc: 'GPT-4 destekli analiz ile yanıtları otomatik değerlendirin.', badge: 'Yeni' },
  { icon: Clock, title: 'Zaman Atlama', desc: '10 dakikalık videoyu 30 saniyede izleyin.' },
  { icon: Shield, title: 'KVKK Uyumlu', desc: 'Güvenli altyapı ile verileriniz korunur.' },
  { icon: Zap, title: 'Hızlı Kurulum', desc: '5 dakikada ilk mülakatınızı oluşturun.' },
  { icon: Users, title: 'Ekip İşbirliği', desc: 'Notlar ve puanları ekiple gerçek zamanlı paylaşın.' },
];

const steps = [
  { n: '1', t: 'Mülakat Oluştur', d: 'Soruları ekleyin ve süreleri belirleyin', icon: Video },
  { n: '2', t: 'Aday Davet Et', d: 'Tek tıkla link oluşturun', icon: Users },
  { n: '3', t: 'Yanıtları İzle', d: 'İstediğiniz zaman inceleyin', icon: Play },
  { n: '4', t: 'AI Değerlendir', d: 'Otomatik analiz ve puanlama', icon: Brain },
];

const testimonials = [
  { quote: 'Recula ile mülakat süreçlerimiz %70 daha hızlı. Ekibimiz artık daha verimli çalışıyor.', author: 'Ayşe Yılmaz', role: 'İK Direktörü', company: 'TechCorp', avatar: 'AY' },
  { quote: 'AI analizleri sayesinde doğru adayları çok daha hızlı tespit edebiliyoruz.', author: 'Mehmet Kaya', role: 'İşe Alım Müdürü', company: 'Startup Hub', avatar: 'MK' },
  { quote: 'Adaylarımızdan çok olumlu geri bildirimler alıyoruz. Modern ve kullanımı kolay.', author: 'Zeynep Demir', role: 'HR Manager', company: 'Global Yazılım', avatar: 'ZD' },
];

const faqs = [
  { q: 'Recula nedir?', a: 'Asenkron video mülakat platformu. Adaylar istedikleri zaman yanıt verir, siz de istediğiniz zaman izlersiniz.' },
  { q: 'Ücretsiz deneme var mı?', a: '14 gün ücretsiz deneme sunuyoruz. Kredi kartı gerekmez.' },
  { q: 'Verilerim güvende mi?', a: 'KVKK uyumlu altyapı, end-to-end şifreleme ile verileriniz güvende.' },
  { q: 'AI analizi nasıl çalışır?', a: 'GPT-4 tabanlı yapay zeka STAR metoduna göre değerlendirme yapar.' },
];

const companies = ['TechCorp', 'Startup Hub', 'Global Yazılım', 'Fintech Co', 'E-Ticaret Plus'];

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            <Link href="/pricing" className="text-sm text-surface-600 hover:text-surface-900 transition-colors">
              Fiyatlandırma
            </Link>
            <Link href="/contact" className="text-sm text-surface-600 hover:text-surface-900 transition-colors">
              İletişim
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-3xl bg-surface-100 hover:bg-surface-200 text-surface-600 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/auth/login" className="text-sm text-surface-600 hover:text-surface-900">
              Giriş
            </Link>
            <Link href="/auth/register" className="text-[13px] bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-3xl font-medium transition-colors">
              Ücretsiz Başla
            </Link>
          </nav>
          {/* Mobile nav */}
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
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-16 md:pb-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-[3px] py-[3px] rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs mb-6 md:mb-8">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>Yapay Zeka Destekli Video Mülakat</span>
              <span className="bg-violet-500/15 border border-violet-500/25 text-violet-700 dark:text-violet-300 text-[10px] px-[7px] py-0 rounded-full font-medium">Yeni</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-surface-900 leading-tight mb-4 md:mb-6">
              İşe Alımda Yeni Nesil Deneyim
            </h1>
            
            <p className="text-[15px] text-surface-700 dark:text-surface-600 mb-8 md:mb-10 max-w-2xl mx-auto">
              Asenkron video mülakatlarla zamandan tasarruf edin. AI destekli analizlerle en iyi adayları saniyeler içinde belirleyin.
            </p>

            <div className="flex flex-row flex-nowrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
              <Link
                href="/auth/register"
                className="min-w-0 whitespace-nowrap text-[clamp(11px,3.2vw,14px)] md:text-[13px] bg-black hover:bg-zinc-800 text-white px-[clamp(10px,3.5vw,16px)] md:px-8 py-[10px] md:py-[10px] rounded-3xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                14 Gün Ücretsiz Deneyin
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              </Link>
              <Link
                href="/demo"
                className="min-w-0 whitespace-nowrap text-[clamp(11px,3.2vw,14px)] md:text-[13px] bg-surface-100 hover:bg-surface-200 text-surface-700 px-[clamp(10px,3.5vw,32px)] md:px-8 py-[10px] md:py-[10px] rounded-3xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                Demo İzle
              </Link>
            </div>

            {/* Hero media (layered image + video) */}
            <div className="mt-10 md:mt-12 flex justify-center">
              <div className="relative w-full max-w-3xl">
                {/* Back layer (image) */}
                <div className="relative aspect-[5/3] md:aspect-[13/8] w-full rounded-3xl overflow-hidden border border-surface-200 bg-surface-50 shadow-lg">
                  <img
                    src="/hero/hero-frame.jpeg"
                    alt="Recula ürün önizleme"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                  />
                </div>

                {/* Front layer (video) */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="relative aspect-video w-[92%] md:w-[88%] rounded-2xl overflow-hidden border border-surface-200 bg-black shadow-2xl z-10">
                    <video
                      className="h-full w-full object-cover"
                      src="/hero/hero-video.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 md:mt-16 flex items-center justify-center gap-6 md:gap-10 text-surface-600">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-2xl md:text-3xl font-bold text-surface-900">500+</p>
                  <TrendingUp className="w-4 h-4 text-zinc-500" />
                </div>
                <p className="text-xs md:text-sm">Şirket</p>
              </div>
              <div className="w-px h-8 md:h-10 bg-surface-300" />
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-surface-900">50K+</p>
                <p className="text-xs md:text-sm">Mülakat</p>
              </div>
              <div className="w-px h-8 md:h-10 bg-surface-300" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-2xl md:text-3xl font-bold text-surface-900">%70</p>
                  <Award className="w-4 h-4 text-zinc-500" />
                </div>
                <p className="text-xs md:text-sm">Zaman Tasarrufu</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="border-y border-surface-200/50 py-6 md:py-8">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <p className="text-center text-xs md:text-sm text-surface-500 mb-4 md:mb-6">
              Türkiye'nin önde gelen şirketleri tarafından tercih ediliyor
            </p>
            <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap opacity-60">
              {companies.map((company, i) => (
                <div key={i} className="flex items-center gap-1.5 text-surface-600 text-xs md:text-sm">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-14">
              <span className="inline-block text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full mb-3 border border-emerald-500/20">ÖZELLİKLER</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-surface-900 mb-3 md:mb-4">
                Neden Recula?
              </h2>
              <p className="text-sm md:text-base text-surface-600 max-w-2xl mx-auto">
                Modern işe alım süreçleri için tasarlanmış güçlü özellikler
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {features.map((f, i) => (
                <div key={i} className="bg-surface-50 border border-surface-200 rounded-xl p-5 md:p-6 hover:border-surface-300 hover:shadow-sm transition-all group relative">
                  {f.badge && (
                    <span
                      className={cn(
                        'absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full font-medium border',
                        f.badge === 'Popüler' && 'bg-amber-500/15 border-amber-500/25 text-amber-700 dark:text-amber-300',
                        f.badge === 'Yeni' && 'bg-emerald-500/15 border-emerald-500/25 text-emerald-700 dark:text-emerald-300'
                      )}
                    >
                      {f.badge}
                    </span>
                  )}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 bg-zinc-100">
                    <f.icon className="w-5 h-5 md:w-6 md:h-6 text-zinc-700" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-surface-900 mb-1.5 md:mb-2">{f.title}</h3>
                  <p className="text-sm text-surface-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 border-t border-surface-200/50">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-14">
              <span className="inline-block text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-500/10 px-3 py-1 rounded-full mb-3 border border-sky-500/20">ADIMLAR</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-surface-900 mb-3 md:mb-4">
                Nasıl Çalışır?
              </h2>
              <p className="text-sm md:text-base text-surface-600">
                4 basit adımda işe alım sürecinizi dönüştürün
              </p>
            </div>

            {/* Mobile: vertical timeline (no overlap) */}
            <div className="md:hidden">
              <div className="space-y-4">
                {steps.map((s, i) => (
                  <div key={i} className="flex items-stretch gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-surface-0 border border-surface-200 shadow-sm flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                          <s.icon className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      {i < steps.length - 1 && <div className="w-px flex-1 bg-surface-200 mt-2" />}
                    </div>
                    <div className="card p-4 flex-1">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <h3 className="text-sm font-semibold text-surface-900">{s.t}</h3>
                        <span className="text-xs text-surface-500 font-medium whitespace-nowrap">Adım {s.n}</span>
                      </div>
                      <p className="text-xs text-surface-600">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: horizontal stepper */}
            <div className="hidden md:block relative">
              <div className="absolute left-8 right-8 top-7 h-px bg-surface-200" />
              <div className="grid grid-cols-4 gap-6">
                {steps.map((s, i) => (
                  <div key={i} className="relative pt-10">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0">
                      <div className="w-14 h-14 rounded-full bg-surface-0 border border-surface-200 shadow-sm flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                          <s.icon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    <div className="card p-5 text-center h-full">
                      <p className="text-xs font-medium text-surface-500 mb-2">Adım {s.n}</p>
                      <h3 className="text-base font-semibold text-surface-900 mb-1.5">{s.t}</h3>
                      <p className="text-sm text-surface-600">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 border-t border-surface-200/50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-14">
              <span className="inline-block text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full mb-3 border border-amber-500/20">REFERANSLAR</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-surface-900 mb-3 md:mb-4">
                Müşterilerimiz Ne Diyor?
              </h2>
              <p className="text-sm md:text-base text-surface-600">
                Yüzlerce şirket Recula ile işe alım süreçlerini dönüştürdü
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-surface-50 border border-surface-200 rounded-xl p-5 md:p-6 relative hover:border-surface-300 transition-colors">
                  <Quote className="w-6 h-6 md:w-8 md:h-8 text-surface-300 mb-3 md:mb-4" />
                  <p className="text-sm md:text-base text-surface-700 mb-4 md:mb-6 leading-relaxed">{t.quote}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-surface-200">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-zinc-200 flex items-center justify-center">
                      <span className="text-zinc-700 text-xs md:text-sm font-medium">{t.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">{t.author}</p>
                      <p className="text-xs text-surface-600">{t.role}, {t.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24 border-t border-surface-200/50">
          <div className="max-w-3xl mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-14">
              <span className="inline-block text-xs font-medium text-fuchsia-700 dark:text-fuchsia-300 bg-fuchsia-500/10 px-3 py-1 rounded-full mb-3 border border-fuchsia-500/20">SSS</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-surface-900 mb-3 md:mb-4">
                Sık Sorulan Sorular
              </h2>
              <p className="text-sm md:text-base text-surface-600">
                Aklınıza takılan sorular mı var? İşte cevaplar.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={cn(
                    'w-full bg-surface-50 border border-surface-200 rounded-xl p-4 md:p-5 text-left transition-all',
                    openFaq === i && 'border-zinc-400 shadow-sm'
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm md:text-base font-medium text-surface-900">{faq.q}</h3>
                    <ChevronDown className={cn('w-4 h-4 md:w-5 md:h-5 text-surface-500 transition-transform flex-shrink-0', openFaq === i && 'rotate-180')} />
                  </div>
                  {openFaq === i && (
                    <p className="text-sm text-surface-600 mt-3 leading-relaxed">{faq.a}</p>
                  )}
                </button>
              ))}
            </div>

            <div className="text-center mt-8 md:mt-10">
              <p className="text-sm text-surface-600 mb-3">Başka sorularınız mı var?</p>
              <Link href="/contact" className="text-sm bg-surface-100 hover:bg-surface-200 text-surface-700 px-5 py-2.5 rounded-3xl font-medium transition-colors inline-flex items-center gap-2">
                Bize Ulaşın
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 border-t border-surface-200/50">
          <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
            <span className="inline-block text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-500/10 px-3 py-1 rounded-full mb-4 border border-rose-500/20">BAŞLAYIN</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-surface-900 mb-3 md:mb-4">
              Hemen Başlayın
            </h2>
            <p className="text-sm md:text-base text-surface-600 mb-6 md:mb-8">
              14 gün ücretsiz deneme. Kredi kartı gerekmez.
            </p>
            <div className="flex flex-row flex-nowrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
              <Link
                href="/auth/register"
                className="min-w-0 whitespace-nowrap text-[clamp(11px,3.2vw,14px)] md:text-[13px] bg-black hover:bg-zinc-800 text-white px-[clamp(10px,3.5vw,16px)] md:px-8 py-[clamp(9px,2.6vw,12px)] md:py-2.5 rounded-3xl font-medium transition-colors flex items-center justify-center gap-2"
              >
              Ücretsiz Hesap Oluştur
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              </Link>
              <Link
                href="/pricing"
                className="min-w-0 whitespace-nowrap text-[clamp(11px,3.2vw,14px)] md:text-base bg-surface-100 hover:bg-surface-200 text-surface-700 px-[clamp(10px,3.5vw,16px)] md:px-8 py-[clamp(9px,2.6vw,12px)] md:py-2.5 rounded-3xl font-medium transition-colors"
              >
                Fiyatları Gör
            </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-200 py-10 md:py-14 bg-surface-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 md:mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base font-semibold text-surface-900">Recula</span>
              </div>
              <p className="text-xs md:text-sm text-surface-600">AI destekli asenkron video mülakat platformu ile işe alım süreçlerinizi modernleştirin.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-surface-900 mb-3">Ürün</h4>
              <ul className="space-y-2 text-xs md:text-sm">
                <li><Link href="/solutions" className="text-surface-600 hover:text-surface-900">Çözümler</Link></li>
                <li><Link href="/pricing" className="text-surface-600 hover:text-surface-900">Fiyatlandırma</Link></li>
                <li><Link href="/demo" className="text-surface-600 hover:text-surface-900">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-surface-900 mb-3">Şirket</h4>
              <ul className="space-y-2 text-xs md:text-sm">
                <li><Link href="/contact" className="text-surface-600 hover:text-surface-900">İletişim</Link></li>
                <li><Link href="#" className="text-surface-600 hover:text-surface-900">Hakkımızda</Link></li>
                <li><Link href="#" className="text-surface-600 hover:text-surface-900">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-surface-900 mb-3">Yasal</h4>
              <ul className="space-y-2 text-xs md:text-sm">
                <li><Link href="/privacy" className="text-surface-600 hover:text-surface-900">Gizlilik Politikası</Link></li>
                <li><Link href="/terms" className="text-surface-600 hover:text-surface-900">Kullanım Şartları</Link></li>
                <li><Link href="#" className="text-surface-600 hover:text-surface-900">KVKK</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-surface-600">
            <p>© 2024 Recula. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="hover:text-surface-900">Twitter</Link>
              <Link href="#" className="hover:text-surface-900">LinkedIn</Link>
              <Link href="#" className="hover:text-surface-900">YouTube</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
