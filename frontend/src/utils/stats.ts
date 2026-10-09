import { Student } from '@/types';

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  return Math.sqrt(mean(values.map(v => Math.pow(v - avg, 2))));
}

export function getPassRate(students: Student[], threshold = 5): number {
  if (students.length === 0) return 0;
  return (students.filter(s => s.gpa >= threshold).length / students.length) * 100;
}

export function getAtRiskCount(students: Student[], threshold = 2): number {
  return students.filter(s => s.gpa < threshold).length;
}

export function getStatusLabel(status: Student['status']): string {
  const labels: Record<Student['status'], string> = {
    excellent: 'Xuất sắc',
    good: 'Giỏi',
    average: 'Trung bình',
    'at-risk': 'Cảnh báo',
    failing: 'Yếu',
  };
  return labels[status];
}

export function getStatusColor(status: Student['status']): string {
  const colors: Record<Student['status'], string> = {
    excellent: 'text-indigo-700 bg-indigo-50',
    good: 'text-green-700 bg-green-50',
    average: 'text-yellow-700 bg-yellow-50',
    'at-risk': 'text-orange-700 bg-orange-50',
    failing: 'text-red-700 bg-red-50',
  };
  return colors[status];
}

export function formatGPA(gpa: number): string {
  return gpa.toFixed(2);
}
