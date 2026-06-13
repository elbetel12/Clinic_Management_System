// ─────────────────────────────────────────────
// ANALYTICS — Response Types
// ─────────────────────────────────────────────

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
}

export interface AnalyticsSummary {
    totalPatients: number;
    activePatients: number;
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    totalDoctors: number;
    totalRevenue: number;
    monthlyRevenue: number;
    avgAppointmentsPerDay: number;
    patientGrowthRate: number;
}

export interface AnalyticsResponse {
    success: boolean;
    data: {
        summary: AnalyticsSummary;
        weeklyAppointments: WeeklyAppointment[];
        patientGrowth: PatientGrowth[];
        specializationBreakdown: SpecializationBreakdown[];
    };
}
