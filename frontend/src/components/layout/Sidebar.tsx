'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  ChartColumn,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: ChartColumn },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-white border-r border-gray-100 overflow-hidden shrink-0 z-30"
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 shrink-0">
            <GraduationCap size={15} className="text-white" aria-hidden />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-gray-900 whitespace-nowrap overflow-hidden text-sm"
              >
                GradeFlow
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5" role="navigation" aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                size={18}
                className={cn('shrink-0 transition-colors', active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600')}
                aria-hidden
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.18 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-gray-100">
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="flex items-center justify-center w-full h-8 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
}
