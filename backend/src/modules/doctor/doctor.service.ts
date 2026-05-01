import Doctor from './doctor.model';
import { CreateDoctorInput } from './doctor.types';

export const createDoctor = async (doctorData: CreateDoctorInput) => {
    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();
    return newDoctor;
}

export const getDoctors = async () => {
    return await Doctor.find();
}