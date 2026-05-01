import { Router } from 'express';
import { createAppointmentHandler, getAppointmentsHandler,getAppointmentsByDoctorHandler,getAppointmentsByPatientHandler } from './appointment.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middlewares';
import { AppointmentSchema } from './appointment.validate';

const appointmentRouter = Router(); 
appointmentRouter.post('/', authMiddleware, validateRequest(AppointmentSchema), createAppointmentHandler);
appointmentRouter.get('/', authMiddleware, getAppointmentsHandler);
appointmentRouter.get('/doctor/:doctorId', authMiddleware, getAppointmentsByDoctorHandler);
appointmentRouter.get('/patient/:patientId', authMiddleware, getAppointmentsByPatientHandler);

export default appointmentRouter;