import React from 'react';
import { Info, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Student, SubjectAverage } from '@/types';

interface Props { students: Student[]; subjectAverages: SubjectAverage[]; }

export function InsightPanel({ students, subjectAverages }: Props) {
  const worstSubject = [...subjectAverages].sort((a, b) => a.average - b.average)[0];
  const bestSubject = [...subjectAverages].sort((a, b) => b.average - a.average)[0];
  const atRisk = students.filter(s => s.status === 'at-risk' || s.status === 'failing');
  const excellent = students.filter(s => s.status === 'excellent');

  const insights = [
    {
      icon: AlertCircle,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      text: `${atRisk.length} sinh viên đang trong diện cảnh báo hoặc yếu kém.`,
    },
    {
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      text: `Môn có điểm TB thấp nhất: ${worstSubject?.subject ?? 'N/A'} (${worstSubject?.average ?? 0} điểm).`,
    },
    {
      icon: TrendingUp,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
      text: `Môn xuất sắc nhất: ${bestSubject?.subject ?? 'N/A'} (${bestSubject?.average ?? 0} điểm).`,
    },
    {
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-50',
      text: `${excellent.length} sinh viên đạt học lực xuất sắc — chiếm ${((excellent.length / students.length) * 100).toFixed(1)}%.`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhận xét tự động</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-start gap-3">
              <div className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${item.bg}`}>
                <Icon size={14} className={item.color} aria-hidden />
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pt-1">{item.text}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
