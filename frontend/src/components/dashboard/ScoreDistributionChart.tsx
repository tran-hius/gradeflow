'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ScoreRange } from '@/types';

interface Props { data: ScoreRange[]; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-md">
        <p className="text-xs text-gray-500">Điểm: <span className="font-semibold text-gray-800">{label}</span></p>
        <p className="text-xs text-gray-500">Số lượng: <span className="font-semibold text-indigo-600">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
};

export function ScoreDistributionChart({ data }: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Phân phối điểm</CardTitle>
        <CardDescription>Số lượng điểm số theo từng khoảng</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
