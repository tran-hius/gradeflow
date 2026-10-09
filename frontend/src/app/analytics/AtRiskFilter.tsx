'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertCircle, SlidersHorizontal } from 'lucide-react';
import { Student } from '@/types';
import { getStatusLabel, getStatusColor, formatGPA } from '@/utils/stats';

export function AtRiskFilter({ students }: { students: Student[] }) {
  const [threshold, setThreshold] = useState(5);
  const belowThreshold = useMemo(() => students.filter(s => s.gpa < threshold), [students, threshold]);

  return (
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
  );
}
