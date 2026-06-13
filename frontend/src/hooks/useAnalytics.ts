import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

// ─── Types ────────────────────────────────────────────────────
export interface WeeklyAppointment {
  week: string;
  appointments: number;
  completed: number;
  cancelled: number;
}

export interface PatientGrowth {
  month: string;
  patients: number;
  newPatients: number;
}

export interface SpecializationBreakdown {
  specialization: string;
  count: number;
  percentage: number;
  fill: string;
}

export interface AnalyticsSummary {
  totalPatients: number;
  activePatients: number;
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  avgAppointmentsPerDay: number;
  patientGrowthRate: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  weeklyAppointments: WeeklyAppointment[];
  patientGrowth: PatientGrowth[];
  specializationBreakdown: SpecializationBreakdown[];
}

// ─── Mock Data ────────────────────────────────────────────────
const SPECIALIZATION_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
];

const generateMockData = (): AnalyticsData => ({
  summary: {
    totalPatients: 1284,
    activePatients: 847,
    totalAppointments: 3621,
    completedAppointments: 3104,
    totalRevenue: 284500,
    monthlyRevenue: 24800,
    avgAppointmentsPerDay: 18,
    patientGrowthRate: 12.4,
  },
  weeklyAppointments: [
    { week: 'Apr 1', appointments: 42, completed: 35, cancelled: 4 },
    { week: 'Apr 8', appointments: 58, completed: 48, cancelled: 6 },
    { week: 'Apr 15', appointments: 51, completed: 44, cancelled: 3 },
    { week: 'Apr 22', appointments: 67, completed: 55, cancelled: 7 },
    { week: 'Apr 29', appointments: 74, completed: 61, cancelled: 8 },
    { week: 'May 6', appointments: 83, completed: 70, cancelled: 5 },
    { week: 'May 13', appointments: 79, completed: 66, cancelled: 9 },
    { week: 'May 20', appointments: 91, completed: 78, cancelled: 6 },
  ],
  patientGrowth: [
    { month: 'Oct', patients: 820, newPatients: 68 },
    { month: 'Nov', patients: 892, newPatients: 72 },
    { month: 'Dec', patients: 941, newPatients: 49 },
    { month: 'Jan', patients: 1023, newPatients: 82 },
    { month: 'Feb', patients: 1098, newPatients: 75 },
    { month: 'Mar', patients: 1187, newPatients: 89 },
    { month: 'Apr', patients: 1241, newPatients: 54 },
    { month: 'May', patients: 1284, newPatients: 43 },
  ],
  specializationBreakdown: [
    { specialization: 'General Practice', count: 28, percentage: 31, fill: SPECIALIZATION_COLORS[0] },
    { specialization: 'Cardiology', count: 18, percentage: 20, fill: SPECIALIZATION_COLORS[1] },
    { specialization: 'Pediatrics', count: 14, percentage: 16, fill: SPECIALIZATION_COLORS[2] },
    { specialization: 'Dermatology', count: 11, percentage: 12, fill: SPECIALIZATION_COLORS[3] },
    { specialization: 'Orthopedics', count: 9, percentage: 10, fill: SPECIALIZATION_COLORS[4] },
    { specialization: 'Neurology', count: 6, percentage: 7, fill: SPECIALIZATION_COLORS[5] },
    { specialization: 'Other', count: 4, percentage: 4, fill: SPECIALIZATION_COLORS[6] },
  ],
});

import { getFullAnalytics } from '../services/analyticsService';

// ─── Hook ─────────────────────────────────────────────────────
export const useAnalytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const realData = await getFullAnalytics();
      
      // Ensure specialization breakdown has colors for the UI
      if (realData.specializationBreakdown) {
        realData.specializationBreakdown = realData.specializationBreakdown.map((item, index) => ({
          ...item,
          fill: SPECIALIZATION_COLORS[index % SPECIALIZATION_COLORS.length]
        }));
      }

      setData(realData);
    } catch (e: any) {
      console.error('Analytics Fetch Error:', e);
      setError(e.response?.data?.message || 'Failed to load real-time analytics data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'doctor') {
      fetchAnalytics();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const canViewAnalytics = user?.role === 'admin' || user?.role === 'doctor';

  return { data, isLoading, error, canViewAnalytics, refreshAnalytics: fetchAnalytics };
};
