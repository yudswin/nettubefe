import axios from 'axios';
import client from './http/client';
import { SuccessResponse, ErrorResponse } from '../types/response';
import { Content } from '../types/content';
import { Cast } from '../types/cast';
import { Director } from '../types/director';


export type ContentListResponse = SuccessResponse<Content[]> | ErrorResponse;
export type ContentResponse = SuccessResponse<Content> | ErrorResponse;

export interface BrowseContent {
    results: Content[];
    pagination: {
        page: number,
        limit: number,
        totalItems: number,
        totalPages: number
    }
}

export interface BrowseParams {
    years?: string;
    type?: string;
    status?: string;
    genreSlugs?: string;
    countrySlugs?: string;
    page?: number;
    limit?: number;
}

export type BrowseResponse = SuccessResponse<BrowseContent> | ErrorResponse;


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
    createContent: async (data: Omit<Content, '_id'>): Promise<ContentResponse> => {
        try {
            const response = await client.post('/content', data);
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
    searchContent: async (query: string): Promise<ContentListResponse> => {
        try {
            const response = await client.get('/content/v1/search', {
                params: { q: query }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    getContentById: async (contentId: string): Promise<ContentResponse> => {
        try {
            const response = await client.get(`/content/${contentId}`)
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    getContentByPerson: async (personId: string): Promise<ContentListResponse> => {
        try {
            const [castResponse, directorResponse] = await Promise.all([
                client.get<SuccessResponse<Cast[]> | ErrorResponse>(`/content/cast/v1/${personId}`),
                client.get<SuccessResponse<Director[]> | ErrorResponse>(`/content/director/v1/${personId}`)
            ]);

            if (castResponse.data.status === 'failed') return castResponse.data;
            if (directorResponse.data.status === 'failed') return directorResponse.data;

            const castContentIds = (castResponse.data.result || []).map(cast => cast.contentId);
            const directorContentIds = (directorResponse.data.result || []).map(director => director.contentId);
            const uniqueContentIds = [...new Set([...castContentIds, ...directorContentIds])];

            if (uniqueContentIds.length === 0) {
                return {
                    status: 'success',
                    msg: "No content found for this person",
                    result: []
                };
            }

            const contentPromises = uniqueContentIds.map(contentId =>
                client.get<SuccessResponse<Content> | ErrorResponse>(`/content/${contentId}`)
            );
            const contentResponses = await Promise.all(contentPromises);
            const failedResponse = contentResponses.find(response =>
                response.data.status === 'failed'
            );
            if (failedResponse) return failedResponse.data as ErrorResponse;
            const contents = contentResponses.map(response =>
                (response.data as SuccessResponse<Content>).result
            );

            return {
                status: 'success',
                msg: "Content retrieved successfully",
                result: contents
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            return {
                status: 'failed',
                msg: 'Unknown error occurred',
                error: 'Internal server error'
            };
        }
    },
    getBrowseContent: async (params: BrowseParams): Promise<BrowseResponse> => {
        try {
            const response = await client.get('/content/v1/browse', { params });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            return {
                status: 'failed',
                msg: 'Unknown error occurred',
                error: 'Internal server error'
            };
        }
    }
};