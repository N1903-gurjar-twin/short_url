export interface ShortenedUrl {
  shortUrl: string
  originalUrl: string
  createdAt: string
  expiryDate: string
  clickCount: number
}

export interface DetailedAnalytics {
  shortCode: string
  originalUrl: string
  shortUrl: string
  createdAt: string
  expiryDate: string
  totalClicks: number
  browserStats: Record<string, number>
  countryStats: Record<string, number>
  referrerStats: Record<string, number>
  dailyClicks: Array<{ date: string; clicks: number }>
}

export interface CreateUrlRequest {
  originalUrl: string
  expiryDate: string
  customCode?: string
}

export interface CreateUrlResponse {
  shortCode: string
  originalUrl: string
  shortUrl: string
}

export interface ApiError {
  message: string
  status: number
}

// Utility types for charts
export interface ChartDataPoint {
  name: string
  value: number
}

export interface DailyClickData {
  date: string
  clicks: number
}

// Auth types
export interface SignupRequest {
  fullName: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  type: string
  email: string
  fullName: string
}

export interface User {
  id?: string
  email: string
  fullName?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  signup: (data: SignupRequest) => Promise<void>
  login: (data: LoginRequest) => Promise<void>
  logout: () => void
}
