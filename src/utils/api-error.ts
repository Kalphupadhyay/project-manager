class ApiError<T> extends Error {
  statusCode: number;
  data: T | null;
  success: boolean;
  constructor(
    statusCode: number,
    message: string = "something went wrong",
    errors: any[] = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
