export declare class ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
export declare class PaginatedResponse<T> extends ApiResponse<T[]> {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}
