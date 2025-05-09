import axios from "axios";
import { SuccessResponse, ErrorResponse } from "../types/response";
import { Director } from "../types/director";
import client from './http/client';

export type DirectorListResponse = SuccessResponse<Director[]> | ErrorResponse;
export type DirectorResponse = SuccessResponse<Director> | ErrorResponse;

export const DirectorService = {
    getAllDirectorByContent: async (contentId: string): Promise<DirectorListResponse> => {
        try {
            const response = await client.get(`/content/director/${contentId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    addDirectorToContent: async (
        contentId: string,
        directors: Omit<Director, 'contentId'>[]
    ): Promise<DirectorResponse> => {
        try {
            const response = await client.post(`/content/director/${contentId}`, {
                directors: directors.map(director => ({
                    ...director,
                    contentId
                }))
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    removeDirectorFromContent: async (
        contentId: string,
        personIds: string[]
    ): Promise<DirectorResponse> => {
        try {
            const response = await client.delete(`/content/director/${contentId}`, {
                data: { personIds: personIds }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    }
}