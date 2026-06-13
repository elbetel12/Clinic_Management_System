import api from './api';
import { Doctor, CreateDoctorInput } from '../types';

export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get('/doctors');
  return response.data.data;
};

export const createDoctor = async (data: CreateDoctorInput): Promise<Doctor> => {
  const response = await api.post('/doctors', data);
  return response.data.data;
};

export const updateDoctorProfile = async (data: Partial<Doctor>): Promise<Doctor> => {
  const response = await api.patch('/doctors/profile', data);
  return response.data.data;
};
