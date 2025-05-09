import axios from "axios";
import { SuccessResponse, ErrorResponse } from "../../types/response";
import client from '../http/client';

export interface PersonDepartment {
    personId: string,
    departmentId: string
}

export interface Departments {
    departmentId: string;
    departmentName: string;
}

export type DepartmentResponse = SuccessResponse<Departments[]> | ErrorResponse;
export type PersonDeptListResponse = SuccessResponse<PersonDepartment[]> | ErrorResponse;
export type PersonDeptResponse = SuccessResponse<PersonDepartment> | ErrorResponse;

export const PersonDepartmentService = {
    getDepartmentList: async (personId: string): Promise<DepartmentResponse> => {
        try {
            const response = await client.get(`/person/${personId}/departments`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    addDepartmentsToPerson: async (
        personId: string,
        departmentIds: string[]
    ): Promise<PersonDeptResponse> => {
        try {
            const response = await client.post(`/person/${personId}/departments`, {
                departmentIds: departmentIds,
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },

    removeDepartmentsFromPerson: async (
        personId: string,
        departmentIds: string[]
    ): Promise<PersonDeptResponse> => {
        try {
            const response = await client.delete(`/person/${personId}/departments`, {
                data: { departmentIds: departmentIds },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) return error.response.data as ErrorResponse;
            }
            throw new Error('Unknown error occurred');
        }
    },
}