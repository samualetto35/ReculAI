'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Loader2
} from 'lucide-react';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Simulated save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Ayarlar</h1>
        <p className="text-surface-600">
          Hesap ve şirket ayarlarınızı yönetin.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Profil Bilgileri</h2>
              <p className="text-sm text-surface-600">Kişisel bilgilerinizi güncelleyin</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                defaultValue={user?.name}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                defaultValue={user?.email}
                className="input"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Company Settings */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Şirket Bilgileri</h2>
              <p className="text-sm text-surface-600">Şirket ayarlarını düzenleyin</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Şirket Adı
              </label>
              <input
                type="text"
                defaultValue={user?.company?.name}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Bildirimler</h2>
              <p className="text-sm text-surface-600">E-posta bildirim tercihleriniz</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Yeni aday tamamladığında', defaultChecked: true },
              { label: 'AI analizi hazır olduğunda', defaultChecked: true },
              { label: 'Haftalık özet raporu', defaultChecked: false },
            ].map((item, index) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="w-5 h-5 rounded border-surface-400 bg-surface-100 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-surface-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Güvenlik</h2>
              <p className="text-sm text-surface-600">Şifre ve güvenlik ayarları</p>
            </div>
          </div>

          <button className="btn-secondary">
            Şifre Değiştir
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button onClick={handleSave} disabled={loading} className="btn-primary">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <>
                <Save className="w-4 h-4" />
                Kaydedildi!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Kaydet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

