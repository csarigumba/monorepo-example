export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  nextToken?: string;
  count: number;
}

export interface DatabaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface LambdaContext {
  requestId: string;
  functionName: string;
  functionVersion: string;
  memoryLimitInMB: string;
  timeRemainingInMillis: number;
}