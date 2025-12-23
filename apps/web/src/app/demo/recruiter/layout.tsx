'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Video, 
  LayoutDashboard, 
  Users, 
  Settings, 
  Plus,
  Sparkles,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '../../providers';

const navigation = [
  { name: 'Dashboard', href: '/demo/recruiter', icon: LayoutDashboard },
  { name: 'Mülakatlar', href: '/demo/recruiter/interviews', icon: Video },
  { name: 'Adaylar', href: '/demo/recruiter/candidates', icon: Users },
  { name: 'Ayarlar', href: '/demo/recruiter/settings', icon: Settings },
];

export default function DemoRecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-surface-0 flex">
      {/* Demo Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-brand-600 to-purple-600 text-white text-center py-2 text-sm">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Demo Modu - Tüm veriler örnektir</span>
          <Link href="/auth/register" className="underline ml-2 hover:no-underline">
            Gerçek hesap oluştur →
          </Link>
          {/* Theme Toggle in Banner */}
          <button
            onClick={toggleTheme}
            className="ml-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title={theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 border-r border-surface-200 flex flex-col pt-10">
        <div className="p-6 border-b border-surface-200">
          <Link href="/demo" className="flex items-center gap-2 text-surface-600 hover:text-surface-900 mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Demo Seçimi
          </Link>
          <Link href="/demo/recruiter" className="flex items-center gap-3">
            <span className="text-lg font-bold text-surface-900">Recula</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/demo/recruiter' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-500/10 text-brand-400'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-200">
          <Link
            href="/demo/recruiter/interviews/new"
            className="btn-primary w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            Yeni Mülakat
          </Link>
        </div>

        <div className="p-4 border-t border-surface-200">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
              <span className="text-brand-400 font-medium">D</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 truncate">Demo Kullanıcı</p>
              <p className="text-xs text-surface-600 truncate">TechCorp A.Ş.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-10">
        {children}
      </main>
    </div>
  );
}

