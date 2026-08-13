import { CreateAppointmentInput } from "./appointment.types"
import Appointment from "./appointment.model"
import Doctor from "../doctor/doctor.model";
import { AppointmentStatus } from "./appointment.types";
import Notification from "../notification/notification.model";
import { app, connectedUsers,io } from "../../app";
import { AppError } from "../../utils/appError";

   const VALID_STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
    [AppointmentStatus.Booked]: [AppointmentStatus.Cancelled, AppointmentStatus.Completed],
    [AppointmentStatus.Cancelled]: [],
    [AppointmentStatus.Completed]: []
};

export const createAppointment = async (appointmentData: CreateAppointmentInput) => {
    const { doctorId, date, time, patientId } = appointmentData;
    // 1. Validate required fields
    if (!doctorId || !patientId || !date || !time) {
        throw new AppError('All fields are required', 400);
    }
    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId).select('user name');
    if (!doctor) {
        throw new AppError('Doctor not found', 404);
    }

    const doctorUserId = doctor.user.toString();

    // 3. Check if slot is already taken (CORE RULE: no double booking)
    const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        date: date,
        time: time,
        status: AppointmentStatus.Booked
    });

    if (existingAppointment) {
        throw new AppError('This time slot is already booked for the doctor', 400);
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

    const formattedDate = new Date(date).toLocaleDateString();

    // 1. Create notification in DB for doctor
    const notification = new Notification({
        user: doctorUserId,
        type: 'info',
        title: 'New Appointment Booked',
        message: `A patient has booked an appointment for ${formattedDate} at ${time}`,
        isRead: false
    });
    await notification.save();

    // 2. If Doctor is online, emit real-time event
    const doctorSocketId = connectedUsers.get(doctorUserId);
    if (doctorSocketId) {
        io.to(doctorSocketId).emit('new_notification', {
            id: notification._id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            time: 'just now',
            isRead: false
        });
    } else {
        console.log(`Doctor (User ID: ${doctorUserId}) is currently offline.`);
    }

    return newAppointment;
}

export const getAppointments = async () => {
    return await Appointment.find().populate(['doctor', 'patient']);
}   

export const getAppointmentsByDoctor = async (userId: string) => {
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
        throw new AppError('Doctor not found', 404);
    }
    return await Appointment.find({ doctor: doctor._id }).populate(['doctor', 'patient']);
}

export const getAppointmentsByPatient = async (patientId: string) => {
    return await Appointment.find({ patient: patientId }).populate('doctor').populate('patient');
}   

export const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus, requestingUser: { id: string; role: string }) => {
    const appointment = await Appointment.findById(appointmentId).populate('patient').populate('doctor');

    if (!appointment) {
        throw new AppError('Appointment not found', 404);
    }

    const patientObj: any = appointment.patient;
    const doctorObj: any = appointment.doctor;
    const patientUserId = patientObj._id ? patientObj._id.toString() : patientObj.toString();
    const doctorDocId = doctorObj._id ? doctorObj._id.toString() : doctorObj.toString();
    const doctorUserId = doctorObj?.user ? doctorObj.user.toString() : null;

    let doctor = null;
    if (requestingUser.role === 'doctor') {
        doctor = await Doctor.findOne({ user: requestingUser.id });
    }

    const isAuthorized =
        (requestingUser.role === 'patient' && requestingUser.id === patientUserId && status === AppointmentStatus.Cancelled) ||
        (requestingUser.role === 'doctor' && doctor?._id.toString() === doctorDocId) ||
        requestingUser.role === 'admin';

    if (!isAuthorized) {
        throw new AppError('You are not authorized to update this appointment', 403);
    }

    if (!VALID_STATUS_TRANSITIONS[appointment.status].includes(status)) {
        throw new AppError(`Invalid status transition from ${appointment.status} to ${status}`, 400);
    }

    appointment.status = status;
    await appointment.save();

    const formattedDate = appointment.date ? new Date(appointment.date).toLocaleDateString() : '';
    const doctorName = doctorObj?.name ? `Dr. ${doctorObj.name}` : 'Doctor';
    const patientName = patientObj?.name || 'Patient';

    // Determine notification targets
    const notificationTargets: { userId: string; title: string; message: string; type: 'success' | 'warning' | 'info' | 'error' }[] = [];

    if (requestingUser.role === 'patient') {
        if (doctorUserId) {
            notificationTargets.push({
                userId: doctorUserId,
                title: 'Appointment Cancelled',
                message: `${patientName} cancelled the appointment scheduled for ${formattedDate} at ${appointment.time}.`,
                type: 'warning'
            });
        }
    } else if (requestingUser.role === 'doctor') {
        notificationTargets.push({
            userId: patientUserId,
            title: `Appointment ${status === AppointmentStatus.Completed ? 'Completed' : 'Cancelled'}`,
            message: `${doctorName} marked your appointment on ${formattedDate} at ${appointment.time} as ${status}.`,
            type: status === AppointmentStatus.Completed ? 'success' : 'warning'
        });
    } else {
        // Admin updated status
        notificationTargets.push({
            userId: patientUserId,
            title: `Appointment ${status === AppointmentStatus.Completed ? 'Completed' : 'Cancelled'}`,
            message: `Your appointment on ${formattedDate} at ${appointment.time} has been ${status} by admin.`,
            type: status === AppointmentStatus.Completed ? 'success' : 'warning'
        });
        if (doctorUserId) {
            notificationTargets.push({
                userId: doctorUserId,
                title: `Appointment ${status === AppointmentStatus.Completed ? 'Completed' : 'Cancelled'}`,
                message: `Appointment for ${patientName} on ${formattedDate} at ${appointment.time} has been ${status} by admin.`,
                type: status === AppointmentStatus.Completed ? 'success' : 'warning'
            });
        }
    }

    for (const target of notificationTargets) {
        const notification = new Notification({
            user: target.userId,
            type: target.type,
            title: target.title,
            message: target.message,
            isRead: false
        });
        await notification.save();

        const socketId = connectedUsers.get(target.userId);
        if (socketId) {
            io.to(socketId).emit('new_notification', {
                id: notification._id,
                title: notification.title,
                message: notification.message,
                type: notification.type,
                time: 'just now',
                isRead: false
            });
        }
    }

    return appointment;
};