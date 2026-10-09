'use client';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Student } from '@/types';

interface Props { students: Student[]; }

const STATUS_CONFIG = [
  { key: 'excellent', label: 'Xuất sắc', fill: '#6366f1' },
  { key: 'good', label: 'Giỏi', fill: '#22c55e' },
  { key: 'average', label: 'Trung bình', fill: '#eab308' },
  { key: 'at-risk', label: 'Cảnh báo', fill: '#f97316' },
  { key: 'failing', label: 'Yếu', fill: '#ef4444' },
] as const;

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-semibold text-gray-700">{payload[0].name}: <span className="text-indigo-600">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

export function PerformanceOverviewChart({ students }: Props) {
  const data = STATUS_CONFIG.map(cfg => ({
    name: cfg.label,
    value: students.filter(s => s.status === cfg.key).length,
    fill: cfg.fill,
  })).filter(d => d.value > 0);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Phân loại học lực</CardTitle>
        <CardDescription>Tỉ lệ sinh viên theo nhóm kết quả</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={2}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
