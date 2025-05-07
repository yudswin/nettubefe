import client from './http/client';
import { SuccessResponse, ErrorResponse } from '../types/response';
import axios from "axios";

export type StreamResponse = SuccessResponse<{ hls: string }> | ErrorResponse;

export const StreamingService = {
    getStream: async (mediaId: string): Promise<StreamResponse> => {
        try {
            const response = await client.get(`/v1/watch/${mediaId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    }
}