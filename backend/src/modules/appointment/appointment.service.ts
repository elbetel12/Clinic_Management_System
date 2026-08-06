import { CreateAppointmentInput } from "./appointment.types"
import Appointment from "./appointment.model"
import Doctor from "../doctor/doctor.model";
import { AppointmentStatus } from "./appointment.types";
import Notification from "../notification/notification.model";
import { connectedUsers,io } from "../../app";

export const createAppointment = async (appointmentData: CreateAppointmentInput) => {
        const { doctorId, date, time, patientId } = appointmentData;
  // 1. Validate required fields
    if (!doctorId || !patientId || !date || !time) {
        throw new Error('All fields are required');
    }
    //check if doctor exists
    const doctor = await Doctor.findById(doctorId).select('user');
    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const doctorUserId = doctor.user.toString();

        // 3. Check if slot is already taken (CORE RULE: no double booking)
   const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        date: date,
        time: time,
        status: 'booked'
    });

    if (existingAppointment) {
        throw new Error('This time slot is already booked for the doctor');
    }
    // 4. Create and save the appointment
    const newAppointment = new Appointment({
        doctor: doctorId,
        patient: patientId,
        date: date,
        time: time,
        status: AppointmentStatus.Booked,
        createdAt: new Date()
    });
    await newAppointment.save();

// 1. Create notification in DB
    const notification = new Notification({
        user: doctorUserId,
        type:'success',
        title:'New Appointment Booked',
        message: `Patient has booked an appointment for ${date} at ${time}`,
        isRead:false
    })
    await notification.save();
//2.If Doctor is online,emit real-time 
const doctorSocketId = connectedUsers.get(doctorUserId);
console.log('Doctor socket ID:', doctorSocketId);

if(doctorSocketId) {
    io.to(doctorSocketId).emit('new_notification',{
        id:notification._id,
        title:notification.title,
        message:notification.message,
        type:notification.type,
        time:'just now',
        isRead:false
    });
}
else {
    console.log('Doctor is not online');
}

    return newAppointment;
}

export const getAppointments = async () => {
    return await Appointment.find().populate(['doctor', 'patient']);
}   

export const getAppointmentsByDoctor = async (userId: string) => {
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
        throw new Error('Doctor not found');
    }
    return await Appointment.find({ doctor: doctor._id }).populate(['doctor', 'patient']);
}

export const getAppointmentsByPatient = async (patientId: string) => {
    return await Appointment.find({ patient: patientId }).populate('doctor').populate('patient');
}   

export const cancelAppointment = async (appointmentId: string,patientId:string) => {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        throw new Error('Appointment not found');
    }    
    
      // ownership check
    if (appointment.patient.toString() !== patientId) {
        throw new Error('You can only cancel your own appointments');
    }
    appointment.status = AppointmentStatus.Cancelled;
    await appointment.save();
    return appointment;
}