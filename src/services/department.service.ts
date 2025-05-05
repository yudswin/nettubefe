import { Department } from "../types/department"
import client from './http/client';
import { SuccessResponse, ErrorResponse } from '../types/response';
import axios from "axios";

export type DepartmentListResponse = SuccessResponse<Department[]> | ErrorResponse;
export type DepartmentResponse = SuccessResponse<Department> | ErrorResponse;

export const DepartmentService = {
    getDepartmentList: async (): Promise<DepartmentListResponse> => {
        try {
            const response = await client.get('/department/list');
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    createDepartment: async (data: Omit<Department, '_id'>): Promise<DepartmentResponse> => {
        try {
            const response = await client.post('/department', data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    updateDepartment: async (id: string, data: Partial<Department>): Promise<DepartmentResponse> => {
        try {
            const response = await client.patch(`/department/${id}`, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
    deleteDepartment: async (id: string): Promise<DepartmentResponse> => {
        try {
            const response = await client.delete(`/department/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    }
}