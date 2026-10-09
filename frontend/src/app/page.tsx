import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/dashboard/KPICard';
import { RecentStudentsTable } from '@/components/dashboard/RecentStudentsTable';
import { InsightPanel } from '@/components/dashboard/InsightPanel';
import { studentService } from '@/services/studentService';
import { mean, standardDeviation, getPassRate, getAtRiskCount } from '@/utils/stats';
import { FadeIn } from '@/components/ui/fade-in';
import dynamic from 'next/dynamic';

import {
  ScoreDistributionChart,
  SubjectPerformanceChart,
  PerformanceOverviewChart
} from '@/components/dashboard/LazyCharts';

export default async function OverviewPage() {
  const [students, scoreRanges, subjectAverages] = await Promise.all([
    studentService.getAll(),
    studentService.getScoreDistribution(),
    studentService.getSubjectAverages(),
  ]);

  const gpas = students.map(s => s.gpa);
  const kpis = [
    {
      title: 'Total Students',
      value: students.length.toLocaleString(),
      description: 'Tổng số sinh viên đang theo dõi',
      icon: 'Users',
      variant: 'default' as const,
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Average GPA',
      value: mean(gpas).toFixed(2),
      description: `Độ lệch chuẩn: ${standardDeviation(gpas).toFixed(2)}`,
      icon: 'Star',
      variant: 'info' as const,
      trend: { value: 3, isPositive: true },
    },
    {
      title: 'Pass Rate',
      value: `${getPassRate(students, 5).toFixed(1)}%`,
      description: 'Tỷ lệ đạt điểm ≥ 5.0',
      icon: 'TrendingUp',
      variant: 'success' as const,
    },
    {
      title: 'Students At Risk',
      value: getAtRiskCount(students, 2),
      description: 'Sinh viên GPA < 2.0 cần hỗ trợ',
      icon: 'AlertTriangle',
      variant: 'warning' as const,
      trend: { value: 5, isPositive: false },
    },
  ];

  const recent = [...students].slice(0, 8);

  return (
    <MainLayout>
      <Header title="Overview" subtitle="Tổng quan kết quả học tập" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI Cards */}
        <section aria-label="KPI metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
              <KPICard key={kpi.title} {...kpi} index={i} />
            ))}
          </div>
        </section>

        {/* Charts */}
        <section aria-label="Charts">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ScoreDistributionChart data={scoreRanges} />
            <SubjectPerformanceChart data={subjectAverages} />
            <PerformanceOverviewChart students={students} />
          </div>
        </section>

        {/* Bottom section */}
        <section aria-label="Recent students and insights">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <FadeIn className="xl:col-span-2" delay={0.3}>
              <RecentStudentsTable students={recent} />
            </FadeIn>
            <FadeIn delay={0.4}>
              <InsightPanel students={students} subjectAverages={subjectAverages} />
            </FadeIn>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
