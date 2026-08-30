import React from 'react';
import { cn, getRiskColor } from '../../utils';
import { RiskLevel, CaseStatus } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'risk' | 'status' | 'outline';
  level?: RiskLevel;
  status?: CaseStatus;
}

export function Badge({ className, variant = 'default', level, status, children, ...props }: BadgeProps) {
  let variantClasses = '';

  if (variant === 'risk' && level) {
    variantClasses = getRiskColor(level);
  } else if (variant === 'status' && status) {
    switch (status) {
      case 'OPEN':
        variantClasses = 'bg-blue-100 text-blue-800 border-blue-200';
        break;
      case 'INVESTIGATING':
        variantClasses = 'bg-amber-100 text-amber-800 border-amber-200';
        break;
      case 'ESCALATED':
        variantClasses = 'bg-rose-100 text-rose-800 border-rose-200';
        break;
      case 'CLEARED':
        variantClasses = 'bg-emerald-100 text-emerald-800 border-emerald-200';
        break;
      case 'MONITORING':
        variantClasses = 'bg-purple-100 text-purple-800 border-purple-200';
        break;
    }
  } else if (variant === 'outline') {
    variantClasses = 'border border-[#d4cec3] text-[#6b584b] bg-transparent';
  } else {
    variantClasses = 'bg-[#f5f4ef] text-[#3b2b20] border-transparent';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantClasses,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
