'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Student } from '@/types';
import { getStatusLabel, formatGPA } from '@/utils/stats';

interface Props { students: Student[]; }

const STATUS_VARIANT_MAP: Record<Student['status'], 'default' | 'success' | 'warning' | 'danger' | 'orange' | 'secondary'> = {
  excellent: 'default',
  good: 'success',
  average: 'warning',
  'at-risk': 'orange',
  failing: 'danger',
};

export function RecentStudentsTable({ students }: Props) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Sinh viên gần đây</CardTitle>
          <CardDescription className="mt-1">Danh sách sinh viên được thêm mới nhất</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-xs text-indigo-600 gap-1">
          <Link href="/students">
            Xem tất cả <ArrowUpRight size={13} aria-hidden />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Recent students">
            <thead>
              <tr className="border-b border-gray-100">
                {['Mã SV', 'Họ và tên', 'Lớp', 'GPA', 'Xếp loại'].map(col => (
                  <th key={col} className="text-left text-xs font-semibold text-gray-400 px-5 py-3 first:pl-5 last:pr-5">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 text-xs font-mono text-gray-500">{s.studentId}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 text-xs truncate max-w-[140px]">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500">{s.class}</td>
                  <td className="px-5 py-3 text-xs font-semibold tabular-nums text-gray-800">{formatGPA(s.gpa)}</td>
                  <td className="px-5 py-3">
                    <Badge variant={STATUS_VARIANT_MAP[s.status]}>{getStatusLabel(s.status)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
