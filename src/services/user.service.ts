import axios from 'axios';
import client from './http/client';
import { SuccessResponse, ErrorResponse } from '../types/response';
import { User } from '@contexts/AuthContext';
export type UserResponse = SuccessResponse<User> | ErrorResponse;

export const UserService = {
    updateUserInfo: async (userId: string, data: Partial<User>): Promise<UserResponse> => {
        try {
            const response = await client.put(`api/user/update/${userId}`, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    updateUserPassowrd: async (currentPassword: string, newPassword: string): Promise<UserResponse> => {
        try {
            const response = await client.put(`api/user/auth/update-password/`, {
                currentPassword: currentPassword,
                newPassword: newPassword
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    uploadAvatar: async (file: File): Promise<UserResponse> => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await client.post(`api/user/avatar/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    deleteAvatar: async (): Promise<UserResponse> => {
        try {
            const response = await client.delete(`api/user/avatar/delete`)
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    }
};