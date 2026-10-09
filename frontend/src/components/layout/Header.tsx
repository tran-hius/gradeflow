'use client';
import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onAddStudent?: () => void;
  showAddButton?: boolean;
}

export function Header({ title, subtitle, onAddStudent, showAddButton }: HeaderProps) {
  return (
    <header className="flex items-center gap-4 h-14 px-6 bg-white border-b border-gray-100 shrink-0">
      <div className="flex-1">
        <h1 className="text-base font-semibold text-gray-900 leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden />
          <Input placeholder="Search..." className="pl-8 w-52 h-8 text-xs" />
        </div>
        <button
          className="relative flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={16} aria-hidden />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </button>
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold cursor-pointer" aria-label="Account">
          TH
        </div>
        {showAddButton && (
          <Button size="sm" onClick={onAddStudent} className="gap-1.5 text-xs">
            <Plus size={14} aria-hidden />
            Add Student
          </Button>
        )}
      </div>
    </header>
  );
}
