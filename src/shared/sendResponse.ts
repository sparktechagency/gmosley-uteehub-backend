import { Response } from 'express';

type IApiResponse<T> = {
  statusCode: number;
  status: string;
  message?: string | null;
  meta?: {
    currentPage: number;
    limit: number;
    totalPage: number;
    totalData: number;
  };
  data?: T | null;
};

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
  const responseData: IApiResponse<T> = {
    statusCode: data.statusCode,
    status: data.status,
    message: data.message || null,
    meta: data.meta || null || undefined,
    data: data.data || null || undefined,
  };
  res.status(data.statusCode).json(responseData);
};

export default sendResponse;
