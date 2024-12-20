export interface ApiResponse<T> {
    success: boolean;
    data: T;
    status: number;
    message: string;
  }