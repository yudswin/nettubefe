import { Genre } from "../types/genre"
import client from './http/client';
import { SuccessResponse, ErrorResponse } from '../types/response';
import axios from "axios";

export type GenreListResponse = SuccessResponse<Genre[]> | ErrorResponse;
export type GenreResponse = SuccessResponse<Genre> | ErrorResponse;

export const GenreService = {
    getGenreList: async (): Promise<GenreListResponse> => {
        try {
            const response = await client.get('/content/genre/list');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    createGenre: async (data: Omit<Genre, '_id'>): Promise<GenreResponse> => {
        try {
            const response = await client.post('/content/genre', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    updateGenre: async (id: string, data: Partial<Genre>): Promise<GenreResponse> => {
        try {
            const response = await client.patch(`/content/genre/${id}`, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    deleteGenre: async (id: string): Promise<GenreResponse> => {
        try {
            const response = await client.delete(`/content/genre/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    }
}