import axios from 'axios';
import client from './http/client';
import { SuccessResponse, ErrorResponse } from '../types/response';
import { Content } from '../types/content';
import { Media } from '../types/media';

export interface History {
    userId: string;
    mediaId: string;
    timestamp: string;
    progress?: number;
    completed?: boolean;
    content: Content
    media: Media
}

export type HistoryListResponse = SuccessResponse<History[]> | ErrorResponse;
export type HistoryResponse = SuccessResponse<History> | ErrorResponse;

export const HistoryService = {
    createHistory: async (historyData: Omit<History, 'timestamp'>): Promise<HistoryResponse> => {
        try {
            const response = await client.post('/api/user/history/create', historyData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    getHistoryEntry: async (userId: string, mediaId: string): Promise<HistoryResponse> => {
        try {
            const response = await client.get(`/api/user/history/${userId}/media/${mediaId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    getUserHistory: async (userId: string): Promise<HistoryListResponse> => {
        try {
            const response = await client.get(`/api/user/history/${userId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    getMediaHistory: async (mediaId: string): Promise<HistoryListResponse> => {
        try {
            const response = await client.get(`/api/user/history/media/${mediaId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    updateHistory: async (userId: string, mediaId: string, updateData: Partial<History>): Promise<HistoryResponse> => {
        try {
            const response = await client.patch(`/api/user/history/${userId}/media/${mediaId}`, updateData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    deleteHistory: async (userId: string, mediaId: string): Promise<HistoryResponse> => {
        try {
            const response = await client.delete(`/api/user/history/${userId}/media/${mediaId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    }
};