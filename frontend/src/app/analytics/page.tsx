import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { studentService } from '@/services/studentService';
import { mean, standardDeviation } from '@/utils/stats';
import { FadeIn } from '@/components/ui/fade-in';
import { AtRiskFilter } from './AtRiskFilter';
import dynamic from 'next/dynamic';

import {
  ScoreDistributionChart,
  SubjectPerformanceChart
} from '@/components/dashboard/LazyCharts';

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold tabular-nums text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default async function AnalyticsPage() {
  const [students, subjectAverages, scoreRanges] = await Promise.all([
    studentService.getAll(),
    studentService.getSubjectAverages(),
    studentService.getScoreDistribution(),
  ]);

  const gpas = students.map(s => s.gpa);
  const avgGpa = mean(gpas);
  const stdDev = standardDeviation(gpas);

  return (
    <MainLayout>
      <Header title="Analytics" subtitle="Phân tích thống kê chi tiết" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary stats */}
        <section aria-label="Statistical summary">
          <FadeIn className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="GPA Trung bình" value={avgGpa.toFixed(3)} sub="Toàn bộ sinh viên" />
            <StatCard label="Độ lệch chuẩn" value={stdDev.toFixed(3)} sub="Mức phân tán điểm số" />
            <StatCard label="GPA cao nhất" value={Math.max(...gpas, 0).toFixed(1)} sub="Sinh viên xuất sắc nhất" />
            <StatCard label="GPA thấp nhất" value={Math.min(...gpas, 0).toFixed(1)} sub="Sinh viên cần hỗ trợ" />
          </FadeIn>
        </section>

        {/* Charts */}
        <section aria-label="Analytics charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ScoreDistributionChart data={scoreRanges} />
            <SubjectPerformanceChart data={subjectAverages} />
          </div>
        </section>

        {/* Subject averages table */}
        <section aria-label="Subject averages">
          <Card>
            <CardHeader>
              <CardTitle>Điểm trung bình theo môn học</CardTitle>
              <CardDescription>Chi tiết điểm cao nhất, thấp nhất và trung bình từng môn</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Môn học', 'Trung bình', 'Cao nhất', 'Thấp nhất'].map(col => (
                        <th key={col} className="text-left text-xs font-semibold text-gray-400 px-5 py-3">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subjectAverages.map(sa => (
                      <tr key={sa.subject} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 text-xs font-medium text-gray-700">{sa.subject}</td>
                        <td className="px-5 py-3 text-xs font-bold tabular-nums text-indigo-600">{sa.average}</td>
                        <td className="px-5 py-3 text-xs tabular-nums text-green-600">{sa.highest.toFixed(1)}</td>
                        <td className="px-5 py-3 text-xs tabular-nums text-red-500">{sa.lowest.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* At-risk threshold filter */}
        <section aria-label="At-risk students">
          <AtRiskFilter students={students} />
        </section>
      </main>
    </MainLayout>
  );
}
