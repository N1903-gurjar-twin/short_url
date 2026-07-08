import {
  ShortenedUrl,
  DetailedAnalytics,
  CreateUrlRequest,
  CreateUrlResponse,
  ApiError,
  SignupRequest,
  LoginRequest,
  AuthResponse,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = {
      message: `API Error: ${response.statusText}`,
      status: response.status,
    }
    throw error
  }
  return response.json()
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Auth endpoints
export async function signup(request: SignupRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
  return handleResponse<AuthResponse>(response)
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
  return handleResponse<AuthResponse>(response)
}

// URL endpoints
export async function createShortUrl(request: CreateUrlRequest): Promise<CreateUrlResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/url/shorten`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  })
  return handleResponse<CreateUrlResponse>(response)
}

export async function getDetailedAnalytics(shortCode: string): Promise<DetailedAnalytics> {
  const response = await fetch(`${API_BASE_URL}/analytics/${shortCode}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse<DetailedAnalytics>(response)
}

export async function getMyUrls(): Promise<ShortenedUrl[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/analytics/my`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  return handleResponse<ShortenedUrl[]>(response)
}
