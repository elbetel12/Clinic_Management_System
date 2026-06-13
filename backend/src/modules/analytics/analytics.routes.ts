import { Router } from 'express';
import {
    getAnalyticsHandler,
    getSummaryHandler,
    getWeeklyAppointmentsHandler,
    getPatientGrowthHandler,
    getSpecializationBreakdownHandler
} from './analytics.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireAdminOrDoctor } from '../../middlewares/role.middleware';

const analyticsRouter = Router();

// All analytics routes require authentication + admin or doctor role
analyticsRouter.get('/', authMiddleware, requireAdminOrDoctor, getAnalyticsHandler);
analyticsRouter.get('/summary', authMiddleware, requireAdminOrDoctor, getSummaryHandler);
analyticsRouter.get('/weekly-appointments', authMiddleware, requireAdminOrDoctor, getWeeklyAppointmentsHandler);
analyticsRouter.get('/patient-growth', authMiddleware, requireAdminOrDoctor, getPatientGrowthHandler);
analyticsRouter.get('/specializations', authMiddleware, requireAdminOrDoctor, getSpecializationBreakdownHandler);

export default analyticsRouter;
