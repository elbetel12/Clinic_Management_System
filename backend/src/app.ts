import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.route';
import bodyParser from 'body-parser';
import doctorRouter from './modules/doctor/doctor.routes';
import appointmentRouter from './modules/appointment/appointment.routes';
import analyticsRouter from './modules/analytics/analytics.routes';
import cors from 'cors';

import userRouter from './modules/user/user.routes';

dotenv.config();


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/analytics', analyticsRouter);

// 3. Add this Global Error Handler at the bottom
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});


export default app;