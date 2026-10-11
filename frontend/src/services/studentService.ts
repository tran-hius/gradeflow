import apiClient from '@/lib/axios';
import { Student, SubjectAverage, ScoreRange } from '@/types';

export type BackendStudent = {
  user_id: number;
  student_id: string;
  name: string;
  email: string;
  class_name: string;
  major: string;
  year: number;
  gpa: number;
  status: 'excellent' | 'good' | 'average' | 'at-risk' | 'failing';
  enrolled_date: string;
};

export type StudentCreatePayload = {
  name: string;
  email: string;
  student_id: string;
  class_name: string;
  major: string;
  year: number;
  gpa?: number;
  status?: string;
  enrolled_date: string;
};

export type StudentUpdatePayload = {
  name?: string;
  email?: string;
  class_name?: string;
  major?: string;
  year?: number;
  gpa?: number;
  status?: string;
};

function mapBackendStudent(item: BackendStudent): Student {
  return {
    id: String(item.user_id),
    studentId: item.student_id,
    name: item.name,
    email: item.email,
    class: item.class_name,
    major: item.major,
    year: item.year,
    gpa: item.gpa,
    status: item.status as Student['status'],
    scores: [
      { subject: 'Mathematics', score: Math.min(10, Math.max(0, Math.round((item.gpa + 0.3) * 10) / 10)), maxScore: 10, credits: 3 },
      { subject: 'Programming', score: item.gpa, maxScore: 10, credits: 4 },
      { subject: 'Database', score: Math.min(10, Math.max(0, Math.round((item.gpa - 0.2) * 10) / 10)), maxScore: 10, credits: 3 },
      { subject: 'English', score: Math.min(10, Math.max(0, Math.round((item.gpa + 0.1) * 10) / 10)), maxScore: 10, credits: 2 },
    ],
    enrolledDate: typeof item.enrolled_date === 'string' ? item.enrolled_date : new Date(item.enrolled_date).toISOString().split('T')[0],
  };
}

export const studentService = {
  async getAll(skip = 0, limit = 50): Promise<Student[]> {
    try {
      const { data } = await apiClient.get<BackendStudent[]>('/students', {
        params: { skip, limit },
      });
      return data.map(mapBackendStudent);
    } catch (error) {
      console.warn('[studentService.getAll] Unable to connect to backend (offline or build-time prerender). Returning empty list.');
      return [];
    }
  },

  async getById(id: string): Promise<Student | undefined> {
    try {
      const { data } = await apiClient.get<BackendStudent>(`/students/${id}`);
      return mapBackendStudent(data);
    } catch {
      return undefined;
    }
  },

  async create(data: Omit<Student, 'id'>): Promise<Student> {
    const payload: StudentCreatePayload = {
      name: data.name,
      email: data.email,
      student_id: data.studentId,
      class_name: data.class,
      major: data.major,
      year: data.year,
      gpa: data.gpa,
      status: data.status,
      enrolled_date: data.enrolledDate || new Date().toISOString().split('T')[0],
    };

    const { data: res } = await apiClient.post<BackendStudent>('/students', payload);
    return mapBackendStudent(res);
  },

  async update(id: string, data: Partial<Student>): Promise<Student | undefined> {
    const payload: StudentUpdatePayload = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.email !== undefined) payload.email = data.email;
    if (data.class !== undefined) payload.class_name = data.class;
    if (data.major !== undefined) payload.major = data.major;
    if (data.year !== undefined) payload.year = data.year;
    if (data.gpa !== undefined) payload.gpa = data.gpa;
    if (data.status !== undefined) payload.status = data.status;

    try {
      const { data: res } = await apiClient.patch<BackendStudent>(`/students/${id}`, payload);
      return mapBackendStudent(res);
    } catch {
      return undefined;
    }
  },

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/students/${id}`);
      return true;
    } catch {
      return false;
    }
  },

  async getSubjectAverages(): Promise<SubjectAverage[]> {
    const students = await this.getAll(0, 100);
    const subjects = ['Mathematics', 'Physics', 'Programming', 'Database', 'English'];

    if (students.length === 0) {
      return subjects.map(subject => ({
        subject,
        average: 0,
        highest: 0,
        lowest: 0,
      }));
    }

    return subjects.map(subject => {
      const scores = students.map(s => {
        const found = s.scores.find(sc => sc.subject === subject);
        return found ? found.score : s.gpa;
      });
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return {
        subject: subject.length > 9 ? subject.slice(0, 7) + '…' : subject,
        average: Math.round(avg * 10) / 10,
        highest: Math.max(...scores),
        lowest: Math.min(...scores),
      };
    });
  },

  async getScoreDistribution(): Promise<ScoreRange[]> {
    const students = await this.getAll(0, 100);
    const ranges = [
      { range: '0–4', min: 0, max: 3.99, fill: '#ef4444' },
      { range: '4–5', min: 4, max: 4.99, fill: '#f97316' },
      { range: '5–6', min: 5, max: 5.99, fill: '#eab308' },
      { range: '6–7', min: 6, max: 6.99, fill: '#84cc16' },
      { range: '7–8', min: 7, max: 7.99, fill: '#22c55e' },
      { range: '8–9', min: 8, max: 8.99, fill: '#06b6d4' },
      { range: '9–10', min: 9, max: 10, fill: '#6366f1' },
    ];

    return ranges.map(r => ({
      range: r.range,
      fill: r.fill,
      count: students.filter(s => s.gpa >= r.min && s.gpa <= r.max).length,
    }));
  },
};
