'use client';

import Link from 'next/link';
import { Users, Briefcase, ArrowRight, Play, Sparkles, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../providers';
import { MobileNavMenu } from '@/components/MobileNavMenu';

export default function DemoPage() {
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

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Canlı Demo Deneyimi</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-surface-900 mb-4">
            Recula'yı Hemen Deneyin
          </h1>
          <p className="text-lg text-surface-600 max-w-2xl mx-auto">
            Kayıt olmadan platformumuzu tam tecrübe edin. İster işe alım uzmanı, 
            ister aday perspektifinden keşfedin.
          </p>
        </motion.div>

        {/* Demo Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recruiter Demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/demo/recruiter" className="block group">
              <div className="card p-8 h-full hover:border-brand-500/50 transition-all duration-300 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-surface-900 mb-3">
                    İK / İşe Alım Uzmanı
                  </h2>
                  
                  <p className="text-surface-600 mb-6">
                    Mülakat oluşturun, adayları yönetin, AI analizlerini inceleyin ve 
                    tüm işe alım sürecini deneyimleyin.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {[
                      'Mülakat oluşturma ve düzenleme',
                      'Aday davet etme ve takip',
                      'Video yanıtları izleme',
                      'AI destekli değerlendirme',
                      'Detaylı raporlama',
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-surface-700">
                        <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-brand-400" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 text-brand-400 font-medium group-hover:gap-4 transition-all">
                    <Play className="w-5 h-5" />
                    <span>Demo'yu Başlat</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Candidate Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/demo/candidate" className="block group">
              <div className="card p-8 h-full hover:border-purple-500/50 transition-all duration-300 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-surface-900 mb-3">
                    Aday Deneyimi
                  </h2>
                  
                  <p className="text-surface-600 mb-6">
                    Gerçek bir aday gibi video mülakat deneyimini yaşayın. 
                    Kamera, mikrofon ve kayıt sürecini test edin.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {[
                      'Mülakat davetini görüntüleme',
                      'Kamera ve mikrofon ayarları',
                      'Sorulara video yanıt verme',
                      'Düşünme süresi kullanma',
                      'Tekrar çekme hakkı',
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-surface-700">
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-purple-400" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 text-purple-400 font-medium group-hover:gap-4 transition-all">
                    <Play className="w-5 h-5" />
                    <span>Mülakata Başla</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-surface-600 mb-4">
            Demo'yu beğendiniz mi? Hemen gerçek hesabınızı oluşturun.
          </p>
          <a href="https://apprecula.netlify.app/register" className="btn-primary text-lg px-8 py-4">
            14 Gün Ücretsiz Deneyin
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </main>
    </div>
  );
}

