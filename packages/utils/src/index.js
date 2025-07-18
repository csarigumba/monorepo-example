import { v4 as uuidv4 } from 'uuid';

export const generateId = () => uuidv4();

export const createApiResponse = (
  success,
  data,
  error,
  message
) => ({
  success,
  data,
  error,
  message,
});

export const createSuccessResponse = (data, message) =>
  createApiResponse(true, data, undefined, message);

export const createErrorResponse = (error, message) =>
  createApiResponse(false, undefined, error, message);

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const isValidUuid = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const parseJson = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};