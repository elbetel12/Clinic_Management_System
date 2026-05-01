import { Request, Response } from 'express';
import { createDoctor } from './doctor.service';
import { getDoctors } from './doctor.service';

export const createDoctorHandler = async (req: Request, res: Response) => {
  try {
    const doctor = await createDoctor(req.body);
    return res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error',
    });
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