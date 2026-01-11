'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Sun, Moon, Send, MessageSquare, Clock, Sparkles } from 'lucide-react';
import { useTheme } from '../providers';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MobileNavMenu } from '@/components/MobileNavMenu';

const contactMethods = [
  { icon: Mail, title: 'E-posta', value: 'info@asyncview.com', desc: '24 saat içinde yanıt' },
  { icon: Phone, title: 'Telefon', value: '+90 212 123 45 67', desc: 'Pazartesi-Cuma, 09:00-18:00' },
  { icon: MapPin, title: 'Adres', value: 'İstanbul, Türkiye', desc: 'Maslak, Sarıyer' },
];

export default function ContactPage() {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess(true);
    setLoading(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
            <Link href="/contact" className="text-sm text-surface-900 font-medium">
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
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20 pb-10 md:pb-14">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs md:text-sm mb-6">
              <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>7/24 Destek</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 mb-4">
              Bize Ulaşın
            </h1>
            <p className="text-base md:text-lg text-surface-600">
              Sorularınız mı var? Size yardımcı olmaktan mutluluk duyarız.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-8 md:py-12">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-6">
              {contactMethods.map((method, i) => (
                <div key={i} className="bg-surface-50 border border-surface-200 rounded-xl p-3 md:p-6 text-center hover:border-surface-300 transition-colors">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center mx-auto mb-2 md:mb-4 bg-zinc-100">
                    <method.icon className="w-4 h-4 md:w-6 md:h-6 text-zinc-700" />
                  </div>
                  <h3 className="text-xs md:text-lg font-semibold text-surface-900 mb-1">{method.title}</h3>
                  <p className="text-[11px] md:text-base text-surface-900 font-medium leading-snug">{method.value}</p>
                  <p className="hidden md:block text-xs md:text-sm text-surface-500">{method.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-10 md:py-16 border-t border-surface-200/50">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Info */}
              <div>
                <span className="inline-block text-xs font-medium text-fuchsia-700 dark:text-fuchsia-300 bg-fuchsia-500/10 px-3 py-1 rounded-full mb-4 border border-fuchsia-500/20">İLETİŞİM</span>
                <h2 className="text-2xl md:text-3xl font-semibold text-surface-900 mb-4">Mesaj Gönderin</h2>
                <p className="text-sm md:text-base text-surface-600 mb-6">
                  Sorularınız, önerileriniz veya demo talepleriniz için bize yazın. En kısa sürede size dönüş yapacağız.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-zinc-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">Çalışma Saatleri</p>
                      <p className="text-xs text-surface-600">Pazartesi - Cuma: 09:00 - 18:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-zinc-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-surface-900">Yanıt Süresi</p>
                      <p className="text-xs text-surface-600">Genellikle 24 saat içinde</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="bg-surface-50 border border-surface-200 rounded-xl p-5 md:p-6">
                {success ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-7 h-7 text-zinc-700" />
                    </div>
                    <h3 className="text-lg font-semibold text-surface-900 mb-2">Mesajınız Gönderildi!</h3>
                    <p className="text-sm text-surface-600 mb-4">En kısa sürede size dönüş yapacağız.</p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-sm text-zinc-700 hover:text-zinc-900 font-medium"
                    >
                      Yeni mesaj gönder
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs md:text-sm text-surface-600 mb-1.5 block">Ad Soyad</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-surface-0 border border-surface-200 rounded-lg px-3 py-2.5 text-sm text-surface-900 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                          placeholder="Adınız"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs md:text-sm text-surface-600 mb-1.5 block">E-posta</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-surface-0 border border-surface-200 rounded-lg px-3 py-2.5 text-sm text-surface-900 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                          placeholder="ornek@email.com"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm text-surface-600 mb-1.5 block">Konu</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-surface-0 border border-surface-200 rounded-lg px-3 py-2.5 text-sm text-surface-900 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                        required
                      >
                        <option value="">Konu seçin</option>
                        <option value="demo">Demo Talebi</option>
                        <option value="sales">Satış</option>
                        <option value="support">Teknik Destek</option>
                        <option value="partnership">İş Ortaklığı</option>
                        <option value="other">Diğer</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm text-surface-600 mb-1.5 block">Mesaj</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full bg-surface-0 border border-surface-200 rounded-lg px-3 py-2.5 text-sm text-surface-900 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 resize-none"
                        placeholder="Mesajınızı yazın..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black hover:bg-zinc-800 disabled:opacity-50 text-white text-sm md:text-base font-medium py-2.5 md:py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
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
