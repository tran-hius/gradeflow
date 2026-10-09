'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Users, Star, TrendingUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

const ICON_MAP: Record<string, React.ElementType> = {
  Users,
  Star,
  TrendingUp,
  AlertTriangle,
};

interface KPICardProps {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  trend?: { value: number; isPositive: boolean };
  index?: number;
  variant?: 'default' | 'warning' | 'success' | 'info';
}

const variantStyles = {
  default: { icon: 'bg-indigo-50 text-indigo-600', text: 'text-gray-900' },
  warning: { icon: 'bg-orange-50 text-orange-500', text: 'text-gray-900' },
  success: { icon: 'bg-green-50 text-green-600', text: 'text-gray-900' },
  info: { icon: 'bg-blue-50 text-blue-600', text: 'text-gray-900' },
};

export function KPICard({ title, value, description, icon, trend, index = 0, variant = 'default' }: KPICardProps) {
  const Icon = ICON_MAP[icon] || Users;
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{title}</p>
          <p className={cn('text-2xl font-bold tabular-nums', styles.text)}>{value}</p>
          <p className="text-xs text-gray-400 mt-1 truncate">{description}</p>
        </div>
        <div className={cn('flex items-center justify-center w-9 h-9 rounded-lg shrink-0 ml-3', styles.icon)}>
          <Icon size={18} aria-hidden />
        </div>
      </div>
      {trend && (
        <div className={cn('flex items-center gap-1 mt-3 text-xs font-medium', trend.isPositive ? 'text-green-600' : 'text-red-500')}>
          {trend.isPositive ? <ArrowUpRight size={13} aria-hidden /> : <ArrowDownRight size={13} aria-hidden />}
          <span>{Math.abs(trend.value)}% so với tháng trước</span>
        </div>
      )}
    </motion.div>
  );
}
