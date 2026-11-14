import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  variant?: 'primary' | 'secondary' | 'emerald' | 'amber' | 'crimson';
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = 'primary' }: StatCardProps) {
  const getColors = () => {
    switch (variant) {
      case 'secondary':
        return {
          bg: 'bg-purple-50',
          text: 'text-brand-secondaryDark',
          border: 'border-purple-200',
          iconBg: 'bg-brand-secondary/20',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          iconBg: 'bg-emerald-100',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          iconBg: 'bg-amber-100',
        };
      case 'crimson':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          iconBg: 'bg-rose-100',
        };
      case 'primary':
      default:
        return {
          bg: 'bg-brand-bgLight',
          text: 'text-brand-primary',
          border: 'border-brand-border',
          iconBg: 'bg-brand-primary/10',
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`p-5 rounded-2xl bg-white border ${colors.border} shadow-xs hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-text mt-1">{value}</p>
          {subtitle && <p className="text-xs text-brand-muted mt-1">{subtitle}</p>}
          {trend && (
            <span className="inline-block mt-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {trend}
            </span>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl ${colors.iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
}

