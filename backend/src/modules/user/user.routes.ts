import { Router } from 'express';
import { getMeHandler, updateMeHandler } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const userRouter = Router();

userRouter.get('/me', authMiddleware, getMeHandler);
userRouter.patch('/me', authMiddleware, updateMeHandler);

export default userRouter;
