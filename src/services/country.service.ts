import { Country } from "../types/country"
import client from './http/client';
import { SuccessResponse, ErrorResponse } from '../types/response';
import axios from "axios";

export type CountryListResponse = SuccessResponse<Country[]> | ErrorResponse;
export type CountryResponse = SuccessResponse<Country> | ErrorResponse;

export const CountryService = {
    getCountryList: async (): Promise<CountryListResponse> => {
        try {
            const response = await client.get('/content/country/list');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    createCountry: async (data: Omit<Country, '_id'>): Promise<CountryResponse> => {
        try {
            const response = await client.post('/content/country', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    updateCountry: async (id: string, data: Partial<Country>): Promise<CountryResponse> => {
        try {
            const response = await client.patch(`/content/country/${id}`, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    deleteCountry: async (id: string): Promise<CountryResponse> => {
        try {
            const response = await client.delete(`/content/country/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    }
}