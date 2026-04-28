import express from 'express';
import dotenv from 'dotenv';
import { UserRouter } from './modules/auth/auth.route';

dotenv.config();


const app = express();
app.use(express.json());

app.use('/api/auth', UserRouter);
app.get('/', (req, res) => {
  res.send('Welcome to the Clinic Management System API');
});


export default app;