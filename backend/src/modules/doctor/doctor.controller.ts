import { Request, Response } from 'express';
import { createDoctorByAdmin, getDoctors, updateDoctorProfile } from './doctor.service';
import { AppError } from '../../utils/appError';

export const createDoctorHandler = async (req: Request, res: Response) => {
  try {
    const { name, email, specialization, password } = req.body;
    const result = await createDoctorByAdmin({ name, email, specialization, password });
    
    return res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: result.doctor,
      tempPassword: result.tempPassword // Admin can give this to the doctor
    });
  } catch (error: unknown) {
    if(error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
    }
    else {
        res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const getDoctorsHandler = async (req: Request, res: Response) => {
  try {
    const doctors = await getDoctors();
    return res.status(200).json({
      success: true,
      data: doctors,
    });
  }
    catch (error: unknown) {
    return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
    });
    }
};

export const updateDoctorProfileHandler = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { bio, experience, specialization, name } = req.body;
    
    const updatedDoctor = await updateDoctorProfile(userId, { bio, experience, specialization, name });
    
    if (!updatedDoctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedDoctor
    });
  } catch (error: unknown) {
        if(error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
  }
};