export type SubjectScore = {
  subject: string;
  score: number;
  maxScore: number;
  credits: number;
};

export type Student = {
  id: string;
  studentId: string;
  name: string;
  email: string;
  class: string;
  major: string;
  year: number;
  gpa: number;
  status: 'excellent' | 'good' | 'average' | 'at-risk' | 'failing';
  scores: SubjectScore[];
  enrolledDate: string;
};

export type ScoreRange = {
  range: string;
  count: number;
  fill: string;
};

export type SubjectAverage = {
  subject: string;
  average: number;
  highest: number;
  lowest: number;
};
