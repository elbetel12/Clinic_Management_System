import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.route';
import bodyParser from 'body-parser';
import doctorRouter from './modules/doctor/doctor.routes';
import appointmentRouter from './modules/appointment/appointment.routes';

dotenv.config();


const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRouter);
app.use('/api/appointments', appointmentRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Clinic Management System API');
});


export default app;