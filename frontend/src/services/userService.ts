import api from './api';
import { User } from '../types';

export const getMe = async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data.data;
};

export const updateMe = async (data: Partial<User>): Promise<User> => {
    const response = await api.patch('/users/me', data);
    return response.data.data;
};
