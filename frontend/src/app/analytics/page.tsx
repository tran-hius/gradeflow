import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import GradeFlowAnalytics from '@/components/dashboard/GradeFlowAnalytics';

export default function AnalyticsPage() {
  return (
    <MainLayout>
      <Header
        title="Academic Analytics"
        subtitle="Hệ thống phân tích học thuật & thống kê ma trận điểm số"
      />
      <main className="flex-1 overflow-y-auto">
        <GradeFlowAnalytics />
      </main>
    </MainLayout>
  );
}
