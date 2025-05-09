import axios from 'axios';
import client from './http/client';
import { Person } from '../types/person';
import { SuccessResponse, ErrorResponse } from '../types/response';


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

    createPerson: async (data: Omit<Person, '_id'>): Promise<PersonResponse> => {
        try {
            const response = await client.post('/person', data);
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
    },

    searchPerson: async (query: string): Promise<PersonListResponse> => {
        try {
            const response = await client.get('/person/v1/search', {
                params: { q: query }
            })
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    getPersonById: async (personId: string): Promise<PersonResponse> => {
        try {
            const response = await client.get(`/person/${personId}`)
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
};
