import { ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('pcs_token') : null;
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred while communicating with the server.',
    };
  }
}

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return fetchWithAuth<T>(endpoint, { method: 'GET' });
}

export async function apiPost<T>(endpoint: string, body: Record<string, unknown>): Promise<ApiResponse<T>> {
  return fetchWithAuth<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
}

export async function apiPatch<T>(endpoint: string, body: Record<string, unknown>): Promise<ApiResponse<T>> {
  return fetchWithAuth<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
}

export async function apiPut<T>(endpoint: string, body: Record<string, unknown>): Promise<ApiResponse<T>> {
  return fetchWithAuth<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) });
}

export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return fetchWithAuth<T>(endpoint, { method: 'DELETE' });
}
