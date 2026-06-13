import Appointment from '../appointment/appointment.model';
import Doctor from '../doctor/doctor.model';
import User from '../user/user.model';
import {
    AnalyticsSummary,
    WeeklyAppointment,
    PatientGrowth,
    SpecializationBreakdown
} from './analytics.types';

// ─────────────────────────────────────────────
// SUMMARY — Aggregate counts from all collections
// ─────────────────────────────────────────────

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
    const [
        totalPatients,
        totalDoctors,
        totalAppointments,
        completedAppointments,
        cancelledAppointments
    ] = await Promise.all([
        User.countDocuments({ role: 'patient' }),
        Doctor.countDocuments(),
        Appointment.countDocuments(),
        Appointment.countDocuments({ status: 'completed' }),
        Appointment.countDocuments({ status: 'cancelled' })
    ]);

    // Active patients = patients who have at least one appointment in the last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const activePatientIds = await Appointment.distinct('patient', {
        date: { $gte: ninetyDaysAgo }
    });
    const activePatients = activePatientIds.length;

    // Average appointments per day (over last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentAppointments = await Appointment.countDocuments({
        date: { $gte: thirtyDaysAgo }
    });
    const avgAppointmentsPerDay = Math.round(recentAppointments / 30);

    // Patient growth rate: compare this month vs last month registrations
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [thisMonthPatients, lastMonthPatients] = await Promise.all([
        User.countDocuments({ role: 'patient', createdAt: { $gte: startOfThisMonth } }),
        User.countDocuments({
            role: 'patient',
            createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth }
        })
    ]);

    const patientGrowthRate = lastMonthPatients > 0
        ? parseFloat((((thisMonthPatients - lastMonthPatients) / lastMonthPatients) * 100).toFixed(1))
        : 0;

    // Revenue calculation (Mocking price for now: $50 per completed appointment)
    const APPOINTMENT_PRICE = 50;
    const totalRevenue = completedAppointments * APPOINTMENT_PRICE;

    const thisMonthCompleted = await Appointment.countDocuments({
        status: 'completed',
        date: { $gte: startOfThisMonth }
    });
    const monthlyRevenue = thisMonthCompleted * APPOINTMENT_PRICE;

    return {
        totalPatients,
        activePatients,
        totalAppointments,
        completedAppointments,
        cancelledAppointments,
        totalDoctors,
        totalRevenue,
        monthlyRevenue,
        avgAppointmentsPerDay,
        patientGrowthRate
    };
};

// ─────────────────────────────────────────────
// WEEKLY APPOINTMENTS — Last 8 weeks breakdown
// ─────────────────────────────────────────────

export const getWeeklyAppointments = async (): Promise<WeeklyAppointment[]> => {
    const weeks: WeeklyAppointment[] = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (i * 7));
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        const [appointments, completed, cancelled] = await Promise.all([
            Appointment.countDocuments({ date: { $gte: weekStart, $lt: weekEnd } }),
            Appointment.countDocuments({ date: { $gte: weekStart, $lt: weekEnd }, status: 'completed' }),
            Appointment.countDocuments({ date: { $gte: weekStart, $lt: weekEnd }, status: 'cancelled' })
        ]);

        const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        weeks.push({ week: label, appointments, completed, cancelled });
    }

    return weeks;
};

// ─────────────────────────────────────────────
// PATIENT GROWTH — Last 8 months
// ─────────────────────────────────────────────

export const getPatientGrowth = async (): Promise<PatientGrowth[]> => {
    const months: PatientGrowth[] = [];
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

        // Total patients registered up to end of this month
        const patients = await User.countDocuments({
            role: 'patient',
            createdAt: { $lt: monthEnd }
        });

        // New patients in this specific month
        const newPatients = await User.countDocuments({
            role: 'patient',
            createdAt: { $gte: monthStart, $lt: monthEnd }
        });

        const label = monthStart.toLocaleDateString('en-US', { month: 'short' });
        months.push({ month: label, patients, newPatients });
    }

    return months;
};

// ─────────────────────────────────────────────
// SPECIALIZATION BREAKDOWN — Doctors per specialization
// ─────────────────────────────────────────────

export const getSpecializationBreakdown = async (): Promise<SpecializationBreakdown[]> => {
    const totalDoctors = await Doctor.countDocuments();

    if (totalDoctors === 0) {
        return [];
    }

    const pipeline = await Doctor.aggregate([
        {
            $group: {
                _id: '$specialization',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } }
    ]);

    return pipeline.map((item: { _id: string; count: number }) => ({
        specialization: item._id,
        count: item.count,
        percentage: Math.round((item.count / totalDoctors) * 100)
    }));
};

// ─────────────────────────────────────────────
// COMBINED — All analytics in one call
// ─────────────────────────────────────────────

export const getFullAnalytics = async () => {
    const [summary, weeklyAppointments, patientGrowth, specializationBreakdown] = await Promise.all([
        getAnalyticsSummary(),
        getWeeklyAppointments(),
        getPatientGrowth(),
        getSpecializationBreakdown()
    ]);

    return { summary, weeklyAppointments, patientGrowth, specializationBreakdown };
};
