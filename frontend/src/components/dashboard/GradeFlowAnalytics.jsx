'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  Sliders,
  Download,
  RefreshCw,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Zap,
  Flame,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  TrendingDown,
  Trophy,
  Medal,
  UserCheck,
  GraduationCap,
  Scale,
  Activity,
  Layers,
  Filter,
} from 'lucide-react';

// ============================================================================
// 1. MOCK DATA CONTRACT (DỮ LIỆU ĐẶC TẢ TƯƠNG THÍCH HOÀN TOÀN API NUMPY/PANDAS)
// ============================================================================
export const mockAnalyticsData = {
  summary: {
    totalStudents: 120,
    overallMean: 7.24, // Bài 01: np.nanmean(matrix)
    passRate: 88.5, // Bài 07: (np.sum(student_gpas >= 5.0) / N) * 100
    overallStd: 1.42, // Bài 06: np.nanstd(matrix)
    maxGpa: 9.68, // Bài 05: np.nanmax(student_gpas)
    valedictorian: 'Nguyễn Minh Quang (SV1024)',
    atRiskCount: 14, // Bài 12: np.sum(at_risk_mask)
    medianGpa: 7.35, // Bài 10: np.percentile(student_gpas, 50)
    top10Cutoff: 8.85, // Bài 10: np.percentile(student_gpas, 90)
    top25Cutoff: 8.12, // Bài 10: np.percentile(student_gpas, 75)
  },

  // TAB 1: Phổ điểm & Xếp loại
  histogram: [
    { range: '0–4', count: 4, label: 'Kém', color: '#ef4444' },
    { range: '4–5', count: 10, label: 'Yếu', color: '#f97316' },
    { range: '5–6', count: 22, label: 'Trung bình', color: '#eab308' },
    { range: '6–7', count: 35, label: 'TB Khá', color: '#84cc16' },
    { range: '7–8', count: 28, label: 'Khá', color: '#10b981' },
    { range: '8–9', count: 15, label: 'Giỏi', color: '#06b6d4' },
    { range: '9–10', count: 6, label: 'Xuất sắc', color: '#6366f1' },
  ],
  academicRanks: [
    {
      rank: 'Xuất sắc',
      criteria: 'GPA ≥ 8.5',
      count: 18,
      percentage: 15.0,
      color: 'bg-indigo-600',
      textColor: 'text-indigo-600',
    },
    {
      rank: 'Giỏi',
      criteria: '7.0 ≤ GPA < 8.5',
      count: 42,
      percentage: 35.0,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
    },
    {
      rank: 'Khá',
      criteria: '6.0 ≤ GPA < 7.0',
      count: 32,
      percentage: 26.7,
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
    },
    {
      rank: 'Trung bình',
      criteria: '5.0 ≤ GPA < 6.0',
      count: 16,
      percentage: 13.3,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
    },
    {
      rank: 'Yếu',
      criteria: 'GPA < 5.0',
      count: 12,
      percentage: 10.0,
      color: 'bg-rose-500',
      textColor: 'text-rose-600',
    },
  ],

  // TAB 2: Phân tích môn học
  subjects: [
    {
      code: 'math',
      name: 'Toán học',
      credits: 4,
      mean: 6.45,
      std: 1.95,
      highest: 9.9,
      lowest: 1.5,
      passRate: 78.5,
      zScoreMean: 0.0,
      zScoreStd: 1.0,
      isHardest: true, // Điểm TB thấp nhất & độ phân tán std cao nhất
      topStudent: 'Đỗ Anh Dũng (9.9)',
      boxPlot: { min: 1.5, q1: 5.2, median: 6.5, q3: 7.8, max: 9.9 },
    },
    {
      code: 'physics',
      name: 'Vật lý đại cương',
      credits: 3,
      mean: 6.85,
      std: 1.72,
      highest: 9.8,
      lowest: 2.5,
      passRate: 83.2,
      isHardest: false,
      topStudent: 'Nguyễn Minh Quang (9.8)',
      boxPlot: { min: 2.5, q1: 5.8, median: 6.9, q3: 8.0, max: 9.8 },
    },
    {
      code: 'chemistry',
      name: 'Hóa học đại cương',
      credits: 3,
      mean: 7.1,
      std: 1.55,
      highest: 9.6,
      lowest: 2.8,
      passRate: 87.5,
      isHardest: false,
      topStudent: 'Trần Thị Thảo Nhi (9.6)',
      boxPlot: { min: 2.8, q1: 6.2, median: 7.2, q3: 8.2, max: 9.6 },
    },
    {
      code: 'english',
      name: 'Tiếng Anh chuyên ngành',
      credits: 2,
      mean: 7.65,
      std: 1.38,
      highest: 9.9,
      lowest: 3.2,
      passRate: 92.4,
      isHardest: false,
      topStudent: 'Nguyễn Hải Yến (9.9)',
      boxPlot: { min: 3.2, q1: 6.8, median: 7.7, q3: 8.6, max: 9.9 },
    },
    {
      code: 'literature',
      name: 'Ngữ văn & Giao tiếp',
      credits: 2,
      mean: 7.95,
      std: 1.15,
      highest: 9.8,
      lowest: 4.0,
      passRate: 96.0,
      isHardest: false,
      topStudent: 'Võ Mai Phương (9.8)',
      boxPlot: { min: 4.0, q1: 7.2, median: 8.0, q3: 8.8, max: 9.8 },
    },
  ],

  // TAB 3: Trọng số & Bảng xếp hạng (Leaderboard)
  leaderboard: [
    {
      rank: 1,
      studentId: 'SV1024',
      name: 'Nguyễn Minh Quang',
      className: 'K65-CNTT',
      rawGpa: 9.55,
      weightedGpa: 9.68,
      percentileTier: 'Thủ khoa',
      badgeColor: 'gold',
      std: 0.32,
      avatarColor: 'bg-amber-500',
    },
    {
      rank: 2,
      studentId: 'SV1089',
      name: 'Trần Thị Thảo Nhi',
      className: 'K65-KHMT',
      rawGpa: 9.42,
      weightedGpa: 9.52,
      percentileTier: 'Á khoa',
      badgeColor: 'silver',
      std: 0.45,
      avatarColor: 'bg-slate-500',
    },
    {
      rank: 3,
      studentId: 'SV1156',
      name: 'Lê Hoàng Long',
      className: 'K65-CNTT',
      rawGpa: 9.25,
      weightedGpa: 9.38,
      percentileTier: 'Top 3',
      badgeColor: 'bronze',
      std: 0.58,
      avatarColor: 'bg-amber-700',
    },
    {
      rank: 4,
      studentId: 'SV1042',
      name: 'Phạm Thu Trang',
      className: 'K65-HTTT',
      rawGpa: 9.1,
      weightedGpa: 9.22,
      percentileTier: 'Top 5%',
      badgeColor: 'indigo',
      std: 0.62,
      avatarColor: 'bg-indigo-600',
    },
    {
      rank: 5,
      studentId: 'SV1205',
      name: 'Hoàng Quốc Bảo',
      className: 'K65-KTPM',
      rawGpa: 8.95,
      weightedGpa: 9.08,
      percentileTier: 'Top 5%',
      badgeColor: 'indigo',
      std: 0.7,
      avatarColor: 'bg-indigo-500',
    },
    {
      rank: 6,
      studentId: 'SV1077',
      name: 'Đặng Kim Ngân',
      className: 'K65-CNTT',
      rawGpa: 8.85,
      weightedGpa: 8.95,
      percentileTier: 'Top 10%',
      badgeColor: 'teal',
      std: 0.74,
      avatarColor: 'bg-teal-600',
    },
    {
      rank: 7,
      studentId: 'SV1112',
      name: 'Vũ Đức Thịnh',
      className: 'K65-KHMT',
      rawGpa: 8.7,
      weightedGpa: 8.82,
      percentileTier: 'Top 10%',
      badgeColor: 'teal',
      std: 0.81,
      avatarColor: 'bg-teal-500',
    },
    {
      rank: 8,
      studentId: 'SV1033',
      name: 'Bùi Phương Linh',
      className: 'K65-HTTT',
      rawGpa: 8.55,
      weightedGpa: 8.64,
      percentileTier: 'Top 25%',
      badgeColor: 'slate',
      std: 0.85,
      avatarColor: 'bg-slate-600',
    },
  ],

  // TAB 4: Cảnh báo & Học lệch
  alerts: {
    // Red Alert Center (nguy cơ bị cảnh cáo / buộc thôi học)
    atRiskStudents: [
      {
        studentId: 'SV2011',
        name: 'Trần Văn Nam',
        className: 'K65-CNTT',
        gpa: 3.45,
        minScore: 2.1,
        failingCount: 3,
        failingSubjects: ['Toán (2.1)', 'Vật lý (3.5)', 'Hóa học (4.0)'],
        riskLevel: 'CRITICAL',
        riskReason: '3 môn thi dưới 5.0 & Điểm liệt Toán (2.1 < 3.0)',
        actionRecommendation: 'Gặp cố vấn học tập khẩn cấp • Cảnh báo buộc thôi học',
      },
      {
        studentId: 'SV2045',
        name: 'Lê Minh Tuấn',
        className: 'K65-KTPM',
        gpa: 4.2,
        minScore: 2.5,
        failingCount: 2,
        failingSubjects: ['Toán (2.5)', 'Vật lý (4.5)'],
        riskLevel: 'HIGH',
        riskReason: '2 môn thi dưới 5.0 & Điểm liệt Toán (2.5 < 3.0)',
        actionRecommendation: 'Buộc đăng ký học lại kỳ phụ • Ký cam kết học tập',
      },
      {
        studentId: 'SV2088',
        name: 'Ngô Thanh Sơn',
        className: 'K65-KHMT',
        gpa: 4.8,
        minScore: 3.2,
        failingCount: 2,
        failingSubjects: ['Vật lý (4.2)', 'Hóa học (4.5)'],
        riskLevel: 'MEDIUM',
        riskReason: '2 môn thi dưới 5.0 chuẩn đầu ra',
        actionRecommendation: 'Ôn thi cải thiện điểm trong vòng 30 ngày',
      },
      {
        studentId: 'SV2102',
        name: 'Phạm Duy Hưng',
        className: 'K65-HTTT',
        gpa: 4.6,
        minScore: 2.8,
        failingCount: 1,
        failingSubjects: ['Toán (2.8)'],
        riskLevel: 'HIGH',
        riskReason: 'Bị điểm liệt môn chuyên ngành (< 3.0)',
        actionRecommendation: 'Đăng ký học trả nợ môn Toán học',
      },
    ],

    // Học lệch (ptp = np.ptp >= 3.5)
    imbalancedStudents: [
      {
        studentId: 'SV3012',
        name: 'Đỗ Anh Dũng',
        className: 'K65-CNTT',
        gpa: 6.84,
        ptp: 7.8,
        bestSubject: 'Toán học',
        bestScore: 9.9,
        worstSubject: 'Ngữ văn',
        worstScore: 2.1,
        severity: 'Học lệch rất nặng',
        suggestion: 'Học bổ trợ gấp kỹ năng viết luận & thuyết trình Ngữ văn',
      },
      {
        studentId: 'SV3044',
        name: 'Nguyễn Hải Yến',
        className: 'K65-KHMT',
        gpa: 7.12,
        ptp: 6.5,
        bestSubject: 'Tiếng Anh',
        bestScore: 9.8,
        worstSubject: 'Vật lý',
        worstScore: 3.3,
        severity: 'Học lệch nặng',
        suggestion: 'Kèm cặp giải bài tập Vật lý đại cương theo nhóm học tập',
      },
      {
        studentId: 'SV3080',
        name: 'Lý Quốc Huy',
        className: 'K65-KTPM',
        gpa: 6.45,
        ptp: 4.6,
        bestSubject: 'Hóa học',
        bestScore: 8.8,
        worstSubject: 'Toán học',
        worstScore: 4.2,
        severity: 'Học lệch',
        suggestion: 'Củng cố nền tảng Đại số tuyến tính và Giải tích',
      },
      {
        studentId: 'SV3105',
        name: 'Võ Mai Phương',
        className: 'K65-HTTT',
        gpa: 7.3,
        ptp: 4.0,
        bestSubject: 'Ngữ văn',
        bestScore: 9.2,
        worstSubject: 'Toán học',
        worstScore: 5.2,
        severity: 'Học lệch nhẹ',
        suggestion: 'Cân đối lại thời gian tự học giữa các khối môn',
      },
    ],

    // Xu hướng phong độ (np.polyfit slope)
    performanceTrend: [
      { semester: 'Kỳ 1 (2024.1)', avgGpa: 7.45, atRiskRate: 7.5, topGpa: 9.6 },
      { semester: 'Kỳ 2 (2024.2)', avgGpa: 7.32, atRiskRate: 9.2, topGpa: 9.55 },
      { semester: 'Kỳ 3 (2025.1)', avgGpa: 7.18, atRiskRate: 11.8, topGpa: 9.62 },
      { semester: 'Kỳ 4 (2025.2)', avgGpa: 7.24, atRiskRate: 10.4, topGpa: 9.68 },
    ],
    trendSlope: -0.068,
    trendNote: 'Slope < 0 (-0.068 điểm/kỳ): Phong độ toàn khóa đang có xu hướng giảm nhẹ qua các học kỳ gần đây.',
  },
};

