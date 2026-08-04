import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.route';
import bodyParser from 'body-parser';
import doctorRouter from './modules/doctor/doctor.routes';
import appointmentRouter from './modules/appointment/appointment.routes';
import analyticsRouter from './modules/analytics/analytics.routes';
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";
import userRouter from './modules/user/user.routes';
import notificationRouter from './modules/notification/notification.routes';

dotenv.config();


const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/notifications',notificationRouter)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export const connectedUsers = new Map<string, string>();

//Socket.IO connection handler
//Every time a client connects, this fires. "socket" represents that specific client's connection.
io.on('connection', (socket) => {
  console.log('A user connected');

  //Handle new message
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    //Broadcast the messge to all connected clients
    io.emit('chat message', msg);
  })
  // Backend needs to do this:
  socket.on('identify', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log("user", connectedUsers)
  })
  //Handle disconnection
  socket.on('disconnect', () => {
    for(let [key,value] of connectedUsers.entries()) {
      if(value === socket.id){
        connectedUsers.delete(key);
        break;
      }
    }
    console.log("disconnected")
  })
})

export { app, server };