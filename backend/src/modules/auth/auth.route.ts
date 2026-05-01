import express from 'express';
import { RegisterHandler } from './auth.controller';
import { validateRequest } from '../../middlewares/validate.middlewares';
import { registerSchema } from './auth.validation';
import { LoginHandler } from './auth.controller';
const router = express.Router();

router.post('/register',validateRequest(registerSchema),RegisterHandler);
router.post('/login',LoginHandler);


export default router;