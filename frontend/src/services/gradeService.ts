import apiClient from '@/lib/axios';

export type RawScoreRecord = {
  student_id: number;
  subject: string;
  score: number;
};

export type GradeMatrixData = {
  student_ids: number[];
  student_names: string[];
  subjects: string[];
  raw_scores: RawScoreRecord[];
};

export const gradeService = {
  /**
   * Lấy toàn bộ ma trận điểm phục vụ phân tích
   */
  async getMatrix(): Promise<GradeMatrixData> {
    try {
      const { data } = await apiClient.get<GradeMatrixData>('/grades/matrix');
      return data;
    } catch (error) {
      console.warn('[gradeService.getMatrix] Fallback empty matrix on error/prerender');
      return {
        student_ids: [],
        student_names: [],
        subjects: ['math', 'physics', 'chemistry', 'english', 'literature'],
        raw_scores: [],
      };
    }
  },

  /**
   * Lấy danh sách điểm của một sinh viên
   */
  async getStudentGrades(studentId: number) {
    try {
      const { data } = await apiClient.get(`/grades/students/${studentId}`);
      return data;
    } catch {
      return null;
    }
  },
};
