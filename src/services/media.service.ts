import { SuccessResponse } from "../types/response";
import { Media } from "../types/media";
import { ErrorResponse } from "react-router-dom";
import axios from "axios";
import client from './http/client';

export type MediaListResponse = SuccessResponse<Media[]> | ErrorResponse;
export type MediaResponse = SuccessResponse<Media> | ErrorResponse;

export const MediaService = {
    getMediaList: async (contentId: string): Promise<MediaListResponse> => {
        try {
            const response = await client.get(`/api/media/${contentId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    updateMedia: async (mediaId: string, data: Partial<Media>): Promise<MediaResponse> => {
        try {
            const response = await client.put(`/api/media/update/${mediaId}`, data)
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    deleteMedia: async (mediaId: string): Promise<MediaResponse> => {
        try {
            const response = await client.delete(`/api/media/delete/${mediaId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    uploadMedia: async (contentId: string, file: File): Promise<MediaResponse> => {
        try {
            const formData = new FormData();
            formData.append('video', file);
            
            const response = await client.post(`/api/media/upload/${contentId}`, formData, {
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
    }
}