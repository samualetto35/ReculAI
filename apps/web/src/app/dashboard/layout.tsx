'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Video, 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  Plus,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mülakatlar', href: '/dashboard/interviews', icon: Video },
  { name: 'Adaylar', href: '/dashboard/candidates', icon: Users },
  { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-0 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-surface-200 flex flex-col">
        <div className="p-6 border-b border-surface-200">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="text-lg font-bold text-white">Recula</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-500/10 text-brand-400'
                    : 'text-surface-600 hover:text-white hover:bg-surface-100'
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
            href="/dashboard/interviews/new"
            className="btn-primary w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            Yeni Mülakat
          </Link>
        </div>

        <div className="p-4 border-t border-surface-200">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center">
              <span className="text-brand-400 font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-surface-600 truncate">{user?.company?.name}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-surface-600 hover:text-white transition-colors"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

