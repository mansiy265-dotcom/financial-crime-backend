import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function getRiskColor(level: string): string {
  switch (level.toUpperCase()) {
    case 'LOW':
      return 'text-emerald-800 bg-emerald-100 border-emerald-200';
    case 'MEDIUM':
      return 'text-amber-800 bg-amber-100 border-amber-200';
    case 'HIGH':
      return 'text-orange-800 bg-orange-100 border-orange-200';
    case 'CRITICAL':
      return 'text-rose-800 bg-rose-100 border-rose-200';
    default:
      return 'text-slate-600 bg-slate-100 border-slate-200';
  }
}

export function getRiskHexColor(level: string): string {
  switch (level.toUpperCase()) {
    case 'LOW':
      return '#34d399'; // muted green
    case 'MEDIUM':
      return '#fbbf24'; // muted amber
    case 'HIGH':
      return '#fb923c'; // muted orange
    case 'CRITICAL':
      return '#fb7185'; // muted red
    default:
      return '#94a3b8'; // muted slate
  }
}
