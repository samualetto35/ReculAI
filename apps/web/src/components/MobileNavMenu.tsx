'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type MobileNavItem = { label: string; href: string };

export function MobileNavMenu({
  items,
  className,
}: {
  items?: MobileNavItem[];
  className?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const resolvedItems = useMemo<MobileNavItem[]>(
    () =>
      items ?? [
        { label: 'Çözümler', href: '/solutions' },
        { label: 'Fiyatlandırma', href: '/pricing' },
        { label: 'İletişim', href: '/contact' },
        { label: 'Giriş Yap', href: 'https://apprecula.netlify.app/login' },
      ],
    [items]
  );

  useEffect(() => {
    // Close on route change
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menüyü Aç/Kapat"
        aria-expanded={open}
        className="p-2 rounded-3xl bg-surface-100 hover:bg-surface-200 text-surface-700 transition-colors"
      >
        {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Menüyü Kapat"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-surface-0 border-l border-surface-200 shadow-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-semibold text-surface-900">Menü</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Menüyü Kapat"
            className="p-2 rounded-3xl bg-surface-100 hover:bg-surface-200 text-surface-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {resolvedItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-surface-900 hover:bg-surface-100 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-surface-200 text-xs text-surface-500">
              Recula
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


