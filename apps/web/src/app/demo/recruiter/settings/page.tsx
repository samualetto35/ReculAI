'use client';

import { useState } from 'react';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', name: 'Profil', icon: User },
  { id: 'company', name: 'Şirket', icon: Building2 },
  { id: 'notifications', name: 'Bildirimler', icon: Bell },
  { id: 'security', name: 'Güvenlik', icon: Shield },
  { id: 'appearance', name: 'Görünüm', icon: Palette },
];

export default function DemoSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Ayarlar</h1>
          <p className="text-surface-600">Hesap ve uygulama ayarlarınızı yönetin</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left',
                    activeTab === tab.id
                      ? 'bg-brand-500/10 text-brand-400'
                      : 'text-surface-600 hover:text-white hover:bg-surface-100'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="card p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Profil Bilgileri</h2>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-brand-500/20 flex items-center justify-center">
                      <span className="text-brand-400 font-bold text-2xl">D</span>
                    </div>
                    <button className="btn-secondary text-sm">
                      Fotoğraf Değiştir
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        defaultValue="Demo Kullanıcı"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        E-posta
                      </label>
                      <input
                        type="email"
                        defaultValue="demo@techcorp.com"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        defaultValue="+90 555 123 4567"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Pozisyon
                      </label>
                      <input
                        type="text"
                        defaultValue="İK Müdürü"
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Şirket Bilgileri</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Şirket Adı
                      </label>
                      <input
                        type="text"
                        defaultValue="TechCorp A.Ş."
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Sektör
                      </label>
                      <select className="input">
                        <option>Teknoloji</option>
                        <option>Finans</option>
                        <option>Sağlık</option>
                        <option>Eğitim</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Çalışan Sayısı
                      </label>
                      <select className="input">
                        <option>1-10</option>
                        <option>11-50</option>
                        <option>51-200</option>
                        <option>201-500</option>
                        <option>500+</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Web Sitesi
                      </label>
                      <input
                        type="url"
                        defaultValue="https://techcorp.com"
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Bildirim Ayarları</h2>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Yeni aday tamamladığında', description: 'Bir aday mülakatını tamamladığında bildirim al', defaultChecked: true },
                      { label: 'AI analizi hazır olduğunda', description: 'AI değerlendirmesi tamamlandığında bildirim al', defaultChecked: true },
                      { label: 'Haftalık özet', description: 'Her hafta mülakat istatistiklerini içeren özet e-posta al', defaultChecked: false },
                      { label: 'Mülakat hatırlatmaları', description: 'Yaklaşan mülakat bitiş tarihleri için hatırlatma al', defaultChecked: true },
                    ].map((item, i) => (
                      <label key={i} className="flex items-start gap-4 p-4 bg-surface-100 rounded-lg cursor-pointer hover:bg-surface-200 transition-colors">
                        <input
                          type="checkbox"
                          defaultChecked={item.defaultChecked}
                          className="w-5 h-5 rounded border-surface-400 bg-surface-200 text-brand-500 focus:ring-brand-500 mt-0.5"
                        />
                        <div>
                          <p className="font-medium text-white">{item.label}</p>
                          <p className="text-sm text-surface-600">{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Güvenlik</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Mevcut Şifre
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Yeni Şifre
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Yeni Şifre (Tekrar)
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-surface-200">
                    <h3 className="font-medium text-white mb-4">İki Faktörlü Doğrulama</h3>
                    <button className="btn-secondary">
                      2FA'yı Etkinleştir
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Görünüm</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-3">
                      Tema
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'dark', name: 'Koyu', color: 'bg-surface-100' },
                        { id: 'light', name: 'Açık', color: 'bg-white' },
                        { id: 'system', name: 'Sistem', color: 'bg-gradient-to-r from-surface-100 to-white' },
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          className={cn(
                            'p-4 rounded-lg border-2 transition-colors',
                            theme.id === 'dark' ? 'border-brand-500' : 'border-surface-300 hover:border-surface-400'
                          )}
                        >
                          <div className={cn('w-full h-12 rounded-md mb-2', theme.color)} />
                          <p className="text-sm font-medium text-white">{theme.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-3">
                      Dil
                    </label>
                    <select className="input max-w-xs">
                      <option>Türkçe</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-surface-200 flex justify-end">
                <button onClick={handleSave} className="btn-primary">
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Kaydedildi
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Değişiklikleri Kaydet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

