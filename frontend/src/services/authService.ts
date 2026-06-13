import api from './api';
import { LoginInput, RegisterInput, LoginResponse, RegisterResponse } from '../types';

export const register = async (data: RegisterInput): Promise<RegisterResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
}

export const login = async (data: LoginInput): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
}
