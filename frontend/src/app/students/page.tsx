import React from 'react';
import { studentService } from '@/services/studentService';
import StudentsPageClient from './StudentsPageClient';

export default async function StudentsPage() {
  const initialStudents = await studentService.getAll();
  return <StudentsPageClient initialStudents={initialStudents} />;
}
