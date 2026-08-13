import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { getNotificationsHandler,markAllNotificationAsReadHandler,markNotificationAsReadHandler} from './notification.controller';

const notificationRouter = Router();
notificationRouter.get('/', authMiddleware, getNotificationsHandler);
notificationRouter.patch('/read-all', authMiddleware, markAllNotificationAsReadHandler);
notificationRouter.put('/read-all', authMiddleware, markAllNotificationAsReadHandler);
notificationRouter.patch('/:notificationId/read', authMiddleware, markNotificationAsReadHandler);
notificationRouter.put('/:notificationId/read', authMiddleware, markNotificationAsReadHandler);

export default notificationRouter;