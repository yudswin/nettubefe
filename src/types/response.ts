export interface SuccessResponse<T> {
    status: 'success';
    msg: string;
    result: T;
}

export interface ErrorResponse {
    status: 'failed';
    msg: string;
    error: string;
    details?: {
        error: string;
        details: string;
    };
}
