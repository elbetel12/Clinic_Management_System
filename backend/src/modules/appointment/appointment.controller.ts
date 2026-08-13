import { Request, Response } from 'express';
import { createAppointment,getAppointments,getAppointmentsByDoctor,getAppointmentsByPatient,updateAppointmentStatus } from './appointment.service';
import { AppointmentStatus } from './appointment.types';
import { AppError } from '../../utils/appError';

export const createAppointmentHandler = async (req:Request,res:Response) => {
    try{
        const appointment = await createAppointment({
            doctorId:req.body.doctorId,
            patientId:req.user?.userId || '',
            date:req.body.date,
            time:req.body.time
        });
        res.status(201).json(appointment);
        
    } catch (error: Error | unknown) {
        if(error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }  
}

export const getAppointmentsHandler = async (req:Request,res:Response) => {
    try {
        const appointments = await getAppointments();
        res.status(200).json(appointments);
    } catch (error: Error | unknown) {
        if(error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export const getAppointmentsByDoctorHandler = async (req:Request,res:Response) => {
    try {
        const doctorId = req.params.doctorId as string;
        const appointments = await getAppointmentsByDoctor(doctorId);
        res.status(200).json(appointments);
    } catch (error: Error | unknown) {
        if(error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export const getAppointmentsByPatientHandler = async (req:Request,res:Response) => {
    try {
        const patientId = req.params.patientId as string;  // Type assertion
        const appointments = await getAppointmentsByPatient(patientId);
        res.status(200).json(appointments);
    } catch (error: Error | unknown) {
              if(error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export const updateAppointmentStatusHandler = async (req: Request, res: Response) => {
    try {

        const appointmentId = req.params.appointmentId as string;
        const status = req.body.status as AppointmentStatus;
        const requestingUser = {
            id: req.user?.userId || '',
            role: req.user?.role || ''
        }
        const updatedAppointment = await updateAppointmentStatus(appointmentId, status, requestingUser);
        res.status(200).json(updatedAppointment);
    }
    catch (error: Error | unknown) {
        if(error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
}   
    }
