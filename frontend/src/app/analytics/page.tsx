'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScoreDistributionChart } from '@/components/dashboard/ScoreDistributionChart';
import { SubjectPerformanceChart } from '@/components/dashboard/SubjectPerformanceChart';
import { studentService } from '@/services/studentService';
import { Student, SubjectAverage, ScoreRange } from '@/types';
import { mean, standardDeviation } from '@/utils/stats';
import { getStatusLabel, getStatusColor, formatGPA } from '@/utils/stats';
import { AlertCircle, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold tabular-nums text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjectAverages, setSubjectAverages] = useState<SubjectAverage[]>([]);
  const [scoreRanges, setScoreRanges] = useState<ScoreRange[]>([]);
  const [threshold, setThreshold] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      studentService.getAll(),
      studentService.getSubjectAverages(),
      studentService.getScoreDistribution(),
    ]).then(([s, sa, sr]) => {
      setStudents(s);
      setSubjectAverages(sa);
      setScoreRanges(sr);
      setLoading(false);
    });
  }, []);

  const gpas = students.map(s => s.gpa);
  const avgGpa = mean(gpas);
  const stdDev = standardDeviation(gpas);
  const belowThreshold = useMemo(() => students.filter(s => s.gpa < threshold), [students, threshold]);

  return (
    <MainLayout>
      <Header title="Analytics" subtitle="Phân tích thống kê chi tiết" />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary stats */}
        <section aria-label="Statistical summary">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: loading ? 0 : 1, y: loading ? 10 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <StatCard label="GPA Trung bình" value={avgGpa.toFixed(3)} sub="Toàn bộ sinh viên" />
            <StatCard label="Độ lệch chuẩn" value={stdDev.toFixed(3)} sub="Mức phân tán điểm số" />
            <StatCard label="GPA cao nhất" value={Math.max(...gpas, 0).toFixed(1)} sub="Sinh viên xuất sắc nhất" />
            <StatCard label="GPA thấp nhất" value={Math.min(...gpas, 0).toFixed(1)} sub="Sinh viên cần hỗ trợ" />
          </motion.div>
        </section>

        {/* Charts */}
        <section aria-label="Analytics charts">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {!loading && (
              <>
                <ScoreDistributionChart data={scoreRanges} />
                <SubjectPerformanceChart data={subjectAverages} />
              </>
            )}
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
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-orange-500" aria-hidden />
                  Sinh viên dưới ngưỡng điểm
                </CardTitle>
                <CardDescription>
                  {belowThreshold.length} sinh viên có GPA &lt; {threshold}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-gray-400" aria-hidden />
                <label htmlFor="threshold-slider" className="sr-only">Ngưỡng GPA</label>
                <input
                  id="threshold-slider"
                  type="range"
                  min={1}
                  max={4}
                  step={0.5}
                  value={threshold}
                  onChange={e => setThreshold(Number(e.target.value))}
                  className="w-28 accent-indigo-600"
                  aria-valuemin={1}
                  aria-valuemax={4}
                  aria-valuenow={threshold}
                />
                <span className="text-xs font-semibold text-indigo-600 w-8">{threshold}</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {belowThreshold.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">Không có sinh viên nào dưới ngưỡng {threshold}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {['Mã SV', 'Họ và tên', 'Lớp', 'GPA', 'Xếp loại'].map(col => (
                          <th key={col} className="text-left text-xs font-semibold text-gray-400 px-5 py-3">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {belowThreshold.slice(0, 20).map(s => (
                        <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-orange-50/30 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs text-gray-500">{s.studentId}</td>
                          <td className="px-5 py-3 text-xs font-medium text-gray-800">{s.name}</td>
                          <td className="px-5 py-3 text-xs text-gray-500">{s.class}</td>
                          <td className="px-5 py-3 text-xs font-bold text-red-500 tabular-nums">{formatGPA(s.gpa)}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(s.status)}`}>
                              {getStatusLabel(s.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {belowThreshold.length > 20 && (
                    <p className="text-xs text-center text-gray-400 py-3">Và {belowThreshold.length - 20} sinh viên khác...</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </MainLayout>
  );
}