// ============================================================================
// 2. MAIN COMPONENT: GradeFlowAnalytics
// ============================================================================
export default function GradeFlowAnalytics({ data = mockAnalyticsData }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'subjects' | 'weighted' | 'alerts'
  const [selectedSubject, setSelectedSubject] = useState(data.subjects[0]?.code || 'math');
  const [creditWeights, setCreditWeights] = useState({
    math: 4,
    physics: 3,
    chemistry: 3,
    english: 2,
    literature: 2,
  });

  // Tìm môn học khó nhất
  const hardestSubject = useMemo(() => {
    return data.subjects.find(s => s.isHardest) || data.subjects[0];
  }, [data.subjects]);

  // Dữ liệu Radar so sánh độ khó các môn
  const radarData = useMemo(() => {
    return data.subjects.map(s => ({
      subject: s.name,
      'Điểm TB': s.mean,
      'Độ phân tán (σ*4)': Number((s.std * 4).toFixed(1)),
      'Tỷ lệ trượt (%)': Number(((100 - s.passRate) / 10).toFixed(1)),
    }));
  }, [data.subjects]);

  // Tính lại Weighted GPA tương tác mô phỏng np.average()
  const liveLeaderboard = useMemo(() => {
    const totalWeights = Object.values(creditWeights).reduce((a, b) => a + b, 0);
    return data.leaderboard.map(student => {
      // Dynamic simulated fluctuation based on weights
      const adjustment = (creditWeights.math - 3) * 0.04 + (creditWeights.physics - 3) * 0.02;
      const dynamicWeighted = Math.min(10.0, Math.max(0, Number((student.weightedGpa + adjustment).toFixed(2))));
      return {
        ...student,
        currentWeighted: dynamicWeighted,
      };
    }).sort((a, b) => b.currentWeighted - a.currentWeighted);
  }, [data.leaderboard, creditWeights]);

  // Export report
  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `GradeFlow_Analytics_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/70 px-6 py-6 font-sans text-slate-800 space-y-6">

        {/* HEADER & TOP CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <Sparkles size={20} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  GradeFlow <span className="text-indigo-600 font-medium">Academic Analytics</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Phân tích học thuật chuyên sâu & xử lý ma trận điểm số sinh viên
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
            >
              <RefreshCw size={13} />
              Làm mới
            </button>
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
            >
              <Download size={13} />
              Xuất báo cáo JSON
            </button>
          </div>
        </div>

        {/* 4 NAVIGATION TABS */}
        <div className="flex items-center p-1 bg-slate-200/60 rounded-xl max-w-fit overflow-x-auto border border-slate-200/70">
          {[
            { id: 'overview', label: 'Tổng quan & Phổ điểm', icon: TrendingUp },
            { id: 'subjects', label: 'Phân tích môn học', icon: BookOpen },
            { id: 'weighted', label: 'Trọng số & Xếp hạng', icon: Award },
            { id: 'alerts', label: 'Cảnh báo & Học lệch', icon: AlertTriangle, badge: data.summary.atRiskCount },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: TỔNG QUAN & PHỔ ĐIỂM (OVERVIEW & HISTOGRAM) */}
        {/* ==================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 5 KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
              {/* Card 1: Mean */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-colors">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Điểm TB Toàn trường</span>
                  <div className="p-1 rounded-md bg-indigo-50 text-indigo-600">
                    <Sparkles size={13} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-indigo-600 tabular-nums">
                  {data.summary.overallMean}
                </div>
                <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                  <span className="font-mono text-indigo-500">Bài 01</span> • np.nanmean()
                </div>
              </div>

              {/* Card 2: Pass Rate */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-colors">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Tỷ lệ Đạt chuẩn</span>
                  <div className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={13} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-emerald-600 tabular-nums">
                  {data.summary.passRate}%
                </div>
                <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                  <span className="font-mono text-emerald-500">Bài 07</span> • np.sum(GPA ≥ 5.0)
                </div>
              </div>

              {/* Card 3: Std */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Độ phân tán (Std σ)</span>
                  <div className="p-1 rounded-md bg-slate-100 text-slate-600">
                    <Activity size={13} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-800 tabular-nums">
                  {data.summary.overallStd}
                </div>
                <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                  <span className="font-mono text-slate-600">Bài 06</span> • np.nanstd(matrix)
                </div>
              </div>

              {/* Card 4: Top GPA */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-200 transition-colors">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">GPA Cao nhất</span>
                  <div className="p-1 rounded-md bg-amber-50 text-amber-600">
                    <Trophy size={13} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 tabular-nums">
                  {data.summary.maxGpa}
                </div>
                <div className="mt-1 text-[11px] text-amber-600 font-medium truncate">
                  {data.summary.valedictorian}
                </div>
              </div>

              {/* Card 5: At Risk */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-rose-200 transition-colors sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-medium">Cần hỗ trợ học vụ</span>
                  <div className="p-1 rounded-md bg-rose-50 text-rose-600">
                    <AlertTriangle size={13} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-rose-600 tabular-nums">
                  {data.summary.atRiskCount} <span className="text-xs text-rose-400 font-normal">SV</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                  <span className="font-mono text-rose-500">Bài 12</span> • GPA &lt; 5.0 hoặc liệt
                </div>
              </div>
            </div>

            {/* Score Histogram & Academic Ranking (12 cols: 8 + 4) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
              {/* Phổ điểm Histogram (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <span>Phổ Điểm Thống Kê (Score Histogram)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        np.histogram()
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Số lượng sinh viên phân bố theo 7 khoảng điểm GPA tiêu chuẩn
                    </p>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    Tổng: <strong className="text-slate-800">{data.summary.totalStudents}</strong> SV
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.histogram}
                      margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="range"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const item = payload[0].payload;
                            return (
                              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs space-y-1">
                                <p className="font-semibold text-slate-800">
                                  Khoảng điểm: {item.range} ({item.label})
                                </p>
                                <p className="text-indigo-600 font-bold">
                                  {item.count} sinh viên (
                                  {((item.count / data.summary.totalStudents) * 100).toFixed(1)}%)
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {data.histogram.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Xếp loại Học lực Card (4 cols - 1/3 width) */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <span>Xếp Loại Học Lực</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-700">
                        np.select()
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Phân loại 5 bậc theo quy chế học vụ
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 pt-1">
                  {data.academicRanks.map(item => (
                    <div key={item.rank} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-slate-700">{item.rank}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({item.criteria})</span>
                        </div>
                        <span className="font-bold tabular-nums text-slate-900">
                          {item.count} <span className="text-[11px] font-normal text-slate-400">({item.percentage}%)</span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Tỷ lệ Khá - Giỏi - Xuất sắc:</span>
                  <span className="font-semibold text-emerald-600">
                    {(
                      data.academicRanks
                        .slice(0, 3)
                        .reduce((acc, r) => acc + r.percentage, 0)
                    ).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: PHÂN TÍCH MÔN HỌC (SUBJECT ANALYTICS) */}
        {/* ==================================================================== */}
        {activeTab === 'subjects' && (
          <div className="space-y-6">
            {/* Top Insight Card: Độ khó môn học */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50/70 via-orange-50/50 to-white border border-rose-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-200">
                  <Flame size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                      Môn học có độ khó cao nhất (Hardest Subject)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-100 text-rose-800">
                      min(mean) & max(std)
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {hardestSubject.name} ({hardestSubject.credits} tín chỉ)
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Điểm trung bình thấp nhất: <strong className="text-rose-600">{hardestSubject.mean}</strong> | 
                    Độ lệch chuẩn cao nhất: <strong className="text-slate-800">{hardestSubject.std}</strong> | 
                    Tỷ lệ qua môn: <strong className="text-slate-800">{hardestSubject.passRate}%</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <div className="text-right">
                  <div className="text-[11px] text-slate-500">Thủ khoa môn</div>
                  <div className="text-xs font-semibold text-slate-800">{hardestSubject.topStudent}</div>
                </div>
              </div>
            </div>

            {/* Radar Chart & Bar Chart so sánh 5 môn học */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart so sánh Điểm TB và Std */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <span>So Sánh Điểm TB & Độ Lệch Chuẩn (σ)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700">
                        mean(axis=0), std()
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Đo lường năng lực tiếp thu và độ phân hóa đề thi giữa 5 môn
                    </p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.subjects}
                      margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                      barCategoryGap="20%"
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 10]}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="mean" name="Điểm TB" fill="#6366f1" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="std" name="Độ lệch chuẩn (σ)" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radar Chart Đánh giá Độ khó Đa Chiều */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <span>Đánh Giá Độ Khó Đa Chiều (Radar Profile)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                        Multi-Factor
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      So sánh Điểm TB, Độ phân tán và Tỷ lệ trượt giữa các môn
                    </p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#475569' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 9 }} />
                      <Radar
                        name="Điểm TB"
                        dataKey="Điểm TB"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.4}
                      />
                      <Radar
                        name="Độ phân tán (σ*4)"
                        dataKey="Độ phân tán (σ*4)"
                        stroke="#f59e0b"
                        fill="#f59e0b"
                        fillOpacity={0.3}
                      />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bảng Chi Tiết Môn Học & Visual Tag Z-Score */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <span>Bảng So Sánh Các Môn Học & Chuẩn Hóa Z-Score</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700">
                      Z = (X - μ) / σ
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chuẩn hóa đưa điểm các môn về phân phối chuẩn chuẩn tắc N(0, 1) để so sánh khách quan
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                    <tr>
                      <th className="px-5 py-3">Môn học</th>
                      <th className="px-5 py-3 text-center">Tín chỉ</th>
                      <th className="px-5 py-3 text-right">Điểm TB (μ)</th>
                      <th className="px-5 py-3 text-right">Độ lệch chuẩn (σ)</th>
                      <th className="px-5 py-3 text-center">Độ phân hóa</th>
                      <th className="px-5 py-3 text-right">Cao / Thấp</th>
                      <th className="px-5 py-3 text-center">Tỷ lệ qua môn</th>
                      <th className="px-5 py-3 text-center">Chuẩn hóa Z-Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.subjects.map(sub => {
                      const isHighStd = sub.std >= 1.8;
                      return (
                        <tr
                          key={sub.code}
                          className={`hover:bg-slate-50/60 transition-colors ${
                            sub.isHardest ? 'bg-rose-50/20' : ''
                          }`}
                        >
                          <td className="px-5 py-3.5 font-medium text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{sub.name}</span>
                              {sub.isHardest && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                                  Khó nhất
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-center font-mono text-slate-600 font-semibold">
                            {sub.credits}
                          </td>
                          <td className="px-5 py-3.5 text-right font-bold text-indigo-600 tabular-nums">
                            {sub.mean.toFixed(2)}
                          </td>
                          <td className="px-5 py-3.5 text-right font-mono text-slate-700 tabular-nums">
                            {sub.std.toFixed(2)}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                isHighStd
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {isHighStd ? 'Phân hóa mạnh' : 'Đồng đều'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right tabular-nums text-slate-600 font-mono">
                            <span className="text-emerald-600 font-semibold">{sub.highest}</span> /{' '}
                            <span className="text-rose-500 font-semibold">{sub.lowest}</span>
                          </td>
                          <td className="px-5 py-3.5 text-center font-semibold tabular-nums text-slate-800">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                sub.passRate >= 90
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : sub.passRate >= 80
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {sub.passRate}%
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              <span>μ=0.0</span> | <span>σ=1.0</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: TRỌNG SỐ & XẾP HẠNG (WEIGHTED GPA & LEADERBOARD) */}
        {/* ==================================================================== */}
        {activeTab === 'weighted' && (
          <div className="space-y-6">
            {/* 3 Summary Cards: Mốc Percentile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-500">GPA Trung Vị (Median)</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">
                    {data.summary.medianGpa}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    np.percentile(grades, 50)
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Scale size={20} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-500">Mốc Điểm Cắt Top 10%</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
                    ≥ {data.summary.top10Cutoff}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    np.percentile(grades, 90)
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Trophy size={20} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-500">Mốc Điểm Cắt Top 25%</div>
                  <div className="text-2xl font-bold text-teal-600 mt-1 tabular-nums">
                    ≥ {data.summary.top25Cutoff}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    np.percentile(grades, 75)
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Award size={20} />
                </div>
              </div>
            </div>

            {/* Interactive Weight Simulator */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders size={16} className="text-indigo-600" />
                  <h3 className="text-sm font-semibold text-slate-800">
                    Mô Phỏng Trọng Số Tín Chỉ Tức Thì (Vector Dot Product)
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700">
                  np.average(matrix, weights=credits, axis=1)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Kéo thanh trượt để thay đổi số tín chỉ từng môn; bảng xếp hạng phía dưới sẽ tự động tính lại thứ hạng theo NumPy argsort:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {data.subjects.map(sub => (
                  <div
                    key={sub.code}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{sub.name}</span>
                      <span className="font-bold font-mono text-indigo-600">
                        {creditWeights[sub.code]} tín
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={6}
                      step={1}
                      value={creditWeights[sub.code]}
                      onChange={e =>
                        setCreditWeights(prev => ({
                          ...prev,
                          [sub.code]: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Trophy size={16} className="text-amber-500" />
                    <span>Bảng Vinh Danh Top Sinh Viên Xuất Sắc (Leaderboard)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                      np.argsort(-weighted_gpa)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thứ hạng sinh viên được sắp xếp từ cao xuống thấp theo GPA có trọng số
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                    <tr>
                      <th className="px-5 py-3 w-16 text-center">Hạng</th>
                      <th className="px-5 py-3">Sinh viên</th>
                      <th className="px-5 py-3">Mã SV</th>
                      <th className="px-5 py-3">Lớp</th>
                      <th className="px-5 py-3 text-right">GPA Gốc</th>
                      <th className="px-5 py-3 text-right">GPA Trọng số</th>
                      <th className="px-5 py-3 text-right">Độ lệch (σ)</th>
                      <th className="px-5 py-3 text-center">Phân hạng danh hiệu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {liveLeaderboard.map((student, idx) => {
                      const rank = idx + 1;
                      return (
                        <tr
                          key={student.studentId}
                          className={`hover:bg-slate-50/60 transition-colors ${
                            rank <= 3 ? 'bg-amber-50/15' : ''
                          }`}
                        >
                          {/* Rank Icon */}
                          <td className="px-5 py-3.5 text-center">
                            {rank === 1 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold border border-amber-300 shadow-xs">
                                <Trophy size={14} className="text-amber-600" />
                              </span>
                            ) : rank === 2 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold border border-slate-300 shadow-xs">
                                <Medal size={14} className="text-slate-600" />
                              </span>
                            ) : rank === 3 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200 shadow-xs">
                                <Award size={14} className="text-amber-700" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-mono font-semibold">
                                {rank}
                              </span>
                            )}
                          </td>

                          {/* Student Info with Avatar */}
                          <td className="px-5 py-3.5 font-medium text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`h-8 w-8 rounded-full ${student.avatarColor} text-white font-semibold text-xs flex items-center justify-center shadow-xs`}
                              >
                                {student.name
                                  .split(' ')
                                  .slice(-2)
                                  .map(w => w[0])
                                  .join('')}
                              </div>
                              <span className="font-semibold text-slate-900">{student.name}</span>
                            </div>
                          </td>

                          <td className="px-5 py-3.5 font-mono text-slate-500">
                            {student.studentId}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">{student.className}</td>

                          <td className="px-5 py-3.5 text-right font-medium text-slate-600 tabular-nums">
                            {student.rawGpa}
                          </td>

                          <td className="px-5 py-3.5 text-right font-bold text-emerald-600 tabular-nums text-sm">
                            {student.currentWeighted}
                          </td>

                          <td className="px-5 py-3.5 text-right font-mono text-slate-500 tabular-nums">
                            {student.std}
                          </td>

                          {/* Percentile Badges */}
                          <td className="px-5 py-3.5 text-center">
                            {rank === 1 ? (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                👑 Thủ khoa
                              </span>
                            ) : rank === 2 ? (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
                                🥈 Á khoa
                              </span>
                            ) : rank === 3 ? (
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                                🥉 Top 3 Toàn Khóa
                              </span>
                            ) : (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  student.percentileTier.includes('Top 5%')
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                    : student.percentileTier.includes('Top 10%')
                                    ? 'bg-teal-50 text-teal-700 border border-teal-100'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {student.percentileTier}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: CẢNH BÁO & HỌC LỆCH (ALERTS & IMBALANCE) */}
        {/* ==================================================================== */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Widget Cảnh Báo Đỏ (Red Alert Center) */}
            <div className="bg-white rounded-xl border border-rose-200/90 shadow-sm overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">
                    <ShieldAlert size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <span>Cảnh Báo Học Vụ Đỏ (Red Alert Center)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/20 text-white">
                        ≥2 môn &lt; 5.0 HOẶC Điểm liệt &lt; 3.0
                      </span>
                    </h3>
                    <p className="text-xs text-rose-100 mt-0.5">
                      Danh sách sinh viên nguy cơ cao bị cảnh cáo học vụ, đình chỉ thi hoặc buộc thôi học
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white text-rose-700 text-xs font-bold self-start sm:self-auto shadow-xs">
                  {data.alerts.atRiskStudents.length} Sinh viên nguy cơ
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-rose-50/50 border-b border-rose-100 text-rose-900 font-semibold">
                    <tr>
                      <th className="px-5 py-3">Mã SV</th>
                      <th className="px-5 py-3">Họ và tên</th>
                      <th className="px-5 py-3">Lớp</th>
                      <th className="px-5 py-3 text-center">Mức độ</th>
                      <th className="px-5 py-3 text-right">GPA</th>
                      <th className="px-5 py-3 text-right">Điểm thấp nhất</th>
                      <th className="px-5 py-3">Môn thi dưới chuẩn</th>
                      <th className="px-5 py-3">Đề xuất xử lý</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50">
                    {data.alerts.atRiskStudents.map(student => (
                      <tr key={student.studentId} className="hover:bg-rose-50/30 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-slate-700 font-semibold">
                          {student.studentId}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          {student.name}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">{student.className}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              student.riskLevel === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : student.riskLevel === 'HIGH'
                                ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {student.riskLevel}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-rose-600 tabular-nums text-sm">
                          {student.gpa}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-rose-700 tabular-nums">
                          {student.minScore}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {student.failingSubjects.map((sub, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-50 text-rose-700 border border-rose-200"
                              >
                                {sub}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700 font-medium text-[11px]">
                          {student.actionRecommendation}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Thẻ Sinh Viên Học Lệch (Peak-to-Peak ptp >= 3.5) */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" />
                    <span>Phát Hiện Sinh Viên Học Lệch (Imbalance Detection)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200">
                      np.ptp(grades, axis=1) ≥ 3.5
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sinh viên có khoảng chênh lệch giữa điểm cao nhất và thấp nhất lớn bất thường
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold">
                    <tr>
                      <th className="px-5 py-3">Mã SV</th>
                      <th className="px-5 py-3">Họ và tên</th>
                      <th className="px-5 py-3">Lớp</th>
                      <th className="px-5 py-3 text-right">GPA</th>
                      <th className="px-5 py-3 text-right">Khoảng chênh (ptp)</th>
                      <th className="px-5 py-3">Môn trội (Cao nhất)</th>
                      <th className="px-5 py-3">Môn hổng (Thấp nhất)</th>
                      <th className="px-5 py-3">Đề xuất bổ trợ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.alerts.imbalancedStudents.map(student => (
                      <tr key={student.studentId} className="hover:bg-amber-50/30 transition-colors">
                        <td className="px-5 py-3.5 font-mono text-slate-500">{student.studentId}</td>
                        <td className="px-5 py-3.5 font-semibold text-slate-900">{student.name}</td>
                        <td className="px-5 py-3.5 text-slate-600">{student.className}</td>
                        <td className="px-5 py-3.5 text-right font-medium text-slate-800 tabular-nums">
                          {student.gpa}
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-bold text-amber-600 tabular-nums text-sm">
                          Δ {student.ptp.toFixed(1)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ArrowUpRight size={12} /> {student.bestSubject} ({student.bestScore})
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <ArrowDownRight size={12} /> {student.worstSubject} ({student.worstScore})
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700 font-medium">
                          {student.suggestion}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Biểu đồ xu hướng phong độ qua các học kỳ (np.polyfit slope) */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <TrendingDown size={16} className="text-rose-500" />
                    <span>Xu Hướng Phong Độ Toàn Khóa (Performance Trend)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700">
                      np.polyfit(semesters, gpa, 1)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Độ dốc (Slope): <strong className="text-rose-600 font-mono">{data.alerts.trendSlope}</strong> |{' '}
                    {data.alerts.trendNote}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                    <span className="text-slate-600">GPA Trung bình</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="text-slate-600">Tỷ lệ nguy cơ (%)</span>
                  </div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.alerts.performanceTrend}
                    margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="semester"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      domain={[6.5, 8.0]}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 20]}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgGpa"
                      name="GPA TB"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#6366f1' }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="atRiskRate"
                      name="Tỷ lệ nguy cơ (%)"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 4, fill: '#ef4444' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
