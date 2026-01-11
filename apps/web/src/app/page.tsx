'use client';

import Link from 'next/link';
import { ArrowRight, Video, Brain, Clock, Shield, Zap, Users, Sun, Moon, Play, ChevronDown, Quote, Building2, Sparkles, TrendingUp, Award } from 'lucide-react';
import { useTheme } from './providers';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MobileNavMenu } from '@/components/MobileNavMenu';

const featuresGroup1 = [
  { 
    icon: Video, 
    title: 'Asenkron Video', 
    desc: 'Adaylar istedikleri zaman mülakat yapabilir. Takvim çakışması yok, zaman dilimi sorunu yok.',
    badge: 'Popüler'
  },
  { 
    icon: Brain, 
    title: 'AI Analizi', 
    desc: 'GPT-4 destekli analiz ile yanıtları otomatik değerlendirin. STAR metodolojisi ile detaylı puanlama.',
    badge: 'Yeni'
  },
  { 
    icon: Clock, 
    title: 'Zaman Atlama', 
    desc: '10 dakikalık videoyu 30 saniyede izleyin. Önemli anları işaretleyin ve hızlıca gözden geçirin.'
  },
];

const featuresGroup2 = [
  { 
    icon: Shield, 
    title: 'KVKK Uyumlu', 
    desc: 'Güvenli altyapı ile verileriniz korunur. End-to-end şifreleme ve Türkiye lokasyonlu sunucular.'
  },
  { 
    icon: Zap, 
    title: 'Hızlı Kurulum', 
    desc: '5 dakikada ilk mülakatınızı oluşturun. Hazır şablonlar ve sürükle-bırak soru editörü.'
  },
  { 
    icon: Users, 
    title: 'Ekip İşbirliği', 
    desc: 'Notlar ve puanları ekiple gerçek zamanlı paylaşın. Rol bazlı erişim kontrolü.'
  },
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

// Feature illustration components
const FeatureIllustration1 = ({ activeIndex }: { activeIndex: number }) => {
  const illustrations = [
    // Asenkron Video - Video player mockup
    <div key="video" className="relative w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-sm">
        <div className="bg-surface-100 rounded-2xl p-4 shadow-lg border border-surface-200">
          <div className="aspect-video bg-gradient-to-br from-surface-200 to-surface-300 rounded-xl mb-3 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 text-surface-700 ml-1" />
              </div>
            </div>
            <div className="absolute bottom-2 left-2 right-2 h-1 bg-surface-400/30 rounded-full">
              <div className="h-full w-1/3 bg-emerald-500 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600" />
            <div className="flex-1">
              <div className="h-3 w-24 bg-surface-300 rounded-full mb-1.5" />
              <div className="h-2 w-16 bg-surface-200 rounded-full" />
            </div>
            <div className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-medium rounded-full">Canlı</div>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-violet-500/10 rounded-2xl blur-xl" />
      </div>
    </div>,
    // AI Analizi - Analytics dashboard mockup
    <div key="ai" className="relative w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-sm">
        <div className="bg-surface-100 rounded-2xl p-4 shadow-lg border border-surface-200">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-medium text-surface-700">AI Değerlendirme</span>
            <span className="ml-auto px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-xs font-medium rounded-full">%92</span>
          </div>
          <div className="space-y-3">
            {['İletişim', 'Teknik Bilgi', 'Problem Çözme', 'Deneyim'].map((skill, i) => (
              <div key={skill} className="flex items-center gap-3">
                <span className="text-xs text-surface-600 w-20">{skill}</span>
                <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${85 + i * 3}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-surface-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-surface-600">STAR metodolojisi ile analiz edildi</span>
          </div>
        </div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-500/10 rounded-2xl blur-xl" />
      </div>
    </div>,
    // Zaman Atlama - Timeline mockup
    <div key="time" className="relative w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-sm">
        <div className="bg-surface-100 rounded-2xl p-4 shadow-lg border border-surface-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-sky-500" />
            <span className="text-sm font-medium text-surface-700">Zaman Çizelgesi</span>
          </div>
          <div className="relative h-3 bg-surface-200 rounded-full mb-4">
            <div className="absolute top-0 left-[10%] w-1 h-3 bg-amber-400 rounded-full" />
            <div className="absolute top-0 left-[35%] w-1 h-3 bg-emerald-400 rounded-full" />
            <div className="absolute top-0 left-[60%] w-1 h-3 bg-violet-400 rounded-full" />
            <div className="absolute top-0 left-[85%] w-1 h-3 bg-sky-400 rounded-full" />
            <div className="absolute -top-1 left-[45%] w-5 h-5 bg-white border-2 border-emerald-500 rounded-full shadow-sm" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['0:00', '2:30', '5:00', '7:30'].map((time, i) => (
              <div key={time} className={cn(
                "text-center p-2 rounded-lg transition-colors",
                i === 1 ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-surface-50"
              )}>
                <div className="text-xs font-medium text-surface-700">{time}</div>
                <div className="text-[10px] text-surface-500 mt-0.5">Soru {i + 1}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-sky-500/10 rounded-2xl blur-xl" />
      </div>
    </div>,
  ];
  return illustrations[activeIndex] || illustrations[0];
};

const FeatureIllustration2 = ({ activeIndex }: { activeIndex: number }) => {
  const illustrations = [
    // KVKK - Security shield mockup
    <div key="security" className="relative w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-sm">
        <div className="bg-surface-100 rounded-2xl p-4 shadow-lg border border-surface-200">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="text-center mb-4">
            <div className="text-sm font-semibold text-surface-800">Veri Güvenliği</div>
            <div className="text-xs text-surface-500">End-to-end şifreleme aktif</div>
          </div>
          <div className="space-y-2">
            {['256-bit SSL', 'KVKK Uyumlu', 'TR Sunucu'].map((item, i) => (
              <div key={item} className="flex items-center gap-2 p-2 bg-surface-50 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs text-surface-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-500/10 rounded-2xl blur-xl" />
      </div>
    </div>,
    // Hızlı Kurulum - Setup wizard mockup
    <div key="setup" className="relative w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-sm">
        <div className="bg-surface-100 rounded-2xl p-4 shadow-lg border border-surface-200">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-surface-700">Hızlı Kurulum</span>
            <span className="ml-auto text-xs text-surface-500">2/3</span>
          </div>
          <div className="flex gap-1 mb-4">
            <div className="flex-1 h-1.5 bg-emerald-500 rounded-full" />
            <div className="flex-1 h-1.5 bg-emerald-500 rounded-full" />
            <div className="flex-1 h-1.5 bg-surface-200 rounded-full" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="p-3 bg-surface-50 rounded-xl border-2 border-emerald-500/30 flex items-center gap-3">
              <Video className="w-5 h-5 text-emerald-500" />
              <div className="flex-1">
                <div className="text-xs font-medium text-surface-800">Video Mülakat</div>
                <div className="text-[10px] text-surface-500">3 soru eklenmiş</div>
              </div>
            </div>
            <div className="p-3 bg-surface-50 rounded-xl border border-surface-200 flex items-center gap-3 opacity-60">
              <Users className="w-5 h-5 text-surface-400" />
              <div className="flex-1">
                <div className="text-xs font-medium text-surface-600">Aday Davet Et</div>
              </div>
            </div>
          </div>
          <button className="w-full py-2 bg-black text-white text-xs font-medium rounded-lg">
            Devam Et
          </button>
        </div>
        <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-amber-500/10 rounded-2xl blur-xl" />
      </div>
    </div>,
    // Ekip İşbirliği - Team collaboration mockup
    <div key="team" className="relative w-full h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-sm">
        <div className="bg-surface-100 rounded-2xl p-4 shadow-lg border border-surface-200">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-violet-500" />
            <span className="text-sm font-medium text-surface-700">Ekip Yorumları</span>
          </div>
          <div className="space-y-3">
            {[
              { name: 'AY', color: 'from-violet-400 to-violet-600', text: 'Teknik bilgisi çok iyi 👍', time: '2dk' },
              { name: 'MK', color: 'from-emerald-400 to-emerald-600', text: 'İletişimi güçlü', time: '5dk' },
              { name: 'ZD', color: 'from-amber-400 to-amber-600', text: 'Deneyimi uygun görünüyor', time: '8dk' },
            ].map((comment, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${comment.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-[10px] text-white font-medium">{comment.name}</span>
                </div>
                <div className="flex-1 p-2 bg-surface-50 rounded-lg rounded-tl-none">
                  <p className="text-xs text-surface-700">{comment.text}</p>
                  <span className="text-[10px] text-surface-400">{comment.time} önce</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-violet-500/10 rounded-2xl blur-xl" />
      </div>
    </div>,
  ];
  return illustrations[activeIndex] || illustrations[0];
};

export default function HomePage() {
  const { theme, toggleTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeFeature1, setActiveFeature1] = useState(0);
  const [activeFeature2, setActiveFeature2] = useState(0);

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
            <a href="https://apprecula.netlify.app/login" className="text-sm text-surface-600 hover:text-surface-900">
              Giriş
            </a>
            <a href="https://apprecula.netlify.app/register" className="text-[13px] bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-3xl font-medium transition-colors">
              Ücretsiz Başla
            </a>
          </nav>
          {/* Mobile nav */}
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
              <a
                href="https://apprecula.netlify.app/register"
                className="min-w-0 whitespace-nowrap text-[clamp(11px,3.2vw,14px)] md:text-[13px] bg-black hover:bg-zinc-800 text-white px-[clamp(10px,3.5vw,16px)] md:px-8 py-[10px] md:py-[10px] rounded-3xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                14 Gün Ücretsiz Deneyin
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              </a>
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
            <div className="text-center mb-10 md:mb-16">
              <span className="inline-block text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full mb-3 border border-emerald-500/20">ÖZELLİKLER</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-surface-900 mb-3 md:mb-4">
                Neden Recula?
              </h2>
              <p className="text-sm md:text-base text-surface-600 max-w-2xl mx-auto">
                Modern işe alım süreçleri için tasarlanmış güçlü özellikler
              </p>
            </div>

            {/* Mobile: Simple cards */}
            <div className="md:hidden space-y-3">
              {[...featuresGroup1, ...featuresGroup2].map((f, i) => (
                <div key={i} className="bg-surface-50 border border-surface-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center">
                      <f.icon className="w-4 h-4 text-surface-700" />
                    </div>
                    <h3 className="text-sm font-semibold text-surface-900">{f.title}</h3>
                    {f.badge && (
                      <span className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-medium border ml-auto',
                        f.badge === 'Popüler' && 'bg-amber-500/15 border-amber-500/25 text-amber-700',
                        f.badge === 'Yeni' && 'bg-emerald-500/15 border-emerald-500/25 text-emerald-700'
                      )}>
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-surface-600 pl-12">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Desktop: Accordion with illustrations */}
            <div className="hidden md:block space-y-16">
              {/* Group 1: Text Left, Image Right */}
              <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="space-y-2">
                  {featuresGroup1.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveFeature1(i)}
                      className={cn(
                        'w-full text-left p-5 rounded-2xl transition-all duration-300',
                        activeFeature1 === i 
                          ? 'bg-surface-50 border border-surface-200 shadow-sm' 
                          : 'hover:bg-surface-50/50'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'w-11 h-11 rounded-xl flex items-center justify-center transition-colors',
                          activeFeature1 === i ? 'bg-black text-white' : 'bg-surface-100 text-surface-600'
                        )}>
                          <f.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={cn(
                              'text-base font-semibold transition-colors',
                              activeFeature1 === i ? 'text-surface-900' : 'text-surface-600'
                            )}>
                              {f.title}
                            </h3>
                            {f.badge && (
                              <span className={cn(
                                'text-[10px] px-2 py-0.5 rounded-full font-medium border',
                                f.badge === 'Popüler' && 'bg-amber-500/15 border-amber-500/25 text-amber-700',
                                f.badge === 'Yeni' && 'bg-emerald-500/15 border-emerald-500/25 text-emerald-700'
                              )}>
                                {f.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronDown className={cn(
                          'w-5 h-5 text-surface-400 transition-transform',
                          activeFeature1 === i && 'rotate-180'
                        )} />
                      </div>
                      <div className={cn(
                        'overflow-hidden transition-all duration-300',
                        activeFeature1 === i ? 'max-h-24 opacity-100 mt-3' : 'max-h-0 opacity-0'
                      )}>
                        <p className="text-sm text-surface-600 pl-15 leading-relaxed">{f.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-surface-100 to-surface-50 rounded-3xl aspect-square border border-surface-200 overflow-hidden">
                    <FeatureIllustration1 activeIndex={activeFeature1} />
                  </div>
                </div>
              </div>

              {/* Group 2: Image Left, Text Right */}
              <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="relative order-2 md:order-1">
                  <div className="bg-gradient-to-br from-surface-100 to-surface-50 rounded-3xl aspect-square border border-surface-200 overflow-hidden">
                    <FeatureIllustration2 activeIndex={activeFeature2} />
                  </div>
                </div>
                <div className="space-y-2 order-1 md:order-2">
                  {featuresGroup2.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveFeature2(i)}
                      className={cn(
                        'w-full text-left p-5 rounded-2xl transition-all duration-300',
                        activeFeature2 === i 
                          ? 'bg-surface-50 border border-surface-200 shadow-sm' 
                          : 'hover:bg-surface-50/50'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'w-11 h-11 rounded-xl flex items-center justify-center transition-colors',
                          activeFeature2 === i ? 'bg-black text-white' : 'bg-surface-100 text-surface-600'
                        )}>
                          <f.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className={cn(
                            'text-base font-semibold transition-colors',
                            activeFeature2 === i ? 'text-surface-900' : 'text-surface-600'
                          )}>
                            {f.title}
                          </h3>
                        </div>
                        <ChevronDown className={cn(
                          'w-5 h-5 text-surface-400 transition-transform',
                          activeFeature2 === i && 'rotate-180'
                        )} />
                      </div>
                      <div className={cn(
                        'overflow-hidden transition-all duration-300',
                        activeFeature2 === i ? 'max-h-24 opacity-100 mt-3' : 'max-h-0 opacity-0'
                      )}>
                        <p className="text-sm text-surface-600 pl-15 leading-relaxed">{f.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
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
              <a
                href="https://apprecula.netlify.app/register"
                className="min-w-0 whitespace-nowrap text-[clamp(11px,3.2vw,14px)] md:text-[13px] bg-black hover:bg-zinc-800 text-white px-[clamp(10px,3.5vw,16px)] md:px-8 py-[clamp(9px,2.6vw,12px)] md:py-2.5 rounded-3xl font-medium transition-colors flex items-center justify-center gap-2"
              >
              Ücretsiz Hesap Oluştur
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              </a>
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
