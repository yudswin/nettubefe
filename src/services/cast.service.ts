import axios from "axios";
import { SuccessResponse, ErrorResponse } from "../types/response";
import { Cast } from "../types/cast";
import client from './http/client';

export type CastListResponse = SuccessResponse<Cast[]> | ErrorResponse;
export type CastResponse = SuccessResponse<Cast> | ErrorResponse;

export const CastService = {
    getAllCastByContent: async (contentId: string): Promise<CastListResponse> => {
        try {
            const response = await client.get(`/content/cast/${contentId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    addCastToContent: async (
        contentId: string,
        castMembers: Omit<Cast, 'contentId'>[]
    ): Promise<CastResponse> => {
        try {
            const response = await client.post(`/content/cast/${contentId}`, {
                castMembers: castMembers.map(cast => ({
                    ...cast,
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
    removeCastFromContent: async (
        contentId: string,
        personIds: string[]
    ): Promise<CastResponse> => {
        try {
            const response = await client.delete(`/content/cast/${contentId}`, {
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