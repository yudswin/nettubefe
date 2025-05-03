import axios from 'axios';
import client from './http/client';

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterForm {
    email: string;
    name: string,
    password: string;
}

interface SuccessResponse {
    status: 'success';
    msg: string;
    error?: string,
    details: {
        accessToken: string;
        refreshToken: string;
    };
}

interface SuccessInfoResponse {
    status: 'success';
    msg: string;
    result: {
        user: {
            name: string;
            email: string;
            avatarId: string | null;
            token: string;
            roles: string;
            gender: string;
            isVerified: boolean;
            isActive: boolean;
            imgs: any | null;
        };
    };
}

interface ErrorResponse {
    status: 'failed';
    msg: string;
    error: string,
    details: {
        error: string;
        details: string;
    };
}

export type Response = SuccessResponse | ErrorResponse;
export type RegisterResponse = SuccessResponse | ErrorResponse;
export type InfoResponse = SuccessInfoResponse | ErrorResponse

export const AuthService = {
    login: async (credentials: LoginCredentials): Promise<Response> => {
        try {
            const response = await client.post('/user/auth/login', credentials);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    register: async (formData: RegisterForm): Promise<Response> => {
        try {
            const response = await client.post('/user/auth/register', formData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    info: async (): Promise<InfoResponse> => {
        try {
            const response = await client.get('/user/me');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    }
};


