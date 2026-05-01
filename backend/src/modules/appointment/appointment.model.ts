import mongoose from 'mongoose';
import { AppointmentStatus } from './appointment.types';

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: AppointmentStatus,
        default: 'booked'
    }
},{
    timestamps:true
    }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;