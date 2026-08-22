export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export const successResponse = <T>(data: T): ApiResponse<T> => {
  return {
    success: true,
    data,
  };
};

export const errorResponse = (code: string, message: string): ApiResponse => {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
};
