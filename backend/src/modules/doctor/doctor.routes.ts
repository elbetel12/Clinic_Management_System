import { Router } from 'express';
import { createDoctorHandler,getDoctorsHandler } from './doctor.controller';
import { validateRequest } from '../../middlewares/validate.middlewares';
import { DoctorSchema } from './doctor.validation';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';

const doctorRouter = Router();

doctorRouter.post('/',authMiddleware,requireAdmin,validateRequest(DoctorSchema),createDoctorHandler);
doctorRouter.get('/',getDoctorsHandler);

export default doctorRouter;