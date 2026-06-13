import { Request, Response } from 'express';
import {
    getFullAnalytics,
    getAnalyticsSummary,
    getWeeklyAppointments,
    getPatientGrowth,
    getSpecializationBreakdown
} from './analytics.service';

export const getAnalyticsHandler = async (req: Request, res: Response) => {
    try {
        const data = await getFullAnalytics();
        res.status(200).json({ success: true, data });
    } catch (error: Error | unknown) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
    }
};

export const getSummaryHandler = async (req: Request, res: Response) => {
    try {
        const summary = await getAnalyticsSummary();
        res.status(200).json({ success: true, data: summary });
    } catch (error: Error | unknown) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
    }
};

export const getWeeklyAppointmentsHandler = async (req: Request, res: Response) => {
    try {
        const data = await getWeeklyAppointments();
        res.status(200).json({ success: true, data });
    } catch (error: Error | unknown) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
    }
};

export const getPatientGrowthHandler = async (req: Request, res: Response) => {
    try {
        const data = await getPatientGrowth();
        res.status(200).json({ success: true, data });
    } catch (error: Error | unknown) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
    }
};

export const getSpecializationBreakdownHandler = async (req: Request, res: Response) => {
    try {
        const data = await getSpecializationBreakdown();
        res.status(200).json({ success: true, data });
    } catch (error: Error | unknown) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Internal server error' });
    }
};
