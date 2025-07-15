import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '@company/types';

export const generateId = (): string => uuidv4();

export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: string,
  message?: string
): ApiResponse<T> => ({
  success,
  data,
  error,
  message,
});

export const createSuccessResponse = <T>(data: T, message?: string): ApiResponse<T> =>
  createApiResponse(true, data, undefined, message);

export const createErrorResponse = (error: string, message?: string): ApiResponse =>
  createApiResponse(false, undefined, error, message);

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const isValidUuid = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const parseJson = <T>(jsonString: string): T | null => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};