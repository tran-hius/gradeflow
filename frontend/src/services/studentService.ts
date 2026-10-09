import { Student, SubjectAverage, ScoreRange } from '@/types';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Programming', 'Database', 'Networks', 'AI/ML'];

function randomScore(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

function getStatus(gpa: number): Student['status'] {
  if (gpa >= 8.5) return 'excellent';
  if (gpa >= 7.0) return 'good';
  if (gpa >= 5.0) return 'average';
  if (gpa >= 3.5) return 'at-risk';
  return 'failing';
}

const CLASSES = ['CS2021A', 'CS2021B', 'CS2022A', 'CS2022B', 'CS2023A', 'CS2023B'];
const MAJORS = ['Computer Science', 'Software Engineering', 'Information Technology', 'Data Science'];
const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương'];
const middleLastNames = [
  'Văn An', 'Thị Bình', 'Quốc Cường', 'Minh Đức', 'Thành Đạt',
  'Hữu Phúc', 'Thị Lan', 'Đức Hùng', 'Văn Long', 'Thị Mai',
  'Quang Minh', 'Thị Ngọc', 'Văn Phong', 'Thị Quyên', 'Đình Sơn',
  'Thị Thanh', 'Văn Tùng', 'Thị Uyên', 'Quang Vinh', 'Thị Xuân',
];

function generateStudents(count: number): Student[] {
  return Array.from({ length: count }, (_, i) => {
    const scores = SUBJECTS.map(subject => ({
      subject,
      score: randomScore(3, 10),
      maxScore: 10,
      credits: Math.floor(Math.random() * 3) + 2,
    }));
    const gpa = Math.round((scores.reduce((a, s) => a + s.score, 0) / scores.length) * 100) / 100;
    return {
      id: `student-${i + 1}`,
      studentId: `SV${String(2021 + Math.floor(i / 50)).slice(-2)}${String(i + 1).padStart(4, '0')}`,
      name: `${firstNames[i % firstNames.length]} ${middleLastNames[i % middleLastNames.length]}`,
      email: `sv${String(i + 1).padStart(4, '0')}@student.edu.vn`,
      class: CLASSES[i % CLASSES.length],
      major: MAJORS[i % MAJORS.length],
      year: 2021 + Math.floor(i / 50),
      gpa,
      status: getStatus(gpa),
      scores,
      enrolledDate: new Date(2021 + Math.floor(i / 50), 8, 1).toISOString().split('T')[0],
    };
  });
}

const MOCK_STUDENTS: Student[] = generateStudents(120);

export const studentService = {
  getAll(): Promise<Student[]> {
    return Promise.resolve([...MOCK_STUDENTS]);
  },

  getById(id: string): Promise<Student | undefined> {
    return Promise.resolve(MOCK_STUDENTS.find(s => s.id === id));
  },

  create(data: Omit<Student, 'id'>): Promise<Student> {
    const newStudent: Student = { ...data, id: `student-${Date.now()}` };
    MOCK_STUDENTS.push(newStudent);
    return Promise.resolve(newStudent);
  },

  update(id: string, data: Partial<Student>): Promise<Student | undefined> {
    const idx = MOCK_STUDENTS.findIndex(s => s.id === id);
    if (idx === -1) return Promise.resolve(undefined);
    MOCK_STUDENTS[idx] = { ...MOCK_STUDENTS[idx], ...data };
    return Promise.resolve(MOCK_STUDENTS[idx]);
  },

  delete(id: string): Promise<boolean> {
    const idx = MOCK_STUDENTS.findIndex(s => s.id === id);
    if (idx === -1) return Promise.resolve(false);
    MOCK_STUDENTS.splice(idx, 1);
    return Promise.resolve(true);
  },

  getSubjectAverages(): Promise<SubjectAverage[]> {
    const result = SUBJECTS.map(subject => {
      const scores = MOCK_STUDENTS.map(s => s.scores.find(sc => sc.subject === subject)?.score ?? 0);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return {
        subject: subject.length > 9 ? subject.slice(0, 7) + '…' : subject,
        average: Math.round(avg * 10) / 10,
        highest: Math.max(...scores),
        lowest: Math.min(...scores),
      };
    });
    return Promise.resolve(result);
  },

  getScoreDistribution(): Promise<ScoreRange[]> {
    const ranges = [
      { range: '0–4', min: 0, max: 3.99, fill: '#ef4444' },
      { range: '4–5', min: 4, max: 4.99, fill: '#f97316' },
      { range: '5–6', min: 5, max: 5.99, fill: '#eab308' },
      { range: '6–7', min: 6, max: 6.99, fill: '#84cc16' },
      { range: '7–8', min: 7, max: 7.99, fill: '#22c55e' },
      { range: '8–9', min: 8, max: 8.99, fill: '#06b6d4' },
      { range: '9–10', min: 9, max: 10, fill: '#6366f1' },
    ];
    const allScores = MOCK_STUDENTS.flatMap(s => s.scores.map(sc => sc.score));
    return Promise.resolve(
      ranges.map(r => ({
        range: r.range,
        fill: r.fill,
        count: allScores.filter(sc => sc >= r.min && sc <= r.max).length,
      }))
    );
  },
};
