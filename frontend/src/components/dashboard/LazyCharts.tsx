'use client';
import dynamic from 'next/dynamic';

export const ScoreDistributionChart = dynamic(
  () => import('./ScoreDistributionChart').then(mod => mod.ScoreDistributionChart),
  { ssr: false }
);

export const SubjectPerformanceChart = dynamic(
  () => import('./SubjectPerformanceChart').then(mod => mod.SubjectPerformanceChart),
  { ssr: false }
);

export const PerformanceOverviewChart = dynamic(
  () => import('./PerformanceOverviewChart').then(mod => mod.PerformanceOverviewChart),
  { ssr: false }
);
