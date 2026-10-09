'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SubjectAverage } from '@/types';

interface Props { data: SubjectAverage[]; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>
            {p.name}: <span className="font-semibold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function SubjectPerformanceChart({ data }: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Điểm trung bình theo môn</CardTitle>
        <CardDescription>So sánh điểm TB, cao nhất và thấp nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
            <Bar dataKey="average" name="Trung bình" fill="#6366f1" radius={[3, 3, 0, 0]} />
            <Bar dataKey="highest" name="Cao nhất" fill="#a5b4fc" radius={[3, 3, 0, 0]} />
            <Bar dataKey="lowest" name="Thấp nhất" fill="#e0e7ff" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
