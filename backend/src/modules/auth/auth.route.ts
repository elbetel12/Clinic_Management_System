import express from 'express';
import { CreateUser } from './auth.controller';
import { validateRequest } from '../../middlewares/validate.middlewares';
import { registerSchema } from './auth.validation';

const router = express.Router();

export const UserRouter = router.post('/register',validateRequest(registerSchema), CreateUser);

export default router;