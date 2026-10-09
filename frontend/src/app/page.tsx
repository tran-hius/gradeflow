'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/dashboard/KPICard';
import { ScoreDistributionChart } from '@/components/dashboard/ScoreDistributionChart';
import { SubjectPerformanceChart } from '@/components/dashboard/SubjectPerformanceChart';
import { PerformanceOverviewChart } from '@/components/dashboard/PerformanceOverviewChart';
import { RecentStudentsTable } from '@/components/dashboard/RecentStudentsTable';
import { InsightPanel } from '@/components/dashboard/InsightPanel';
import { studentService } from '@/services/studentService';
import { Student, ScoreRange, SubjectAverage } from '@/types';
import { mean, standardDeviation, getPassRate, getAtRiskCount } from '@/utils/stats';

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-gray-100" />
          <div className="h-7 w-16 rounded bg-gray-200" />
          <div className="h-3 w-32 rounded bg-gray-100" />
        </div>
        <div className="w-9 h-9 rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm animate-pulse">
      <div className="space-y-2 mb-4">
        <div className="h-4 w-32 rounded bg-gray-100" />
        <div className="h-3 w-48 rounded bg-gray-100" />
      </div>
      <div className="h-[200px] rounded-lg bg-gray-50" />
    </div>
  );
}

export default function OverviewPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [scoreRanges, setScoreRanges] = useState<ScoreRange[]>([]);
  const [subjectAverages, setSubjectAverages] = useState<SubjectAverage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      studentService.getAll(),
      studentService.getScoreDistribution(),
      studentService.getSubjectAverages(),
    ]).then(([s, sr, sa]) => {
      setStudents(s);
      setScoreRanges(sr);
      setSubjectAverages(sa);
      setLoading(false);
    });
  }, []);

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
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : kpis.map((kpi, i) => <KPICard key={kpi.title} {...kpi} index={i} />)}
          </div>
        </section>

        {/* Charts */}
        <section aria-label="Charts">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonChart key={i} />)
            ) : (
              <>
                <ScoreDistributionChart data={scoreRanges} />
                <SubjectPerformanceChart data={subjectAverages} />
                <PerformanceOverviewChart students={students} />
              </>
            )}
          </div>
        </section>

        {/* Bottom section */}
        <section aria-label="Recent students and insights">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <motion.div
              className="xl:col-span-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 12 : 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {!loading && <RecentStudentsTable students={recent} />}
              {loading && <SkeletonChart />}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: loading ? 0 : 1, y: loading ? 12 : 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              {!loading && <InsightPanel students={students} subjectAverages={subjectAverages} />}
              {loading && <SkeletonChart />}
            </motion.div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
