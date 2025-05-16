import axios from 'axios';
import client from './http/client';
import { SuccessResponse, ErrorResponse } from '../types/response';
import { Collection } from '../types/collection';
import { ContentListResponse } from './content.service';

interface Count {
    total: number
}

export type CollectionListResponse = SuccessResponse<Collection[]> | ErrorResponse;
export type CollectionResponse = SuccessResponse<Collection> | ErrorResponse;
export type CountResponse = SuccessResponse<Count> | ErrorResponse;


export const CollectionService = {
    getCollectionList: async (): Promise<CollectionListResponse> => {
        try {
            const response = await client.get('/collection/list');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    getCollectionListWithoutFeatures: async (): Promise<CollectionListResponse> => {
        try {
            const response = await client.get('/collection/all');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    getTotal: async (): Promise<CountResponse> => {
        try {
            const response = await client.get('/collection/total');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    getHotCollections: async (): Promise<CollectionListResponse> => {
        try {
            const response = await client.get('/collection/list')
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    createCollection: async (data: Omit<Collection, '_id'>): Promise<CollectionResponse> => {
        try {
            const response = await client.post('/collection', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    updateCollection: async (id: string, data: Partial<Collection>): Promise<CollectionResponse> => {
        try {
            const response = await client.patch(`/collection/${id}`, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    deleteCollection: async (id: string): Promise<CollectionResponse> => {
        try {
            const response = await client.delete(`/collection/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    getCollectionContentById: async (collectionId: string, limit?: number): Promise<ContentListResponse> => {
        try {
            const response = await client.get(`/collection/${collectionId}/contents`, {
                data: { limit: limit }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },


    getHeadlineCollection: async (): Promise<CollectionResponse> => {
        try {
            const response = await client.get(`/collection/headline`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    getHeadlineCollectionContentById: async (collectionId: string): Promise<ContentListResponse> => {
        try {
            const response = await client.get(`/collection/${collectionId}/contents`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    searchCollections: async (query: string): Promise<CollectionListResponse> => { // WIP
        try {
            const response = await client.get('/collection/search', {
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

    addContentToCollection: async (collectionId: string, contentId: string): Promise<CollectionResponse> => {
        try {
            const response = await client.post(`/collection/${collectionId}/content/${contentId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    updateContentRankInCollection: async (collectionId: string, contentId: string, rank: number): Promise<CollectionResponse> => {
        try {
            console.log('sefirst')
            const response = await client.put(`/collection/${collectionId}/content/${contentId}/rank`, {
                rank: rank
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    removeContentFromCollection: async (collectionId: string, contentId: string): Promise<CollectionResponse> => {
        try {
            const response = await client.delete(`/collection/${collectionId}/content/${contentId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    getCollectionBySlug: async (slug: string): Promise<CollectionResponse> => {
        try {
            const response = await client.get(`/collection/slug/${slug}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    getTopicCollectionContents: async (): Promise<ContentListResponse> => {
        try {
            const response = await client.get(`/collection/content/topic`, {
                data: {
                    limitContents: 4,
                    limitCollections: 4
                }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
};