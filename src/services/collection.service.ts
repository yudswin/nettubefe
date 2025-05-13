import axios from 'axios';
import client from './http/client';
import { SuccessResponse, ErrorResponse } from '../types/response';
import { Collection } from '../types/collection';

export type CollectionListResponse = SuccessResponse<Collection[]> | ErrorResponse;
export type CollectionResponse = SuccessResponse<Collection> | ErrorResponse;

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
    
    getCollectionById: async (collectionId: string): Promise<CollectionResponse> => {
        try {
            const response = await client.get(`/collection/${collectionId}`);
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
    }
};