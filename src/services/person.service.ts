import axios from 'axios';
import client from './http/client';

interface SuccessResponse<T> {
    status: 'success';
    msg: string;
    result: T;
}

interface ErrorResponse {
    status: 'failed';
    msg: string;
    error: string;
    details?: {
        error: string;
        details: string;
    };
}

export interface Person {
    _id: string;
    name: string;
    slug: string;
    profilePath?: string;
}

export type PersonListResponse = SuccessResponse<Person[]> | ErrorResponse;
export type PersonResponse = SuccessResponse<Person> | ErrorResponse;

export const PersonService = {
    getPersonList: async (): Promise<PersonListResponse> => {
        try {
            const response = await client.get('/person/list');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    updatePerson: async (id: string, data: Partial<Person>): Promise<PersonResponse> => {
        try {
            const response = await client.patch(`/person/${id}`, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    deletePerson: async (id: string): Promise<PersonResponse> => {
        try {
            const response = await client.delete(`/person/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    }
};
