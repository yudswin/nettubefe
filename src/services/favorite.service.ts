import axios from 'axios';
import client from './http/client';
import { SuccessResponse, ErrorResponse } from '../types/response';
import { Content } from '../types/content';

export interface Favorite {
    userId: string;
    contentId: string;
    content: Content;
}

export type FavoriteListResponse = SuccessResponse<Favorite[]> | ErrorResponse;
export type FavoriteResponse = SuccessResponse<Favorite> | ErrorResponse;

export const FavoriteService = {
    createFavorite: async (favoriteData: Omit<Favorite, 'content'>): Promise<FavoriteResponse> => {
        try {
            const response = await client.post('/api/user/favorite/create', favoriteData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    getFavorite: async (userId: string, contentId: string): Promise<FavoriteResponse> => {
        try {
            const response = await client.get(`/api/user/favorite/${userId}/content/${contentId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    getUserFavorites: async (userId: string): Promise<FavoriteListResponse> => {
        try {
            const response = await client.get(`/api/user/favorite/${userId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    getContentFavorites: async (contentId: string): Promise<FavoriteListResponse> => {
        try {
            const response = await client.get(`/api/user/favorite/content/${contentId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    deleteFavorite: async (userId: string, contentId: string): Promise<FavoriteResponse> => {
        try {
            const response = await client.delete(`/api/user/favorite/${userId}/content/${contentId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    }
};