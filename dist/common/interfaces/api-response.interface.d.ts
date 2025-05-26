export declare class ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}
