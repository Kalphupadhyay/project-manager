

class ApiResponse<T> {
    data: T;
    message: string;
    statusCode: number;
    success: boolean;
    constructor(data: T, message: string = 'Success',statusCode: number) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
        this.success = statusCode >= 200 && statusCode < 300;
    }
}

export {
    ApiResponse
}