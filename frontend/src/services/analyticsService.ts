import api from './api';
import { AnalyticsData } from '../hooks/useAnalytics';

export const getFullAnalytics = async (): Promise<AnalyticsData> => {
  const response = await api.get('/analytics');
  return response.data.data;
};

export const getSummary = async () => {
  const response = await api.get('/analytics/summary');
  return response.data.data;
};

export const getWeeklyAppointments = async () => {
  const response = await api.get('/analytics/weekly-appointments');
  return response.data.data;
};

export const getPatientGrowth = async () => {
  const response = await api.get('/analytics/patient-growth');
  return response.data.data;
};

export const getSpecializations = async () => {
  const response = await api.get('/analytics/specializations');
  return response.data.data;
};
