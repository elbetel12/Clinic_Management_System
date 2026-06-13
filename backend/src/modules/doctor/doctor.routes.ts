import { Router } from 'express';
import { createDoctorHandler, getDoctorsHandler, updateDoctorProfileHandler } from './doctor.controller';
import { validateRequest } from '../../middlewares/validate.middlewares';
import { DoctorSchema } from './doctor.validation';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireAdmin, requireDoctor } from '../../middlewares/role.middleware';

const doctorRouter = Router();

doctorRouter.post('/', authMiddleware, requireAdmin, validateRequest(DoctorSchema), createDoctorHandler);
doctorRouter.get('/', getDoctorsHandler);
doctorRouter.patch('/profile', authMiddleware, requireDoctor, updateDoctorProfileHandler);

export default doctorRouter;