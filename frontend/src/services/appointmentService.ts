import api from './api';
import { Appointment, CreateAppointmentInput } from '../types';

export const createAppointment = async (data: CreateAppointmentInput) => {
  const response = await api.post('/appointments', data);
  return response.data;
};

export const getAllAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get('/appointments');
  return response.data;
};

export const getAppointmentsByDoctor = async (doctorId: string): Promise<Appointment[]> => {
  const response = await api.get(`/appointments/doctor/${doctorId}`);
  return response.data;
};

export const getAppointmentsByPatient = async (patientId: string): Promise<Appointment[]> => {
  const response = await api.get(`/appointments/patient/${patientId}`);
  return response.data;
};
