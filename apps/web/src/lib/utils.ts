import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-500/10 border-green-500/20';
  if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
  if (score >= 40) return 'bg-orange-500/10 border-orange-500/20';
  return 'bg-red-500/10 border-red-500/20';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-surface-400',
    ACTIVE: 'bg-green-500',
    PAUSED: 'bg-yellow-500',
    CLOSED: 'bg-red-500',
    ARCHIVED: 'bg-surface-500',
    INVITED: 'bg-blue-500',
    STARTED: 'bg-yellow-500',
    IN_PROGRESS: 'bg-orange-500',
    COMPLETED: 'bg-green-500',
    EXPIRED: 'bg-red-500',
    DISQUALIFIED: 'bg-red-500',
  };
  return colors[status] || 'bg-surface-400';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: 'Taslak',
    ACTIVE: 'Aktif',
    PAUSED: 'Duraklatıldı',
    CLOSED: 'Kapatıldı',
    ARCHIVED: 'Arşivlendi',
    INVITED: 'Davet Edildi',
    STARTED: 'Başladı',
    IN_PROGRESS: 'Devam Ediyor',
    COMPLETED: 'Tamamlandı',
    EXPIRED: 'Süresi Doldu',
    DISQUALIFIED: 'Diskalifiye',
    PENDING: 'Beklemede',
    SHORTLISTED: 'Kısa Liste',
    REJECTED: 'Reddedildi',
    HIRED: 'İşe Alındı',
  };
  return labels[status] || status;
}

export async function uploadWithProgress(
  url: string,
  file: Blob,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
}

