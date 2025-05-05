import axios from 'axios';
import client from './http/client';
import { SuccessResponse, ErrorResponse } from '../types/response';
import { Content } from '../types/content';

export type ContentListResponse = SuccessResponse<Content[]> | ErrorResponse;
export type ContentResponse = SuccessResponse<Content> | ErrorResponse;


export const ContentService = {
    getContentList: async (): Promise<ContentListResponse> => {
        try {
            const response = await client.get('/content/list');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    updateContent: async (id: string, data: Partial<Content>): Promise<ContentResponse> => {
        try {
            const response = await client.patch(`/content/${id}`, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    deleteContent: async (id: string): Promise<ContentResponse> => {
        try {
            const response = await client.delete(`/content/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
};